const subjectsContainer = document.getElementById("subjectsContainer");
let chartInstance;

function addSubject(credit = '', mark = '') {
  const div = document.createElement("div");
  div.className = "flex items-center gap-2";
  div.innerHTML = `
    <input type="text" placeholder="Name" class="flex-1 text-sm px-2 py-1 border rounded subject-name" />
    <input type="number" placeholder="Cr" class="w-14 text-sm px-2 py-1 border rounded credits text-center" value="${credit}" />
    <input type="number" placeholder="Mark" class="w-16 text-sm px-2 py-1 border rounded marks text-center" value="${mark}" />
    <button class="text-red-500 text-lg" onclick="this.parentElement.remove()">✖</button>
  `;
  subjectsContainer.appendChild(div);
}

function getGradePoint(marks) {
  if (marks >= 90) return 10;
  else if (marks >= 80) return 9;
  else if (marks >= 70) return 8;
  else if (marks >= 60) return 7;
  else if (marks >= 50) return 6;
  else if (marks >= 40) return 5;
  else return 0;
}

function getGrade(marks) {
  if (marks >= 90) return "O";
  else if (marks >= 80) return "A+";
  else if (marks >= 70) return "A";
  else if (marks >= 60) return "B+";
  else if (marks >= 50) return "B";
  else if (marks >= 40) return "C";
  else return "R";
}

function calculateCGPA() {
  const btn = document.getElementById("calculateBtn");
  btn.innerText = "Calculating...";
  btn.disabled = true;

  setTimeout(() => {
    const credits = document.querySelectorAll(".credits");
    const marks = document.querySelectorAll(".marks");
    const names = document.querySelectorAll(".subject-name");

    let totalCredits = 0, weightedSum = 0;
    let labels = [], data = [];

    let html = `<div class="mb-3">`;
    for (let i = 0; i < credits.length; i++) {
      const credit = parseInt(credits[i].value);
      const mark = parseInt(marks[i].value);
      const name = names[i].value || `Subject ${i + 1}`;

      if (isNaN(credit) || isNaN(mark)) continue;

      const gp = getGradePoint(mark);
      const grade = getGrade(mark);

      totalCredits += credit;
      weightedSum += credit * gp;

      html += `<div class="flex justify-between">
        <span>${name}</span>
        <span>${mark} marks (${grade})</span>
      </div>`;

      labels.push(name);
      data.push(mark);
    }
    html += `</div>`;

    if (totalCredits === 0) {
      alert("Enter valid data.");
      btn.innerText = "📊 Calculate";
      btn.disabled = false;
      return;
    }

    const cgpa = (weightedSum / totalCredits).toFixed(2);
    document.getElementById("greetingSection").innerHTML = `<p class="bg-green-100 border border-green-300 text-green-700 p-2 rounded text-center font-semibold">Your CGPA is: ${cgpa}</p>`;
    document.getElementById("detailsSection").innerHTML = html;

    drawBarChart(labels, data);

    document.getElementById("resultDisplay").style.display = "block";
    document.getElementById("placeholderText").style.display = "none";
    btn.innerText = "📊 Calculate";
    btn.disabled = false;
  }, 500);
}

function drawBarChart(labels, data) {
  const ctx = document.getElementById("chartCanvas").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Marks",
        data,
        backgroundColor: [
          "#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0",
          "#9966ff", "#c9cbcf", "#ffa600", "#ff9f40"
        ],
        borderColor: "#333",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: ${ctx.parsed.y} marks`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 10,
            color: "#5D4037"
          },
          grid: { color: "#eee" }
        },
        x: {
          ticks: { color: "#5D4037" },
          grid: { display: false }
        }
      }
    }
  });
}

async function exportPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const text = document.getElementById("resultDisplay").innerText;
  pdf.setFontSize(14);
  pdf.text("CGPA Report", 10, 20);
  pdf.setFontSize(11);
  pdf.text(text, 10, 35);
  pdf.save("CGPA_Report.pdf");
}

window.onload = () => {
  addSubject();
  addSubject();
};
