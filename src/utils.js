"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInitialRandomization = exports.buildOutModsObject = exports.setWeightingAdjustments = exports.moneyParent = exports.modParent = exports.medsParent = exports.keyParent = exports.barterParent = exports.magParent = exports.AmmoParent = exports.setWhitelists = exports.setupBaseWhiteList = exports.arrSum = exports.numList = exports.getCurrentLevelRange = exports.equipmentIdMapper = exports.getTacticalVestValue = exports.getBackPackInternalGridValue = exports.getWeaponWeighting = exports.getHighestScoringAmmoValue = exports.getEquipmentType = exports.getAmmoWeighting = exports.getArmorRating = exports.mergeDeep = exports.isObject = exports.cloneDeep = exports.checkParentRecursive = exports.deDupeArr = exports.reduceAmmoChancesTo1 = exports.reduceEquipmentChancesTo1 = void 0;
const config_json_1 = require("../config/config.json");
const reduceEquipmentChancesTo1 = (inventory) => {
    Object.keys(inventory.equipment).forEach((equipType => {
        Object.keys(inventory.equipment[equipType]).forEach(id => {
            if (inventory.equipment[equipType][id] !== 0) {
                inventory.equipment[equipType][id] = 1;
            }
        });
    }));
};
exports.reduceEquipmentChancesTo1 = reduceEquipmentChancesTo1;
const reduceAmmoChancesTo1 = (inventory) => {
    Object.keys(inventory.Ammo).forEach((caliber => {
        Object.keys(inventory.Ammo[caliber]).forEach(id => {
            if (inventory.Ammo[caliber][id] !== 0) {
                inventory.Ammo[caliber][id] = 1;
            }
        });
    }));
};
exports.reduceAmmoChancesTo1 = reduceAmmoChancesTo1;
const deDupeArr = (arr) => [...new Set(arr)];
exports.deDupeArr = deDupeArr;
const checkParentRecursive = (parentId, items, queryIds) => {
    if (queryIds.includes(parentId))
        return true;
    if (!items?.[parentId]?._parent)
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
    return total || 3;
};
exports.getArmorRating = getArmorRating;
const getAmmoWeighting = ({ _props: { PenetrationPower, Damage, InitialSpeed, ProjectileCount }, _id, _name }) => {
    let penBonus = ((PenetrationPower - 15) * 3);
    if (penBonus < 0)
        penBonus = 0;
    const damBonus = (ProjectileCount ? (Damage * (ProjectileCount * 0.6)) : Damage) * 0.1;
    let speedBonus = InitialSpeed > 600 ? 5 : 0;
    return Math.round(penBonus + speedBonus + damBonus) || 3;
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
    let ammo = highestScoringAmmo;
    let ergoBonus = Ergonomics * 0.1;
    const lowRecoilBonus = RecoilForceUp < 100 ? 3 : 0;
    const isAutomatic = weapFireType.includes('fullauto') ? 5 : 0;
    const isBoltAction = BoltAction ? -10 : 0;
    const isPistol = weapClass === "pistol" ? -15 : 0;
    const isBarrelLoader = ReloadMode.includes("OnlyBarrel") ? -15 : 0;
    const gunBase = ergoBonus + lowRecoilBonus + isAutomatic + isBoltAction + isPistol + isBarrelLoader;
    if (BoltAction || weapClass === "pistol")
        ammo = ammo / 2;
    if (ReloadMode.includes("OnlyBarrel"))
        ammo = ammo / 3;
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
        if (_props.filters?.[0]?.Filter?.length && !_props.filters?.[0]?.Filter?.includes("54009119af1c881c07000029")) {
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
        spaceTotal = spaceTotal + (_props?.cellsH * _props?.cellsV);
    });
    spaceTotal = Math.round((spaceTotal * 0.6)) || 3;
    const armorRating = (0, exports.getArmorRating)(item);
    // console.log(item._name, item._id, " - ", armorRating > 5 ? armorRating + spaceTotal : spaceTotal * 4)
    return armorRating || spaceTotal;
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
    Magazine: [
        "5448bc234bdc2d3c308b4569",
        "610720f290b75a49ff2e5e25"
    ],
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
                    // const otherEquipmentType = items[item._parent]._name
                    // if (!checkParentRecursive(parent, items, [AmmoParent, modParent])) {
                    //     whitelist[index].equipment["Other"] =
                    //         [...whitelist[index].equipment["Other"] ? whitelist[index].equipment["Other"] : [], id]
                    // }
                    //     switch (otherEquipmentType) {
                    //         case "Magazine":
                    //             whitelist[index].equipment[otherEquipmentType] =
                    //                 [...whitelist[index].equipment[otherEquipmentType] ? whitelist[index].equipment[otherEquipmentType] : [], id]
                    //             break;
                    //         default:
                    //             break;
                    //     }
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
exports.AmmoParent = "5485a8684bdc2da71d8b4567";
exports.magParent = "5448bc234bdc2d3c308b4569";
exports.barterParent = "5448eb774bdc2d0a728b4567";
exports.keyParent = "543be5e94bdc2df1348b4568";
exports.medsParent = "543be5664bdc2dd4348b4569";
exports.modParent = "5448fe124bdc2da5018b4567";
exports.moneyParent = "543be5dd4bdc2deb348b4569";
const setWeightingAdjustments = (items, botConfig, tradersMasterList, itemCosts) => {
    botConfig.equipment.pmc.weightingAdjustments = buildEmptyWeightAdjustments();
    const weight = botConfig.equipment.pmc.weightingAdjustments;
    const additionalChancePerItem = 5;
    exports.numList.forEach((num, index) => {
        const loyalty = num;
        const itemList = [...tradersMasterList[loyalty]];
        // First edit ammo
        itemList.forEach(id => {
            const item = items[id];
            const parent = item._parent;
            // Ammo Parent
            if ((0, exports.checkParentRecursive)(parent, items, [exports.AmmoParent])) {
                const calibre = item._props.Caliber || item._props.ammoCaliber;
                if (!weight[index]?.ammo.edit?.[calibre]) {
                    weight[index].ammo.edit = { ...weight[index].ammo.edit, [calibre]: {} };
                }
                const ammoWeight = (0, exports.getAmmoWeighting)(item);
                weight[index].ammo.edit[calibre] =
                    { ...weight[index].ammo.edit[calibre] || {}, [id]: ammoWeight };
            }
        });
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
                    const highestScoringAmmo = (0, exports.getHighestScoringAmmoValue)(combinedWeightingAdjustmentItem.ammo.edit[calibre]);
                    const weaponRating = (0, exports.getWeaponWeighting)(item, highestScoringAmmo);
                    setWeightItem(weight[index], equipmentType, id, weaponRating * additionalChancePerItem);
                    // }
                    break;
                case "Headwear":
                    // TODO: Make it so earphones are prioritized
                    const coverageBonus = item?._props?.headSegments?.length || 0;
                    const helmetBonus = Math.round(((item?._props?.MaxDurability || 0) * item?._props?.armorClass) / 10);
                    const repairCostBonus = Math.round(item?._props?.RepairCost * 0.005);
                    let rating = coverageBonus + helmetBonus + repairCostBonus;
                    if (rating < 5)
                        rating = 5;
                    setWeightItem(weight[index], equipmentType, id, rating * additionalChancePerItem);
                    break;
                case "Earpiece":
                    const ambientVolumeBonus = item?._props?.AmbientVolume * -1;
                    const compressorBonus = Math.round(item?._props?.CompressorVolume * -0.5);
                    setWeightItem(weight[index], equipmentType, id, (compressorBonus + ambientVolumeBonus) * additionalChancePerItem);
                    break;
                case "FaceCover":
                    const faceCoverCost = ((itemCosts[id]) * 0.0005) || 1;
                    const experience = item._props.LootExperience;
                    setWeightItem(weight[index], equipmentType, id, (Math.round(faceCoverCost) + experience) * additionalChancePerItem);
                    break;
                case "ArmorVest":
                    const armorRating = (0, exports.getArmorRating)(item);
                    setWeightItem(weight[index], equipmentType, id, armorRating * additionalChancePerItem);
                    break;
                case "ArmBand":
                    setWeightItem(weight[index], equipmentType, id, 5 * additionalChancePerItem);
                    break;
                case "SecuredContainer":
                    setWeightItem(weight[index], equipmentType, id, ((item._props.sizeWidth * item._props.sizeHeight) || 3) * additionalChancePerItem);
                    break;
                case "Scabbard":
                    setWeightItem(weight[index], equipmentType, id, ((item._props.LootExperience) || 3) * additionalChancePerItem);
                    break;
                case "Eyewear":
                    setWeightItem(weight[index], equipmentType, id, (Math.round(item._props.LootExperience + (item._props.BlindnessProtection * 10)) || 3) * additionalChancePerItem);
                    break;
                case "Backpack":
                    const backpackInternalGridValue = (0, exports.getBackPackInternalGridValue)(item);
                    setWeightItem(weight[index], equipmentType, id, backpackInternalGridValue * additionalChancePerItem);
                    break;
                case "TacticalVest":
                    const tacticalVestWeighting = (0, exports.getTacticalVestValue)(item);
                    setWeightItem(weight[index], equipmentType, id, tacticalVestWeighting * additionalChancePerItem);
                    break;
                case "Magazine":
                default:
                    break;
            }
        });
        // if (!!weight[index + 1]) {
        //     weight[index + 1].ammo = { ...weight[index].ammo }
        //     weight[index + 1].equipment = { ...weight[index].equipment }
        // }
    });
};
exports.setWeightingAdjustments = setWeightingAdjustments;
const buildOutModsObject = (id, items, inventory) => {
    const item = items[id];
    const newModObject = {};
    if ((0, exports.checkParentRecursive)(items[id]._parent, items, [exports.modParent, "5422acb9af1c889c16000029", "5a341c4086f77401f2541505"])) {
        switch (true) {
            case (0, exports.checkParentRecursive)(items[id]._parent, items, [exports.magParent]):
                const bulletList = item?._props?.Cartridges?.[0]?._props?.filters?.[0]?.Filter;
                if (bulletList) {
                    newModObject["cartridges"] = bulletList;
                    inventory.mods[id] = newModObject;
                    inventory.mods[id] = newModObject;
                }
                break;
            case (0, exports.checkParentRecursive)(items[id]._parent, items, ["5422acb9af1c889c16000029"]): //Weapon
                if (item?._props?.Slots?.length > 0) {
                    item._props.Slots.forEach(mod => {
                        if (mod._props?.filters?.[0]?.Filter?.length) {
                            // console.log(item._name, "adding ", mod._props?.filters[0].Filter.length, mod._name)
                            newModObject[mod._name] = mod._props?.filters[0].Filter;
                        }
                    });
                }
                if (item._props?.Chambers?.[0]?._name === "patron_in_weapon" &&
                    item._props?.Chambers?.[0]?._props?.filters?.[0]?.Filter?.length) {
                    newModObject["patron_in_weapon"] = item._props.Chambers[0]._props?.filters[0].Filter;
                }
                if (Object.keys(newModObject)) {
                    inventory.mods[id] = newModObject;
                    inventory.mods[id] = newModObject;
                }
                break;
            case (0, exports.checkParentRecursive)(items[id]._parent, items, ["5a341c4086f77401f2541505", exports.modParent]): //Headwear
                if (item?._props?.Slots?.length > 0) {
                    item._props.Slots.forEach(mod => {
                        if (mod._props?.filters?.[0]?.Filter?.length) {
                            // console.log(item._name, "adding ", mod._props?.filters[0].Filter.length, mod._name)
                            newModObject[mod._name] = mod._props?.filters[0].Filter;
                        }
                    });
                    if (Object.keys(newModObject)) {
                        inventory.mods[id] = newModObject;
                        inventory.mods[id] = newModObject;
                    }
                }
                break;
            default:
                // console.log(items[item._parent]._name, id)
                break;
        }
    }
};
exports.buildOutModsObject = buildOutModsObject;
const buildInitialRandomization = (items, botConfig, traderList) => {
    const randomizationItems = [];
    const weightAdjust = botConfig.equipment.pmc.weightingAdjustments;
    exports.numList.forEach((num, index) => {
        const range = config_json_1.levelRange[num];
        const loyalty = num;
        const itemList = [...traderList[loyalty]];
        const newItem = {
            levelRange: range,
            equipment: {
                "Headwear": [95, 95, 99, 99][index],
                "Earpiece": [60, 70, 80, 90][index],
                "FaceCover": [6, 15, 25, 35][index],
                "ArmorVest": [95, 95, 99, 99][index],
                "ArmBand": 20,
                "TacticalVest": [95, 95, 99, 99][index],
                "Pockets": [25, 45, 59, 69][index],
                "SecuredContainer": 99,
                "SecondPrimaryWeapon": 1,
                "Scabbard": 5,
                "FirstPrimaryWeapon": [85, 95, 99, 99][index],
                "Holster": [1, 5, 10, 10][index],
                "Eyewear": [5, 15, 26, 49][index],
                "Backpack": [90, 95, 99, 99][index],
                "Magazine": 99,
            },
            generation: {
                "drugs": {
                    "min": 0,
                    "max": [2, 2, 3, 4][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.drugs?.whitelist ? { whitelist: randomizationItems[index - 1].generation.drugs.whitelist } : {} }
                },
                "grenades": {
                    "min": 0,
                    "max": [1, 2, 2, 3][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.grenades?.whitelist ? { whitelist: randomizationItems[index - 1].generation.grenades.whitelist } : {} }
                },
                "healing": {
                    "min": 0,
                    "max": [2, 2, 3, 4][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.healing?.whitelist ? { whitelist: randomizationItems[index - 1].generation.healing.whitelist } : {} }
                },
                "looseLoot": {
                    "min": 0,
                    "max": [3, 5, 6, 8][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.looseLoot?.whitelist ? { whitelist: randomizationItems[index - 1].generation.looseLoot.whitelist } : {} }
                },
                "magazines": {
                    "min": 1,
                    "max": [3, 3, 3, 4][index],
                    ...{
                        ...weightAdjust?.[index]?.equipment?.edit?.Magazine ?
                            { whitelist: Object.keys(weightAdjust?.[index]?.equipment?.edit?.Magazine) } : {}
                    }
                },
                "stims": {
                    "min": 0,
                    "max": [0, 1, 1, 2][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.stims?.whitelist ? { whitelist: randomizationItems[index - 1].generation.stims.whitelist } : {} }
                }
            },
            "randomisedWeaponModSlots": [
                "mod_barrel",
                "mod_scope",
                "mod_scope_000",
                "mod_scope_001",
                "mod_scope_002",
                "mod_scope_003",
                "mod_handguard",
                "mod_magazine",
                "mod_muzzle",
                "mod_bipod",
                "mod_muzzle_000",
                "mod_charge",
                "mod_reciever",
                "mod_trigger",
                "mod_gas_block",
                "mod_pistol_grip",
                "mod_pistol_grip_akms",
                "mod_foregrip",
                "mod_stock",
                "mod_stock_000",
                "mod_stock_001",
                "mod_stock_akms",
                "mod_stock_axis",
                "mod_mount_000",
                "mod_mount_001",
                "mod_mount_002",
                "mod_mount_003",
                "mod_mount_004",
                "mod_mount_005",
                "mod_mount_006",
                "mod_tactical",
                "mod_tactical_2",
                "mod_tactical_000",
                "mod_tactical_001",
                "mod_tactical_002",
                "mod_tactical_003"
            ],
            "mods": {
                "mod_barrel": [5, 10, 15, 15][index],
                "mod_bipod": [5, 5, 5, 11][index],
                "mod_flashlight": [5, 10, 15, 15][index],
                "mod_foregrip": [20, 20, 25, 35][index],
                "mod_handguard": [15, 20, 25, 35][index],
                "mod_launcher": 0,
                "mod_magazine": [25, 30, 35, 45][index],
                "mod_mount": [15, 20, 25, 35][index],
                "mod_mount_000": [15, 20, 25, 35][index],
                "mod_mount_001": [15, 20, 25, 35][index],
                "mod_mount_002": [15, 20, 25, 35][index],
                "mod_mount_003": [15, 20, 25, 35][index],
                "mod_mount_004": [15, 20, 25, 35][index],
                "mod_mount_005": [15, 20, 25, 35][index],
                "mod_mount_006": [15, 20, 25, 35][index],
                "mod_muzzle": [5, 10, 15, 15][index],
                "mod_muzzle_000": [5, 10, 15, 15][index],
                "mod_muzzle_001": [5, 10, 15, 15][index],
                "mod_equipment": [5, 10, 15, 15][index],
                "mod_equipment_000": [5, 10, 15, 15][index],
                "mod_equipment_001": [5, 10, 15, 15][index],
                "mod_equipment_002": 0,
                "mod_nvg": 0,
                "mod_pistol_grip_akms": [5, 10, 15, 15][index],
                "mod_pistol_grip": [5, 10, 15, 15][index],
                "mod_scope": [15, 20, 25, 35][index],
                "mod_scope_000": [15, 20, 25, 35][index],
                "mod_scope_001": [15, 20, 25, 35][index],
                "mod_scope_002": [15, 20, 25, 35][index],
                "mod_scope_003": [15, 20, 25, 35][index],
                "mod_tactical": [5, 10, 15, 15][index],
                "mod_tactical001": [5, 10, 15, 15][index],
                "mod_tactical002": [5, 10, 15, 15][index],
                "mod_tactical_000": [5, 10, 15, 15][index],
                "mod_tactical_001": [5, 10, 15, 15][index],
                "mod_tactical_002": [5, 10, 15, 15][index],
                "mod_tactical_003": [5, 10, 15, 15][index],
                "mod_tactical_2": [5, 10, 15, 15][index],
            }
        };
        itemList.forEach((id) => {
            const item = items[id];
            const parent = item._parent;
            switch (true) {
                case (0, exports.checkParentRecursive)(parent, items, ["5448f3a64bdc2d60728b456a"]): //stims
                    newItem.generation.stims["whitelist"] = [...newItem.generation.stims["whitelist"] || [], id];
                    break;
                case (0, exports.checkParentRecursive)(parent, items, ["5448f3a14bdc2d27728b4569"]): //ThrowWeap
                    newItem.generation.drugs["whitelist"] = [...newItem.generation.drugs["whitelist"] || [], id];
                    break;
                case (0, exports.checkParentRecursive)(parent, items, ["543be6564bdc2df4348b4568"]): //ThrowWeap
                    newItem.generation.grenades["whitelist"] = [...newItem.generation.grenades["whitelist"] || [], id];
                    break;
                case (0, exports.checkParentRecursive)(parent, items, [exports.medsParent]): //FoodDrink
                    newItem.generation.healing["whitelist"] = [...newItem.generation.healing["whitelist"] || [], id];
                    break;
                case (0, exports.checkParentRecursive)(parent, items, [exports.barterParent, "543be6674bdc2df1348b4569"]): //FoodDrink
                    newItem.generation.looseLoot["whitelist"] = [...newItem.generation.looseLoot["whitelist"] || [], id];
                    break;
                case (0, exports.checkParentRecursive)(parent, items, [exports.magParent]):
                    newItem.generation.magazines["whitelist"] = [...newItem.generation.magazines["whitelist"] || [], id];
                    break;
                default:
                    break;
            }
        });
        Object.keys(newItem.generation).forEach((key) => {
            if (!newItem.generation[key]?.whitelist) {
                newItem.generation[key] = { ...newItem.generation[key], min: 0, max: 0 };
            }
            else {
                newItem.generation[key].whitelist = (0, exports.deDupeArr)(newItem.generation[key].whitelist);
            }
        });
        randomizationItems.push(newItem);
    });
    botConfig.equipment.pmc.randomisation = randomizationItems;
};
exports.buildInitialRandomization = buildInitialRandomization;
