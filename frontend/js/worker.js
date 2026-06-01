/**
 * ============================================================
 * Workers Module
 * ============================================================
 * Handles worker listing, filtering, and profile display.
 */

// ── Fetch and Display Workers ────────────────────────────────
async function loadWorkers(filters = {}) {
  try {
    const {
      skill = "",
      location = "",
      page = 1,
      limit = 12,
    } = filters;

    // Build query string
    const params = new URLSearchParams({
      page,
      limit,
      ...(skill && { skill }),
      ...(location && { location }),
    });

    const result = await apiFetch(`/workers?${params}`);

    if (result.success) {
      displayWorkers(result.data.workers);
      updatePagination(result.data.pagination);
    } else {
      console.error("Failed to load workers:", result.error);
      showNotification("Failed to load workers", "error");
    }
  } catch (error) {
    console.error("Error loading workers:", error);
    showNotification("Error loading workers", "error");
  }
}

// ── Display Workers Grid ─────────────────────────────────────
function displayWorkers(workers) {
  const container = document.getElementById("workersGrid") || document.getElementById("workerList");

  if (!container) {
    console.warn("Workers container not found");
    return;
  }

  container.innerHTML = "";

  if (workers.length === 0) {
    container.innerHTML = '<div class="no-results">No workers found</div>';
    return;
  }

  workers.forEach((worker) => {
    const card = document.createElement("div");
    card.className = "worker-card";
    card.innerHTML = `
      <div class="worker-card__header">
        <img src="${worker.profile_picture || "https://via.placeholder.com/150"}" alt="${worker.first_name}" class="worker-card__image">
        <div class="worker-card__badges">
          ${worker.is_verified ? '<span class="badge badge-verified">✓ Verified</span>' : ""}
        </div>
      </div>
      <div class="worker-card__content">
        <h3 class="worker-card__name">${worker.first_name} ${worker.last_name}</h3>
        <p class="worker-card__skills">${
          Array.isArray(worker.skills)
            ? worker.skills.join(", ")
            : "Skills pending"
        }</p>
        <p class="worker-card__location">📍 ${worker.location || "Location not specified"}</p>
        <div class="worker-card__rating">
          <span class="rating-stars">${"★".repeat(Math.round(worker.rating))}${"☆".repeat(5 - Math.round(worker.rating))}</span>
          <span class="rating-value">${worker.rating?.toFixed(1) || "N/A"}</span>
        </div>
        ${worker.hourly_rate ? `<p class="worker-card__rate">KES ${worker.hourly_rate}/hour</p>` : ""}
      </div>
      <div class="worker-card__footer">
        <a href="profile.html?id=${worker.id}" class="btn btn-primary btn-small">View Profile</a>
      </div>
    `;
    container.appendChild(card);
  });
}

// ── Update Pagination ────────────────────────────────────────
function updatePagination(pagination) {
  const paginationContainer = document.getElementById("pagination");

  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  if (pagination.pages <= 1) return;

  // Previous button
  if (pagination.page > 1) {
    const prevBtn = document.createElement("a");
    prevBtn.textContent = "← Previous";
    prevBtn.className = "pagination-btn";
    prevBtn.href = `#`;
    prevBtn.onclick = (e) => {
      e.preventDefault();
      loadWorkers({ ...currentFilters, page: pagination.page - 1 });
      window.scrollTo(0, 0);
    };
    paginationContainer.appendChild(prevBtn);
  }

  // Page numbers
  for (let i = 1; i <= pagination.pages; i++) {
    if (i === pagination.page) {
      const span = document.createElement("span");
      span.className = "pagination-current";
      span.textContent = i;
      paginationContainer.appendChild(span);
    } else if (i <= pagination.page + 2 && i >= pagination.page - 2) {
      const link = document.createElement("a");
      link.textContent = i;
      link.className = "pagination-btn";
      link.href = `#`;
      link.onclick = (e) => {
        e.preventDefault();
        loadWorkers({ ...currentFilters, page: i });
        window.scrollTo(0, 0);
      };
      paginationContainer.appendChild(link);
    }
  }

  // Next button
  if (pagination.page < pagination.pages) {
    const nextBtn = document.createElement("a");
    nextBtn.textContent = "Next →";
    nextBtn.className = "pagination-btn";
    nextBtn.href = `#`;
    nextBtn.onclick = (e) => {
      e.preventDefault();
      loadWorkers({ ...currentFilters, page: pagination.page + 1 });
      window.scrollTo(0, 0);
    };
    paginationContainer.appendChild(nextBtn);
  }
}

// ── Search Workers ───────────────────────────────────────────
async function searchWorkers(query) {
  try {
    const params = new URLSearchParams({ q: query });
    const result = await apiFetch(`/workers/search?${params}`);

    if (result.success) {
      displayWorkers(result.data.workers);
    } else {
      showNotification("Search failed", "error");
    }
  } catch (error) {
    console.error("Search error:", error);
    showNotification("Search error", "error");
  }
}

// ── Filter Handler ───────────────────────────────────────────
let currentFilters = {};

function setupFilters() {
  const skillFilter = document.getElementById("skillFilter");
  const locationFilter = document.getElementById("locationFilter");
  const searchInput = document.getElementById("searchInput");

  if (skillFilter) {
    skillFilter.addEventListener("change", (e) => {
      currentFilters.skill = e.target.value;
      loadWorkers(currentFilters);
    });
  }

  if (locationFilter) {
    locationFilter.addEventListener("change", (e) => {
      currentFilters.location = e.target.value;
      loadWorkers(currentFilters);
    });
  }

  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        if (e.target.value.trim()) {
          searchWorkers(e.target.value);
        } else {
          loadWorkers(currentFilters);
        }
      }, 300);
    });
  }
}

// ── Initialize on page load ──────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  console.log("Workers module loaded");
  setupFilters();
  loadWorkers();
});
