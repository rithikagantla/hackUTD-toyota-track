🚗 Toyota Nexus

Your Intelligent Vehicle Recommendation Assistant

<div align="center">

An AI-powered web application that helps users discover their perfect Toyota vehicle through personalized recommendations, secure Plaid-powered financial insights, and a modern, animation-rich UI.

</div>
🎥 Demo Video
<div align="center">

https://youtu.be/DECvJ9SX5y8

</div>
✨ Overview

Toyota Nexus redefines the car-buying experience by blending AI intelligence, Plaid-enabled financial data, and Toyota design principles.
It helps users make smarter, more informed decisions based on budget, lifestyle, and real-world affordability.

🔐 Authentication System

Elegant Sign Up / Sign In with glass-morphism design

Password strength meter & validation

Session persistence with localStorage

Protected routes and route guards

Profile dashboard & logout functionality

⚡ Dynamic Loading & Animations

Animated Toyota Nexus logo reveal (2 s)

Progress bar with smooth easing

Aurora backgrounds and subtle floating particles

Framer Motion transitions for pages & components

Micro-interactions on hover/click

🎯 Core Features
🧠 Personalized Profile Quiz

6-step questionnaire capturing budget, fuel type, lifestyle, etc.

Persists results and builds a match score for every Toyota model

Dynamic recommendations with “Why this fits you” reasoning

🚗 Vehicle Exploration

Explore 20 + Toyota models with realistic details

Filter by fuel type, body style, and price range

Instant search & responsive card layouts

Mobile-optimized grid with staggered reveals

💰 Finance + Plaid Integration
💵 Payment Simulator

Finance calculator: amortization-based monthly payment estimates

Lease calculator: residual value & money factor computations

Side-by-side comparison: lease vs finance

Interactive sliders for APR, term, and down payment

🏦 Plaid Integration – Real Financial Personalization

Securely connect a user’s bank account via Plaid Link

Pulls real income and balance data to personalize recommendations

Adjusts vehicle matches by affordability and loan eligibility

Enables upcoming features:

Real-time credit & spending analysis

Personalized financing offers

Financial-wellness insights

All handled with Plaid’s enterprise-grade security

💡 Plaid bridges financial reality with vehicle discovery — ensuring recommendations users can truly afford.

🤖 AI Chatbot

MOCK Mode: local rule-based Toyota assistant

Gemini Mode: integrates Google Gemini AI for real dialogue

Persistent chat history, Markdown formatting, and quick reply chips

🎨 Design & UI

Toyota palette: Red #EB0A1E, Black #1A1A1A

Tailwind CSS + Framer Motion for smooth visuals

Aurora gradients, Glass-morphism, and responsive layouts

📊 Smart Recommendations

Dynamic ReasonPanel explaining why each car fits the user

Weighted scoring using:

Plaid budget data

Fuel efficiency preferences

Safety & feature tags

<details> <summary>🧱 <strong>Tech Stack Details</strong></summary>
Category	Technology
Frontend	React 18 + TypeScript
Build Tool	Vite
Routing	React Router v6
State Mgmt	Zustand (persistent store)
Styling	Tailwind CSS + Toyota theme
Animation	Framer Motion
AI	Google Gemini API
Financial Integration	Plaid Link API
Icons	Lucide React
Deploy	Vercel / Netlify / Render
</details>
<details> <summary>📂 <strong>Project Structure</strong></summary>
toyota-nexus/
├── public/
│   └── toyota-logo.svg
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── Chatbot.tsx
│   │   ├── PlaidConnect.tsx     # 🔐 Plaid integration
│   │   ├── PaymentBreakdown.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── ReasonPanel.tsx
│   │   └── SettingsModal.tsx
│   ├── routes/
│   ├── store/
│   ├── lib/
│   │   ├── finance.ts
│   │   ├── plaid.ts             # 💵 Plaid logic
│   │   └── ai.ts
│   ├── data/
│   ├── styles/
│   ├── app.tsx
│   └── main.tsx
└── package.json

</details>
🚀 Quick Start
Prerequisites

Node.js 18 +

(Optional) Google Gemini API Key

(Optional) Plaid Developer Account (for sandbox testing)

Installation
git clone <repository-url>
cd toyota-nexus
npm install
npm run dev


Visit → http://localhost:5173

🧭 User Flow

First-time User

Loading → Landing → Sign Up → Quiz → Connect Bank (Plaid) → Explore → Chatbot


Returning User

Loading → Sign In → Personalized Dashboard

💰 Finance Formulas
Financing
M = P[r(1+r)^n] / [(1+r)^n - 1]


(M = monthly payment, P = principal, r = APR/12/100, n = months)

Leasing
Monthly = (CapCost − Residual)/Term + (CapCost + Residual)×MoneyFactor
MoneyFactor = APR/2400

<details> <summary>♿ <strong>Accessibility + Compatibility</strong></summary>

✅ Semantic HTML & ARIA

✅ Keyboard navigation / focus visibility

✅ Reduced-motion support

✅ Contrast compliance

✅ Chrome / Edge / Firefox / Safari / Mobile browsers

</details>
<details> <summary>🧩 <strong>Future Enhancements</strong></summary>

 Backend API for users & vehicle data

 Secure server-side Plaid token exchange

 Real-time Toyota pricing feed

 Dealer locator & test-drive scheduling

 Vehicle comparison tool

 AI voice assistant mode

 Multi-language support

 Analytics dashboard

</details>
📜 License

For educational and demonstration purposes only.
Not affiliated with Toyota Motor Corporation or Plaid Inc..

🤝 Contributing

Pull requests and feedback welcome 💬
Open an issue or PR on GitHub to collaborate.
