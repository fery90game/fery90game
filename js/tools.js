
"use strict";

(() => {
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    const STORAGE_KEYS = {
        games: "fery90game_tools_games_v1",
        favorites: "fery90game_tools_favorites_v1"
    };

    const DEFAULT_GAMES = [
        "Minecraft",
        "GTA V",
        "BeamNG.drive",
        "EA SPORTS FC",
        "PUBG",
        "Fortnite"
    ];

    const CHALLENGES = {
        minecraft: {
            easy: [
                "در یک روز بازی، یک پناهگاه کوچک بساز.",
                "سه نوع محصول کشاورزی متفاوت جمع‌آوری کن.",
                "یک مسیر امن بین خانه و نزدیک‌ترین روستا بساز."
            ],
            medium: [
                "بدون استفاده از راهنمای اینترنتی، یک مزرعه خودکار طراحی کن.",
                "یک پایگاه با دو اتاق کاربردی بساز و تمام بخش‌ها را روشن کن.",
                "در یک جلسه بازی، سه هدف متفاوت برای پیشرفت خودت تعیین کن."
            ],
            hard: [
                "یک پایگاه چندطبقه با انبار مرتب و مسیرهای مشخص بساز.",
                "یک سفر اکتشافی انجام بده و منابع جمع‌شده را دسته‌بندی کن.",
                "یک سازه بزرگ را با محدودیت استفاده از یک نوع بلوک تزئینی طراحی کن."
            ],
            chaos: [
                "یک خانه بساز که ورودی آن مخفی باشد و مسیر دسترسی‌اش را هوشمندانه طراحی کن.",
                "یک روستای کوچک با چند ساختمان و مسیرهای متصل ایجاد کن.",
                "یک پایگاه بساز که در آن هر اتاق کاربردی متفاوت داشته باشد."
            ]
        },
        survival: {
            easy: [
                "یک پناهگاه اولیه بساز و منابع ضروری را مرتب کن.",
                "یک مسیر امن برای گشت‌وگذار مشخص کن.",
                "سه منبع مختلف پیدا کن و برای استفاده از آن‌ها برنامه بریز."
            ],
            medium: [
                "یک پایگاه جدید در مکانی متفاوت راه‌اندازی کن.",
                "با منابع محدود، یک چرخه پایدار برای غذا و تجهیزات بساز.",
                "یک منطقه ناشناخته را بررسی و منابع مهم آن را ثبت کن."
            ],
            hard: [
                "یک جلسه کامل با محدودیت تجهیزات اضافه بازی کن.",
                "پایگاهت را با منابع موجود ارتقا بده، بدون خرید تجهیزات جدید.",
                "برای یک مأموریت دشوار، مسیر و منابع موردنیاز را از قبل برنامه‌ریزی کن."
            ],
            chaos: [
                "یک پایگاه تازه را با محدودیت فضای ساخت طراحی کن.",
                "یک مأموریت اکتشافی انجام بده و از هر منبع فقط به‌اندازه نیاز استفاده کن.",
                "یک مسیر طولانی را با تجهیزات محدود و برنامه‌ریزی دقیق کامل کن."
            ]
        },
        racing: {
            easy: [
                "یک مسابقه را با خودرویی که کمتر استفاده کرده‌ای تمام کن.",
                "در یک پیست، سه پیچ سخت را تمرین کن.",
                "با یک خودروی جدید رکورد شخصی ثبت کن."
            ],
            medium: [
                "یک دور کامل با تمرکز روی رانندگی تمیز و بدون برخورد انجام بده.",
                "دو خودرو را در یک مسیر یکسان مقایسه کن.",
                "با تنظیمات متفاوت خودرو، نتیجه دو مسابقه را مقایسه کن."
            ],
            hard: [
                "یک مسابقه را با خودرویی متفاوت از انتخاب همیشگی‌ات تمام کن.",
                "در یک مسیر دشوار، زمان خودت را بهبود بده.",
                "با محدودیت انتخاب خودرو، بهترین نتیجه ممکن را ثبت کن."
            ],
            chaos: [
                "یک مسیر آشنا را با خودرویی کاملاً متفاوت امتحان کن.",
                "یک مسابقه را با تنظیمات جدید و بدون تغییر میان مسابقه انجام بده.",
                "در یک مسیر، چند سبک رانندگی متفاوت را مقایسه کن."
            ]
        },
        football: {
            easy: [
                "با تیمی که کمتر انتخابش می‌کنی یک مسابقه انجام بده.",
                "در یک بازی، روی پاس‌کاری بیشتر تمرکز کن.",
                "یک ترکیب تاکتیکی جدید امتحان کن."
            ],
            medium: [
                "یک مسابقه را با تیمی خارج از انتخاب‌های همیشگی‌ات بازی کن.",
                "ترکیب تیم را تغییر بده و نتیجه را با بازی قبلی مقایسه کن.",
                "یک مسابقه انجام بده و روی ساخت موقعیت از جناحین تمرکز کن."
            ],
            hard: [
                "با تیم ضعیف‌تر مقابل تیم قوی‌تر بازی کن.",
                "یک ترکیب غیرمعمول انتخاب کن و تا پایان مسابقه حفظش کن.",
                "درجه سختی یا قدرت حریف را افزایش بده و نتیجه را ثبت کن."
            ],
            chaos: [
                "یک تیم تصادفی انتخاب کن و با همان تیم مسابقه بده.",
                "از ترکیبی استفاده کن که معمولاً انتخاب نمی‌کنی.",
                "دو مسابقه با تاکتیک‌های کاملاً متفاوت انجام بده و نتایج را مقایسه کن."
            ]
        },
        shooter: {
            easy: [
                "یک مسابقه با سلاحی که کمتر استفاده می‌کنی انجام بده.",
                "روی دقت نشانه‌گیری در تمرین یا مسابقه تمرکز کن.",
                "نقشه‌ای را انتخاب کن که کمتر در آن بازی کرده‌ای."
            ],
            medium: [
                "یک مسابقه را با تجهیزات متفاوت از انتخاب همیشگی‌ات انجام بده.",
                "یک سبک بازی تازه را امتحان کن و نتیجه را ثبت کن.",
                "در یک جلسه، روی ارتباط تیمی و موقعیت‌گیری تمرکز کن."
            ],
            hard: [
                "یک مسابقه با محدودیت انتخاب تجهیزات انجام بده.",
                "نقشه‌ای را انتخاب کن که به‌خوبی نمی‌شناسی و مسیرهایش را یاد بگیر.",
                "پس از هر مسابقه یک اشتباه مهم را شناسایی و برای اصلاحش برنامه‌ریزی کن."
            ],
            chaos: [
                "یک مسابقه با ترکیب تجهیزات غیرمعمول انجام بده.",
                "سبک بازی همیشگی‌ات را تغییر بده و نتیجه را مقایسه کن.",
                "یک مسابقه را با تمرکز روی هدف تیمی، نه فقط آمار شخصی، انجام بده."
            ]
        },
        any: {
            easy: [
                "یک قابلیت بازی را امتحان کن که قبلاً نادیده گرفته‌ای.",
                "یک هدف کوچک تعیین کن و تا پایان جلسه آن را انجام بده.",
                "یک مرحله یا نقشه تازه را انتخاب کن."
            ],
            medium: [
                "یک قانون تازه برای جلسه بازی خودت تعیین کن.",
                "یک سبک بازی متفاوت را امتحان کن.",
                "یک رکورد شخصی تعیین کن و برای رسیدن به آن تلاش کن."
            ],
            hard: [
                "در بازی موردعلاقه‌ات یک هدف فرعی دشوار تعیین کن.",
                "یک محدودیت جدید انتخاب کن و با آن بازی کن.",
                "از روشی متفاوت برای عبور از یک مرحله استفاده کن."
            ],
            chaos: [
                "یک حالت بازی انتخاب کن که معمولاً سراغش نمی‌روی.",
                "سه هدف کوچک تعیین کن و به ترتیب انجامشان بده.",
                "یک سبک کاملاً متفاوت امتحان کن و تجربه‌ات را ثبت کن."
            ]
        }
    };

    const USERNAME_PARTS = {
        pro: {
            first: ["Prime", "Elite", "Ace", "Ultra", "Nova", "Vortex", "Rapid", "Core"],
            last: ["Strike", "Clutch", "Aim", "Rival", "Pulse", "Scope", "Rush", "Force"]
        },
        dark: {
            first: ["Shadow", "Phantom", "Night", "Void", "Ghost", "Raven", "Dark", "Silent"],
            last: ["Reaper", "Echo", "Fang", "Storm", "Specter", "Wolf", "Blade", "Shade"]
        },
        fun: {
            first: ["Pixel", "Potato", "Waffle", "Noodle", "Mango", "Bouncy", "Tiny", "Sleepy"],
            last: ["Wizard", "Ninja", "Goblin", "Panda", "Duck", "Toast", "Penguin", "Rocket"]
        },
        short: {
            first: ["Zen", "Neo", "Rex", "Kai", "Zed", "Ace", "Lux", "Fox"],
            last: ["Bit", "Max", "X", "Pro", "One", "Go", "Fox", "GG"]
        },
        all: {
            first: [
                "Nova", "Shadow", "Pixel", "Rapid", "Phantom", "Neon",
                "Frost", "Turbo", "Cosmic", "Rogue", "Lucky", "Storm"
            ],
            last: [
                "Rider", "Wolf", "Byte", "Hunter", "Ninja", "Spark",
                "Knight", "Runner", "Falcon", "Player", "Fox", "Core"
            ]
        }
    };

    const state = {
        games: [],
        favorites: [],
        favoriteFilter: "all",
        lastChallenges: [],
        lastUsernames: []
    };

    function readStorage(key, fallback, validator) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return fallback;

            const parsed = JSON.parse(raw);
            return validator(parsed) ? parsed : fallback;
        } catch {
            return fallback;
        }
    }

    function saveStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    }

    function normalizeText(value) {
        return String(value)
            .trim()
            .replace(/[يى]/g, "ی")
            .replace(/ك/g, "ک");
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function pickRandom(items) {
        if (!items.length) return null;

        if (window.crypto && typeof window.crypto.getRandomValues === "function") {
            const limit = Math.floor(4294967296 / items.length) * items.length;
            const sample = new Uint32Array(1);

            do {
                window.crypto.getRandomValues(sample);
            } while (sample[0] >= limit);

            return items[sample[0] % items.length];
        }

        return items[Math.floor(Math.random() * items.length)];
    }

    function showStatus(elementId, message, isError = false) {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.textContent = message;
        element.classList.toggle("is-error", isError);
    }

    function makeId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    function getGameLabel(value) {
        const labels = {
            minecraft: "Minecraft",
            survival: "بازی‌های بقا",
            racing: "بازی‌های مسابقه‌ای",
            football: "بازی‌های فوتبالی",
            shooter: "بازی‌های شوتر",
            any: "هر بازی"
        };

        return labels[value] || "هر بازی";
    }

    function getDifficultyLabel(value) {
        const labels = {
            easy: "آسان",
            medium: "متوسط",
            hard: "سخت",
            chaos: "دیوانه‌وار"
        };

        return labels[value] || "متوسط";
    }

    function renderChallenges(challenges) {
        const container = $("#challengeResults");
        if (!container) return;

        if (!challenges.length) {
            container.innerHTML = `
                <div class="tools-empty-state">
                    <strong>چالشی پیدا نشد.</strong>
                    <p>دوباره تلاش کن.</p>
                </div>`;
            return;
        }

        container.innerHTML = challenges.map((item, index) => `
            <article class="tools-challenge-card">
                <div class="tools-challenge-card-top">
                    <span class="tools-challenge-index">CHALLENGE ${String(index + 1).padStart(2, "0")}</span>
                    <span class="tools-difficulty-pill">${escapeHTML(item.difficultyLabel)}</span>
                </div>
                <h3>${escapeHTML(item.text)}</h3>
                <div class="tools-challenge-card-bottom">
                    <span>${escapeHTML(item.gameLabel)}</span>
                    <button type="button" class="tools-save-button"
                            data-save-challenge="${escapeHTML(item.id)}"
                            aria-label="ذخیره چالش">♡ ذخیره</button>
                </div>
            </article>
        `).join("");
    }

    function generateChallenges() {
        const game = $("#challengeGame")?.value || "minecraft";
        const difficulty = $("#challengeDifficulty")?.value || "medium";
        const count = Number($("#challengeCount")?.value || 3);
        const gameData = CHALLENGES[game] || CHALLENGES.any;
        const pool = [...(gameData[difficulty] || gameData.medium)];
        const selected = [];

        while (selected.length < Math.min(count, pool.length)) {
            const choice = pickRandom(pool);
            if (!choice) break;

            selected.push({
                id: makeId(),
                text: choice,
                game,
                difficulty,
                gameLabel: getGameLabel(game),
                difficultyLabel: getDifficultyLabel(difficulty)
            });

            pool.splice(pool.indexOf(choice), 1);
        }

        state.lastChallenges = selected;
        renderChallenges(selected);
        showStatus("challengeStatus", `${selected.length} چالش آماده شد.`);
    }

    function addFavorite(type, value, metadata = {}) {
        const duplicate = state.favorites.some(item =>
            item.type === type && item.value === value
        );

        if (duplicate) {
            showStatus("favoriteStatus", "این مورد قبلاً ذخیره شده است.");
            return;
        }

        state.favorites.unshift({
            id: makeId(),
            type,
            value,
            metadata,
            createdAt: Date.now()
        });

        if (!saveStorage(STORAGE_KEYS.favorites, state.favorites)) {
            state.favorites.shift();
            showStatus(
                "favoriteStatus",
                "ذخیره‌سازی در مرورگر انجام نشد؛ ممکن است فضای ذخیره‌سازی محدود باشد.",
                true
            );
            return;
        }

        renderFavorites();
        showStatus("favoriteStatus", "به علاقه‌مندی‌ها اضافه شد.");
    }

    function buildUsernames() {
        const base = normalizeText($("#usernameBase")?.value || "")
            .replace(/[<>]/g, "")
            .slice(0, 18);

        const style = $("#usernameStyle")?.value || "all";
        const parts = USERNAME_PARTS[style] || USERNAME_PARTS.all;
        const names = new Set();
        const maxAttempts = 100;

        for (let attempt = 0; attempt < maxAttempts && names.size < 8; attempt++) {
            const first = pickRandom(parts.first);
            const last = pickRandom(parts.last);
            const number = pickRandom(["", "", "", "7", "21", "90", "99", "404"]);

            let name;

            if (base) {
                const pattern = pickRandom([
                    `${base}${last}`,
                    `${first}${base}`,
                    `${base}_${last}`,
                    `${first}${base}${number}`,
                    `${base}${number}`
                ]);

                name = pattern;
            } else {
                name = pickRandom([
                    `${first}${last}`,
                    `${first}_${last}`,
                    `${first}${number}`,
                    `${last}${number}`
                ]);
            }

            if (name && name.length <= 30) names.add(name);
        }

        state.lastUsernames = [...names];
        renderUsernames(state.lastUsernames);
        showStatus("usernameStatus", `${state.lastUsernames.length} پیشنهاد ساخته شد.`);
    }

    function renderUsernames(names) {
        const container = $("#usernameResults");
        if (!container) return;

        if (!names.length) {
            container.innerHTML = `<p class="tools-muted">پیشنهادی ساخته نشد؛ دوباره امتحان کن.</p>`;
            return;
        }

        container.innerHTML = names.map(name => `
            <article class="tools-username-card">
                <span class="tools-username-value">${escapeHTML(name)}</span>
                <div class="tools-username-actions">
                    <button type="button" class="tools-mini-button"
                            data-copy-username="${escapeHTML(name)}">کپی</button>
                    <button type="button" class="tools-mini-button"
                            data-save-username="${escapeHTML(name)}">♡ ذخیره</button>
                </div>
            </article>
        `).join("");
    }

    async function copyText(value) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(value);
                return true;
            }

            const temporary = document.createElement("textarea");
            temporary.value = value;
            temporary.setAttribute("readonly", "");
            temporary.style.position = "fixed";
            temporary.style.opacity = "0";
            temporary.style.pointerEvents = "none";
            document.body.appendChild(temporary);
            temporary.select();

            const success = document.execCommand("copy");
            temporary.remove();
            return success;
        } catch {
            return false;
        }
    }

    async function copyAndReport(value, statusId) {
        const success = await copyText(value);

        showStatus(
            statusId,
            success
                ? "متن کپی شد."
                : "کپی خودکار ممکن نشد؛ متن را انتخاب و دستی کپی کن.",
            !success
        );
    }

    function renderGames() {
        const container = $("#gameList");
        if (!container) return;

        const countElement = $("#gameCount");
        if (countElement) {
            const digits = String(state.games.length).replace(/\d/g, digit => "۰۱۲۳۴۵۶۷۸۹"[digit]);
            countElement.textContent = `${digits} بازی`;
        }

        if (!state.games.length) {
            container.innerHTML = `
                <div class="tools-empty-state">
                    <strong>فهرست خالی است</strong>
                    <p>یک بازی اضافه کن تا انتخاب تصادفی فعال شود.</p>
                </div>`;
            return;
        }

        container.innerHTML = state.games.map(game => `
            <div class="tools-game-chip">
                <span>${escapeHTML(game)}</span>
                <button type="button" data-remove-game="${escapeHTML(game)}"
                        aria-label="حذف ${escapeHTML(game)}" title="حذف بازی">×</button>
            </div>
        `).join("");
    }

    function addGame(name) {
        const normalized = normalizeText(name);

        if (!normalized) {
            showStatus("gameStatus", "نام بازی را وارد کن.", true);
            return false;
        }

        if (state.games.some(game => game.toLocaleLowerCase() === normalized.toLocaleLowerCase())) {
            showStatus("gameStatus", "این بازی در فهرست وجود دارد.", true);
            return false;
        }

        if (state.games.length >= 100) {
            showStatus("gameStatus", "حداکثر ۱۰۰ بازی می‌توانی اضافه کنی.", true);
            return false;
        }

        state.games.push(normalized);

        if (!saveStorage(STORAGE_KEYS.games, state.games)) {
            state.games.pop();
            showStatus("gameStatus", "ذخیره فهرست ممکن نشد.", true);
            return false;
        }

        renderGames();
        showStatus("gameStatus", "بازی به فهرست اضافه شد.");
        return true;
    }

    function removeGame(name) {
        const index = state.games.indexOf(name);
        if (index === -1) return;

        const removed = state.games.splice(index, 1)[0];

        if (!saveStorage(STORAGE_KEYS.games, state.games)) {
            state.games.splice(index, 0, removed);
            showStatus("gameStatus", "ذخیره تغییرات ممکن نشد.", true);
            return;
        }

        renderGames();
        showStatus("gameStatus", "بازی از فهرست حذف شد.");
    }

    function pickGame() {
        const result = $("#pickedGameName");
        const symbol = $(".tools-picker-symbol");

        if (!state.games.length) {
            if (result) result.textContent = "ابتدا بازی اضافه کن";
            showStatus("gameStatus", "فهرست بازی‌ها خالی است.", true);
            return;
        }

        const chosen = pickRandom(state.games);
        if (result) result.textContent = chosen;
        if (symbol) symbol.textContent = "✓";

        showStatus("gameStatus", "انتخاب انجام شد. خوش بگذره!");
    }

    function renderFavorites() {
        const container = $("#favoriteResults");
        if (!container) return;

        const filtered = state.favoriteFilter === "all"
            ? state.favorites
            : state.favorites.filter(item => item.type === state.favoriteFilter);

        if (!filtered.length) {
            container.innerHTML = `
                <div class="tools-empty-state">
                    <span>♡</span>
                    <strong>چیزی برای نمایش نیست</strong>
                    <p>موارد دلخواهت را از ابزارهای بالا ذخیره کن.</p>
                </div>`;
            return;
        }

        container.innerHTML = filtered.map(item => {
            const typeLabel = item.type === "challenge" ? "چالش" : "اسم گیمینگ";
            const detail = item.metadata?.gameLabel || typeLabel;

            return `
                <article class="tools-favorite-card">
                    <div>
                        <span class="tools-favorite-type">${escapeHTML(detail)}</span>
                        <p>${escapeHTML(item.value)}</p>
                    </div>
                    <div class="tools-favorite-actions">
                        <button type="button" class="tools-mini-button"
                                data-copy-favorite="${escapeHTML(item.id)}">کپی</button>
                        <button type="button" class="tools-mini-button tools-remove-favorite"
                                data-remove-favorite="${escapeHTML(item.id)}">حذف</button>
                    </div>
                </article>`;
        }).join("");
    }

    function removeFavorite(id) {
        const old = state.favorites;
        state.favorites = old.filter(item => item.id !== id);

        if (!saveStorage(STORAGE_KEYS.favorites, state.favorites)) {
            state.favorites = old;
            showStatus("favoriteStatus", "حذف مورد ذخیره نشد.", true);
            return;
        }

        renderFavorites();
        showStatus("favoriteStatus", "مورد از علاقه‌مندی‌ها حذف شد.");
    }

    function clearFavorites() {
        if (!state.favorites.length) {
            showStatus("favoriteStatus", "فهرست علاقه‌مندی‌ها خالی است.");
            return;
        }

        const confirmed = window.confirm("همه موارد ذخیره‌شده پاک شوند؟");
        if (!confirmed) return;

        const old = state.favorites;
        state.favorites = [];

        if (!saveStorage(STORAGE_KEYS.favorites, state.favorites)) {
            state.favorites = old;
            showStatus("favoriteStatus", "پاک کردن فهرست انجام نشد.", true);
            return;
        }

        renderFavorites();
        showStatus("favoriteStatus", "همه علاقه‌مندی‌ها پاک شدند.");
    }

    function resetGames() {
        const old = state.games;
        state.games = [...DEFAULT_GAMES];

        if (!saveStorage(STORAGE_KEYS.games, state.games)) {
            state.games = old;
            showStatus("gameStatus", "بازگردانی فهرست ممکن نشد.", true);
            return;
        }

        renderGames();
        showStatus("gameStatus", "فهرست پیش‌فرض بازی‌ها بازگردانی شد.");
    }

    function bindEvents() {
        $("#generateChallenges")?.addEventListener("click", generateChallenges);
        $("#generateUsernames")?.addEventListener("click", buildUsernames);

        $("#challengeResults")?.addEventListener("click", event => {
            const button = event.target.closest("[data-save-challenge]");
            if (!button) return;

            const challenge = state.lastChallenges.find(
                item => item.id === button.dataset.saveChallenge
            );

            if (challenge) {
                addFavorite("challenge", challenge.text, {
                    gameLabel: challenge.gameLabel,
                    difficultyLabel: challenge.difficultyLabel
                });
            }
        });

        $("#usernameResults")?.addEventListener("click", async event => {
            const copyButton = event.target.closest("[data-copy-username]");
            const saveButton = event.target.closest("[data-save-username]");

            if (copyButton) {
                await copyAndReport(copyButton.dataset.copyUsername, "usernameStatus");
            }

            if (saveButton) {
                addFavorite("username", saveButton.dataset.saveUsername);
            }
        });

        $("#addGameForm")?.addEventListener("submit", event => {
            event.preventDefault();

            const input = $("#newGameName");
            if (input && addGame(input.value)) {
                input.value = "";
                input.focus();
            }
        });

        $("#gameList")?.addEventListener("click", event => {
            const button = event.target.closest("[data-remove-game]");
            if (button) removeGame(button.dataset.removeGame);
        });

        $("#pickRandomGame")?.addEventListener("click", pickGame);
        $("#resetGames")?.addEventListener("click", resetGames);
        $("#clearFavorites")?.addEventListener("click", clearFavorites);

        $$(".tools-filter-button").forEach(button => {
            button.addEventListener("click", () => {
                state.favoriteFilter = button.dataset.favoriteFilter || "all";

                $$(".tools-filter-button").forEach(tab => {
                    const active = tab === button;
                    tab.classList.toggle("active", active);
                    tab.setAttribute("aria-pressed", String(active));
                });

                renderFavorites();
            });
        });

        $("#favoriteResults")?.addEventListener("click", async event => {
            const copyButton = event.target.closest("[data-copy-favorite]");
            const removeButton = event.target.closest("[data-remove-favorite]");

            if (copyButton) {
                const item = state.favorites.find(
                    favorite => favorite.id === copyButton.dataset.copyFavorite
                );

                if (item) await copyAndReport(item.value, "favoriteStatus");
            }

            if (removeButton) {
                removeFavorite(removeButton.dataset.removeFavorite);
            }
        });
    }

    function initialize() {
        state.games = readStorage(
            STORAGE_KEYS.games,
            [...DEFAULT_GAMES],
            value => Array.isArray(value) &&
                value.length <= 100 &&
                value.every(item => typeof item === "string" && item.length <= 60)
        );

        state.favorites = readStorage(
            STORAGE_KEYS.favorites,
            [],
            value => Array.isArray(value) &&
                value.length <= 1000 &&
                value.every(item =>
                    item &&
                    typeof item.id === "string" &&
                    ["challenge", "username"].includes(item.type) &&
                    typeof item.value === "string"
                )
        );

        renderGames();
        renderFavorites();
        bindEvents();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
})();
