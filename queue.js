// queue.js — horizontal queue simulator
let qCount = 0;
const MAX_QUEUE = 10;
const queueContainer = () => document.getElementById("queueContainer");
const queueLogList = () => document.getElementById("queueLogList");

// ---------- logs ----------
function nowStamp() {
  const t = new Date();
  return t.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
}

function addQueueLog(text) {
  const el = document.createElement("div");
  el.className="log-item";
  el.textContent=`[${nowStamp()}] ${text}`;
  queueLogList().appendChild(el);

  anime({ targets: el, translateY: [20,0], opacity:[0,1], duration:450, easing:'easeOutExpo' });
  queueLogList().scrollTop = queueLogList().scrollHeight;
}

function clearQueueLogs() {
  const items = Array.from(queueLogList().children);
  anime({
    targets: items,
    translateX: [0,40],
    opacity:[1,0],
    duration:400,
    delay: anime.stagger(40),
    easing:'easeInQuad',
    complete: ()=> queueLogList().innerHTML=""
  });
}

// ---------- visual ----------
function createQueueItem(label) {
  const item = document.createElement("div");
  item.className="queue-item";
  item.textContent = label;
  return item;
}

function enqueueItem(labelText) {
  const container = queueContainer();
  if(container.children.length >= MAX_QUEUE){
    addQueueLog("Queue full! Cannot enqueue.");
    anime({targets: container, translateY:[0,-6,6,-3,3,0], duration:420, easing:'easeInOutSine'});
    return;
  }
  const label = labelText || `Item ${++qCount}`;
  const item = createQueueItem(label);
  container.appendChild(item);

  anime({ targets:item, translateX:[-120,0], opacity:[0,1], scale:[0.9,1], duration:700, easing:'cubicBezier(.2,.9,.2,1)' });
  addQueueLog(`ENQUEUE ${label}`);
}

function dequeueItem() {
  const container = queueContainer();
  if(container.children.length === 0){
    addQueueLog("Queue empty! Cannot dequeue.");
    anime({ targets: container, translateY:[-6,6,-3,3,0], duration:420, easing:'easeInOutSine' });
    return;
  }
  const item = container.firstElementChild;
  addQueueLog(`DEQUEUE ${item.textContent}`);

  anime({ targets: item, translateX:[0,-140], opacity:[1,0], scale:[1,0.92], duration:700, easing:'cubicBezier(.25,.8,.25,1)', complete: ()=> item.remove() });
}

function resetQueue() {
  const container = queueContainer();
  const items = Array.from(container.children);
  if(items.length>0){
    anime({ targets:items, translateY:[0,80], opacity:[1,0], duration:500, delay: anime.stagger(40), easing:'easeInQuad', complete:()=> container.innerHTML="" });
  }
  qCount=0;
  clearQueueLogs();
  addQueueLog("Queue and logs reset");
}

// ---------- auto simulation ----------
function autoQueueSim() {
  resetQueue();
  addQueueLog("Auto-sim started");

  let seq=[]; let size=0;
  for(let i=0;i<MAX_QUEUE;i++){
    let action = (size===0) ? "enqueue" : (Math.random()<0.6?"enqueue":"dequeue");
    seq.push(action);
    size = (action==="enqueue") ? size+1 : Math.max(0,size-1);
  }

  seq.forEach((act,i)=>{
    const delay = 700 + i*(700+Math.floor(Math.random()*300));
    setTimeout(()=>{ if(act==="enqueue") enqueueItem(); else dequeueItem(); }, delay);
  });

  setTimeout(()=> addQueueLog("Auto-sim finished"), 700 + seq.length*1100 + 200);
}

// ---------- explanation / pseudocode tabs ----------
function setupExplainTabs(){
  const tabs = document.querySelectorAll(".explain-tab");
  tabs.forEach(tab=>{
    tab.addEventListener("click", e=>{
      tabs.forEach(t=>t.classList.remove("active"));
      tab.classList.add("active");

      const sectionId = tab.dataset.section;
      document.querySelectorAll(".explain-section").forEach(sec=>sec.classList.remove("active"));
      document.getElementById(sectionId).classList.add("active");
    });
  });
}

// ---------- wiring buttons ----------
document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("enqueueBtn").addEventListener("click", ()=> enqueueItem());
  document.getElementById("dequeueBtn").addEventListener("click", ()=> dequeueItem());
  document.getElementById("resetQueueBtn").addEventListener("click", ()=> resetQueue());
  document.getElementById("autoQueueBtn").addEventListener("click", ()=> autoQueueSim());
  document.getElementById("clearQueueLogs").addEventListener("click", ()=> clearQueueLogs());

  setupExplainTabs();

  anime({ targets:".sim-canvas, .logs-panel, .explanation", translateY:[18,0], opacity:[0,1], delay:anime.stagger(80), duration:650, easing:'easeOutExpo' });
});

const queueQuestions = [
  { 
    q: "If we enqueue 1,2,3 then dequeue once, what is at the front?", 
    options: ["1", "2", "3", "empty"], 
    answer: 1, 
    explain: "Enqueue 1 → [1], enqueue 2 → [1,2], enqueue 3 → [1,2,3], dequeue → removes 1, front becomes 2." 
  },
  { 
    q: "Which operation follows FIFO?", 
    options: ["Queue enqueue", "Queue dequeue", "Stack push", "Stack pop"], 
    answer: 1, 
    explain: "Dequeue removes the earliest added item, so it's FIFO behaviour." 
  },
  { 
    q: "Which real-world uses a queue?", 
    options: ["Undo history", "Playlist", "Bank queue", "Priority scheduling"], 
    answer: 2, 
    explain: "Bank queues serve people in order of arrival — classic FIFO." 
  },
  { 
    q: "What is queue underflow?", 
    options: ["When queue is full", "When trying to dequeue empty queue", "When enqueue fails", "When peek returns rear"], 
    answer: 1, 
    explain: "Underflow happens when dequeuing from an empty queue." 
  }
];
