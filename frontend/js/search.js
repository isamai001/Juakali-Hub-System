function filterWorkers() {
    const input = document.getElementById('search').value.toLowerCase();
    const cards = document.getElementById('workerList').getElementsByClassName('worker-card');

    for (let i = 0; i < cards.length; i++) {
        const text = cards[i].innerText.toLowerCase();
        if (text.includes(input)) {
            cards[i].style.display = '';
        } else {
            cards[i].style.display = 'none';
        }
    }
}