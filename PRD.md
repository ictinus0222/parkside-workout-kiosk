# PRD: Park Workout Kiosk, Phase 1 MVP (v0.2)

*Working title. Supersedes Draft v0.1. Built from the founder’s original thoughts plus your suggested changes on v0.1. Items marked **\[Assumption\]** are my inferences and need confirming. Work will happen in phases; Phase 1 starts with a simple kiosk setup.*

## 1. Overview

A web app that runs on kiosks placed at public workout spots. Members log in without any biometrics, using a **QR code and a PIN**, and receive a **personalised workout** built from their goal, their weekly plan, how tired they feel, and the equipment actually present at that location. The kiosk shows each exercise with a 2D or 3D tutorial and a voice talk-back in more than one language. The member then walks away and does the exercise, and comes back to the kiosk for the next instruction.

Version 1 keeps to the most basic feature: **personalised workouts for members**. Everything else (ecosystem, cross-location accounts, camera feedback, wearables) comes in later versions.

## 2. What Changed from v0.1

| Area | v0.1 | v0.2 decision |
| --- | --- | --- |
| Identity | Fingerprint scanner | **QR code + PIN**. No biometrics, no fingerprint hardware. |
| Workout logging | Log sets, reps, weight on the kiosk | **No manual logging in Phase 1.** It takes too long at the kiosk. The kiosk gives the exercise, the user does it and returns for the next. |
| Fatigue | Check-in plus readiness indicator | **User rates how tired they are on a simple scale.** |
| Form guidance | Short demo; camera-based later | **2D or 3D tutorial plus voice talk-back** explaining how the exercise should feel in the body. No camera, no AI in Phase 1. |
| Language | English | **At least one additional language plus talk-back.** |
| Location | Public gyms | **Phase 1 kiosks run in public parks with outdoor gym machines.** Workouts use only the machines present, plus cardio with no equipment **\[Assumption: confirm vs indoor gyms\]**. |
| Sessions | One user at a time, then reset | **Parked sessions:** a user can leave the kiosk without logging out. Their progress moves to a PIN-protected sidebar so others can use the kiosk. |
| Phasing | MVP / V1 / V2 | **Phase 1 is a simple kiosk setup**; later phases listed in section 16. |
| Goal “log in under 30 seconds” | Included | **Dropped.** It was an arbitrary benchmark and logging is no longer in scope. Replaced by a login-speed target to validate in the pilot. |
| Dropped risks and options | Fingerprint hardware, WebAuthn, sweaty-finger accuracy, quick-repeat of last numbers | Removed. |

## 3. Founder’s Original Thoughts (captured)

1. Web app deployed on **kiosks in public places** (originally public gyms). *Phase 1: park kiosks.*
2. Users **track their workouts**. *Phase 1: the kiosk guides the workout; the user does not type numbers.*
3. **Individual accounts** for every member. *Phase 1: QR + PIN instead of fingerprints.*
4. The app handles **weekly workout plan**, **fatigue management**, **exercise form guidance**. *Phase 1: fatigue is a simple tiredness rating.*
5. **Ecosystem:** users can continue their regimen in other places. *Deferred; data model is built for it.*

## 4. Problem Statement

- People at public parks and open gyms have no trainer and no plan, so they do random or unsafe workouts.
- They do not know which machine suits them or what safe form looks like.
- People overtrain or undertrain because fatigue is not considered.
- Typing numbers into a shared kiosk is slow and unpleasant, so tracking-based apps get abandoned.
- Workout continuity breaks when someone changes location.

## 5. Vision

Anyone walks up to a kiosk, logs in with a quick QR scan, says how tired they are, and instantly gets *today’s exercise, shown and spoken in their language, using the machines right there*. Then they get on with the workout.

## 6. Target Users

| User | Description |
| --- | --- |
| **Primary: Park / public-gym exerciser** | Wants a guided, personalised workout without a trainer or any equipment of their own. May or may not carry a smartphone. |
| **Future: Operator (park authority, gym owner)** | Hosts the kiosk, may want usage insights **\[Assumption\]**. |

## 7. Goals and Non-Goals (Phase 1)

**Goals**

- Fast, seamless login with no biometrics (QR and PIN).
- Personalised workouts for each member, based on profile, weekly plan, tiredness rating, and the machines present at that location.
- Clear form guidance: 2D or 3D tutorial plus voice talk-back explaining how the exercise should feel in the body.
- Support for English plus at least one more language, with voice talk-back **\[Assumption: Hindi\]**.
- Let several people use one kiosk without interrupting each other’s workout (parked sessions).
- Capture how many people are working out at the same time at each location, for later use.

**Non-goals for Phase 1**

- Fingerprint or any biometric identification.
- Manual logging of sets, reps and weight.
- Camera-based form correction.
- AI-generated plans or AI talk-back (talk-back is pre-recorded content).
- Cross-location ecosystem and operator dashboards.
- Payments, memberships, social features, wearables.

## 8. Phase 1 Features

### 8.1 Kiosk and Access

- Full-screen kiosk-mode web app, touch-first, large buttons, readable in daylight and at arm’s length, usable by people in a hurry.
- **Login mode A (primary):** the kiosk displays a short-lived QR code. The member scans it with the mobile app, approves, and the kiosk logs them in.
- **Login mode B:** the kiosk scans a personal QR shown on the phone or printed on a metro-style slip or card. For people without the app or mobile data **\[Assumption\]**. Requires PIN confirmation.
- **Login mode C (fallback):** member enters their short user code and PIN on the kiosk **\[Assumption\]**.
- **PIN:** a number the member chooses and remembers, used to protect their parked session and to confirm sensitive actions.
- **First-time enrollment:** via QR to the mobile app (name or nickname, goal, experience level, PIN). Enrollment directly at the kiosk is a Should **\[Assumption\]**.

### 8.2 Personalised Workout

- Weekly plan organized by day (e.g. push/pull/legs or custom), assigned from a template by goal and level, editable later.
- Each location has an **equipment profile**. Exercises offered are limited to the machines present at that location plus cardio with no equipment.
- The tiredness rating adjusts the day’s intensity (e.g. lighter volume or a rest suggestion when very tired) using simple rules, not AI.
- Kiosk opens on today’s workout with progress checkmarks.

### 8.3 Guided Exercise Delivery and Parked Sessions

1. User logs in and sees their current exercise.
2. Kiosk shows the tutorial and plays voice talk-back.
3. User taps **Start** (or **Leave kiosk**) and goes to do the exercise. Their session is **parked**, not logged out.
4. Their progress appears in a **sidebar** showing a nickname and current exercise only. It can be opened only with the member’s PIN.
5. Other people can now log in and use the kiosk without interrupting anyone’s plan.
6. The member returns, enters their PIN, taps **Done**, and receives the next instruction.
7. When the workout is finished the member logs out. If they forget, the session is **erased automatically after a set period** **\[Assumption: 60 minutes of inactivity, configurable\]**.

- If a logged-in user walks away without pressing anything, the kiosk parks the session automatically after a short idle period **\[Assumption: 30 seconds\]**.

### 8.4 Fatigue Management (Version 1)

- A simple rating of how tired the user is, on a scale **\[Assumption: 1 to 5 with faces and labels\]**, asked when a session starts, and optionally at the end.
- Rating feeds the intensity rules in 8.2 and is stored for later trend use.

### 8.5 Exercise Form Guidance

- Per-exercise **2D or 3D tutorial** (looping animation) showing correct form.
- **Voice talk-back** explaining how the exercise should feel in the body (e.g. where to feel the muscle working, what means stop).
- Common mistakes listed in short text, available in each supported language.
- All content is pre-produced. No AI and no camera in Phase 1.

### 8.6 Mobile App (Minimal) **\[Assumption: progressive web app first\]**

- Sign-up and profile, QR scanning for login mode A, personal QR for mode B, PIN set and reset.
- View weekly plan and completed sessions.

### 8.7 Data Captured for Later

- Anonymous count of simultaneous active and parked sessions per kiosk over time.
- Exercises started and completed, tiredness ratings, language used, voice talk-back usage.

### 8.8 Deferred (Not Phase 1)

Cross-location accounts, park ecosystem, camera-based feedback, wearables, operator dashboard.

## 9. Key User Flows

**Returning member (mode A)**

1. Kiosk idle screen shows QR. Member scans it in the app and approves.
2. Kiosk greets them by nickname and asks how tired they feel (rating).
3. Kiosk shows today’s workout and the current exercise with tutorial and voice.
4. Member taps **Leave kiosk**, goes to the machine, does the exercise. Session is parked in the sidebar.
5. Member returns, enters PIN, taps **Done**, gets the next exercise.
6. After the last exercise: optional end rating, **Log out**.

**New member**

1. Taps “New here” and scans the QR with their phone.
2. Enters name or nickname, goal, experience level, sets a PIN.
3. Gets a starter weekly plan and a first workout on the kiosk.

**Parked session**

1. Member A leaves the kiosk; A’s nickname and exercise appear in the sidebar.
2. Member B logs in and uses the kiosk normally.
3. A returns, taps their sidebar entry, enters PIN, continues.
4. If A never returns, the session is erased after the timeout.

## 10. Functional Requirements (Phase 1)

| ID | Requirement | Priority | Acceptance criteria |
| --- | --- | --- | --- |
| F1 | QR login, mode A (kiosk QR scanned by mobile app) | Must | Kiosk logs the user in within a few seconds of approval; QR expires quickly and works once. |
| F2 | PIN creation, storage and verification | Must | PIN is hashed; lockout after repeated wrong entries. |
| F3 | Personal QR login, mode B (scan phone or metro-style slip) | Should | Kiosk scans QR and requires PIN to proceed. |
| F4 | User code + PIN fallback | Should | User without phone or slip can still log in. |
| F5 | Enrollment and profile (name, goal, level) | Must | Account created via mobile app with PIN set. |
| F6 | Weekly plan assignment from templates | Must | New user gets a starter plan; plan visible on kiosk and app. |
| F7 | Location equipment profile and filtering | Must | Only exercises for installed machines or no-equipment cardio are offered. |
| F8 | Tiredness rating and intensity rules | Must | Rating captured each session; intensity adjusts by documented rules. |
| F9 | Exercise tutorial (2D/3D) plus voice talk-back | Must | Every exercise has a tutorial and audio in each supported language. |
| F10 | Multi-language UI and audio (English + one more) | Must | User can switch language on kiosk and app. |
| F11 | Guided delivery: Start, Leave kiosk, Done, next exercise | Must | User receives next exercise on return without typing any numbers. |
| F12 | Parked sessions sidebar, PIN-protected | Must | Several sessions can be parked; only the owner can resume with PIN. |
| F13 | Auto-park on idle and auto-erase on timeout | Must | Timers configurable; erased sessions are unrecoverable by others. |
| F14 | Concurrent-session data capture | Should | Count of active and parked sessions logged per kiosk over time. |
| F15 | Session history (completed workouts) in mobile app | Should | User can view past completed sessions. |
| F16 | Manual logging of sets/reps/weight | Dropped | Not in Phase 1. |
| F17 | Fingerprint login | Dropped | Replaced by QR and PIN. |
| F18 | Camera-based form feedback | Dropped | Not planned for Phase 1; revisit later. |
| F19 | Cross-location account and park/home continuity | Later | Data model ready; feature not built. |

## 11. Non-Functional Requirements

- **Speed:** login to first exercise in a few seconds; target to be validated in the pilot.
- **Outdoor readiness:** screen readable in sunlight; QR scanning works in glare **\[Assumption\]**.
- **Connectivity:** handle weak or intermittent network with local caching and later sync **\[Assumption\]**.
- **Reliability:** kiosk recovers automatically after crash, reboot or power loss.
- **Durability:** hardware suited to weather, dust, heat, shared use and vandalism.
- **Accessibility:** large touch targets, simple language, audio support for people who prefer listening.

## 12. Privacy, Security and Legal

Fingerprints are no longer collected, which removes biometric data from scope. Personal data (name, optional phone number, workout and tiredness data) still applies.

- Store PINs only as salted hashes; rate-limit and lock out repeated wrong attempts.
- QR codes are random, unguessable tokens. The kiosk QR is short-lived and single-use. Personal QRs can be revoked and regenerated, and a PIN is required for anything sensitive.
- The sidebar shows only nickname and current exercise, never full names or history.
- Explicit consent at sign-up, with an option to delete the account and all data.
- Comply with India’s Digital Personal Data Protection Act, 2023 and other applicable laws **\[Assumption: India-first\]**. Needs legal review.
- Encrypt data in transit and at rest.
- Fatigue and form advice are general guidance, not medical advice; show a short disclaimer at enrollment.

## 13. Technical Considerations

**QR login handshake (mode A)**

1. Kiosk requests a one-time login token from the backend and displays it as a QR.
2. Member’s app scans it and sends the token together with their authenticated session.
3. Backend verifies, marks the token used, and pushes a session to that kiosk.
4. Kiosk loads the member’s data. Token expires if unused.

**Core data entities:** User, PIN credential, Location, Kiosk, Equipment profile (per location), Exercise (with media and per-language audio), Plan template, User plan, Session (active/parked/ended), Exercise attempt (started/completed), Tiredness rating, Concurrency snapshot.

**Notes**

- Design the data model account-first, not location-first, so the later ecosystem needs no rework.
- Parked sessions live on the server, keyed by user, so a user could later resume at a different kiosk.
- Content pipeline is a dependency: tutorials (2D/3D) and recorded audio per language for each exercise.
- Hardware is simpler than v0.1: a touchscreen and camera for QR scanning (mode B). No fingerprint scanner.

## 14. Screen List (for design and build)

**Kiosk:** idle with login QR; login options (QR scan, code + PIN); PIN entry; tiredness rating; today’s workout; exercise detail (tutorial, voice, language switch, Start/Leave); parked sessions sidebar; resume with PIN; session end and log out; error and offline states.

**Mobile app:** welcome and sign-up; profile and goal; set PIN; scan kiosk QR; my QR; weekly plan; session history; language and privacy settings.

## 15. Success Metrics

- Sign-ups per kiosk and sign-up completion rate.
- Sessions started per kiosk per week.
- Return-to-kiosk rate within a session (exercise-to-exercise continuation).
- Workout completion rate versus plan.
- 4-week retention.
- Average and peak concurrent parked sessions per kiosk.
- Tiredness rating completion rate.
- Language split and voice talk-back usage.

## 16. Phasing

| Phase | Scope |
| --- | --- |
| **Phase 1 (this PRD)** | Simple kiosk setup: QR + PIN access, personalised workout, equipment-aware plan, tiredness rating, 2D/3D tutorial with voice talk-back, multi-language, parked sessions. |
| **Phase 2** | Progress history and insights, more plan templates, enrollment at kiosk, multiple parks and operators **\[Assumption\]**. |
| **Phase 3** | Cross-location ecosystem, outdoor and home variants of plans, operator dashboard, further features such as wearables. |

## 17. Risks

- Lost or shared phones, QR slips and PINs; PIN shoulder-surfing in public.
- Parked sessions abandoned, cluttering the sidebar.
- Outdoor hardware: weather, glare, power, connectivity and vandalism.
- Users without smartphones or mobile data cannot use mode A.
- Content production cost for tutorials and recorded audio in several languages.
- Park permissions and operator buy-in.
- Fatigue and form guidance must not be presented as medical advice (injury liability).

## 18. Open Questions for the Founder

1. Phase 1 location: confirm public park outdoor gyms only, or also indoor gyms?
2. Which additional language first (Hindi?) and who records the voice talk-back?
3. QR login: is mode A (kiosk QR scanned by phone) the primary, and is the metro-style slip needed in Phase 1?
4. Do we require a smartphone to enroll, or must enrollment work at the kiosk alone?
5. PIN length (4 or 6 digits) and parked-session timeout (suggested 60 minutes)?
6. What does the tiredness scale look like (1 to 5, 1 to 10, faces), and when is it asked?
7. Who creates the 2D/3D tutorials, and what is the first exercise list per machine type?
8. Who owns equipment profiles per park, and how are they kept up to date?
9. Who pays: operators, members, sponsors? Business model?
10. Target city and first pilot park(s)? Product name and branding?

## 19. Build Order for MVP Development

1. Confirm open questions 1 to 5 and freeze Phase 1 scope.
2. Set up backend: users, PIN credentials, locations, kiosks, equipment profiles, sessions.
3. Build QR login handshake and PIN security.
4. Build kiosk shell: idle, login, today’s workout, exercise detail, parked sidebar.
5. Build mobile app minimum: sign-up, scan QR, my QR, plan.
6. Load starter exercise library, plan templates and intensity rules.
7. Add tutorials, voice talk-back and the second language.
8. Pilot at one park, collect the Section 15 metrics, then iterate.
