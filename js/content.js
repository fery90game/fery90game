"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("contentSearch");
    const clearButton = document.getElementById("contentSearchClear");
    const resetButton = document.getElementById("contentResetButton");
    const filterButtons = Array.from(document.querySelectorAll(".content-filter-button"));
    const cards = Array.from(document.querySelectorAll(".content-video-card"));
    const resultCount = document.getElementById("contentResultCount");
    const emptyState = document.getElementById("contentEmptyState");

    const aparatVideos = [
        { hash: "yydu5e9", divId: "51379356686" },
        { hash: "fiyqdi0", divId: "63420888006" },
        { hash: "hqlirnp", divId: "24790286533" },
        { hash: "hgpe3td", divId: "14582859695" },
        { hash: "psq0s8d", divId: "68805524093" },
        { hash: "veh49oa", divId: "75853586373" }
    ];

    if (!searchInput || !clearButton || !resultCount || !emptyState || cards.length === 0) {
        return;
    }

    let activeFilter = "all";

    function normalizeText(value) {
        return String(value || "")
            .toLocaleLowerCase("fa")
            .replace(/ي/g, "ی")
            .replace(/ك/g, "ک")
            .replace(/\u200c/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function updateResults() {
        const query = normalizeText(searchInput.value);
        let visibleCount = 0;

        cards.forEach((card) => {
            const category = card.dataset.category || "";
            const searchableText = normalizeText(`${card.dataset.search || ""} ${card.textContent || ""}`);
            const matchesCategory = activeFilter === "all" || category === activeFilter;
            const matchesSearch = query === "" || searchableText.includes(query);
            const isVisible = matchesCategory && matchesSearch;
            card.hidden = !isVisible;
            if (isVisible) visibleCount += 1;
        });

        resultCount.textContent = visibleCount.toLocaleString("fa-IR");
        emptyState.hidden = visibleCount !== 0;
    }

    function setActiveFilter(filter) {
        activeFilter = filter;
        filterButtons.forEach((button) => {
            const isActive = button.dataset.filter === filter;
            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
        updateResults();
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => setActiveFilter(button.dataset.filter || "all"));
    });

    searchInput.addEventListener("input", updateResults);
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            searchInput.value = "";
            updateResults();
            searchInput.focus();
        }
    });

    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        updateResults();
        searchInput.focus();
    });

    function resetFilters() {
        searchInput.value = "";
        setActiveFilter("all");
        searchInput.focus();
    }

    if (resetButton) resetButton.addEventListener("click", resetFilters);

    document.querySelectorAll("[data-aparat-index]").forEach((button) => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.aparatIndex);
            const video = aparatVideos[index];
            const card = button.closest(".content-video-card");
            if (!video || !card || card.dataset.aparatLoaded === "true") return;

            const player = card.querySelector(".content-aparat-player");
            const thumbnail = card.querySelector(".content-video-thumbnail");
            if (!player || !thumbnail) return;

            card.dataset.aparatLoaded = "true";
            thumbnail.hidden = true;
            player.hidden = false;
            player.replaceChildren();

            const embedRoot = document.createElement("div");
            embedRoot.id = video.divId;
            embedRoot.className = "content-aparat-embed-root";
            player.appendChild(embedRoot);

            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = `https://www.aparat.com/embed/${video.hash}?data[rnddiv]=${video.divId}&data[responsive]=yes&titleShow=true&recom=self`;
            script.onerror = () => {
                card.dataset.aparatLoaded = "false";
                player.replaceChildren();
                player.hidden = true;
                thumbnail.hidden = false;

                let error = thumbnail.querySelector(".content-aparat-error");
                if (!error) {
                    error = document.createElement("p");
                    error.className = "content-aparat-error";
                    error.setAttribute("role", "status");
                    thumbnail.appendChild(error);
                }
                error.textContent = "بارگذاری ویدیو ناموفق بود. اتصال را بررسی کن و دوباره تلاش کن؛ یا از لینک آپارات پایین کارت استفاده کن.";

                const loadButton = thumbnail.querySelector("[data-aparat-index]");
                if (loadButton) {
                    loadButton.querySelector("span")?.remove();
                    loadButton.textContent = "تلاش دوباره برای پخش";
                }
            };
            embedRoot.appendChild(script);
        });
    });

    updateResults();
});
