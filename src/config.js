(() => {
    "use strict";

    /*
     * ReManga Card Statuses
     * Configuration
     *
     * Здесь находятся настройки доменов и наборов статусов.
     * Обычный Vanilla JS — без TypeScript и без import/export.
     */

    window.REMANGA_CONFIG = Object.freeze({
        DOMAINS: Object.freeze([
            "remanga.org",
            "xn--80aaig9ahr.xn--c1avg"
        ]),

        API_DOMAINS: Object.freeze([
            "api.remanga.org",
            "api.xn--80aaig9ahr.xn--c1avg"
        ])
    });

    window.REMANGA_CARD_CONFIG = Object.freeze({
        /*
         * Набор статусов, который используется по умолчанию,
         * если пользователь ещё ничего не выбрал в настройках.
         */
        DEFAULT_STATUS_SET: "robinHood",

        /*
         * Здесь добавляются новые наборы статусов.
         *
         * Ключ набора используется внутри расширения.
         * label — название, которое увидит пользователь.
         * statuses — соответствие title.id -> тип статуса.
         */
        STATUS_SETS: Object.freeze({
            robinHood: Object.freeze({
                label: "РобинГуд",
                statuses: Object.freeze({
                    // Прем
                    14957: "premium",
                    1786: "premium",
                    113125: "premium",
                    8154: "premium",
                    288: "premium",
                    88146: "premium",
                    78687: "premium",
                    69340: "premium",
                    153783: "premium",
                    153701: "premium",
                    19720: "premium",
                    154864: "premium",
                    154565: "premium",
                    3266: "premium",
                    144661: "premium",
                    3659: "premium",
                    76821: "premium",
                    79229: "premium",
                    156790: "premium",
                    69450: "premium",
                    2297: "premium",
                    2459: "premium",
                    18107: "premium",
                    9053: "premium",
                    143296: "premium",
                    114044: "premium",
                    120159: "premium",
                    14660: "premium",
                    109566: "premium",
                    13316: "premium",
                    298: "premium",
                    327: "premium",
                    4032: "premium",
                    11195: "premium",
                    453: "premium",
                    338: "premium", // Убийца Акаме!
                    378: "premium", // Коносуба
                    38384: "premium", // Волчица и пряности
                    379: "premium", // Нет игры - нет жизни

                    // Полупрем
                    153494: "semi-premium",
                    1728: "semi-premium",
                    2327: "semi-premium",
                    71868: "semi-premium",

                    // Полуторник
                    374: "one-and-half",
                    156194: "one-and-half",
                    314: "one-and-half",
                    155628: "one-and-half",
                    156756: "one-and-half",
                    155472: "one-and-half",

                    // Ивентовые
                    100576: "event"
                })
            }),

            // unknown: Object.freeze({
            //     label: "Нeизвeстный",
            //     statuses: Object.freeze({
            //         // Добавьте сюда title.id для этого набора.
            //         // Например:
            //         // 123456: "premium"
            //     })
            // })
        }),

        STATUS_LABELS: Object.freeze({
            premium: "Прем",
            "semi-premium": "Полупрем",
            "one-and-half": "Полуторник",
            event: "Ивентовые"
        })
    });
})();
