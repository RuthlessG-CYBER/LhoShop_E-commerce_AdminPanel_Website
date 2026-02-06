# 🚀 LhoShop Admin Dashboard

A premium, high-performance E-commerce Administration System built with **React**, **TypeScript**, and **Vite**. Designed for merchants who demand professional-grade telemetry, inventory orchestration, and order fulfillment capabilities.

![LhoShop Banner](https://img.shields.io/badge/LhoShop-Admin_Dashboard-indigo?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## ✨ Core Features

- **📊 Advanced Analytics**: Real-time revenue telemetry and order trends using custom-tuned Shadcn charts.
- **🛡️ Secure Access**: Industrial-strength authentication with JWT, biometric-ready logic, and CAPTCHA security checks.
- **📦 Inventory Orchestration**: Full product lifecycle management with SKU tracking and automated stock status indicators.
- **🚚 Order Fulfillment**: Real-time order status tracking and multi-stage delivery management.
- **↩️ Return Management**: Dedicated portal for handling returns, refunds, and replacements with robust data integrity.
- **🎫 Support Ecosystem**: Integrated ticketing system for customer success and issue resolution.
- **🎨 Premium UX**: A cohesive, dark-mode-first aesthetic powered by **Shadcn/UI** and custom **Indigo** design system.

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide Icons, Shadcn/UI
- **Routing**: React Router 6 (Client-side SAP)
- **Charts**: Recharts with Shadcn wrappers
- **Deployment**: Optimized for Vercel with custom SPA routing

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dashboard1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root (if not already present):
   ```env
   VITE_API_URL=your_backend_api_endpoint
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```text
src/
├── components/     # Atomic UI components and Shadcn/UI primitives
├── pages/          # Full-page view components (Orders, Products, Returns, etc.)
├── hooks/          # Custom business logic and data fetching hooks
├── lib/            # Shared utility functions and API configurations
├── styles/         # Global design tokens and Tailwind extensions
└── App.tsx         # Main application shell and route definitions
```

## 🌐 Deployment

This project is configured for seamless deployment on **Vercel**. The included `vercel.json` ensures that client-side routing works flawlessly on refresh and direct URL access.

## 📄 License

Internal Project - All Rights Reserved.
