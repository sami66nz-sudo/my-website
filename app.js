// Simple Auth (No backend) using localStorage
// Pages supported: index.html (login), register.html (register), dashboard.html

const $ = (sel) => document.querySelector(sel);

function setText(id, txt) {
  const el = document.getElementById(id);
  if (el) el.textContent = txt;
}

function saveUser(user) {
  localStorage.setItem("auth_user", JSON.stringify(user));
}

function getUser() {
  const raw = localStorage.getItem("auth_user");
  return raw ? JSON.parse(raw) : null;
}

function setSession(username) {
  localStorage.setItem("auth_session", username);
}

function getSession() {
  return localStorage.getItem("auth_session");
}

function clearSession() {
  localStorage.removeItem("auth_session");
}

// ---- Register ----
function initRegister() {
  const form = $("#registerForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = $("#fullName").value.trim();
    const username = $("#regUsername").value.trim();
    const email = $("#email").value.trim();
    const pass = $("#regPassword").value;
    const confirm = $("#confirmPassword").value;

    if (!fullName || !username || !email || !pass || !confirm) {
      setText("regMsg", "Please fill all fields.");
      return;
    }

    if (pass.length < 6) {
      setText("regMsg", "Password must be at least 6 characters.");
      return;
    }

    if (pass !== confirm) {
      setText("regMsg", "Passwords do not match.");
      return;
    }

    // Save user
    saveUser({ fullName, username, email, pass });
    setText("regMsg", "Account created! Redirecting to login...");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 900);
  });
}

// ---- Login ----
function initLogin() {
  const form = $("#loginForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = $("#loginUsername").value.trim();
    const pass = $("#loginPassword").value;

    const user = getUser();
    if (!user) {
      setText("loginMsg", "No account found. Please register first.");
      return;
    }

    if (username !== user.username || pass !== user.pass) {
      setText("loginMsg", "Wrong username or password.");
      return;
    }

    setSession(user.username);
    setText("loginMsg", "Login successful! Redirecting...");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 600);
  });
}

// ---- Dashboard ----
function initDashboard() {
  const nameEl = $("#dashName");
  if (!nameEl) return;

  const session = getSession();
  const user = getUser();

  if (!session || !user || session !== user.username) {
    window.location.href = "index.html";
    return;
  }

  nameEl.textContent = user.fullName || user.username;

  const logoutBtn = $("#logoutBtn");
  logoutBtn?.addEventListener("click", () => {
    clearSession();
    window.location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initRegister();
  initLogin();
  initDashboard();
});