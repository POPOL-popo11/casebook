# Casebook

Judgement training for the AI era, built for the CDH hackathon (Airwallex Statement 1).
Case Experts share past cases, Learners replay the decisions, and Team Leads see the reasoning.

**Live demo:** https://casebook-v2.vercel.app (press "Reset demo data" first)

## Commands

- `npm install`
- `npm run dev` starts a local server
- `npm test` runs Vitest
- `npm run build` type-checks, then builds to `dist/`

## Technical notes

- **A local demo.** Casebook runs entirely in the browser. There are no accounts, no server and no live AI.
- **Where records live.** Everything you enter is saved in this browser's `localStorage` (key `casebook:v1`). It survives reloads and switching pages or roles, but it stays on this device and in this browser only. Nothing is sent anywhere.
- **What is preset.** Answers from the app and from the AI roles in a Team Decision Room are written in advance and chosen by simple rules over what you type. They are labelled "Demo response". Records that come with the demo (other learners' attempts, an earlier growth record, a share and a feedback) are labelled "Demo data".
- **Starting over.** "Reset demo data", under the user in the sidebar, deletes what was entered in this browser and restores the demo records.
- **Fictional content.** Every case is a fictional training scenario. Any resemblance to real companies or people is unintended.
