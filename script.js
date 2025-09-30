// script.js — full prototype logic
// Requires anime.js included in HTML <head>

// ---------- app state ----------
let count = 0;
const MAX_SIM_STEPS = 7;
const stackContainer = () => document.getElementById("stackContainer");
const logList = () => document.getElementById("logList");

// sample quiz data
const quizQuestions = [
  { q: "If we push 1,2,3 then pop once, what is on top?", options: ["1", "2", "3", "empty"], answer: 1, explain: "Push 1 → [1], push 2 → [1,2], push 3 → [1,2,3], pop → removes 3, top becomes 2." },
  { q: "Which operation follows LIFO?", options: ["Queue enqueue", "Stack push", "Stack pop", "Both push and pop"], answer: 2, explain: "Pop removes the most recently added item, so it's LIFO behaviour." },
  { q: "Which real-world uses a stack?", options: ["Undo history", "Playlist", "Bank queue", "Priority scheduling"], answer: 0, explain: "Undo history stacks actions — last action undone first." },
  { q: "What is stack underflow?", options: ["When stack is full", "When trying to pop empty stack", "When push fails", "When peek returns top"], answer: 1, explain: "Underflow happens when popping from an empty stack." }
];

// ---------- utilities ----------
function nowStamp() {
  const t = new Date();
  return t.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
}

function addLog(text) {
  const el = document.createElement("div");
  el.className = "log-item";
  el.textContent = `[${nowStamp()}] ${text}`;
  logList().appendChild(el);

  // animate in
  anime({
    targets: el,
    translateY: [20,0],
    opacity: [0,1],
    duration: 450,
    easing: 'easeOutExpo'
  });

  // auto-scroll to bottom
  logList().scrollTop = logList().scrollHeight;
}

function clearLogs() {
  const items = Array.from(logList().children);
  anime({
    targets: items,
    translateX: [0, 40],
    opacity: [1, 0],
    duration: 400,
    delay: anime.stagger(40),
    easing: 'easeInQuad',
    complete: () => (logList().innerHTML = "")
  });
}

// ---------- stack visual operations ----------
function createStackItem(label) {
  const item = document.createElement("div");
  item.className = "stack-item";
  item.textContent = label;
  return item;
}

function pushItem(labelText) {
  const label = labelText || `Item ${++count}`;
  const item = createStackItem(label);
  stackContainer().appendChild(item);

  anime({
    targets: item,
    translateY: [-120, 0],
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: 700,
    easing: 'cubicBezier(.2, .9, .2, 1)'
  });

  addLog(`PUSH ${label}`);
}

function popItem() {
  const container = stackContainer();
  if (!container || container.children.length === 0) {
    addLog("POP attempted but stack empty");
    anime({ targets: container, translateX: [-6,6,-3,3,0], duration: 420, easing: 'easeInOutSine' });
    return;
  }
  const item = container.lastElementChild;
  addLog(`POP ${item.textContent}`);

  anime({
    targets: item,
    translateY: [0, -140],
    opacity: [1, 0],
    scale: [1, 0.92],
    duration: 700,
    easing: 'cubicBezier(.25,.8,.25,1)',
    complete: () => item.remove()
  });
}

function resetStack() {
  const container = stackContainer();
  const items = Array.from(container.children);
  if (items.length > 0) {
    anime({
      targets: items,
      translateX: [0, 80],
      opacity: [1, 0],
      duration: 500,
      delay: anime.stagger(40),
      easing: 'easeInQuad',
      complete: () => (container.innerHTML = "")
    });
  }
  count = 0;
  clearLogs(); // clear logs too
  addLog("Stack and logs reset");
}

// ---------- randomized auto simulation ----------
function autoSim() {
  resetStack();
  addLog("Auto-sim started");

  let seq = [];
  let size = 0;
  for (let i=0;i<MAX_SIM_STEPS;i++){
    let action = (size===0) ? "push" : (Math.random()<0.58?"push":"pop");
    seq.push(action);
    size = (action==="push") ? size+1 : Math.max(0,size-1);
  }

  seq.forEach((act, i) => {
    const delay = 700 + i*(700 + Math.floor(Math.random()*300));
    setTimeout(()=> { if(act==="push") pushItem(); else popItem(); }, delay);
  });

  setTimeout(()=> addLog("Auto-sim finished"), 700 + seq.length * 1100 + 200);
}

// ---------- explanation tabs ----------
document.addEventListener("click", e=>{
  if(e.target.matches(".explain-tab")){
    document.querySelectorAll(".explain-tab").forEach(t=>t.classList.remove("active"));
    e.target.classList.add("active");
    const sec = e.target.dataset.section;
    document.querySelectorAll(".explain-section").forEach(s=>s.classList.remove("active"));
    document.getElementById(sec).classList.add("active");
  }
});

// ---------- wiring buttons ----------
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("pushBtn").addEventListener("click", ()=> pushItem());
  document.getElementById("popBtn").addEventListener("click", ()=> popItem());
  document.getElementById("resetBtn").addEventListener("click", ()=> resetStack());
  document.getElementById("autoBtn").addEventListener("click", ()=> autoSim());
  document.getElementById("clearLogs").addEventListener("click", ()=> clearLogs());

  prepareQuiz();

  anime({
    targets: ".sim-canvas, .logs-panel, .explanation",
    translateY: [18, 0],
    opacity: [0, 1],
    delay: anime.stagger(80),
    duration: 650,
    easing: 'easeOutExpo'
  });
});


