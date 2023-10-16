"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const advancedConfig_json_1 = __importDefault(require("../../config/advancedConfig.json"));
const config_json_1 = __importDefault(require("../../config/config.json"));
const utils_1 = require("./utils");
function ProgressionChanges(container) {
    const databaseServer = container.resolve("DatabaseServer");
    const configServer = container.resolve("ConfigServer");
    const botConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
    const pmcConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.PMC);
    const tables = databaseServer.getTables();
    const items = tables.templates.items;
    const customization = tables.templates.customization;
    const traders = tables.traders;
    const usecInventory = tables.bots.types.usec.inventory;
    const bearInventory = tables.bots.types.bear.inventory;
    // botConfig.secureContainerAmmoStackCount = 200
    // tables.bots.types.usec.inventory.mods = {}
    // tables.bots.types.bear.inventory.mods = {}
    // console.log(JSON.stringify(tables.bots.types.assault.inventory))
    const usecAppearance = tables.bots.types.usec.appearance;
    const bearAppearance = tables.bots.types.bear.appearance;
    pmcConfig.looseWeaponInBackpackChancePercent = 1;
    pmcConfig.looseWeaponInBackpackLootMinMax = { min: 0, max: 1 };
    const tradersToInclude = [
        'Prapor',
        'Therapist',
        'Skier',
        'Peacekeeper',
        'Mechanic',
        'Ragman',
        'Jaeger',
    ];
    const tradersToExclude = [
        "Unknown",
        "caretaker",
        'Fence',
        ...config_json_1.default.customTradersToExclude
    ];
    const traderList = Object.values(traders).filter(({ base }) => {
        if (config_json_1.default.addCustomTraderItems) {
            return !tradersToExclude.includes(base.nickname);
        }
        return tradersToInclude.includes(base.nickname);
    });
    botConfig.equipment.pmc.nvgIsActiveChanceNightPercent = 95;
    botConfig.equipment.pmc.lightIsActiveNightChancePercent = 95;
    botConfig.equipment.pmc.laserIsActiveChancePercent = 90;
    botConfig.equipment.pmc.faceShieldIsActiveChancePercent = 100;
    botConfig.equipment.pmc.weightingAdjustmentsByBotLevel = (0, utils_1.buildEmptyWeightAdjustments)();
    // >>>>>>>>>>>>>>> Working tradersMasterList <<<<<<<<<<<<<<<<<<
    const tradersMasterList = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set(), 5: new Set(Object.keys(items)) };
    const mods = { "1": {}, "2": {}, "3": {}, "4": {}, "5": {} };
    // SetBaseWhitelist
    botConfig.equipment.pmc.whitelist = (0, utils_1.setupBaseWhiteList)();
    let allTradersSuits = Object.values(traders).filter(({ suits }) => !!suits?.length).map(({ suits }) => suits).flat(1);
    if (config_json_1.default?.leveledClothing) {
        (0, utils_1.buildClothingWeighting)(allTradersSuits, customization, botConfig, usecAppearance, bearAppearance);
    }
    traderList.forEach(({ base: { nickname }, questassort, assort: { items: tradeItems, loyal_level_items, barter_scheme } = {}, }, index) => {
        if (!tradeItems || !nickname)
            return;
        // if (index === 0) console.log(JSON.stringify(questassort))
        if (config_json_1.default.addCustomTraderItems && ![...tradersToExclude, ...tradersToInclude].includes(nickname)) {
            console.log(`\nAlgorithmicLevelProgression: Attempting to add items for custom trader > ${nickname}!\n`);
        }
        tradeItems.forEach(({ _tpl, _id, parentId, slotId, }) => {
            if (tradersMasterList[5].has(_tpl))
                tradersMasterList[5].delete(_tpl);
            if (utils_1.blacklistedItems.has(_tpl) || utils_1.combinedForbiddenBullets.has(_tpl))
                return; //Remove blacklisted items and bullets
            const item = items[_tpl];
            if (!item)
                return console.log("AlgorithmicLevelProgression: Skipping custom item: ", _tpl, " for trader: ", nickname);
            const parent = item._parent;
            if (!parent || !items[parent])
                return console.log("AlgorithmicLevelProgression: Skipping custom item: ", _tpl, " for trader: ", nickname);
            const equipmentType = (0, utils_1.getEquipmentType)(parent, items);
            switch (true) {
                case (0, utils_1.checkParentRecursive)(parent, items, [utils_1.barterParent, utils_1.keyMechanical, utils_1.medsParent, utils_1.moneyParent]):
                    usecInventory.items.Pockets.push(_tpl);
                    bearInventory.items.Pockets.push(_tpl);
                    usecInventory.items.TacticalVest.push(_tpl);
                    bearInventory.items.TacticalVest.push(_tpl);
                    usecInventory.items.Backpack.push(_tpl);
                    bearInventory.items.Backpack.push(_tpl);
                    break;
                //Add Ammo
                case (0, utils_1.checkParentRecursive)(parent, items, [utils_1.AmmoParent]):
                    const calibre = item._props.Caliber || item._props.ammoCaliber;
                    if (calibre) {
                        usecInventory.Ammo[calibre] =
                            { ...usecInventory.Ammo[calibre] || {}, [_tpl]: 1 };
                        bearInventory.Ammo[calibre] =
                            { ...bearInventory.Ammo[calibre] || {}, [_tpl]: 1 };
                        // usecInventory.items.Pockets.push(_tpl)
                        // bearInventory.items.Pockets.push(_tpl)
                        // usecInventory.items.Backpack.push(_tpl)
                        // bearInventory.items.Backpack.push(_tpl)
                        // usecInventory.items.TacticalVest.push(_tpl)
                        // bearInventory.items.TacticalVest.push(_tpl)
                        usecInventory.items.SecuredContainer.push(_tpl);
                        bearInventory.items.SecuredContainer.push(_tpl);
                    }
                    else {
                        console.log(item._name, " likely has the incorrect calibre: ", calibre);
                    }
                    break;
                case (0, utils_1.checkParentRecursive)(parent, items, [utils_1.magParent]):
                    usecInventory.items.SecuredContainer.push(_tpl);
                    bearInventory.items.SecuredContainer.push(_tpl);
                    break;
                // case equipmentType === "mod_scope":
                //     break;
                // Check if revolver shotgun
                case _tpl === "60db29ce99594040e04c4a27":
                    if (!usecInventory.equipment["FirstPrimaryWeapon"])
                        usecInventory.equipment["FirstPrimaryWeapon"] = {};
                    if (!bearInventory.equipment["FirstPrimaryWeapon"])
                        bearInventory.equipment["FirstPrimaryWeapon"] = {};
                    usecInventory.equipment["FirstPrimaryWeapon"][_tpl] = 1;
                    bearInventory.equipment["FirstPrimaryWeapon"][_tpl] = 1;
                    break;
                // Add matching equipment
                case !!equipmentType:
                    if (!usecInventory.equipment[equipmentType])
                        usecInventory.equipment[equipmentType] = {};
                    if (!bearInventory.equipment[equipmentType])
                        bearInventory.equipment[equipmentType] = {};
                    usecInventory.equipment[equipmentType][_tpl] = 1;
                    bearInventory.equipment[equipmentType][_tpl] = 1;
                    break;
                default:
                    break;
            }
            const loyaltyLevel = loyal_level_items[_id] || loyal_level_items[parentId];
            //Set trader list for levels
            if (loyaltyLevel) {
                const barterSchemeRef = barter_scheme[_id] || barter_scheme[parentId];
                switch (true) {
                    // If large magazine
                    case (0, utils_1.checkParentRecursive)(_tpl, items, [utils_1.magParent]) && item?._props?.Cartridges?.[0]?._max_count > 39:
                        // if (item?._props?.Cartridges?.[0]?._max_count > 39) {
                        //     tradersMasterList[5].add(_tpl)
                        //     return
                        // }
                        // tradersMasterList[loyaltyLevel].add(_tpl)
                        // addToModsObject(mods, _tpl, items, loyaltyLevel, slotId)
                        break;
                    // Check if its a quest unlocked trade    
                    case !!questassort.success[_id]:
                        if (!config_json_1.default?.questUnlockedItemsShifted) {
                            tradersMasterList[loyaltyLevel].add(_tpl);
                            (0, utils_1.addToModsObject)(mods, _tpl, items, loyaltyLevel, slotId);
                        }
                        else {
                            if (loyaltyLevel === 4) {
                                tradersMasterList[4].add(_tpl);
                                (0, utils_1.addToModsObject)(mods, _tpl, items, 4, slotId);
                            }
                            else {
                                tradersMasterList[loyaltyLevel + 1].add(_tpl);
                                (0, utils_1.addToModsObject)(mods, _tpl, items, loyaltyLevel + 1, slotId);
                            }
                        }
                        break;
                    // Only add the item if it's a cash trade or if tradeItems are not shifted
                    case items[barterSchemeRef?.[0]?.[0]?._tpl]?._parent === utils_1.moneyParent || !config_json_1.default?.tradedItemsShifted:
                        tradersMasterList[loyaltyLevel].add(_tpl);
                        (0, utils_1.addToModsObject)(mods, _tpl, items, loyaltyLevel, slotId);
                        break;
                    // Then it's a tradeItem
                    default:
                        if ((loyaltyLevel + 2) > 4) {
                            tradersMasterList[4].add(_tpl);
                            (0, utils_1.addToModsObject)(mods, _tpl, items, 4, slotId);
                        }
                        else {
                            tradersMasterList[loyaltyLevel + 2].add(_tpl);
                            (0, utils_1.addToModsObject)(mods, _tpl, items, loyaltyLevel + 2, slotId);
                        }
                        break;
                }
            }
        });
    });
    //Setup beast mod level 5
    tradersMasterList[5].forEach(id => {
        if (utils_1.blacklistedItems.has(id) || utils_1.combinedForbiddenBullets.has(id) || !items[id]._parent || !items[id]._props || !items[id]._name) {
            tradersMasterList[5].delete(id);
        }
        else {
            const item = items[id];
            const parent = items[id]?._parent;
            if (!item || !parent)
                return;
            const equipmentType = (0, utils_1.getEquipmentType)(parent, items);
            switch (true) {
                case (0, utils_1.checkParentRecursive)(parent, items, [utils_1.AmmoParent]):
                    const calibre = item._props.Caliber || item._props.ammoCaliber;
                    if (calibre) {
                        usecInventory.Ammo[calibre] =
                            { ...usecInventory.Ammo[calibre] || {}, [id]: 1 };
                        bearInventory.Ammo[calibre] =
                            { ...bearInventory.Ammo[calibre] || {}, [id]: 1 };
                    }
                    break;
                case equipmentType === "Pockets":
                    // This is wierd sized pockets
                    // console.log(item._name, item._props.ShortName)
                    break;
                case !!equipmentType:
                    if (!usecInventory.equipment[equipmentType])
                        usecInventory.equipment[equipmentType] = {};
                    if (!bearInventory.equipment[equipmentType])
                        bearInventory.equipment[equipmentType] = {};
                    usecInventory.equipment[equipmentType][id] = 1;
                    bearInventory.equipment[equipmentType][id] = 1;
                    break;
                default:
                    break;
            }
        }
    });
    const combinedNumList = new Set([...tradersMasterList[1], ...tradersMasterList[2], ...tradersMasterList[3], ...tradersMasterList[4]]);
    //TODO: keep an eye on this.. this might be a bad idea.
    const combinedNumWith5List = new Set([...combinedNumList, ...tradersMasterList[5]]);
    (0, utils_1.buildWeaponSightWhitelist)(items, botConfig, tradersMasterList);
    (0, utils_1.buildOutModsObject)(combinedNumWith5List, items, usecInventory, botConfig);
    bearInventory.mods = (0, utils_1.cloneDeep)(usecInventory.mods);
    (0, utils_1.setupMods)(mods);
    (0, utils_1.addKeysToPockets)(combinedNumList, items, tables.bots.types.assault.inventory);
    usecInventory.items.SecuredContainer.push("5e99711486f7744bfc4af328");
    bearInventory.items.SecuredContainer.push("5e99711486f7744bfc4af328");
    // Remove duplicate items for all arrays
    usecInventory.items.SecuredContainer = (0, utils_1.deDupeArr)(usecInventory.items.SecuredContainer);
    bearInventory.items.SecuredContainer = (0, utils_1.deDupeArr)(bearInventory.items.SecuredContainer);
    usecInventory.items.Backpack = config_json_1.default.removePMCLootForLootingBots ? [] : (0, utils_1.deDupeArr)(usecInventory.items.Backpack);
    bearInventory.items.Backpack = config_json_1.default.removePMCLootForLootingBots ? [] : (0, utils_1.deDupeArr)(bearInventory.items.Backpack);
    usecInventory.items.Pockets = (0, utils_1.deDupeArr)(usecInventory.items.Pockets);
    bearInventory.items.Pockets = (0, utils_1.deDupeArr)(bearInventory.items.Pockets);
    usecInventory.items.TacticalVest = (0, utils_1.deDupeArr)(usecInventory.items.TacticalVest);
    bearInventory.items.TacticalVest = (0, utils_1.deDupeArr)(bearInventory.items.TacticalVest);
    usecInventory.items.SpecialLoot = (0, utils_1.deDupeArr)(usecInventory.items.SpecialLoot);
    bearInventory.items.SpecialLoot = (0, utils_1.deDupeArr)(bearInventory.items.SpecialLoot);
    //Make everything level 1 in equipment
    (0, utils_1.reduceEquipmentChancesTo1)(usecInventory);
    (0, utils_1.reduceEquipmentChancesTo1)(bearInventory);
    (0, utils_1.reduceAmmoChancesTo1)(usecInventory);
    (0, utils_1.reduceAmmoChancesTo1)(bearInventory);
    // Eliminates duplicate id's in later levels
    utils_1.numList.forEach((num) => {
        tradersMasterList[num].forEach((id) => {
            utils_1.numList.slice(num, 5).forEach(numListNum => {
                tradersMasterList[numListNum].delete(id);
            });
        });
    });
    if (botConfig.equipment.pmc.blacklist?.[0]?.equipment) {
        if (!botConfig.equipment.pmc.blacklist?.[0]?.equipment?.FirstPrimaryWeapon)
            botConfig.equipment.pmc.blacklist[0].equipment.FirstPrimaryWeapon = [];
        if (!botConfig.equipment.pmc.blacklist?.[0]?.equipment?.mod_scope)
            botConfig.equipment.pmc.blacklist[0].equipment.mod_scope = [];
        if (!botConfig.equipment.pmc.blacklist?.[0]?.equipment?.mod_handguard)
            botConfig.equipment.pmc.blacklist[0].equipment.mod_handguard = [];
        if (!botConfig.equipment.pmc.blacklist?.[0]?.equipment?.Headwear)
            botConfig.equipment.pmc.blacklist[0].equipment.Headwear = [];
        botConfig.equipment.pmc.blacklist[0].equipment.FirstPrimaryWeapon.push("624c0b3340357b5f566e8766", "624c0b3340357b5f566e8766", "6217726288ed9f0845317459", "62389be94d5d474bf712e709");
        botConfig.equipment.pmc.blacklist[0].equipment.mod_scope.push("544a3d0a4bdc2d1b388b4567");
        botConfig.equipment.pmc.blacklist[0].equipment.mod_stock.push("5a0c59791526d8dba737bba7");
        botConfig.equipment.pmc.blacklist[0].equipment.Headwear.push("5c066ef40db834001966a595");
    }
    (0, utils_1.setWhitelists)(items, botConfig, tradersMasterList, mods);
    (0, utils_1.setWeightingAdjustments)(items, botConfig, tradersMasterList, mods);
    (0, utils_1.buildInitialRandomization)(items, botConfig, tradersMasterList);
    Object.keys(advancedConfig_json_1.default.otherBotTypes).forEach(botType => {
        botConfig.equipment[botType] = { ...botConfig.equipment[botType], ...advancedConfig_json_1.default.otherBotTypes[botType] };
    });
    if (config_json_1.default.removeScavLootForLootingBots && botConfig?.equipment?.assault?.randomisation?.[0]?.generation) {
        const generation = botConfig.equipment.assault.randomisation[0].generation;
        generation.backpackLoot = {
            ...generation.looseLoot || {},
            "weights": { "0": 1 }, "whitelist": []
        };
        generation.pocketLoot = {
            ...generation.looseLoot || {},
            "weights": { "0": 1 }, "whitelist": []
        };
        generation.vestLoot = {
            ...generation.looseLoot || {},
            "weights": { "0": 1 },
            "whitelist": []
        };
    }
    // console.log(JSON.stringify(botConfig.equipment.pmc.weightingAdjustments[4]))
    // saveToFile(usecInventory, "refDBS/refPMC.json")
    // saveToFile(botConfig.equipment.pmc, "refDBS/weightings.json")
    config_json_1.default.debug && console.log("Algorthimic Progression: Equipment DB updated");
}
exports.default = ProgressionChanges;
// // >>>>>>>>>>>>>>> Working DB <<<<<<<<<<<<<<<<<<
// interface ItemNode {
//     name: string;
//     id: string;
//     parent: string;
//     nodes: Nodes
// }
// type Nodes = {
//     [id: string]: ItemNode
// }
// const buildDBObject = (parent: string, items: Record<string, ITemplateItem>): Nodes => {
//     const itemList = Object.keys(items);
//     const dbObject = {} as Nodes
//     itemList.forEach((itemID) => {
//         const item = items[itemID]
//         if (item._parent === parent) {
//             dbObject[item._name] = {
//                 name: item._name,
//                 id: item._id,
//                 parent: item._parent,
//                 nodes: buildDBObject(item._id, items)
//             }
//         }
//     })
//     return dbObject
// }
// const nodes = buildDBObject("54009119af1c881c07000029", items)
// // const getAmmoWeighting = (pen, dam) => (pen * 2) + (dam * 0.2)
// // Build Ammo types
// // >>>>>>>>>>>>>>> Ammo DB <<<<<<<<<<<<<<<<<<
// const ammoTypes = {}
// const ammo = Object.values(nodes?.StackableItem?.nodes?.Ammo?.nodes || {}).map(({ id }) => items[id])
// ammo.forEach(({ _props: { Damage, PenetrationPower }, _name, _id }) => {
//     if (_name.includes("patron")) {
//         const calibre = _name.split("_")[1].toLowerCase()
//         ammoTypes[calibre] = { ...ammoTypes[calibre] || {}, [_name]: { id: _id, Damage, PenetrationPower } }
//     }
// })
