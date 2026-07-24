const STORAGE_KEY = "lifeRPG";

const today = new Date().toISOString().split("T")[0];

let state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {

    hp: 100,

    mp: 100,

    maxMP: 100,

    lastBoot: ""

};

const hpBar = document.getElementById("hpBar");
const mpBar = document.getElementById("mpBar");

const hpText = document.getElementById("hpText");
const mpText = document.getElementById("mpText");

const statsHP = document.getElementById("statsHP");
const statsMP = document.getElementById("statsMP");
const statsMaxMP = document.getElementById("statsMaxMP");

const combatLog = document.getElementById("combatLog");

const modal = document.getElementById("awakeningModal");

function save(){

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

}

function clamp(){

    state.hp=Math.max(0,Math.min(100,state.hp));

    state.mp=Math.max(0,Math.min(state.maxMP,state.mp));

}

function updateBars(){

    clamp();

    hpBar.style.width = state.hp + "%";

    mpBar.style.width = (state.mp/state.maxMP*100)+"%";

    hpText.textContent=`${state.hp}/100`;

    mpText.textContent=`${state.mp}/${state.maxMP}`;

    statsHP.textContent=state.hp;

    statsMP.textContent=state.mp;

    statsMaxMP.textContent=state.maxMP;

    save();

}

function log(text){

    const line=document.createElement("div");

    const time=new Date().toLocaleTimeString();

    line.textContent=`[${time}] ${text}`;

    combatLog.prepend(line);

}

if(state.lastBoot!==today){

    modal.classList.remove("hidden");

}

modal.querySelectorAll("button").forEach(button=>{

    button.addEventListener("click",()=>{

        state.maxMP=Number(button.dataset.sleep);

        state.mp=state.maxMP;

        state.lastBoot=today;

        modal.classList.add("hidden");

        updateBars();

        log(`Daily Awakening complete. Max MP set to ${state.maxMP}.`);

    });

});

document.querySelectorAll(".tab").forEach(button=>{

    button.addEventListener("click",()=>{

        document.querySelectorAll(".tab")
            .forEach(tab=>tab.classList.remove("active"));

        button.classList.add("active");

        document.querySelectorAll(".view")
            .forEach(view=>view.classList.remove("active"));

        document
            .getElementById(button.dataset.tab)
            .classList.add("active");

    });

});

document
.getElementById("eventForm")
.addEventListener("submit",(event)=>{

    event.preventDefault();

    const input=document.getElementById("eventName");

    const name=input.value.trim();

    if(!name){

        return;

    }

    const type=document.getElementById("eventType").value;

    switch(type){

        case "work":
            state.mp-=10;
            log(`${name}: used 10 MP.`);
            break;

        case "exercise":
            state.hp+=5;
            log(`${name}: gained 5 HP.`);
            break;

        case "damage":
            state.hp-=10;
            log(`${name}: lost 10 HP.`);
            break;

    }

    updateBars();

    input.value="";

});

updateBars();