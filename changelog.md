 ### Server Value Update:

New server values just dropped

# Changelog
### Hideout:
- Fuel consumption rate reduced by ~7%
- Air filter consumption rate reduced by ~16%
- Hideout production time doubled, this is mostly negligible in practice, and will help the server by not calculating floating points as much.
- Scav case time to complete doubled for the same reason.

### Insurance:
- Reduced time-to-check for insurance returns by a factor of 10. In practice this means **insurance will come back faster**.
- Therapist insurance return chance changed from: 95% to 90%
- Prapor insurance return chance changed from 85% to 75%
- Dynamic insurance prices.
     - Prapor price multiplier reduces as LLv increases, Therapist Increases.<br>
### Insurance Price Change Table
| Trader Level | Therapist | Prapor |
|---|---|---|
| LL1 | x20% | x20% |
| LL2 | x23% | x18% |
| LL3 | x25% | x17% |
| LL4 | x30% | x15% |

### Loot:
Small changes to the amount of loot, loot scales with the difficulty of the map.

### Skills and exp:
- You can gain 33% more skill points per raid before skill fatigue sets in. **This means more exp per skill per raid**
- Skill fatigue reset time reduced by 25%

### Raid and Extracting:
- Reduced extra time in raid from 25 minutes to 15 minutes
-  Removed Fence's gift for extracting using co-op. This was causing issues due to the trader being locked.
- Doubled Bloodhound spawn chance across the board.

### Operational Tasks:
- Increased Daily task time limit from 120 minutes to 160 minutes
- Removed "Exctract from [location]" objectives from both daily and weekly tasks.
- Removed Scav operational tasks entirely. This was causing backend issues, again, due to the trader being locked.

### Cases:
- Increased Grenade case size from 64 to 100 squares.
- Increased Weapon Case size from 50 to 84 squares.
- Increased Ammunition Case size from 41 to 64 squares.
- Increased Medicine Case size from 64 to 81 squares.
- Increased THICC Weapon Case size from 90 to 128 squares.
- Increased SICC Case size from 25 to 41 squares.

### Bosses:
- Changed all boss spawns to default rate (temporary)

