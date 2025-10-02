// tree.js — simple binary tree visualizer
let treeRoot = null;
let nodeId = 0;

// ----- Node class -----
class Node {
  constructor(data, x, y) {
    this.id = ++nodeId;
    this.data = data;
    this.left = null;
    this.right = null;
    this.x = x; // position for drawing
    this.y = y;
  }
}

// ----- Logs -----
function nowStamp() {
  return new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
}
function addTreeLog(msg) {
  const log = document.createElement("div");
  log.className = "log-item";
  log.textContent = `[${nowStamp()}] ${msg}`;
  document.getElementById("treeLogList").appendChild(log);
}
function clearTreeLogs() {
  document.getElementById("treeLogList").innerHTML = "";
}

// ----- Insert / Delete -----
function insertNode(value) {
  treeRoot = insertRec(treeRoot, value, 400, 40, 200);
  redrawTree();
  addTreeLog(`Inserted ${value}`);
}
function insertRec(node, value, x, y, offset) {
  if (!node) return new Node(value, x, y);
  if (value < node.data) node.left = insertRec(node.left, value, x-offset, y+80, offset/2);
  else node.right = insertRec(node.right, value, x+offset, y+80, offset/2);
  return node;
}
function deleteTree() {
  treeRoot = null;
  redrawTree();
  addTreeLog("Tree reset");
}

// ----- Draw Tree -----
function redrawTree() {
  const svg = document.getElementById("treeSVG");
  svg.innerHTML = "";
  drawNode(svg, treeRoot);
}
function drawNode(svg, node) {
  if (!node) return;
  if (node.left) {
    drawLine(svg, node.x, node.y, node.left.x, node.left.y);
    drawNode(svg, node.left);
  }
  if (node.right) {
    drawLine(svg, node.x, node.y, node.right.x, node.right.y);
    drawNode(svg, node.right);
  }
  drawCircle(svg, node.x, node.y, node.data);
}
function drawLine(svg, x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg","line");
  line.setAttribute("x1",x1);
  line.setAttribute("y1",y1);
  line.setAttribute("x2",x2);
  line.setAttribute("y2",y2);
  line.setAttribute("stroke","#aaa");
  line.setAttribute("stroke-width","2");
  svg.appendChild(line);
}
function drawCircle(svg, x, y, text) {
  const g = document.createElementNS("http://www.w3.org/2000/svg","g");
  const circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
  circle.setAttribute("cx",x);
  circle.setAttribute("cy",y);
  circle.setAttribute("r","20");
  circle.setAttribute("fill","#4cafef");
  circle.setAttribute("stroke","#333");
  circle.setAttribute("stroke-width","2");

  const label = document.createElementNS("http://www.w3.org/2000/svg","text");
  label.setAttribute("x",x);
  label.setAttribute("y",y+5);
  label.setAttribute("text-anchor","middle");
  label.setAttribute("fill","#fff");
  label.textContent = text;

  g.appendChild(circle);
  g.appendChild(label);
  svg.appendChild(g);
}

// ----- Auto Sim -----
function autoTree() {
  deleteTree();
  [50,30,70,20,40,60,80].forEach((val,i)=>{
    setTimeout(()=>insertNode(val), i*800);
  });
  setTimeout(()=> addTreeLog("Auto-sim finished"), 800*7 + 200);
}

// ----- Tabs -----
function setupExplainTabs(){
  const tabs = document.querySelectorAll(".explain-tab");
  tabs.forEach(tab=>{
    tab.addEventListener("click", ()=>{
      tabs.forEach(t=>t.classList.remove("active"));
      tab.classList.add("active");
      document.querySelectorAll(".explain-section").forEach(sec=>sec.classList.remove("active"));
      document.getElementById(tab.dataset.section).classList.add("active");
    });
  });
}

// ----- DOM Ready -----
document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("insertNodeBtn").addEventListener("click", ()=>{
    const val = Math.floor(Math.random()*90)+10;
    insertNode(val);
  });
  document.getElementById("deleteNodeBtn").addEventListener("click", ()=> deleteTree());
  document.getElementById("resetTreeBtn").addEventListener("click", ()=> deleteTree());
  document.getElementById("autoTreeBtn").addEventListener("click", ()=> autoTree());
  document.getElementById("clearTreeLogs").addEventListener("click", ()=> clearTreeLogs());
  setupExplainTabs();
});

// ----- Quiz Qs -----
const treeQuestions = [
  { q:"How many children can a binary tree node have?", options:["1","2","3","Unlimited"], answer:1, explain:"Binary tree nodes have at most two children." },
  { q:"Which traversal gives sorted order in a BST?", options:["Preorder","Inorder","Postorder","Level-order"], answer:1, explain:"Inorder traversal of a BST yields sorted order." },
  { q:"What’s the height of a tree with just root?", options:["0","1","2","-1"], answer:0, explain:"By convention, height = 0 for root-only tree." },
  { q:"Which is not a tree application?", options:["File system","Expression evaluation","Undo history","Routing tables"], answer:2, explain:"Undo history is a stack, not a tree." }
];
