const mapData = [
    {
        id: 'dhaka',
        name: 'Dhaka',
        x: 48,
        y: 45,
        type: 'capital',
        events: {
            en: 'The epicenter. Protests at Shahbag, Raju Sculpture, and the "Long March to Dhaka" that led to the government\'s resignation.',
            bn: 'আন্দোলনের কেন্দ্রবিন্দু। শাহবাগ এবং রাজু ভাস্কর্যের সমাবেশ এবং "লং মার্চ টু ঢাকা" যা সরকারের পতনের কারণ আন্দোলন।'
        },
        stats: '2M+ Protesters'
    },
    {
        id: 'rangpur',
        name: 'Rangpur',
        x: 35,
        y: 20,
        type: 'major',
        events: {
            en: 'Witnessed the tragic death of Abu Sayed, a student whose standing pose against police fire became a symbol of courage.',
            bn: 'আবু সাঈদের মর্মান্তিক মৃত্যুর সাক্ষী, যার পুলিশের গুলির সামনে দাঁড়ানো সাহসের প্রতীক হয়ে ওঠে।'
        },
        stats: 'Key Flashpoint'
    },
    {
        id: 'chittagong',
        name: 'Chittagong',
        x: 85,
        y: 75,
        type: 'major',
        events: {
            en: 'Massive student gatherings at GEC circle and port city streets, showing unshakeable solidarity.',
            bn: 'জিইসি মোড় এবং বন্দর নগরীর রাস্তায় বিশাল ছাত্র সমাবেশ, যা অবিচল সংহতি প্রদর্শন করে।'
        },
        stats: '500k+ Rally'
    },
    {
        id: 'sylhet',
        name: 'Sylhet',
        x: 80,
        y: 30,
        type: 'major',
        events: {
            en: 'SUST students led fierce protests, turning the campus into a stronghold of resistance.',
            bn: 'শাবিপ্রবি শিক্ষার্থীরা তীব্র আন্দোলনের নেতৃত্ব দেয়, ক্যাম্পাসকে প্রতিরোধের দুর্গে পরিণত করে।'
        },
        stats: 'University Hub'
    },
    {
        id: 'rajshahi',
        name: 'Rajshahi',
        x: 25,
        y: 35,
        type: 'major',
        events: {
            en: 'RU students braved intense opposition to keep the movement alive in the north-west.',
            bn: 'রাবি শিক্ষার্থীরা উত্তর-পশ্চিমে আন্দোলন বাঁচিয়ে রাখতে তীব্র প্রতিরোধের মুখোমুখি হয়।'
        },
        stats: 'Student Stronghold'
    },
    {
        id: 'khulna',
        name: 'Khulna',
        x: 30,
        y: 70,
        type: 'major',
        events: {
            en: 'Industrial belt workers joined students, creating a powerful united front.',
            bn: 'শিল্প এলাকার শ্রমিকরা ছাত্রদের সাথে যোগ দেয়, একটি শক্তিশালী ঐক্যবদ্ধ ফ্রন্ট তৈরি করে।'
        },
        stats: 'United Front'
    },
    {
        id: 'barisal',
        name: 'Barisal',
        x: 45,
        y: 80,
        type: 'major',
        events: {
            en: 'Students controlled key highways, effectively disconnecting the south from the capital.',
            bn: 'শিক্ষার্থীরা প্রধান মহাসড়ক নিয়ন্ত্রণ করে, দক্ষিণকে রাজধানী থেকে বিচ্ছিন্ন করে দেয়।'
        },
        stats: 'Highway Blockade'
    }
];

class NetworkMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.init();
    }

    init() {
        this.render();
        this.addEventListeners();
    }

    render() {
        const mapHTML = `
            <div class="map-network">
                <!-- Connecting Lines (SVG) -->
                <svg class="map-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
                    ${this.generateConnections()}
                </svg>
                
                <!-- City Nodes -->
                ${mapData.map(city => `
                    <div class="city-node ${city.type}" 
                         style="left: ${city.x}%; top: ${city.y}%;"
                         data-id="${city.id}">
                        <div class="node-pulse"></div>
                        <div class="node-point"></div>
                        <span class="city-label">${city.name}</span>
                    </div>
                `).join('')}
                
                <!-- Tooltip Overlay -->
                <div class="map-tooltip" id="mapTooltip">
                    <h3 id="mt-title"></h3>
                    <div class="mt-stats" id="mt-stats"></div>
                    <p id="mt-desc"></p>
                </div>
            </div>
        `;
        this.container.innerHTML = mapHTML;
    }

    generateConnections() {
        // Simple star topology from Dhaka (index 0) to others for the visual network effect
        const dhaka = mapData[0];
        return mapData.slice(1).map(city => `
            <line x1="${dhaka.x}" y1="${dhaka.y}" 
                  x2="${city.x}" y2="${city.y}" 
                  class="connection-line" />
        `).join('');
    }

    addEventListeners() {
        const tooltip = document.getElementById('mapTooltip');
        const nodes = document.querySelectorAll('.city-node');
        const currentLang = localStorage.getItem('lang') || 'en';

        nodes.forEach(node => {
            node.addEventListener('mouseenter', (e) => {
                const id = node.getAttribute('data-id');
                const data = mapData.find(c => c.id === id);
                if (!data) return;

                // Update Content
                const lang = document.body.classList.contains('lang-bn') ? 'bn' : 'en';
                document.getElementById('mt-title').textContent = data.name; // Names are simple enough to keep English or map later
                document.getElementById('mt-stats').textContent = data.stats;
                document.getElementById('mt-desc').textContent = data.events[lang];

                // Position Tooltip
                tooltip.classList.add('active');

                // Simple positioning logic
                // In a real app we might use Popper.js, but simple logic works for this fixed map
                const rect = node.getBoundingClientRect();
                const containerRect = this.container.getBoundingClientRect();

                let left = city.x > 50 ? rect.left - containerRect.left - 200 : rect.left - containerRect.left + 30;
                let top = rect.top - containerRect.top;

                // CSS handles positioning relative to the node usually, but let's just create a fixed overlay for mobile simplicity
                // actually, let's keep it simple: CSS hover effects handled in style.css, 
                // JS just feeds data to a fixed info box or tooltip nearby
            });

            node.addEventListener('click', () => {
                // Mobile tap support
                node.classList.toggle('active');
            });
        });

        // Better Approach: 
        // Delegate hover to update a central "Info Box" or show a floating tooltip
        this.container.addEventListener('mouseover', (e) => {
            const node = e.target.closest('.city-node');
            if (node) {
                const id = node.getAttribute('data-id');
                const data = mapData.find(c => c.id === id);
                this.showTooltip(data, node);
            } else {
                this.hideTooltip();
            }
        });
    }

    showTooltip(data, node) {
        const tooltip = document.getElementById('mapTooltip');
        const lang = document.body.classList.contains('lang-bn') ? 'bn' : 'en';

        document.getElementById('mt-title').textContent = data.name;
        document.getElementById('mt-stats').textContent = data.stats;
        document.getElementById('mt-desc').textContent = data.events[lang];

        // Dynamic positioning
        // x,y are percentages
        tooltip.style.left = data.x > 50 ? (data.x - 30) + '%' : (data.x + 5) + '%';
        tooltip.style.top = (data.y - 10) + '%';

        tooltip.classList.add('active');
    }

    hideTooltip() {
        document.getElementById('mapTooltip').classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Only init if the element exists
    if (document.getElementById('impactMap')) {
        new NetworkMap('impactMap');
    }
});
