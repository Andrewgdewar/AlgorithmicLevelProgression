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
    buildInitialRandomization,
    buildOutModsObject,
    checkParentRecursive, deDupeArr,
    getEquipmentType, keyParent, magParent, medsParent, modParent, moneyParent, numList,
    reduceAmmoChancesTo1,
    reduceEquipmentChancesTo1,
    setWeightingAdjustments, setWhitelists, setupBaseWhiteList
} from './utils';


export default function ProgressionChanges(
    container: DependencyContainer
): undefined {

    //Next tasks
    // - Make whiteList with levels (Try to incorporate the items that come with usec base) 1/2
    // - Make function to set items value in equipment/ammo < done
    // - determine ammo/equipment weightingAdjustments to "edit" lower as the level increases> not needed
    // - Build randomisation
    // - Add clothing levels

    const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
    const configServer = container.resolve<ConfigServer>("ConfigServer");
    const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
    const tables = databaseServer.getTables();
    const items = tables.templates.items;
    const traders = tables.traders
    const { levelRange } = config

    const originalEquipmentList = {}





    const usecInventory = tables.bots.types.usec.inventory
    const bearInventory = tables.bots.types.bear.inventory

    tables.bots.types.usec.inventory.mods = {}
    tables.bots.types.bear.inventory.mods = {}

    // Fix PP-9 
    // tables.templates.items["57f4c844245977379d5c14d1"]._props.ammoCaliber = "Caliber9x18PM"

    // Fix MP-19 
    // tables.templates.items["61f7c9e189e6fb1a5e3ea78d"]._props.BoltAction = true
    // Add rhino clip

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

    const itemCosts = {} as Record<string, number>
    // SetBaseWhitelist

    botConfig.equipment.pmc.whitelist = setupBaseWhiteList()

    traderList.forEach(({ assort: { items: tradItems, loyal_level_items, barter_scheme } = {}, }) => {
        if (!tradItems) return

        tradItems.forEach(({ _tpl, _id, parentId }, key) => {

            const item = items[_tpl]
            const parent = item._parent
            const equipmentType = getEquipmentType(parent)

            switch (true) {
                case checkParentRecursive(parent, items, [barterParent, keyParent, medsParent, modParent, moneyParent]):

                    if (modParent) {
                        // usecInventory.mods
                        // usecInventory.mods
                    }

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
                if (checkParentRecursive(_tpl, items, [magParent]) && item?._props?.Cartridges?.[0]?._max_count > 50) {
                    // Take big mags and put them to level 4
                    tradersMasterList[4].add(_tpl)
                } else if (items[barterSchemeRef?.[0]?.[0]?._tpl]?._parent === moneyParent) {
                    // Only add the item if it's a cash trade
                    tradersMasterList[loyaltyLevel].add(_tpl)
                } else {
                    if (loyaltyLevel === 4) tradersMasterList[loyaltyLevel].add(_tpl)
                    else tradersMasterList[loyaltyLevel + 1].add(_tpl)
                }

                itemCosts[_tpl] = barterSchemeRef?.[0]?.[0]?.count
                buildOutModsObject(_tpl, items, usecInventory)
                buildOutModsObject(_tpl, items, bearInventory)
            } else {
                // these are weapon components that come with the rifle. no need to add them.
            }
        })
    })


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
        botConfig.equipment.pmc.blacklist[0].equipment.FirstPrimaryWeapon = ["624c0b3340357b5f566e8766", "6217726288ed9f0845317459"]
    }




    // setWhitelists(items, botConfig, tradersMasterList)
    setWeightingAdjustments(items, botConfig, tradersMasterList, itemCosts)
    buildInitialRandomization(items, botConfig, tradersMasterList)
    // botConfig.equipment.pmc.weightingAdjustments = []
    // botConfig.equipment.pmc.randomisation = []
    // console.log(JSON.stringify(botConfig.equipment.pmc))
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