const svg = document.getElementById("graphSVG");
const logList = document.getElementById("graphLogList");

let nodes = [];
let edges = [];
let nodeCount = 0;

function logAction(msg) {
  const div = document.createElement("div");
  div.textContent = msg;
  logList.appendChild(div);
  logList.scrollTop = logList.scrollHeight;
}

// === Add Node ===
document.getElementById("addNodeBtn").addEventListener("click", () => {
  nodeCount++;
  const node = {
    id: nodeCount,
    x: Math.random() * 600 + 60,
    y: Math.random() * 300 + 100
  };
  nodes.push(node);

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", node.x);
  circle.setAttribute("cy", node.y);
  circle.setAttribute("r", 18);
  circle.setAttribute("fill", "url(#nodeGrad)");
  circle.setAttribute("stroke", "#fff");
  circle.setAttribute("stroke-width", "2");
  circle.classList.add("graph-node");
  svg.appendChild(circle);

  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("x", node.x);
  label.setAttribute("y", node.y + 5);
  label.setAttribute("text-anchor", "middle");
  label.setAttribute("fill", "white");
  label.textContent = node.id;
  svg.appendChild(label);

  anime({
    targets: circle,
    r: [0, 18],
    easing: "easeOutElastic(1, .5)",
    duration: 600
  });

  logAction(`Added Node ${node.id}`);
});

// === Add Edge ===
document.getElementById("addEdgeBtn").addEventListener("click", () => {
  if (nodes.length < 2) return logAction("⚠️ Need at least 2 nodes to add an edge!");
  
  const n1 = nodes[Math.floor(Math.random() * nodes.length)];
  const n2 = nodes[Math.floor(Math.random() * nodes.length)];

  if (n1.id === n2.id) return logAction("⚠️ Can't connect node to itself!");

  const exists = edges.some(e =>
    (e[0].id === n1.id && e[1].id === n2.id) || (e[0].id === n2.id && e[1].id === n1.id)
  );
  if (exists) return logAction(`⚠️ Edge between Node ${n1.id} & Node ${n2.id} already exists!`);

  edges.push([n1, n2]);

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", n1.x);
  line.setAttribute("y1", n1.y);
  line.setAttribute("x2", n2.x);
  line.setAttribute("y2", n2.y);
  line.setAttribute("stroke", "var(--g4)");
  line.setAttribute("stroke-width", "2");
  line.classList.add("graph-edge");
  svg.insertBefore(line, svg.firstChild);

  anime({
    targets: line,
    strokeDasharray: [0, 200],
    easing: "easeOutExpo",
    duration: 500
  });

  logAction(`Connected Node ${n1.id} ↔ Node ${n2.id}`);
});

// === Traversal Animation Helpers ===
function highlightNode(id, color = "#f0f") {
  const circle = svg.querySelectorAll(".graph-node")[id - 1];
  if (!circle) return;
  anime({
    targets: circle,
    scale: [1, 1.2, 1],
    duration: 600,
    easing: "easeInOutSine",
    backgroundColor: color
  });
}

// === Auto Generate Graph ===
function autoGenerateGraph() {
  if (nodes.length < 6) {
    while (nodes.length < 6) {
      document.getElementById("addNodeBtn").click();
    }
  }
  for (let i = 0; i < 6; i++) {
    const n1 = nodes[i];
    const n2 = nodes[(i + 1) % 6];
    const exists = edges.some(e =>
      (e[0].id === n1.id && e[1].id === n2.id) || (e[0].id === n2.id && e[1].id === n1.id)
    );
    if (!exists) {
      edges.push([n1, n2]);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", n1.x);
      line.setAttribute("y1", n1.y);
      line.setAttribute("x2", n2.x);
      line.setAttribute("y2", n2.y);
      line.setAttribute("stroke", "var(--g4)");
      line.setAttribute("stroke-width", "2");
      svg.insertBefore(line, svg.firstChild);
    }
  }
  logAction("Auto-generated a connected graph of 6 nodes!");
}

// === BFS ===
document.getElementById("bfsBtn").addEventListener("click", () => {
  autoGenerateGraph();
  logAction("🚀 Starting BFS simulation...");
  let i = 0;
  const order = [1, 2, 3, 4, 5, 6];
  const interval = setInterval(() => {
    if (i >= order.length) return clearInterval(interval);
    highlightNode(order[i]);
    logAction(`Visited Node ${order[i]}`);
    i++;
  }, 800);
});

// === DFS ===
document.getElementById("dfsBtn").addEventListener("click", () => {
  autoGenerateGraph();
  logAction("🚀 Starting DFS simulation...");
  let i = 5;
  const order = [6, 5, 4, 3, 2, 1];
  const interval = setInterval(() => {
    if (i < 0) return clearInterval(interval);
    highlightNode(order[5 - i]);
    logAction(`Visited Node ${order[5 - i]}`);
    i--;
  }, 800);
});

// === Reset / Clear ===
document.getElementById("resetGraphBtn").addEventListener("click", () => {
  svg.innerHTML = "";
  nodes = [];
  edges = [];
  nodeCount = 0;
  logList.innerHTML = "";
  logAction("Graph reset!");
});

document.getElementById("clearGraphLogs").addEventListener("click", () => {
  logList.innerHTML = "";
});
