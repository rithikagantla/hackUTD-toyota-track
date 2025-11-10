# 🚗 **Toyota Nexus**
### *Your Intelligent Vehicle Recommendation Assistant*

<div align="center">

AI-powered web application that helps users find their **perfect Toyota** through personalized recommendations, **Plaid-based financial insights**, and a **modern, interactive UI**.

</div>

---

## 🎥 Demo Video

<div align="center">

[![Watch the Demo on YouTube](https://img.youtube.com/vi/DECvJ9SX5y8/maxresdefault.jpg)](https://youtu.be/DECvJ9SX5y8)  
🎬 **Click to watch the full Toyota Nexus demo**

</div>

---

## ✨ Overview

**Toyota Nexus** reimagines the car-buying experience with:
- Personalized recommendation quizzes  
- Secure **Plaid integration** for real financial context  
- AI-driven chat powered by **Google Gemini**  
- Toyota-branded UI and animations built with **Framer Motion**

---

## 🔐 Authentication System

- Beautiful **Sign Up / Sign In** forms with glass-morphism
- **Password strength indicator**
- **Session persistence** using `localStorage`
- **Auth guards** for protected routes
- Simple **profile management** and logout

---

## ⚡ Loading & Animation System

- Animated **Toyota Nexus** logo reveal (2 s)
- Smooth **progress bar** transitions
- Aurora-themed backgrounds with motion particles
- Page & element animations via **Framer Motion**
- Hover micro-interactions throughout

---

## 🎯 Core Features

### 🧠 Personalized Profile Quiz
- 6-step quiz covering **budget, fuel type, lifestyle**, and more  
- Generates dynamic match scores for Toyota models  
- Persists data for returning users  

---

### 🚗 Vehicle Exploration
- Browse **20 + Toyota models**
- Filter by **fuel type**, **body style**, or **price**
- Real-time search
- Responsive animated grid for mobile and desktop  

---

### 💰 Finance & Plaid Integration

#### 💵 Payment Simulator
- **Finance Calculator:** amortization-based monthly payment estimates  
- **Lease Calculator:** residual-value & money-factor calculations  
- **Finance vs Lease** side-by-side comparison  
- Interactive sliders for APR, term, and down payment  

#### 🏦 **Plaid Integration – Real Financial Personalization**
- Securely connect your **bank account** through **Plaid Link**
- Import **income and balance data** to enhance affordability modeling
- Personalized recommendations based on **real budgets**
- Enables future capabilities:
  - Real-time credit insights
  - Personalized finance offers
  - Expense trend visualization
- Uses **Plaid’s enterprise-grade security**

> 💡 *Plaid ensures that every recommendation aligns with what users can truly afford — merging financial insight with lifestyle discovery.*

---

### 🤖 AI Chatbot
- **MOCK Mode:** rule-based Toyota FAQ assistant (no API key)
- **Gemini Mode:** powered by **Google Gemini 1.5**
- Persistent chat history with Markdown support  
- Quick-action suggestion chips for FAQs  

---

### 🎨 Modern Toyota-Inspired UI
- Official brand palette: **Red #EB0A1E**, **Black #1A1A1A**
- **Tailwind CSS + Framer Motion** for fluid design
- **Aurora gradients** and **glass panels**
- Responsive design for all screen sizes  

---

## 📊 Smart Recommendations

- **ReasonPanel:** shows “why this car fits you”
- Weighted algorithm using:
  - Plaid budget data
  - Fuel efficiency & lifestyle preferences
  - Safety scores & features
- Dynamic visualization of match confidence  

---

<details>
<summary><strong>🧱 Tech Stack</strong></summary>

| Category | Technology |
|-----------|-------------|
| **Frontend** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Routing** | React Router v6 |
| **State Mgmt** | Zustand (persistent store) |
| **Styling** | Tailwind CSS + Toyota theme |
| **Animation** | Framer Motion |
| **AI Engine** | Google Gemini API |
| **Financial Integration** | **Plaid Link API** |
| **Icons** | Lucide React |
| **Deployment** | Vercel / Netlify / Render |

</details>

---

<details>
<summary><strong>📂 Project Structure</strong></summary>

