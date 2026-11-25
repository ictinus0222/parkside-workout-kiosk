const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const QRCode = require("qrcode");

const PORT = Number(process.env.PORT || 3000);
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, "data", "store.json");
const PARK_TIMEOUT_MS = 120 * 60 * 1000;
const QR_TIMEOUT_MS = 2 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;
const MAX_PIN_FAILURES = 5;

const exercises = [
  {
    id: "chest-press",
    machine: "chest-press",
    names: { en: "Chest press", hi: "चेस्ट प्रेस" },
    description: {
      en: "Sit tall with your back supported. Push the handles forward smoothly, then return with control.",
      hi: "पीठ को सहारा देकर सीधे बैठें। हैंडल को धीरे से आगे धकेलें और नियंत्रित तरीके से वापस लाएँ।"
    },
    feel: {
      en: "Feel your chest and the backs of your upper arms working. Stop if you feel sharp pain.",
      hi: "छाती और ऊपरी बाँहों के पिछले हिस्से में काम महसूस करें। तेज़ दर्द हो तो रुकें।"
    },
    mistakes: {
      en: "Avoid locking your elbows or arching your lower back.",
      hi: "कोहनियों को पूरी तरह लॉक न करें और कमर को ज़्यादा न मोड़ें।"
    },
    sets: 3,
    reps: 10
  },
  {
    id: "seated-row",
    machine: "seated-row",
    names: { en: "Seated row", hi: "सीटेड रो" },
    description: {
      en: "Sit upright, hold the handles, and draw them toward your waist. Slowly extend your arms again.",
      hi: "सीधे बैठकर हैंडल पकड़ें और उन्हें कमर की ओर खींचें। फिर धीरे-धीरे बाँहें सीधी करें।"
    },
    feel: {
      en: "Feel the muscles between your shoulder blades and your upper back. Stop for sharp pain.",
      hi: "कंधे की हड्डियों के बीच और ऊपरी पीठ में काम महसूस करें। तेज़ दर्द हो तो रुकें।"
    },
    mistakes: {
      en: "Keep your shoulders relaxed; do not rock your body to move the handles.",
      hi: "कंधों को ढीला रखें; हैंडल खींचने के लिए शरीर को झटका न दें।"
    },
    sets: 3,
    reps: 10
  },
  {
    id: "leg-press",
    machine: "leg-press",
    names: { en: "Leg press", hi: "लेग प्रेस" },
    description: {
      en: "Place your feet about hip-width apart. Press the platform away, then bend your knees slowly.",
      hi: "पैरों को कूल्हों की चौड़ाई पर रखें। प्लेटफ़ॉर्म को दूर धकेलें, फिर घुटनों को धीरे मोड़ें।"
    },
    feel: {
      en: "Feel your thighs and glutes working. Keep the movement comfortable and stop for sharp pain.",
      hi: "जाँघों और कूल्हों में काम महसूस करें। आरामदायक सीमा में चलें और तेज़ दर्द पर रुकें।"
    },
    mistakes: {
      en: "Do not lock your knees or let them collapse inward.",
      hi: "घुटनों को लॉक न करें और उन्हें अंदर की ओर न गिरने दें।"
    },
    sets: 3,
    reps: 10
  },
  {
    id: "shoulder-press",
    machine: "shoulder-press",
    names: { en: "Shoulder press", hi: "शोल्डर प्रेस" },
    description: {
      en: "Sit with your back supported. Press the handles up smoothly, then lower them with control.",
      hi: "पीठ को सहारा देकर बैठें। हैंडल को धीरे से ऊपर दबाएँ और नियंत्रित तरीके से नीचे लाएँ।"
    },
    feel: {
      en: "Feel your shoulders working. Use a comfortable range and stop if there is sharp pain.",
      hi: "कंधों में काम महसूस करें। आरामदायक सीमा में चलें और तेज़ दर्द हो तो रुकें।"
    },
    mistakes: {
      en: "Avoid shrugging your shoulders or forcing the handles overhead.",
      hi: "कंधों को कानों की ओर न उचकाएँ और हैंडल को ज़ोर लगाकर ऊपर न धकेलें।"
    },
    sets: 2,
    reps: 10
  },
  {
    id: "brisk-walk",
    machine: "cardio",
    names: { en: "Brisk walk", hi: "तेज़ चाल से चलना" },
    description: {
      en: "Walk on a clear, level path at a pace where you can still speak in short sentences.",
      hi: "साफ़ और समतल रास्ते पर ऐसी तेज़ चाल से चलें कि छोटे वाक्य बोल सकें।"
    },
    feel: {
      en: "You should feel warmer and breathe a little faster, but remain in control. Slow down if needed.",
      hi: "शरीर गर्म और साँस थोड़ी तेज़ महसूस होनी चाहिए, लेकिन नियंत्रण में। ज़रूरत हो तो धीमे चलें।"
    },
    mistakes: {
      en: "Do not push through dizziness, chest discomfort, or unusual shortness of breath.",
      hi: "चक्कर, सीने में असहजता या असामान्य साँस फूलने पर जारी न रखें।"
    },
    sets: 1,
    reps: 5,
    unit: "min"
  }
];

const machineNames = {
  "chest-press": "Chest press",
  "seated-row": "Seated row",
  "leg-press": "Leg press",
  "shoulder-press": "Shoulder press"
};
const weeklyPlans = {
  strength: [
    ["chest-press", "seated-row"],
    [],
    ["leg-press"],
    [],
    ["chest-press", "shoulder-press"],
    [],
    ["brisk-walk"]
  ],
  fitness: [
    ["brisk-walk", "leg-press"],
    [],
    ["chest-press", "seated-row"],
    ["brisk-walk"],
    [],
    ["leg-press", "shoulder-press"],
    []
  ],
  mobility: [
    ["brisk-walk"],
    [],
    ["leg-press"],
    [],
    ["brisk-walk"],
    [],
    ["brisk-walk"]
  ]
};
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const sessions = new Map();
const loginIntents = new Map();
const pinFailures = new Map();
let store;

function normalizePhoneNumber(value) {
  const input = String(value || "").trim();
  if (!/^\+?[0-9\s()-]+$/.test(input)) return null;
  const digits = input.replace(/\D/g, "");
  const national = digits.startsWith("91") && digits.length === 12
    ? digits.slice(2)
    : digits.startsWith("0") && digits.length === 11
      ? digits.slice(1)
      : digits;
  return /^[6-9]\d{9}$/.test(national) ? `+91${national}` : null;
}

function exercisesForDay(user, dayIndex) {
  if (Array.isArray(user.customPlan)) {
    return user.customPlan[dayIndex].map((item) => {
      const exercise = exercises.find((candidate) => candidate.id === item.exerciseId);
      return exercise && (exercise.machine === "cardio" || user.equipment.includes(exercise.machine))
        ? { ...exercise, sets: item.sets, reps: item.reps, customTargets: true }
        : null;
    }).filter(Boolean);
  }
  const ids = (weeklyPlans[user.goal] || weeklyPlans.strength)[dayIndex];
  return ids
    .map((id) => exercises.find((exercise) => exercise.id === id))
    .filter((exercise) => exercise && (exercise.machine === "cardio" || user.equipment.includes(exercise.machine)));
}

function weeklyPlanFor(user) {
  return weekdays.map((day, index) => ({
    day,
    exercises: exercisesForDay(user, index).map((exercise) => ({
      id: exercise.id,
      name: exercise.names[user.language] || exercise.names.en,
      sets: exercise.sets,
      reps: exercise.reps,
      unit: exercise.unit || "reps"
    }))
  }));
}

function readStore() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return { users: [], workouts: [] };
  }
}

function saveStore() {
  const tmpFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(store, null, 2), { mode: 0o600 });
  fs.renameSync(tmpFile, DATA_FILE);
}

function publicUser(user) {
  return {
    id: user.id,
    nickname: user.nickname,
    goal: user.goal,
    level: user.level,
    language: user.language,
    hasCustomPlan: Array.isArray(user.customPlan),
    weeklyPlan: weeklyPlanFor(user)
  };
}

function authResult(user) {
  const workout = activeFor(user.id);
  return {
    authToken: createAuth(user.id),
    user: publicUser(user),
    ...(workout ? { workout: sanitizedWorkout(workout) } : {})
  };
}

function createAuth(userId) {
  const token = crypto.randomBytes(32).toString("base64url");
  sessions.set(token, { userId, expiresAt: Date.now() + PARK_TIMEOUT_MS });
  return token;
}

function clearExpired() {
  const now = Date.now();
  for (const [id, intent] of loginIntents) {
    if (intent.expiresAt <= now || intent.status === "used") loginIntents.delete(id);
  }
  for (const [token, auth] of sessions) {
    if (auth.expiresAt <= now) sessions.delete(token);
  }
  const before = store.workouts.length;
  store.workouts = store.workouts.filter((workout) =>
    workout.status === "active" || workout.status === "parked"
      ? workout.expiresAt > now
      : true
  );
  if (before !== store.workouts.length) saveStore();
}

function rateLimitKey(phoneNumber, request) {
  const normalized = normalizePhoneNumber(phoneNumber) || String(phoneNumber || "").replace(/\D/g, "").slice(0, 20);
  return `${normalized}:${request.socket.remoteAddress || "unknown"}`;
}

function checkPinAttempt(phoneNumber, request) {
  const entry = pinFailures.get(rateLimitKey(phoneNumber, request));
  if (entry && entry.lockedUntil > Date.now()) {
    const seconds = Math.ceil((entry.lockedUntil - Date.now()) / 1000);
    throw Object.assign(new Error(`Too many attempts. Try again in ${seconds} seconds.`), { status: 429 });
  }
}

function recordPinFailure(phoneNumber, request) {
  const key = rateLimitKey(phoneNumber, request);
  const entry = pinFailures.get(key) || { failures: 0, lockedUntil: 0 };
  entry.failures += 1;
  if (entry.failures >= MAX_PIN_FAILURES) {
    entry.failures = 0;
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
  }
  pinFailures.set(key, entry);
}

function clearPinFailures(phoneNumber, request) {
  pinFailures.delete(rateLimitKey(phoneNumber, request));
}

function verifyPin(phoneNumber, pin, request) {
  checkPinAttempt(phoneNumber, request);
  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  const user = normalizedPhone && store.users.find((item) => item.phoneNumber === normalizedPhone);
  if (!user || !/^\d{4}$/.test(String(pin || ""))) {
    recordPinFailure(phoneNumber, request);
    throw Object.assign(new Error("Mobile number or PIN is incorrect."), { status: 401 });
  }
  const candidate = crypto.scryptSync(String(pin), user.pinSalt, 64);
  const expected = Buffer.from(user.pinHash, "hex");
  if (candidate.length !== expected.length || !crypto.timingSafeEqual(candidate, expected)) {
    recordPinFailure(phoneNumber, request);
    throw Object.assign(new Error("Mobile number or PIN is incorrect."), { status: 401 });
  }
  clearPinFailures(phoneNumber, request);
  return user;
}
function workoutFor(user) {
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "long" }).format(new Date());
  const dayIndex = Math.max(0, weekdays.indexOf(weekday));
  return exercisesForDay(user, dayIndex);
}

function sanitizedWorkout(workout) {
  const user = store.users.find((item) => item.id === workout.userId);
  const list = Array.isArray(workout.exercisePlan)
    ? workout.exercisePlan.map((item) => {
      const exercise = exercises.find((candidate) => candidate.id === item.exerciseId);
      return exercise ? { ...exercise, sets: item.sets, reps: item.reps, customTargets: item.customTargets } : null;
    }).filter(Boolean)
    : workoutFor(user);
  const adjustedExercises = list.map((exercise) => {
    const baseSets = exercise.customTargets ? exercise.sets : Math.max(1, exercise.sets - (user.level === "beginner" ? 1 : 0));
    const baseReps = exercise.customTargets ? exercise.reps : Math.max(6, exercise.reps - (user.level === "beginner" ? 2 : 0));
    const fatigueFactor = workout.fatigue === 3 ? 0.85 : 0.7;
    return {
      ...exercise,
      customTargets: undefined,
      adjustedSets: workout.fatigue >= 4
        ? Math.max(1, Math.ceil(baseSets / 2))
        : workout.fatigue === 3
          ? Math.max(1, Math.floor(baseSets * 0.75))
          : baseSets,
      adjustedReps: exercise.unit === "min"
        ? workout.fatigue >= 4
          ? Math.max(2, Math.ceil(exercise.reps * 0.7))
          : workout.fatigue === 3
            ? Math.max(3, Math.round(exercise.reps * fatigueFactor))
            : exercise.reps
        : workout.fatigue >= 3
          ? Math.max(5, Math.round(baseReps * fatigueFactor))
          : baseReps
    };
  });
  return {
    id: workout.id,
    status: workout.status,
    fatigue: workout.fatigue,
    currentIndex: workout.currentIndex,
    exercises: adjustedExercises
  };
}

function requireAuth(request) {
  const token = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const auth = sessions.get(token);
  if (!auth || auth.expiresAt <= Date.now()) {
    if (token) sessions.delete(token);
    throw Object.assign(new Error("Your kiosk session expired. Please sign in again."), { status: 401 });
  }
  auth.expiresAt = Date.now() + PARK_TIMEOUT_MS;
  const user = store.users.find((item) => item.id === auth.userId);
  if (!user) throw Object.assign(new Error("Account not found."), { status: 401 });
  if (!user.phoneNumber) {
    throw Object.assign(new Error("This account needs to be enrolled again with a mobile number."), { status: 401 });
  }
  return { token, user };
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(value));
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 16_384) throw Object.assign(new Error("Request is too large."), { status: 413 });
  }
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    throw Object.assign(new Error("Request body must be valid JSON."), { status: 400 });
  }
}

function activeFor(userId) {
  return store.workouts.find((workout) => workout.userId === userId && workout.status === "active");
}

function availableParked() {
  const now = Date.now();
  return store.workouts
    .filter((workout) => workout.status === "parked" && workout.expiresAt > now)
    .map((workout) => {
      const owner = store.users.find((user) => user.id === workout.userId);
      if (!owner || !owner.phoneNumber) return null;
      const list = workoutFor(owner);
      return {
        id: workout.id,
        nickname: owner.nickname,
        exercise: (workout.exercisePlan
          ? exercises.find((exercise) => exercise.id === workout.exercisePlan[workout.currentIndex]?.exerciseId)
          : list[workout.currentIndex])?.names.en || "Workout complete"
      };
    }).filter(Boolean);
}

async function route(request, response) {
  clearExpired();
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const body = request.method === "GET" ? {} : await readJson(request);

  if (request.method === "GET" && url.pathname === "/api/bootstrap") {
    return sendJson(response, 200, {
      location: { name: "Riverside Park", equipment: Object.keys(machineNames) },
      exercises: exercises.map(({ id, machine, names }) => ({ id, machine, names })),
      parked: availableParked()
    });
  }

  if (request.method === "POST" && url.pathname === "/api/enroll") {
    const nickname = String(body.nickname || "").trim().slice(0, 24);
    const pin = String(body.pin || "");
    const phoneNumber = normalizePhoneNumber(body.phoneNumber);
    const goal = ["strength", "fitness", "mobility"].includes(body.goal) ? body.goal : "";
    const level = ["beginner", "regular"].includes(body.level) ? body.level : "";
    const language = ["en", "hi"].includes(body.language) ? body.language : "";
    if (nickname.length < 2 || !phoneNumber || !goal || !level || !language || !/^\d{4}$/.test(pin) || body.consent !== true) {
      return sendJson(response, 400, { error: "Enter a valid Indian mobile number, nickname, goal, experience level, four-digit PIN and accept the safety notice." });
    }
    if (store.users.some((item) => item.phoneNumber === phoneNumber)) {
      return sendJson(response, 409, { error: "An account already uses this mobile number. Sign in with your PIN." });
    }
    const pinSalt = crypto.randomBytes(16).toString("hex");
    const pinHash = crypto.scryptSync(pin, pinSalt, 64).toString("hex");
    const user = {
      id: crypto.randomUUID(),
      phoneNumber,
      nickname,
      goal,
      level,
      language,
      pinSalt,
      pinHash,
      equipment: Object.keys(machineNames),
      createdAt: new Date().toISOString()
    };
    store.users.push(user);
    saveStore();
    return sendJson(response, 201, { authToken: createAuth(user.id), user: publicUser(user) });
  }

  if (request.method === "POST" && url.pathname === "/api/login") {
    const user = verifyPin(body.phoneNumber, body.pin, request);
    return sendJson(response, 200, authResult(user));
  }

  if (request.method === "POST" && url.pathname === "/api/login/qr") {
    const id = crypto.randomBytes(24).toString("base64url");
    loginIntents.set(id, { status: "pending", expiresAt: Date.now() + QR_TIMEOUT_MS });
    const originUrl = new URL(process.env.PUBLIC_BASE_URL || `http://${request.headers.host || `localhost:${PORT}`}`);
    if (!["http:", "https:"].includes(originUrl.protocol)) {
      throw new Error("PUBLIC_BASE_URL must use HTTP or HTTPS.");
    }
    const origin = originUrl.origin;
    const approvalUrl = `${origin}/?approve=${encodeURIComponent(id)}`;
    const qr = await QRCode.toDataURL(approvalUrl, { errorCorrectionLevel: "M", margin: 2, width: 280 });
    return sendJson(response, 201, { id, qr, approvalUrl, expiresIn: QR_TIMEOUT_MS });
  }

  const qrPoll = url.pathname.match(/^\/api\/login\/qr\/([A-Za-z0-9_-]+)$/);
  if (request.method === "GET" && qrPoll) {
    const intent = loginIntents.get(qrPoll[1]);
    if (!intent || intent.expiresAt <= Date.now()) return sendJson(response, 410, { status: "expired" });
    if (intent.status === "pending") return sendJson(response, 200, { status: "pending" });
    const user = store.users.find((item) => item.id === intent.userId);
    intent.status = "used";
    return sendJson(response, 200, { status: "approved", authToken: intent.authToken, user: publicUser(user), ...(activeFor(user.id) ? { workout: sanitizedWorkout(activeFor(user.id)) } : {}) });
  }

  if (request.method === "POST" && url.pathname === "/api/login/approve") {
    const intent = loginIntents.get(String(body.id || ""));
    if (!intent || intent.expiresAt <= Date.now() || intent.status !== "pending") {
      return sendJson(response, 410, { error: "This kiosk QR has expired. Refresh it and try again." });
    }
    const user = verifyPin(body.phoneNumber, body.pin, request);
    intent.userId = user.id;
    intent.authToken = createAuth(user.id);
    intent.status = "approved";
    return sendJson(response, 200, { approved: true, nickname: user.nickname });
  }

  if (request.method === "GET" && url.pathname === "/api/me") {
    const { user } = requireAuth(request);
    const workout = activeFor(user.id);
    return sendJson(response, 200, {
      user: publicUser(user),
      workout: workout ? sanitizedWorkout(workout) : null,
      parked: availableParked()
    });
  }

  if (request.method === "POST" && url.pathname === "/api/plan") {
    const { user } = requireAuth(request);
    if (store.workouts.some((workout) => workout.userId === user.id && ["active", "parked"].includes(workout.status))) {
      return sendJson(response, 409, { error: "Finish or end your current workout before changing your plan." });
    }
    if (!Array.isArray(body.days) || body.days.length !== 7) {
      return sendJson(response, 400, { error: "A custom plan must include all seven days of the week." });
    }
    const customPlan = [];
    for (const day of body.days) {
      if (!Array.isArray(day) || day.length > 4) {
        return sendJson(response, 400, { error: "Choose up to four exercises per day." });
      }
      const entries = [];
      const usedExercises = new Set();
      for (const item of day) {
        if (!item || typeof item !== "object" || typeof item.exerciseId !== "string") {
          return sendJson(response, 400, { error: "Each exercise needs a valid exercise selection." });
        }
        const exercise = exercises.find((candidate) => candidate.id === item.exerciseId);
        const isCardio = exercise?.unit === "min";
        const validSets = Number.isInteger(item.sets) && item.sets >= 1 && item.sets <= 5;
        const validReps = Number.isInteger(item.reps)
          && item.reps >= (isCardio ? 2 : 5)
          && item.reps <= (isCardio ? 60 : 30);
        if (!exercise || (exercise.machine !== "cardio" && !user.equipment.includes(exercise.machine))) {
          return sendJson(response, 400, { error: "A selected exercise is not available at this park." });
        }
        if (usedExercises.has(exercise.id)) {
          return sendJson(response, 400, { error: "Do not add the same exercise more than once in a day." });
        }
        if (!validSets || !validReps) {
          return sendJson(response, 400, { error: "Sets must be 1–5 and repetitions 5–30 (walking minutes 2–60)." });
        }
        usedExercises.add(exercise.id);
        entries.push({ exerciseId: exercise.id, sets: item.sets, reps: item.reps });
      }
      customPlan.push(entries);
    }
    if (!customPlan.some((day) => day.length > 0)) {
      return sendJson(response, 400, { error: "Add at least one exercise to your weekly plan." });
    }
    user.customPlan = customPlan;
    saveStore();
    return sendJson(response, 200, { user: publicUser(user) });
  }

  if (request.method === "DELETE" && url.pathname === "/api/plan") {
    const { user } = requireAuth(request);
    if (store.workouts.some((workout) => workout.userId === user.id && ["active", "parked"].includes(workout.status))) {
      return sendJson(response, 409, { error: "Finish or end your current workout before changing your plan." });
    }
    delete user.customPlan;
    saveStore();
    return sendJson(response, 200, { user: publicUser(user) });
  }

  if (request.method === "POST" && url.pathname === "/api/workout/start") {
    const { user } = requireAuth(request);
    const fatigue = Number(body.fatigue);
    if (!Number.isInteger(fatigue) || fatigue < 1 || fatigue > 5) {
      return sendJson(response, 400, { error: "Choose a tiredness rating from 1 to 5." });
    }
    if (store.workouts.some((workout) => workout.userId === user.id && ["active", "parked"].includes(workout.status))) {
      return sendJson(response, 409, { error: "You already have a workout in progress. Resume it from the parked sessions list." });
    }
    if (!workoutFor(user).length) {
      return sendJson(response, 409, { error: "Today is a rest day. Take it easy or use your phone to add a custom workout." });
    }
    const workout = {
      id: crypto.randomUUID(),
      userId: user.id,
      status: "active",
      fatigue,
      currentIndex: 0,
      exercisePlan: workoutFor(user).map((exercise) => ({
        exerciseId: exercise.id,
        sets: exercise.sets,
        reps: exercise.reps,
        customTargets: Boolean(exercise.customTargets)
      })),
      startedAt: new Date().toISOString(),
      expiresAt: Date.now() + PARK_TIMEOUT_MS
    };
    store.workouts.push(workout);
    saveStore();
    return sendJson(response, 201, { workout: sanitizedWorkout(workout) });
  }

  if (request.method === "POST" && url.pathname === "/api/workout/park") {
    const { token, user } = requireAuth(request);
    const workout = activeFor(user.id);
    if (!workout) return sendJson(response, 404, { error: "No active workout to park." });
    workout.status = "parked";
    workout.expiresAt = Date.now() + PARK_TIMEOUT_MS;
    sessions.delete(token);
    saveStore();
    return sendJson(response, 200, { parked: true });
  }

  if (request.method === "POST" && url.pathname === "/api/workout/done") {
    const { user } = requireAuth(request);
    const workout = activeFor(user.id);
    if (!workout) return sendJson(response, 404, { error: "No active workout found." });
    const list = Array.isArray(workout.exercisePlan)
      ? workout.exercisePlan
      : workoutFor(user).map((exercise) => ({ exerciseId: exercise.id }));
    if (workout.currentIndex >= list.length) return sendJson(response, 409, { error: "This workout is already complete." });
    workout.currentIndex += 1;
    workout.expiresAt = Date.now() + PARK_TIMEOUT_MS;
    if (workout.currentIndex >= list.length) {
      workout.status = "ended";
      workout.completedAt = new Date().toISOString();
    }
    saveStore();
    return sendJson(response, 200, { workout: sanitizedWorkout(workout) });
  }

  const resume = url.pathname.match(/^\/api\/workout\/resume\/([0-9a-f-]+)$/i);
  if (request.method === "POST" && resume) {
    const workout = store.workouts.find((item) => item.id === resume[1] && item.status === "parked");
    if (!workout) return sendJson(response, 404, { error: "This parked workout is no longer available." });
    const user = store.users.find((item) => item.id === workout.userId);
    if (!user?.phoneNumber) return sendJson(response, 404, { error: "This account needs to be enrolled again with a mobile number." });
    verifyPin(user.phoneNumber, body.pin, request);
    workout.status = "active";
    workout.expiresAt = Date.now() + PARK_TIMEOUT_MS;
    saveStore();
    return sendJson(response, 200, { authToken: createAuth(user.id), user: publicUser(user), workout: sanitizedWorkout(workout) });
  }

  if (request.method === "POST" && url.pathname === "/api/logout") {
    const { token, user } = requireAuth(request);
    sessions.delete(token);
    const workout = activeFor(user.id);
    if (workout) {
      workout.status = "ended";
      workout.completedAt = new Date().toISOString();
      saveStore();
    }
    return sendJson(response, 200, { loggedOut: true });
  }

  return sendJson(response, 404, { error: "Not found." });
}

function createServer() {
  store = readStore();
  let recoveredActiveSession = false;
  for (const workout of store.workouts) {
    if (workout.status === "active" && workout.expiresAt > Date.now()) {
      workout.status = "parked";
      recoveredActiveSession = true;
    }
  }
  if (recoveredActiveSession) saveStore();
  const publicDir = path.join(__dirname, "public");
  return http.createServer(async (request, response) => {
    try {
      if (request.method === "GET" && new URL(request.url, "http://localhost").pathname === "/healthz") {
        return sendJson(response, 200, { status: "ok" });
      }
      if (request.url.startsWith("/api/")) {
        await route(request, response);
        return;
      }
      const pathname = new URL(request.url, "http://localhost").pathname;
      const file = pathname === "/" ? "index.html" : path.basename(pathname);
      const filePath = path.join(publicDir, file);
      if (!filePath.startsWith(publicDir + path.sep)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }
      const contentTypes = {
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".svg": "image/svg+xml"
      };
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" });
        response.end("Not found");
        return;
      }
      response.writeHead(200, {
        "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'self' data:; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'"
      });
      const stream = fs.createReadStream(filePath);
      stream.on("error", (error) => {
        if (response.headersSent) return response.destroy(error);
        sendJson(response, 500, { error: "The requested file could not be served." });
      });
      stream.pipe(response);
    } catch (error) {
      if (response.headersSent) return response.destroy(error);
      sendJson(response, error.status || 500, { error: error.status ? error.message : "The request could not be completed." });
      if (!error.status) console.error(error);
    }
  });
}

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Park Workout Kiosk running at http://localhost:${PORT}`);
  });
}

module.exports = { createServer, PARK_TIMEOUT_MS, exercises, weeklyPlans };
