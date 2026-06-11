# 🎰 Geaux For The Gold Waffles

A realistic slot machine web/mobile app for your cash raffle group. Built with Firebase for real-time user accounts and balance management.

## Features

✅ **User Accounts** - Login/signup system  
✅ **Realistic Slot Machine** - 3-reel spinning slots  
✅ **Prize Tiers** - Jackpot, Medium, Small, Mini wins  
✅ **Balance Tracking** - Real-time balance updates  
✅ **Admin Dashboard** - Manage buy-ins, view players, configure settings  
✅ **Mobile Responsive** - Works on desktop and mobile  
✅ **Real-time Sync** - Firebase database syncs instantly  

## Prize Tiers

| Prize | Symbol | Amount | Odds |
|-------|--------|--------|------|
| Jackpot | 🏆 | $100 | 5% |
| Medium | 💰 | $25 | 15% |
| Small | 🎰 | $10 | 25% |
| Mini | ⭐ | $5 | 55% |

## How to Deploy

### Step 1: Set up Firebase
1. Go to https://firebase.google.com/
2. Create a new project called "geaux-waffles"
3. Enable Authentication (Email/Password)
4. Enable Realtime Database
5. Copy your Firebase config and replace in `app.js`

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Create new project from this repo
4. Deploy!

### Step 3: Access the App
- **Player Login:** Any username/password
- **Admin Login:** Username: `admin` / Password: `GeauxGold123`

## Admin Features

- Set buy-in amounts per game
- Set spin costs
- View all active players and their balances
- Track wins/losses
- Configure prize odds

## How Players Use It

1. Sign up with username/password
2. Buy in for the game amount
3. Click "SPIN FOR GOLD"
4. Match 3 symbols to win!
5. Request payout via Venmo/CashApp

## Customization

To change prizes, edit the `prizes` object in `app.js`:

```javascript
const prizes = {
    jackpot: { symbol: '🏆', amount: 100, odds: 0.05 },
    medium: { symbol: '💰', amount: 25, odds: 0.15 },
    small: { symbol: '🎰', amount: 10, odds: 0.25 },
    mini: { symbol: '⭐', amount: 5, odds: 0.55 }
};
```

## Support

For issues or customization requests, contact the developer.

---

**Ready to play? Let's go for the gold! 🎰✨**
