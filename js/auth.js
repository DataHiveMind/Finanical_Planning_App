// public/js/auth.js

// Handle Sign Up
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const errorDiv = document.getElementById('signupError');

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to dashboard on successful account creation
                window.location.href = 'dashboard.html';
            } else {
                errorDiv.textContent = data.message || 'An error occurred during sign up.';
            }
        } catch (error) {
            errorDiv.textContent = 'Server error. Please try again later.';
        }
    });
}

// Handle Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to dashboard on successful login
                window.location.href = 'dashboard.html';
            } else {
                errorDiv.textContent = data.message || 'Invalid credentials.';
            }
        } catch (error) {
            errorDiv.textContent = 'Server error. Please try again later.';
        }
    });
}