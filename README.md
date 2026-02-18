# Eien Owlbear - Owlbear Rodeo Extension

An Owlbear Rodeo extension that integrates with the Eientracker Discord bot system.

## Features

- 📋 Import character sheets (Eientracker JSON format)
- ⚔️ Attack roll system: Roll 2 dice + modifier, count hits where result ≤ gate
- 💾 Auto-saves character to Owlbear's storage
- 📊 Track HP, MP, IP, Armor, and Barrier
- 🎨 Clean, dark-themed UI matching Discord bot aesthetics

## Setup Instructions

### 1. Host the Extension

You need to host these files on a web server. Here are some free options:

**Option A: GitHub Pages (Recommended)**
1. Create a new GitHub repository
2. Upload all these files to the repository
3. Go to Settings → Pages
4. Select "Deploy from branch" and choose your main branch
5. Your extension will be at: `https://[username].github.io/[repo-name]/`

**Option B: Netlify**
1. Drag and drop this folder onto netlify.com/drop
2. Get your URL instantly

**Option C: Local Testing**
1. Install a simple HTTP server: `npm install -g http-server`
2. Run: `http-server` in this directory
3. Use: `http://localhost:8080` (only works on your computer)

### 2. Add to Owlbear Rodeo

1. Open Owlbear Rodeo
2. Click the Extensions icon (puzzle piece)
3. Click "Add Extension"
4. Enter your manifest URL: `https://your-domain.com/manifest.json`
5. The extension will appear in your toolbar!

## Character Format

The extension uses the Eientracker format with 5 stats (FORCE/MIND/GRACE/SOUL/HEART):

```json
{
  "characterName": "Thorin Ironforge",
  "maxHP": 100,
  "maxMP": 50,
  "maxIP": 100,
  "maxArmor": 20,
  "maxBarrier": 15,
  "stats": {
    "force": 10,
    "mind": 8,
    "grace": 12,
    "soul": 6,
    "heart": 10
  }
}
```

**Stats represent dice sizes:**
- `"force": 10` means FORCE = d10
- `"mind": 8` means MIND = d8
- etc.

### Optional fields:
```json
{
  "characterName": "Elara Moonwhisper",
  "HP": 85,
  "MP": 30,
  "IP": 100,
  "Armor": 5,
  "Barrier": 0,
  "maxHP": 100,
  "maxMP": 50,
  "maxIP": 100,
  "maxArmor": 20,
  "maxBarrier": 15,
  "stats": {
    "force": 12,
    "mind": 10,
    "grace": 8,
    "soul": 10,
    "heart": 6
  }
}
```

If you don't provide current values (HP, MP, etc.), they default to max values.

## Attack System

The attack system matches the Eientracker Discord bot's `$a` command:

**Format:** Choose 2 stats, add modifier, count hits where result ≤ gate

**The 5 Stats:**
- 🔴 **FORCE** - Physical power
- 🟣 **MIND** - Mental acuity  
- 🟢 **GRACE** - Agility and finesse
- 🔵 **SOUL** - Willpower and resilience
- 🟡 **HEART** - Charisma and spirit

**How it works:**

1. **Choose two stats** to roll (can be the same stat twice!)
   - FORCE + MIND (roll d10 + d8)
   - FORCE + FORCE (roll d10 + d10)
   - etc.

2. **Add modifier** to both rolls (can be positive or negative)

3. **Compare to gate** - count how many results are ≤ gate

**Example 1: FORCE + GRACE**
- Character has FORCE d10, GRACE d12
- Modifier: +5
- Gate: ≤10

Roll results:
- FORCE d10: [3] +5 = 8 (≤10? ✅)
- GRACE d12: [7] +5 = 12 (≤10? ❌)
- **Result: 1 HIT**

**Example 2: MIND + MIND (double roll)**
- Character has MIND d8
- Modifier: 0
- Gate: ≤1

Roll results:
- MIND d8: [1] +0 = 1 (≤1? ✅)
- MIND d8: [5] +0 = 5 (≤1? ❌)
- **Result: 1 HIT**

**Example 3: High modifier**
- SOUL d6 + HEART d10
- Modifier: -3 (negative helps!)
- Gate: ≤5

Roll results:
- SOUL d6: [4] -3 = 1 (≤5? ✅)
- HEART d10: [8] -3 = 5 (≤5? ✅)
- **Result: 2 HITS**

## Exporting from Discord Bot

To get your character from the Eientracker Discord bot:

1. Use `$view` in Discord to see your character
2. The bot displays your character stats
3. Create a JSON file with the format above
4. Import it into the extension

### Future Integration:
We can add an API endpoint to your Discord bot to allow direct fetching:
```javascript
// Add this to your bot
app.get('/api/character/:userId', async (req, res) => {
    const player = playerData.get(req.params.userId);
    res.json(player);
});
```

Then add a "Fetch from Discord" button in the extension!

## File Structure

```
owlbear-character-tracker/
├── manifest.json       # Extension metadata
├── index.html          # Main UI
├── app.js             # Logic and Owlbear integration
├── style.css          # Styling
├── icon.svg           # Extension icon
└── README.md          # This file
```

## Testing

1. Create a test character file `test-character.json`:
```json
{
  "characterName": "Test Hero",
  "maxHP": 100,
  "maxMP": 50,
  "maxIP": 100,
  "maxArmor": 20,
  "maxBarrier": 15,
  "stats": {
    "force": 10,
    "mind": 8,
    "grace": 12,
    "soul": 6,
    "heart": 10
  }
}
```

2. Import it using the file upload or paste the JSON directly
3. Try an attack:
   - Stat 1: FORCE (d10)
   - Stat 2: MIND (d8)
   - Modifier: 0
   - Gate: 5
4. Check that the result shows hits/misses correctly
5. Verify the notification appears in Owlbear

## Attack Examples

**Easy roll (high gate):**
- FORCE d10 + GRACE d12
- Modifier: 0
- Gate: ≤10
- Most rolls will hit!

**Hard roll (low gate):**
- SOUL d6 + HEART d10
- Modifier: 0
- Gate: ≤2
- Only low rolls will hit

**Using modifier:**
- MIND d8 + MIND d8 (double roll)
- Modifier: -3 (negative helps hit lower gates!)
- Gate: ≤5
- Rolls of 8 or less will become 5 or less

**Different stat combinations:**
- FORCE + FORCE (double strength attack)
- MIND + SOUL (mental/spiritual)
- GRACE + HEART (finesse + charm)
- Mix and match based on what your attack represents!

## Next Steps & Roadmap

### Phase 1: Basic Integration ✅
- [x] Import character from JSON
- [x] Display HP, MP, IP, Armor, Barrier
- [x] Attack roll system (2 dice + modifier, gate check)
- [x] Auto-save to Owlbear storage

### Phase 2: Resource Management
- [ ] Add buttons to modify HP/MP/IP/Armor/Barrier
- [ ] Defend action (add max armor + barrier)
- [ ] Turn/Round actions (reset armor/barrier)
- [ ] Rest action (restore HP/MP to max)

### Phase 3: Discord Bot Integration
- [ ] Add API endpoint to Discord bot
- [ ] "Fetch from Discord" button
- [ ] Real-time sync via WebSockets
- [ ] Authentication/linking

### Phase 4: Advanced Features
- [ ] Import from Google Sheets (like bot does)
- [ ] Clash/encounter tracking
- [ ] Status effects display
- [ ] GM attack damage calculator

### To integrate with your Discord bot:

1. **Add an API endpoint** to your Discord bot that returns character data
2. **Add authentication** so users can link their Discord account
3. **Add a "Fetch from Discord" button** that calls your bot's API
4. **Use WebSockets** for real-time sync between Discord and Owlbear

### Example API integration:

```javascript
async function fetchFromDiscord(userId, characterId) {
    const response = await fetch(`https://your-bot-api.com/character/${userId}`);
    const data = await response.json();
    character = parseCharacter(data);
    displayCharacter();
    saveCharacterToStorage();
}
```

## Support

- Owlbear Rodeo Docs: https://docs.owlbear.rodeo/
- SDK Reference: https://docs.owlbear.rodeo/sdk/

## License

MIT - Feel free to use and modify!
