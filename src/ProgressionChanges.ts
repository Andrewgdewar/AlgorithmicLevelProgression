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
    getEquipmentType, keyParent, magParent, medsParent, moneyParent, numList,
    reduceAmmoChancesTo1,
    reduceEquipmentChancesTo1,
    setWeightingAdjustments, setWhitelists, setupBaseWhiteList, buildInitialBearAppearance, buildInitialUsecAppearance, setupMods, buildWeaponSightWhitelist, addToModsObject
} from './utils';


export default function ProgressionChanges(
    container: DependencyContainer
): undefined {

    const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
    const configServer = container.resolve<ConfigServer>("ConfigServer");
    const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
    const tables = databaseServer.getTables();
    const items = tables.templates.items;
    const customization = tables.templates.customization;
    const traders = tables.traders

    const usecInventory = tables.bots.types.usec.inventory
    const bearInventory = tables.bots.types.bear.inventory

    // tables.bots.types.usec.inventory.mods = {}
    // tables.bots.types.bear.inventory.mods = {}

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

    const tradersToExclude = [
        "Unknown",
        "caretaker",
        'Fence'
    ]

    const traderList = Object.values(traders).filter(({ base }) => {
        if (config.addCustomTraders) {
            return !tradersToExclude.includes(base.nickname)
        }
        return tradersToInclude.includes(base.nickname)
    })


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

    traderList.forEach(({ base: { nickname }, questassort, assort: { items: tradItems, loyal_level_items, barter_scheme } = {}, }, index) => {
        if (!tradItems || !nickname) return
        // if (index === 0) console.log(JSON.stringify(questassort))
        if (config.addCustomTraders && ![...tradersToExclude, ...tradersToInclude].includes(nickname)) {
            console.log(`\nAlgorithmicLevelProgression: Attempting to add items for custom trader > ${nickname}!\n`)
        }
        tradItems.forEach(({ _tpl, _id, parentId, slotId, }) => {
            const item = items[_tpl]
            if (!item) return console.log("AlgorithmicLevelProgression: Skipping custom item: ", _tpl, " for trader: ", nickname);
            const parent = item._parent
            if (!parent || !items[parent]) return console.log("AlgorithmicLevelProgression: Skipping custom item: ", _tpl, " for trader: ", nickname);
            const equipmentType = getEquipmentType(parent, items)

            switch (true) {
                case checkParentRecursive(parent, items, [barterParent, keyParent, medsParent, moneyParent]):
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
                // case equipmentType === "mod_scope":
                //     break;
                // Check if revolver shotgun
                case _tpl === "60db29ce99594040e04c4a27":
                    if (!usecInventory.equipment["FirstPrimaryWeapon"]) usecInventory.equipment["FirstPrimaryWeapon"] = {}
                    if (!bearInventory.equipment["FirstPrimaryWeapon"]) bearInventory.equipment["FirstPrimaryWeapon"] = {}
                    usecInventory.equipment["FirstPrimaryWeapon"][_tpl] = 1
                    bearInventory.equipment["FirstPrimaryWeapon"][_tpl] = 1
                    break;
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

                        addToModsObject(mods, _tpl, items, 4)

                        break;
                    // Check if its a quest unlocked trade    
                    case !!questassort.success[_id]:
                        if (!config?.questUnlockedItemsShifted) {
                            tradersMasterList[loyaltyLevel].add(_tpl)

                            addToModsObject(mods, _tpl, items, loyaltyLevel, slotId)
                        } else {
                            if (loyaltyLevel === 4) {
                                tradersMasterList[4].add(_tpl)

                                addToModsObject(mods, _tpl, items, 4, slotId)
                            } else {
                                tradersMasterList[loyaltyLevel + 1].add(_tpl)

                                addToModsObject(mods, _tpl, items, loyaltyLevel + 1, slotId)
                            }
                        }
                        break;
                    // Only add the item if it's a cash trade or if tradeItems are not shifted
                    case items[barterSchemeRef?.[0]?.[0]?._tpl]?._parent === moneyParent || !config?.tradedItemsShifted:
                        tradersMasterList[loyaltyLevel].add(_tpl)

                        addToModsObject(mods, _tpl, items, loyaltyLevel, slotId)
                        break;
                    // Then it's a tradeItem
                    default:
                        if ((loyaltyLevel + 2) > 4) {
                            tradersMasterList[4].add(_tpl)

                            addToModsObject(mods, _tpl, items, 4, slotId)
                        } else {
                            tradersMasterList[loyaltyLevel + 2].add(_tpl)

                            addToModsObject(mods, _tpl, items, loyaltyLevel + 2, slotId)
                        }
                        break;
                }
                if (loyaltyLevel !== 4) {
                    buildOutModsObject(_tpl, items, usecInventory)
                    buildOutModsObject(_tpl, items, bearInventory)
                }
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

    if (botConfig.equipment.pmc.blacklist?.[0]?.equipment) {
        if (!botConfig.equipment.pmc.blacklist?.[0]?.equipment?.FirstPrimaryWeapon) botConfig.equipment.pmc.blacklist[0].equipment.FirstPrimaryWeapon = []
        botConfig.equipment.pmc.blacklist[0].equipment.FirstPrimaryWeapon.push("624c0b3340357b5f566e8766", "624c0b3340357b5f566e8766", "6217726288ed9f0845317459", "62389be94d5d474bf712e709")
    }

    setWhitelists(items, botConfig, tradersMasterList, mods)
    setWeightingAdjustments(items, botConfig, tradersMasterList, mods)
    buildInitialRandomization(items, botConfig, tradersMasterList)
    buildWeaponSightWhitelist(items, botConfig, tradersMasterList)
    // buildBlacklist(items, botConfig, mods)

    //Fix assault
    botConfig.equipment.assault.randomisation = [{
        "levelRange": {
            "min": 1,
            "max": 100
        },
        "generation": {
            "grenades": {
                "min": 0,
                "max": 1,
                "whitelist": [
                    "5710c24ad2720bc3458b45a3",
                    "58d3db5386f77426186285a0",
                    "5a0c27731526d80618476ac4",
                    "619256e5f8af2c1a4e1f5d92"
                ]
            }
        },
        "stims": {
            "min": 0,
            "max": 0,
        }
    }] as any

    // console.log(JSON.stringify(botConfig.equipment.pmc))
    // console.log(JSON.stringify(botConfig.equipment.pmc))
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