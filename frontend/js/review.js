document.addEventListener('DOMContentLoaded', () => {
    const reviewsSection = document.querySelector('.reviews');
    if(reviewsSection) {
        // Placeholder review data (Later fetched from DB)
        const reviews = [
            { user: "Client A", rating: 5, comment: "Excellent work!" },
            { user: "Client B", rating: 4, comment: "Good and fast." }
        ];

        reviewsSection.innerHTML = '';
        reviews.forEach(r => {
            const reviewElem = document.createElement('p');
            reviewElem.textContent = '⭐'.repeat(r.rating) + ` ${r.comment} - ${r.user}`;
            reviewsSection.appendChild(reviewElem);
        });
    }
});