import { IBotConfig } from './../types/models/spt/config/IBotConfig.d';
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { DependencyContainer } from "tsyringe";
import config from "../config/config.json";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import {
    AmmoParent,
    TradersMasterList,
    barterParent,
    buildClothingWeighting,
    buildInitialRandomization,
    buildOutModsObject,
    checkParentRecursive, deDupeArr,
    getEquipmentType, keyParent, magParent, medsParent, modParent, moneyParent, numList,
    reduceAmmoChancesTo1,
    reduceEquipmentChancesTo1,
    setWeightingAdjustments, setWhitelists, setupBaseWhiteList, buildInitialBearAppearance, buildInitialUsecAppearance, setupMods, buildWeaponSightWhitelist
} from './utils';
import { ISuit } from '@spt-aki/models/eft/common/tables/ITrader';


export default function ProgressionChanges(
    container: DependencyContainer
): undefined {

    // Next tasks
    // Update weapon weight with higher balance && Confirm ammo weighting is working correctly 
    // Fix issue with sights not functioning maybe utilize "mod_scope" seen in blacklist
    // Make the trade items optional in config

    const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
    const configServer = container.resolve<ConfigServer>("ConfigServer");
    const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
    const tables = databaseServer.getTables();
    const items = tables.templates.items;
    const customization = tables.templates.customization;
    const traders = tables.traders

    const usecInventory = tables.bots.types.usec.inventory
    const bearInventory = tables.bots.types.bear.inventory

    tables.bots.types.usec.inventory.mods = {}
    tables.bots.types.bear.inventory.mods = {}

    const usecAppearance = tables.bots.types.usec.appearance
    const bearAppearance = tables.bots.types.bear.appearance

    botConfig.pmc.looseWeaponInBackpackChancePercent = 1
    botConfig.pmc.looseWeaponInBackpackLootMinMax = { min: 0, max: 1 }

    const tradersToInclude = [
        'Prapor',
        'Therapist',
        'Skier',
        'Peacekeeper',
        'Mechanic',
        'Ragman',
        'Jaeger',
    ]

    const traderList = Object.values(traders).filter(({ base }) => tradersToInclude.includes(base.nickname))


    // >>>>>>>>>>>>>>> Working tradersMasterList <<<<<<<<<<<<<<<<<<
    const tradersMasterList: TradersMasterList =
        { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set() }

    const mods = { "1": {}, "2": {}, "3": {}, "4": {} }

    // SetBaseWhitelist
    botConfig.equipment.pmc.whitelist = setupBaseWhiteList()

    const { suits } = Object.values(traders).find(({ base }) => "Ragman" === base.nickname) as any

    if (config?.leveledClothing) {
        buildInitialUsecAppearance(usecAppearance)
        buildInitialBearAppearance(bearAppearance)
        buildClothingWeighting(suits, customization, botConfig)
    }

    traderList.forEach(({ questassort, assort: { items: tradItems, loyal_level_items, barter_scheme } = {}, }, index) => {
        if (!tradItems) return
        // if (index === 0) console.log(JSON.stringify(questassort))
        tradItems.forEach(({ _tpl, _id, parentId, slotId }, key) => {

            const item = items[_tpl]
            const parent = item._parent
            const equipmentType = getEquipmentType(parent, items)

            switch (true) {
                case checkParentRecursive(parent, items, [barterParent, keyParent, medsParent, modParent, moneyParent]):
                    usecInventory.items.Pockets.push(_tpl)
                    bearInventory.items.Pockets.push(_tpl)

                    usecInventory.items.TacticalVest.push(_tpl)
                    bearInventory.items.TacticalVest.push(_tpl)

                    usecInventory.items.Backpack.push(_tpl)
                    bearInventory.items.Backpack.push(_tpl)
                    break;

                //Add Ammo
                case checkParentRecursive(parent, items, [AmmoParent]):
                    const calibre = item._props.Caliber || item._props.ammoCaliber
                    if (calibre) {
                        usecInventory.Ammo[calibre] =
                            { ...usecInventory.Ammo[calibre] || {}, [_tpl]: 1 }
                        bearInventory.Ammo[calibre] =
                            { ...bearInventory.Ammo[calibre] || {}, [_tpl]: 1 }


                        usecInventory.items.Pockets.push(_tpl)
                        bearInventory.items.Pockets.push(_tpl)

                        usecInventory.items.Backpack.push(_tpl)
                        bearInventory.items.Backpack.push(_tpl)

                        usecInventory.items.TacticalVest.push(_tpl)
                        bearInventory.items.TacticalVest.push(_tpl)

                        usecInventory.items.SecuredContainer.push(_tpl)
                        bearInventory.items.SecuredContainer.push(_tpl)
                    } else {
                        console.log(item._name, " likely has the incorrect calibre: ", calibre)
                    }
                    break

                // Add matching equipment
                case !!equipmentType:
                    if (!usecInventory.equipment[equipmentType]) usecInventory.equipment[equipmentType] = {}
                    if (!bearInventory.equipment[equipmentType]) bearInventory.equipment[equipmentType] = {}
                    usecInventory.equipment[equipmentType][_tpl] = 1
                    bearInventory.equipment[equipmentType][_tpl] = 1
                    break;
                default:
                    break;
            }

            const loyaltyLevel = loyal_level_items[_id] || loyal_level_items[parentId]

            //Set trader list for levels
            if (loyaltyLevel) {
                const barterSchemeRef = barter_scheme[_id] || barter_scheme[parentId]

                switch (true) {
                    // If large magazine
                    case checkParentRecursive(_tpl, items, [magParent]) && item?._props?.Cartridges?.[0]?._max_count > 50:
                        tradersMasterList[4].add(_tpl)

                        if (slotId !== "hideout") {
                            if (!mods[4]?.[slotId]) mods[4][slotId] = []
                            mods[4][slotId].push(_tpl)
                        }

                        break;
                    // Check if its a quest unlocked trade    
                    case !!questassort.success[_id]:
                        if ((loyaltyLevel === 4 || checkParentRecursive(_tpl, items, [magParent]) && item?._props?.Cartridges?.[0]?._max_count > 50)) {
                            tradersMasterList[4].add(_tpl)

                            if (slotId !== "hideout") {
                                if (!mods[4]?.[slotId]) mods[4][slotId] = []
                                mods[4][slotId].push(_tpl)
                            }
                        } else {
                            tradersMasterList[loyaltyLevel + 1].add(_tpl)
                            if (slotId !== "hideout") {
                                if (!mods[loyaltyLevel + 1]?.[slotId]) mods[loyaltyLevel + 1][slotId] = []
                                mods[loyaltyLevel + 1][slotId].push(_tpl)
                            }
                        }
                        break;
                    // Only add the item if it's a cash trade
                    case items[barterSchemeRef?.[0]?.[0]?._tpl]?._parent === moneyParent:
                        tradersMasterList[loyaltyLevel].add(_tpl)

                        if (slotId !== "hideout") {
                            if (!mods[loyaltyLevel]?.[slotId]) mods[loyaltyLevel][slotId] = []
                            mods[loyaltyLevel][slotId].push(_tpl)
                        }
                        break;
                    // Then it's a tradeItem
                    default:
                        if ((loyaltyLevel + 2) > 4 || checkParentRecursive(_tpl, items, [magParent]) && item?._props?.Cartridges?.[0]?._max_count > 50) {
                            tradersMasterList[4].add(_tpl)

                            if (slotId !== "hideout") {
                                if (!mods[4]?.[slotId]) mods[4][slotId] = []
                                mods[4][slotId].push(_tpl)
                            }
                        } else {
                            tradersMasterList[loyaltyLevel + 2].add(_tpl)

                            if (slotId !== "hideout") {
                                if (!mods[loyaltyLevel + 2]?.[slotId]) mods[loyaltyLevel + 2][slotId] = []
                                mods[loyaltyLevel + 2][slotId].push(_tpl)
                            }
                        }
                        break;
                }


                buildOutModsObject(_tpl, items, usecInventory)
                buildOutModsObject(_tpl, items, bearInventory)
            }
        })
    })


    setupMods(mods)

    // Remove duplicate items for all arrays
    usecInventory.items.SecuredContainer = deDupeArr(usecInventory.items.SecuredContainer)
    bearInventory.items.SecuredContainer = deDupeArr(bearInventory.items.SecuredContainer)

    usecInventory.items.Backpack = deDupeArr(usecInventory.items.Backpack)
    bearInventory.items.Backpack = deDupeArr(bearInventory.items.Backpack)

    usecInventory.items.Pockets = deDupeArr(usecInventory.items.Pockets)
    bearInventory.items.Pockets = deDupeArr(bearInventory.items.Pockets)

    usecInventory.items.TacticalVest = deDupeArr(usecInventory.items.TacticalVest)
    bearInventory.items.TacticalVest = deDupeArr(bearInventory.items.TacticalVest)

    usecInventory.items.SpecialLoot = deDupeArr(usecInventory.items.SpecialLoot)
    bearInventory.items.SpecialLoot = deDupeArr(bearInventory.items.SpecialLoot)



    //Make everything level 1 in equipment
    reduceEquipmentChancesTo1(usecInventory)
    reduceEquipmentChancesTo1(bearInventory)
    reduceAmmoChancesTo1(usecInventory)
    reduceAmmoChancesTo1(bearInventory)



    // Eliminates duplicate id's in later levels

    numList.forEach((num) => {
        tradersMasterList[num].forEach((id) => {
            numList.slice(num, 4).forEach(numListNum => {
                tradersMasterList[numListNum].delete(id)
            })
        })
    })

    if (botConfig.equipment.pmc.blacklist?.[0]?.equipment?.FirstPrimaryWeapon) {
        botConfig.equipment.pmc.blacklist[0].equipment.FirstPrimaryWeapon =
            ["624c0b3340357b5f566e8766", "624c0b3340357b5f566e8766", "6217726288ed9f0845317459", "62389be94d5d474bf712e709"]
    }
    // if (botConfig.equipment.pmc.blacklist?.[0]?.equipment?.mod_magazine) {
    //     botConfig.equipment.pmc.blacklist[0].equipment.FirstPrimaryWeapon =
    //         ["624c0b3340357b5f566e8766", "6217726288ed9f0845317459", "62389be94d5d474bf712e709"]
    // }




    setWhitelists(items, botConfig, tradersMasterList, mods)
    setWeightingAdjustments(items, botConfig, tradersMasterList)
    buildInitialRandomization(items, botConfig, tradersMasterList)
    buildWeaponSightWhitelist(items, botConfig, tradersMasterList)
    // botConfig.equipment.pmc.weightingAdjustments = []
    // botConfig.equipment.pmc.randomisation = []
    console.log(JSON.stringify(botConfig.equipment.pmc))
    // console.log(JSON.stringify(usecInventory))
}





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