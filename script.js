document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("category-card--active");
  });
});

const campaignModal = document.querySelector(".campaign-modal");
const openModalButtons = document.querySelectorAll("[data-open-modal]");
const closeModalButtons = document.querySelectorAll("[data-close-modal]");

openModalButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    campaignModal?.classList.add("open");
  });
});

closeModalButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    campaignModal?.classList.remove("open");
  });
});

campaignModal?.addEventListener("click", (event) => {
  if (event.target === campaignModal) {
    campaignModal.classList.remove("open");
  }
});

// Auth tab switching
const authTabs = document.querySelectorAll(".auth-tab");
const authPanels = document.querySelectorAll(".auth-panel");
const authJumpButtons = document.querySelectorAll("[data-auth-jump]");
const avatarTrigger = document.getElementById("avatarTrigger");
const avatarInput = document.getElementById("avatarInput");

function activateAuthTab(target) {
  if (!target) return;
  const name = target.getAttribute("data-auth-tab") || target.getAttribute("data-auth-jump");
  if (!name) return;

  authTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.getAttribute("data-auth-tab") === name);
  });
  authPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.getAttribute("data-auth-panel") === name);
  });
}

authTabs.forEach((tab) => {
  tab.addEventListener("click", () => activateAuthTab(tab));
});

authJumpButtons.forEach((btn) => {
  btn.addEventListener("click", () => activateAuthTab(btn));
});

avatarTrigger?.addEventListener("click", () => {
  avatarInput?.click();
});

// Save signup details and simple login handling
const signupForm = document.querySelector('.auth-panel--signup .auth-form');
const loginForm = document.querySelector('.auth-panel--login .auth-form');

signupForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const data = {
    name: form.querySelector('input[placeholder="Enter your full name"]')?.value || "",
    email: form.querySelector('input[type="email"]')?.value || "",
    phone: form.querySelector('input[type="tel"]')?.value || "",
    city: form.querySelector("#signupCity")?.value || "",
  };
  localStorage.setItem("nagarMitrUser", JSON.stringify(data));
  window.location.href = "account.html";
});

loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  window.location.href = "account.html";
});

// Populate account page
const accountName = document.getElementById("accountName");
const accountEmail = document.getElementById("accountEmail");
const accountPhone = document.getElementById("accountPhone");
const accountCity = document.getElementById("accountCity");
const accountAvatarInitials = document.getElementById("accountAvatarInitials");

if (accountName && accountEmail && accountPhone && accountCity) {
  const stored = localStorage.getItem("nagarMitrUser");
  if (stored) {
    const user = JSON.parse(stored);
    accountName.textContent = user.name || "Citizen Name";
    accountEmail.textContent = user.email || "email@example.com";
    accountPhone.textContent = user.phone || "—";
    accountCity.textContent = user.city || "—";
    if (accountAvatarInitials && user.name) {
      const parts = user.name.trim().split(" ");
      const initials = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
      accountAvatarInitials.textContent = initials.toUpperCase();
    }
  }
}

// -------------------------
// REPORT ISSUE WIZARD
// -------------------------
const reportPanels = document.querySelectorAll(".report-step-panel");
const reportNextButtons = document.querySelectorAll("[data-report-next]");
const reportBackButtons = document.querySelectorAll("[data-report-back]");
const reportSteps = document.querySelectorAll(".report-step");
let currentReportStep = 1;

function setReportStep(step) {
  currentReportStep = step;
  reportPanels.forEach((panel) => {
    panel.classList.toggle(
      "active",
      Number(panel.getAttribute("data-step-panel")) === step
    );
  });
  reportSteps.forEach((s) => {
    const n = Number(s.getAttribute("data-step"));
    s.classList.toggle("report-step--active", n <= step && step <= 4);
  });
}

reportNextButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentReportStep < 4) {
      setReportStep(currentReportStep + 1);
    }
  });
});

reportBackButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentReportStep > 1) {
      setReportStep(currentReportStep - 1);
    }
  });
});

// Step 1: select issue
const issueCards = document.querySelectorAll(".issue-category-card");
issueCards.forEach((card) => {
  card.addEventListener("click", () => {
    issueCards.forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
  });
});

// Step 2: priority
const priorityCards = document.querySelectorAll(".priority-card");
priorityCards.forEach((card) => {
  card.addEventListener("click", () => {
    priorityCards.forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
  });
});

// Step 3: use current location (mock)
const useCurrentLocationBtn = document.getElementById("useCurrentLocation");
const issueLocationInput = document.getElementById("issueLocation");

useCurrentLocationBtn?.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        issueLocationInput.value = `Current location: ${latitude.toFixed(
          4
        )}, ${longitude.toFixed(4)}`;
      },
      () => {
        issueLocationInput.value = "Current location (unable to fetch precise coordinates)";
      }
    );
  } else {
    issueLocationInput.value = "Current location not supported in this browser";
  }
});

// Step 4: photos + submit
const issuePhotosInput = document.getElementById("issuePhotos");
const photoPreview = document.getElementById("photoPreview");

issuePhotosInput?.addEventListener("change", () => {
  if (!photoPreview) return;
  photoPreview.innerHTML = "";
  const files = Array.from(issuePhotosInput.files || []).slice(0, 3);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement("div");
      div.className = "photo-preview-item";
      div.style.backgroundImage = `url('${e.target.result}')`;
      photoPreview.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
});

const submitReportBtn = document.getElementById("submitReportBtn");
const reportTokenEl = document.getElementById("reportToken");

submitReportBtn?.addEventListener("click", async () => {
  // 1. Collect Data
  const category = document.querySelector(".issue-category-card.selected")?.dataset.issue || "Other";
  const priority = document.querySelector(".priority-card.selected")?.dataset.priority || "Medium";
  const title = document.getElementById("issueTitle")?.value || "Untitled Issue";
  const description = document.getElementById("issueDescription")?.value || "";
  const location = document.getElementById("issueLocation")?.value || "";

  // Extract mock lat/lng if available from the location string or default to New Delhi
  let lat = 28.6139;
  let lng = 77.2090;

  if (location.includes("Current location:")) {
    const parts = location.split(":")[1].split(",");
    if (parts.length === 2) {
      lat = parseFloat(parts[0]);
      lng = parseFloat(parts[1]);
    }
  }

  // User Info (from localStorage)
  const user = JSON.parse(localStorage.getItem("nagarMitrUser") || "{}");
  const userId = user.email || "anonymous_" + Date.now();
  const userName = user.name || "Anonymous";

  // 2. Prepare Object
  const newIssue = {
    category,
    priority,
    title,
    description,
    location,
    lat,
    lng,
    status: "Pending",
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    userId,
    userName,
    upvotes: 0,
    comments: 0
  };

  try {
    // 3. Save to Firestore
    const docRef = await window._FM.firestore.collection("issues").add(newIssue);
    console.log("Issue Report ID: ", docRef.id);

    // 4. Show Success
    const token = `NM-${docRef.id.substring(0, 6).toUpperCase()}-${Math.floor(Math.random() * 999).toString().padStart(3, "0")}`;
    if (reportTokenEl) {
      reportTokenEl.textContent = token;
    }
    setReportStep(5);

    // Optional: Reset form or store recent report locally
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Failed to submit report. Please try again.");
  }
});




