const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { mkdtemp, readFile, rm } = require("node:fs/promises");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");
const { after, before, test } = require("node:test");

const root = path.join(__dirname, "..");
let tempDirectory;
let baseUrl;
let serverProcess;
let nextTestPhone = 7000000001;

async function unusedPort() {
  const server = net.createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function post(route, body, token) {
  const response = await fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });
  return { status: response.status, body: await response.json() };
}

async function enroll(nickname, goal = "strength", phoneNumber = `+91${nextTestPhone++}`) {
  const response = await post("/api/enroll", {
    nickname,
    phoneNumber,
    goal,
    level: "beginner",
    language: "en",
    pin: "1234",
    consent: true
  });
  assert.equal(response.status, 201);
  return { ...response.body, testPhone: phoneNumber };
}

before(async () => {
  tempDirectory = await mkdtemp(path.join(os.tmpdir(), "park-kiosk-test-"));
  const port = await unusedPort();
  baseUrl = `http://127.0.0.1:${port}`;
  serverProcess = spawn(process.execPath, [path.join(root, "server.js")], {
    cwd: root,
    env: { ...process.env, PORT: String(port), DATA_FILE: path.join(tempDirectory, "store.json") },
    stdio: "ignore"
  });
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/bootstrap`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("The MVP server did not start.");
});

after(async () => {
  if (serverProcess && !serverProcess.killed) serverProcess.kill();
  if (tempDirectory) await rm(tempDirectory, { recursive: true, force: true });
});

test("enrollment normalizes a unique mobile number and stores only a hashed PIN", async () => {
  const health = await fetch(`${baseUrl}/healthz`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: "ok" });

  const missingAsset = await fetch(`${baseUrl}/favicon.ico`);
  assert.equal(missingAsset.status, 404);
  assert.equal((await fetch(`${baseUrl}/api/bootstrap`)).status, 200);

  const result = await enroll("Asha");
  assert.equal(result.user.weeklyPlan.length, 7);
  assert.equal(result.user.weeklyPlan.some((day) => day.exercises.length === 0), true);
  assert.equal(result.user.phoneNumber, undefined);
  assert.equal(result.user.hasCustomPlan, false);

  const signedIn = await post("/api/login", {
    phoneNumber: `0${result.testPhone.slice(3)}`,
    pin: "1234"
  });
  assert.equal(signedIn.status, 200);
  assert.equal(signedIn.body.user.phoneNumber, undefined);

  const duplicate = await post("/api/enroll", {
    nickname: "Asha 2",
    phoneNumber: `0${result.testPhone.slice(3)}`,
    goal: "strength",
    level: "beginner",
    language: "en",
    pin: "1234",
    consent: true
  });
  assert.equal(duplicate.status, 409);

  const stored = JSON.parse(await readFile(path.join(tempDirectory, "store.json"), "utf8"));
  assert.equal(stored.users[0].pinHash.includes("1234"), false);
  assert.equal(stored.users[0].pinSalt.length > 0, true);
  assert.equal(stored.users[0].phoneNumber, result.testPhone);
  assert.equal(stored.users[0].userCode, undefined);
});

test("kiosk QR approval is one-time and starts a fatigue-adjusted parked workout", async () => {
  const member = await enroll("Dev");
  const startQr = await post("/api/login/qr", {});
  assert.equal(startQr.status, 201);
  assert.match(startQr.body.qr, /^data:image\/png;base64,/);

  const approval = await post("/api/login/approve", {
    id: startQr.body.id,
    phoneNumber: member.testPhone,
    pin: "1234"
  });
  assert.equal(approval.status, 200);
  const signedIn = await fetch(`${baseUrl}/api/login/qr/${startQr.body.id}`);
  const login = await signedIn.json();
  assert.equal(login.status, "approved");
  assert.ok(login.authToken);

  const repeatedPoll = await fetch(`${baseUrl}/api/login/qr/${startQr.body.id}`);
  assert.equal(repeatedPoll.status, 410);

  const started = await post("/api/workout/start", { fatigue: 4 }, login.authToken);
  assert.equal(started.status, 201);
  assert.ok(started.body.workout.exercises.length > 0);
  assert.equal(started.body.workout.exercises.every((exercise) =>
    exercise.machine === "cardio"
      ? exercise.adjustedReps < exercise.reps
      : exercise.adjustedSets < exercise.sets
  ), true);

  const parked = await post("/api/workout/park", {}, login.authToken);
  assert.equal(parked.status, 200);
  const sessions = await (await fetch(`${baseUrl}/api/bootstrap`)).json();
  assert.equal(sessions.parked.length, 1);
  assert.equal(sessions.parked[0].nickname, "Dev");

  const resumed = await post(`/api/workout/resume/${started.body.workout.id}`, { pin: "1234" });
  assert.equal(resumed.status, 200);
  assert.equal(resumed.body.workout.status, "active");
});

test("moderate tiredness trims both machine and cardio targets", async () => {
  const member = await enroll("Ravi", "fitness");
  const started = await post("/api/workout/start", { fatigue: 3 }, member.authToken);
  assert.equal(started.status, 201);
  assert.ok(started.body.workout.exercises.length > 0);
  assert.equal(started.body.workout.exercises.every((exercise) =>
    exercise.machine === "cardio"
      ? exercise.adjustedReps < exercise.reps
      : exercise.adjustedSets < exercise.sets || exercise.adjustedReps < exercise.reps
  ), true);
});

test("repeated incorrect PINs lock out further attempts", async () => {
  const member = await enroll("Mina");
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await post("/api/login", { phoneNumber: member.testPhone, pin: "0000" });
    assert.equal(response.status, 401);
  }
  const locked = await post("/api/login", { phoneNumber: member.testPhone, pin: "1234" });
  assert.equal(locked.status, 429);
});

test("custom weekly plans persist and use member-selected targets", async () => {
  const member = await enroll("Ira");
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const today = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "long" }).format(new Date());
  const todayIndex = weekdays.indexOf(today);
  const days = Array.from({ length: 7 }, () => []);
  days[todayIndex] = [{ exerciseId: "chest-press", sets: 4, reps: 15 }];

  const saved = await post("/api/plan", { days }, member.authToken);
  assert.equal(saved.status, 200);
  assert.equal(saved.body.user.hasCustomPlan, true);
  assert.equal(saved.body.user.weeklyPlan[todayIndex].exercises[0].id, "chest-press");
  const signedIn = await post("/api/login", { phoneNumber: member.testPhone, pin: "1234" });
  assert.equal(signedIn.status, 200);
  assert.equal(signedIn.body.user.weeklyPlan[todayIndex].exercises[0].reps, 15);

  const started = await post("/api/workout/start", { fatigue: 1 }, member.authToken);
  assert.equal(started.status, 201);
  assert.equal(started.body.workout.exercises[0].adjustedSets, 4);
  assert.equal(started.body.workout.exercises[0].adjustedReps, 15);

  const blockedEdit = await post("/api/plan", { days }, member.authToken);
  assert.equal(blockedEdit.status, 409);
});

test("custom plans reject unavailable exercises and invalid targets", async () => {
  const member = await enroll("Noor");
  const days = Array.from({ length: 7 }, () => []);
  const today = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "long" }).format(new Date());
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const todayIndex = weekdays.indexOf(today);
  days[todayIndex] = [{ exerciseId: "unknown-exercise", sets: 3, reps: 10 }];
  const unavailable = await post("/api/plan", { days }, member.authToken);
  assert.equal(unavailable.status, 400);

  days[todayIndex] = [{ exerciseId: "brisk-walk", sets: 1, reps: 90 }];
  const invalidDuration = await post("/api/plan", { days }, member.authToken);
  assert.equal(invalidDuration.status, 400);
});

test("member can restore the suggested plan after saving a custom plan", async () => {
  const member = await enroll("Rey");
  const today = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "long" }).format(new Date());
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const days = Array.from({ length: 7 }, () => []);
  days[weekdays.indexOf(today)] = [{ exerciseId: "brisk-walk", sets: 1, reps: 10 }];
  const saved = await post("/api/plan", { days }, member.authToken);
  assert.equal(saved.status, 200);

  const reset = await fetch(`${baseUrl}/api/plan`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${member.authToken}` }
  });
  assert.equal(reset.status, 200);
  const result = await reset.json();
  assert.equal(result.user.hasCustomPlan, false);
  const defaultStrength = [
    ["chest-press", "seated-row"],
    [],
    ["leg-press"],
    [],
    ["chest-press", "shoulder-press"],
    [],
    ["brisk-walk"]
  ];
  assert.deepEqual(
    result.user.weeklyPlan[weekdays.indexOf(today)].exercises.map((exercise) => exercise.id),
    defaultStrength[weekdays.indexOf(today)]
  );
});
