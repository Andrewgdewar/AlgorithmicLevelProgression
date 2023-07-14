"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = __importDefault(require("../config/config.json"));
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const utils_1 = require("./utils");
const EquipmentSlots_1 = require("C:/snapshot/project/obj/models/enums/EquipmentSlots");
function ProgressionChanges(container) {
    //Next tasks
    // - Make whiteList with levels (Try to incorporate the items that come with usec base) >
    // - Make function to set items value in equipment/ammo
    // - determine ammo/equipment weightingAdjustments to "edit" lower as the level increases
    // - Build randomisation
    // - Add clothing levels
    const databaseServer = container.resolve("DatabaseServer");
    const configServer = container.resolve("ConfigServer");
    const botConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
    const tables = databaseServer.getTables();
    const items = tables.templates.items;
    const traders = tables.traders;
    const { levelRange } = config_json_1.default;
    // Object.keys(tables.bots.types.usec.inventory.equipment).forEach((key) => {
    //     tables.bots.types.usec.inventory.equipment[key] = {}
    // })
    // Object.keys(tables.bots.types.bear.inventory.equipment).forEach((key) => {
    //     tables.bots.types.bear.inventory.equipment[key] = {}
    // })
    const usecInventory = tables.bots.types.usec.inventory;
    const bearInventory = tables.bots.types.bear.inventory;
    const AmmoParent = "5485a8684bdc2da71d8b4567";
    const magParent = "5448bc234bdc2d3c308b4569";
    const barterParent = "5448eb774bdc2d0a728b4567";
    const keyParent = "543be5e94bdc2df1348b4568";
    const medsParent = "543be5664bdc2dd4348b4569";
    const modParent = "5448fe124bdc2da5018b4567";
    const moneyParent = "543be5dd4bdc2deb348b4569";
    // Fix PP-9 
    tables.templates.items["57f4c844245977379d5c14d1"]._props.ammoCaliber = "Caliber9x18PM";
    // Fix MP-19 
    tables.templates.items["61f7c9e189e6fb1a5e3ea78d"]._props.BoltAction = true;
    // Add rhino clip
    const tradersToInclude = [
        'Prapor',
        'Therapist',
        'Skier',
        'Peacekeeper',
        'Mechanic',
        'Ragman',
        'Jaeger',
    ];
    const traderList = Object.values(traders).filter(({ base }) => tradersToInclude.includes(base.nickname));
    // >>>>>>>>>>>>>>> Working tradersMasterList <<<<<<<<<<<<<<<<<<
    const tradersMasterList = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set() };
    // SetBaseWhitelist
    botConfig.equipment.pmc.whitelist = (0, utils_1.setupBaseWhiteList)();
    traderList.forEach(({ assort: { items: tradItems, loyal_level_items, barter_scheme } = {}, }) => {
        if (!tradItems)
            return;
        tradItems.forEach(({ _tpl, _id, parentId }, key) => {
            const item = items[_tpl];
            const parent = item._parent;
            const equipmentType = (0, utils_1.getEquipmentType)(parent);
            switch (true) {
                case (0, utils_1.checkParentRecursive)(parent, items, [barterParent, keyParent, medsParent, modParent, moneyParent]):
                    usecInventory.items.Pockets.push(_tpl);
                    bearInventory.items.Pockets.push(_tpl);
                    usecInventory.items.TacticalVest.push(_tpl);
                    bearInventory.items.TacticalVest.push(_tpl);
                    usecInventory.items.Backpack.push(_tpl);
                    bearInventory.items.Backpack.push(_tpl);
                    break;
                //Add Ammo
                case (0, utils_1.checkParentRecursive)(parent, items, [AmmoParent]):
                    const calibre = item._props.Caliber || item._props.ammoCaliber;
                    if (calibre) {
                        usecInventory.Ammo[calibre] =
                            { ...usecInventory.Ammo[calibre] || {}, [_tpl]: 1 };
                        bearInventory.Ammo[calibre] =
                            { ...bearInventory.Ammo[calibre] || {}, [_tpl]: 1 };
                    }
                    else {
                        console.log(item._name, " likely has the incorrect calibre: ", calibre);
                    }
                    usecInventory.items.Pockets.push(_tpl);
                    bearInventory.items.Pockets.push(_tpl);
                    usecInventory.items.Backpack.push(_tpl);
                    bearInventory.items.Backpack.push(_tpl);
                    usecInventory.items.TacticalVest.push(_tpl);
                    bearInventory.items.TacticalVest.push(_tpl);
                    usecInventory.items.SecuredContainer.push(_tpl);
                    bearInventory.items.SecuredContainer.push(_tpl);
                    break;
                // Add matching equipment
                case !!equipmentType:
                    if ((equipmentType === EquipmentSlots_1.EquipmentSlots.HOLSTER
                        || equipmentType === EquipmentSlots_1.EquipmentSlots.FIRST_PRIMARY_WEAPON)) {
                        const newModObject = {};
                        if (item?._props.Slots.length > 0) {
                            item._props.Slots.forEach(mod => {
                                if (mod._props?.filters?.[0]?.Filter?.length) {
                                    // console.log(item._name, "adding ", mod._props?.filters[0].Filter.length, mod._name)
                                    newModObject[mod._name] = mod._props?.filters[0].Filter;
                                }
                            });
                        }
                        if (item._props?.Chambers?.[0]?._name === "patron_in_weapon" &&
                            item._props?.Chambers?.[0]?._props?.filters?.[0]?.Filter?.length) {
                            // console.log("adding ", item._props.Chambers[0]._props?.filters[0].Filter.length, "bullet types")
                            newModObject["patron_in_weapon"] = item._props.Chambers[0]._props?.filters[0].Filter;
                        }
                        if (Object.keys(newModObject)) {
                            usecInventory.mods[_tpl] = newModObject;
                            bearInventory.mods[_tpl] = newModObject;
                        }
                    }
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
                // Only add the item if it's a cash trade
                if (items[barterSchemeRef?.[0]?.[0]?._tpl]?._parent === moneyParent) {
                    tradersMasterList[loyaltyLevel].add(_tpl);
                }
                else {
                    //Do something with the barter items, Maybe set to the next level higher?
                }
            }
            else {
                // these are weapon components that come with the rifle. no need to add them.
            }
        });
    });
    console.log(botConfig.equipment.pmc.whitelist);
    // Remove duplicate items for all arrays
    usecInventory.items.SecuredContainer = (0, utils_1.deDupeArr)(usecInventory.items.SecuredContainer);
    bearInventory.items.SecuredContainer = (0, utils_1.deDupeArr)(bearInventory.items.SecuredContainer);
    usecInventory.items.Backpack = (0, utils_1.deDupeArr)(usecInventory.items.Backpack);
    bearInventory.items.Backpack = (0, utils_1.deDupeArr)(bearInventory.items.Backpack);
    usecInventory.items.Pockets = (0, utils_1.deDupeArr)(usecInventory.items.Pockets);
    bearInventory.items.Pockets = (0, utils_1.deDupeArr)(bearInventory.items.Pockets);
    usecInventory.items.TacticalVest = (0, utils_1.deDupeArr)(usecInventory.items.TacticalVest);
    bearInventory.items.TacticalVest = (0, utils_1.deDupeArr)(bearInventory.items.TacticalVest);
    usecInventory.items.SpecialLoot = (0, utils_1.deDupeArr)(usecInventory.items.SpecialLoot);
    bearInventory.items.SpecialLoot = (0, utils_1.deDupeArr)(bearInventory.items.SpecialLoot);
    // Eliminates duplicate id's in later levels
    utils_1.numList.forEach((num) => {
        tradersMasterList[num].forEach((id) => {
            utils_1.numList.slice(num, 4).forEach(numListNum => {
                tradersMasterList[numListNum].delete(id);
            });
        });
    });
    const updatedData = {
        blacklist: [],
        weaponModLimits: {},
        weaponSightWhitelist: {},
        clothing: [],
        randomisation: [],
        ...botConfig.equipment.pmc,
        whitelist: [],
        weightingAdjustments: [],
    };
    if (updatedData?.blacklist?.[0]?.equipment?.FirstPrimaryWeapon) {
        updatedData.blacklist[0].equipment.FirstPrimaryWeapon = ["624c0b3340357b5f566e8766"];
    }
    // console.log(JSON.stringify(usecInventory))
    (0, utils_1.setWhitelists)(items, botConfig, tradersMasterList);
    console.log(JSON.stringify(botConfig.equipment.pmc.whitelist));
    // for (let index = 0; index < numList.length; index++) {
    //     const loyalty = numList[index];
    //     const itemList = [...tradersMasterList[loyalty]]
    //     const copyOfPreviousWhitelist = !!updatedData.whitelist[index - 1] ?
    //         cloneDeep(updatedData.whitelist[index - 1]) :
    //         { equipment: {}, cartridge: {} }
    //     const whitelistItem = {
    //         ...copyOfPreviousWhitelist,
    //         levelRange: levelRange[loyalty],
    //     } as EquipmentFilterDetails
    //     // const weightingAdjustmentItem = {
    //     //     levelRange: levelRange[loyalty],
    //     //     ammo: { add: {}, edit: {} },
    //     //     equipment: { add: {}, edit: {} },
    //     //     // clothing: {} //Implement later
    //     // } as WeightingAdjustmentDetails
    //     for (let k = 0; k < itemList.length; k++) {
    //         const id = itemList[k];
    //         const item = items[id]
    //         const parent = item._parent
    //         if (parent === AmmoParent) {
    //             const calibre = item._props.Caliber || item._props.ammoCaliber
    //             whitelistItem.cartridge[calibre] =
    //                 [...whitelistItem.cartridge[calibre] ? whitelistItem.cartridge[calibre] : [], id]
    //             // if (!weightingAdjustmentItem.ammo.add?.[calibre]) { weightingAdjustmentItem.ammo.add = { ...weightingAdjustmentItem.ammo.add, [calibre]: {} } }
    //             // const ammoWeight = getAmmoWeighting(items[id])
    //             // weightingAdjustmentItem.ammo.add[calibre] =
    //             //     { ...weightingAdjustmentItem.ammo.add[calibre] || {}, [id]: ammoWeight }
    //             continue
    //         }
    //         const equipmentType = getEquipmentType(parent)
    //         if (equipmentType) {
    //             whitelistItem.equipment[equipmentType] =
    //                 [...whitelistItem.equipment[equipmentType] ? whitelistItem.equipment[equipmentType] : [], id]
    //         }
    //     }
    // updatedData.whitelist.push(whitelistItem)
    // const combinedWhiteLists = {} as EquipmentFilterDetails
    // for (const key of updatedData.whitelist) {
    //     mergeDeep(combinedWhiteLists, key)
    // }
    // const combinedWeightingAdjustmentItem = {} as WeightingAdjustmentDetails
    // for (const key of updatedData.weightingAdjustments) {
    //     mergeDeep(combinedWeightingAdjustmentItem, key)
    // }
    // mergeDeep(combinedWeightingAdjustmentItem, weightingAdjustmentItem)
    // for (let k = 0; k < itemList.length; k++) {
    //     const id = itemList[k];
    //     const item = items[id]
    //     const parent = item._parent
    //     const equipmentType = getEquipmentType(parent)
    //     switch (true) {
    //         case items[parent]?._parent === "5422acb9af1c889c16000029": // Ammo Parent
    //             const calibre = item._props.Caliber || item._props.ammoCaliber
    //             if (combinedWhiteLists?.cartridge?.[calibre]) {
    //                 if (!weightingAdjustmentItem.equipment.add?.[equipmentType]) {
    //                     weightingAdjustmentItem.equipment.add = { ...weightingAdjustmentItem.equipment.add, [equipmentType]: {} }
    //                 }
    //                 const highestScoringAmmo = getHighestScoringAmmoValue(combinedWeightingAdjustmentItem.ammo.add[calibre])
    //                 const weaponRating = getWeaponWeighting(item, highestScoringAmmo)
    //                 usecInventory.equipment[equipmentType][id] = weaponRating
    //                 bearInventory.equipment[equipmentType][id] = weaponRating
    //                 weightingAdjustmentItem.equipment.add[equipmentType] = {
    //                     ...weightingAdjustmentItem.equipment.add[equipmentType] || {},
    //                     [id]: weaponRating
    //                 }
    //             } else {
    //                 console.log(item._name, " likely has the incorrect calibre: ", calibre)
    //             }
    //             break;
    //         case parent === "5448e54d4bdc2dcc718b4568": //"ArmorParent"
    //             if (!weightingAdjustmentItem.equipment.add?.[equipmentType]) {
    //                 weightingAdjustmentItem.equipment.add = { ...weightingAdjustmentItem.equipment.add, [equipmentType]: {} }
    //             }
    //             const armorRating = getArmorRating(item)
    //             usecInventory.equipment[equipmentType][id] = armorRating
    //             bearInventory.equipment[equipmentType][id] = armorRating
    //             weightingAdjustmentItem.equipment.add[equipmentType] = {
    //                 ...weightingAdjustmentItem.equipment.add[equipmentType] || {},
    //                 [id]: armorRating
    //             }
    //             break;
    //         case equipmentType === "Magazine" && !!item._props.Cartridges[0]._max_count: //"MagazineParent"
    //             if (!weightingAdjustmentItem.equipment.add?.[equipmentType]) {
    //                 weightingAdjustmentItem.equipment.add = { ...weightingAdjustmentItem.equipment.add, [equipmentType]: {} }
    //             }
    //             weightingAdjustmentItem.equipment.add[equipmentType] = {
    //                 ...weightingAdjustmentItem.equipment.add[equipmentType] || {},
    //                 [id]: item._props.Cartridges[0]._max_count
    //             }
    //             break;
    //         default:
    //             if (!!equipmentType) {
    //                 if (!weightingAdjustmentItem.equipment.add?.[equipmentType]) {
    //                     weightingAdjustmentItem.equipment.add = { ...weightingAdjustmentItem.equipment.add, [equipmentType]: {} }
    //                 }
    //                 usecInventory.equipment[equipmentType][id] = 1
    //                 bearInventory.equipment[equipmentType][id] = 1
    //                 weightingAdjustmentItem.equipment.add[equipmentType] = {
    //                     ...weightingAdjustmentItem.equipment.add[equipmentType] || {},
    //                     [id]: 1
    //                 }
    //             } else {
    //                 // console.log(item._parent, "=", items[item._parent]._name)
    //             }
    //             break;
    //     }
    // }
    // updatedData.weightingAdjustments.push(weightingAdjustmentItem)
    // }
    // botConfig.equipment.pmc = updatedData
    // console.log(JSON.stringify(updatedData))
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
