import express from 'express';
import { CountryCode, LinkTokenCreateRequest, Products } from 'plaid';
import { getPlaidClient, isPlaidConfigured } from './plaidClient.js';
import { User } from './models/User.ts';
import { Preference } from './models/Preference.ts';

const router = express.Router();

interface AuthenticatedRequest extends express.Request {
  userId?: string;
}

function getUserId(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  const fallback = req.headers['x-user-id'] || req.ip;
  return typeof fallback === 'string' ? fallback : null;
}

function ensurePlaid(res: express.Response) {
  if (!isPlaidConfigured()) {
    res.status(503).json({
      message: 'Plaid is not configured. Please set PLAID_CLIENT_ID and PLAID_SECRET in your environment.'
    });
    return false;
  }
  return true;
}

router.use((req: AuthenticatedRequest, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ message: 'Authorization header required.' });
  }
  req.userId = userId;
  next();
});

router.post('/create_link_token', async (req: AuthenticatedRequest, res) => {
  if (!ensurePlaid(res)) return;

  const plaid = getPlaidClient();
  if (!plaid) return;

  try {
    const userKey = Buffer.from(req.userId || '').toString('base64').slice(0, 36) || `user-${Date.now()}`;
    const request: LinkTokenCreateRequest = {
      user: { client_user_id: userKey },
      client_name: 'Toyota Nexus',
      products: [Products.Transactions, Products.Liabilities],
      language: 'en',
      redirect_uri: process.env.PLAID_REDIRECT_URI,
      country_codes: [CountryCode.Us]
    };

    const response = await plaid.linkTokenCreate(request);
    res.json({ link_token: response.data.link_token });
  } catch (error: any) {
    console.error('Plaid link token error', error);
    res.status(500).json({ message: error?.response?.data?.error_message || 'Failed to create Plaid link token.' });
  }
});

router.post('/exchange_public_token', async (req: AuthenticatedRequest, res) => {
  if (!ensurePlaid(res)) return;

  const plaid = getPlaidClient();
  if (!plaid) return;

  const { public_token: publicToken } = req.body ?? {};
  if (!publicToken) {
    res.status(400).json({ message: 'public_token is required.' });
    return;
  }

  if (!req.userId) {
    res.status(401).json({ message: 'Authorization header required.' });
    return;
  }

  try {
    const exchange = await plaid.itemPublicTokenExchange({ public_token: publicToken });

    const user = await User.findOneAndUpdate(
      { auth0Id: req.userId },
      {
        auth0Id: req.userId,
        plaidAccessToken: exchange.data.access_token,
        plaidItemId: exchange.data.item_id
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Preference.findOneAndUpdate(
      { user: user._id },
      { user: user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ message: 'Bank account linked successfully', item_id: exchange.data.item_id });
  } catch (error: any) {
    console.error('Plaid exchange error', error);
    res.status(500).json({ message: error?.response?.data?.error_message || 'Failed to exchange public token.' });
  }
});

router.post('/analyze_finances', async (req: AuthenticatedRequest, res) => {
  if (!ensurePlaid(res)) return;

  const plaid = getPlaidClient();
  if (!plaid) return;

  if (!req.userId) {
    res.status(401).json({ message: 'Authorization header required.' });
    return;
  }

  try {
    const user = await User.findOne({ auth0Id: req.userId });
    if (!user?.plaidAccessToken) {
      return res.status(400).json({ message: 'No linked bank account found. Link an account first.' });
    }

    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    const format = (date: Date) => date.toISOString().slice(0, 10);

    const transactionsResponse = await plaid.transactionsGet({
      access_token: user.plaidAccessToken,
      start_date: format(start),
      end_date: format(new Date()),
      options: { count: 100 }
    });

    const transactions = transactionsResponse.data.transactions ?? [];

    const incomeCategories = new Set(['Payroll', 'Salary', 'Income']);
    const autoCategories = new Set(['Auto Lease', 'Auto Insurance', 'Auto Payment']);
    const loanCategories = new Set(['Loan Payments', 'Student Loan']);

    let estimatedMonthlyIncome = 0;
    let existingMonthlyAutoPayment = 0;
    let existingMonthlyOtherLoans = 0;

    for (const txn of transactions) {
      const amount = Math.abs(Number(txn.amount) || 0);
      const categories: string[] = txn.category || [];
      const transactionType = txn.transaction_type || '';

      if (categories.some((c) => incomeCategories.has(c)) || transactionType === 'credit') {
        estimatedMonthlyIncome += amount;
      }

      if (categories.some((c) => autoCategories.has(c))) {
        existingMonthlyAutoPayment += amount;
      } else if (categories.some((c) => loanCategories.has(c))) {
        existingMonthlyOtherLoans += amount;
      }
    }

    const liabilities = await plaid.liabilitiesGet({ access_token: user.plaidAccessToken });
    const creditLiabilities = liabilities.data?.liabilities?.credit ?? [];
    const autoLiabilities = liabilities.data?.liabilities?.auto ?? [];

    const creditCardDebt = creditLiabilities.reduce((sum: number, liability: any) => {
      return sum + Number(liability.current_balance ?? 0);
    }, 0);

    const hasExistingAutoLoan = autoLiabilities.length > 0 || existingMonthlyAutoPayment > 0;

    const totalMonthlyDebt = existingMonthlyAutoPayment + existingMonthlyOtherLoans;
    const debtToIncomeRatio =
      estimatedMonthlyIncome > 0 ? Number(((totalMonthlyDebt / estimatedMonthlyIncome) * 100).toFixed(2)) : null;

    const financialProfile = {
      estimatedMonthlyIncome: estimatedMonthlyIncome || null,
      existingMonthlyAutoPayment: existingMonthlyAutoPayment || null,
      existingMonthlyOtherLoans: existingMonthlyOtherLoans || null,
      totalMonthlyDebt,
      creditCardDebt: creditCardDebt || null,
      hasExistingAutoLoan,
      debtToIncomeRatio,
      analyzedAt: new Date().toISOString()
    };

    await Preference.findOneAndUpdate(
      { user: user._id },
      { user: user._id, financialProfile },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ message: 'Financial analysis completed', financialProfile });
  } catch (error: any) {
    console.error('Plaid analysis error', error);
    res.status(500).json({ message: error?.response?.data?.error_message || 'Failed to analyze finances.' });
  }
});

export default router;


