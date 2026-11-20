(() => {
  "use strict";

  const STORAGE_KEY = "fery90game-theme";
  const root = document.documentElement;
  const isTheme = value => value === "light" || value === "dark";
  const getSavedTheme = () => {
    try { return localStorage.getItem(STORAGE_KEY); }
    catch (_) { return null; }
  };
  const systemTheme = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

  function applyTheme(theme) {
    const selected = isTheme(theme) ? theme : "dark";
    root.dataset.theme = selected;

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", selected === "light" ? "#f6faf5" : "#090b14");

    const button = document.querySelector("[data-theme-control]");
    if (button) {
      const light = selected === "light";
      const icon = button.querySelector(".theme-toggle-icon");
      if (icon) icon.textContent = light ? "☀" : "☾";
      button.setAttribute("aria-label", light ? "تغییر به تم تاریک" : "تغییر به تم روشن");
      button.setAttribute("title", light ? "تغییر به تم تاریک" : "تغییر به تم روشن");
      button.setAttribute("aria-pressed", String(light));
    }
  }

  function findHeader() {
    return document.querySelector(
      ".header-inner, .products-header-inner, .about-header-inner, .topbar, .pong-header-inner, .pong-header"
    );
  }

  function mountThemeControl() {
    const existing = document.querySelector("[data-theme-control]");
    if (existing) {
      applyTheme(root.dataset.theme);
      return;
    }

    const header = findHeader();
    if (!header) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.dataset.themeControl = "true";
    button.innerHTML = '<span class="theme-toggle-icon" aria-hidden="true">☾</span>';
    button.addEventListener("click", () => {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      try { localStorage.setItem(STORAGE_KEY, next); } catch (_) { /* storage may be blocked */ }
      applyTheme(next);
    });

    // Place the switch beside the account/back action, not after an arbitrary
    // flex child. Its fixed dimensions make the header geometry invariant.
    const anchor = header.querySelector(
      ".header-account-link, .header-cta, .back, .back-link, .pong-back, .button-secondary"
    );
    if (anchor && anchor.parentElement === header) header.insertBefore(button, anchor);
    else header.appendChild(button);

    applyTheme(root.dataset.theme);
  }

  applyTheme(isTheme(getSavedTheme()) ? getSavedTheme() : systemTheme());
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountThemeControl, { once: true });
  } else {
    mountThemeControl();
  }

  if (window.matchMedia) {
    const preference = window.matchMedia("(prefers-color-scheme: light)");
    const onSystemChange = event => {
      if (!isTheme(getSavedTheme())) applyTheme(event.matches ? "light" : "dark");
    };
    if (preference.addEventListener) preference.addEventListener("change", onSystemChange);
    else if (preference.addListener) preference.addListener(onSystemChange);
  }
})();
