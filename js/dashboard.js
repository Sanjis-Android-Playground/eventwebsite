document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initCharts();
    initProfile();
});

// --- LEAFLET MAP ---
function initMap() {
    const mapContainer = document.getElementById('impactMap');
    if(!mapContainer) return;

    // Center on Bangladesh
    const map = L.map('impactMap').setView([23.6850, 90.3563], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Custom Icons
    const protestIcon = L.divIcon({
        className: 'map-marker protest',
        html: '<i class="fas fa-fist-raised" style="color:#F42A41;font-size:20px;"></i>',
        iconSize: [30, 30]
    });

    const victoryIcon = L.divIcon({
        className: 'map-marker victory',
        html: '<i class="fas fa-flag" style="color:#00D9A3;font-size:20px;"></i>',
        iconSize: [30, 30]
    });

    // Markers Data
    const locations = [
        { coords: [23.7340, 90.3928], title: "Shahbag Square", desc: "Epicenter of the movement", type: "protest" },
        { coords: [23.7260, 90.3976], title: "Dhaka University", desc: "Where it all started", type: "protest" },
        { coords: [22.3569, 91.7832], title: "Chittagong", desc: "Massive solidarity marches", type: "victory" },
        { coords: [24.8949, 91.8687], title: "Sylhet", desc: "Key regional protests", type: "protest" },
        { coords: [24.3636, 88.6241], title: "Rajshahi", desc: "Student rallies", type: "victory" },
        { coords: [22.7010, 90.3535], title: "Barisal", desc: "Southern mobilization", type: "protest" }
    ];

    locations.forEach(loc => {
        L.marker(loc.coords, { icon: loc.type === 'protest' ? protestIcon : victoryIcon })
            .addTo(map)
            .bindPopup(`<b>${loc.title}</b><br>${loc.desc}`);
    });
}

// --- CHART.JS ANALYTICS ---
function initCharts() {
    // We need containers for charts. Let's inject them into the Impact section if not present
    const impactSection = document.querySelector('.impact-content');
    if(!impactSection || document.getElementById('ecoChart')) return;

    const chartContainer = document.createElement('div');
    chartContainer.className = 'charts-grid';
    chartContainer.innerHTML = `
        <div class="chart-card">
            <h3>Economic Recovery (Reserves)</h3>
            <canvas id="ecoChart"></canvas>
        </div>
        <div class="chart-card">
            <h3>Public Sentiment</h3>
            <canvas id="sentimentChart"></canvas>
        </div>
    `;
    impactSection.appendChild(chartContainer);

    // Economy Chart
    const ctx1 = document.getElementById('ecoChart').getContext('2d');
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
            datasets: [{
                label: 'Forex Reserves (Billion $)',
                data: [18.2, 19.5, 19.8, 20.1, 20.5, 21.2, 22.0],
                borderColor: '#00D9A3',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(0, 217, 163, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: 'white' } } },
            scales: {
                y: { ticks: { color: '#aaa' }, grid: { color: '#333' } },
                x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }
            }
        }
    });

    // Sentiment Chart
    const ctx2 = document.getElementById('sentimentChart').getContext('2d');
    new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Hopeful', 'Concerned', 'Neutral', 'Excited'],
            datasets: [{
                data: [45, 20, 15, 20],
                backgroundColor: ['#00D9A3', '#F42A41', '#6366F1', '#FFD700'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'right', labels: { color: 'white' } } }
        }
    });
}

// --- PROFILE SYSTEM ---
function initProfile() {
    const btn = document.getElementById('profileBtn');
    const modal = document.getElementById('profileModal');
    const closeBtn = modal?.querySelector('.modal-close');
    
    // Open Profile
    if(btn) btn.onclick = () => {
        modal.classList.add('active');
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    };

    // Close Functions
    window.closeProfile = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close on X button
    if(closeBtn) closeBtn.onclick = window.closeProfile;

    // Close on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            window.closeProfile();
        }
    });
    
    // Load Data
    const user = JSON.parse(localStorage.getItem('bdUser')) || {
        name: 'Guest User',
        xp: 0,
        level: 1,
        badges: []
    };
    
    updateProfileUI(user);
    window.updateProfile = () => {
        const newName = document.getElementById('usernameInput').value;
        if(newName) {
            user.name = newName;
            saveUser(user);
            updateProfileUI(user);
            alert("Profile Saved!");
        }
    };
}

function updateProfileUI(user) {
    document.getElementById('userName').innerText = user.name;
    document.getElementById('userLevel').innerText = user.level;
    document.getElementById('userXP').style.width = `${(user.xp % 100)}%`;
    
    // Calculate total score from games (if needed, pull from localStorage)
    // For now, mockup
    document.getElementById('totalScore').innerText = user.xp * 10; 
}

function saveUser(user) {
    localStorage.setItem('bdUser', JSON.stringify(user));
}

// Global helper to add XP
window.addXP = (amount) => {
    const user = JSON.parse(localStorage.getItem('bdUser')) || { name: 'Guest', xp: 0, level: 1, badges: [] };
    user.xp += amount;
    if(user.xp > user.level * 100) user.level++;
    saveUser(user);
    
    // Show toast
    const toast = document.createElement('div');
    toast.className = 'xp-toast';
    toast.innerHTML = `+${amount} XP`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
};
