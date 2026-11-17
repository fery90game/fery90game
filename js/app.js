
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // عناصر موردنیاز صفحه
    const menuButton = document.getElementById("mobileMenuButton");
    const navigation = document.getElementById("mainNavigation");

    const searchInput = document.getElementById("siteSearch");
    const searchButton = document.getElementById("searchButton");
    const searchHint = document.getElementById("searchHint");
    const emptySearch = document.getElementById("emptySearch");

    const categoryCards = Array.from(
        document.querySelectorAll(".searchable-card")
    );

    const currentYear = document.getElementById("currentYear");

    // به‌روزرسانی سال پایین سایت
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // باز و بسته کردن منوی موبایل
    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("is-open");

            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute(
                "aria-label",
                isOpen ? "بستن منو" : "باز کردن منو"
            );
        });

        // بعد از انتخاب یکی از لینک‌ها، منو بسته شود
        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navigation.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "باز کردن منو");
            });
        });

        // اگر صفحه بزرگ شد، وضعیت منوی موبایل پاک شود
        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                navigation.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "باز کردن منو");
            }
        });
    }

    // جست‌وجوی ساده در کارت‌های دسته‌بندی صفحه اصلی
    function normalizeText(value) {
        return value
            .toLocaleLowerCase("fa")
            .replace(/ي/g, "ی")
            .replace(/ك/g, "ک")
            .replace(/\u200c/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function performSearch(shouldScroll = false) {
        if (!searchInput) {
            return;
        }

        const query = normalizeText(searchInput.value);
        let visibleCount = 0;

        categoryCards.forEach((card) => {
            const searchableText = normalizeText(
                `${card.textContent} ${card.dataset.search || ""}`
            );

            const matches = query === "" || searchableText.includes(query);

            card.hidden = !matches;

            if (matches) {
                visibleCount++;
            }
        });

        if (emptySearch) {
            emptySearch.hidden = visibleCount !== 0;
        }

        if (searchHint) {
            if (query === "") {
                searchHint.textContent =
                    "در بخش‌های این صفحه جست‌وجو کن و سریع‌تر به مقصدت برس.";
            } else if (visibleCount > 0) {
                searchHint.textContent =
                    `${visibleCount} بخش مرتبط پیدا شد.`;
            } else {
                searchHint.textContent =
                    "چیزی با این عبارت پیدا نشد؛ عبارت دیگری را امتحان کن.";
            }
        }

        const categoriesSection = document.getElementById("categories");

        if (shouldScroll && query !== "" && categoriesSection) {
            categoriesSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            // نتایج هنگام تایپ به‌روز شوند؛ بدون پرش صفحه
            performSearch(false);
        });

        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                performSearch(true);
            }

            if (event.key === "Escape") {
                searchInput.value = "";
                performSearch(false);
            }
        });
    }

    if (searchButton) {
        searchButton.addEventListener("click", () => performSearch(true));
    }
});
