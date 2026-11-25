# Parkside Workout Kiosk MVP

Parkside is a touch-friendly kiosk web app prototype for guided workouts at one outdoor park gym. Members create a profile, get a goal-based weekly plan, rate how tired they feel, and follow exercise instructions for the current park's starter equipment profile. They can park a workout so another person can use the kiosk, then resume it with their PIN.

## Run locally

1. Install Node.js 18 or newer.
2. Install dependencies with `npm.cmd install` (use `npm install` in shells that allow npm's PowerShell script).
3. Start the server with `npm.cmd start`.
4. Open `http://localhost:3000`.

The server listens on port `3000` by default. Override it with `PORT`. The local JSON store defaults to `data/store.json`; override it with `DATA_FILE`.

### Try QR sign-in from a phone

The kiosk creates a one-time QR code that expires after two minutes. Scan it with a phone camera on the same reachable network, then enter the mobile number and PIN on the approval page. The phone and kiosk must be able to reach the same server. If the request hostname is not reachable from the phone, set `PUBLIC_BASE_URL` to the kiosk's reachable URL. A phone's `localhost` refers to the phone itself. Use HTTPS for remotely accessible deployments.

### Host a disposable demo on Render

The root `render.yaml` is a Render Blueprint for a single free Node.js web service in Singapore. It installs from the lockfile and uses `/healthz` for health checks. The JSON store is written to `/tmp` because the free service has no persistent disk; member profiles, workouts, and sessions may disappear whenever the instance restarts, sleeps, or redeploys.

1. Push the project to a GitHub repository.
2. In Render, choose **New > Blueprint**, connect the repository, and apply the [`render.yaml`](./render.yaml) configuration. See Render's [Blueprint guide](https://render.com/docs/infrastructure-as-code) if needed.
3. After the service is created, copy its HTTPS URL (for example, `https://your-service.onrender.com`) into the service's `PUBLIC_BASE_URL` environment variable, then redeploy.
4. Confirm the service URL and its `/healthz` endpoint respond before testing enrollment, QR approval, and workouts with fake data.

Keep this service at one instance. The JSON file and login sessions are designed for a single process; multiple instances would not share their session memory or safely coordinate file writes.

**Disposable demo only:** the service URL is public, data is not durable, and this prototype does not verify phone ownership or protect member data with an encrypted database. Use fictional data only; do not connect it to a public kiosk or collect real member information.

## Features included

### Member profiles and sign-in

- Enroll directly at the kiosk with an Indian mobile number, nickname, goal, experience level, workout language, four-digit PIN, and required safety acknowledgement.
- Choose from strength, general fitness, or mobility goals, and beginner or regular experience levels.
- Sign in with mobile number and PIN, or scan a short-lived kiosk QR code and approve sign-in with the same number and PIN on a phone.
- Phone numbers are normalized to `+91` format; they are used as account identifiers, not as the PIN.
- Phone ownership is **not verified**. This prototype does not send SMS OTPs; an account can be created using a number the enrollee does not own.
- Switch the kiosk UI between English and Hindi. The enrollment language is saved with the member profile.
- PINs are salted and hashed with Node.js `scrypt`; repeated incorrect PIN attempts are locked out for 15 minutes after five failures for that number and network address.
- Existing member-code-only profiles cannot sign in with the new flow. Members must enroll again with their mobile number; legacy records are not automatically deleted.

### Weekly plan and exercise guidance

- Assign a seven-day starter schedule based on the member's selected goal, with rest days. The current day is determined using India Standard Time.
- Offer exercises from the built-in location profile: chest press, seated row, leg press, shoulder press, and brisk walking without equipment.
- Let a signed-in member build and save a personal weekly plan on a phone-sized screen (viewport up to 767px). Choose days, exercises, sets, reps, or walking duration; the kiosk uses the saved plan after the member signs in.
- Limit each day to four unique exercises, and validate target ranges on the server. Plan changes are blocked while a workout is active or parked.
- Restore the suggested goal-based schedule from the phone plan editor.
- The phone-sized editor is a UI choice, **not a security boundary**; server-side authorization protects plan changes.
- Ask for a tiredness rating from 1 to 5 before starting a workout.
- Adjust displayed targets for beginner experience and fatigue: rating 3 reduces targets slightly; ratings 4 and 5 reduce them further. A rating of 5 also recommends keeping the workout gentle or stopping.
- Show the current exercise, workout progress, suggested sets/repetitions or walking duration, how the movement should feel, and common mistakes to avoid.
- Provide a distinct animated SVG scene for each of the five built-in exercises. Exercise guidance is available in English and Hindi.
- Read the exercise guidance aloud using the browser's speech synthesis and a voice matching the selected language. Hindi playback requires an installed Hindi text-to-speech voice on the kiosk; if none is available, the app explains this instead of silently speaking with the wrong language.
- Mark the current instruction complete to advance to the next exercise. No sets, repetitions, or weights performed are recorded.

### Parked sessions

- Leave the exercise screen to park a workout without ending it.
- Show parked workouts in a shared sidebar with only the member's nickname and current exercise.
- Require the member's PIN to resume a parked workout.
- Automatically park the exercise screen after 30 seconds without user activity.
- Sign out an idle pre-workout session on the kiosk after 30 seconds. On a phone, keep the signed-in session available for plan editing.
- Expire parked workouts after 120 minutes. If the server restarts during an active workout, it recovers that workout as parked.
- End a workout and sign out explicitly when finished.

### Interface and service

- Responsive, touch-friendly layout with large controls, kiosk location indicator, English/Hindi language toggle, and a compact mobile layout.
- JSON API and local JSON-file persistence for member profiles and workout state.
- Short-lived in-memory login tokens and one-time QR approval tokens.

## Starter content and configuration

The demo location is named **Riverside Park**. Its equipment profile is currently hard-coded in `server.js`; update it to match the real park before use. Goal-based weekly templates, exercise names, English/Hindi instructions, and starter targets are also defined there.

The exercise artwork and wording are illustrative, not reviewed training media. The exercise-specific SVGs are simplified movement diagrams and should be checked by a qualified reviewer before use. Browser speech is not pre-recorded talk-back; available voices and pronunciation depend on the kiosk's operating system and browser. For Hindi playback, install a Hindi speech voice in the kiosk's system settings and reload the app.

## Not included yet

- SMS OTP, verified phone ownership, phone-number changes/recovery, or an account deletion flow.
- A separately installable mobile app. The plan builder is part of the responsive web app and currently requires an authenticated browser session.
- Personal QR cards or printed QR slips. QR approval uses the mobile number and PIN on the phone approval page.
- Multiple locations, editable equipment profiles, cross-location accounts, or location-specific plan management.
- Additional exercises, professionally reviewed exercise animations, recorded exercise video/3D tutorials, or pre-recorded voice audio.
- Workout history in a mobile app, detailed session analytics, simultaneous-use metrics, operator dashboards, or data export.
- User account deletion, PIN reset, or self-service profile management.
- Offline mode, local sync, or background synchronization.
- Camera-based form feedback, wearables, payments, memberships, or social features.

## Data, privacy, and deployment notes

- Member profiles (including mobile numbers) and workout state are stored in a local JSON file. PINs are hashed, but phone numbers and the rest of the file are **not encrypted at rest**.
- Authentication tokens and QR approval state live in server memory; users may need to sign in again after a server restart. Workout records and custom plans are persisted locally.
- Hosting configuration is provided for a single-instance, non-persistent Render demo. The free instance does not provide durable data storage or multi-instance support.
- Because phone ownership is unverified, do not enter real or sensitive member data on a public prototype URL.
- There is no account deletion flow, encrypted database, backup system, or production consent-management workflow.
- Do not use real member data or deploy this prototype on a public kiosk until HTTPS, protected persistent storage and backups, account deletion, operational monitoring, equipment/content review, accessibility testing, and security and legal review are in place.
- Exercise and fatigue guidance is general fitness information, not medical advice. Stop exercising if you feel pain, dizziness, or unusual discomfort.
