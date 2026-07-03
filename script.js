// ---- Configuration ----
// Paste the Google Apps Script Web App URL here after deploying it
// (see README.md for step-by-step instructions).
const SUBMIT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

// ---- Theme toggle ----
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  applyTheme(next);
});

// ---- Conditional fields ----
const comorbidityNone = document.getElementById("comorbidity-none");
const comorbidityChecks = document.querySelectorAll('input[name="comorbidities"]');

comorbidityChecks.forEach((box) => {
  box.addEventListener("change", () => {
    if (box === comorbidityNone && box.checked) {
      comorbidityChecks.forEach((other) => {
        if (other !== comorbidityNone) other.checked = false;
      });
    } else if (box !== comorbidityNone && box.checked) {
      comorbidityNone.checked = false;
    }
  });
});

const medicationDetail = document.getElementById("medication-detail");
document.querySelectorAll('input[name="on_medication"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    medicationDetail.classList.toggle("hidden", radio.value !== "Yes" || !radio.checked);
  });
});

const smokingSelect = document.getElementById("smoking");
const smokingDetail = document.getElementById("smoking-detail");
smokingSelect.addEventListener("change", () => {
  const show = smokingSelect.value === "Current" || smokingSelect.value === "Former";
  smokingDetail.classList.toggle("hidden", !show);
});

// ---- BMI display ----
const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
const bmiDisplay = document.getElementById("bmi-display");

function updateBmi() {
  const h = parseFloat(heightInput.value) / 100;
  const w = parseFloat(weightInput.value);
  if (h > 0 && w > 0) {
    const bmi = (w / (h * h)).toFixed(1);
    bmiDisplay.textContent = `Calculated BMI: ${bmi}`;
  } else {
    bmiDisplay.textContent = "";
  }
}
heightInput.addEventListener("input", updateBmi);
weightInput.addEventListener("input", updateBmi);

// ---- Submission ----
const form = document.getElementById("survey-form");
const submitBtn = document.getElementById("submit-btn");
const statusMessage = document.getElementById("status-message");

function generateAnonId() {
  return "resp_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((el) => el.value);
}

function getRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : "";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusMessage.textContent = "";
  statusMessage.className = "status";

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const payload = {
    id: generateAnonId(),
    timestamp: new Date().toISOString(),
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    height_cm: heightInput.value,
    weight_kg: weightInput.value,
    ethnicity: document.getElementById("ethnicity").value,
    comorbidities: getCheckedValues("comorbidities").join(", "),
    comorbidities_other: document.getElementById("comorbidities-other").value,
    on_medication: getRadioValue("on_medication"),
    medications: getCheckedValues("medications").join(", "),
    medications_other: document.getElementById("medications-other").value,
    smoking: smokingSelect.value,
    cigarettes_per_day: document.getElementById("cigarettes-per-day").value,
    years_smoked: document.getElementById("years-smoked").value,
    alcohol: document.getElementById("alcohol").value,
    activity: document.getElementById("activity").value,
    family_history: document.getElementById("family-history").value,
  };

  if (SUBMIT_URL.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE")) {
    statusMessage.textContent =
      "Submission storage isn't configured yet. See README.md to connect a Google Sheet.";
    statusMessage.classList.add("error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting…";

  try {
    await fetch(SUBMIT_URL, {
      method: "POST",
      // text/plain avoids a CORS preflight against Apps Script
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    statusMessage.textContent = "Thank you — your response has been submitted.";
    statusMessage.classList.add("success");
    form.reset();
    medicationDetail.classList.add("hidden");
    smokingDetail.classList.add("hidden");
    bmiDisplay.textContent = "";
  } catch (err) {
    statusMessage.textContent = "Something went wrong submitting your response. Please try again.";
    statusMessage.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
});
