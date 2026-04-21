// Handle registration form submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const skills = document.getElementById('skills').value;
        const description = document.getElementById('description').value;

        // For now, just log the data (Later: send to Node.js API)
        console.log({ name, email, phone, skills, description });
        alert("Registration data captured. Backend integration pending.");
        registerForm.reset();
    });
}

// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // For now, just log the data (Later: authenticate via Node.js)
        console.log({ email, password });
        alert("Login attempted. Backend integration pending.");
        loginForm.reset();
    });
}