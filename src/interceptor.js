(() => {
    "use strict";

    /*
    * ReManga Card Statuses v2.1
    *
    * ВАЖНО:
    * - собственных API-запросов нет;
    * - перехватываем только запросы самого ReManga;
    * - НЕ переоборачиваем fetch через setInterval;
    * - это предотвращает рекурсивный вызов и
    *   "Maximum call stack size exceeded".
    */

    const RESPONSE_EVENT =
        "__REMANGA_CARD_STATUS_API_RESPONSE__";

    const REQUEST_EVENT =
        "__REMANGA_CARD_STATUS_API_REQUEST__";

    const INSTALL_FLAG =
        "__REMANGA_CARD_STATUS_V22_INTERCEPTOR__";

    if (window[INSTALL_FLAG]) {
        return;
    }

    window[INSTALL_FLAG] = true;

    const TARGETS = [
        /^\/api\/v2\/inventory\/\d+\/exchanges\/?$/,
        /^\/api\/v3\/inventory\/items\/cards\/\d+\/?$/,
        /^\/api\/inventory\/\d+\/cards\/?$/,
        /^\/api\/inventory\/character\/\d+\/cards\/?$/,
        /^\/api\/inventory\/catalog\/?$/
    ];

    function normalizeUrl(url) {
        try {
            return new URL(
                url,
                location.href
            ).href;
        } catch {
            return "";
        }
    }

    //
    // IMPORTANT:
    // interceptor.js runs in MAIN world.
    // Do not depend on window.REMANGA_CONFIG from the isolated
    // content script. The host page can also modify window globals.
    // Keep only the API host allow-list here.
    //
    const API_DOMAINS = new Set([
        "api.remanga.org",
        "api.xn--80aaig9ahr.xn--c1avg"
    ]);

    function isTargetUrl(url) {
        try {
            const parsed =
                new URL(
                    url,
                    location.href
                );

            const apiHost = parsed.hostname;

            if (!API_DOMAINS.has(apiHost)) {
                return false;
            }

            return TARGETS.some(
                pattern =>
                pattern.test(
                    parsed.pathname
                )
            );
        } catch {
            return false;
        }
    }

    function emit(
        eventName,
        payload
    ) {
        try {
            window.dispatchEvent(
                new CustomEvent(
                eventName,
                {
                    detail:
                    JSON.stringify(
                        payload
                    )
                }
                )
            );
        } catch {}
    }

    function emitResponse(
        url,
        response
    ) {
        /*
        * response.clone() не меняет оригинальный response,
        * который должен получить React/ReManga.
        */
        response
        .clone()
        .json()
        .then(data => {
            emit(
            RESPONSE_EVENT,
            {
                url,
                status:
                response.status,
                data
            }
            );
        })
        .catch(() => {});
    }

    // ============================================================
    // FETCH
    // ============================================================

    /*
    * Устанавливаем hook только ОДИН раз.
    *
    * Никаких setInterval и повторных обёрток:
    * именно повторное wrapping могло приводить
    * к Maximum call stack size exceeded.
    */

    const originalFetch =
        window.fetch;

    if (
        typeof originalFetch ===
        "function"
    ) {
        const wrappedFetch =
        function (...args) {
            let requestUrl = "";

            try {
            requestUrl =
                typeof args[0] ===
                "string"
                ? args[0]
                : args[0]?.url || "";
            } catch {}

            const result =
            originalFetch.apply(
                this,
                args
            );

            if (
            requestUrl &&
            isTargetUrl(
                requestUrl
            )
            ) {
            const absoluteUrl =
                normalizeUrl(
                requestUrl
                );

            emit(
                REQUEST_EVENT,
                {
                url: absoluteUrl
                }
            );

            /*
            * Не задерживаем Promise сайта.
            */
            result.then(
                response => {
                emitResponse(
                    absoluteUrl,
                    response
                );

                return response;
                },
                () => {}
            );
            }

            return result;
        };

        window.fetch =
        wrappedFetch;
    }

    // ============================================================
    // XHR
    // ============================================================

    /*
    * Также перехватываем XHR.
    * Сохраняем оригинальные методы в замыкании
    * и устанавливаем их только один раз.
    */

    const originalOpen =
        XMLHttpRequest.prototype.open;

    const originalSend =
        XMLHttpRequest.prototype.send;

    const openHook =
        function (
        method,
        url,
        ...rest
        ) {
        this.__remangaStatusMethod =
            String(
            method || "GET"
            ).toUpperCase();

        this.__remangaStatusUrl =
            normalizeUrl(url);

        return originalOpen.call(
            this,
            method,
            url,
            ...rest
        );
        };

    const sendHook =
        function (...args) {
        const method =
            this.__remangaStatusMethod;

        const url =
            this.__remangaStatusUrl;

        if (
            method === "GET" &&
            url &&
            isTargetUrl(url)
        ) {
            emit(
            REQUEST_EVENT,
            { url }
            );

            this.addEventListener(
            "load",
            function () {
                try {
                let data;

                if (
                    this.responseType ===
                    "json"
                ) {
                    data =
                    this.response;
                } else {
                    data =
                    JSON.parse(
                        this.responseText
                    );
                }

                emit(
                    RESPONSE_EVENT,
                    {
                    url,
                    status:
                        this.status,
                    data
                    }
                );
                } catch {}
            },
            { once: true }
            );
        }

        return originalSend.apply(
            this,
            args
        );
        };

    XMLHttpRequest.prototype.open =
        openHook;

    XMLHttpRequest.prototype.send =
        sendHook;
})();