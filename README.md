# INSTASTAY

![INSTASTAY Banner](public/logo.png)

<p align="center">
  <b>Seamless stays, smarter travel.</b><br>
  <i>The next-generation hotel booking platform for modern explorers.</i>
</p>

---

<p align="center">
  <a href="#features"><img src="https://img.shields.io/badge/Features-8+-blue" alt="Features"></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-MIT-green" alt="License"></a>
  <a href="#contributing"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/Tech%20Stack-React%20%7C%20TypeScript%20%7C%20Supabase-blueviolet" alt="Tech Stack"></a>
  <a href="#ai-assistant"><img src="https://img.shields.io/badge/AI%20Assistant-Enabled-ff69b4" alt="AI Assistant"></a>
</p>

---

## 🚀 Vision

**INSTASTAY** is designed to revolutionize the way you discover, book, and manage hotel stays. With a focus on user experience, real-time availability, and smart travel tools, INSTASTAY empowers travelers and hoteliers alike.

---

## 🌟 Features

- 🤖 **AI Assistant:** Your personal travel concierge! Instastay's built-in AI Assistant answers questions, helps with bookings, provides travel tips, and guides you through the platform—all in real time. Powered by advanced LLMs and accessible from anywhere in the app.
- 🔍 **Advanced Hotel Search:** Filter by location, price, amenities, and more.
- 🏨 **Real-Time Booking:** Instantly check and reserve available rooms.
- ❤️ **Favorites:** Save and manage your favorite hotels for quick access.
- 🔒 **Secure Authentication:** Modern login, signup, and password reset flows.
- 🎁 **Exclusive Offers:** Apply coupon codes and discover special deals.
- ⭐ **Guest Reviews:** Read and write reviews to help the community.
- 📱 **Mobile-First Design:** Fully responsive and accessible on all devices.
- 🛡️ **Privacy First:** No sensitive data stored in the repo; your secrets stay safe.

---

## 🧠 AI Assistant

The Instastay AI Assistant is your always-available travel expert, built right into the platform. It can:
- Answer questions about hotels, bookings, payments, and amenities
- Provide travel tips and recommendations
- Guide users through the booking process
- Help with troubleshooting and support

**How it works:**
- The AI Assistant uses a secure proxy server to communicate with external AI APIs, keeping your API keys and requests safe.
- All AI chat requests are routed through your own proxy server (see below for setup).


## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend/DB:** Supabase (Postgres, Auth, Storage)
- **AI:** LLMs via secure proxy (OpenAI, DeepSeek, etc.)
- **State Management:** React Context, Custom Hooks
- **UI Components:** Custom & Headless UI
- **Other:** PostCSS, ESLint, Vercel (deploy)

---

### Local Setup

1. **Clone the repo:**
   ```sh
   git clone https://github.com/sudoSubh/INSTASTAY.git
   cd INSTASTAY
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   bun install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in your Supabase, AI proxy, and API credentials.
4. **Run the app:**
   ```sh
   npm run dev
   # or
   bun run dev
   ```
5. **Visit:** [http://localhost:5173](http://localhost:5173)

---

## 📝 Usage

- **Browse hotels:** Use the search and filters to find your perfect stay.
- **Book a room:** Follow the booking flow and confirm your reservation.
- **Manage favorites:** Add hotels to your favorites for quick access.
- **Write reviews:** Share your experience and help others choose.
- **Chat with AI Assistant:** Click the AI icon and ask anything about your stay, bookings, or travel plans!

---
## 🛡️ Security

- **No secrets in the repo:** Double-check `.env`, `supabase/config.toml`, and other config files before pushing.
- **Audit dependencies:** Run `npm audit fix` or `bun audit` regularly.
- **Report vulnerabilities:** Please open an issue or email the maintainer for responsible disclosure.

---

## ❓ FAQ

**Q: Can I use my own Supabase project?**  
A: Yes! Just update your `.env` with your Supabase credentials.

**Q: How do I set up the AI Assistant?**  
A: Deploy the proxy server (see above), set your API key, and add the proxy URL to your `.env`.

**Q: Is this production-ready?**  
A: The project is a solid foundation, but please review and test thoroughly before deploying to production.

**Q: How do I deploy to Vercel?**  
A: Connect your repo to Vercel, set environment variables, and deploy. See [Vercel docs](https://vercel.com/docs) for more.
---

## 📄 License

[MIT](LICENSE)

---

<p align="center">
  <b>INSTASTAY</b> – Seamless stays, smarter travel.
</p>
