# NyayaSetu (न्यायसेतु) — AI-Powered Indian Legal Assistant

<div align="center">

⚖️ **Your Bridge to Justice** | **न्याय का पुल**

*Free AI-powered legal assistant helping Indian citizens understand their rights*

</div>

## ✨ Features

### 💬 AI Legal Chat
Ask any legal question about Indian law and get clear, accurate answers with proper citations to Acts and Sections. Available in English and Hindi.

### 📄 Document Analyzer
Upload or paste legal documents for AI-powered analysis — get summaries, key points, risk assessments, and simplified explanations.

### 📝 Legal Document Generator
Generate formatted legal documents — Affidavits, RTI Applications, Consumer Complaints, Legal Notices, Rental Agreements, and more.

### ⚖️ Know Your Rights
Explore your Fundamental, Consumer, Worker, Women's, Digital, and RTI rights under Indian law. Integrated with Indian Kanoon for legal search.

### 🏛️ Legal Aid Directory
Find free legal aid services, emergency helpline numbers, and state-wise Legal Services Authorities.

## 🌐 Bilingual Support
Full support for **English** and **Hindi (हिंदी)** with one-click language toggle.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router) + React 18
- **AI Engine**: Google Gemini 1.5 Flash
- **Legal Search**: Indian Kanoon Integration
- **Styling**: Custom CSS with glassmorphism, dark/light mode
- **Deployment**: Vercel (serverless)

## 🔧 Setup

### Prerequisites
- Node.js 18+
- Google Gemini API Key ([Get one free](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nyayasetu.git
cd nyayasetu

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini API key for AI features |
| `INDIAN_KANOON_API_KEY` | ❌ Optional | Indian Kanoon API for legal search |

## 📦 Deploy to Vercel

1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Add environment variables in Vercel Dashboard → Settings → Environment Variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## ⚠️ Disclaimer

NyayaSetu provides **legal information**, not legal advice. Always consult a qualified lawyer for specific legal matters. This tool is designed to empower citizens with knowledge of their legal rights under Indian law.

## 📞 Emergency Helplines

| Service | Number |
|---------|--------|
| Police | 100 |
| Women Helpline | 181 |
| Child Helpline | 1098 |
| Cyber Crime | 1930 |
| Legal Aid (NALSA) | 15100 |
| Emergency | 112 |

## 📄 License

MIT License — Feel free to use, modify, and distribute.

---

<div align="center">

Made with ❤️ for Indian citizens | **जय हिंद** 🇮🇳

</div>
