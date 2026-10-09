# 🎮 LEVEL UP: OUR STORY 💖

> A secret, mobile-first romantic proposal web experience disguised as a playful 7-level mini-game.

---

## 🌟 The Concept
On the surface, it looks like a cute, retro-modern mini-game:
> *"I made a small game for you 🎮. Complete all 7 levels to unlock a surprise."*

As she plays through each 20-30 second challenge, a cherished photo from your journey together is unlocked, accompanied by a heartwarming typewriter memory caption. Every level celebrates your friendship, laughter, and inside jokes until **Level 7: The Final Level**, which reveals a cinematic appreciation letter, a spotlight moment, and the ultimate friendship question:
**"Will you promise to be my best friend forever and ever? 🤞💖"**

---

## 📱 The 7 Levels
1. **First Spark ✨**: Tap glowing sparks before time runs out. (Collect 10 sparks)
2. **Memory Lane 🧠**: Card memory-match game (6 pairs: hearts, flowers, coffee, camera, stars, pizza).
3. **Puzzle of Us 🧩**: 3x3 interactive memory jigsaw. Tap two tiles to swap them into place, with an optional gentle "Magic Solve" wand.
4. **Catch the Good Vibes 💌**: Slide the basket to catch flying notes and hearts while dodging broken hearts.
5. **Stars Align 🌌**: Connect the celestial stars in sequence to trace a heart constellation revealing both of your initials.
6. **Guess Me 💭**: A playful 5-question friendship trivia about the two of you. Wrong answers show funny teasing hints—there is never any fail state!
7. **The Final Level 🌟**:
   - Cinematic slow-motion photo slideshow with a handwritten typewriter friendship appreciation letter.
   - Dramatic spotlight fade to black.
   - The big question: *"Will you promise to be my best friend forever and ever? 🤞💖"* with a glowing **"YES 💖🤞"** button and a playful **"Let me think 🤔"** button (which runs away from her finger, shrinks on every attempt, and after 5 tries automatically turns into "YES!").
   - Fireworks barrage, confetti rain, celebratory fanfare.
   - **"Official Certificate of Best Friends Forever 📸"** card download (powered by `html-to-image`).
   - **"Tell {MY_NAME} 💌"** direct WhatsApp link with prefilled message: *"I said YES! 💖 Best friends forever, you're stuck with me now! 🥰🤞✨"*.

---

## 🚀 Quick Start (Run Locally)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your computer or mobile browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🎨 How to Personalize (ONE File: `src/config.ts`)

Everything in the entire experience can be customized inside **`src/config.ts`**:

```typescript
export const CONFIG = {
  // 1. Names
  herName: "Kusuma",
  myName: "Your Name",

  // 2. WhatsApp Notification
  // Enter your phone number with country code (no '+' or spaces)
  whatsAppNumber: "1234567890",
  whatsAppMessage: "I said YES! 💖 Best friends forever, you're stuck with me now! 🥰🤞✨",

  // 3. Audio & Music
  bgmTitle: "Golden Hour (Acoustic Strings)",
  bgmArtist: "Our Song",
  bgmAudioUrl: "/audio/bgm.mp3",

  // 4. Captions for all 7 levels
  levels: [ ... ],

  // 5. Quiz Questions for Level 6
  quizQuestions: [ ... ],

  // 6. The Final Friendship Letter for Level 7
  loveLetterLines: [ ... ],

  // 7. Friendship Question
  proposalQuestion: "Will you promise to be my best friend forever and ever? 🤞💖",
};
```

---

## 📸 Adding Your Photos & Music

### Photos:
Drop your 7 favorite photos into the `public/photos/` folder:
- `public/photos/1.jpg` — First date / when you met
- `public/photos/2.jpg` — A memorable trip or coffee date
- `public/photos/3.jpg` — A favorite candid smile
- `public/photos/4.jpg` — A moment full of laughter
- `public/photos/5.jpg` — Stargazing / night date
- `public/photos/6.jpg` — Being goofy / silly together
- `public/photos/7.jpg` — Your all-time favorite photo of the two of you

*(If any photo is not provided yet, the app automatically displays an illustrated story card so the game is always functional and gorgeous!)*

### Music:
Drop your favorite romantic song into:
- `public/audio/bgm.mp3`

*(The game also features procedural Web Audio sound effects for taps, heart collects, matches, boings, level victories, and proposal fanfare that work immediately without any external files!)*

---

## 🌐 How to Deploy to Vercel / Netlify

### Deploying to Vercel (Recommended, 2 Minutes):
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset: **Vite**.
5. Click **"Deploy"**.
6. That's it! You'll receive a live HTTPS URL (e.g., `https://our-story-game.vercel.app`).

*Note: The website already includes `<meta name="robots" content="noindex, nofollow" />` in `index.html` so search engines won't index it. Your link stays completely private.*

---

## 💌 How to Share the Link (Casual & Stealthy)

To make sure she does not suspect it is a proposal:
1. **Send it casually via text:**
   > *"Hey! I was learning a bit of web game development this weekend and built a silly 2-minute mini game for you haha. Can you test it and see if you can beat Level 7? 🎮"*
2. **Or play it in person:**
   > Hand her your phone or send the link while sitting together at a cozy café or during a walk: *"Play this real quick, turn up your volume!"*
3. **Save State Support:**
   > Progress is automatically saved in `localStorage`. If she closes the tab or switches apps, she can resume right from where she left off.

---

## 🔍 Mobile Testing Checklist (Chrome & Safari)

Before sending the link, run through this quick 2-minute test on your phone:

- [ ] **Viewport & Layout**: Open the page on mobile (iPhone Safari / Android Chrome). Verify no awkward horizontal scrolling occurs.
- [ ] **Audio Policy**: Tap **"START ADVENTURE"** — verify that audio plays (mobile browsers require a user interaction before allowing audio).
- [ ] **Sound Toggle**: Tap the sound icon in the top bar to verify mute and unmute behavior.
- [ ] **Easter Egg**: Tap the 🎮 game logo 5 times on the splash screen to verify the secret note popup.
- [ ] **Level 1**: Tap floating sparks and verify haptics / sounds trigger smoothly.
- [ ] **Level 2**: Flip cards and verify matching pair chime triggers.
- [ ] **Level 3**: Tap two tiles to swap them. Verify the "Magic Solve" wand works if needed.
- [ ] **Level 4**: Slide the basket left and right to catch hearts and letters.
- [ ] **Level 5**: Tap stars 1 through 8 in sequence to draw the heart constellation and reveal initials.
- [ ] **Level 6**: Try a wrong answer on the quiz to see the playful teasing hint, then pick the correct answer.
- [ ] **Level 7**:
  - Watch the photo slideshow and letter typing.
  - Test the **"Let me think 🤔"** button — tap it 5 times to watch it dodge, shrink, and morph into **"YES"**.
  - Tap **"YES 💖"** and verify fireworks, fanfare, moment card display, and WhatsApp button prefill.
  - Tap **"Save This Moment 📸"** and verify the certificate PNG downloads to your device.
