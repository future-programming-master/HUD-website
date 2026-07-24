"use strict";

/*======================================================
    LIFE HUD v3
    Part 1
======================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*==================================================
        CONSTANTS
    ==================================================*/

    const STORAGE_KEY = "lifehud-save";

    const TODAY = new Date().toISOString().split("T")[0];

    /*==================================================
        DEFAULT SAVE
    ==================================================*/

    const DEFAULT_SAVE = {

        hp: 100,
        maxHP: 100,

        mp: 100,
        maxMP: 100,

        level: 1,
        xp: 0,

        activities: 0,

        todayMPSpent: 0,

        lastAwakening: "",

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

        combatLog: []

    };

    /*==================================================
        SAVE / LOAD
    ==================================================*/

    function deepCopy(object){

        return JSON.parse(

            JSON.stringify(object)

        );

    }

    function loadGame(){

        const save = localStorage.getItem(

            STORAGE_KEY

        );

        if(!save){

            return deepCopy(

                DEFAULT_SAVE

            );

        }

        try{

            return Object.assign(

                deepCopy(DEFAULT_SAVE),

                JSON.parse(save)

            );

        }

        catch{

            return deepCopy(

                DEFAULT_SAVE

            );

        }

    }

    let player = loadGame();

    function saveGame(){

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(player)

        );

    }

    /*==================================================
        DOM
    ==================================================*/

    const DOM = {

        hpBar:
            document.getElementById("hpBar"),

        mpBar:
            document.getElementById("mpBar"),

        hpLabel:
            document.getElementById("hpLabel"),

        mpLabel:
            document.getElementById("mpLabel"),

        playerLevel:
            document.getElementById("playerLevel"),

        playerXP:
            document.getElementById("playerXP"),

        overviewLevel:
            document.getElementById("overviewLevel"),

        overviewXP:
            document.getElementById("overviewXP"),

        activityCount:
            document.getElementById("activityCount"),

        todayMP:
            document.getElementById("todayMP"),

        intLevel:
            document.getElementById("intLevel"),

        chaLevel:
            document.getElementById("chaLevel"),

        strLevel:
            document.getElementById("strLevel"),

        dtyLevel:
            document.getElementById("dtyLevel"),

        statINT:
            document.getElementById("statINT"),

        statCHA:
            document.getElementById("statCHA"),

        statSTR:
            document.getElementById("statSTR"),

        statDTY:
            document.getElementById("statDTY"),

        combatLog:
            document.getElementById("combatLog"),

        overlay:
            document.getElementById("awakeningOverlay"),

        form:
            document.getElementById("activityForm"),

        activity:
            document.getElementById("activityName"),

        hpInput:
            document.getElementById("hpChange"),

        mpInput:
            document.getElementById("mpChange"),

        attribute:
            document.getElementById("attribute"),

        expInput:
            document.getElementById("expGain")

    };

    /*==================================================
        HELPERS
    ==================================================*/

    function clamp(){

        player.hp = Math.max(

            0,

            Math.min(

                player.hp,

                player.maxHP

            )

        );

        player.mp = Math.max(

            0,

            Math.min(

                player.mp,

                player.maxMP

            )

        );

    }

    function percent(current,max){

        if(max===0){

            return 0;

        }

        return current/max*100;

    }

    function now(){

        return new Date().toLocaleTimeString(

            [],

            {

                hour:"2-digit",

                minute:"2-digit"

            }

        );

    }
        /*==================================================
        BAR COLORS
    ==================================================*/

    function updateBarColors(){

        const hpPercent = percent(

            player.hp,

            player.maxHP

        );

        if(hpPercent > 60){

            DOM.hpBar.style.background =
                "#22c55e";

        }

        else if(hpPercent > 30){

            DOM.hpBar.style.background =
                "#facc15";

        }

        else{

            DOM.hpBar.style.background =
                "#ef4444";

        }

        const mpPercent = percent(

            player.mp,

            player.maxMP

        );

        if(mpPercent > 75){

            DOM.mpBar.style.background =
                "#38bdf8";

        }

        else if(mpPercent > 35){

            DOM.mpBar.style.background =
                "#0ea5e9";

        }

        else{

            DOM.mpBar.style.background =
                "#2563eb";

        }

    }

    /*==================================================
        RENDER HUD
    ==================================================*/

    function renderHUD(){

        clamp();

        DOM.hpLabel.textContent =

            `${player.hp} / ${player.maxHP}`;

        DOM.mpLabel.textContent =

            `${player.mp} / ${player.maxMP}`;

        DOM.hpBar.style.width =

            percent(

                player.hp,

                player.maxHP

            ) + "%";

        DOM.mpBar.style.width =

            percent(

                player.mp,

                player.maxMP

            ) + "%";

        updateBarColors();

        DOM.playerLevel.textContent =

            player.level;

        DOM.playerXP.textContent =

            `${player.xp} XP`;

        DOM.overviewLevel.textContent =

            player.level;

        DOM.overviewXP.textContent =

            player.xp;

        DOM.activityCount.textContent =

            player.activities;

        DOM.todayMP.textContent =

            player.todayMPSpent;

        DOM.intLevel.textContent =

            `Lv.${player.stats.int.level}`;

        DOM.chaLevel.textContent =

            `Lv.${player.stats.cha.level}`;

        DOM.strLevel.textContent =

            `Lv.${player.stats.str.level}`;

        DOM.dtyLevel.textContent =

            `Lv.${player.stats.dty.level}`;

        DOM.statINT.textContent =

            `Lv.${player.stats.int.level}`;

        DOM.statCHA.textContent =

            `Lv.${player.stats.cha.level}`;

        DOM.statSTR.textContent =

            `Lv.${player.stats.str.level}`;

        DOM.statDTY.textContent =

            `Lv.${player.stats.dty.level}`;

        saveGame();

    }

    /*==================================================
        TABS
    ==================================================*/

    const tabs =

        document.querySelectorAll(

            ".tab"

        );

    const pages =

        document.querySelectorAll(

            ".page"

        );

    tabs.forEach(tab=>{

        tab.addEventListener(

            "click",

            ()=>{

                tabs.forEach(button=>{

                    button.classList.remove(

                        "active"

                    );

                });

                pages.forEach(page=>{

                    page.classList.add(

                        "hidden"

                    );

                });

                tab.classList.add(

                    "active"

                );

                document

                    .getElementById(

                        tab.dataset.tab

                    )

                    .classList.remove(

                        "hidden"

                    );

            }

        );

    });

    /*==================================================
        DAILY AWAKENING
    ==================================================*/

    function openAwakening(){

        DOM.overlay.classList.remove(

            "hidden"

        );

    }

    function closeAwakening(){

        DOM.overlay.classList.add(

            "hidden"

        );

    }

    document

        .querySelectorAll(

            ".sleepButton"

        )

        .forEach(button=>{

            button.addEventListener(

                "click",

                ()=>{

                    const sleep =

                        button.dataset.sleep;

                    if(

                        sleep === "perfect"

                    ){

                        player.hp = 100;

                        player.maxMP = 100;

                        player.mp = 100;

                    }

                    else if(

                        sleep === "mediocre"

                    ){

                        player.hp = Math.min(

                            player.maxHP,

                            player.hp + 25

                        );

                        player.maxMP = 70;

                        player.mp = 70;

                    }

                    else{

                        player.hp -= 10;

                        player.maxMP = 40;

                        player.mp = 40;

                    }

                    clamp();

                    player.todayMPSpent = 0;

                    player.lastAwakening = TODAY;

                    closeAwakening();

                    renderHUD();

                }

            );

        });
            /*==================================================
        TOAST
    ==================================================*/

    function toast(message){

        const toast = document.createElement(

            "div"

        );

        toast.className = "toast";

        toast.textContent = message;

        document.body.appendChild(

            toast

        );

        requestAnimationFrame(()=>{

            toast.classList.add(

                "show"

            );

        });

        setTimeout(()=>{

            toast.classList.remove(

                "show"

            );

            setTimeout(()=>{

                toast.remove();

            },300);

        },1800);

    }

    /*==================================================
        COMBAT LOG
    ==================================================*/

    function addLog(

        title,

        hp,

        mp,

        stat,

        exp

    ){

        player.combatLog.unshift({

            title,

            hp,

            mp,

            stat,

            exp,

            time: now()

        });

        if(

            player.combatLog.length > 500

        ){

            player.combatLog.pop();

        }

        renderCombatLog();

    }

    function renderCombatLog(){

        DOM.combatLog.innerHTML = "";

        player.combatLog.forEach(entry=>{

            const card =

                document.createElement(

                    "div"

                );

            card.className =

                "logEntry";

            card.innerHTML = `

                <div class="logTitle">

                    ⚔ ${entry.title}

                </div>

                <div class="logNeutral">

                    ${entry.time}

                </div>

                <div class="${
                    entry.hp >= 0
                    ? "logGain"
                    : "logLoss"
                }">

                    HP ${
                        entry.hp > 0
                        ? "+"
                        : ""
                    }${entry.hp}

                </div>

                <div class="${
                    entry.mp >= 0
                    ? "logGain"
                    : "logLoss"
                }">

                    MP ${
                        entry.mp > 0
                        ? "+"
                        : ""
                    }${entry.mp}

                </div>

                <div class="logGain">

                    ${entry.stat.toUpperCase()}
                    +${entry.exp} EXP

                </div>

            `;

            DOM.combatLog.appendChild(

                card

            );

        });

    }

    /*==================================================
        EXPERIENCE
    ==================================================*/

    function gainExperience(

        stat,

        amount

    ){

        player.xp += amount;

        player.stats[stat].xp += amount;

        while(

            player.stats[stat].xp >= 100

        ){

            player.stats[stat].xp -= 100;

            player.stats[stat].level++;

            toast(

                `${stat.toUpperCase()} Lv.${player.stats[stat].level}`

            );

        }

        while(

            player.xp >= player.level * 100

        ){

            player.xp -=

                player.level * 100;

            player.level++;

            toast(

                `LEVEL UP! Lv.${player.level}`

            );

        }

    }

    /*==================================================
        ACTIVITY EXECUTION
    ==================================================*/

    function executeActivity(

        name,

        hp,

        mp,

        stat,

        exp

    ){

        player.hp += hp;

        player.mp += mp;

        clamp();

        if(

            mp < 0

        ){

            player.todayMPSpent +=

                Math.abs(mp);

        }

        player.activities++;

        gainExperience(

            stat,

            exp

        );

        addLog(

            name,

            hp,

            mp,

            stat,

            exp

        );

        renderHUD();

    }

    /*==================================================
        FORM
    ==================================================*/

    DOM.form.addEventListener(

        "submit",

        event=>{

            event.preventDefault();

            const name =

                DOM.activity.value.trim();

            if(

                name.length === 0

            ){

                DOM.activity.focus();

                toast(

                    "Activity name required."

                );

                return;

            }

            const hp =

                Number(

                    DOM.hpInput.value

                ) || 0;

            const mp =

                Number(

                    DOM.mpInput.value

                ) || 0;

            const exp =

                Math.max(

                    0,

                    Number(

                        DOM.expInput.value

                    ) || 0

                );

            executeActivity(

                name,

                hp,

                mp,

                DOM.attribute.value,

                exp

            );

            DOM.activity.value = "";

            DOM.hpInput.value = 0;

            DOM.mpInput.value = 0;

            DOM.expInput.value = 10;

        }

    );
        /*==================================================
        SYSTEM LOG
    ==================================================*/

    function addSystemLog(title, lines){

        player.combatLog.unshift({

            system: true,

            title,

            lines,

            time: now()

        });

        if(player.combatLog.length > 500){

            player.combatLog.pop();

        }

        renderCombatLog();

    }

    /*==================================================
        PATCH RENDERER
    ==================================================*/

    const originalRenderCombatLog = renderCombatLog;

    renderCombatLog = function(){

        DOM.combatLog.innerHTML = "";

        player.combatLog.forEach(entry=>{

            const card = document.createElement(

                "div"

            );

            card.className = "logEntry";

            if(entry.system){

                let html = `

                    <div class="logTitle">

                        ${entry.title}

                    </div>

                    <div class="logNeutral">

                        ${entry.time}

                    </div>

                `;

                entry.lines.forEach(line=>{

                    html += `

                        <div class="${line.className}">

                            ${line.text}

                        </div>

                    `;

                });

                card.innerHTML = html;

            }

            else{

                card.innerHTML = `

                    <div class="logTitle">

                        ⚔ ${entry.title}

                    </div>

                    <div class="logNeutral">

                        ${entry.time}

                    </div>

                    <div class="${entry.hp>=0?"logGain":"logLoss"}">

                        HP ${entry.hp>0?"+":""}${entry.hp}

                    </div>

                    <div class="${entry.mp>=0?"logGain":"logLoss"}">

                        MP ${entry.mp>0?"+":""}${entry.mp}

                    </div>

                    <div class="logGain">

                        ${entry.stat.toUpperCase()} +${entry.exp} EXP

                    </div>

                `;

            }

            DOM.combatLog.appendChild(card);

        });

    };

    /*==================================================
        PATCH DAILY AWAKENING
    ==================================================*/

    document

        .querySelectorAll(".sleepButton")

        .forEach(button=>{

            button.addEventListener(

                "click",

                ()=>{

                    const sleep =

                        button.dataset.sleep;

                    if(sleep==="perfect"){

                        addSystemLog(

                            "☀ Perfect Rest",

                            [

                                {

                                    className:"logGain",

                                    text:"HP restored to 100"

                                },

                                {

                                    className:"logGain",

                                    text:"MP restored to 100"

                                }

                            ]

                        );

                    }

                    else if(sleep==="mediocre"){

                        addSystemLog(

                            "🌤 Mediocre Sleep",

                            [

                                {

                                    className:"logGain",

                                    text:"HP +25"

                                },

                                {

                                    className:"logNeutral",

                                    text:"MP capped at 70"

                                }

                            ]

                        );

                    }

                    else{

                        addSystemLog(

                            "💀 Trash Sleep",

                            [

                                {

                                    className:"logLoss",

                                    text:"HP -10"

                                },

                                {

                                    className:"logNeutral",

                                    text:"MP capped at 40"

                                }

                            ]

                        );

                    }

                }

            );

        });

    /*==================================================
        INITIALIZATION
    ==================================================*/

    if(player.lastAwakening !== TODAY){

        openAwakening();

    }

    renderCombatLog();
    renderHUD();

});