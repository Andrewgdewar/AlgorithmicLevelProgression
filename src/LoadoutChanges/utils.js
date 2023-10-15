"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrSum = exports.numList = exports.getCurrentLevelRange = exports.equipmentIdMapper = exports.getTacticalVestValue = exports.getBackPackInternalGridValue = exports.getWeaponWeighting = exports.getHighestScoringAmmoValue = exports.getEquipmentType = exports.getHeadwearRating = exports.getAmmoWeighting = exports.getArmorRating = exports.mergeDeep = exports.isObject = exports.cloneDeep = exports.checkParentRecursive = exports.deDupeArr = exports.reduceAmmoChancesTo1 = exports.reduceEquipmentChancesTo1 = exports.setupMods = exports.addKeysToPockets = exports.addToModsObject = exports.weaponTypeNameToId = exports.SightType = exports.weaponParent = exports.mountParent = exports.chargeParent = exports.handguardParent = exports.barrelParent = exports.gasblockParent = exports.receiverParent = exports.muzzleParent = exports.pistolGripParent = exports.stockParent = exports.sightParent = exports.moneyParent = exports.masterMod = exports.modParent = exports.medsParent = exports.FoodDrinkParent = exports.medKitParent = exports.medicalParent = exports.painKillerParent = exports.stimParent = exports.keyMechanical = exports.barterParent = exports.magParent = exports.AmmoParent = exports.headwearParent = exports.saveToFile = void 0;
exports.blacklistedItems = exports.combinedForbiddenBullets = exports.buildBlacklist = exports.buildWeaponSightWhitelist = exports.weaponTypes = exports.buildClothingWeighting = exports.buildInitialBearAppearance = exports.buildInitialUsecAppearance = exports.buildInitialRandomization = exports.buildOutModsObject = exports.setWeightingAdjustments = exports.buildEmptyWeightAdjustments = exports.setWhitelists = exports.setupBaseWhiteList = void 0;
const advancedConfig_json_1 = __importDefault(require("../../config/advancedConfig.json"));
const config_json_1 = __importStar(require("../../config/config.json"));
const InternalBlacklist_1 = __importDefault(require("./InternalBlacklist"));
const saveToFile = (data, filePath) => {
    var fs = require('fs');
    let dir = __dirname;
    let dirArray = dir.split("\\");
    const directory = (`${dirArray[dirArray.length - 5]}/${dirArray[dirArray.length - 4]}/${dirArray[dirArray.length - 3]}/${dirArray[dirArray.length - 2]}/`);
    fs.writeFile(directory + filePath, JSON.stringify(data, null, 4), function (err) {
        if (err)
            throw err;
    });
};
exports.saveToFile = saveToFile;
exports.headwearParent = "5a341c4086f77401f2541505";
exports.AmmoParent = "5485a8684bdc2da71d8b4567";
exports.magParent = "5448bc234bdc2d3c308b4569";
exports.barterParent = "5448eb774bdc2d0a728b4567";
exports.keyMechanical = "5c99f98d86f7745c314214b3";
exports.stimParent = "5448f3a64bdc2d60728b456a";
exports.painKillerParent = "5448f3a14bdc2d27728b4569";
exports.medicalParent = "5448f3ac4bdc2dce718b4569";
exports.medKitParent = "5448f39d4bdc2d0a728b4568";
exports.FoodDrinkParent = "543be6674bdc2df1348b4569";
exports.medsParent = "543be5664bdc2dd4348b4569";
exports.modParent = "5448fe124bdc2da5018b4567";
exports.masterMod = "55802f4a4bdc2ddb688b4569";
exports.moneyParent = "543be5dd4bdc2deb348b4569";
exports.sightParent = "5448fe7a4bdc2d6f028b456b";
exports.stockParent = "55818a594bdc2db9688b456a";
exports.pistolGripParent = "55818a684bdc2ddd698b456d";
exports.muzzleParent = "5448fe394bdc2d0d028b456c";
exports.receiverParent = "55818a304bdc2db5418b457d";
exports.gasblockParent = "56ea9461d2720b67698b456f";
exports.barrelParent = "555ef6e44bdc2de9068b457e";
exports.handguardParent = "55818a104bdc2db9688b4569";
exports.chargeParent = "55818a104bdc2db9688b4569";
exports.mountParent = "55818b224bdc2dde698b456f";
exports.weaponParent = "5422acb9af1c889c16000029";
var SightType;
(function (SightType) {
    SightType["AssaultScope"] = "55818add4bdc2d5b648b456f";
    SightType["Collimator"] = "55818ad54bdc2ddc698b4569";
    SightType["CompactCollimator"] = "55818acf4bdc2dde698b456b";
    SightType["OpticScope"] = "55818ae44bdc2dde698b456c";
    SightType["SpecialScope"] = "55818aeb4bdc2ddc698b456a";
    SightType["ThermalVision"] = "5d21f59b6dbe99052b54ef83";
    SightType["NightVision"] = "5a2c3a9486f774688b05e574";
})(SightType || (exports.SightType = SightType = {}));
exports.weaponTypeNameToId = {
    SniperRifle: "5447b6254bdc2dc3278b4568",
    MarksmanRifle: "5447b6194bdc2d67278b4567",
    AssaultCarbine: "5447b5fc4bdc2d87278b4567",
    AssaultRifle: "5447b5f14bdc2d61278b4567",
    MachineGun: "5447bed64bdc2d97278b4568",
    Smg: "5447b5e04bdc2d62278b4567",
    SpecialWeapon: "5447bee84bdc2dc3278b4569",
    Shotgun: "5447b6094bdc2dc3278b4567",
    Pistol: "5447b5cf4bdc2d65278b4567",
    Revolver: "617f1ef5e8b54b0998387733",
    GrenadeLauncher: "5447bedf4bdc2d87278b4568",
};
const addToModsObject = (mods, _tpl, items, loyaltyLevel, slotId = "") => {
    switch (true) {
        case (0, exports.checkParentRecursive)(_tpl, items, [exports.magParent]):
            if (!mods[loyaltyLevel]?.["mod_magazine"])
                mods[loyaltyLevel]["mod_magazine"] = [];
            mods[loyaltyLevel]["mod_magazine"].push(_tpl);
            break;
        case slotId !== "hideout":
            if (!mods[loyaltyLevel]?.[slotId])
                mods[loyaltyLevel][slotId] = [];
            mods[loyaltyLevel][slotId].push(_tpl);
            break;
        // case checkParentRecursive(_tpl, items, Object.values(SightType)):
        //     if (!mods[loyaltyLevel]?.["mod_scope"]) mods[loyaltyLevel]["mod_scope"] = []
        //     mods[loyaltyLevel]["mod_scope"].push(_tpl)
        //     break;
        // case checkParentRecursive(_tpl, items, [pistolGripParent]):
        //     if (!mods[loyaltyLevel]?.["mod_pistol_grip"]) mods[loyaltyLevel]["mod_pistol_grip"] = []
        //     mods[loyaltyLevel]["mod_pistol_grip"].push(_tpl)
        //     break;
        // case checkParentRecursive(_tpl, items, [stockParent]):
        //     if (!mods[loyaltyLevel]?.["mod_stock"]) mods[loyaltyLevel]["mod_stock"] = []
        //     mods[loyaltyLevel]["mod_stock"].push(_tpl)
        //     break;
        // case checkParentRecursive(_tpl, items, [muzzleParent]):
        //     if (!mods[loyaltyLevel]?.["mod_muzzle"]) mods[loyaltyLevel]["mod_muzzle"] = []
        //     mods[loyaltyLevel]["mod_muzzle"].push(_tpl)
        //     break;
        // case checkParentRecursive(_tpl, items, [receiverParent]):
        //     if (!mods[loyaltyLevel]?.["mod_reciever"]) mods[loyaltyLevel]["mod_reciever"] = []
        //     mods[loyaltyLevel]["mod_reciever"].push(_tpl)
        //     break;
        // case checkParentRecursive(_tpl, items, [gasblockParent]):
        //     if (!mods[loyaltyLevel]?.["mod_gas_block"]) mods[loyaltyLevel]["mod_gas_block"] = []
        //     mods[loyaltyLevel]["mod_gas_block"].push(_tpl)
        //     break;
        // case checkParentRecursive(_tpl, items, [barrelParent]):
        //     if (!mods[loyaltyLevel]?.["mod_barrel"]) mods[loyaltyLevel]["mod_barrel"] = []
        //     mods[loyaltyLevel]["mod_barrel"].push(_tpl)
        //     break;
        // case checkParentRecursive(_tpl, items, [handguardParent]):
        //     if (!mods[loyaltyLevel]?.["mod_handguard"]) mods[loyaltyLevel]["mod_handguard"] = []
        //     mods[loyaltyLevel]["mod_handguard"].push(_tpl)
        //     break;
        // case checkParentRecursive(_tpl, items, [chargeParent]):
        //     if (!mods[loyaltyLevel]?.["mod_charge"]) mods[loyaltyLevel]["mod_charge"] = []
        //     mods[loyaltyLevel]["mod_charge"].push(_tpl)
        //     break;
        // case checkParentRecursive(_tpl, items, [mountParent]):
        //     if (!mods[loyaltyLevel]?.["mod_mount"]) mods[loyaltyLevel]["mod_mount"] = []
        //     mods[loyaltyLevel]["mod_mount"].push(_tpl)
        //     break;
        default:
            break;
    }
};
exports.addToModsObject = addToModsObject;
const addKeysToPockets = (traderItems, items, inventory) => {
    traderItems.forEach((id) => {
        if (id && items[id]?._parent && (0, exports.checkParentRecursive)(id, items, [exports.keyMechanical])) {
            inventory.items.Pockets.push(id);
            inventory.items.Backpack.push(id);
            inventory.items.TacticalVest.push(id);
        }
    });
    inventory.items.Pockets = (0, exports.deDupeArr)(inventory.items.Pockets);
    inventory.items.Backpack = (0, exports.deDupeArr)(inventory.items.Backpack);
    inventory.items.TacticalVest = (0, exports.deDupeArr)(inventory.items.TacticalVest);
};
exports.addKeysToPockets = addKeysToPockets;
const setupMods = (mods) => {
    Object.keys(mods).forEach(numstr => {
        const num = Number(numstr);
        Object.keys(mods[num]).forEach(mod => {
            mods[num][mod] = (0, exports.deDupeArr)(mods[num][mod]);
            if (mods[num + 1]) {
                if (!mods[num + 1]?.[mod])
                    mods[num + 1][mod] = mods[num][mod];
                else {
                    mods[num + 1][mod].push(...mods[num][mod]);
                }
            }
        });
    });
};
exports.setupMods = setupMods;
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
const getArmorRating = ({ _props: { RepairCost, Durability, armorClass, armorZone, Weight }, _name, _id }) => {
    const armorZoneCoverage = armorZone?.length || 0;
    const durability = Durability * 0.1;
    const total = Math.round(((armorClass * 30) + durability + (armorZoneCoverage * 3)) - Weight);
    if (total < 1)
        return 1;
    // console.log(_name, total)
    return total;
};
exports.getArmorRating = getArmorRating;
const getAmmoWeighting = ({ _props: { PenetrationPower, Damage, InitialSpeed, ProjectileCount }, _id, _name }) => {
    let penBonus = ((PenetrationPower - 20) * 10);
    if (penBonus < 0)
        penBonus = 0;
    const damBonus = (ProjectileCount ? (Damage * ProjectileCount) * 0.1 : Damage);
    let speedBonus = InitialSpeed > 600 ? 10 : 0;
    const rating = Math.round(penBonus + speedBonus + damBonus);
    // if (rating > 20) console.log(rating || 3, _name)
    return rating || 3;
};
exports.getAmmoWeighting = getAmmoWeighting;
const getHeadwearRating = ({ _props: { Slots, BlocksEarpiece, headSegments, armorClass, Durability, RicochetParams, Weight }, _id, _name }) => {
    const blocksEarpiece = BlocksEarpiece;
    const hasNvg = !!Slots.find((slot) => slot._name === "mod_nvg") ? 70 : 0;
    const coverageBonus = headSegments?.length || 0;
    const helmetBonus = Number(armorClass) * 20;
    const durability = Durability * 0.1;
    const ricochetChance = ((RicochetParams.x + RicochetParams.y) * RicochetParams.z) * 0.2;
    let rating = helmetBonus - Weight + coverageBonus + ricochetChance + durability + hasNvg;
    if (blocksEarpiece)
        rating = (rating) * 0.1;
    if (rating < 10)
        rating = 10;
    // console.log(_name, Math.round(rating))
    return Math.round(rating);
};
exports.getHeadwearRating = getHeadwearRating;
const getEquipmentType = (id, items) => {
    const equipmentKeys = Object.keys(exports.equipmentIdMapper);
    for (let index = 0; index < equipmentKeys.length; index++) {
        const key = equipmentKeys[index];
        if ((0, exports.checkParentRecursive)(id, items, exports.equipmentIdMapper[key])) {
            return key;
        }
    }
};
exports.getEquipmentType = getEquipmentType;
const getHighestScoringAmmoValue = (ammoWeight) => {
    let highestValue = 1;
    let highestKey = "";
    for (const key in ammoWeight) {
        const value = ammoWeight[key];
        if (value > highestValue) {
            highestValue = value;
            highestKey = key;
        }
    }
    // console.log(highestKey, highestValue)
    return highestValue;
};
exports.getHighestScoringAmmoValue = getHighestScoringAmmoValue;
const getWeaponWeighting = ({ _props: { Ergonomics, BoltAction, weapClass, weapFireType, RecoilForceUp, ReloadMode } = {}, _name, _id }, highestScoringAmmo) => {
    let ammo = highestScoringAmmo;
    let gun = Ergonomics;
    if (_id === "5bfd297f0db834001a669119")
        ammo * 0.7; //Make mosin infantry less desirable
    if (weapFireType.length === 1 && weapFireType.includes('single'))
        ammo = ammo * 0.8;
    if (ReloadMode.includes("OnlyBarrel"))
        ammo = ammo / 4;
    if (RecoilForceUp > 200)
        ammo = ammo * 0.8;
    if (BoltAction)
        ammo = ammo / 2;
    if (weapFireType.includes('fullauto'))
        ammo = ammo * 1.2;
    if (weapClass !== "pistol" && RecoilForceUp < 100)
        ammo * 1.2;
    const finalValue = Math.round(gun + ammo);
    // if (finalValue > 5) console.log(finalValue > 0 ? finalValue : 1, Math.round(ammo), Math.round(gun), _name, weapClass)
    return finalValue > 1 ? finalValue : 1;
};
exports.getWeaponWeighting = getWeaponWeighting;
const getBackPackInternalGridValue = ({ _props: { Grids, Weight } = {}, _name, _id }) => {
    let total = 0;
    Grids.forEach(({ _props }) => {
        total += _props?.cellsH * _props?.cellsV;
        // if the backpack can't hold "Items" give it a severe lower ranking
        if (_props.filters?.[0]?.Filter?.length && !_props.filters?.[0]?.Filter?.includes("54009119af1c881c07000029")) {
            total = total / 6;
        }
    });
    total = Math.round(((total) - (Weight * 5)) - ((Grids.length - 1) * 3));
    if (["6034d103ca006d2dca39b3f0", "6038d614d10cbf667352dd44"].includes(_id)) {
        total = Math.round(total * 0.7);
    }
    // console.log(_name, _id, " - ", (total > 1 ? total : 1) + 20)
    return (total > 1 ? total : 1) + 30;
};
exports.getBackPackInternalGridValue = getBackPackInternalGridValue;
const getTacticalVestValue = (item) => {
    const { Grids } = item._props;
    let spaceTotal = 0;
    Grids.forEach(({ _props }) => {
        spaceTotal = spaceTotal + (_props?.cellsH * _props?.cellsV);
    });
    spaceTotal = (Math.round(spaceTotal) - item._props.Weight) || 3;
    if (spaceTotal < 5)
        spaceTotal = 5;
    const armorRating = (0, exports.getArmorRating)(item) * 0.8;
    // if (armorRating < 5) console.log(item._name, item._id, " - ", armorRating > 5 ? armorRating : spaceTotal * 10)
    return Math.round(armorRating > 5 ? armorRating : (spaceTotal * 10));
};
exports.getTacticalVestValue = getTacticalVestValue;
exports.equipmentIdMapper = {
    Headwear: [exports.headwearParent],
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
    // mod_magazine: [
    //     "5448bc234bdc2d3c308b4569",
    //     "610720f290b75a49ff2e5e25"
    // ],
    // // Stock: ["55818a594bdc2db9688b456a"],
    // mod_scope: [...Object.values(SightType)],
};
const getCurrentLevelRange = (currentLevel) => {
    for (const key in config_json_1.levelRange) {
        const { min, max } = config_json_1.levelRange[key];
        if (currentLevel >= min && currentLevel <= max)
            return key;
    }
};
exports.getCurrentLevelRange = getCurrentLevelRange;
exports.numList = [1, 2, 3, 4, 5];
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
const setWhitelists = (items, botConfig, tradersMasterList, mods) => {
    exports.numList.forEach((num, index) => {
        const loyalty = num;
        const whitelist = botConfig.equipment.pmc.whitelist;
        const itemList = [...tradersMasterList[loyalty]];
        whitelist[index].equipment = { ...whitelist[index].equipment, ...mods[num] };
        itemList.forEach(id => {
            const item = items[id];
            const parent = item._parent;
            const equipmentType = (0, exports.getEquipmentType)(parent, items);
            switch (true) {
                // case items[parent]?._parent === "5422acb9af1c889c16000029": < this is weapon PArent?
                //     const calibre = item._props.Caliber || item._props.ammoCaliber
                //     whitelist[index].cartridge[calibre] =
                //         [...whitelist[index].cartridge[calibre] ? whitelist[index].cartridge[calibre] : [], id]
                //     break;
                case id === "60db29ce99594040e04c4a27":
                    whitelist[index].equipment["FirstPrimaryWeapon"] =
                        [...whitelist[index].equipment["FirstPrimaryWeapon"] ? whitelist[index].equipment["FirstPrimaryWeapon"] : [], id];
                    break;
                case !!equipmentType:
                    whitelist[index].equipment[equipmentType] =
                        [...whitelist[index].equipment[equipmentType] ? whitelist[index].equipment[equipmentType] : [], id];
                    break;
                default:
                    break;
            }
        });
        if (!!whitelist[index + 1]) {
            // if (!whitelist[index + 1]["ammo"]) whitelist[index + 1]["ammo"] = {}
            // whitelist[index + 1]["ammo"] = { ...whitelist[index]["ammo"] }
            whitelist[index + 1].equipment = (0, exports.cloneDeep)(whitelist[index].equipment);
        }
    });
    // console.log(JSON.stringify(botConfig.equipment.pmc.whitelist))
};
exports.setWhitelists = setWhitelists;
const buildEmptyWeightAdjustments = () => {
    return exports.numList.map(num => ({
        levelRange: config_json_1.levelRange[num],
        "ammo": {
            "add": {},
            "edit": {}
        },
        "equipment": {
            "add": {},
            "edit": {}
        },
        "clothing": {
            "add": {},
            "edit": {}
        },
    }));
};
exports.buildEmptyWeightAdjustments = buildEmptyWeightAdjustments;
const setWeightItem = (weight, equipmentType, id, rating, add) => {
    if (add) {
        weight.equipment.add[equipmentType] = {
            ...weight.equipment.add[equipmentType] || {},
            [id]: rating + config_json_1.default.equipmentRandomness
        };
    }
    else {
        weight.equipment.edit[equipmentType] = {
            ...weight.equipment.edit[equipmentType] || {},
            [id]: rating + config_json_1.default.equipmentRandomness
        };
    }
};
const setWeightingAdjustments = (items, botConfig, tradersMasterList, mods) => {
    const weight = botConfig.equipment.pmc.weightingAdjustmentsByBotLevel;
    const itemsForNextLevel = {};
    exports.numList.forEach((num, index) => {
        const loyalty = num;
        const itemList = [...tradersMasterList[loyalty]];
        const finalList = [
            ...new Set([
                ...num === 4 ?
                    (config_json_1.default.addDangerousBulletsToTier4Bots ? advancedConfig_json_1.default.forbiddenBullets[num] : [])
                    : (advancedConfig_json_1.default.forbiddenBullets[num] || []),
                ...itemsForNextLevel[num] || [],
                ...itemList,
            ])
        ];
        // First edit ammo
        finalList.forEach(id => {
            const item = items[id];
            const parent = item._parent;
            // Ammo Parent
            if ((0, exports.checkParentRecursive)(parent, items, [exports.AmmoParent])) {
                const calibre = item._props.Caliber || item._props.ammoCaliber;
                if ((num + 1) < 6) {
                    if (!itemsForNextLevel[num + 1])
                        itemsForNextLevel[num + 1] = new Set([]);
                    itemsForNextLevel[num + 1].add(id);
                }
                if (!weight[index]?.ammo.edit?.[calibre]) {
                    weight[index].ammo.edit = { ...weight[index].ammo.edit, [calibre]: {} };
                }
                const ammoWeight = (0, exports.getAmmoWeighting)(item);
                weight[index].ammo.edit[calibre] =
                    { ...weight[index].ammo.edit[calibre] || {}, [id]: ammoWeight };
            }
        });
    });
    //Make bad ammos worse, better ones better
    exports.numList.forEach((num, index) => {
        Object.keys(weight[index].ammo.edit).forEach((caliber => {
            const caliberList = Object.keys(weight[index].ammo.edit[caliber]).sort((a, b) => weight[index].ammo.edit[caliber][b] - weight[index].ammo.edit[caliber][a]);
            caliberList.forEach((id, rank) => {
                if (caliberList.length > 1 && rank > 0) {
                    if (rank > 3)
                        weight[index].ammo.edit[caliber][id] = 1;
                    const modifier = (caliberList.length - rank) / caliberList.length;
                    weight[index].ammo.edit[caliber][id] = Math.round(weight[index].ammo.edit[caliber][id] * modifier) || 1;
                }
            });
        }));
        // console.log(JSON.stringify(weight[index].ammo.edit))
    });
    exports.numList.forEach((num, index) => {
        const loyalty = num;
        const itemList = [...tradersMasterList[loyalty]];
        const finalList = [...new Set([...itemsForNextLevel[num] || [], ...itemList])];
        // Was this needed?
        // const combinedWeightingAdjustmentItem = {} as WeightingAdjustmentDetails
        // for (const key of botConfig.equipment.pmc.weightingAdjustments) {
        //     mergeDeep(combinedWeightingAdjustmentItem, key)
        // }
        // mergeDeep(combinedWeightingAdjustmentItem, weight[index])
        finalList.forEach(id => {
            const item = items[id];
            const parent = item._parent;
            const equipmentType = (0, exports.getEquipmentType)(parent, items);
            if (equipmentType) {
                if (!weight[index]?.equipment?.edit?.[equipmentType]) {
                    weight[index].equipment.edit = { ...weight[index].equipment.edit, [equipmentType]: {} };
                }
            }
            switch (equipmentType) {
                case "FirstPrimaryWeapon":
                case "Holster":
                    if ((num + 1) < 6) {
                        if (!itemsForNextLevel[num + 1])
                            itemsForNextLevel[num + 1] = new Set([]);
                        itemsForNextLevel[num + 1].add(id);
                    }
                    const calibre = item._props.Caliber || item._props.ammoCaliber;
                    const highestScoringAmmo = (0, exports.getHighestScoringAmmoValue)(weight[index].ammo.edit[calibre]);
                    const weaponRating = (0, exports.getWeaponWeighting)(item, highestScoringAmmo) + (tradersMasterList[num].has(id) ? (num * 20) : 0);
                    // Check if revolver shotgun
                    if (id === "60db29ce99594040e04c4a27")
                        setWeightItem(weight[index], "FirstPrimaryWeapon", id, weaponRating);
                    else {
                        setWeightItem(weight[index], equipmentType, id, weaponRating);
                    }
                    break;
                case "Headwear":
                    const rating = (0, exports.getHeadwearRating)(item);
                    // if (rating > 10) console.log(loyalty, item._name, blocksEarpiece, Math.round(rating))
                    setWeightItem(weight[index], equipmentType, id, Math.round(rating));
                    break;
                case "Earpiece":
                    const ambientVolumeBonus = item?._props?.AmbientVolume * -1;
                    const compressorBonus = item?._props?.CompressorVolume * -0.5;
                    setWeightItem(weight[index], equipmentType, id, Math.round(compressorBonus + ambientVolumeBonus));
                    break;
                case "FaceCover":
                    setWeightItem(weight[index], equipmentType, id, loyalty * 3);
                    break;
                case "ArmorVest":
                    const armorRating = (0, exports.getArmorRating)(item);
                    setWeightItem(weight[index], equipmentType, id, armorRating);
                    break;
                case "ArmBand":
                    setWeightItem(weight[index], equipmentType, id, loyalty * 5);
                    break;
                case "SecuredContainer":
                    setWeightItem(weight[index], equipmentType, id, ((item._props.sizeWidth * item._props.sizeHeight) || 3));
                    break;
                case "Scabbard":
                    setWeightItem(weight[index], equipmentType, id, ((loyalty * 10) || 3));
                    break;
                case "Eyewear":
                    setWeightItem(weight[index], equipmentType, id, (Math.round(item._props.LootExperience + (item._props.BlindnessProtection * 5)) || 3));
                    break;
                case "Backpack":
                    const backpackInternalGridValue = (0, exports.getBackPackInternalGridValue)(item);
                    setWeightItem(weight[index], equipmentType, id, backpackInternalGridValue);
                    break;
                case "TacticalVest":
                    const tacticalVestWeighting = (0, exports.getTacticalVestValue)(item);
                    setWeightItem(weight[index], equipmentType, id, tacticalVestWeighting);
                    break;
                // case "mod_magazine":
                // case "mod_scope":
                //     setWeightItem(weight[index], equipmentType, id, (loyalty * 40) , true)
                // break;
                default:
                    switch (true) {
                        //     case checkParentRecursive(id, items, [...Object.values(SightType)]):
                        //         setWeightItem(weight[index], "mod_scope", id, (loyalty * 10) , true)
                        //         break;
                        // case checkParentRecursive(id, items, [stockParent]):
                        //     setWeightItem(weight[index], "mod_stock", id, (loyalty * 10) , true)
                        //     break;
                        // case checkParentRecursive(id, items, [mountParent]):
                        //     setWeightItem(weight[index], "mod_mount", id, (loyalty * 10) , true)
                        //     break;
                        default:
                            break;
                    }
                    break;
            }
            // const modsList = mods[num]
            // Object.keys(modsList).forEach(modtype => {
            //     modsList[modtype].forEach(modId => {
            //         setWeightItem(weight[index], modtype, modId, (loyalty * 20), true)
            //     })
            // })
        });
    });
    // console.log(JSON.stringify(weight))
};
exports.setWeightingAdjustments = setWeightingAdjustments;
const weaponsToAllowAllMods = { "5ae08f0a5acfc408fb1398a1": true };
const addRecursive = (modId, items, weaponId, mods) => {
    const newModObject = {};
    let pass = false;
    if (items[modId]?._props?.Slots?.length > 0) {
        items[modId]._props.Slots.forEach(mod => {
            if (mod._props?.filters?.[0]?.Filter?.length) {
                newModObject[mod._name] = mod._props.filters[0].Filter.filter((id) => {
                    if (exports.blacklistedItems.has(id))
                        return false;
                    addRecursive(id, items, weaponId, mods);
                    return true;
                });
                pass = true;
            }
        });
    }
    if (pass && Object.keys(newModObject).length) {
        mods[modId] = newModObject;
    }
};
const buildOutModsObject = (traderList, items, inventory, botConfig) => {
    traderList.forEach((id) => {
        const item = items[id];
        const newModObject = {};
        if (!exports.blacklistedItems.has(id) && (0, exports.checkParentRecursive)(item._parent, items, [exports.magParent, exports.weaponParent, exports.headwearParent])) {
            switch (true) {
                case (0, exports.checkParentRecursive)(item._parent, items, [exports.magParent]):
                    if ((item?._props?.Height * item?._props?.Width) < 3) {
                        const bulletList = item?._props?.Cartridges?.[0]?._props?.filters?.[0]?.Filter.filter((_tpl) => !!_tpl && !exports.blacklistedItems.has(_tpl));
                        if (bulletList) {
                            newModObject["cartridges"] = bulletList;
                            inventory.mods[id] = newModObject;
                        }
                    }
                    else {
                        config_json_1.default.debug && console.warn(id, item._name, item?._props?.Cartridges?.[0]?._max_count);
                    }
                    break;
                case (0, exports.checkParentRecursive)(item._parent, items, [exports.weaponParent]): //Weapon
                    if (item?._props?.Slots?.length > 0) {
                        item._props.Slots.forEach(mod => {
                            // if (!weaponsToAllowAllMods[id] && mod._name?.includes("scope")) {
                            //     newModObject[mod._name] = mod._props?.filters[0].Filter.filter((_tpl) => !!_tpl && !blacklistedItems.has(_tpl) && checkForScopeTypeRecursive(_tpl, items, id, inventory.mods))
                            // } else
                            if (mod._props?.filters?.[0]?.Filter?.length) {
                                newModObject[mod._name] = mod._props.filters[0].Filter.filter((_tpl) => {
                                    if (!!_tpl && !exports.blacklistedItems.has(_tpl)) {
                                        addRecursive(_tpl, items, id, inventory.mods);
                                        return true;
                                    }
                                    return false;
                                });
                            }
                        });
                    }
                    if (item._props?.Chambers?.[0]?._name === "patron_in_weapon" &&
                        item._props?.Chambers?.[0]?._props?.filters?.[0]?.Filter?.length) {
                        newModObject["patron_in_weapon"] = item._props.Chambers[0]._props?.filters[0].Filter.filter((_tpl) => !!_tpl && !exports.blacklistedItems.has(_tpl));
                    }
                    if (Object.keys(newModObject)) {
                        inventory.mods[id] = newModObject;
                    }
                    break;
                case (0, exports.checkParentRecursive)(item._parent, items, [exports.headwearParent]): //Headwear
                    //TODO: fix helmet mods
                    if (item?._props?.Slots?.length > 0) {
                        item._props.Slots.forEach(mod => {
                            if (["mod_mount", "mod_equipment"].includes(mod._name))
                                return;
                            newModObject[mod._name] = mod._props.filters[0].Filter.filter((_tpl) => {
                                if (!!_tpl && !exports.blacklistedItems.has(_tpl)) {
                                    addRecursive(_tpl, items, id, inventory.mods);
                                    return true;
                                }
                                return false;
                            });
                        });
                    }
                    inventory.mods[id] = newModObject;
                    break;
                default:
                    // console.log(items[item._parent]._name, id)
                    break;
            }
        }
    });
    traderList.forEach((id) => {
        const item = items[id];
        const newModObject = {};
        if (!inventory.mods[id] && !exports.blacklistedItems.has(id) && (0, exports.checkParentRecursive)(item._parent, items, [exports.modParent])) {
            if (item?._props?.Slots?.length > 0) {
                item._props.Slots.forEach(mod => {
                    if (mod._props?.filters?.[0]?.Filter?.length) {
                        switch (true) {
                            case mod._name?.includes("scope") && (0, exports.checkParentRecursive)(item._parent, items, [exports.handguardParent, exports.gasblockParent]): /*gasblockParent,*/
                                newModObject[mod._name] = [];
                                break;
                            // case mod._name?.includes("scope"):
                            //     newModObject[mod._name] = mod._props?.filters[0].Filter.filter((_tpl) => siteWhiteList["5447bedf4bdc2d87278b4568"].includes(_tpl))
                            // console.log(item._name, newModObject[mod._name])
                            default:
                                newModObject[mod._name] = mod._props?.filters[0].Filter.filter((_tpl) => !exports.blacklistedItems.has(_tpl));
                                break;
                        }
                    }
                });
                if (Object.keys(newModObject)) {
                    inventory.mods[id] = newModObject;
                }
            }
        }
    });
    // console.log(JSON.stringify(inventory.mods))
};
exports.buildOutModsObject = buildOutModsObject;
const buildInitialRandomization = (items, botConfig, traderList) => {
    const randomizationItems = [];
    exports.numList.forEach((num, index) => {
        const range = config_json_1.levelRange[num];
        const loyalty = num;
        const itemList = new Set([...traderList[loyalty]]);
        const newItem = {
            levelRange: range,
            equipment: {
                "Headwear": [75, 85, 99, 99, 99][index],
                "Earpiece": [50, 65, 90, 100, 100][index],
                "FaceCover": [15, 25, 35, 45, 80][index],
                "ArmorVest": [99, 99, 99, 99, 99][index],
                "ArmBand": [25, 45, 59, 69, 80][index],
                "TacticalVest": [96, 96, 99, 99, 99][index],
                "Pockets": [25, 45, 59, 69, 80][index],
                "SecuredContainer": 100,
                "SecondPrimaryWeapon": [0, 0, 0, 1, 1][index],
                "Scabbard": [1, 5, 5, 10, 40][index],
                "FirstPrimaryWeapon": [85, 98, 99, 99, 99][index],
                "Holster": [1, 5, 10, 10, 10][index],
                "Eyewear": [5, 15, 26, 49, 75][index],
                "Backpack": [70, 80, 90, 99, 99][index],
            },
            generation: {
                "stims": {
                    weights: [{
                            "0": 1,
                            "1": 3
                        }, {
                            "0": 1,
                            "1": 4,
                        }, {
                            "0": 1,
                            "1": 5,
                        }, {
                            "0": 0,
                            "1": 5,
                            "2": 1
                        }, {
                            "0": 0,
                            "1": 3,
                            "2": 1
                        }][index],
                    whitelist: randomizationItems[index - 1]?.generation?.stims?.whitelist ? randomizationItems[index - 1].generation.stims.whitelist : []
                },
                "drugs": {
                    weights: [{
                            "0": 1,
                            "1": 3
                        }, {
                            "0": 1,
                            "1": 4,
                        }, {
                            "0": 1,
                            "1": 5,
                        }, {
                            "0": 0,
                            "1": 5,
                            "2": 1
                        }, {
                            "0": 0,
                            "1": 3,
                            "2": 1
                        }][index],
                    whitelist: randomizationItems[index - 1]?.generation?.drugs?.whitelist ? randomizationItems[index - 1].generation.drugs.whitelist : []
                },
                "healing": {
                    weights: [{
                            "0": 1,
                            "1": 8
                        }, {
                            "0": 0,
                            "1": 4,
                        }, {
                            "0": 0,
                            "1": 3,
                        }, {
                            "0": 0,
                            "1": 5,
                            "2": 1
                        }, {
                            "0": 0,
                            "1": 3,
                            "2": 1
                        }][index],
                    whitelist: randomizationItems[index - 1]?.generation?.healing?.whitelist ? randomizationItems[index - 1].generation.healing.whitelist : []
                },
                "grenades": {
                    weights: [{
                            "0": 1,
                            "1": 1
                        }, {
                            "0": 2,
                            "1": 2,
                            "2": 1
                        }, {
                            "0": 1,
                            "1": 2,
                            "2": 1
                        }, {
                            "0": 1,
                            "1": 2,
                            "2": 2
                        }, {
                            "0": 0,
                            "1": 2,
                            "2": 2,
                            "3": 1
                        }][index],
                    whitelist: randomizationItems[index - 1]?.generation?.grenades?.whitelist ? randomizationItems[index - 1].generation.grenades.whitelist : []
                },
                "backpackLoot": {
                    "weights": config_json_1.default.removePMCLootForLootingBots ?
                        [{
                                "0": 5,
                                "1": 1
                            }, {
                                "0": 5,
                                "1": 1
                            }, {
                                "0": 5,
                                "1": 1
                            }, {
                                "0": 5,
                                "1": 1
                            }, {
                                "0": 5,
                                "1": 1
                            }][index] :
                        [{
                                "0": 1,
                                "1": 2,
                                "2": 2,
                                "3": 1,
                                "4": 1,
                            }, {
                                "0": 1,
                                "1": 1,
                                "2": 2,
                                "3": 2,
                                "4": 2,
                                "5": 1,
                            }, {
                                "0": 0,
                                "1": 1,
                                "2": 1,
                                "3": 1,
                                "4": 2,
                                "5": 2,
                                "6": 1,
                                "7": 1,
                            }, {
                                "0": 0,
                                "1": 0,
                                "2": 1,
                                "3": 1,
                                "4": 3,
                                "5": 2,
                                "6": 2,
                                "7": 1,
                            }, {
                                "0": 0,
                                "1": 0,
                                "2": 0,
                                "3": 0,
                                "4": 1,
                                "5": 1,
                                "6": 3,
                                "7": 2,
                                "8": 2,
                            }][index],
                    "whitelist": []
                },
                "pocketLoot": {
                    "weights": config_json_1.default.removePMCLootForLootingBots ?
                        [{
                                "0": 5,
                                "1": 1
                            }, {
                                "0": 5,
                                "1": 1
                            }, {
                                "0": 5,
                                "1": 1
                            }, {
                                "0": 5,
                                "1": 1
                            }, {
                                "0": 5,
                                "1": 1
                            }][index] :
                        [{
                                "0": 4,
                                "1": 1,
                                "2": 1,
                            }, {
                                "0": 3,
                                "1": 2,
                                "2": 1,
                            }, {
                                "0": 2,
                                "1": 2,
                                "2": 1,
                                "3": 1,
                            }, {
                                "0": 1,
                                "1": 2,
                                "2": 1,
                                "3": 1,
                            }, {
                                "0": 1,
                                "1": 1,
                                "2": 2,
                                "3": 1,
                            }][index],
                    "whitelist": []
                },
                "vestLoot": {
                    "weights": config_json_1.default.removePMCLootForLootingBots ?
                        [{
                                "0": 5,
                                "1": 1
                            }, {
                                "0": 5,
                                "1": 1
                            }, {
                                "0": 5,
                                "1": 1
                            }, {
                                "0": 5,
                                "1": 1
                            }, {
                                "0": 5,
                                "1": 1
                            }][index] :
                        [{
                                "0": 3,
                                "1": 1,
                                "2": 1,
                            }, {
                                "0": 2,
                                "1": 2,
                                "2": 1,
                                "4": 1,
                            }, {
                                "0": 1,
                                "1": 2,
                                "2": 1,
                                "3": 1,
                                "4": 1,
                            }, {
                                "0": 1,
                                "1": 2,
                                "2": 2,
                                "3": 1,
                                "4": 1,
                            }, {
                                "0": 0,
                                "1": 2,
                                "2": 2,
                                "3": 1,
                                "4": 1,
                            }][index],
                    "whitelist": []
                },
                "magazines": {
                    weights: [{
                            "0": 0,
                            "1": 0,
                            "2": 1,
                            "3": 1,
                        }, {
                            "0": 0,
                            "1": 0,
                            "2": 1,
                            "3": 1,
                        }, {
                            "0": 0,
                            "1": 0,
                            "2": 0,
                            "3": 1,
                            "4": 1,
                        }, {
                            "0": 0,
                            "1": 0,
                            "2": 0,
                            "3": 1,
                            "4": 1,
                        }, {
                            "0": 0,
                            "1": 0,
                            "2": 0,
                            "3": 1,
                            "4": 1,
                            "5": 1,
                        }][index],
                    "whitelist": botConfig.equipment.pmc.whitelist[index].equipment.mod_magazine
                },
            },
            "randomisedWeaponModSlots": [],
            "mods": {
                "mod_barrel": [15, 20, 25, 35, 45][index],
                "mod_bipod": [1, 10, 5, 11, 50][index],
                "mod_flashlight": [15, 20, 30, 40, 65][index],
                "mod_foregrip": [30, 60, 70, 90, 95][index],
                "mod_handguard": [20, 30, 70, 90, 95][index],
                "mod_launcher": [0, 0, 5, 15, 50][index],
                "mod_magazine": [50, 60, 80, 90, 95][index],
                "mod_magazine_000": [0, 0, 25, 35, 50][index],
                "mod_mount": [85, 95, 100, 100, 100][index],
                "mod_mount_000": [40, 45, 65, 90, 95][index],
                "mod_mount_001": [40, 45, 65, 90, 95][index],
                "mod_mount_002": [40, 45, 65, 90, 95][index],
                "mod_mount_003": [40, 45, 65, 90, 95][index],
                "mod_mount_004": [40, 45, 65, 90, 95][index],
                "mod_mount_005": [40, 45, 65, 90, 95][index],
                "mod_mount_006": [40, 45, 65, 90, 95][index],
                "mod_muzzle": [35, 55, 65, 75, 99][index],
                "mod_muzzle_000": [15, 35, 65, 85, 99][index],
                "mod_muzzle_001": [15, 35, 65, 85, 99][index],
                "mod_equipment": [15, 25, 25, 35, 50][index],
                "mod_nvg": 0,
                "mod_equipment_000": [0, 0, 0, 5, 20][index],
                "mod_equipment_001": [0, 0, 5, 15, 25][index],
                "mod_equipment_002": [0, 0, 5, 15, 25][index],
                "mod_pistol_grip_akms": [1, 15, 25, 35, 50][index],
                "mod_pistol_grip": [1, 15, 25, 35, 50][index],
                "mod_scope": [90, 95, 100, 100, 100][index],
                "mod_scope_000": [90, 95, 100, 100, 100][index],
                "mod_scope_001": [90, 95, 100, 100, 100][index],
                "mod_scope_002": [90, 95, 100, 100, 100][index],
                "mod_scope_003": [90, 95, 100, 100, 100][index],
                "mod_tactical": [15, 30, 35, 50, 75][index],
                "mod_tactical_2": 0,
                "mod_tactical001": [15, 30, 35, 50, 75][index],
                "mod_tactical002": [15, 30, 35, 50, 75][index],
                "mod_tactical_000": [1, 5, 5, 10, 15][index],
                "mod_tactical_001": [1, 5, 5, 10, 15][index],
                "mod_tactical_002": [15, 30, 35, 50, 75][index],
                "mod_tactical_003": [15, 30, 35, 50, 75][index],
                "mod_charge": [10, 20, 35, 50, 75][index],
                "mod_stock": 99,
                "mod_stock_000": 99,
                // "mod_stock_001": [1, 10, 15, 20][index],
                "mod_stock_akms": 100,
                "mod_sight_front": [50, 20, 5, 0, 0][index],
                "mod_sight_rear": [50, 20, 5, 0, 0][index],
                // "mod_reciever": 100,
                // "mod_gas_block": [1, 10, 15, 20][index],
                "mod_pistolgrip": [1, 15, 25, 35, 50][index],
                // "mod_trigger": 1,
                // "mod_hammer": 1,
                // "mod_catch": 1
            }
        };
        const medkitsAdd = {
            1: ["590c661e86f7741e566b646a"],
            2: [],
            3: ["590c678286f77426c9660122"],
            4: ["60098ad7c2240c0fe85c570a"],
            5: []
        };
        const medkitsRemove = {
            1: new Set([]),
            2: new Set(["5755356824597772cb798962"]),
            3: new Set(["590c661e86f7741e566b646a"]),
            4: new Set([]),
            5: new Set(["544fb45d4bdc2dee738b4568"]),
        };
        itemList.forEach((id) => {
            const item = items[id];
            const parent = item._parent;
            switch (true) {
                case (0, exports.checkParentRecursive)(parent, items, num >= 3 ? [exports.painKillerParent, exports.stimParent] : [exports.painKillerParent]): //stims
                    newItem.generation.stims["whitelist"] = [...newItem.generation.stims["whitelist"] || [], id];
                    break;
                case (0, exports.checkParentRecursive)(parent, items, [exports.medicalParent]): //drugs
                    newItem.generation.drugs["whitelist"] = [...newItem.generation.drugs["whitelist"] || [], id];
                    break;
                case (0, exports.checkParentRecursive)(parent, items, [exports.medKitParent]): //meds
                    newItem.generation.healing["whitelist"] = [...medkitsAdd[num], ...newItem.generation.healing["whitelist"] || [], id].filter(medKitID => !medkitsRemove[num].has(medKitID));
                    break;
                case (0, exports.checkParentRecursive)(parent, items, ["543be6564bdc2df4348b4568"]): //ThrowWeap
                    if (items[id]._props.ThrowType !== "smoke_grenade") {
                        newItem.generation.grenades["whitelist"] = [...newItem.generation.grenades["whitelist"] || [], id];
                    }
                    break;
                case (0, exports.checkParentRecursive)(parent, items, config_json_1.default.removePMCLootForLootingBots ? [exports.FoodDrinkParent] : [exports.barterParent, exports.FoodDrinkParent]): //FoodDrink/barter
                    newItem.generation.backpackLoot["whitelist"] = [...newItem.generation.backpackLoot["whitelist"] || [], id];
                    newItem.generation.pocketLoot["whitelist"] = [...newItem.generation.pocketLoot["whitelist"] || [], id];
                    newItem.generation.vestLoot["whitelist"] = [...newItem.generation.vestLoot["whitelist"] || [], id];
                    break;
                case (0, exports.checkParentRecursive)(parent, items, [exports.magParent]):
                    // newItem.generation.magazines["whitelist"] = [...newItem.generation.magazines["whitelist"] || [], id]
                    break;
                default:
                    break;
            }
        });
        Object.keys(newItem.generation).forEach((key) => {
            if (!newItem.generation[key]?.whitelist) {
                newItem.generation[key] = { ...newItem.generation[key], weights: { "0": 1 } };
            }
            else {
                newItem.generation[key].whitelist = (0, exports.deDupeArr)(newItem.generation[key].whitelist);
            }
        });
        randomizationItems.push(newItem);
    });
    // console.log(JSON.stringify(botConfig.equipment.pmc.randomisation))
    botConfig.equipment.pmc.randomisation = randomizationItems;
};
exports.buildInitialRandomization = buildInitialRandomization;
const buildInitialUsecAppearance = (appearance, items) => {
    appearance.feet = {
        "5cde95ef7d6c8b04713c4f2d": 15
    };
    appearance.body = {
        "5cde95d97d6c8b647a3769b0": 15
    };
    Object.keys(items).forEach(itemId => {
        const item = items[itemId];
        if (item?._props?.Side?.includes("Usec"))
            switch (true) {
                case item._props.BodyPart === "Head":
                    if (!appearance.head.includes(itemId))
                        appearance.head.push(itemId);
                    break;
                case item._props.BodyPart === "Hands":
                    if (!appearance.hands.includes(itemId))
                        appearance.hands.push(itemId);
                    break;
                // case item._parent === "5fc100cf95572123ae738483": // this adds voices
                //     if (!appearance.voice.includes(item._name)) appearance.voice.push(item._name)
                //     break;
                default:
                    break;
            }
    });
};
exports.buildInitialUsecAppearance = buildInitialUsecAppearance;
const buildInitialBearAppearance = (appearance, items) => {
    appearance.feet = {
        "5cc085bb14c02e000e67a5c5": 10
    };
    appearance.body = {
        "5cc0858d14c02e000c6bea66": 10
    };
    Object.keys(items).forEach(itemId => {
        const item = items[itemId];
        if (item?._props?.Side?.includes("Bear"))
            switch (true) {
                case item._props.BodyPart === "Head":
                    if (!appearance.head.includes(itemId))
                        appearance.head.push(itemId);
                    break;
                case item._props.BodyPart === "Hands":
                    if (!appearance.hands.includes(itemId))
                        appearance.hands.push(itemId);
                    break;
                // case item._parent === "5fc100cf95572123ae738483":
                //     if (!appearance.voice.includes(item._name)) appearance.voice.push(item._name)
                //     break;
                default:
                    break;
            }
    });
};
exports.buildInitialBearAppearance = buildInitialBearAppearance;
const buildClothingWeighting = (suit, items, botConfig, usecAppearance, bearAppearance) => {
    (0, exports.buildInitialUsecAppearance)(usecAppearance, items);
    (0, exports.buildInitialBearAppearance)(bearAppearance, items);
    // const levelSet = [...new Set(suit.map(value => value.requirements.profileLevel))].sort((a, b) => a - b)
    const levels = Object.values(config_json_1.levelRange);
    // const levels: number[][] = []
    // for (let index = 0; index < levelSet.length; index++) {
    //     let aPointer = levelSet[index] || 1;
    //     let bPointer = levelSet[index + 1];
    //     if (bPointer === 1) {
    //         bPointer = levelSet[index + 2]
    //         index++
    //     }
    //     const prevPointer = levelSet[index - 1]
    //     if (index > 0 && prevPointer + 1 !== aPointer) aPointer = prevPointer + 1
    //     if (aPointer + 1 === bPointer) {
    //         levels.push([aPointer, bPointer])
    //     } else {
    //         if (isNaN(bPointer) || (levelSet.length - 2) === index) bPointer = 100
    //         levels.push([aPointer, bPointer])
    //     } index++
    // }
    // console.log(levels)
    // botConfig.equipment.pmc.clothing = buildEmptyClothingAdjustments(levels)
    suit.forEach(({ suiteId, requirements: { profileLevel, loyaltyLevel } = {} }) => {
        if (!profileLevel || !suiteId || loyaltyLevel === undefined)
            return;
        if (profileLevel === 0)
            profileLevel = 1;
        const index = levels.findIndex(({ min, max }) => {
            if (profileLevel >= min && profileLevel <= max) {
                return true;
            }
        });
        if (index === -1)
            return console.log("Unable to find index for clothing item", items[suiteId]?._name);
        const clothingAdjust = botConfig.equipment.pmc.weightingAdjustmentsByBotLevel[index].clothing;
        if (index === undefined)
            return console.log('Empty index for: ', suiteId);
        if (items[suiteId]?._props?.Body) {
            switch (true) {
                case !!items[suiteId]?._name?.toLowerCase().includes("bear"):
                    bearAppearance.body[items[suiteId]._props.Body] = 1;
                    break;
                case !!items[suiteId]?._name?.toLowerCase().includes("usec"):
                    usecAppearance.body[items[suiteId]._props.Body] = 1;
                    break;
                default:
                    bearAppearance.body[items[suiteId]._props.Body] = 1;
                    usecAppearance.body[items[suiteId]._props.Body] = 1;
                    break;
            }
            if (!clothingAdjust?.edit["body"])
                clothingAdjust.edit["body"] = {};
            clothingAdjust.edit["body"][items[suiteId]._props.Body] = 10 + (index * 30);
        }
        if (items[suiteId]?._props?.Feet) {
            switch (true) {
                case !!items[suiteId]?._name?.toLowerCase().includes("bear"):
                    bearAppearance.feet[items[suiteId]._props.Feet] = 1;
                    break;
                case !!items[suiteId]?._name?.toLowerCase().includes("usec"):
                    usecAppearance.feet[items[suiteId]._props.Feet] = 1;
                    break;
                default:
                    bearAppearance.feet[items[suiteId]._props.Feet] = 1;
                    usecAppearance.feet[items[suiteId]._props.Feet] = 1;
                    break;
            }
            if (!clothingAdjust?.edit["feet"])
                clothingAdjust.edit["feet"] = {};
            clothingAdjust.edit["feet"][items[suiteId]._props.Feet] = 10 + (index * 30);
        }
    });
    // console.log(JSON.stringify(clothingAdjust))
    // saveToFile(items, "/customization.json")
    // saveToFile(bearAppearance, "/bear.json")
    // saveToFile(usecAppearance, "/usec.json")
    // saveToFile(clothingAdjust, "/clothingWeighting.json")
};
exports.buildClothingWeighting = buildClothingWeighting;
exports.weaponTypes = {
    "5447b6254bdc2dc3278b4568": [SightType.AssaultScope, SightType.OpticScope],
    "5447b6194bdc2d67278b4567": [SightType.AssaultScope, SightType.OpticScope],
    "5447b5fc4bdc2d87278b4567": [SightType.Collimator, SightType.AssaultScope],
    "5447b5f14bdc2d61278b4567": [SightType.CompactCollimator, SightType.Collimator, SightType.AssaultScope],
    "5447bed64bdc2d97278b4568": [SightType.CompactCollimator, SightType.Collimator],
    "5447b5e04bdc2d62278b4567": [SightType.CompactCollimator, SightType.Collimator],
    "5447bee84bdc2dc3278b4569": [SightType.CompactCollimator, SightType.Collimator],
    "5447b6094bdc2dc3278b4567": [SightType.CompactCollimator, SightType.Collimator],
    "5447b5cf4bdc2d65278b4567": [SightType.CompactCollimator, SightType.Collimator],
    "617f1ef5e8b54b0998387733": [SightType.CompactCollimator, SightType.Collimator],
    "5447bedf4bdc2d87278b4568": [SightType.CompactCollimator, SightType.Collimator], // GrenadeLauncher
};
const buildWeaponSightWhitelist = (items, botConfig, { 1: a, 2: b, 3: c, 4: d, 5: e }) => {
    botConfig.equipment.pmc.weaponSightWhitelist = {};
    return;
    const sightWhitelist = botConfig.equipment.pmc.weaponSightWhitelist;
    const traderItems = [...new Set([...a, ...b, ...c, ...d, ...e])]; //, ...d
    const blacklist = new Set(InternalBlacklist_1.default);
    traderItems.forEach(id => {
        if (blacklist.has(id))
            return;
        if ((0, exports.checkParentRecursive)(id, items, Object.values(SightType))) {
            for (const key in exports.weaponTypes) {
                const sightsToCheck = exports.weaponTypes[key];
                if ((0, exports.checkParentRecursive)(id, items, sightsToCheck)) {
                    if (!sightWhitelist[key])
                        sightWhitelist[key] = [];
                    sightWhitelist[key].push(id);
                }
            }
        }
    });
    // console.log(JSON.stringify(sightWhitelist))
};
exports.buildWeaponSightWhitelist = buildWeaponSightWhitelist;
const buildBlacklist = (items, botConfig, mods) => {
    delete botConfig.equipment.pmc.blacklist[0].equipment.mod_magazine;
    const currentBlacklist = (0, exports.cloneDeep)(botConfig.equipment.pmc.blacklist[0]);
    botConfig.equipment.pmc.blacklist = [];
    const blacklist = botConfig.equipment.pmc.blacklist;
    // const itemsToAddToBlacklist = ["mod_scope", "mod_magazine"]
    exports.numList.forEach((num, index) => {
        const modList = mods[num];
        const range = config_json_1.levelRange[num];
        const loyalty = num;
        const base = { ...(0, exports.cloneDeep)(currentBlacklist), levelRange: range };
        if (index < 2) {
            exports.numList.splice(0, index + 2).forEach((numInner) => {
                Object.keys(mods[numInner]).forEach(key => {
                    if (!base.equipment[key])
                        base.equipment[key] = [];
                    base.equipment[key].push(...mods[numInner][key]);
                });
            });
        }
        blacklist.push(base);
    });
};
exports.buildBlacklist = buildBlacklist;
exports.combinedForbiddenBullets = new Set(Object.values(advancedConfig_json_1.default.forbiddenBullets).flat(1));
exports.blacklistedItems = new Set([
    ...config_json_1.default.addDangerousBulletsToTier4Bots ? [] : exports.combinedForbiddenBullets,
    ...config_json_1.default.customBlacklist,
    ...InternalBlacklist_1.default
]);
