# 🌿 One Wish Willow

Make a wish. Snap the branch. Face the consequence.

**One Wish Willow** is an interactive, eerie web experience. It invites users to make a simple wish and visually snap a procedurally generated willow branch. In return, an AI acting as a cursed monkey's paw delivers a devastating 3-sentence horror story explaining exactly how granting their wish ruins their life.

## ✨ Features

- **Procedurally Generated Willow Branch:** A fully procedural, organic-looking horizontal willow branch drawn and animated on an HTML5 Canvas, complete with breathing animations, bending tension, and a realistic snapping fracture.
- **AI-Powered Horror:** Utilizes OpenRouter's API (dynamically routing between free-tier models like Llama 3.3, Hermes 3, and Gemma 4) to generate cold, clinical, and devastating consequences for any user input.
- **Immersive UI/UX:** A stark visual and auditory transition from a calm, "innocent" state to a gritty "horror" state, featuring unsettling sound design, screen shaking, film grain, and a typewriter effect for the AI's response.
- **Serverless Architecture:** Includes a lightweight Node.js local server (`server.js`) for development and a Vercel-ready serverless function (`api/generate.js`) to securely handle API keys and requests in production.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- An API key from [OpenRouter](https://openrouter.ai/).

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd one-wish-willow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   - Copy `.env.example` to `.env`.
   - Add your OpenRouter API key:
     ```env
     OPEN_ROUTER_API_KEY=your_open_router_api_key_here
     ```

### Running Locally

Start the local development server:
```bash
node server.js
```
Open your browser and navigate to `http://localhost:3000`.

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML, CSS (Custom Properties, Grid/Flexbox), JavaScript (Canvas API, Web Audio API).
- **Backend:** Node.js, Vercel Serverless Functions.
- **AI Integration:** OpenRouter API.
- **Typography:** Cormorant Garamond, Inter, and JetBrains Mono via Google Fonts.

## 👻 The Experience

The experience is designed to be visceral and unforgiving. The willow listens, but its interpretation is rarely what you hope for. Your words have weight now. They always did.

