"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const utils_1 = require("./utils");
function ProgressionChanges(container) {
    //Next tasks
    // - Make whiteList with levels (Try to incorporate the items that come with usec base) 1/2
    // - Make function to set items value in equipment/ammo < done
    // - determine ammo/equipment weightingAdjustments to "edit" lower as the level increases> not needed
    // - Build randomisation
    // - Add clothing levels
    const databaseServer = container.resolve("DatabaseServer");
    const configServer = container.resolve("ConfigServer");
    const botConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
    const tables = databaseServer.getTables();
    const items = tables.templates.items;
    const traders = tables.traders;
    const usecInventory = tables.bots.types.usec.inventory;
    const bearInventory = tables.bots.types.bear.inventory;
    tables.bots.types.usec.inventory.mods = {};
    tables.bots.types.bear.inventory.mods = {};
    // Fix PP-9 
    // tables.templates.items["57f4c844245977379d5c14d1"]._props.ammoCaliber = "Caliber9x18PM"
    const tradersToInclude = [
        'Prapor',
        'Therapist',
        'Skier',
        'Peacekeeper',
        'Mechanic',
        'Ragman',
        'Jaeger',
    ];
    console.log(botConfig.lootNValue);
    const traderList = Object.values(traders).filter(({ base }) => tradersToInclude.includes(base.nickname));
    // >>>>>>>>>>>>>>> Working tradersMasterList <<<<<<<<<<<<<<<<<<
    const tradersMasterList = { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set() };
    const itemCosts = {};
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
                case (0, utils_1.checkParentRecursive)(parent, items, [utils_1.barterParent, utils_1.keyParent, utils_1.medsParent, utils_1.modParent, utils_1.moneyParent]):
                    if (utils_1.modParent) {
                        // usecInventory.mods
                        // usecInventory.mods
                    }
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
                        usecInventory.items.Pockets.push(_tpl);
                        bearInventory.items.Pockets.push(_tpl);
                        usecInventory.items.Backpack.push(_tpl);
                        bearInventory.items.Backpack.push(_tpl);
                        usecInventory.items.TacticalVest.push(_tpl);
                        bearInventory.items.TacticalVest.push(_tpl);
                        usecInventory.items.SecuredContainer.push(_tpl);
                        bearInventory.items.SecuredContainer.push(_tpl);
                    }
                    else {
                        console.log(item._name, " likely has the incorrect calibre: ", calibre);
                    }
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
                if ((0, utils_1.checkParentRecursive)(_tpl, items, [utils_1.magParent]) && item?._props?.Cartridges?.[0]?._max_count > 50) {
                    // Take big mags and put them to level 4
                    tradersMasterList[4].add(_tpl);
                }
                else if (items[barterSchemeRef?.[0]?.[0]?._tpl]?._parent === utils_1.moneyParent) {
                    // Only add the item if it's a cash trade
                    tradersMasterList[loyaltyLevel].add(_tpl);
                }
                else {
                    if (loyaltyLevel === 4)
                        tradersMasterList[loyaltyLevel].add(_tpl);
                    else
                        tradersMasterList[loyaltyLevel + 1].add(_tpl);
                }
                itemCosts[_tpl] = barterSchemeRef?.[0]?.[0]?.count;
                (0, utils_1.buildOutModsObject)(_tpl, items, usecInventory);
                (0, utils_1.buildOutModsObject)(_tpl, items, bearInventory);
            }
            else {
                // these are weapon components that come with the rifle. no need to add them.
            }
        });
    });
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
    //Make everything level 1 in equipment
    (0, utils_1.reduceEquipmentChancesTo1)(usecInventory);
    (0, utils_1.reduceEquipmentChancesTo1)(bearInventory);
    (0, utils_1.reduceAmmoChancesTo1)(usecInventory);
    (0, utils_1.reduceAmmoChancesTo1)(bearInventory);
    // Eliminates duplicate id's in later levels
    utils_1.numList.forEach((num) => {
        tradersMasterList[num].forEach((id) => {
            utils_1.numList.slice(num, 4).forEach(numListNum => {
                tradersMasterList[numListNum].delete(id);
            });
        });
    });
    if (botConfig.equipment.pmc.blacklist?.[0]?.equipment?.FirstPrimaryWeapon) {
        botConfig.equipment.pmc.blacklist[0].equipment.FirstPrimaryWeapon = ["624c0b3340357b5f566e8766", "6217726288ed9f0845317459"];
    }
    // setWhitelists(items, botConfig, tradersMasterList)
    (0, utils_1.setWeightingAdjustments)(items, botConfig, tradersMasterList, itemCosts);
    (0, utils_1.buildInitialRandomization)(items, botConfig, tradersMasterList);
    // botConfig.equipment.pmc.weightingAdjustments = []
    // botConfig.equipment.pmc.randomisation = []
    // console.log(JSON.stringify(botConfig.equipment.pmc))
    // console.log(JSON.stringify(usecInventory))
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
