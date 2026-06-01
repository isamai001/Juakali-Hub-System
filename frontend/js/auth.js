/**
 * ============================================================
 * Authentication Module
 * ============================================================
 * Handles user registration, login, and authentication.
 */

// ── Registration Form Handler ────────────────────────────────
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const first_name = document.getElementById("firstName")?.value || "";
    const last_name = document.getElementById("lastName")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const password = document.getElementById("password")?.value || "";
    const phone = document.getElementById("phone")?.value || "";
    const user_type = document.getElementById("userType")?.value || "client";

    if (!first_name || !last_name || !email || !password || !phone) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    const submitBtn = registerForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    const result = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        phone,
        user_type,
      }),
    });

    submitBtn.disabled = false;
    submitBtn.textContent = "Register";

    if (result.success) {
      showNotification("Registration successful! Redirecting to login...", "success");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      showNotification(result.error || "Registration failed", "error");
    }

    registerForm.reset();
  });
}

// ── Login Form Handler ───────────────────────────────────────
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email")?.value || "";
    const password = document.getElementById("password")?.value || "";

    if (!email || !password) {
      showNotification("Please enter email and password", "error");
      return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    const result = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    submitBtn.disabled = false;
    submitBtn.textContent = "Login";

    if (result.success) {
      const { token, user } = result.data;
      setAuthToken(token);
      setUser(user);
      showNotification("Login successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } else {
      showNotification(result.error || "Login failed", "error");
    }

    loginForm.reset();
  });
}

// ── Logout Handler ───────────────────────────────────────────
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    clearAuth();
    showNotification("Logged out successfully", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  });
}

// ── Notification Helper ──────────────────────────────────────
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === "success" ? "#3fb950" : type === "error" ? "#f85149" : "#0969da"};
    color: white;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// ── Check Authentication Status ──────────────────────────────
function checkAuthStatus() {
  const token = getAuthToken();
  const user = getUser();

  // Update UI based on auth status
  const authLinks = document.querySelectorAll('[data-auth-only]');
  const guestLinks = document.querySelectorAll('[data-guest-only]');

  if (token && user.id) {
    // User is authenticated
    authLinks.forEach((link) => (link.style.display = ""));
    guestLinks.forEach((link) => (link.style.display = "none"));

    // Update user menu if exists
    const userNameEl = document.getElementById("userName");
    if (userNameEl) {
      userNameEl.textContent = `${user.first_name} ${user.last_name}`;
    }
  } else {
    // User is not authenticated
    authLinks.forEach((link) => (link.style.display = "none"));
    guestLinks.forEach((link) => (link.style.display = ""));
  }
}

// ── Add CSS animations ───────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ── Initialize on page load ──────────────────────────────────
document.addEventListener("DOMContentLoaded", checkAuthStatus);
