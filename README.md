# Streaks Tracker

A simple Node.js application to track your coding streaks on various platforms like LeetCode, Codeforces, CodeChef, and GeeksforGeeks. It sends you a reminder email for each platform before the day ends if you haven't completed your daily challenge.

## Features

- Track daily coding streaks.
- Send email reminders.
- Configurable for multiple coding platforms.

## Prerequisites

- Node.js
- npm

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://your-repository-url.git
   cd streaks-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add your email credentials and platform usernames:
   ```env
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password
   LEETCODE_USERNAME=your-leetcode-username
   # Add other platform usernames as needed
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Run the application:**
   ```bash
   npm start
   ```

## Project Structure

```
streaks-tracker/
├── dist/                     # Compiled JavaScript files
├── src/
│   ├── index.ts              # Main application entry point
│   ├── platforms/            # Platform-specific logic
│   │   ├── leetcode.ts
│   │   ├── codeforces.ts
│   │   ├── codechef.ts
│   │   └── gfg.ts
│   ├── email/
│   │   └── notifier.ts       # Email notification logic
│   └── utils/
│       └── scheduler.ts      # Task scheduling logic
├── .env                      # Environment variables (create this file)
├── package.json              # Project metadata and dependencies
├── tsconfig.json             # TypeScript compiler options
└── README.md                 # Project overview and instructions
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[ISC](https://opensource.org/licenses/ISC)
