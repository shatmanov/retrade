(() => {
    "use strict";

    // ============================================================
    // SETTINGS
    // ============================================================

    /*
     * true  — выводить диагностические сообщения в Console.
     * false — не выводить console.log / console.error.
     */
    const devMode = false;

    const log = (...args) => {
        if (devMode) {
            console.log(...args);
        }
    };

    const error = (...args) => {
        if (devMode) {
            console.error(...args);
        }
    };

    const {
        DEFAULT_STATUS_SET,
        STATUS_SETS,
        STATUS_LABELS
    } = window.REMANGA_CARD_CONFIG;

    let activeStatusSet = DEFAULT_STATUS_SET;
    let CARD_STATUSES =
        STATUS_SETS[activeStatusSet]?.statuses ?? {};

    function getStatusSet(statusSet) {
        return STATUS_SETS[statusSet] ??
            STATUS_SETS[DEFAULT_STATUS_SET];
    }

    function setActiveStatusSet(statusSet) {
        const nextStatusSet =
            STATUS_SETS[statusSet]
                ? statusSet
                : DEFAULT_STATUS_SET;

        activeStatusSet = nextStatusSet;
        CARD_STATUSES =
            getStatusSet(activeStatusSet).statuses;
    }

    async function loadStatusSet() {
        try {
            const result =
                await chrome.storage.local.get(
                    "statusSet"
                );

            setActiveStatusSet(
                result.statusSet
            );
        } catch (storageError) {
            error(
                "[ReManga Card Statuses]",
                "Не удалось загрузить настройки:",
                storageError
            );
        }
    }

    chrome.storage.onChanged.addListener(
        (changes, areaName) => {
            if (
                areaName !== "local" ||
                !changes.statusSet
            ) {
                return;
            }

            setActiveStatusSet(
                changes.statusSet.newValue
            );

            clearRenderedStatuses();
            scheduleApply();
        }
    );


    /*
     * ReManga Card Statuses v2.0
     *
     * Стратегия:
     *
     * 1. Не делаем собственных API-запросов.
     * 2. Принимаем page=1, если успели перехватить запрос.
     * 3. Если page=1 произошёл до interceptor, после загрузки страницы
     *    пытаемся извлечь уже загруженные API-данные из Next.js/React
     *    state, которое присутствует в DOM.
     * 4. page=2, page=3, ... получаем через interceptor.
     * 5. При появлении новых .cs-card-item повторяем только DOM-сопоставление.
     */

    const RESPONSE_EVENT =
        "__REMANGA_CARD_STATUS_API_RESPONSE__";

    const REQUEST_EVENT =
        "__REMANGA_CARD_STATUS_API_REQUEST__";

    // ============================================================
    // STATE
    // ============================================================

    const state = {
        cards: new Map(),
        responseCount: 0,
        initialStateScanned: false,
        observer: null,
        applyTimer: null
    };

    // ============================================================
    // CARD DATA
    // ============================================================

    function normalizeCard(card) {
        if (!card || typeof card !== "object") {
            return null;
        }

        if (
            card.id == null ||
            !card.title ||
            card.title.id == null
        ) {
            return null;
        }

        return {
            cardId: card.id,
            cover: card.cover ?? null,
            titleId: card.title.id,
            mainName: card.title.main_name ?? "",
            secondaryName: card.title.secondary_name ?? "",
            dir: card.title.dir ?? ""
        };
    }

    function addCard(card) {
        const normalized =
            normalizeCard(card);

        if (!normalized) return;

        state.cards.set(
            String(normalized.cardId),
            normalized
        );
    }

    function processExchange(exchange) {
        for (
            const item of
            exchange?.items_creator?.cards ?? []
        ) {
            addCard(item?.card);
        }

        for (
            const item of
            exchange?.items_partner?.cards ?? []
        ) {
            addCard(item?.card);
        }
    }

    // ============================================================
    // API RESPONSE
    // ============================================================

    function processApiResponse(
        url,
        status,
        data
    ) {
        if (!data) return;

        let parsed;

        try {
            parsed = new URL(url);
        } catch {
            return;
        }

        const path = parsed.pathname;
        const page =
            parsed.searchParams.get("page");

        let added = 0;

        if (
            /^\/api\/v2\/inventory\/\d+\/exchanges\/?$/
                .test(path)
        ) {
            for (
                const exchange of
                data.results ?? []
            ) {
                const before =
                    state.cards.size;

                processExchange(
                    exchange
                );

                if (
                    state.cards.size >
                    before
                ) {
                    added +=
                        state.cards.size -
                        before;
                }
            }
        } else if (
            /^\/api\/v3\/inventory\/items\/cards\/\d+\/?$/
                .test(path)
        ) {
            for (
                const item of
                data.results ?? []
            ) {
                const before =
                    state.cards.size;

                addCard(item?.card);

                if (
                    state.cards.size >
                    before
                ) {
                    added++;
                }
            }
        } else if (
            /^\/api\/inventory\/\d+\/cards\/?$/
                .test(path)
        ) {
            for (
                const item of
                data.results ?? []
            ) {
                const before =
                    state.cards.size;

                addCard(
                    item?.card ?? item
                );

                if (
                    state.cards.size >
                    before
                ) {
                    added++;
                }
            }
        } else if (
            /^\/api\/inventory\/character\/\d+\/cards\/?$/
                .test(path)
        ) {
            /*
              * Character API: results[] contains card objects directly.
              */
            for (
                const item of
                data.results ?? []
            ) {
                const before =
                    state.cards.size;

                addCard(item);

                if (
                    state.cards.size >
                    before
                ) {
                    added +=
                        state.cards.size -
                        before;
                }
            }
        } else if (
            /^\/api\/inventory\/catalog\/?$/
                .test(path)
        ) {
            /*
              * Catalog API: results[] contains card objects directly.
              */
            for (
                const item of
                data.results ?? []
            ) {
                const before =
                    state.cards.size;

                addCard(item);

                if (
                    state.cards.size >
                    before
                ) {
                    added +=
                        state.cards.size -
                        before;
                }
            }
        } else {
            return;
        }

        state.responseCount++;

        log(
            "[ReManga Card Statuses] API response:",
            path,
            page
                ? `page=${page}`
                : "",
            "| status:",
            status,
            "| results:",
            Array.isArray(data.results)
                ? data.results.length
                : 0,
            "| new cards:",
            added,
            "| total:",
            state.cards.size
        );

        scheduleApply();
    }

    window.addEventListener(
        REQUEST_EVENT,
        event => {
            try {
                const payload =
                    JSON.parse(event.detail);

                log(
                    "[ReManga Card Statuses] API request:",
                    payload.url
                );
            } catch {}
        }
    );

    window.addEventListener(
        RESPONSE_EVENT,
        event => {
            try {
                const payload =
                    JSON.parse(event.detail);

                processApiResponse(
                    payload.url,
                    payload.status,
                    payload.data
                );
            } catch (err) {
                error(
                    "[ReManga Card Statuses] " +
                    "Ошибка обработки response:",
                    err
                );
            }
        }
    );

    // ============================================================
    // INITIAL PAGE DATA
    // ============================================================
    //
    // Важный момент:
    // если page=1 был загружен раньше interceptor, тело старого
    // network response получить напрямую уже нельзя.
    //
    // Поэтому после загрузки страницы ищем данные, которые Next.js
    // уже поместил в HTML/React state.
    //
    // Это НЕ новый API-запрос.
    // ============================================================

    function safeParse(value) {
        if (
            typeof value !== "string"
        ) {
            return null;
        }

        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }

    function walkObject(
        value,
        visited,
        depth
    ) {
        if (
            value == null ||
            depth > 12
        ) {
            return;
        }

        if (
            typeof value !== "object"
        ) {
            return;
        }

        if (
            visited.has(value)
        ) {
            return;
        }

        visited.add(value);

        /*
          * Ищем знакомые структуры API.
          */
        if (
            Array.isArray(value.results)
        ) {
            for (
                const item of value.results
            ) {
                if (
                    item?.items_creator ||
                    item?.items_partner
                ) {
                    processExchange(item);
                }

                if (
                    item?.card
                ) {
                    addCard(
                        item.card
                    );
                } else {
                    addCard(item);
                }
            }
        }

        if (
            value.items_creator ||
            value.items_partner
        ) {
            processExchange(
                value
            );
        }

        if (
            value.card &&
            value.card.title
        ) {
            addCard(
                value.card
            );
        }

        for (
            const key of
            Object.keys(value)
        ) {
            const child =
                value[key];

            if (
                child &&
                typeof child ===
                "object"
            ) {
                walkObject(
                    child,
                    visited,
                    depth + 1
                );
            }
        }
    }

    function scanParsedState(
        value
    ) {
        const before =
            state.cards.size;

        walkObject(
            value,
            new WeakSet(),
            0
        );

        return (
            state.cards.size -
            before
        );
    }

    function scanNextData() {
        let added = 0;

        /*
          * __NEXT_DATA__
          */
        const nextData =
            document.querySelector(
                "#__NEXT_DATA__"
            );

        if (nextData?.textContent) {
            const parsed =
                safeParse(
                    nextData.textContent
                );

            if (parsed) {
                added +=
                    scanParsedState(
                        parsed
                    );
            }
        }

        /*
          * Другие JSON script blocks.
          */
        const jsonScripts =
            document.querySelectorAll(
                'script[type="application/json"]'
            );

        for (
            const script of
            jsonScripts
        ) {
            const parsed =
                safeParse(
                    script.textContent
                );

            if (parsed) {
                added +=
                    scanParsedState(
                        parsed
                    );
            }
        }

        return added;
    }

    function scanInlineScripts() {
        /*
          * Некоторые версии Next.js/RSC хранят данные не как чистый JSON.
          * Ищем JSON-подобные фрагменты с card/title.
          *
          * Мы НЕ исполняем найденный код.
          */
        let added = 0;

        const scripts =
            document.querySelectorAll(
                "script:not([src])"
            );

        for (
            const script of
            scripts
        ) {
            const text =
                script.textContent || "";

            if (
                !text.includes(
                    "items_creator"
                ) &&
                !text.includes(
                    "items_partner"
                ) &&
                !text.includes(
                    "card-item"
                )
            ) {
                continue;
            }

            /*
              * Встроенные RSC данные часто содержат escaped quotes.
              * Приводим наиболее распространённые варианты к JSON-подобному
              * виду и ищем card-объекты.
              */
            const candidates = [
                text,
                text
                    .replace(/\\"/g, '"')
                    .replace(/\\\\/g, "\\")
            ];

            for (
                const source of
                candidates
            ) {
                /*
                  * Извлекаем card objects балансировкой скобок.
                  */
                const marker =
                    '"card":';

                let position = 0;

                while (
                    position <
                    source.length
                ) {
                    const index =
                        source.indexOf(
                            marker,
                            position
                        );

                    if (index === -1) {
                        break;
                    }

                    const start =
                        index + marker.length;

                    const objectText =
                        extractJsonObject(
                            source,
                            start
                        );

                    if (objectText) {
                        const parsed =
                            safeParse(
                                objectText
                            );

                        if (
                            parsed?.title?.id
                        ) {
                            const before =
                                state.cards.size;

                            addCard(parsed);

                            if (
                                state.cards.size >
                                before
                            ) {
                                added++;
                            }
                        }
                    }

                    position =
                        index +
                        marker.length;
                }
            }
        }

        return added;
    }

    function extractJsonObject(
        source,
        start
    ) {
        while (
            start < source.length &&
            /\s/.test(
                source[start]
            )
        ) {
            start++;
        }

        if (
            source[start] !== "{"
        ) {
            return null;
        }

        let depth = 0;
        let inString = false;
        let escaped = false;

        for (
            let i = start;
            i < source.length;
            i++
        ) {
            const char =
                source[i];

            if (inString) {
                if (escaped) {
                    escaped = false;
                } else if (
                    char === "\\"
                ) {
                    escaped = true;
                } else if (
                    char === '"'
                ) {
                    inString = false;
                }

                continue;
            }

            if (
                char === '"'
            ) {
                inString = true;
                continue;
            }

            if (
                char === "{"
            ) {
                depth++;
            } else if (
                char === "}"
            ) {
                depth--;

                if (
                    depth === 0
                ) {
                    return source.slice(
                        start,
                        i + 1
                    );
                }
            }
        }

        return null;
    }

    function scanInitialState() {
        if (
            state.initialStateScanned
        ) {
            return;
        }

        state.initialStateScanned =
            true;

        const before =
            state.cards.size;

        const jsonAdded =
            scanNextData();

        const inlineAdded =
            scanInlineScripts();

        const totalAdded =
            state.cards.size -
            before;

        log(
            "[ReManga Card Statuses] " +
            "Первичная страница просканирована:",
            `JSON +${jsonAdded};`,
            `inline +${inlineAdded};`,
            `total +${totalAdded};`,
            `cards total: ${state.cards.size}`
        );

        scheduleApply();
    }

    // ============================================================
    // DOM / COVER
    // ============================================================

    function getCoverUrls(
        card
    ) {
        const cover =
            card?.cover;

        if (!cover) {
            return [];
        }

        if (
            typeof cover ===
            "string"
        ) {
            return [cover];
        }

        return Object.values(
            cover
        )
            .filter(
                value =>
                    typeof value ===
                    "string"
            )
            .map(
                value =>
                    value.trim()
            )
            .filter(Boolean);
    }

    function normalizeAssetPath(
        value
    ) {
        return String(
            value || ""
        )
            .split("?")[0]
            .replace(
                /^https?:\/\/[^/]+\/media\//i,
                ""
            )
            .replace(
                /^\/?media\//i,
                ""
            )
            .replace(
                /^\/+/,
                ""
            );
    }

    function imageMatchesCover(
        img,
        covers
    ) {
        const sources = [
            img.currentSrc,
            img.src,
            img.getAttribute(
                "src"
            ),
            img.getAttribute(
                "data-src"
            ),
            img.getAttribute(
                "data-lazy-src"
            )
        ].filter(Boolean);

        const sourcePaths =
            sources.map(
                normalizeAssetPath
            );

        const coverPaths =
            covers.map(
                normalizeAssetPath
            );

        return sourcePaths.some(
            source =>
                coverPaths.some(
                    cover =>
                        source === cover ||
                        source.includes(
                            cover
                        ) ||
                        cover.includes(
                            source
                        )
                )
        );
    }

    function buildDomCardIndex() {
        const index = new Map();

        const domCards = [
            ...document.querySelectorAll(".cs-card-item")
        ];

        for (const cardElement of domCards) {
            const images = [
                ...cardElement.querySelectorAll("img")
            ];

            for (const img of images) {
                const sources = [
                    img.currentSrc,
                    img.src,
                    img.getAttribute("src"),
                    img.getAttribute("data-src"),
                    img.getAttribute("data-lazy-src")
                ].filter(Boolean);

                for (const source of sources) {
                    const key =
                        normalizeAssetPath(source);

                    if (!key) continue;

                    let cardsForCover =
                        index.get(key);

                    if (!cardsForCover) {
                        cardsForCover = new Set();
                        index.set(
                            key,
                            cardsForCover
                        );
                    }

                    /*
                      * Set важен: одна DOM-карточка может содержать
                      * несколько ссылок/источников одного изображения,
                      * но в индекс она попадёт только один раз.
                      */
                    cardsForCover.add(
                        cardElement
                    );
                }
            }
        }

        return index;
    }

    function findDomCards(
        apiCard,
        domIndex
    ) {
        const covers =
            getCoverUrls(apiCard);

        if (!covers.length) {
            return [];
        }

        const result = new Set();

        for (const cover of covers) {
            const key =
                normalizeAssetPath(cover);

            const cards =
                domIndex.get(key);

            if (!cards) continue;

            for (const card of cards) {
                result.add(card);
            }
        }

        /*
          * Если exact match не сработал, используем
          * более мягкое сравнение как fallback.
          */
        if (!result.size) {
            const domCards = [
                ...document.querySelectorAll(
                    ".cs-card-item"
                )
            ];

            for (const cardElement of domCards) {
                const images = [
                    ...cardElement.querySelectorAll("img")
                ];

                if (
                    images.some(img =>
                        imageMatchesCover(
                            img,
                            covers
                        )
                    )
                ) {
                    result.add(cardElement);
                }
            }
        }

        return [...result];
    }

    // ============================================================
    // UI
    // ============================================================

    function clearRenderedStatuses() {
        const badges =
            document.querySelectorAll(
                ".remanga-card-status"
            );

        for (const badge of badges) {
            badge.remove();
        }

        const hosts =
            document.querySelectorAll(
                ".remanga-card-status-host"
            );

        for (const host of hosts) {
            host.classList.remove(
                "remanga-card-status-host"
            );
        }
    }

    function renderStatus(
        container,
        titleId
    ) {
        const status =
            CARD_STATUSES[
                String(titleId)
            ];

        if (!status) {
            return false;
        }

        if (
            container.querySelector(
                ".remanga-card-status"
            )
        ) {
            return false;
        }

        container.classList.add(
            "remanga-card-status-host"
        );

        const badge =
            document.createElement(
                "span"
            );

        badge.className =
            `remanga-card-status ` +
            `remanga-card-status--${status}`;

        badge.textContent =
            STATUS_LABELS[
                status
            ] ?? status;

        badge.dataset.titleId =
            String(titleId);

        container.appendChild(
            badge
        );

        return true;
    }

    function applyStatuses() {
        let matched = 0;
        let added = 0;

        /*
          * Строим индекс DOM один раз за проход.
          *
          * Это существенно быстрее, чем для каждой API-карточки
          * заново искать все .cs-card-item.
          */
        const domIndex =
            buildDomCardIndex();

        for (
            const apiCard of
            state.cards.values()
        ) {
            const status =
                CARD_STATUSES[
                    String(apiCard.titleId)
                ];

            /*
              * Если для title.id нет статуса,
              * DOM вообще не ищем.
              */
            if (!status) {
                continue;
            }

            /*
              * ВАЖНО:
              * findDomCards возвращает ВСЕ совпадения,
              * а не только первую карточку.
              *
              * Поэтому если одна и та же карта встречается
              * в нескольких обменах на странице — бейдж будет
              * на каждой из них.
              */
            const containers =
                findDomCards(
                    apiCard,
                    domIndex
                );

            if (!containers.length) {
                continue;
            }

            matched +=
                containers.length;

            for (
                const container of
                containers
            ) {
                if (
                    renderStatus(
                        container,
                        apiCard.titleId
                    )
                ) {
                    added++;
                }
            }
        }

        if (
            matched ||
            added
        ) {
            log(
                "[ReManga Card Statuses]",
                `DOM matches: ${matched};`,
                `new badges: ${added};`,
                `API cards: ${state.cards.size}`
            );
        }
    }

    function scheduleApply() {
        clearTimeout(
            state.applyTimer
        );

        state.applyTimer =
            setTimeout(
                applyStatuses,
                80
            );
    }

    // ============================================================
    // OBSERVER
    // ============================================================

    function startObserver() {
        if (
            state.observer
        ) {
            return;
        }

        state.observer =
            new MutationObserver(
                () => {
                    scheduleApply();
                }
            );

        state.observer.observe(
            document.documentElement,
            {
                childList: true,
                subtree: true
            }
        );
    }

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    function scheduleInitialScan() {
        /*
          * Несколько точек времени:
          *
          * - после DOMContentLoaded
          * - после React hydration
          * - после появления карточек
          *
          * Мы НЕ делаем API request.
          */
        const run = () => {
            scanInitialState();
            scheduleApply();
        };

        if (
            document.readyState ===
            "loading"
        ) {
            document.addEventListener(
                "DOMContentLoaded",
                () => {
                    setTimeout(
                        run,
                        300
                    );
                },
                { once: true }
            );
        } else {
            setTimeout(
                run,
                300
            );
        }

        setTimeout(
            run,
            1000
        );

        setTimeout(
            run,
            2000
        );
    }

    // ============================================================
    // DEBUG
    // ============================================================

    window.__REMANGA_CARD_STATUSES_DEBUG__ =
        () => {
            const cards =
                [
                    ...state.cards.values()
                ];

            if (devMode) {
                console.table(
                    cards.map(
                        card => ({
                            cardId:
                                card.cardId,
                            titleId:
                                card.titleId,
                            mainName:
                                card.mainName,
                            secondaryName:
                                card.secondaryName,
                            dir:
                                card.dir
                        })
                    )
                );
            }

            return cards;
        };

    // ============================================================
    // START
    // ============================================================

    loadStatusSet();
    startObserver();
    scheduleInitialScan();

    log(
        "[ReManga Card Statuses] " +
        "v2.0 запущено."
    );

    log(
        "[ReManga Card Statuses] " +
        "Ожидаю ответы API и/или данные " +
        "первоначального React/Next.js state."
    );
})();
