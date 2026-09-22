(() => {
    "use strict";

    const {
        DEFAULT_STATUS_SET,
        STATUS_SETS
    } = window.REMANGA_CARD_CONFIG;

    const select =
        document.getElementById("statusSet");

    const statusMessage =
        document.getElementById("statusMessage");

    function showMessage(message) {
        statusMessage.textContent = message;
    }

    function renderOptions() {
        const fragment =
            document.createDocumentFragment();

        for (const [key, statusSet] of Object.entries(STATUS_SETS)) {
            const option =
                document.createElement("option");

            option.value = key;
            option.textContent = statusSet.label;
            fragment.appendChild(option);
        }

        select.replaceChildren(fragment);
    }

    async function loadSettings() {
        const result =
            await chrome.storage.local.get(
                "statusSet"
            );

        const savedStatusSet =
            result.statusSet;

        const statusSet =
            STATUS_SETS[savedStatusSet]
                ? savedStatusSet
                : DEFAULT_STATUS_SET;

        select.value = statusSet;

        if (savedStatusSet !== statusSet) {
            await chrome.storage.local.set({
                statusSet
            });
        }
    }

    async function saveSettings() {
        const statusSet = select.value;

        if (!STATUS_SETS[statusSet]) {
            return;
        }

        await chrome.storage.local.set({
            statusSet
        });

        showMessage(
            `Сохранено: ${STATUS_SETS[statusSet].label}`
        );
    }

    select.addEventListener(
        "change",
        () => {
            saveSettings().catch(error => {
                console.error(
                    "[ReManga Card Statuses]",
                    "Не удалось сохранить настройки:",
                    error
                );

                showMessage(
                    "Не удалось сохранить настройку."
                );
            });
        }
    );

    renderOptions();

    loadSettings().catch(error => {
        console.error(
            "[ReManga Card Statuses]",
            "Не удалось загрузить настройки:",
            error
        );

        select.value = DEFAULT_STATUS_SET;
        showMessage(
            "Не удалось загрузить сохранённую настройку."
        );
    });
})();
