## 🍽️ LunchSpin.ai

**LunchSpin.ai** is a delightful GenAI-powered web application designed to help users decide what to eat or cook when they’re feeling indecisive. Powered by Google Gemini's LLM, it generates fun and quirky suggestions and lets you spin a slot-style animated picker for a gamified experience. Whether you're eating out or cooking at home, LunchSpin makes food choices feel spontaneous and joyful.

---

### 🚀 Features

* **Dual Modes:**

  * *Eat Out:* Get 3 creative dish/restaurant ideas based on your cravings and location with ready-to-use Google Maps links.
  * *Cook at Home:* Enter your ingredients and receive 3 unique recipe ideas with steps, commentary, and key ingredients.

* **Animated Spinner Wheel:** Gamify your decision-making with a smooth slot-style spinner that selects one suggestion for you.

* **Gemini AI Integration:** Prompts are crafted dynamically and sent to Google's Gemini API for rich, structured responses.

* **Responsive UI:** Built with Tailwind CSS and Framer Motion for a smooth, mobile-friendly experience.

* **Shareable Suggestions:** Share your spun result using the Web Share API or copy it to clipboard with one click.

---

### 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React, TypeScript
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **AI Integration:** Google Gemini API

---

### 📦 Dependencies

```json
"framer-motion": "^10.16.3",
"lucide-react": "^0.321.0",
"react": "^18.2.0",
"next": "^14.1.0",
"tailwindcss": "^3.4.1"
```

---

### 💻 Running the Project Locally

1. **Clone the Repository**

```bash
git clone https://github.com/ayushichoudhary-19/lunchspin-ai.git
cd lunchspin-ai
```

2. **Install Dependencies**

```bash
npm install
```

3. **Add Your API Key**
   Create a `.env.local` file:

```
NEXT_PUBLIC_GOOGLE_API_KEY=your_gemini_api_key_here
```

4. **Run the Development Server**

```bash
npm run dev
```

Visit `http://localhost:3000` to use LunchSpin locally.

---

### 🌐 Live Demo

Experience it live at: [https://lunchspin-ai.vercel.app](https://lunchspin-ai.vercel.app)

---


### 📸 Screenshot
![image](https://github.com/user-attachments/assets/10fecf16-21bc-40db-b349-0d01e2c5d2fe)


### 🧠 Gemini API Prompt Design

Custom prompts are crafted dynamically based on user input:

* For **Eat Out**, prompts include location and preferences (e.g., "cheap, spicy, veg")
* For **Cook at Home**, prompts include ingredient list, and return structured recipe details

The response schema is strictly typed and validated for consistency across user sessions.

---

### ✨ UI & UX Highlights

* Clean dual-mode toggle for "Eat Out" or "Cook at Home"
* Reusable, animated suggestion cards
* Loading indicators and animations to enhance interactivity
* Visually appealing spinner UI with highlight zone and glow
* Adaptive layout with mobile responsiveness

---
### 📬 Contact

* GitHub: [@ayushichoudhary-19](https://github.com/ayushichoudhary-19)
* LinkedIn: [Ayushi Choudhary](https://www.linkedin.com/in/ayushi-choudhary-7688b91ba/)
* Portfolio: [ayushi-links.vercel.app](https://ayushi-links.vercel.app)
