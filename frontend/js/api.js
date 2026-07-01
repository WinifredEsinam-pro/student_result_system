const API_URL = "http://localhost:3000/api";

// ── Auth helpers ──
const getToken = () => localStorage.getItem("token");
const getUser  = () => JSON.parse(localStorage.getItem("user") || "null");

const requireAuth = () => {
  if (!getToken()) { window.location.href = "index.html"; }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
};

//Base fetch
const request = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

const api = {
  get:    (path)         => request(path),
  post:   (path, body)   => request(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    (path, body)   => request(path, { method: "PUT",    body: JSON.stringify(body) }),
  delete: (path)         => request(path, { method: "DELETE" }),
};

// ── Toast notifications ──
const showToast = (message, type = "success") => {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;flex-shrink:0">
      ${type === "success"
        ? '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>'
        : '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>'}
    </svg>
    ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
};

// ── Sidebar active state ──
const setActivePage = (page) => {
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.page === page);
  });
};

// ── Populate sidebar user info ──
const initSidebar = () => {
  const user = getUser();
  if (!user) return;
  const avatar = document.getElementById("userAvatar");
  const userName = document.getElementById("userName");
  const userRole = document.getElementById("userRole");
  if (avatar)   avatar.textContent  = user.name?.charAt(0).toUpperCase();
  if (userName) userName.textContent = user.name;
  if (userRole) userRole.textContent = user.role;
  document.getElementById("logoutBtn")?.addEventListener("click", logout);
};

// ── GPA color helper ──
const gpaClass = (gpa) => {
  if (gpa >= 3.5) return "gpa-high";
  if (gpa >= 2.0) return "gpa-mid";
  return "gpa-low";
};
