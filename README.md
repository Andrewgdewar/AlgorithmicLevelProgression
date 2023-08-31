
# **DewardianDev's AlgorithmicLevelProgression**

=== INSTALL STEPS ===

1. Drag and drop this folder into the user/mods folder.
2. Update your mods/order.json so that this is last on the list.
3. Optionally change your configuration (see below configuration options).

4. ???????

5. Profit!!!!

Example order.json with recommended mods:
{
"order": [
"ServerValueModifier",
"zPOOP",
"Lua-CustomSpawnPoints",
"DewardianDev-XXXX-1.x.x",
"DewardianDev-AlgorithmicLevelProgression-1.x.x"
]
}



==== Configuration Options ====

    // Turn on and off the pmc bot adjusted equipment
    "enableProgressionChanges": true,

    // Turn on and off the pmc bot adjusted levels
    "enableLevelChanges": true,

    // PMCS will wear level appropriate clothing (IE level 34 will wear plaid)
    "leveledClothing": true,


    // These two "shift" items that would be unlocked at a certain loyalty level to a later level
    // For example if you needed to finish a quest at tier 2 traders to unlock some ammo, it would be shifted to tier 3
 
    "questUnlockedItemsShifted": true,

    // This is much the same as the above, this shifts traded items
    // For example if you could trade for some armor at tier 2, it would be shifted to tier 3 
    "tradedItemsShifted": true,

    // In general, turning the above off can make bots create weird meta builds and in general makes pmcs better equiped sooner. 

    // Allows bots to use items from custom traders like Priscillu
    "addCustomTraders": false,

    // This dictates at what level bots obtain trader tiers. 
    // 1 - 14 for example are for tier 1 traders
    // NOTE: These cannot overlap or have gaps: 1-14, 15-24, 25-39, 40-100

    "levelRange": {
        "1": {
            "min": 1,
            "max": 14
        },
        "2": {
            "min": 15,
            "max": 24
        },
        "3": {
            "min": 25,
            "max": 39
        },
        "4": {
            "min": 40,
            "max": 100
        }
    },

    // This is the ratioed weighting of bot tiers per your level. 
    // For example, if you were level 5, as per above, between 1 - 14, would put you at tier "1"
    // therefor you would have a weighting of pmcs of:10,5,2,1 
    // In this example, it is far more likely to have low tier 1 bots (10x) then tier 4 for example
    // THE BELOW SETTINGS ARE TO SIMULATE AN EARLY WIPE EXPERIENCE
    // AS YOU LEVEL, THE WIPE AND PLAYER DISTRIBUTION PROGRESSES

    "botRangeAtLevel": {
        "1": [
            10,
            5,
            2,
            1
        ],
        "2": [
            10,
            13,
            7,
            4
        ],
        "3": [
            8,
            10,
            11,
            4
        ],
        "4": [
            8,
            10,
            10,
            7
        ]
    },
    // Just keep this off
    "debug": false