/**
 * ==============================================================================
 * 💖 LEVEL UP: OUR STORY — CONFIGURATION FILE (BEST FRIENDS EDITION) 💖
 * ==============================================================================
 * 
 * Customize your entire friendship celebration game from this SINGLE file!
 * Fill in your best friend's name, your name, memories, captions, photos, and music.
 * 
 * Note: Everything is beautifully written and pre-configured for an amazing
 * Best-Friends-Forever tribute that will make her smile and feel celebrated!
 */

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  playfulHint: string; // Shown playfully when she picks a wrong answer
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  caption: string;     // Revealed in the typewriter polaroid when level completes
  photoUrl: string;    // Place your photo at /public/photos/{1-7}.jpg
  photoAlt: string;
}

export interface AppConfig {
  // --- Basic Info ---
  herName: string;
  myName: string;
  herNickname: string;
  anniversaryDate: string; // e.g. "Since Day One"
  proposalDate: string;    // e.g. "Today & Always"

  // --- WhatsApp Share ---
  // Format: International format without '+' or spaces. e.g., "14155552671" or "919876543210"
  whatsAppNumber: string;
  whatsAppMessage: string; // Message sent when she taps "Tell {MY_NAME}"

  // --- Music & Sound ---
  bgmTitle: string;        // Shown in the music player
  bgmArtist: string;
  bgmAudioUrl: string;     // Points to /public/audio/bgm.mp3

  // --- Secret Easter Egg ---
  // Triggered when she taps the top logo 5 times!
  secretEasterEggMessage: string;

  // --- Level Details & Captions ---
  levels: LevelConfig[];

  // --- Level 6: The Friendship Quiz ---
  quizQuestions: QuizQuestion[];

  // --- Level 7: The Letter to a Best Friend ---
  // Each paragraph is typed line-by-line during the cinematic photo slideshow
  loveLetterLines: string[];

  // --- The Big Question ---
  proposalHeadline: string;
  proposalSubtext: string;
  proposalQuestion: string;
  finalSuccessMessage: string;
}

export const CONFIG: AppConfig = {
  // ==========================================
  // 1. NAMES & PARTICULARS
  // ==========================================
  herName: "Kusuma",                 // Her name
  herNickname: "Bestie",             // Sweet nickname
  myName: "Your Best Friend",        // Your name
  anniversaryDate: "Day 1 of Our Friendship",
  proposalDate: "Today & Always",

  // ==========================================
  // 2. WHATSAPP NOTIFICATION
  // ==========================================
  whatsAppNumber: "1234567890", 
  whatsAppMessage: "I said YES! 💖 Best friends forever, you're stuck with me now! 🥰🤞✨",

  // ==========================================
  // 3. BACKGROUND MUSIC
  // ==========================================
  bgmTitle: "Golden Hour (Acoustic Strings)",
  bgmArtist: "Our Song",
  bgmAudioUrl: "/audio/bgm.mp3",

  // ==========================================
  // 4. SECRET EASTER EGG (Tap logo 5 times)
  // ==========================================
  secretEasterEggMessage: "P.S. You found the secret note! 🥰 I coded every single pixel of this game just to bring a huge smile to your face today. You're truly the best friend anyone could ask for!",

  // ==========================================
  // 5. 7 LEVELS: TITLES & CAPTIONS
  // ==========================================
  levels: [
    {
      id: 1,
      title: "First Spark ✨",
      subtitle: "Catch the glowing sparks before time runs out!",
      caption: "Do you remember when we first started talking? Little did I know that day would bring such an incredible, genuine friend into my life!",
      photoUrl: "/photos/1.jpg",
      photoAlt: "When our friendship began",
    },
    {
      id: 2,
      title: "Memory Lane 🧠",
      subtitle: "Match the cute moments and vibes we share",
      caption: "Every random late-night talk, every silly joke, and every laugh that made our stomachs hurt... you make everyday moments so much more fun.",
      photoUrl: "/photos/2.jpg",
      photoAlt: "Our favorite moments",
    },
    {
      id: 3,
      title: "Puzzle of Us 🧩",
      subtitle: "Piece together one of my favorite memories of you",
      caption: "You're that one friend who understands me without me even needing to explain. Having you around makes everything brighter and easier.",
      photoUrl: "/photos/3.jpg",
      photoAlt: "When everything fell into place",
    },
    {
      id: 4,
      title: "Catch the Good Vibes 💌",
      subtitle: "Move your basket to catch flying notes & sweet hearts!",
      caption: "Through every high and low, you've always been in my corner cheering me on. A supportive, kind friend like you is truly one in a million.",
      photoUrl: "/photos/4.jpg",
      photoAlt: "Laughter and happiness",
    },
    {
      id: 5,
      title: "Stars Align 🌌",
      subtitle: "Connect the celestial stars in the night sky",
      caption: "Out of 8 billion people across the world, I'm so grateful that life brought us together. Finding a friend like you was definitely written in the stars!",
      photoUrl: "/photos/5.jpg",
      photoAlt: "Under the starlight",
    },
    {
      id: 6,
      title: "Guess Me 💭",
      subtitle: "A quick friendship trivia challenge",
      caption: "You know my quirks, my jokes, and my random habits—and yet you still stick around! There's no one else I'd rather have as my partner-in-crime.",
      photoUrl: "/photos/6.jpg",
      photoAlt: "Us having fun together",
    },
    {
      id: 7,
      title: "The Final Level 🌟",
      subtitle: "The ultimate friendship challenge...",
      caption: "From our very first conversation to this exact second... thank you for being the most amazing friend anyone could ever ask for.",
      photoUrl: "/photos/7.jpg",
      photoAlt: "Best friends forever",
    },
  ],

  // ==========================================
  // 6. LEVEL 6: FRIENDSHIP QUIZ
  // ==========================================
  quizQuestions: [
    {
      question: "Who sends reels and memes at the most random times?",
      options: [
        "Definitely you!",
        "Definitely me (I have zero self control)",
        "We both spam each other equally",
        "It's a telepathic connection at 2 AM"
      ],
      correctIndex: 2,
      playfulHint: "Haha nice try! But look at our chat... we both spam each other with hilarious reels equally! 😉"
    },
    {
      question: "What is my absolute favorite thing about our friendship?",
      options: [
        "Your contagious laugh",
        "How we can talk about literally anything",
        "How you always make ordinary days fun",
        "All of the above and so much more!"
      ],
      correctIndex: 3,
      playfulHint: "A great choice, but how could I pick just ONE? It's everything about our bond! 💖"
    },
    {
      question: "What is our official friendship code?",
      options: [
        "Tagging each other in 40 posts a day",
        "Eating good food and chatting for hours",
        "Having each other's back no matter what",
        "All three combined in equal parts!"
      ],
      correctIndex: 3,
      playfulHint: "Close! But our true friendship code is definitely all of those combined! 🥰"
    },
    {
      question: "Where is the best place to hang out?",
      options: [
        "A cute aesthetic café",
        "Somewhere quiet where we can gossip",
        "Wherever we can laugh our heads off",
        "Anywhere as long as there is good food"
      ],
      correctIndex: 2,
      playfulHint: "Anywhere we're together having fun is the best place in the world! 🌸"
    },
    {
      question: "Are you ready to see what surprise awaits you at the end of this game?",
      options: [
        "Yes, I'm dying of curiosity!",
        "More ready than ever!",
        "Bring it on! 🚀",
        "I've been ready since Level 1! 💖"
      ],
      correctIndex: 3,
      playfulHint: "You're so close! Click the heart to unlock the surprise! 💫"
    }
  ],

  // ==========================================
  // 7. LEVEL 7: THE LETTER TO A BEST FRIEND
  // ==========================================
  loveLetterLines: [
    "When I first started creating this little game, I wanted to do something creative for someone truly special.",
    "True friends who bring genuine warmth, laughter, and support into your life are so rare to find.",
    "You have been an amazing friend—always listening, always making me laugh, and always being your authentic self.",
    "Every memory we built across these levels isn't just a moment in time; it's a reminder of how lucky I am to know you.",
    "I appreciate you more than words can say, and I wanted to make sure you know just how valued you are.",
    "And now, there is only one last question I have for you..."
  ],

  // ==========================================
  // 8. THE BIG QUESTION & CELEBRATION
  // ==========================================
  proposalHeadline: "There is one last question, player...",
  proposalSubtext: "You unlocked the final chapter of our friendship.",
  proposalQuestion: "Will you promise to be my best friend forever and ever? 🤞💖",
  finalSuccessMessage: "You just said YES to Best Friends Forever! 💖✨ No matter where life takes us, I promise to always cheer for you, celebrate your wins, and be right by your side as your truest friend."
};
