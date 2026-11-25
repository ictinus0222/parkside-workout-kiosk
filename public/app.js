const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const languageToggle = document.querySelector("#language-toggle");
const query = new URLSearchParams(location.search);
const approvalId = query.get("approve");
const translations = {
  en: {
    welcome: "A better workout starts here.",
    intro: "A simple plan, made for this park.",
    enrollTitle: "Create your free plan",
    signIn: "Continue your workout",
    newHere: "New here? Make a free plan",
    code: "Mobile number",
    pin: "4-digit PIN",
    phonePlaceholder: "+91 98765 43210",
    continue: "Continue",
    create: "Create my plan",
    nickname: "What should we call you?",
    goal: "Your goal",
    strength: "Get stronger",
    fitness: "General fitness",
    mobility: "Move more easily",
    level: "Experience",
    beginner: "I'm new to exercise",
    regular: "I exercise regularly",
    language: "Workout language",
    english: "English",
    hindi: "हिन्दी",
    consent: "I understand this is general fitness guidance, not medical advice. I will stop if I feel pain, dizziness or discomfort.",
    tired: "How tired do you feel today?",
    rested: "Fresh",
    exhausted: "Very tired",
    build: "Build my workout",
    workout: "Today's plan",
    exercise: "Exercise",
    of: "of",
    sets: "sets",
    reps: "reps",
    minutes: "minutes",
    feel: "How it should feel",
    avoid: "Keep in mind",
    speak: "Read this aloud",
    stop: "Stop voice",
    leave: "Leave kiosk",
    done: "Done — next exercise",
    finish: "Finish workout",
    parked: "Parked workouts",
    parkedEmpty: "No one is waiting right now.",
    resume: "Resume",
    logout: "End workout",
    qr: "Scan with your phone to sign in",
    qrHelp: "On your phone, scan this code and enter your mobile number and PIN to approve.",
    qrRefresh: "Get a new QR code",
    startWorkout: "Start workout",
    welcomeMember: "Welcome",
    progress: "Workout progress",
    disclaimer: "Move at a comfortable pace. This is general guidance, not medical advice. Stop if you feel pain, dizziness or unusual discomfort.",
    safetyTitle: "A quick safety note",
    pinHelp: "Your mobile number and PIN will be used to sign in.",
    approved: "Kiosk approved",
    approveHelp: "Enter your mobile number and PIN to approve this sign-in.",
    approve: "Approve kiosk sign-in",
    approveTitle: "Approve this kiosk sign-in",
    enterPinResume: "Enter your PIN to resume",
    phoneOwnershipNote: "Phone ownership is not verified in this prototype. Do not use a number you do not own.",
    cancel: "Cancel",
    hindiVoiceUnavailable: "Hindi speech isn't available on this device. Install a Hindi text-to-speech voice, then reload this page.",
    speechError: "Voice playback failed. Please try again.",
    expired: "This QR code has expired. Ask the kiosk for a new one.",
    timeout: "For your privacy, this workout will be removed after 2 hours away.",
    autoPark: "This screen will park your workout after 30 seconds without activity.",
    preWorkoutAutoLogout: "For privacy, this screen signs out after 30 seconds without activity.",
    goodJob: "Nice work. That's your plan for today.",
    back: "Back to kiosk",
    wait: "Waiting for approval…",
    restSuggestion: "You're feeling very tired. Keep this gentle, or choose a quiet walk and call it a day.",
    lighter: "We've made today's plan lighter based on your energy.",
    noPhone: "Your mobile number is your account sign-in.",
    restDay: "Rest day",
    restDayMessage: "Today is a rest day in your plan. Rest, or make changes to your plan on your phone.",
    customPlan: "Build my custom plan",
    customPlanTitle: "Your weekly workout",
    customPlanIntro: "Choose exercises and targets for each day. This editor is designed for phone-sized screens.",
    addExercise: "Add exercise",
    removeExercise: "Remove",
    savePlan: "Save my plan",
    useTemplate: "Use the suggested plan",
    exerciseChoice: "Choose an exercise",
    targetSets: "Sets",
    targetReps: "Reps / minutes",
    targetDuration: "Minutes",
    customPlanSaved: "Your custom plan is saved.",
    planPhoneOnly: "Open this page on a phone to edit your custom plan.",
    planPrototypeWarning: "Mobile numbers are not verified in this prototype.",
    error: "Something went wrong. Please try again."
  },
  hi: {
    welcome: "बेहतर कसरत की शुरुआत यहाँ से।",
    intro: "इस पार्क के लिए एक आसान योजना।",
    enrollTitle: "अपनी मुफ़्त योजना बनाएँ",
    signIn: "अपनी कसरत जारी रखें",
    newHere: "नए हैं? मुफ़्त योजना बनाएँ",
    code: "मोबाइल नंबर",
    pin: "4 अंकों का PIN",
    phonePlaceholder: "+91 98765 43210",
    continue: "जारी रखें",
    create: "मेरी योजना बनाएँ",
    nickname: "आपको किस नाम से बुलाएँ?",
    goal: "आपका लक्ष्य",
    strength: "ताकत बढ़ाएँ",
    fitness: "सामान्य फ़िटनेस",
    mobility: "आसानी से चलें-फिरें",
    level: "अनुभव",
    beginner: "मैं व्यायाम में नया/नई हूँ",
    regular: "मैं नियमित व्यायाम करता/करती हूँ",
    language: "कसरत की भाषा",
    english: "English",
    hindi: "हिन्दी",
    consent: "मैं समझता/समझती हूँ कि यह सामान्य फ़िटनेस मार्गदर्शन है, चिकित्सकीय सलाह नहीं। दर्द, चक्कर या असहजता होने पर रुकूँगा/रुकूँगी।",
    tired: "आज आप कितने थके हैं?",
    rested: "तरोताज़ा",
    exhausted: "बहुत थके",
    build: "मेरी कसरत बनाएँ",
    workout: "आज की योजना",
    exercise: "व्यायाम",
    of: "में से",
    sets: "सेट",
    reps: "दोहराव",
    minutes: "मिनट",
    feel: "शरीर में कैसा महसूस होना चाहिए",
    avoid: "ध्यान रखें",
    speak: "आवाज़ में सुनें",
    stop: "आवाज़ बंद करें",
    leave: "कियोस्क छोड़ें",
    done: "हो गया — अगला व्यायाम",
    finish: "कसरत पूरी करें",
    parked: "रुकी हुई कसरतें",
    parkedEmpty: "अभी कोई प्रतीक्षा नहीं कर रहा।",
    resume: "जारी रखें",
    logout: "कसरत समाप्त करें",
    qr: "साइन इन के लिए फ़ोन से स्कैन करें",
    qrHelp: "फ़ोन से कोड स्कैन करें और अनुमति देने के लिए मोबाइल नंबर व PIN डालें।",
    qrRefresh: "नया QR कोड पाएँ",
    orCode: "या सदस्य कोड इस्तेमाल करें",
    startWorkout: "कसरत शुरू करें",
    welcomeMember: "स्वागत है",
    progress: "कसरत की प्रगति",
    disclaimer: "आरामदायक गति से करें। यह सामान्य मार्गदर्शन है, चिकित्सकीय सलाह नहीं। दर्द, चक्कर या असामान्य असहजता पर रुकें।",
    safetyTitle: "सुरक्षा की छोटी-सी बात",
    pinHelp: "साइन इन के लिए आपका मोबाइल नंबर और PIN इस्तेमाल होगा।",
    approved: "कियोस्क की अनुमति मिल गई",
    approveHelp: "साइन इन की अनुमति देने के लिए मोबाइल नंबर और PIN डालें।",
    approve: "कियोस्क साइन-इन की अनुमति दें",
    approveTitle: "इस कियोस्क साइन-इन की अनुमति दें",
    enterPinResume: "जारी रखने के लिए PIN डालें",
    cancel: "रद्द करें",
    hindiVoiceUnavailable: "इस डिवाइस पर हिन्दी आवाज़ उपलब्ध नहीं है। हिन्दी टेक्स्ट-टू-स्पीच आवाज़ इंस्टॉल करके यह पेज फिर खोलें।",
    speechError: "आवाज़ नहीं चल पाई। कृपया फिर कोशिश करें।",
    expired: "यह QR कोड समाप्त हो गया है। कियोस्क से नया कोड लें।",
    timeout: "आपकी निजता के लिए, 2 घंटे बाद यह कसरत मिटा दी जाएगी।",
    autoPark: "30 सेकंड तक कोई गतिविधि न होने पर कसरत अपने-आप रुक जाएगी।",
    goodJob: "शानदार। आज की योजना पूरी हुई।",
    back: "कियोस्क पर जाएँ",
    wait: "अनुमति की प्रतीक्षा…",
    restSuggestion: "आप बहुत थके हैं। हल्का रखें, या आराम से टहलकर आज यहीं रुकें।",
    lighter: "आपकी ऊर्जा के अनुसार आज की योजना हल्की रखी गई है।",
    noPhone: "आपका मोबाइल नंबर आपका साइन-इन आईडी है।",
    preWorkoutAutoLogout: "निजता के लिए, 30 सेकंड तक कोई गतिविधि न होने पर साइन-आउट हो जाएगा।",
    phoneOwnershipNote: "इस प्रोटोटाइप में फ़ोन नंबर की पुष्टि नहीं होती। केवल अपना नंबर इस्तेमाल करें।",
    restDay: "आराम का दिन",
    restDayMessage: "आज आपकी योजना में आराम का दिन है। आराम करें या फ़ोन पर अपनी योजना बदलें।",
    customPlan: "अपनी योजना बनाएँ",
    customPlanTitle: "आपकी साप्ताहिक कसरत",
    customPlanIntro: "हर दिन के लिए व्यायाम और लक्ष्य चुनें। यह एडिटर फ़ोन स्क्रीन के लिए बनाया गया है।",
    addExercise: "व्यायाम जोड़ें",
    removeExercise: "हटाएँ",
    savePlan: "योजना सहेजें",
    useTemplate: "सुझाई गई योजना इस्तेमाल करें",
    exerciseChoice: "व्यायाम चुनें",
    targetSets: "सेट",
    targetReps: "दोहराव / मिनट",
    targetDuration: "मिनट",
    customPlanSaved: "आपकी कस्टम योजना सहेज दी गई है।",
    planPhoneOnly: "कस्टम योजना बदलने के लिए यह पेज फ़ोन पर खोलें।",
    planPrototypeWarning: "इस प्रोटोटाइप में मोबाइल नंबर की पुष्टि नहीं होती।",
    error: "कुछ गड़बड़ हुई। कृपया फिर कोशिश करें।"
  }
};

const state = {
  language: localStorage.getItem("park-language") || "en",
  user: null,
  token: sessionStorage.getItem("park-auth-token"),
  workout: null,
  parked: [],
  exerciseLibrary: [],
  qrTimer: null,
  idleTimer: null,
  preWorkoutTimer: null,
  qrId: null,
  resumeId: null,
  draftPlan: null,
  view: "home"
};
const text = (key) => translations[state.language][key] || translations.en[key] || key;
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);

async function api(url, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(url, { ...options, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || text("error"));
  return body;
}

window.addEventListener("resize", () => {
  if (state.view === "builder" && !isMobileViewport()) {
    state.view = "fatigue";
    render();
    showToast(text("planPhoneOnly"));
  }
  if (state.view === "fatigue") resetPreWorkoutTimer();
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("visible"), 3800);
}

function setLanguage(language) {
  state.language = language;
  localStorage.setItem("park-language", language);
  document.documentElement.lang = language;
  languageToggle.textContent = language === "en" ? "हिंदी" : "English";
  render();
}

languageToggle.addEventListener("click", () => setLanguage(state.language === "en" ? "hi" : "en"));

function saveAuth(result) {
  state.token = result.authToken;
  state.user = result.user;
  sessionStorage.setItem("park-auth-token", state.token);
  if (result.workout) {
    state.workout = result.workout;
    state.view = "workout";
  } else {
    state.workout = null;
    state.view = "fatigue";
  }
  if (result.user.language) setLanguage(result.user.language);
  else render();
  resetPreWorkoutTimer();
  refreshParked();
}

async function refreshParked() {
  try {
    const data = await api("/api/bootstrap");
    state.parked = data.parked;
    if (state.view === "home" || state.view === "workout") render();
  } catch (error) {
    showToast(error.message);
  }
}

function renderParked() {
  const content = state.parked.length
    ? state.parked.map((item) => `
      <button class="parked-card" data-resume="${escapeHtml(item.id)}" type="button">
        <span class="avatar">${escapeHtml(item.nickname.slice(0, 1).toUpperCase())}</span>
        <span class="parked-info"><strong>${escapeHtml(item.nickname)}</strong><small>${escapeHtml(item.exercise)}</small></span>
        <span class="parked-arrow" aria-hidden="true">↗</span>
      </button>`).join("")
    : `<p class="quiet">${text("parkedEmpty")}</p>`;
  return `<aside class="parked-panel">
    <div class="section-heading"><span class="eyebrow">${text("parked")}</span><span class="live-count">${state.parked.length} active</span></div>
    <div class="parked-list">${content}</div>
    <p class="privacy-note">${text("timeout")}</p>
  </aside>`;
}

function renderHome() {
  app.innerHTML = `
    <div class="home-layout">
      <section class="welcome-column">
        <div class="welcome-copy">
          <span class="eyebrow">YOUR PARK. YOUR PACE.</span>
          <h1>${text("welcome")}</h1>
          <p>${text("intro")}</p>
        </div>
        <div class="signin-card">
          <h2>${text("signIn")}</h2>
          <form id="login-form" class="form-grid">
            <label>${text("code")}<input name="phoneNumber" type="tel" inputmode="tel" autocomplete="tel" placeholder="${text("phonePlaceholder")}" required></label>
            <label>${text("pin")}<input name="pin" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="current-password" type="password" required></label>
            <button class="button button-dark" type="submit">${text("continue")} <span aria-hidden="true">→</span></button>
          </form>
          <p class="small-copy">${text("noPhone")}</p>
          <p class="prototype-warning">${text("phoneOwnershipNote")}</p>
          <div class="divider"><span>OR</span></div>
          <button class="button button-light full-width" type="button" data-action="show-qr">▦ &nbsp; ${text("qr")}</button>
          <div id="qr-pane" class="qr-pane hidden"></div>
          <button class="text-button" type="button" data-action="enroll">${text("newHere")} <span aria-hidden="true">↗</span></button>
        </div>
      </section>
      <section class="parked-column">${renderParked()}</section>
    </div>
    ${renderResumeModal()}`;
}

function renderResumeModal() {
  if (!state.resumeId) return "";
  const session = state.parked.find((item) => item.id === state.resumeId);
  if (!session) return "";
  return `<div class="modal-backdrop"><section class="resume-modal" role="dialog" aria-modal="true" aria-labelledby="resume-title">
    <button class="modal-close" data-action="cancel-resume" type="button" aria-label="${text("cancel")}">×</button>
    <span class="avatar">${escapeHtml(session.nickname.slice(0, 1).toUpperCase())}</span>
    <h2 id="resume-title">${escapeHtml(session.nickname)} · ${text("resume")}</h2>
    <p>${escapeHtml(session.exercise)}</p>
    <form id="resume-form" class="form-grid">
      <label>${text("enterPinResume")}<input name="pin" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" type="password" autocomplete="current-password" required></label>
      <button class="button button-dark" type="submit">${text("resume")} <span aria-hidden="true">→</span></button>
    </form>
  </section></div>`;
}

function renderEnrollment() {
  app.innerHTML = `
    <section class="form-page">
      <button class="back-button" data-action="home" type="button">← ${text("back")}</button>
      <div class="form-card">
        <span class="eyebrow">A FRESH START</span>
        <h1>${text("enrollTitle")}</h1>
        <p class="intro-copy">${text("pinHelp")}</p>
        <form id="enroll-form" class="form-grid">
          <label>${text("nickname")}<input name="nickname" minlength="2" maxlength="24" autocomplete="nickname" required></label>
          <label>${text("code")}<input name="phoneNumber" type="tel" inputmode="tel" autocomplete="tel" placeholder="${text("phonePlaceholder")}" required></label>
          <label>${text("goal")}<select name="goal" required>
            <option value="strength">${text("strength")}</option><option value="fitness">${text("fitness")}</option><option value="mobility">${text("mobility")}</option>
          </select></label>
          <label>${text("level")}<select name="level" required>
            <option value="beginner">${text("beginner")}</option><option value="regular">${text("regular")}</option>
          </select></label>
          <label>${text("language")}<select name="language"><option value="en">${text("english")}</option><option value="hi">${text("hindi")}</option></select></label>
          <label>${text("pin")}<input name="pin" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="new-password" type="password" required></label>
          <label class="consent-row"><input name="consent" type="checkbox" required><span>${text("consent")}</span></label>
          <button class="button button-dark" type="submit">${text("create")} <span aria-hidden="true">→</span></button>
        </form>
        <p class="prototype-warning">${text("phoneOwnershipNote")}</p>
      </div>
    </section>`;
}

function renderFatigue() {
  const name = escapeHtml(state.user?.nickname || "");
  const buttons = [1, 2, 3, 4, 5].map((number) => `
    <button class="energy-choice" type="button" data-fatigue="${number}" aria-label="${number}">
      <span class="energy-face">${["☀", "◔", "◐", "◑", "☁"][number - 1]}</span><span>${number}</span>
    </button>`).join("");
  const weeklyPlan = state.user?.weeklyPlan || [];
  const todayIndex = currentDayIndex();
  const weeklyPlanMarkup = weeklyPlan.length ? `<details class="weekly-plan"><summary>${text("workout")} · weekly plan</summary>
    <div class="weekly-plan-list">${weeklyPlan.map((day) => `
      <div class="weekly-plan-day ${dayIndex(day.day) === todayIndex ? "today" : ""}">
        <strong>${dayName(dayIndex(day.day))}</strong><span>${day.exercises.length ? day.exercises.map((exercise) => escapeHtml(exercise.name)).join(" · ") : text("restDay")}</span>
      </div>`).join("")}</div></details>` : "";
  const todayPlan = weeklyPlan[todayIndex];
  const isRestDay = Boolean(todayPlan && todayPlan.exercises.length === 0);
  app.innerHTML = `
    <section class="flow-page">
      <div class="flow-card">
        <span class="eyebrow">${text("welcomeMember")}, ${name}</span>
        <h1>${text("tired")}</h1>
        <div class="energy-scale">${buttons}</div>
        <div class="scale-labels"><span>${text("rested")}</span><span>${text("exhausted")}</span></div>
        <p class="safety-note">${text("disclaimer")}</p>
        ${weeklyPlanMarkup}
        ${isRestDay ? `<p class="rest-day-note">${text("restDayMessage")}</p>` : ""}
        ${!isMobileViewport() ? `<p class="auto-park-note">${text("preWorkoutAutoLogout")}</p>` : ""}
        <button class="button button-dark full-width" data-action="start" type="button" ${isRestDay ? "disabled" : ""}>${text("build")} <span aria-hidden="true">→</span></button>
        ${isMobileViewport() ? `<button class="button button-light full-width mobile-plan-button" data-action="edit-plan" type="button">${text("customPlan")}</button>` : ""}
      </div>
    </section>`;
}

function isMobileViewport() {
    return window.matchMedia("(max-width: 767px)").matches;
}

function dayName(index) {
    const monday = new Date(Date.UTC(2024, 0, 1 + index));
    return new Intl.DateTimeFormat(state.language === "hi" ? "hi-IN" : "en-US", {
      weekday: "long",
      timeZone: "UTC"
    }).format(monday);
}

function dayIndex(day) {
  return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(day);
}

function currentDayIndex() {
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "long" }).format(new Date());
  return Math.max(0, dayIndex(weekday));
}

function defaultPlanDraft() {
    return (state.user?.weeklyPlan || []).map((day) => day.exercises.map((exercise) => ({
      exerciseId: exercise.id,
      sets: exercise.sets,
      reps: exercise.reps
    })));
}

function renderPlanBuilder() {
    if (!isMobileViewport()) {
      state.view = "fatigue";
      renderFatigue();
      showToast(text("planPhoneOnly"));
      return;
    }
    const exercises = state.exerciseLibrary || [];
    const todayIndex = currentDayIndex();
    const dayMarkup = state.draftPlan.map((day, dayIndex) => `
      <details class="builder-day ${dayIndex === todayIndex ? "today" : ""}" ${dayIndex === todayIndex ? "open" : ""}>
        <summary><strong>${dayName(dayIndex)}</strong><span>${day.length ? `${day.length} ${text("exercise").toLowerCase()}` : text("restDay")}</span></summary>
        <div class="builder-day-content">
          ${day.map((item, itemIndex) => {
            const current = exercises.find((exercise) => exercise.id === item.exerciseId);
            const options = exercises.map((exercise) => `
              <option value="${escapeHtml(exercise.id)}" ${exercise.id === item.exerciseId ? "selected" : ""}>${escapeHtml(exercise.names[state.language] || exercise.names.en)}</option>
            `).join("");
            const targets = current?.unit === "min"
              ? `<label>${text("targetDuration")}<input type="number" min="2" max="60" value="${item.reps}" required data-plan-field="reps" data-day="${dayIndex}" data-item="${itemIndex}"></label>`
              : `<div class="target-fields">
                  <label>${text("targetSets")}<input type="number" min="1" max="5" value="${item.sets}" required data-plan-field="sets" data-day="${dayIndex}" data-item="${itemIndex}"></label>
                  <label>${text("targetReps")}<input type="number" min="5" max="30" value="${item.reps}" required data-plan-field="reps" data-day="${dayIndex}" data-item="${itemIndex}"></label>
                </div>`;
            return `<div class="builder-exercise">
              <label>${text("exercise")}
                <select data-plan-field="exerciseId" data-day="${dayIndex}" data-item="${itemIndex}">
                  ${options}
                </select>
              </label>
              ${targets}
              <button class="text-button remove-plan-exercise" type="button" data-action="remove-plan-exercise" data-day="${dayIndex}" data-item="${itemIndex}">${text("removeExercise")}</button>
            </div>`;
          }).join("")}
          <button class="button button-light full-width" type="button" data-action="add-plan-exercise" data-day="${dayIndex}" ${day.length >= 4 ? "disabled" : ""}>＋ ${text("addExercise")}</button>
        </div>
      </details>`).join("");

    app.innerHTML = `
      <section class="form-page builder-page">
        <button class="back-button" data-action="cancel-plan" type="button">← ${text("back")}</button>
        <div class="form-card">
          <span class="eyebrow">${text("customPlan")}</span>
          <h1>${text("customPlanTitle")}</h1>
          <p class="intro-copy">${text("customPlanIntro")}</p>
          <p class="prototype-warning">${text("planPrototypeWarning")}</p>
          <form id="plan-form">
            <div class="builder-week">${dayMarkup}</div>
            <button class="button button-dark full-width save-plan-button" type="submit">${text("savePlan")} <span aria-hidden="true">→</span></button>
            ${state.user?.hasCustomPlan ? `<button class="button button-light full-width template-button" data-action="use-template" type="button">${text("useTemplate")}</button>` : ""}
          </form>
        </div>
      </section>`;
}

function currentExercise() {
  return state.workout?.exercises?.[state.workout.currentIndex] || null;
}

function movementIllustration(exercise) {
  const label = escapeHtml(exercise.names[state.language] || exercise.names.en);
  const scenes = {
    "chest-press": `<path class="machine" d="M302 70v184m-15-108h30m-15 0v-30m-18 30v28m36-28v28M117 185h80m-67 0v68m54-68v68"/>
      <path class="seat" d="M127 180h67m-52-5v-45"/>
      <g class="person"><circle class="skin" cx="158" cy="93" r="20"/><path class="shirt" d="M143 118q20-10 34 4l9 54h-55z"/>
        <path class="skin arm-push" d="M174 127l37 12 43 1"/><path class="skin arm-push-second" d="M174 143l37 10 43 1"/>
        <path class="shirt" d="M145 169h28l22 17-7 10-40-8z"/><path class="pants" d="M153 184l37 4 22 17-8 9-35-12-29 1z"/>
        <path class="shoe" d="M205 203l15 3 8 8-20 1z"/></g>
      <path class="motion-path" d="M210 111h54"/><path class="motion-arrow" d="m258 104 9 7-9 7"/>`,
    "seated-row": `<path class="machine" d="M304 78v176m-15-93h30m-15 0v25m-18-25v-16m36 16v-16M285 119 231 144"/>
      <path class="seat" d="M118 185h80m-66 0v68m53-68v68"/>
      <g class="person"><circle class="skin" cx="158" cy="93" r="20"/><path class="shirt" d="M143 118q20-10 34 4l9 54h-55z"/>
        <path class="skin arm-pull" d="M174 128l28 12 27 4"/><path class="skin arm-pull-second" d="M174 143l28 10 27-9"/>
        <path class="shirt" d="M145 169h28l22 17-7 10-40-8z"/><path class="pants" d="M153 184l37 4 22 17-8 9-35-12-29 1z"/>
        <path class="shoe" d="M205 203l15 3 8 8-20 1z"/></g>
      <path class="motion-path" d="M245 108h-35"/><path class="motion-arrow" d="m217 101-9 7 9 7"/>`,
    "leg-press": `<path class="machine" d="m277 89 42 21m-42-21-19 38m61-17-19 37m-19-20 41 21m-99-47-21 136m-14-2h91"/>
      <path class="seat" d="m163 152 51 24-19 42-51-24z"/>
      <g class="person"><circle class="skin" cx="143" cy="104" r="19"/><path class="shirt" d="m132 122 39 15 20 30-18 28-45-24z"/>
        <path class="skin leg-press-leg" d="m175 155 43 24 28-52 11 7-23 65-10 4-58-29z"/>
        <path class="pants" d="m145 177 32 17-24 35-31-16z"/><path class="shoe" d="m219 123 22 5-7 12-18-6z"/>
        <path class="pants" d="m151 211-20 32-13-7 15-37z"/><path class="shoe" d="m118 237-5 13 25-2 2-7z"/></g>
      <path class="motion-path" d="m246 151 27 15"/><path class="motion-arrow" d="m268 158 10 10-13 1"/>`,
    "shoulder-press": `<path class="machine" d="M301 67v187m-19 0h38m-31-104v-27m24 27v-27m-35-18h46m-23-18v81"/>
      <path class="seat" d="M117 185h80m-66 0v68m53-68v68"/>
      <g class="person"><circle class="skin" cx="158" cy="100" r="20"/><path class="shirt" d="M143 125q20-10 34 4l9 50h-55z"/>
        <path class="skin arm-overhead" d="m145 133-3-31 13-27 9 5-8 32 17 20"/>
        <path class="skin arm-overhead-second" d="m175 133 7-31-13-27-9 5 8 32-17 20"/>
        <path class="shirt" d="M145 173h28l22 13-7 10-40-4z"/><path class="pants" d="M153 184l37 4 22 17-8 9-35-12-29 1z"/>
        <path class="shoe" d="M205 203l15 3 8 8-20 1z"/></g>
      <path class="motion-path" d="M229 86V58"/><path class="motion-arrow" d="m222 66 7-10 7 10"/>`,
    "brisk-walk": `<path class="ground" d="M52 245h316"/><path class="walk-path" d="M91 223h42m17 0h42m17 0h42"/>
      <g class="walker"><circle class="skin" cx="211" cy="72" r="21"/><path class="shirt" d="M192 98q20-10 39 2l12 65-51 8-11-46z"/>
        <path class="skin walking-arm-front" d="m194 111-28 37-22-9 4-10 14 3 20-40"/>
        <path class="skin walking-arm-back" d="m226 109 26 27 19-17 8 8-22 26-11-4-25-24"/>
        <path class="pants walking-leg-front" d="m198 163 28 4-5 43-34 25-9-9 25-28z"/>
        <path class="pants walking-leg-back" d="m220 165 24-4 9 35 25 19-5 11-35-15-12-20z"/>
        <path class="shoe" d="m178 223-9 10 21 3 10-8z"/><path class="shoe" d="m271 215 10 9-1 7-18-3z"/></g>
      <path class="motion-arrow" d="m296 95 18-12m-12 0 12 0 1 12"/>`
  };
  const scene = scenes[exercise.id];
  if (!scene) throw new Error(`Missing exercise illustration: ${exercise.id}`);
  return `<div class="movement-illustration ${escapeHtml(exercise.id)}" role="img" aria-label="${label} exercise illustration">
    <svg class="exercise-svg" viewBox="0 0 420 300" aria-hidden="true">
      <circle class="sun-orb" cx="342" cy="55" r="26"/>
      <path class="scene-ground" d="M35 254h350"/>
      ${scene}
    </svg>
    <span class="illustration-label">${label}</span>
  </div>`;
}

function renderWorkout() {
  const exercise = currentExercise();
  if (!exercise) {
    app.innerHTML = `<section class="flow-page"><div class="flow-card complete-card">
      <span class="completion-mark">✓</span><span class="eyebrow">${text("workout")}</span>
      <h1>${text("goodJob")}</h1><p>${text("disclaimer")}</p>
      <button class="button button-dark full-width" data-action="logout" type="button">${text("logout")}</button>
    </div></section>`;
    clearTimeout(state.idleTimer);
    return;
  }
  const index = state.workout.currentIndex;
  const count = state.workout.exercises.length;
  const name = escapeHtml(exercise.names[state.language] || exercise.names.en);
  const description = escapeHtml(exercise.description[state.language] || exercise.description.en);
  const feel = escapeHtml(exercise.feel[state.language] || exercise.feel.en);
  const mistakes = escapeHtml(exercise.mistakes[state.language] || exercise.mistakes.en);
  const quantity = exercise.machine === "cardio"
    ? `${exercise.adjustedReps} ${text("minutes")}`
    : `${exercise.adjustedSets} ${text("sets")} · ${exercise.adjustedReps} ${text("reps")}`;
  const progress = Array.from({ length: count }, (_, i) => `<span class="progress-step ${i < index ? "complete" : i === index ? "current" : ""}"></span>`).join("");
  const last = index === count - 1;
  app.innerHTML = `
    <section class="workout-page">
      <div class="workout-topline"><span class="eyebrow">${text("workout")}</span><button class="text-button" data-action="logout" type="button">${text("logout")}</button></div>
      <div class="progress-row"><span>${text("progress")}</span><strong>${index + 1} ${text("of")} ${count}</strong><div class="progress-track">${progress}</div></div>
      <div class="exercise-layout">
        <div class="exercise-art">${movementIllustration(exercise)}<span class="art-caption">PARKSIDE MOVEMENT GUIDE</span></div>
        <article class="exercise-card">
          <span class="eyebrow">${text("exercise")} ${index + 1}</span>
          <h1>${name}</h1>
          <div class="exercise-quantity">${quantity}</div>
          <p class="exercise-description">${description}</p>
          <div class="guidance-block"><strong>${text("feel")}</strong><p>${feel}</p></div>
          <div class="guidance-block mistake"><strong>${text("avoid")}</strong><p>${mistakes}</p></div>
          <button class="button button-light full-width" data-action="speak" type="button">◖)) &nbsp; ${text("speak")}</button>
          <div class="exercise-actions">
            <button class="button button-light" data-action="park" type="button">${text("leave")}</button>
            <button class="button button-dark" data-action="done" type="button">${last ? text("finish") : text("done")} <span aria-hidden="true">→</span></button>
          </div>
          <p class="auto-park-note">${text("autoPark")}</p>
        </article>
      </div>
    </section>`;
  resetIdleTimer();
}

function renderApproval() {
  app.innerHTML = `
    <section class="flow-page approval-page">
      <div class="flow-card">
        <span class="eyebrow">PARKSIDE SECURE SIGN-IN</span>
        <h1>${text("approveTitle")}</h1>
        <p>${text("approveHelp")}</p>
        <form id="approve-form" class="form-grid">
          <label>${text("code")}<input name="phoneNumber" type="tel" inputmode="tel" autocomplete="tel" placeholder="${text("phonePlaceholder")}" required></label>
          <label>${text("pin")}<input name="pin" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" type="password" autocomplete="current-password" required></label>
          <button class="button button-dark" type="submit">${text("approve")} <span aria-hidden="true">→</span></button>
        </form>
        <p id="approval-status" class="approval-status">${text("approveHelp")}</p>
      </div>
    </section>`;
}

function render() {
  document.documentElement.lang = state.language;
  languageToggle.textContent = state.language === "en" ? "हिंदी" : "English";
  if (approvalId) return renderApproval();
  if (state.view === "enroll") return renderEnrollment();
  if (state.view === "fatigue") return renderFatigue();
  if (state.view === "builder") return renderPlanBuilder();
  if (state.view === "workout") return renderWorkout();
  renderHome();
}

function resetIdleTimer() {
  clearTimeout(state.idleTimer);
  if (state.view !== "workout" || !currentExercise()) return;
  state.idleTimer = setTimeout(() => parkWorkout(true), 30_000);
}

function resetPreWorkoutTimer() {
  clearTimeout(state.preWorkoutTimer);
  if (!state.token || state.view !== "fatigue" || isMobileViewport()) return;
  state.preWorkoutTimer = setTimeout(async () => {
    if (!state.token || state.view !== "fatigue" || isMobileViewport()) return;
    try {
      await api("/api/logout", { method: "POST", body: "{}" });
      state.token = null;
      state.user = null;
      sessionStorage.removeItem("park-auth-token");
      state.view = "home";
      await loadBootstrap();
      render();
      showToast("Signed out for privacy.");
    } catch (error) {
      showToast(error.message);
    }
  }, 30_000);
}

async function speakExercise() {
  if (!("speechSynthesis" in window)) {
    showToast("Voice playback is not available on this device.");
    return;
  }

  if (!speechSynthesis.getVoices().length) {
    await new Promise((resolve) => {
      const timeout = setTimeout(resolve, 1000);
      speechSynthesis.addEventListener("voiceschanged", () => {
        clearTimeout(timeout);
        resolve();
      }, { once: true });
    });
  }

  const language = state.language === "hi" ? "hi" : "en";
  const locale = language === "hi" ? "hi-IN" : "en-IN";
  const voices = speechSynthesis.getVoices();
  const voice = voices.find((item) => item.lang.toLowerCase() === locale.toLowerCase())
    || voices.find((item) => item.lang.toLowerCase().startsWith(`${language}-`))
    || (language === "en" ? voices.find((item) => item.lang.toLowerCase().startsWith("en-")) : null);

  if (language === "hi" && !voice) {
    showToast(text("hindiVoiceUnavailable"));
    return;
  }

  const exercise = currentExercise();
  const utterance = new SpeechSynthesisUtterance([
    exercise.description[language] || exercise.description.en,
    exercise.feel[language] || exercise.feel.en,
    exercise.mistakes[language] || exercise.mistakes.en
  ].join(" "));
  utterance.lang = voice?.lang || locale;
  if (voice) utterance.voice = voice;
  utterance.onerror = (event) => {
    if (event.error !== "canceled" && event.error !== "interrupted") {
      showToast(text("speechError"));
    }
  };
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
  document.addEventListener(eventName, () => {
    if (state.view === "workout") resetIdleTimer();
    if (state.view === "fatigue") resetPreWorkoutTimer();
  }, { passive: true });
});

async function beginQr() {
  const pane = document.querySelector("#qr-pane");
  if (!pane) return;
  pane.classList.remove("hidden");
  pane.innerHTML = `<div class="qr-loading">${text("wait")}</div>`;
  try {
    const qr = await api("/api/login/qr", { method: "POST", body: "{}" });
    state.qrId = qr.id;
    pane.innerHTML = `<img class="qr-image" src="${qr.qr}" alt="One-time kiosk sign-in QR code">
      <strong>${text("qr")}</strong><p>${text("qrHelp")}</p>
      <span class="qr-countdown">Expires in 2 minutes</span>
      <button class="text-button" data-action="show-qr" type="button">${text("qrRefresh")}</button>`;
    clearInterval(state.qrTimer);
    state.qrTimer = setInterval(async () => {
      try {
        const status = await api(`/api/login/qr/${encodeURIComponent(qr.id)}`);
        if (status.status === "approved") {
          clearInterval(state.qrTimer);
          saveAuth(status);
        }
      } catch {
        clearInterval(state.qrTimer);
        pane.innerHTML = `<p>${text("expired")}</p><button class="text-button" data-action="show-qr" type="button">${text("qrRefresh")}</button>`;
      }
    }, 1800);
    setTimeout(() => {
      if (state.qrId === qr.id && document.querySelector("#qr-pane")) {
        clearInterval(state.qrTimer);
        pane.innerHTML = `<p>${text("expired")}</p><button class="text-button" data-action="show-qr" type="button">${text("qrRefresh")}</button>`;
      }
    }, 120_000);
  } catch (error) {
    pane.innerHTML = `<p class="error-copy">${escapeHtml(error.message)}</p>`;
  }
}

async function parkWorkout(automatic = false) {
  if (!state.token || state.view !== "workout" || !currentExercise()) return;
  clearTimeout(state.idleTimer);
  try {
    await api("/api/workout/park", { method: "POST", body: "{}" });
    state.token = null;
    state.user = null;
    state.workout = null;
    sessionStorage.removeItem("park-auth-token");
    state.view = "home";
    await loadBootstrap();
    render();
    if (automatic) showToast("Workout parked for privacy.");
  } catch (error) {
    showToast(error.message);
  }
}

async function loadBootstrap() {
  const data = await api("/api/bootstrap");
  state.parked = data.parked;
  state.exerciseLibrary = data.exercises;
}

app.addEventListener("submit", async (event) => {
  const form = event.target;
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  try {
    if (form.id === "login-form") {
      const result = await api("/api/login", { method: "POST", body: JSON.stringify(data) });
      saveAuth(result);
    } else if (form.id === "enroll-form") {
      data.consent = form.elements.consent.checked;
      const result = await api("/api/enroll", { method: "POST", body: JSON.stringify(data) });
      saveAuth(result);
    } else if (form.id === "approve-form") {
      const result = await api("/api/login/approve", { method: "POST", body: JSON.stringify({ ...data, id: approvalId }) });
      document.querySelector("#approval-status").textContent = `${text("approved")}: ${result.nickname}`;
      form.innerHTML = `<div class="approval-success"><span class="completion-mark">✓</span><strong>${text("approved")}</strong><p>You can return to the kiosk.</p></div>`;
    } else if (form.id === "resume-form") {
      const result = await api(`/api/workout/resume/${encodeURIComponent(state.resumeId)}`, {
        method: "POST",
        body: JSON.stringify({ pin: data.pin })
      });
      state.resumeId = null;
      saveAuth(result);
    } else if (form.id === "plan-form") {
      const result = await api("/api/plan", {
        method: "POST",
        body: JSON.stringify({ days: state.draftPlan })
      });
      state.user = result.user;
      state.draftPlan = null;
      state.view = "fatigue";
      render();
      showToast(text("customPlanSaved"));
    }
  } catch (error) {
    showToast(error.message);
  } finally {
    if (submitButton?.isConnected) submitButton.disabled = false;
  }
});

let selectedFatigue = 0;
app.addEventListener("input", (event) => {
  const field = event.target;
  if (!field.matches("[data-plan-field]")) return;
  const day = Number(field.dataset.day);
  const item = Number(field.dataset.item);
  if (!state.draftPlan?.[day]?.[item]) return;
  const key = field.dataset.planField;
  state.draftPlan[day][item][key] = key === "exerciseId" ? field.value : Number(field.value);
});

app.addEventListener("change", (event) => {
  const field = event.target;
  if (field.dataset.planField !== "exerciseId") return;
  const day = Number(field.dataset.day);
  const itemIndex = Number(field.dataset.item);
  const item = state.draftPlan?.[day]?.[itemIndex];
  const exercise = state.exerciseLibrary.find((candidate) => candidate.id === field.value);
  if (!item || !exercise) return;
  item.sets = exercise.unit === "min" ? 1 : exercise.id === "shoulder-press" ? 2 : 3;
  item.reps = exercise.unit === "min" ? 5 : 10;
  renderPlanBuilder();
  const dayDetails = document.querySelectorAll(".builder-day")[day];
  if (dayDetails) dayDetails.open = true;
});

app.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  try {
    if (button.dataset.fatigue) {
      selectedFatigue = Number(button.dataset.fatigue);
      document.querySelectorAll(".energy-choice").forEach((item) => item.classList.toggle("selected", item === button));
    }
    if (button.dataset.action === "enroll") {
      state.view = "enroll";
      render();
    } else if (button.dataset.action === "home") {
      state.view = "home";
      render();
    } else if (button.dataset.action === "show-qr") {
      await beginQr();
    } else if (button.dataset.action === "start") {
      if (!selectedFatigue) return showToast(text("tired"));
      clearTimeout(state.preWorkoutTimer);
      const result = await api("/api/workout/start", { method: "POST", body: JSON.stringify({ fatigue: selectedFatigue }) });
      state.workout = result.workout;
      state.view = "workout";
      render();
      if (selectedFatigue === 5) showToast(text("restSuggestion"));
      else if (selectedFatigue >= 3) showToast(text("lighter"));
    } else if (button.dataset.action === "edit-plan") {
      if (!isMobileViewport()) return showToast(text("planPhoneOnly"));
      state.draftPlan = defaultPlanDraft();
      state.view = "builder";
      render();
    } else if (button.dataset.action === "cancel-plan") {
      state.draftPlan = null;
      state.view = "fatigue";
      render();
    } else if (button.dataset.action === "add-plan-exercise") {
      const dayIndex = Number(button.dataset.day);
      const day = state.draftPlan?.[dayIndex];
      if (!day || day.length >= 4) return;
      const existing = new Set(day.map((item) => item.exerciseId));
      const next = state.exerciseLibrary.find((exercise) => !existing.has(exercise.id));
      if (!next) return showToast("No more unique exercises are available for this day.");
      day.push({ exerciseId: next.id, sets: next.machine === "cardio" ? 1 : next.id === "shoulder-press" ? 2 : 3, reps: next.unit === "min" ? 5 : 10 });
      renderPlanBuilder();
    } else if (button.dataset.action === "remove-plan-exercise") {
      const dayIndex = Number(button.dataset.day);
      const itemIndex = Number(button.dataset.item);
      state.draftPlan?.[dayIndex]?.splice(itemIndex, 1);
      renderPlanBuilder();
    } else if (button.dataset.action === "use-template") {
      const result = await api("/api/plan", { method: "DELETE", body: "{}" });
      state.user = result.user;
      state.draftPlan = null;
      state.view = "fatigue";
      render();
    } else if (button.dataset.action === "park") {
      await parkWorkout();
    } else if (button.dataset.action === "done") {
      const result = await api("/api/workout/done", { method: "POST", body: "{}" });
      state.workout = result.workout;
      render();
    } else if (button.dataset.action === "logout") {
      clearTimeout(state.preWorkoutTimer);
      await api("/api/logout", { method: "POST", body: "{}" });
      clearTimeout(state.idleTimer);
      state.token = null;
      state.user = null;
      state.workout = null;
      state.view = "home";
      sessionStorage.removeItem("park-auth-token");
      await loadBootstrap();
      render();
    } else if (button.dataset.resume) {
      state.resumeId = button.dataset.resume;
      render();
      document.querySelector("#resume-form input")?.focus();
    } else if (button.dataset.action === "cancel-resume") {
      state.resumeId = null;
      render();
    } else if (button.dataset.action === "speak") {
      await speakExercise();
    }
  } catch (error) {
    showToast(error.message);
  }
});

async function init() {
  if (approvalId) {
    render();
    return;
  }
  try {
    await loadBootstrap();
    if (state.token) {
      try {
        const result = await api("/api/me");
        state.user = result.user;
        if (result.workout) {
          state.workout = result.workout;
          state.view = "workout";
        } else if (isMobileViewport()) {
          state.view = "fatigue";
        } else {
          state.token = null;
          sessionStorage.removeItem("park-auth-token");
        }
      } catch {
        state.token = null;
        sessionStorage.removeItem("park-auth-token");
      }
    }
    render();
  } catch (error) {
    app.innerHTML = `<section class="flow-page"><div class="flow-card"><h1>${text("error")}</h1><p>${escapeHtml(error.message)}</p></div></section>`;
  }
}

init();
