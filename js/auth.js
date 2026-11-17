"use strict";

(() => {
  const SUPABASE_URL = "https://twchvyxflykaljyqwpvx.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_NRnPXPnxgSUVmNGLVIimAw_2Nng1m0g";
  const authUrl = window.location.href.split("?")[0].split("#")[0];
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  const $ = (id) => document.getElementById(id);
  const loading = $("authLoading");
  const forms = $("authForms");
  const accountPanel = $("accountPanel");
  const message = $("authMessage");
  const loginForm = $("loginForm");
  const signupForm = $("signupForm");
  const recoveryForm = $("recoveryForm");
  let recoverySession = false;

  $("authYear").textContent = new Date().getFullYear();

  function showMessage(text, kind = "") {
    message.textContent = text;
    message.className = "auth-message" + (kind ? " is-" + kind : "");
  }

  function setBusy(button, busy, label) {
    if (!button) return;
    if (busy) {
      button.dataset.originalText = button.textContent;
      button.textContent = label || "لطفاً صبر کن...";
      button.disabled = true;
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
    }
  }

  function showMode(mode) {
    loginForm.hidden = mode !== "login";
    signupForm.hidden = mode !== "signup";
    recoveryForm.hidden = mode !== "recovery";
    $("loginTab").classList.toggle("is-active", mode === "login");
    $("signupTab").classList.toggle("is-active", mode === "signup");
    $("loginTab").setAttribute("aria-selected", String(mode === "login"));
    $("signupTab").setAttribute("aria-selected", String(mode === "signup"));
    $("googleButton").hidden = mode === "recovery";
    document.querySelector(".auth-divider").hidden = mode === "recovery";
    showMessage("");
  }

  function renderSession(session) {
    loading.hidden = true;
    if (session?.user) {
      forms.hidden = true;
      accountPanel.hidden = false;
      $("accountEmail").textContent = session.user.email || "حساب کاربری";
    } else {
      accountPanel.hidden = true;
      forms.hidden = false;
      showMode("login");
    }
  }

  $("loginTab").addEventListener("click", () => showMode("login"));
  $("signupTab").addEventListener("click", () => showMode("signup"));
  $("forgotButton").addEventListener("click", () => {
    $("recoveryTitle").textContent = "بازیابی رمز عبور";
    $("recoveryDescription").textContent = "ایمیلی که باهاش ثبت‌نام کردی وارد کن تا لینک بازیابی برات ارسال بشه.";
    $("recoveryEmailGroup").hidden = false;
    $("newPasswordGroup").hidden = true;
    recoverySession = false;
    showMode("recovery");
  });
  $("backToLogin").addEventListener("click", () => showMode("login"));

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = loginForm.querySelector("button[type=submit]");
    setBusy(button, true);
    const { error } = await client.auth.signInWithPassword({
      email: $("loginEmail").value.trim(),
      password: $("loginPassword").value
    });
    setBusy(button, false);
    if (error) showMessage(error.message, "error");
    else showMessage("ورود با موفقیت انجام شد.", "success");
  });

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = $("signupPassword").value;
    if (password !== $("signupPasswordConfirm").value) {
      showMessage("رمز عبور و تکرار آن یکسان نیستند.", "error");
      return;
    }
    if (password.length < 8) {
      showMessage("رمز عبور باید حداقل ۸ کاراکتر داشته باشد.", "error");
      return;
    }
    const button = signupForm.querySelector("button[type=submit]");
    setBusy(button, true);
    const { data, error } = await client.auth.signUp({
      email: $("signupEmail").value.trim(),
      password,
      options: { emailRedirectTo: authUrl }
    });
    setBusy(button, false);
    if (error) showMessage(error.message, "error");
    else if (data.session) showMessage("حساب ساخته شد و وارد سایت شدی.", "success");
    else showMessage("ثبت‌نام انجام شد. ایمیلت رو باز کن و لینک تأیید حساب رو بزن.", "success");
  });

  $("googleButton").addEventListener("click", async () => {
    const button = $("googleButton");
    setBusy(button, true, "در حال انتقال به گوگل...");
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: authUrl }
    });
    if (error) {
      setBusy(button, false);
      showMessage(error.message, "error");
    }
  });

  recoveryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = recoveryForm.querySelector("#recoveryEmailGroup button");
    setBusy(button, true);
    const { error } = await client.auth.resetPasswordForEmail($("recoveryEmail").value.trim(), {
      redirectTo: authUrl + "?mode=recovery"
    });
    setBusy(button, false);
    if (error) showMessage(error.message, "error");
    else showMessage("اگر این ایمیل حسابی داشته باشه، لینک بازیابی براش ارسال می‌شه.", "success");
  });

  $("saveNewPassword").addEventListener("click", async () => {
    const password = $("newPassword").value;
    if (password.length < 8 || password !== $("newPasswordConfirm").value) {
      showMessage("رمز جدید باید حداقل ۸ کاراکتر باشد و هر دو فیلد یکسان باشند.", "error");
      return;
    }
    const button = $("saveNewPassword");
    setBusy(button, true);
    const { error } = await client.auth.updateUser({ password });
    setBusy(button, false);
    if (error) showMessage(error.message, "error");
    else {
      recoverySession = false;
      showMessage("رمز عبور با موفقیت تغییر کرد. حالا می‌تونی وارد سایت بشی.", "success");
      await client.auth.signOut();
      showMode("login");
    }
  });

  $("logoutButton").addEventListener("click", async () => {
    const button = $("logoutButton");
    setBusy(button, true);
    const { error } = await client.auth.signOut();
    setBusy(button, false);
    if (error) showMessage(error.message, "error");
    else showMessage("از حساب خارج شدی.", "success");
  });

  client.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      loading.hidden = true;
      accountPanel.hidden = true;
      forms.hidden = false;
      $("recoveryTitle").textContent = "انتخاب رمز عبور جدید";
      $("recoveryDescription").textContent = "رمز عبور جدیدت رو وارد کن.";
      $("recoveryEmailGroup").hidden = true;
      $("newPasswordGroup").hidden = false;
      recoverySession = true;
      showMode("recovery");
      $("recoveryEmailGroup").hidden = true;
      $("newPasswordGroup").hidden = false;
    } else {
      renderSession(session);
    }
  });

  client.auth.getSession().then(({ data, error }) => {
    if (error) showMessage(error.message, "error");
    renderSession(data?.session || null);
    if (new URLSearchParams(window.location.search).get("mode") === "recovery" && data?.session) {
      $("forgotButton").click();
      $("recoveryTitle").textContent = "انتخاب رمز عبور جدید";
      $("recoveryDescription").textContent = "رمز عبور جدیدت رو وارد کن.";
      $("recoveryEmailGroup").hidden = true;
      $("newPasswordGroup").hidden = false;
      recoverySession = true;
      showMode("recovery");
      $("recoveryEmailGroup").hidden = true;
      $("newPasswordGroup").hidden = false;
    }
  });
})();
