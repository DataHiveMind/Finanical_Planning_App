// public/js/dashboard.js

// 1. Check Authentication on Load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();

        if (!response.ok || !data.authenticated) {
            // Kick them back to login if they aren't authenticated
            window.location.href = 'index.html';
            return;
        }

        // Display the logged-in user's name
        document.getElementById('userNameDisplay').textContent = data.username;
    } catch (error) {
        window.location.href = 'index.html';
    }
});

// 2. Handle Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = 'index.html';
});

// 3. Handle Form Submission for AI Financial Plan
document.getElementById('financialForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Grab DOM elements
    const generateBtn = document.getElementById('generateBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const aiResults = document.getElementById('aiResults');
    const planContent = document.getElementById('planContent');

    // Collect data
    const payload = {
        monthlyIncome: document.getElementById('monthlyIncome').value,
        currentSavings: document.getElementById('currentSavings').value,
        riskTolerance: document.getElementById('riskTolerance').value,
        financialGoal: document.getElementById('financialGoal').value
    };

    // UI Updates: Disable button, show loading
    generateBtn.disabled = true;
    loadingIndicator.style.display = 'block';
    aiResults.style.display = 'none';
    planContent.innerHTML = '';

    try {
        const response = await fetch('/api/plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            // Format the text using basic regex to convert markdown to HTML for display
            let formattedText = data.plan
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
                .replace(/\*(.*?)\*/g, '<em>$1</em>')             // Italics
                .replace(/\n/g, '<br>');                          // Line breaks

            planContent.innerHTML = formattedText;
            aiResults.style.display = 'block';
        } else {
            planContent.innerHTML = `<span style="color:red;">Error: ${data.message}</span>`;
            aiResults.style.display = 'block';
        }
    } catch (error) {
        planContent.innerHTML = `<span style="color:red;">Server connection failed.</span>`;
        aiResults.style.display = 'block';
    } finally {
        // Reset UI
        generateBtn.disabled = false;
        loadingIndicator.style.display = 'none';
    }
});