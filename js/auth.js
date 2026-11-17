"use strict";

(() => {
  const SUPABASE_URL = "https://twchvyxflykaljyqwpvx.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_NRnPXPnxgSUVmNGLVIimAw_2Nng1m0g";
  const authUrl = window.location.href.split("?")[0].split("#")[0];
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  const $ = (id) => document.getElementById(id);
  const loading = $("authLoading");
  const forms = $("authForms");
  const accountPanel = $("accountPanel");
  const message = $("authMessage");
  const loginForm = $("loginForm");
  const signupForm = $("signupForm");
  const recoveryForm = $("recoveryForm");
  const profileForm = $("profileForm");
  let currentUser = null;

  $("authYear").textContent = new Date().getFullYear();

  function showMessage(text, kind = "") {
    message.textContent = text;
    message.className = "auth-message" + (kind ? " is-" + kind : "");
  }

  function friendlyError(error) {
    const text = String(error?.message || "مشکلی پیش اومد. دوباره تلاش کن.");
    if (/provider is not enabled|Unsupported provider/i.test(text)) {
      return "ورود با گوگل هنوز در تنظیمات Supabase فعال نشده؛ تنظیمات راه‌اندازی را بررسی کن.";
    }
    if (/redirect_uri|redirect url/i.test(text)) {
      return "آدرس بازگشت ورود در Supabase یا Google OAuth درست تنظیم نشده.";
    }
    if (/already registered/i.test(text)) return "این ایمیل قبلاً ثبت‌نام کرده؛ وارد حسابت شو.";
    return text;
  }

  function setBusy(button, busy, label) {
    if (!button) return;
    if (busy) {
      if (!button.dataset.originalText) button.dataset.originalText = button.textContent;
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

  function getDisplayName(user) {
    const metadata = user?.user_metadata || {};
    return String(metadata.display_name || metadata.full_name || metadata.name || "").trim();
  }

  function renderSession(session) {
    loading.hidden = true;
    currentUser = session?.user || null;
    if (currentUser) {
      forms.hidden = true;
      accountPanel.hidden = false;
      $("accountEmail").textContent = currentUser.email || "حساب کاربری";
      $("profileName").value = getDisplayName(currentUser);
      $("profileName").placeholder = "نام نمایشی دلخواهت رو وارد کن";
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
    showMode("recovery");
  });
  $("backToLogin").addEventListener("click", () => showMode("login"));

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = loginForm.querySelector("button[type=submit]");
    setBusy(button, true);
    try {
      const { error } = await client.auth.signInWithPassword({
        email: $("loginEmail").value.trim(),
        password: $("loginPassword").value
      });
      if (error) throw error;
      showMessage("با موفقیت وارد حساب شدی.", "success");
    } catch (error) {
      showMessage(friendlyError(error), "error");
    } finally {
      setBusy(button, false);
    }
  });

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = $("signupPassword").value;
    const displayName = $("signupName").value.trim();
    if (displayName.length > 60) {
      showMessage("نام نمایشی نباید بیشتر از ۶۰ کاراکتر باشه.", "error");
      return;
    }
    if (password !== $("signupPasswordConfirm").value) {
      showMessage("رمز عبور و تکرار آن یکسان نیستند.", "error");
      return;
    }
    if (password.length < 8) {
      showMessage("رمز عبور باید حداقل ۸ کاراکتر داشته باشه.", "error");
      return;
    }
    const button = signupForm.querySelector("button[type=submit]");
    setBusy(button, true);
    try {
      const { data, error } = await client.auth.signUp({
        email: $("signupEmail").value.trim(),
        password,
        options: {
          emailRedirectTo: authUrl,
          data: displayName ? { display_name: displayName, full_name: displayName } : {}
        }
      });
      if (error) throw error;
      if (data.session) showMessage("حساب ساخته شد و وارد سایت شدی.", "success");
      else showMessage("ثبت‌نام انجام شد. ایمیلت رو باز کن و لینک تأیید حساب رو بزن.", "success");
    } catch (error) {
      showMessage(friendlyError(error), "error");
    } finally {
      setBusy(button, false);
    }
  });

  $("googleButton").addEventListener("click", async () => {
    const button = $("googleButton");
    setBusy(button, true, "در حال اتصال به گوگل...");
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: authUrl,
          queryParams: { prompt: "select_account" }
        }
      });
      if (error) throw error;
    } catch (error) {
      setBusy(button, false);
      showMessage(friendlyError(error), "error");
    }
  });

  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUser) {
      showMessage("برای ویرایش پروفایل ابتدا وارد حساب شو.", "error");
      return;
    }
    const displayName = $("profileName").value.trim();
    if (!displayName) {
      showMessage("لطفاً یک نام نمایشی وارد کن.", "error");
      $("profileName").focus();
      return;
    }
    if (displayName.length > 60) {
      showMessage("نام نمایشی نباید بیشتر از ۶۰ کاراکتر باشه.", "error");
      return;
    }
    const button = $("saveProfileButton");
    setBusy(button, true, "در حال ذخیره...");
    try {
      const { data, error } = await client.auth.updateUser({
        data: { display_name: displayName, full_name: displayName }
      });
      if (error) throw error;
      currentUser = data.user || currentUser;
      $("profileName").value = getDisplayName(currentUser) || displayName;
      showMessage("نام نمایشی با موفقیت ذخیره شد.", "success");
    } catch (error) {
      showMessage(friendlyError(error), "error");
    } finally {
      setBusy(button, false);
    }
  });

  recoveryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = recoveryForm.querySelector("#recoveryEmailGroup button");
    setBusy(button, true);
    try {
      const { error } = await client.auth.resetPasswordForEmail($("recoveryEmail").value.trim(), {
        redirectTo: authUrl + "?mode=recovery"
      });
      if (error) throw error;
      showMessage("اگر این ایمیل حسابی داشته باشه، لینک بازیابی براش ارسال می‌شه.", "success");
    } catch (error) {
      showMessage(friendlyError(error), "error");
    } finally {
      setBusy(button, false);
    }
  });

  $("saveNewPassword").addEventListener("click", async () => {
    const password = $("newPassword").value;
    if (password.length < 8 || password !== $("newPasswordConfirm").value) {
      showMessage("رمز جدید باید حداقل ۸ کاراکتر باشه و هر دو فیلد یکسان باشند.", "error");
      return;
    }
    const button = $("saveNewPassword");
    setBusy(button, true);
    try {
      const { error } = await client.auth.updateUser({ password });
      if (error) throw error;
      showMessage("رمز عبور با موفقیت تغییر کرد. حالا می‌تونی وارد سایت بشی.", "success");
      await client.auth.signOut();
      showMode("login");
    } catch (error) {
      showMessage(friendlyError(error), "error");
    } finally {
      setBusy(button, false);
    }
  });

  $("logoutButton").addEventListener("click", async () => {
    const button = $("logoutButton");
    setBusy(button, true);
    try {
      const { error } = await client.auth.signOut();
      if (error) throw error;
      showMessage("از حساب خارج شدی.", "success");
    } catch (error) {
      showMessage(friendlyError(error), "error");
    } finally {
      setBusy(button, false);
    }
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
      showMode("recovery");
    } else {
      renderSession(session);
    }
  });

  client.auth.getSession().then(({ data, error }) => {
    if (error) showMessage(friendlyError(error), "error");
    renderSession(data?.session || null);
    if (new URLSearchParams(window.location.search).get("mode") === "recovery" && data?.session) {
      $("recoveryTitle").textContent = "انتخاب رمز عبور جدید";
      $("recoveryDescription").textContent = "رمز عبور جدیدت رو وارد کن.";
      $("recoveryEmailGroup").hidden = true;
      $("newPasswordGroup").hidden = false;
      showMode("recovery");
    }
  }).catch((error) => {
    loading.hidden = true;
    showMessage(friendlyError(error), "error");
    forms.hidden = false;
    showMode("login");
  });
})();
