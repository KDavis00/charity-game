// Game state
let money = 0;
let totalWater = 0;
let waterPerClick = 1;
let multiplier = 1;
let peopleHelped = 0;
let waterPerSec = 0;
let lastMilestone = 0;

// Achievements system
const achievements = [
    { id: 'first_drop', title: 'First Drop!', description: 'Collect your first liter of water', condition: () => totalWater >= 1, earned: false },
    { id: 'helping_hand', title: 'Helping Hand', description: 'Help your first person', condition: () => peopleHelped >= 1, earned: false },
    { id: 'water_master', title: 'Water Master', description: 'Collect 1,000 liters of water', condition: () => totalWater >= 1000, earned: false },
    { id: 'community_hero', title: 'Community Hero', description: 'Help 100 people', condition: () => peopleHelped >= 100, earned: false },
    { id: 'upgrade_novice', title: 'Upgrade Novice', description: 'Buy your first upgrade', condition: () => clickUpgrades.some(u => u.count > 0), earned: false },
    { id: 'facility_builder', title: 'Facility Builder', description: 'Build your first water facility', condition: () => facilities.some(f => f.count > 0), earned: false },
    { id: 'water_empire', title: 'Water Empire', description: 'Collect 1,000,000 liters of water', condition: () => totalWater >= 1000000, earned: false },
];

// Create achievements container
const achievementsContainer = document.createElement('div');
achievementsContainer.id = 'achievements-container';
document.body.appendChild(achievementsContainer);

// Create achievements badge
const achievementsBadge = document.createElement('div');
achievementsBadge.id = 'achievements-badge';
achievementsBadge.textContent = 'Achievements: 0/' + achievements.length;
document.body.appendChild(achievementsBadge);

// Show achievement popup
function showAchievement(achievement) {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    
    popup.innerHTML = `
        <div class="achievement-icon">🏆</div>
        <div class="achievement-content">
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-description">${achievement.description}</div>
        </div>
    `;
    
    achievementsContainer.appendChild(popup);
    
    // Remove popup after animation
    setTimeout(() => popup.remove(), 4000);
    
    // Update achievements badge
    const earnedCount = achievements.filter(a => a.earned).length;
    achievementsBadge.textContent = `Achievements: ${earnedCount}/${achievements.length}`;
}

// Check for achievements
function checkAchievements() {
    achievements.forEach(achievement => {
        if (!achievement.earned && achievement.condition()) {
            achievement.earned = true;
            showAchievement(achievement);
        }
    });
}

// Water facts array
const waterFacts = [
  "About 71% of the Earth's surface is water, but only 2.5% is fresh.",
  "Drinking clean water prevents dehydration and improves health.",
  "Every person needs about 2–3 liters of water per day.",
  "Water helps in regulating body temperature and transporting nutrients.",
  "Over 785 million people lack access to safe drinking water.",
  "The average water footprint per person is about 3,000 liters/day.",
  "Waterborne diseases are a leading cause of death in developing countries.",
  "Charity: Water helps bring clean water to communities worldwide."
];

// Show water fact popup
function showWaterFact() {
    const factIndex = Math.floor(Math.random() * waterFacts.length);
    const popup = document.createElement('div');
    popup.className = 'fact-popup';
    popup.innerHTML = `<h3>Water Fact!</h3><p>${waterFacts[factIndex]}</p>`;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 4000);
}

// Check for milestones
function checkMilestones() {
    const milestone = Math.floor(totalWater / 1000) * 1000;
    if (milestone > lastMilestone && milestone > 0) {
        lastMilestone = milestone;
        showWaterFact();
    }
}

// Set up tab switching
const tabBtns = document.querySelectorAll('.tab-btn');
const tabs = document.querySelectorAll('.tab');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        tabs.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to clicked button and its corresponding tab
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Create game container
const gameContainer = document.createElement('div');
gameContainer.className = 'game-container';
// Move existing content into container
document.body.insertBefore(gameContainer, document.body.firstChild);

// Get DOM elements
const clickBtn = document.getElementById('click-btn');
const bottleImg = document.getElementById('bottle-img');
const moneyEl = document.getElementById('money');
const waterEl = document.getElementById('total-water');

// Create and show click hint
function showClickHint() {
    const hint = document.createElement('div');
    hint.className = 'click-hint';
    hint.textContent = 'Click the bottle!';
    clickBtn.style.position = 'relative';
    clickBtn.appendChild(hint);
    return hint;
}

// Add hint on page load
const clickHint = showClickHint();
const peopleEl = document.getElementById('people-helped');
const multiplierEl = document.getElementById('multiplier');
const clickAmountEl = document.getElementById('click-amount');
const waterPerSecEl = document.getElementById('water-per-sec');

// Update display
function updateDisplay() {
    // Update values
    moneyEl.textContent = Math.floor(money);
    waterEl.textContent = Math.floor(totalWater);
    peopleEl.textContent = Math.floor(peopleHelped);
    multiplierEl.textContent = multiplier;
    clickAmountEl.textContent = waterPerClick;
    waterPerSecEl.textContent = waterPerSec;
}

// Add touch event handling
function initializeTouchEvents() {
    // Prevent double-tap zoom on mobile
    document.addEventListener('touchend', function(e) {
        e.preventDefault();
    });

    // Add touch feedback for buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.98)';
        });
        button.addEventListener('touchend', function(e) {
            this.style.transform = 'scale(1)';
        });
    });
}

// Initialize touch events
initializeTouchEvents();

// Show floating number
function showFloating(amount, x, y) {
    const floating = document.createElement('div');
    floating.className = 'floating-text';
    floating.textContent = `+${amount}L`;
    floating.style.left = `${x - 20}px`;
    floating.style.top = `${y - 20}px`;
    document.body.appendChild(floating);
    setTimeout(() => floating.remove(), 1000);
}

// Bottle animation
function pulseBottle() {
    bottleImg.style.transform = 'scale(1.2)';
    setTimeout(() => {
        bottleImg.style.transform = 'scale(1)';
    }, 150);
}

// Click handler
clickBtn.addEventListener('click', (event) => {
    // Remove hint on first click
    if (clickHint && clickHint.parentNode) {
        clickHint.remove();
    }
    
    const gained = waterPerClick * multiplier;
    money += gained;
    totalWater += gained;
    peopleHelped = Math.floor(totalWater / 100);
    
    showFloating(gained, event.clientX, event.clientY);
    pulseBottle();
    updateDisplay();
    checkMilestones();
    checkAchievements();
});

// Click upgrades data
const clickUpgrades = [
    { name: "Better Bottles", baseCost: 100, waterPerClick: 1, count: 0 },
    { name: "Water Expertise", baseCost: 500, waterPerClick: 5, count: 0 },
    { name: "Advanced Training", baseCost: 2000, waterPerClick: 15, count: 0 },
    { name: "Master Collector", baseCost: 7500, waterPerClick: 50, count: 0 }
];

// Get upgrades container
const upgradesTab = document.getElementById('upgrades-tab');

// Create upgrade buttons
function createUpgradeButtons() {
    upgradesTab.innerHTML = '';
    clickUpgrades.forEach((upgrade, index) => {
        const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.count));
        
        // Show upgrade if we own it or can afford 75% of its cost
        if (upgrade.count > 0 || money >= cost * 0.75) {
            const div = document.createElement('div');
            div.className = 'facility'; // Using same style as facilities
            div.innerHTML = `
                <h3>${upgrade.name}</h3>
                <p>Level: ${upgrade.count}</p>
                <p>+${upgrade.waterPerClick} water per click</p>
                <p>Cost: $${cost}</p>
                <button class="buy-upgrade" data-index="${index}" ${money < cost ? 'disabled' : ''}>Buy</button>
            `;
            upgradesTab.appendChild(div);
        }
    });

    // Add click handlers to all buy buttons
    document.querySelectorAll('.buy-upgrade').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            buyUpgrade(index);
        });
    });
}

// Buy upgrade function
function buyUpgrade(index) {
    const upgrade = clickUpgrades[index];
    const cost = Math.floor(upgrade.baseCost * Math.pow(1.5, upgrade.count));
    
    if (money >= cost) {
        money -= cost;
        upgrade.count++;
        waterPerClick += upgrade.waterPerClick;
        createUpgradeButtons();
        updateDisplay();
    } else {
        alert('Not enough money!');
    }
}

// Update upgrades list periodically
setInterval(() => {
    createUpgradeButtons();
}, 1000);

// Facilities data
const facilities = [
    { name: "Small Filter", baseCost: 50, waterPerSec: 1, count: 0 },
    { name: "Village Pump", baseCost: 200, waterPerSec: 5, count: 0 },
    { name: "Treatment Plant", baseCost: 1000, waterPerSec: 15, count: 0 },
    { name: "Water Station", baseCost: 5000, waterPerSec: 50, count: 0 }
];

// Get facility container
const facilitiesTab = document.getElementById('facilities-tab');

// Create facility buttons
function createFacilityButtons() {
    facilitiesTab.innerHTML = '';
    facilities.forEach((facility, index) => {
        const cost = Math.floor(facility.baseCost * Math.pow(1.15, facility.count));
        
        // Show facility if we own it or can afford 75% of its cost
        if (facility.count > 0 || money >= cost * 0.75) {
            const div = document.createElement('div');
            div.className = 'facility';
            div.innerHTML = `
                <h3>${facility.name}</h3>
                <p>Owned: ${facility.count}</p>
                <p>Produces: ${facility.waterPerSec} water/s</p>
                <p>Cost: $${cost}</p>
                <button class="buy-facility" data-index="${index}" ${money < cost ? 'disabled' : ''}>Buy</button>
            `;
            facilitiesTab.appendChild(div);
        }
    });

    // Add click handlers to all buy buttons
    document.querySelectorAll('.buy-facility').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            buyFacility(index);
        });
    });
}

// Buy facility function
function buyFacility(index) {
    const facility = facilities[index];
    const cost = Math.floor(facility.baseCost * Math.pow(1.15, facility.count));
    
    if (money >= cost) {
        money -= cost;
        facility.count++;
        updateWaterPerSec();
        createFacilityButtons();
        updateDisplay();
    } else {
        alert('Not enough money!');
    }
}

// Update water per second
function updateWaterPerSec() {
    waterPerSec = facilities.reduce((total, facility) => {
        return total + (facility.waterPerSec * facility.count);
    }, 0) * multiplier;
}

// Auto-generate water every second
setInterval(() => {
    if (waterPerSec > 0) {
        const gained = waterPerSec;
        money += gained;
        totalWater += gained;
        peopleHelped = Math.floor(totalWater / 100);
        updateDisplay();
    }
}, 1000);

// Update facilities list periodically
setInterval(() => {
    createFacilityButtons();
}, 1000);

// Initial setup
createFacilityButtons();
createUpgradeButtons();
updateWaterPerSec();
updateDisplay();