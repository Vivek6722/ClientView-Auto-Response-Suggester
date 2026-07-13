# ClientView Auto-Response Suggester

AI-powered email response tool for the BCG ClientView support team. Trained on real ClientView reply patterns to suggest categorized, on-brand responses instantly.

---

## 🚀 Deploy to Vercel (15 mins)

### Step 1 — Get an Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign in and go to **API Keys**
3. Click **Create Key** and copy it

### Step 2 — Upload to GitHub
1. Go to [github.com](https://github.com) and create a **New Repository** (name it `clientview-autoresponder`)
2. Upload all files from this folder into that repo
3. Click **Commit changes**

### Step 3 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Select your `clientview-autoresponder` repo and click **Import**
4. Under **Environment Variables**, add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your API key from Step 1
5. Click **Deploy**

✅ Your app is live! Vercel gives you a URL like `clientview-autoresponder.vercel.app`

---

## 🔒 Optional: Restrict Access to BCG Team Only

In Vercel dashboard → your project → **Settings** → **Deployment Protection**:
- Enable **Password Protection** and set a shared team password
- Or enable **Vercel Authentication** to require login

---

## 🛠 Run Locally (for testing)

```bash
# Install dependencies
npm install

# Create your local env file
cp .env.example .env.local
# Then edit .env.local and add your ANTHROPIC_API_KEY

# Run the app
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
clientview-app/
├── api/
│   └── suggest.js        # Serverless API route (keeps API key secure)
├── src/
│   ├── main.jsx          # React entry point
│   └── App.jsx           # Main app UI
├── index.html
├── vite.config.js
├── package.json
├── .env.example          # Template for environment variables
├── .gitignore
└── README.md
```

---

## 🔄 Future Improvements Planned
- Direct Outlook inbox integration (fetch emails automatically)
- One-click reply drafting into Outlook
- Query analytics dashboard
- Agent assignment & SLA tracking
