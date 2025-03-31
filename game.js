// Game variables and setup
let cookies = 0;
let cookiesPerClick = 1;
let upgradeCost = 10;
let autoClickers = 0;
let autoClickerCost = 50;
let totalCookies = 0;
let totalClicks = 0;
let clickUpgrades = 0;
let autoClickersBought = 0;
let inventory = {};
let earnedAchievements = new Set();
let deferredPrompt;

// Inventory power-ups
let inventoryEffects = {
    'Golden Cookie': {
        icon: '🍯',
        unlocked: false,
        active: false,
        cooldown: false,
        unlockCheck: () => totalCookies >= 500,
        activate: function () {
            if (this.active || this.cooldown) return;
            this.active = true;
            this.cooldown = true;
            cookiesPerClick *= 2;
            triggerFlash('rgba(255, 215, 0, 0.5)');
            displayMessage("🍯 Golden Cookie activated! Double cookies for 30s!");
            setTimeout(() => {
                cookiesPerClick /= 2;
                this.active = false;
                displayMessage("⏳ Golden Cookie boost ended!");
            }, 30000);
            setTimeout(() => {
                this.cooldown = false;
                updateInventory();
            }, 60000);
            updateInventory();
        }
    },
    'Mystery Box': {
        icon: '🎁',
        unlocked: false,
        active: false,
        cooldown: false,
        unlockCheck: () => totalCookies >= 1000,
        activate: function () {
            if (this.cooldown) return;
            this.cooldown = true;
            triggerFlash('rgba(128, 0, 128, 0.5)');
            const bonus = Math.random() < 0.5 ? 50 : 1;
            if (bonus === 50) {
                cookies += 50;
                totalCookies += 50;
                displayMessage("🎁 Mystery Box: You got 50 bonus cookies!");
            } else {
                cookiesPerClick += 1;
                displayMessage("🎁 Mystery Box: Click power +1!");
            }
            setTimeout(() => {
                this.cooldown = false;
                updateInventory();
            }, 45000);
            updateUI();
            updateStats();
            saveGame();
            updateInventory();
        }
    },
    'Auto Clicker Pro': {
        icon: '🧤',
        unlocked: false,
        active: false,
        cooldown: false,
        unlockCheck: () => autoClickersBought >= 10,
        activate: function () {
            if (this.active || this.cooldown) return;
            this.active = true;
            this.cooldown = true;
            triggerFlash('rgba(0, 200, 255, 0.5)');
            autoClickers *= 2;
            displayMessage("🧤 Auto Clicker Pro: Auto speed 2x for 20s!");
            setTimeout(() => {
                autoClickers /= 2;
                this.active = false;
                displayMessage("🧤 Auto Clicker Pro ended.");
            }, 20000);
            setTimeout(() => {
                this.cooldown = false;
                updateInventory();
            }, 40000);
            updateInventory();
        }
    }
};

const shopItems = {
    'Golden Cookie': { icon: '🍯', cost: 300 },
    'Mystery Box': { icon: '🎁', cost: 500 },
    'Auto Clicker Pro': { icon: '🧤', cost: 750 }
};

function updateShop() {
    const shopEl = document.getElementById('shop');
    shopEl.innerHTML = '';
    
    for (let item in shopItems) {
        const data = shopItems[item];
        const btn = document.createElement('button');
    
        if (inventoryEffects[item]?.unlocked) {
            btn.className = 'btn btn-outline-success disabled';
            btn.innerHTML = `${data.icon} ${item} ✅ Purchased`;
            btn.disabled = true;
        } else {
            btn.className = 'btn btn-outline-primary';
            btn.innerHTML = `${data.icon} ${item} - ${data.cost} 🍪`;
            btn.onclick = () => {
                if (cookies >= data.cost) {
                    cookies -= data.cost;
                    inventoryEffects[item].unlocked = true;
                    inventory[item] = true;
                    displayMessage(`🛒 Purchased: ${item}!`);
                    updateInventory();
                    updateShop();
                    updateUI();
                    updateStats();
                    saveGame();
                } else {
                    alert("Not enough cookies!");
                }
            };
        }
    
        shopEl.appendChild(btn);
    }
    
}



function triggerFlash(color = 'rgba(255, 230, 0, 0.5)') {
    const flash = document.getElementById('powerup-flash');
    flash.style.backgroundColor = color;
    flash.classList.add('active');
    setTimeout(() => {
        flash.classList.remove('active');
    }, 400);
}

// DOM Elements
const scoreEl = document.getElementById('score');
const cookieEl = document.getElementById('cookie');
const clickSound = document.getElementById('clickSound');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const darkToggle = document.getElementById('darkModeToggle');

const stats = {
    totalCookiesEl: document.getElementById('totalCookies'),
    totalClicksEl: document.getElementById('totalClicks'),
    clickUpgradesEl: document.getElementById('clickUpgrades'),
    autoClickersEl: document.getElementById('autoClickers'),
};

// Utility Functions
function updateStats() {
    stats.totalCookiesEl.textContent = totalCookies;
    stats.totalClicksEl.textContent = totalClicks;
    stats.clickUpgradesEl.textContent = clickUpgrades;
    stats.autoClickersEl.textContent = autoClickersBought;
}

function updateUI() {
    scoreEl.textContent = `Cookies: ${cookies}`;
    document.querySelectorAll('.btn-upgrade')[0].textContent = `Upgrade Click (+1) - Cost: ${upgradeCost}`;
    document.querySelectorAll('.btn-upgrade')[1].textContent = `Buy Auto-Clicker (1/sec) - Cost: ${autoClickerCost}`;
}

function updateInventory() {
    const invEl = document.getElementById('inventory');
    invEl.innerHTML = '';
    for (let item in inventory) {
        const effect = inventoryEffects[item];
        const div = document.createElement('div');
        div.className = 'inventory-item';
        div.innerHTML = `<span style="font-size: 2rem;">${effect.icon}</span>`;
        div.title = effect.cooldown ? `${item} is cooling down...` : `Click to activate ${item}`;
        div.style.cursor = effect.cooldown ? 'not-allowed' : 'pointer';
        div.style.opacity = effect.cooldown ? '0.5' : '1';
        div.onclick = () => {
            if (!effect.cooldown && effect.activate) {
                effect.activate();
            }
        };
        invEl.appendChild(div);
    }
}

function displayMessage(msg) {
    document.getElementById('achievements').textContent = msg;
}

function saveGame() {
    localStorage.setItem('cookies', cookies);
    localStorage.setItem('cookiesPerClick', cookiesPerClick);
    localStorage.setItem('upgradeCost', upgradeCost);
    localStorage.setItem('autoClickers', autoClickers);
    localStorage.setItem('autoClickerCost', autoClickerCost);
    localStorage.setItem('totalCookies', totalCookies);
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('clickUpgrades', clickUpgrades);
    localStorage.setItem('autoClickersBought', autoClickersBought);
}

// Game Logic
function buyClickUpgrade() {
    if (cookies >= upgradeCost) {
        cookies -= upgradeCost;
        cookiesPerClick += 1;
        upgradeCost = Math.floor(upgradeCost * 1.5);
        clickUpgrades += 1;
        updateUI();
        updateStats();
        saveGame();
        checkAchievements();
    } else {
        alert("Not enough cookies!");
    }
}

function buyAutoClicker() {
    if (cookies >= autoClickerCost) {
        cookies -= autoClickerCost;
        autoClickers += 1;
        autoClickersBought += 1;
        autoClickerCost = Math.floor(autoClickerCost * 1.7);
        updateUI();
        updateStats();
        saveGame();
        checkAchievements();
    } else {
        alert("Not enough cookies!");
    }
}

function resetGame() {
    if (confirm("Reset your progress?")) {
        cookies = 0;
        cookiesPerClick = 1;
        upgradeCost = 10;
        autoClickers = 0;
        autoClickerCost = 50;
        totalCookies = 0;
        totalClicks = 0;
        clickUpgrades = 0;
        autoClickersBought = 0;
        inventory = {};
        for (let item in inventoryEffects) {
            inventoryEffects[item].unlocked = false;
            inventoryEffects[item].active = false;
            inventoryEffects[item].cooldown = false;
        }
        earnedAchievements.clear();
        localStorage.clear();
        updateUI();
        updateStats();
        updateInventory();
        updateShop(); // ← add this too
        
        displayMessage('');
    }
}

function checkAchievements() {
    if (totalCookies >= 100 && !earnedAchievements.has('sweet')) {
        earnedAchievements.add('sweet');
        displayMessage('🏆 Achievement Unlocked: Sweet Tooth!');
    } else if (clickUpgrades >= 10 && !earnedAchievements.has('clicker')) {
        earnedAchievements.add('clicker');
        displayMessage('🏆 Achievement Unlocked: Click Master!');
    } else if (autoClickersBought >= 5 && !earnedAchievements.has('lazy')) {
        earnedAchievements.add('lazy');
        displayMessage('🏆 Achievement Unlocked: Lazy Genius!');
    }
    
    for (let item in inventoryEffects) {
        if (!inventoryEffects[item].unlocked && inventoryEffects[item].unlockCheck()) {
            inventoryEffects[item].unlocked = true;
            inventory[item] = true;
            updateInventory();
            displayMessage(`🎒 New Item Unlocked: ${item}!`);
        }
    }
}

// Events
cookieEl.addEventListener('click', () => {
    cookies += cookiesPerClick;
    totalCookies += cookiesPerClick;
    totalClicks += 1;
    updateUI();
    updateStats();
    saveGame();
    checkAchievements();
    clickSound.currentTime = 0;
    clickSound.play();
});

musicToggle.addEventListener('change', () => {
    const isOn = musicToggle.checked;
    clickSound.muted = !isOn;
    bgMusic.muted = !isOn;
    localStorage.setItem('audio', isOn ? 'on' : 'off');
    if (isOn && bgMusic.paused) bgMusic.play().catch(() => {});
    else bgMusic.pause();
});

darkToggle.addEventListener('change', () => {
    applyTheme(darkToggle.checked ? 'dark' : 'light');
});

// Theme + Install
function applyTheme(mode) {
    document.body.classList.toggle('dark-mode', mode === 'dark');
    darkToggle.checked = mode === 'dark';
    localStorage.setItem('theme', mode);
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.createElement('button');
    installBtn.textContent = "📲 Install Cookie Clicker";
    installBtn.className = "btn btn-warning btn-sm mt-3";
    document.querySelector(".container").appendChild(installBtn);
    installBtn.addEventListener('click', () => {
        installBtn.remove();
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choice => {
            if (choice.outcome === 'accepted') console.log("App installed");
            deferredPrompt = null;
        });
    });
});

// Initial Load
window.onload = () => {
    cookies = parseInt(localStorage.getItem('cookies')) || 0;
    cookiesPerClick = parseInt(localStorage.getItem('cookiesPerClick')) || 1;
    upgradeCost = parseInt(localStorage.getItem('upgradeCost')) || 10;
    autoClickers = parseInt(localStorage.getItem('autoClickers')) || 0;
    autoClickerCost = parseInt(localStorage.getItem('autoClickerCost')) || 50;
    totalCookies = parseInt(localStorage.getItem('totalCookies')) || 0;
    totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
    clickUpgrades = parseInt(localStorage.getItem('clickUpgrades')) || 0;
    autoClickersBought = parseInt(localStorage.getItem('autoClickersBought')) || 0;
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    const savedAudio = localStorage.getItem('audio') || 'on';
    musicToggle.checked = savedAudio === 'on';
    clickSound.muted = savedAudio !== 'on';
    bgMusic.muted = savedAudio !== 'on';
    if (savedAudio === 'on') {
        bgMusic.play().catch(() => {});
    }
    
    updateUI();
    updateStats();
    updateInventory();
    updateShop(); // ← add this
    document.getElementById('loader').style.display = 'none';
    
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js').then(() => {
            console.log("✅ Service worker registered");
        });
    }
    
    
};

// Auto click loop
setInterval(() => {
    if (autoClickers > 0) {
        cookies += autoClickers;
        totalCookies += autoClickers;
        updateUI();
        updateStats();
        saveGame();
        checkAchievements();
    }
}, 1000);
