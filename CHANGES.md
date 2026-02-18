# Eien Owlbear Extension - Summary of Changes

## What Changed from Generic Version to Eientracker Version

### ✅ Character Data Format
**OLD (D&D stats):**
```json
{
  "name": "Hero",
  "strength": 18,
  "dexterity": 12,
  ...
}
```

**NEW (Eientracker format with 5 stats):**
```json
{
  "characterName": "Hero",
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

### ✅ The 5 Stats System
Each stat is a **dice size** that you roll:
- 🔴 **FORCE** (d10) - Physical power
- 🟣 **MIND** (d8) - Mental acuity
- 🟢 **GRACE** (d12) - Agility and finesse
- 🔵 **SOUL** (d6) - Willpower and resilience
- 🟡 **HEART** (d10) - Charisma and spirit

### ✅ Attack System
**OLD:** Click on stat → roll 2d20 + stat modifier → show total

**NEW:** 
- Select 2 stats from dropdowns (FORCE, MIND, GRACE, SOUL, HEART)
- Can pick the same stat twice (FORCE + FORCE)
- Add modifier to each roll
- Count how many results are ≤ gate
- Display: "X HITS"

**Example:**
```
FORCE d10: [7] +0 = 7 (≤5? ❌)
MIND d8: [3] +0 = 3 (≤5? ✅)
Result: 1 HIT
```

### ✅ UI Changes
**OLD:**
- 6 stat cards (STR, DEX, CON, INT, WIS, CHA)
- Click to roll

**NEW:**
- 5 stat badges showing dice sizes (FORCE d10, MIND d8, etc.)
- 5 resource cards showing HP/MP/IP/Armor/Barrier
- Attack section with stat dropdowns instead of manual dice input
- "Roll Attack" button

### ✅ Display
**OLD:** Showed stat value and modifier (+3, -1, etc.)

**NEW:** Shows current/max for each resource:
- ❤️ HP: 100/100
- 💧 MP: 50/50
- 💰 IP: 100/100
- 🛡️ Armor: 0/20
- ✨ Barrier: 0/15

## Files Modified

1. **app.js**
   - `parseCharacter()` - reads eientracker format
   - `displayCharacter()` - shows HP/MP/IP/Armor/Barrier
   - `performAttack()` - implements gate-based hit counting
   - Removed `calculateModifier()` (not needed)

2. **index.html**
   - Replaced stat cards with resource cards
   - Added attack input section
   - Updated placeholder text

3. **style.css**
   - Styled resource cards with colored borders
   - Added attack input styling
   - Removed stat card hover effects

4. **example-character.json**
   - Updated to eientracker format

5. **README.md**
   - Documented eientracker format
   - Explained attack system
   - Added examples

## What's NOT Implemented Yet

These features are in your Discord bot but not yet in the extension:

- ❌ Resource modification buttons ($hp, $mp, etc.)
- ❌ Defend action ($defend)
- ❌ Turn/Round management ($turn, $round)
- ❌ Rest action ($rest)
- ❌ GM attack ($ga)
- ❌ Clash/encounter system ($clash)
- ❌ Google Sheets import
- ❌ Status effects
- ❌ Database sync

These can be added in future phases!

## How to Use

1. **Export character from Discord:**
   - Use `$view` to see your stats
   - Create a JSON file with HP/MP/IP/Armor/Barrier + the 5 stats (FORCE/MIND/GRACE/SOUL/HEART)

2. **Import to Owlbear:**
   - Paste JSON or upload file
   - Click "Import Character"
   - You'll see your stats displayed as dice (d10, d8, etc.)

3. **Attack:**
   - Select first stat (e.g., FORCE d10)
   - Select second stat (e.g., MIND d8) - or pick the same stat twice!
   - Set modifier (positive or negative)
   - Set gate (target number to roll under/equal to)
   - Click "Roll Attack"
   - See which dice hit (✅) or miss (❌)

4. **Persistence:**
   - Character auto-saves to Owlbear storage
   - Will be there next time you open the extension

**Attack combinations:**
- FORCE + FORCE = powerful physical attack
- MIND + SOUL = mental/spiritual attack
- GRACE + HEART = finesse + charm
- Mix and match based on what makes sense for your action!

## Next Features to Add

**Priority 1:** Resource management buttons
**Priority 2:** Discord bot API integration
**Priority 3:** Real-time sync
**Priority 4:** Advanced features (clash, status effects)
