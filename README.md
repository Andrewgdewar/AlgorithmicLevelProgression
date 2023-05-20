
# **Dushaoan's MOAR - Ammo Configs**

=== INSTALL STEPS ===

1. Drag and drop this folder into the user/mods folder.
2. Update your mods/order.json so that MOAR is last on the list.
3. Optionally change your configuration (see below configuration options).

4. ???????

5. Profit!!!!

Example order.json with recommended mods:
{
"order": [
"ServerValueModifier",
"SPT-Realism-Mod",
"zPOOP",
"Lua-CustomSpawnPoints",
"Dushaoan-MOAR-1.x.x",
"Dushaoan-MoarAmmoConfigs-1.x.x"
]
}

==== Configuration Options ====


All values are multipliers on default values!

Values of 1 are default. 5 would increase the defaults by 5. 

Below is an example config and how it would effect some 556x45 ammo examples
{
    "Damage": 1,  // Default 1
    "ammoRec": 0.5,  // Default 1
    "ammoAccr": 0.8,  // Default 1
    "PenetrationPower": 1,  // Default 1
    "FragmentationChance": 1,  // Default 1
    "InitialSpeed": 1,  // Default 1
    "SpeedRetardation": 0.5,  // Default 1
    "debug": true // Default false
}


Example output from debug > 

762x39 - mai_ap

Damage: 47 > 47
ammoRec: 10 > 5 // 0.5 reduces debuff recoil by 50%
ammoAccr: -5 > -6  // 0.8 increases buff values by 20%
PenetrationPower: 58 > 58
FragmentationChance: 0.05 > 0.05
InitialSpeed: 730 > 730
SpeedRetardation: 0.000025 > 0.00001 // 0.5 multiplier reduces speed falloff by 50% (rounded)
