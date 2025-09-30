// ==================== STACK QUESTIONS ====================
const stackQuestions = [
  { q: "If we push 1,2,3 then pop once, what is on top?", options: ["1", "2", "3", "empty"], answer: 1, explain: "Push 1 → [1], push 2 → [1,2], push 3 → [1,2,3], pop → removes 3, top becomes 2." },
  { q: "Which operation follows LIFO?", options: ["Queue enqueue", "Stack push", "Stack pop", "Both push and pop"], answer: 2, explain: "Pop removes the most recently added item, so it's LIFO behaviour." },
  { q: "Which real-world uses a stack?", options: ["Undo history", "Playlist", "Bank queue", "Priority scheduling"], answer: 0, explain: "Undo history stacks actions — last action undone first." },
  { q: "What is stack underflow?", options: ["When stack is full", "When trying to pop empty stack", "When push fails", "When peek returns top"], answer: 1, explain: "Underflow happens when popping from an empty stack." }
];

// ==================== QUEUE QUESTIONS ====================
const queueQuestions = [
  { q: "If we enqueue 1,2,3 then dequeue once, what remains at front?", options: ["1", "2", "3", "empty"], answer: 1, explain: "Enqueue 1 → [1], enqueue 2 → [1,2], enqueue 3 → [1,2,3], dequeue → removes 1, front becomes 2." },
  { q: "Which operation follows FIFO?", options: ["Stack pop", "Queue enqueue", "Queue dequeue", "Stack push"], answer: 2, explain: "Dequeue removes the element added earliest, FIFO style." },
  { q: "Which real-world uses a queue?", options: ["Undo history", "Print jobs", "Call stack", "Recursive functions"], answer: 1, explain: "Printer tasks are queued — first job goes first." },
  { q: "What is queue underflow?", options: ["When queue is full", "When enqueue fails", "When trying to dequeue empty queue", "When peek shows front"], answer: 2, explain: "Underflow happens when dequeuing from an empty queue." }
];

// ==================== QUIZ ENGINE ====================
function setupQuiz(prefix, questions) {
  const area = document.getElementById(prefix + "QuizArea");
  const timerEl = document.getElementById(prefix + "QuizTimer");
  const startBtn = document.getElementById(prefix + "StartQuiz");
  const resultBox = document.getElementById(prefix + "QuizResult");
  const retryBtn = document.getElementById(prefix + "RetryQuiz");
  const resultText = document.getElementById(prefix + "ResultText");
  const explainWrong = document.getElementById(prefix + "ExplainWrong");
  const chartCanvas = document.getElementById(prefix + "ResultChart");

  if (!area || !startBtn) return; // not this page

  let current = 0, score = 0, timer = null, time = 0;

  function showQuestion(i) {
    const q = questions[i];
    area.innerHTML = `
      <div class="question"><strong>Q${i + 1}:</strong> ${q.q}</div>
      <div class="options">
        ${q.options.map((opt, idx) => `<button class="option-btn" data-idx="${idx}">${opt}</button>`).join("")}
      </div>
    `;
    document.querySelectorAll(".option-btn").forEach(btn => {
      btn.addEventListener("click", () => handleAnswer(btn, q));
    });
  }

  function handleAnswer(btn, q) {
    const chosen = parseInt(btn.dataset.idx);
    if (chosen === q.answer) {
      score++;
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
      explainWrong.innerHTML += `<p>Q${current + 1}: ${q.explain}</p>`;
    }
    setTimeout(() => {
      current++;
      if (current < questions.length) showQuestion(current);
      else endQuiz();
    }, 800);
  }

  function startQuiz() {
    current = 0; score = 0; explainWrong.innerHTML = ""; time = 0;
    resultBox.hidden = true;
    area.hidden = false;
    showQuestion(current);
    timer = setInterval(() => {
      time++; timerEl.textContent = "Time: " + time;
    }, 1000);
  }

  function endQuiz() {
    clearInterval(timer);
    area.hidden = true;
    resultBox.hidden = false;
    resultText.textContent = `You got ${score}/${questions.length} correct in ${time}s.`;

    // Chart
    const ctx = chartCanvas.getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Correct", "Wrong"],
        datasets: [{
          data: [score, questions.length - score],
          backgroundColor: ["#4CAF50", "#F44336"]
        }]
      },
      options: { responsive: false }
    });
  }

  startBtn.addEventListener("click", startQuiz);
  retryBtn.addEventListener("click", startQuiz);
}

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
  setupQuiz("", stackQuestions);       // stack quiz
  setupQuiz("queue", queueQuestions);  // queue quiz
});
