// Placeholder for dynamic worker actions
document.addEventListener('DOMContentLoaded', () => {
    console.log("Worker.js loaded — ready for dynamic data integration.");

    // Example: Add new worker dynamically (for future backend)
    const workerList = document.getElementById('workerList');
    if(workerList) {
        // Sample data
        const newWorker = {
            name: "Alice Otieno",
            skill: "Tailor",
            location: "Nairobi",
            profileLink: "profile.html"
        };

        const card = document.createElement('div');
        card.classList.add('worker-card');
        card.innerHTML = `
            <h2>${newWorker.name}</h2>
            <p>${newWorker.skill} | ${newWorker.location}</p>
            <a href="${newWorker.profileLink}" class="cta-button">View Profile</a>
        `;
        workerList.appendChild(card);
    }
});