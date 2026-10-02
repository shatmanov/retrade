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
                    78687: "premium", // DARK SOULS — Рыцарь-Раб Гаэль
                    99137: "premium", // Doom
                    69340: "premium", // Helltaker 4-koma
                    153783: "premium", // K-Pop Demon Hunters
                    153701: "premium", // Love and Deepspace
                    19720: "premium", // Nier Automata: Высадка команды YoRHa в Пёрл-Харбор.
                    154864: "premium", // Path to nowhere
                    3266: "premium", // Бойцовский класс 3
                    144661: "premium", // Вайолет Эвергарден
                    3659: "premium", // Восхождение в тени
                    38384: "premium", // Волчица и пряности
                    76821: "premium", // Выбери меня!
                    79229: "premium", // Выживая в игре за варвара
                    156790: "premium", // Даже попав в мир хоррора, всё равно приходится ходить на работу
                    69450: "premium", // Дебютируй или умри
                    88146: "premium", // Кольцо Элден: Стань Повелителем
                    378: "premium", // Коносуба
                    2297: "premium", // Мастер гу
                    2459: "premium", // Монолог фармацевта
                    379: "premium", // Нет игры - нет жизни
                    18107: "premium", // Охотник SSS-уровня
                    327: "premium", // Повелитель
                    9053: "premium", // Повелитель Тайн (Фанработа)
                    143296: "premium", // Подарок миты
                    114044: "premium", // Призрачный клинок (маньхуа)
                    453: "premium", // Реинкарнация безработного ~История о приключениях в другом мире~
                    120159: "premium", // Рыцарь, проживающий один и тот же день
                    14660: "premium", // Созданный в бездне - Официальный сборник
                    11195: "premium", // Старшая школа ДхД
                    113125: "premium", // Тетрадь смерти
                    13316: "premium", // Тёмные души: Легенда о путнике бездны
                    338: "premium", // Убийца Акаме!
                    298: "premium", // Убийца гоблинов
                    14957: "premium", // Фрирен, провожающая в последний путь
                    1786: "premium", // Человек - бензопила
                    4032: "premium", // Эта фарфоровая кукла влюбилась
                    153719: "premium", // Я стал богом в игре ужасов
                    

                    // Полупрем
                    8154: "semi-premium", // Azur Lane: Start Building!
                    97305: "semi-premium", // GODDESS OF VICTORY: NIKKE Официальный комикс
                    97601: "semi-premium", // Identity V начальная школа
                    153656: "semi-premium", // Reverse:1999
                    102248: "semi-premium", // ReZero Жизнь с нуля в альтернативном мире Часть Пятая Город Воды и Баллада о Героях
                    154565: "semi-premium", // The Elder Scrolls: Герои Хромой Телеги
                    214: "semi-premium", // Адский рай
                    272: "semi-premium", // Атака титанов
                    337: "semi-premium", // Блич
                    1809: "semi-premium", // Бродяга
                    299: "semi-premium", // Ван пис
                    98: "semi-premium", // Ванпанчмен
                    216: "semi-premium", // Великий из бродячих псов
                    13971: "semi-premium", // Визуальные и сюжетные файлы - артбук "Берсерк"
                    157955: "semi-premium", // Виртуальные Ютуберы
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
                    109566: "semi-premium", // Страна самоцветов в цвете
                    155852: "semi-premium", // Суд над Девочкой - Волшебницей
                    155163: "semi-premium", // Темнейшее Подземелье: Хроники
                    266: "semi-premium", // Темный дворецкий
                    122158: "semi-premium", // Теневой раб
                    118595: "semi-premium", // Уличный боец
                    271: "semi-premium", // Хантер х Хантер
                    111: "semi-premium", // Хоримия
                    156581: "semi-premium", // Хроники Влюблённости
                    288: "semi-premium", // Чёрный Клевер
                    2327: "semi-premium", // Элисед

                    // Полуторник
                    111111: "one-and-half", // 

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
