/**
 * ============================================================
 * Jobs Module
 * ============================================================
 * Handles job posting, listing, and applications.
 */

// ── Fetch and Display Jobs ───────────────────────────────────
async function loadJobs(filters = {}) {
  try {
    const {
      category = "",
      location = "",
      status = "open",
      page = 1,
      limit = 12,
    } = filters;

    const params = new URLSearchParams({
      status,
      page,
      limit,
      ...(category && { category }),
      ...(location && { location }),
    });

    const result = await apiFetch(`/jobs?${params}`);

    if (result.success) {
      displayJobs(result.data.jobs);
      updateJobPagination(result.data.pagination);
    } else {
      console.error("Failed to load jobs:", result.error);
      showNotification("Failed to load jobs", "error");
    }
  } catch (error) {
    console.error("Error loading jobs:", error);
    showNotification("Error loading jobs", "error");
  }
}

// ── Display Jobs Grid ────────────────────────────────────────
function displayJobs(jobs) {
  const container = document.getElementById("jobsGrid") || document.getElementById("jobsList");

  if (!container) {
    console.warn("Jobs container not found");
    return;
  }

  container.innerHTML = "";

  if (jobs.length === 0) {
    container.innerHTML = '<div class="no-results">No jobs available</div>';
    return;
  }

  jobs.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <div class="job-card__header">
        <h3 class="job-card__title">${job.title}</h3>
        <span class="job-card__status status-${job.status}">${job.status}</span>
      </div>
      <p class="job-card__description">${job.description.substring(0, 100)}...</p>
      <div class="job-card__meta">
        <span class="job-card__category">🏷️ ${job.category}</span>
        <span class="job-card__location">📍 ${job.location}</span>
      </div>
      ${job.budget ? `<div class="job-card__budget">Budget: KES ${job.budget.toLocaleString()}</div>` : ""}
      <div class="job-card__footer">
        <p class="job-card__client">Posted by ${job.first_name} ${job.last_name}</p>
        <a href="job-detail.html?id=${job.id}" class="btn btn-primary btn-small">View Details</a>
      </div>
    `;
    container.appendChild(card);
  });
}

// ── Update Job Pagination ────────────────────────────────────
function updateJobPagination(pagination) {
  const paginationContainer = document.getElementById("jobPagination");

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
      loadJobs({ ...currentJobFilters, page: pagination.page - 1 });
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
        loadJobs({ ...currentJobFilters, page: i });
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
      loadJobs({ ...currentJobFilters, page: pagination.page + 1 });
      window.scrollTo(0, 0);
    };
    paginationContainer.appendChild(nextBtn);
  }
}

// ── Post New Job ─────────────────────────────────────────────
async function postJob(jobData) {
  try {
    const token = getAuthToken();

    if (!token) {
      showNotification("You must be logged in to post a job", "error");
      window.location.href = "login.html";
      return;
    }

    const result = await apiFetch("/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    });

    if (result.success) {
      showNotification("Job posted successfully!", "success");
      return result.data;
    } else {
      showNotification(result.error || "Failed to post job", "error");
      return null;
    }
  } catch (error) {
    console.error("Error posting job:", error);
    showNotification("Error posting job", "error");
    return null;
  }
}

// ── Apply for Job ────────────────────────────────────────────
async function applyForJob(jobId, message, proposedBudget) {
  try {
    const token = getAuthToken();

    if (!token) {
      showNotification("You must be logged in to apply", "error");
      window.location.href = "login.html";
      return false;
    }

    const result = await apiFetch(`/jobs/${jobId}/apply`, {
      method: "POST",
      body: JSON.stringify({
        message,
        proposed_budget: proposedBudget,
      }),
    });

    if (result.success) {
      showNotification("Application submitted successfully!", "success");
      return true;
    } else {
      showNotification(result.error || "Failed to apply", "error");
      return false;
    }
  } catch (error) {
    console.error("Error applying for job:", error);
    showNotification("Error applying for job", "error");
    return false;
  }
}

// ── Setup Job Post Form ──────────────────────────────────────
function setupJobPostForm() {
  const jobPostForm = document.getElementById("jobPostForm");

  if (!jobPostForm) return;

  jobPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("jobTitle")?.value || "";
    const description = document.getElementById("jobDescription")?.value || "";
    const category = document.getElementById("jobCategory")?.value || "";
    const budget = parseFloat(document.getElementById("jobBudget")?.value || 0);
    const location = document.getElementById("jobLocation")?.value || "";
    const due_date = document.getElementById("jobDueDate")?.value || null;

    if (!title || !description || !category || !location) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    const submitBtn = jobPostForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Posting...";

    const result = await postJob({
      title,
      description,
      category,
      budget,
      location,
      due_date,
    });

    submitBtn.disabled = false;
    submitBtn.textContent = "Post Job";

    if (result) {
      jobPostForm.reset();
      // Redirect to job detail page
      setTimeout(() => {
        window.location.href = `job-detail.html?id=${result.job_id}`;
      }, 1500);
    }
  });
}

// ── Setup Job Apply Form ─────────────────────────────────────
function setupJobApplyForm() {
  const applyForm = document.getElementById("jobApplyForm");

  if (!applyForm) return;

  applyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const jobId = new URLSearchParams(window.location.search).get("id");
    const message = document.getElementById("applyMessage")?.value || "";
    const proposedBudget = parseFloat(document.getElementById("proposedBudget")?.value || 0);

    const submitBtn = applyForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Applying...";

    const success = await applyForJob(jobId, message, proposedBudget);

    submitBtn.disabled = false;
    submitBtn.textContent = "Apply Now";

    if (success) {
      applyForm.reset();
    }
  });
}

// ── Filter Handler ───────────────────────────────────────────
let currentJobFilters = { status: "open" };

function setupJobFilters() {
  const categoryFilter = document.getElementById("categoryFilter");
  const locationFilter = document.getElementById("locationFilter");
  const statusFilter = document.getElementById("statusFilter");

  if (categoryFilter) {
    categoryFilter.addEventListener("change", (e) => {
      currentJobFilters.category = e.target.value;
      loadJobs(currentJobFilters);
    });
  }

  if (locationFilter) {
    locationFilter.addEventListener("change", (e) => {
      currentJobFilters.location = e.target.value;
      loadJobs(currentJobFilters);
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", (e) => {
      currentJobFilters.status = e.target.value;
      loadJobs(currentJobFilters);
    });
  }
}

// ── Initialize on page load ──────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  console.log("Jobs module loaded");
  setupJobFilters();
  setupJobPostForm();
  setupJobApplyForm();
  loadJobs(currentJobFilters);
});
