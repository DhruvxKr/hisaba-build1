# Hisaba – Personal Expense Tracker

A personal expense-tracking web app built with React, TypeScript, and Firebase. Track spending, set category budgets, and view monthly insights — installable as a PWA for offline use.

## Features

- Google Sign-In authentication with per-user data isolation (Firestore security rules)
- Natural-language expense entry — type things like `450 for dinner at zomato` and it auto-fills amount, merchant, and category
- Category-wise budgets with real-time limit tracking
- Monthly spending insights: trend comparison and top-category breakdown
- Weekly spending recap
- Installable PWA with offline support (service worker + Firestore offline persistence)

## Tech Stack

React 19 · TypeScript · Vite · Firebase (Auth, Firestore) · Tailwind CSS · Framer Motion

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in your Firebase project config (from Firebase Console → Project Settings) and Gemini API key.
3. Run the app:
   ```
   npm run dev
   ```

## Project Structure

```
src/
  components/   UI screens and modals
  context/      Global expense state (React Context)
  services/     Firestore read/write helpers
  utils/        Natural-language parsing utility
  hooks/        PWA install/offline hooks
  lib/          Firebase initialization
```
