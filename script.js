"use strict";

/*======================================================
    LIFE HUD V2
    PART 1
======================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*==================================================
        STORAGE
    ==================================================*/

    const STORAGE_KEY = "lifeHUDPlayer";

    const today = new Date().toISOString().split("T")[0];

    /*==================================================
        DEFAULT PLAYER
    ==================================================*/

    const defaultPlayer = {

        hp: 100,
        maxHP: 100,

        mp: 100,
        maxMP: 100,

        level: 1,
        xp: 0,

        activities: 0,
        todayMPSpent: 0,

        stats: {

            int: {
                level: 1,
                xp: 0
            },

            cha: {
                level: 1,
                xp: 0
            },

            str: {
                level: 1,
                xp: 0
            },

            dty: {
                level: 1,
                xp: 0
            }

        },

        log: [],

        lastAwakening: ""

    };

    /*==================================================
        LOAD PLAYER
    ==================================================*/

    let player = loadPlayer();

    function loadPlayer() {

        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {

            return structuredClone(defaultPlayer);

        }

        try {

            return Object.assign(
                structuredClone(defaultPlayer),
                JSON.parse(saved)
            );

        }

        catch {

            return structuredClone(defaultPlayer);

        }

    }

    function savePlayer() {

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(player)

        );

    }

    /*==================================================
        DOM REFERENCES
    ==================================================*/

    const hpBar = document.getElementById("hpBar");
    const mpBar = document.getElementById("mpBar");

    const hpLabel = document.getElementById("hpLabel");
    const mpLabel = document.getElementById("mpLabel");

    const playerLevel = document.getElementById("playerLevel");
    const playerXP = document.getElementById("playerXP");

    const overviewLevel = document.getElementById("overviewLevel");
    const overviewXP = document.getElementById("overviewXP");

    const activityCount = document.getElementById("activityCount");
    const todayMP = document.getElementById("todayMP");

    const statINT = document.getElementById("statINT");
    const statCHA = document.getElementById("statCHA");
    const statSTR = document.getElementById("statSTR");
    const statDTY = document.getElementById("statDTY");

    const intLevel = document.getElementById("intLevel");
    const chaLevel = document.getElementById("chaLevel");
    const strLevel = document.getElementById("strLevel");
    const dtyLevel = document.getElementById("dtyLevel");

    const combatLog = document.getElementById("combatLog");

    const awakeningOverlay =
        document.getElementById("awakeningOverlay");

    /*==================================================
        UPDATE HUD
    ==================================================*/

    function updateHUD() {

        clampResources();

        hpLabel.textContent =
            `${player.hp} / ${player.maxHP}`;

        mpLabel.textContent =
            `${player.mp} / ${player.maxMP}`;

        hpBar.style.width =
            `${player.hp / player.maxHP * 100}%`;

        mpBar.style.width =
            `${player.mp / player.maxMP * 100}%`;

        updateHPColor();

        updateMPColor();

        playerLevel.textContent =
            player.level;

        playerXP.textContent =
            `${player.xp} XP`;

        overviewLevel.textContent =
            player.level;

        overviewXP.textContent =
            player.xp;

        activityCount.textContent =
            player.activities;

        todayMP.textContent =
            player.todayMPSpent;

        intLevel.textContent =
            `Lv.${player.stats.int.level}`;

        chaLevel.textContent =
            `Lv.${player.stats.cha.level}`;

        strLevel.textContent =
            `Lv.${player.stats.str.level}`;

        dtyLevel.textContent =
            `Lv.${player.stats.dty.level}`;

        statINT.textContent =
            `Lv.${player.stats.int.level}`;

        statCHA.textContent =
            `Lv.${player.stats.cha.level}`;

        statSTR.textContent =
            `Lv.${player.stats.str.level}`;

        statDTY.textContent =
            `Lv.${player.stats.dty.level}`;

        savePlayer();

    }

    /*==================================================
        CLAMP
    ==================================================*/

    function clampResources() {

        player.hp = Math.max(
            0,
            Math.min(player.hp, player.maxHP)
        );

        player.mp = Math.max(
            0,
            Math.min(player.mp, player.maxMP)
        );

    }

    /*==================================================
        HP COLOR
    ==================================================*/

    function updateHPColor() {

        const percent =
            player.hp / player.maxHP;

        if (percent > 0.60) {

            hpBar.style.background =
                "#22c55e";

            return;

        }

        if (percent > 0.30) {

            hpBar.style.background =
                "#facc15";

            return;

        }

        hpBar.style.background =
            "#ef4444";

    }

    /*==================================================
        MP COLOR
    ==================================================*/

    function updateMPColor() {

        const percent =
            player.mp / player.maxMP;

        if (percent > .75) {

            mpBar.style.background =
                "#40c4ff";

            return;

        }

        if (percent > .35) {

            mpBar.style.background =
                "#2d8cff";

            return;

        }

        mpBar.style.background =
            "#5b5bd6";

    }

    /*==================================================
        TAB SYSTEM
    ==================================================*/

    document.querySelectorAll(".tab")
        .forEach(button => {

            button.addEventListener(

                "click",

                () => {

                    document
                        .querySelectorAll(".tab")
                        .forEach(tab =>
                            tab.classList.remove("active")
                        );

                    document
                        .querySelectorAll(".page")
                        .forEach(page =>
                            page.classList.add("hidden")
                        );

                    button.classList.add("active");

                    document
                        .getElementById(
                            button.dataset.tab
                        )
                        .classList.remove("hidden");

                }

            );

        });

    /*==================================================
        INITIALIZE
    ==================================================*/

    updateHUD();

    if (player.lastAwakening !== today) {

        awakeningOverlay.classList.remove("hidden");

    }

    // ----- Part 2 starts below -----
        /*==================================================
        DAILY AWAKENING
    ==================================================*/

    document
        .querySelectorAll(".sleepButton")
        .forEach(button => {

            button.addEventListener("click", () => {

                const type = button.dataset.sleep;

                switch (type) {

                    case "perfect":

                        player.hp = 100;
                        player.maxMP = 100;
                        player.mp = 100;

                        addSystemLog(
                            "☀ Perfect Rest",
                            [
                                {
                                    text: "HP restored to 100",
                                    type: "gain"
                                },
                                {
                                    text: "MP restored to 100",
                                    type: "gain"
                                }
                            ]
                        );

                        break;

                    case "mediocre":

                        player.hp = Math.min(
                            player.maxHP,
                            player.hp + 25
                        );

                        player.maxMP = 70;
                        player.mp = 70;

                        addSystemLog(
                            "🙂 Mediocre Sleep",
                            [
                                {
                                    text: "HP +25",
                                    type: "gain"
                                },
                                {
                                    text: "MP capped at 70",
                                    type: "neutral"
                                }
                            ]
                        );

                        break;

                    case "trash":

                        player.hp -= 10;

                        player.maxMP = 40;
                        player.mp = 40;

                        addSystemLog(
                            "💀 Trash Sleep",
                            [
                                {
                                    text: "HP -10",
                                    type: "loss"
                                },
                                {
                                    text: "MP capped at 40",
                                    type: "neutral"
                                }
                            ]
                        );

                        break;

                }

                player.todayMPSpent = 0;

                player.lastAwakening = today;

                awakeningOverlay.classList.add("hidden");

                updateHUD();

            });

        });

    /*==================================================
        ACTIVITY FORM
    ==================================================*/

    const activityForm =
        document.getElementById("activityForm");

    const activityName =
        document.getElementById("activityName");

    const hpChange =
        document.getElementById("hpChange");

    const mpChange =
        document.getElementById("mpChange");

    const attribute =
        document.getElementById("attribute");

    const expGain =
        document.getElementById("expGain");

    activityForm.addEventListener(

        "submit",

        event => {

            event.preventDefault();

            const name =
                activityName.value.trim();

            if (name.length === 0) {

                activityName.focus();

                activityName.animate(

                    [

                        {
                            transform:
                                "translateX(-8px)"
                        },

                        {
                            transform:
                                "translateX(8px)"
                        },

                        {
                            transform:
                                "translateX(-8px)"
                        },

                        {
                            transform:
                                "translateX(0)"
                        }

                    ],

                    {

                        duration: 250

                    }

                );

                return;

            }

            const hp =
                Number(hpChange.value) || 0;

            const mp =
                Number(mpChange.value) || 0;

            const stat =
                attribute.value;

            const exp =
                Math.max(
                    0,
                    Number(expGain.value) || 0
                );

            executeActivity(

                name,
                hp,
                mp,
                stat,
                exp

            );

            activityName.value = "";

            hpChange.value = 0;
            mpChange.value = 0;
            expGain.value = 10;

        }

    );

    /*==================================================
        EXECUTE ACTIVITY
    ==================================================*/

    function executeActivity(

        name,

        hp,

        mp,

        stat,

        exp

    ) {

        player.hp += hp;

        player.mp += mp;

        if (mp < 0) {

            player.todayMPSpent +=
                Math.abs(mp);

        }

        player.activities++;

        gainExperience(

            stat,

            exp

        );
        checkLevelUps();

        player.log.unshift({

            title: name,

            hp,

            mp,

            stat,

            exp,

            time:
                new Date()
                .toLocaleTimeString()

        });

        renderCombatLog();

        updateHUD();

    }

    /*==================================================
        EXPERIENCE
    ==================================================*/

    function gainExperience(

    stat,

    exp

) {

    player.xp += exp;

    player.stats[stat].xp += exp;

    while (

        player.stats[stat].xp >= 100

    ) {

        player.stats[stat].xp -= 100;

        player.stats[stat].level++;

    }

}

    /*==================================================
        COMBAT LOG
    ==================================================*/

function renderCombatLog() {

    combatLog.innerHTML = "";

    player.log.forEach(entry => {

        const card = document.createElement("div");
        card.className = "logEntry";

        if (entry.system) {

            let html = `
                <div class="logTitle">${entry.title}</div>
                <div class="logNeutral">${entry.time}</div>
            `;

            entry.rows.forEach(row => {

                html += `
                    <div class="${
                        row.type === "gain"
                            ? "logGain"
                            : row.type === "loss"
                                ? "logLoss"
                                : "logNeutral"
                    }">
                        ${row.text}
                    </div>
                `;

            });

            card.innerHTML = html;

        }

        else {

            const hpClass =
                entry.hp >= 0
                    ? "logGain"
                    : "logLoss";

            const mpClass =
                entry.mp >= 0
                    ? "logGain"
                    : "logLoss";

            card.innerHTML = `

                <div class="logTitle">

                    ⚔ ${entry.title}

                </div>

                <div class="logNeutral">

                    ${entry.time}

                </div>

                <div class="${hpClass}">

                    HP ${entry.hp > 0 ? "+" : ""}${entry.hp}

                </div>

                <div class="${mpClass}">

                    MP ${entry.mp > 0 ? "+" : ""}${entry.mp}

                </div>

                <div class="logGain">

                    ${entry.stat.toUpperCase()} +${entry.exp} EXP

                </div>

            `;

        }

        combatLog.appendChild(card);

    });

    savePlayer();

}

    /*==================================================
        SYSTEM LOG
    ==================================================*/

    function addSystemLog(

        title,

        rows

    ) {

        player.log.unshift({

            system: true,

            title,

            rows,

            time:
                new Date()
                .toLocaleTimeString()

        });

        renderCombatLog();

    }
    /*==================================================
    LEVEL UP
==================================================*/

function checkLevelUps() {

    while (player.xp >= player.level * 100) {

        player.xp -= player.level * 100;

        player.level++;

        addSystemLog(

            "⭐ LEVEL UP",

            [

                {

                    text: `Reached Level ${player.level}`,

                    type: "gain"

                }

            ]

        );

    }

}

/*==================================================
    TOAST
==================================================*/

function toast(text) {

    const div = document.createElement("div");

    div.textContent = text;

    div.style.position = "fixed";
    div.style.bottom = "25px";
    div.style.left = "50%";
    div.style.transform = "translateX(-50%)";

    div.style.background = "#111";

    div.style.color = "#fff";

    div.style.padding = "12px 18px";

    div.style.borderRadius = "12px";

    div.style.zIndex = "99999";

    div.style.opacity = "0";

    div.style.transition = ".3s";

    document.body.appendChild(div);

    requestAnimationFrame(() => {

        div.style.opacity = "1";

    });

    setTimeout(() => {

        div.style.opacity = "0";

        setTimeout(() => {

            div.remove();

        },300);

    },1800);

}

/*==================================================
    OVERRIDE GAIN EXPERIENCE
==================================================*/


/*==================================================
    OVERRIDE EXECUTE ACTIVITY
==================================================*/



/*==================================================
    LOAD SAVED LOG
==================================================*/

renderCombatLog();

toast(

    `+${exp} ${stat.toUpperCase()} EXP`

);

updateHUD();

savePlayer();
});