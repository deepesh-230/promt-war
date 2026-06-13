# MindMate AI 🧠💙

**MindMate AI** is a Generative AI-powered Mental Wellness Tracker and Productivity Hub built specifically for students preparing for highly competitive exams (like JEE, NEET, UPSC, CAT, etc.). 

The pressure of non-stop studying often leads to burnout, stress, and anxiety. MindMate AI acts as an empathetic, 24/7 digital companion that helps students manage their mental health while staying productive.

## 🌟 Key Features

1. **AI Wellness Journal**
   - A private space for students to vent, reflect, and document their daily struggles or wins. 
   - Powered by the **Gemini AI API**, every entry is instantly analyzed to detect sentiment, calculate stress levels, identify burnout risks, and pinpoint hidden emotional triggers. 
   - The AI provides personalized coping strategies (e.g., "Take a walk," "Try deep breathing") based on the student's emotional state.

2. **24/7 Mentor Chat**
   - An interactive conversational AI mentor (powered by Gemini) available at all times. 
   - It provides motivation, study tips, exam anxiety support, and a non-judgmental space to talk, all without diagnosing medical conditions.

3. **Focus & Relax Activities Hub**
   - **Pomodoro Timer:** A built-in 25/5 minute timer to encourage the proven Pomodoro technique, helping students focus deeply while ensuring they take necessary breaks to prevent mental fatigue.
   - **Guided Breathing Exercise:** A visually animated 4-4-6 mindful breathing tool. The interface smoothly guides the user to inhale, hold, and exhale, offering immediate relief from acute stress or pre-mock test anxiety.

4. **Wellness Dashboard**
   - Visualizes the student's overall "Wellness Score".
   - Displays interactive charts (powered by Recharts) showing trends over the past week.
   - Aggregates AI recommendations and provides a quick overview of stress levels, average sleep, and study hours.

## 🛠️ Technical Architecture

This application is built as a **100% Pure Frontend Single Page Application (SPA)**, prioritizing speed, simplicity, and ease of deployment.

- **Frontend Framework:** React.js powered by Vite for lightning-fast HMR and optimized builds.
- **Styling:** Tailwind CSS (v4) paired with Framer Motion for smooth, glassmorphism-inspired UI components, micro-animations, and a premium Dark Mode aesthetic.
- **State & Storage:** Utilizes browser Local Storage for instant, database-free data persistence. 
- **AI Integration:** Direct integration with the `@google/genai` SDK using the Gemini 2.5 Flash model.
- **Routing:** React Router DOM for seamless, client-side navigation.
- **Deployment Ready:** Configured with `vercel.json` and Netlify `_redirects` for immediate deployment as an SPA.

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/mindmate-ai.git
   cd mindmate-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your API Key:**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to view the app!
