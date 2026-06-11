// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBKwZ8mL9qR2pTxK3vF5nH8jM0pL1sT9uW",
    authDomain: "geaux-waffles.firebaseapp.com",
    databaseURL: "https://geaux-waffles-default-rtdb.firebaseio.com",
    projectId: "geaux-waffles",
    storageBucket: "geaux-waffles.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// Game State
let currentUser = null;
let isAdmin = false;
let currentGame = null;
let isSpinning = false;

// Prize Configuration
const prizes = {
    jackpot: { symbol: '🏆', amount: 100, odds: 0.05 },
    medium: { symbol: '💰', amount: 25, odds: 0.15 },
    small: { symbol: '🎰', amount: 10, odds: 0.25 },
    mini: { symbol: '⭐', amount: 5, odds: 0.55 }
};

const prizeOrder = ['🏆', '💰', '🎰', '⭐'];

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            loadUserData();
            showGameScreen();
        } else {
            showLoginScreen();
        }
    });
});

// LOGIN SCREEN
function showLoginScreen() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="login-screen">
            <h1>🎰 Geaux For The Gold Waffles</h1>
            <input type="text" id="username" placeholder="Username" />
            <input type="password" id="password" placeholder="Password" />
            <button onclick="login()">Play Now</button>
            <button onclick="signup()" style="background: #666; margin-left: 10px; margin-top: 15px;">Sign Up</button>
            <p style="margin-top: 20px; color: #aaa;">Admin? <button onclick="adminLogin()" style="background: #ffd700; color: #1a472a; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">Admin Login</button></p>
        </div>
    `;
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }

    auth.signInWithEmailAndPassword(username + '@waffles.local', password)
        .catch(error => {
            alert('Login failed: ' + error.message);
        });
}

function signup() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }

    auth.createUserWithEmailAndPassword(username + '@waffles.local', password)
        .then(userCredential => {
            const uid = userCredential.user.uid;
            db.ref('users/' + uid).set({
                username: username,
                balance: 0,
                totalWins: 0,
                totalLosses: 0,
                joinedDate: new Date().toISOString()
            });
        })
        .catch(error => {
            alert('Signup failed: ' + error.message);
        });
}

function adminLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'GeauxGold123') {
        isAdmin = true;
        currentUser = { uid: 'admin', email: 'admin@waffles.local' };
        showGameScreen();
    } else {
        alert('Invalid admin credentials');
    }
}

// LOAD USER DATA
function loadUserData() {
    db.ref('users/' + currentUser.uid).once('value', snapshot => {
        if (snapshot.exists()) {
            currentGame = snapshot.val();
        } else {
            currentGame = {
                username: currentUser.email.split('@')[0],
                balance: 0,
                totalWins: 0,
                totalLosses: 0,
                joinedDate: new Date().toISOString()
            };
            db.ref('users/' + currentUser.uid).set(currentGame);
        }
    });
}

// GAME SCREEN
function showGameScreen() {
    const app = document.getElementById('app');
    
    if (isAdmin) {
        app.innerHTML = `
            <div class="container">
                <div class="game-screen">
                    <div class="header">
                        <h1>🎰 Admin Dashboard</h1>
                        <div class="user-info">
                            <p>Admin Mode</p>
                            <button class="logout-btn" onclick="logout()">Logout</button>
                        </div>
                    </div>

                    <div class="admin-dashboard">
                        <h2>Game Settings</h2>
                        <div class="admin-controls">
                            <input type="number" id="buyInAmount" placeholder="Buy-in Amount ($)" value="5" />
                            <input type="number" id="spinCost" placeholder="Cost per Spin ($)" value="1" />
                            <button onclick="updateGameSettings()">Update Settings</button>
                            <button onclick="viewAllPlayers()" style="background: #4CAF50;">View Players</button>
                        </div>
                    </div>

                    <div class="admin-dashboard">
                        <h2>Prize Configuration</h2>
                        <div style="text-align: left;">
                            <p><strong>🏆 Jackpot:</strong> $100 (5% odds)</p>
                            <p><strong>💰 Medium:</strong> $25 (15% odds)</p>
                            <p><strong>🎰 Small:</strong> $10 (25% odds)</p>
                            <p><strong>⭐ Mini:</strong> $5 (55% odds)</p>
                            <p style="margin-top: 15px; color: #aaa;">Prizes are configured in app.js. Edit to customize.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        app.innerHTML = `
            <div class="container">
                <div class="game-screen">
                    <div class="header">
                        <h1>🎰 Geaux For The Gold Waffles</h1>
                        <div class="user-info">
                            <p>Player: <strong>${currentGame?.username || 'Guest'}</strong></p>
                            <p class="balance">Balance: $${currentGame?.balance || 0}</p>
                            <button class="logout-btn" onclick="logout()">Logout</button>
                        </div>
                    </div>

                    <div class="slot-machine">
                        <h2>🎰 Slot Machine</h2>
                        
                        <div class="reels-container">
                            <div class="reel" id="reel1">🏆</div>
                            <div class="reel" id="reel2">💰</div>
                            <div class="reel" id="reel3">🎰</div>
                        </div>

                        <div class="game-controls">
                            <input type="number" id="buyInInput" placeholder="Buy-in Amount ($)" value="5" min="1" />
                            <input type="number" id="spinCostInput" placeholder="Cost per Spin ($)" value="1" min="0.50" />
                            <button class="spin-button" id="spinBtn" onclick="spin()">SPIN FOR GOLD</button>
                        </div>

                        <div id="result" style="display: none;"></div>
                    </div>
                </div>
            </div>
        `;
    }
}

// SPIN LOGIC
function spin() {
    if (isSpinning) return;
    if (!currentGame) return;

    const spinCost = parseFloat(document.getElementById('spinCostInput').value) || 1;
    
    if (currentGame.balance < spinCost) {
        alert('Insufficient balance! Buy in first.');
        return;
    }

    isSpinning = true;
    document.getElementById('spinBtn').disabled = true;

    // Animate reels
    const reels = ['reel1', 'reel2', 'reel3'];
    const spinDuration = 2000;

    reels.forEach((reelId, index) => {
        setTimeout(() => {
            document.getElementById(reelId).classList.add('spinning');
        }, index * 200);
    });

    setTimeout(() => {
        // Deduct spin cost
        currentGame.balance -= spinCost;

        // Get random results
        const result1 = getRandomSymbol();
        const result2 = getRandomSymbol();
        const result3 = getRandomSymbol();

        document.getElementById('reel1').textContent = result1;
        document.getElementById('reel2').textContent = result2;
        document.getElementById('reel3').textContent = result3;

        reels.forEach(reelId => {
            document.getElementById(reelId).classList.remove('spinning');
        });

        // Check for win
        checkWin(result1, result2, result3);
        updateBalance();
        isSpinning = false;
        document.getElementById('spinBtn').disabled = false;
    }, spinDuration);
}

function getRandomSymbol() {
    const rand = Math.random();
    if (rand < 0.05) return prizes.jackpot.symbol;
    if (rand < 0.20) return prizes.medium.symbol;
    if (rand < 0.45) return prizes.small.symbol;
    return prizes.mini.symbol;
}

function checkWin(r1, r2, r3) {
    const resultDiv = document.getElementById('result');
    let isWin = false;
    let winAmount = 0;
    let prizeType = '';

    if (r1 === r2 && r2 === r3) {
        isWin = true;
        if (r1 === '🏆') {
            winAmount = prizes.jackpot.amount;
            prizeType = 'JACKPOT!';
        } else if (r1 === '💰') {
            winAmount = prizes.medium.amount;
            prizeType = 'MEDIUM WIN';
        } else if (r1 === '🎰') {
            winAmount = prizes.small.amount;
            prizeType = 'SMALL WIN';
        } else if (r1 === '⭐') {
            winAmount = prizes.mini.amount;
            prizeType = 'MINI WIN';
        }
    }

    if (isWin) {
        currentGame.balance += winAmount;
        currentGame.totalWins = (currentGame.totalWins || 0) + 1;
        resultDiv.className = 'result win';
        resultDiv.textContent = `🎉 ${prizeType}! You won $${winAmount}!`;
        playSound('win');
    } else {
        currentGame.totalLosses = (currentGame.totalLosses || 0) + 1;
        resultDiv.className = 'result lose';
        resultDiv.textContent = '😢 No match. Try again!';
        playSound('lose');
    }

    resultDiv.style.display = 'block';
    saveUserData();
}

// BALANCE & DATA
function updateBalance() {
    const balanceElement = document.querySelector('.balance');
    if (balanceElement) {
        balanceElement.textContent = `Balance: $${currentGame.balance}`;
    }
}

function saveUserData() {
    if (currentUser && currentUser.uid !== 'admin') {
        db.ref('users/' + currentUser.uid).update({
            balance: currentGame.balance,
            totalWins: currentGame.totalWins,
            totalLosses: currentGame.totalLosses
        });
    }
}

function updateGameSettings() {
    const buyIn = parseFloat(document.getElementById('buyInAmount').value);
    const spinCost = parseFloat(document.getElementById('spinCost').value);
    
    if (buyIn && spinCost) {
        db.ref('settings').set({
            defaultBuyIn: buyIn,
            defaultSpinCost: spinCost,
            updatedAt: new Date().toISOString()
        });
        alert('Settings updated!');
    }
}

function viewAllPlayers() {
    db.ref('users').once('value', snapshot => {
        const users = snapshot.val();
        let playerList = 'Active Players:\n\n';
        
        Object.values(users).forEach(user => {
            playerList += `${user.username}: $${user.balance} (W: ${user.totalWins} L: ${user.totalLosses})\n`;
        });
        
        alert(playerList);
    });
}

function playSound(type) {
    // Sound effects can be added here
    // For now, we'll just use browser notification
    console.log('Sound:', type);
}

// LOGOUT
function logout() {
    auth.signOut().then(() => {
        currentUser = null;
        isAdmin = false;
        currentGame = null;
        showLoginScreen();
    });
}
