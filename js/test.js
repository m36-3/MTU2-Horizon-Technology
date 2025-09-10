// ==========================
// قاعدة بيانات الأسئلة
// ==========================
const quizzes = {
  "اجهزة-1": [
    { q: "What is the recommended internal diameter tube size for an average size adult male?",
      options: {a: "7.5–8-mm", b: "8.5–9-mm", c: "6.5–7-mm", d: "9.5–10-mm"},
      answer: "b" },
    { q: "What type of tracheal tube is used to prevent kinking and occlusion during head and neck surgery?",
      options: {a: "Standard tracheal tube", b: "Armoured tracheal tube", c: "Polar tracheal tube", d: "Laser resistant tracheal tube"},
      answer: "b" },
    { q: "What is the narrowest point in a child’s airway?",
      options: {a: "Vocal cords", b: "Cricoid cartilage", c: "Trachea", d: "Bronchi"},
      answer: "b" },
    { q: "What type of cuff exerts minimal pressure on the tracheal wall?",
      options: {a: "High pressure/low volume", b: "Low pressure/high volume", c: "Standard pressure", d: "Variable pressure"},
      answer: "b" },
    { q: "What is a potential complication of high-pressure/low-volume cuffs if left in position for long periods?",
      options: {a: "Infection of the stoma", b: "Necrosis of the tracheal mucosa", c: "Granulomata of the trachea", d: "Blockage of the tube by secretions"},
      answer: "b" },
    { q: "What is the purpose of armoured tracheal tubes?",
      options: {a: "To provide a flexible design for intubation", b: "To prevent kinking and occlusion during head and neck surgery", c: "To allow for nasal intubation", d: "To reduce the internal diameter of the tube"},
      answer: "b" },
    { q: "What is the risk associated with high-pressure/low-volume cuffs if left in position for long periods?",
      options: {a: "Infection of the stoma", b: "Necrosis of the tracheal mucosa", c: "Granulomata of the trachea", d: "Blockage of the tube by secretions"},
      answer: "b" },
    { q: "What is the internal diameter of the standard tracheal tube for neonates?",
      options: {a: "8.5-mm", b: "7.5-mm", c: "15-mm", d: "8.5-mm diameter version"},
      answer: "d" },
    { q: "What is the main feature of laser resistant tracheal tubes?",
      options: {a: "They are made of plastic", b: "They can withstand laser beams", c: "They are designed for nasal intubation", d: "They have a smaller internal diameter"},
      answer: "b" },
    { q: "What is a common complication in the intensive care unit related to tracheal tubes?",
      options: {a: "Granulomata of the trachea", b: "Haemorrhage", c: "Tracheal stenosis", d: "Cuff herniation"},
      answer: "b" },
    { q: "Armoured tracheal tubes are made of plastic or silicone rubber.",
      options: {a: "True", b: "False"},
      answer: "a" },
    { q: "The cuff of laser resistant tracheal tubes is filled with air to prevent ignition.",
      options: {a: "True", b: "False"},
      answer: "b" },
    { q: "Cuffed tubes are used in adults to achieve an air-tight seal.",
      options: {a: "True", b: "False"},
      answer: "a" },
    { q: "The narrowest point in a child's airway is the vocal cords.",
      options: {a: "True", b: "False"},
      answer: "b" },
    { q: "High-pressure/low-volume cuffs can prevent the passing of vomitus into the lungs.",
      options: {a: "True", b: "False"},
      answer: "a" }
  ]
};

// ==========================
// إنشاء الفلاتر ديناميكيًا
// ==========================
function createFilters() {
  const filtersContainer = document.getElementById('filters');
  filtersContainer.innerHTML = "";

  // جمع المواد المتوفرة
  const subjects = {};
  Object.keys(quizzes).forEach(key => {
    const [subject, booklet] = key.split('-');
    if (!subjects[subject]) subjects[subject] = new Set();
    subjects[subject].add(booklet);
  });

  // قائمة المواد
  const subjectSelect = document.createElement('select');
  subjectSelect.id = 'subject';
  subjectSelect.innerHTML = `<option value="">اختر المادة</option>`;
  for (let subj in subjects) {
    subjectSelect.innerHTML += `<option value="${subj}">${capitalize(subj)}</option>`;
  }

  // قائمة الملزمة
  const bookletSelect = document.createElement('select');
  bookletSelect.id = 'booklet';
  bookletSelect.innerHTML = `<option value="">اختر الملزمة</option>`;

  // عند اختيار مادة
  subjectSelect.addEventListener('change', () => {
    const chosenSubj = subjectSelect.value;
    bookletSelect.innerHTML = `<option value="">اختر الملزمة</option>`;
    if (chosenSubj && subjects[chosenSubj]) {
      subjects[chosenSubj].forEach(b => {
        bookletSelect.innerHTML += `<option value="${b}">ملزمة ${b}</option>`;
      });
    }
    document.getElementById("questions").innerHTML = "";
  });

  bookletSelect.addEventListener('change', loadQuiz);

  filtersContainer.appendChild(subjectSelect);
  filtersContainer.appendChild(bookletSelect);
}

// ==========================
// تحميل الأسئلة
// ==========================
function loadQuiz() {
  const subject = document.getElementById("subject").value;
  const booklet = document.getElementById("booklet").value;
  const key = `${subject}-${booklet}`;
  const container = document.getElementById("questions");
  container.innerHTML = "";

  if (quizzes[key]) {
    quizzes[key].forEach((q, i) => {
      const card = document.createElement("div");
      card.className = "question-card";
      card.setAttribute("data-answer", q.answer);

      let html = `<div class="question-text">${i + 1}. ${q.q}</div><div class="options">`;
      for (let opt in q.options) {
        html += `
          <input type="radio" id="q${i}${opt}" name="q${i}" value="${opt}">
          <label for="q${i}${opt}">${q.options[opt]}</label>
        `;
      }
      html += `</div>`;
      card.innerHTML = html;
      container.appendChild(card);
    });
  } else {
    container.innerHTML = `<p class="no-questions">لا توجد أسئلة لهذه الملزمة حالياً.</p>`;
  }
}

// ==========================
// التحقق من الإجابات
// ==========================
function checkAnswers() {
  const cards = document.querySelectorAll('.question-card');
  let correct = 0;

  cards.forEach(card => {
    const answer = card.getAttribute('data-answer');
    const selected = card.querySelector('input:checked');
    if (selected && selected.value === answer) {
      correct++;
      card.style.border = "2px solid limegreen";
    } else {
      card.style.border = "2px solid crimson";
    }
  });

  const result = document.getElementById('result');
  result.innerText = `لقد أجبت بشكل صحيح على ${correct} من ${cards.length} أسئلة.`;
  result.style.color = "var(--accent)";
}

// ==========================
// مساعدة: تحويل أول حرف لكبير
// ==========================
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==========================
// تشغيل عند تحميل الصفحة
// ==========================
document.addEventListener('DOMContentLoaded', createFilters);
