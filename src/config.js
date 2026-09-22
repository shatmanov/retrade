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
                    97305: "semi-premium", // GODDESS OF VICTORY: NIKKE Официальный комикс
                    97601: "semi-premium", // Identity V начальная школа
                    153656: "semi-premium", // Reverse:1999
                    102248: "semi-premium", // ReZero Жизнь с нуля в альтернативном мире Часть Пятая Город Воды и Баллада о Героях
                    214: "semi-premium", // Адский рай
                    272: "semi-premium", // Атака титанов
                    337: "semi-premium", // Блич
                    1809: "semi-premium", // Бродяга
                    299: "semi-premium", // Ван пис
                    98: "semi-premium", // Ванпанчмен
                    216: "semi-premium", // Великий из бродячих псов
                    13971: "semi-premium", // Визуальные и сюжетные файлы - артбук "Берсерк"
                    153377: "semi-premium", // Властелин колец
                    71: "semi-premium", // Восхождение героя щита
                    310: "semi-premium", // Врата штейна
                    11690: "semi-premium", // Всеведущий читатель
                    143145: "semi-premium", // Грозовые волны
                    114058: "semi-premium", // Девушки на линии фронта
                    17401: "semi-premium", // Дни Сакамото
                    427: "semi-premium", // Дорохедоро
                    398: "semi-premium", // Евангелион
                    18762: "semi-premium", // Зарисовки Эйрризо "Мертвы к рассвету"
                    153494: "semi-premium", // Zenless Zone Zero
                    11906: "semi-premium", // Звездное дитя
                    71868: "semi-premium", // Иногда Аля внезапно кокетничает по-русски
                    273: "semi-premium", // Клинок рассекающий демона
                    97819: "semi-premium", // Левиафан (манхва 2021 года выпуска)
                    7331: "semi-premium", // Летнее время
                    401: "semi-premium", // Любимый во Франксе
                    1728: "semi-premium", // Магическая битва
                    69796: "semi-premium", // Мастера Меча Онлайн - Ре:Айнкрад
                    82147: "semi-premium", // Милфхантер из другого мира
                    384: "semi-premium", // Может, я встречу тебя в подземелье?
                    95800: "semi-premium", // Наказание Серый Ворон Сироты Доминика
                    938: "semi-premium", // Начало после конца
                    179: "semi-premium", // О моём перерождении в слизь
                    7940: "semi-premium", // Повесть о конце света
                    119320: "semi-premium", // Подземелья и драконы: Легенды врат Балдура
                    12172: "semi-premium", // Порождение крови - Леди Мария и старые охотники
                    70564: "semi-premium", // Район Гокураку
                    92624: "semi-premium", // Сайлент Хилл Прошлая Жизнь
                    1375: "semi-premium", // Свидание с Духом
                    13480: "semi-premium", // Секиро: Ханбэй Бессмертный
                    14128: "semi-premium", // Синяя Тюрьма: Блю Лок (фанатская цветная версия)
                    381: "semi-premium", // Стальной алхимик
                    156194: "semi-premium", // Судьба
                    155852: "semi-premium", // Суд над Девочкой - Волшебницей
                    155163: "semi-premium", // Темнейшее Подземелье: Хроники
                    266: "semi-premium", // Темный дворецкий
                    122158: "semi-premium", // Теневой раб
                    118595: "semi-premium", // Уличный боец
                    271: "semi-premium", // Хантер х Хантер
                    111: "semi-premium", // Хоримия
                    2327: "semi-premium", // Элисед
                    153719: "semi-premium", // Я стал богом в игре ужасов

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
