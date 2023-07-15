"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInitialRandomization = exports.equipmentChancesByLevel = exports.setWeightingAdjustments = exports.setWhitelists = exports.setupBaseWhiteList = exports.arrSum = exports.numList = exports.getCurrentLevelRange = exports.equipmentIdMapper = exports.getTacticalVestValue = exports.getBackPackInternalGridValue = exports.getWeaponWeighting = exports.getHighestScoringAmmoValue = exports.getEquipmentType = exports.getAmmoWeighting = exports.getArmorRating = exports.mergeDeep = exports.isObject = exports.cloneDeep = exports.checkParentRecursive = exports.deDupeArr = void 0;
const config_json_1 = require("../config/config.json");
const deDupeArr = (arr) => [...new Set(arr)];
exports.deDupeArr = deDupeArr;
const checkParentRecursive = (parentId, items, queryIds) => {
    if (queryIds.includes(items?.[parentId]?._id))
        return true;
    if (items?.[parentId]?._parent)
        return false;
    return (0, exports.checkParentRecursive)(items[parentId]._parent, items, queryIds);
};
exports.checkParentRecursive = checkParentRecursive;
const cloneDeep = (objectToClone) => JSON.parse(JSON.stringify(objectToClone));
exports.cloneDeep = cloneDeep;
const isObject = (item) => {
    return (item && typeof item === "object" && !Array.isArray(item));
};
exports.isObject = isObject;
const mergeDeep = (target, ...sources) => {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if ((0, exports.isObject)(target) && (0, exports.isObject)(source)) {
        for (const key in source) {
            if ((0, exports.isObject)(source[key])) {
                if (!target[key])
                    Object.assign(target, { [key]: {} });
                (0, exports.mergeDeep)(target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return (0, exports.mergeDeep)(target, ...sources);
};
exports.mergeDeep = mergeDeep;
const getArmorRating = ({ _props: { RepairCost, Durability, armorClass, armorZone, Name }, _name, _id }) => {
    const repair = RepairCost * 0.01;
    let arm = (armorClass - 2) * 10;
    if (arm < 1)
        arm = 1;
    const armorZoneCoverage = armorZone?.length || 0;
    const durability = Durability * 0.3;
    const total = Math.round(repair + durability + armorZoneCoverage + arm);
    return total || 1;
};
exports.getArmorRating = getArmorRating;
const getAmmoWeighting = ({ _props: { PenetrationPower, Damage, InitialSpeed, ProjectileCount }, _id, _name }) => {
    let penBonus = ((PenetrationPower - 15));
    if (penBonus < 0)
        penBonus = 0;
    const damBonus = (ProjectileCount ? (Damage * (ProjectileCount * 0.6)) : Damage) * 0.1;
    let speedBonus = InitialSpeed > 600 ? 5 : 0;
    return Math.round(penBonus + speedBonus + damBonus) || 1;
};
exports.getAmmoWeighting = getAmmoWeighting;
const getEquipmentType = (id) => {
    const equipmentKeys = Object.keys(exports.equipmentIdMapper);
    for (let index = 0; index < equipmentKeys.length; index++) {
        const key = equipmentKeys[index];
        if (exports.equipmentIdMapper[key].includes(id)) {
            return key;
        }
    }
};
exports.getEquipmentType = getEquipmentType;
const getHighestScoringAmmoValue = (ammoWeight) => {
    let highestValue = 1;
    for (const key in ammoWeight) {
        const value = ammoWeight[key];
        if (value > highestValue) {
            highestValue = value;
        }
    }
    return highestValue;
};
exports.getHighestScoringAmmoValue = getHighestScoringAmmoValue;
const getWeaponWeighting = ({ _props: { Ergonomics, RepairCost, BoltAction, weapClass, weapFireType, RecoilForceUp, ReloadMode } = {}, _name, _id }, highestScoringAmmo) => {
    const ammo = highestScoringAmmo;
    let ergoBonus = Ergonomics * 0.1;
    const lowRecoilBonus = RecoilForceUp < 100 ? 3 : 0;
    const isAutomatic = weapFireType.includes('fullauto') ? 5 : 0;
    const isBoltAction = BoltAction ? -10 : 0;
    const isPistol = weapClass === "pistol" ? -15 : 0;
    const isBarrelLoader = ReloadMode.includes("OnlyBarrel") ? -15 : 0;
    const gunBase = ergoBonus + lowRecoilBonus + isAutomatic + isBoltAction + isPistol + isBarrelLoader;
    const finalValue = Math.round(gunBase + ammo);
    // console.log(_name, _id, " - ", Math.round(gunBase), Math.round(ammo), finalValue)
    return finalValue > 0 ? finalValue : 1;
};
exports.getWeaponWeighting = getWeaponWeighting;
const getBackPackInternalGridValue = ({ _props: { Grids, Weight } = {}, _name, _id }) => {
    let total = 0;
    Grids.forEach(({ _props }) => {
        total += _props?.cellsH * _props?.cellsV;
        // if the backpack can't hold "Items" give it a severe lower ranking
        if (!_props.filters?.[0]?.Filter?.includes("54009119af1c881c07000029")) {
            total = total / 2;
        }
    });
    total = Math.round((total * 0.6) - Weight);
    // console.log(_name, _id, " - ", total)
    return total > 0 ? total : 1;
};
exports.getBackPackInternalGridValue = getBackPackInternalGridValue;
const getTacticalVestValue = (item) => {
    const { Grids } = item._props;
    let spaceTotal = 0;
    Grids.forEach(({ _props }) => {
        spaceTotal += _props?.cellsH * _props?.cellsV;
        // if the backpack can't hold "Items" give it a severe lower ranking
        if (!_props.filters?.[0]?.Filter?.includes("54009119af1c881c07000029")) {
            spaceTotal = spaceTotal / 2;
        }
    });
    spaceTotal = Math.round((spaceTotal * 0.6)) || 1;
    const armorRating = (0, exports.getArmorRating)(item);
    // console.log(item._name, item._id, " - ", armorRating, spaceTotal)
    return armorRating + spaceTotal;
};
exports.getTacticalVestValue = getTacticalVestValue;
exports.equipmentIdMapper = {
    Headwear: ["5a341c4086f77401f2541505"],
    Earpiece: ["5645bcb74bdc2ded0b8b4578"],
    FaceCover: ["5a341c4686f77469e155819e"],
    Eyewear: ["5448e5724bdc2ddf718b4568"],
    ArmBand: ["5b3f15d486f77432d0509248"],
    ArmorVest: ["5448e54d4bdc2dcc718b4568"],
    TacticalVest: ["5448e5284bdc2dcb718b4567"],
    Pockets: ["557596e64bdc2dc2118b4571"],
    Backpack: ["5448e53e4bdc2d60728b4567"],
    SecuredContainer: ["5448bf274bdc2dfc2f8b456a"],
    FirstPrimaryWeapon: [
        "5447b5fc4bdc2d87278b4567",
        "5447b5f14bdc2d61278b4567",
        "5447bedf4bdc2d87278b4568",
        "5447bed64bdc2d97278b4568",
        "5447b6194bdc2d67278b4567",
        "5447b6094bdc2dc3278b4567",
        "5447b5e04bdc2d62278b4567",
        "5447b6254bdc2dc3278b4568",
        "5447bee84bdc2dc3278b4569",
    ],
    // SecondPrimaryWeapon: [],
    Holster: [
        "617f1ef5e8b54b0998387733",
        "5447b5cf4bdc2d65278b4567",
    ],
    Scabbard: ["5447e1d04bdc2dff2f8b4567"],
};
const getCurrentLevelRange = (currentLevel) => {
    for (const key in config_json_1.levelRange) {
        const { min, max } = config_json_1.levelRange[key];
        if (currentLevel >= min && currentLevel <= max)
            return key;
    }
};
exports.getCurrentLevelRange = getCurrentLevelRange;
exports.numList = [1, 2, 3, 4];
const arrSum = (arr) => arr.reduce((a, b) => a + b, 0);
exports.arrSum = arrSum;
const setupBaseWhiteList = () => {
    return exports.numList.map(num => ({
        levelRange: config_json_1.levelRange[num],
        "equipment": {},
        "cartridge": {}
    }));
};
exports.setupBaseWhiteList = setupBaseWhiteList;
const setWhitelists = (items, botConfig, tradersMasterList) => {
    exports.numList.forEach((num, index) => {
        const loyalty = num;
        const whitelist = botConfig.equipment.pmc.whitelist;
        const itemList = [...tradersMasterList[loyalty]];
        itemList.forEach(id => {
            const item = items[id];
            const parent = item._parent;
            const equipmentType = (0, exports.getEquipmentType)(parent);
            switch (true) {
                case items[parent]?._parent === "5422acb9af1c889c16000029": // Ammo Parent
                    const calibre = item._props.Caliber || item._props.ammoCaliber;
                    whitelist[index].cartridge[calibre] =
                        [...whitelist[index].cartridge[calibre] ? whitelist[index].cartridge[calibre] : [], id];
                    break;
                case !!equipmentType:
                    whitelist[index].equipment[equipmentType] =
                        [...whitelist[index].equipment[equipmentType] ? whitelist[index].equipment[equipmentType] : [], id];
                    break;
                default:
                    const otherEquipmentType = items[item._parent]._name;
                    switch (otherEquipmentType) {
                        case "Magazine":
                            whitelist[index].equipment[otherEquipmentType] =
                                [...whitelist[index].equipment[otherEquipmentType] ? whitelist[index].equipment[otherEquipmentType] : [], id];
                            break;
                        default:
                            break;
                    }
                    break;
            }
        });
        if (!!whitelist[index + 1]) {
            whitelist[index + 1].cartridge = { ...whitelist[index].cartridge };
            whitelist[index + 1].equipment = { ...whitelist[index].equipment };
        }
    });
};
exports.setWhitelists = setWhitelists;
const buildEmptyWeightAdjustments = () => {
    return exports.numList.map(num => ({
        levelRange: config_json_1.levelRange[num],
        "equipment": {
            "add": {},
            "edit": {}
        },
        "ammo": {
            "add": {},
            "edit": {}
        }
    }));
};
const setWeightItem = (weight, equipmentType, id, rating) => {
    weight.equipment.edit[equipmentType] = {
        ...weight.equipment.edit[equipmentType] || {},
        [id]: rating
    };
};
const setWeightingAdjustments = (items, botConfig, tradersMasterList, itemCosts) => {
    botConfig.equipment.pmc.weightingAdjustments = buildEmptyWeightAdjustments();
    const weight = botConfig.equipment.pmc.weightingAdjustments;
    const typeSet = new Set([]);
    (0, exports.buildInitialRandomization)(botConfig);
    exports.numList.forEach((num, index) => {
        // console.log("\n")
        const loyalty = num;
        const itemList = [...tradersMasterList[loyalty]];
        // First edit ammo
        itemList.forEach(id => {
            const item = items[id];
            const parent = item._parent;
            // Ammo Parent
            if (parent === "5485a8684bdc2da71d8b4567") {
                const calibre = item._props.Caliber || item._props.ammoCaliber;
                if (!weight[index]?.ammo.edit?.[calibre]) {
                    weight[index].ammo.edit = { ...weight[index].ammo.edit, [calibre]: {} };
                }
                const ammoWeight = (0, exports.getAmmoWeighting)(item);
                weight[index].ammo.edit[calibre] =
                    { ...weight[index].ammo.edit[calibre] || {}, [id]: ammoWeight };
            }
        });
        const combinedWhiteLists = {};
        for (const key of botConfig.equipment.pmc.whitelist) {
            (0, exports.mergeDeep)(combinedWhiteLists, key);
        }
        const combinedWeightingAdjustmentItem = {};
        for (const key of botConfig.equipment.pmc.weightingAdjustments) {
            (0, exports.mergeDeep)(combinedWeightingAdjustmentItem, key);
        }
        (0, exports.mergeDeep)(combinedWeightingAdjustmentItem, weight[index]);
        itemList.forEach(id => {
            const item = items[id];
            const parent = item._parent;
            const equipmentType = (0, exports.getEquipmentType)(parent);
            if (equipmentType) {
                if (!weight[index]?.equipment?.edit?.[equipmentType]) {
                    weight[index].equipment.edit = { ...weight[index].equipment.edit, [equipmentType]: {} };
                }
            }
            switch (equipmentType) {
                case "FirstPrimaryWeapon":
                case "Holster":
                    const calibre = item._props.Caliber || item._props.ammoCaliber;
                    if (combinedWhiteLists?.cartridge?.[calibre]) {
                        const highestScoringAmmo = (0, exports.getHighestScoringAmmoValue)(combinedWeightingAdjustmentItem.ammo.edit[calibre]);
                        const weaponRating = (0, exports.getWeaponWeighting)(item, highestScoringAmmo);
                        setWeightItem(weight[index], equipmentType, id, weaponRating);
                    }
                    break;
                case "Headwear":
                    const coverageBonus = item?._props?.headSegments?.length || 0;
                    const helmetBonus = Math.round(((item?._props?.MaxDurability || 0) * item?._props?.armorClass) / 10);
                    const repairCostBonus = Math.round(item?._props?.RepairCost * 0.005);
                    let rating = coverageBonus + helmetBonus + repairCostBonus;
                    if (rating < 5)
                        rating = 5;
                    setWeightItem(weight[index], equipmentType, id, rating);
                    break;
                case "Earpiece":
                    const ambientVolumeBonus = item?._props?.AmbientVolume * -1;
                    const compressorBonus = Math.round(item?._props?.CompressorVolume * -0.5);
                    setWeightItem(weight[index], equipmentType, id, compressorBonus + ambientVolumeBonus);
                    break;
                case "FaceCover":
                    const faceCoverCost = (itemCosts[id]) * 0.0005;
                    const experience = item._props.LootExperience;
                    setWeightItem(weight[index], equipmentType, id, Math.round(faceCoverCost) + experience);
                    break;
                case "ArmorVest":
                    const armorRating = (0, exports.getArmorRating)(item);
                    setWeightItem(weight[index], equipmentType, id, armorRating);
                    break;
                case "ArmBand":
                    setWeightItem(weight[index], equipmentType, id, 5);
                    break;
                case "SecuredContainer":
                    setWeightItem(weight[index], equipmentType, id, (item._props.sizeWidth * item._props.sizeHeight) || 1);
                    break;
                case "Scabbard":
                    setWeightItem(weight[index], equipmentType, id, (item._props.LootExperience) || 1);
                    break;
                case "Eyewear":
                    setWeightItem(weight[index], equipmentType, id, Math.round(item._props.LootExperience + (item._props.BlindnessProtection * 10)) || 1);
                    break;
                case "Backpack":
                    const backpackInternalGridValue = (0, exports.getBackPackInternalGridValue)(item);
                    setWeightItem(weight[index], equipmentType, id, backpackInternalGridValue);
                    break;
                case "TacticalVest":
                    const tacticalVestWeighting = (0, exports.getTacticalVestValue)(item);
                    setWeightItem(weight[index], equipmentType, id, tacticalVestWeighting);
                    break;
                default:
                    // typeSet.add(items[item._parent]._name)
                    switch (items[item._parent]._name) {
                        case "Magazine":
                            setWeightItem(weight[index], items[item._parent]._name, id, 1);
                            break;
                        default:
                            break;
                    }
                    // console.log()
                    break;
            }
        });
        if (!!weight[index + 1]) {
            weight[index + 1].ammo = { ...weight[index].ammo };
            weight[index + 1].equipment = { ...weight[index].equipment };
        }
    });
    // console.log([...typeSet])
    // console.log(botConfig.equipment.pmc)
};
exports.setWeightingAdjustments = setWeightingAdjustments;
const unfilteredTypes = [
    'PistolGrip', 'Stock', 'Magazine',
    'FlashHider', 'Receiver', 'Gasblock',
    'Silencer', 'MuzzleCombo', 'Barrel',
    'Handguard', 'Ammo', 'AuxiliaryMod',
    'Collimator', 'SpecItem', 'SpecialScope',
    'IronSight', 'ThrowWeap', 'Mount',
    'OpticScope', 'MedKit', 'Drugs',
    'Map', 'Drink', 'Medical',
    'SimpleContainer', 'Food', 'Charge',
    'Flashlight', 'Money', 'Foregrip',
    'TacticalCombo', 'CompactCollimator', 'Compass',
    'PortableRangeFinder', 'CylinderMagazine', 'Bipod',
    'MedicalSupplies', 'KeyMechanical', 'HouseholdGoods',
    'NightVision', 'AssaultScope', 'Tool',
    'Electronics', 'ArmoredEquipment', 'Fuel',
    'AmmoBox', 'LockableContainer', 'Stimulator',
    'Other', 'Jewelry', 'Launcher',
    'Keycard', 'Info', 'ThermalVision'
];
// [{
//     "levelRange": {
//         "min": 1,
//         "max": 100
//     },
//     "equipment": {
//         "Headwear": 40,
//         "Earpiece": 35,
//         "FaceCover": 5,
//         "ArmorVest": 1,
//         "ArmBand": 90,
//         "TacticalVest": 1,
//         "Pockets": 1,
//         "SecuredContainer": 1,
//         "SecondPrimaryWeapon": 1,
//         "Scabbard": 1,
//         "FirstPrimaryWeapon": 80,
//         "Holster": 5,
//         "Eyewear": 5,
//         "Backpack": 35,
//     },
//     "generation": {
//         "drugs": {
//             "min": 0,
//             "max": 1
//         },
//         "grenades": {
//             "min": 0,
//             "max": 1,
//             "whitelist": [
//                 "5710c24ad2720bc3458b45a3",
//                 "58d3db5386f77426186285a0",
//                 "5448be9a4bdc2dfd2f8b456a"
//             ]
//         },
//         "healing": {
//             "min": 0,
//             "max": 1
//         },
//         "looseLoot": {
//             "min": 0,
//             "max": 5
//         },
//         "magazines": {
//             "min": 1,
//             "max": 2
//         },
//         "stims": {
//             "min": 0,
//             "max": 0
//         }
//     },
// }]
// randomisedWeaponModSlots?: string[];
// randomisedArmorSlots?: string[];
// /** Equipment chances */
// equipment?: Record<string, number>;
// /** Modc chances */
// mods?: Record<string, number>;
exports.equipmentChancesByLevel = [
    {
        "Headwear": 80,
        "Earpiece": 40,
        "FaceCover": 5,
        "ArmorVest": 90,
        "ArmBand": 30,
        "TacticalVest": 90,
        "Pockets": 30,
        "SecuredContainer": 80,
        "SecondPrimaryWeapon": 1,
        "Scabbard": 5,
        "FirstPrimaryWeapon": 90,
        "Holster": 1,
        "Eyewear": 5,
        "Backpack": 80,
    },
    {
        "Headwear": 90,
        "Earpiece": 60,
        "FaceCover": 8,
        "ArmorVest": 95,
        "ArmBand": 40,
        "TacticalVest": 95,
        "Pockets": 40,
        "SecuredContainer": 80,
        "SecondPrimaryWeapon": 1,
        "Scabbard": 10,
        "FirstPrimaryWeapon": 95,
        "Holster": 2,
        "Eyewear": 10,
        "Backpack": 90,
    },
    {
        "Headwear": 99,
        "Earpiece": 85,
        "FaceCover": 9,
        "ArmorVest": 98,
        "ArmBand": 50,
        "TacticalVest": 98,
        "Pockets": 60,
        "SecuredContainer": 80,
        "SecondPrimaryWeapon": 1,
        "Scabbard": 20,
        "FirstPrimaryWeapon": 97,
        "Holster": 2,
        "Eyewear": 10,
        "Backpack": 95,
    },
    {
        "Headwear": 100,
        "Earpiece": 90,
        "FaceCover": 9,
        "ArmorVest": 98,
        "ArmBand": 50,
        "TacticalVest": 98,
        "Pockets": 80,
        "SecuredContainer": 80,
        "SecondPrimaryWeapon": 1,
        "Scabbard": 20,
        "FirstPrimaryWeapon": 97,
        "Holster": 10,
        "Eyewear": 25,
        "Backpack": 99,
    }
];
const buildInitialRandomization = (botConfig) => {
    botConfig.equipment.pmc.randomisation = [];
    Object.values(config_json_1.levelRange).forEach((range, key) => botConfig.equipment.pmc.randomisation.push({
        levelRange: range,
        equipment: exports.equipmentChancesByLevel[key],
        // generation: {
        //     "drugs": {
        //         "min": 0,
        //         "max": 1
        //     },
        //     "grenades": {
        //         "min": 0,
        //         "max": 1,
        //         "whitelist": [
        //             "5710c24ad2720bc3458b45a3",
        //             "58d3db5386f77426186285a0",
        //             "5448be9a4bdc2dfd2f8b456a"
        //         ]
        //     },
        //     "healing": {
        //         "min": 0,
        //         "max": 1
        //     },
        //     "looseLoot": {
        //         "min": 0,
        //         "max": 5
        //     },
        //     "magazines": {
        //         "min": 1,
        //         "max": 2
        //     },
        //     "stims": {
        //         "min": 0,
        //         "max": 0
        //     }
        // },
    }));
};
exports.buildInitialRandomization = buildInitialRandomization;
