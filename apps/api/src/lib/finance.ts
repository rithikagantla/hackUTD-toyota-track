export function financeLoan(msrp: number, aprPct: number, termMonths: number, down = 0) {
  const P = Math.max(msrp - down, 0);
  const r = aprPct / 100 / 12;
  if (r === 0) {
    const monthly = P / termMonths;
    return { monthly: round2(monthly), total: round2(monthly * termMonths) };
  }
  const monthly = (P * r) / (1 - Math.pow(1 + r, -termMonths));
  return { monthly: round2(monthly), total: round2(monthly * termMonths) };
}

export function lease(msrp: number, residualPct: number, moneyFactor: number, termMonths: number, down = 0) {
  // Simplified: depreciation + finance charge
  const residual = msrp * residualPct;
  const dep = (msrp - residual - down) / termMonths;
  const financeCharge = (msrp + residual) * moneyFactor;
  const monthly = dep + financeCharge;
  return { monthly: round2(monthly), total: round2(monthly * termMonths + down) };
}

const round2 = (n: number) => Math.round(n * 100) / 100;
