import { IBotConfig, EquipmentFilters, EquipmentFilterDetails, WeightingAdjustmentDetails } from './../types/models/spt/config/IBotConfig.d';
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { DependencyContainer } from "tsyringe";
import config from "../config/config.json";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITemplateItem } from '@spt-aki/models/eft/common/tables/ITemplateItem';
import { cloneDeep, getAmmoWeighting, getArmorRating, getEquipmentType, getHighestScoringAmmoValue, getWeaponWeighting, mergeDeep, randomization } from './utils';
import { EquipmentSlots } from '@spt-aki/models/enums/EquipmentSlots';

export default function ProgressionChanges(
    container: DependencyContainer
): undefined {

    const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
    const configServer = container.resolve<ConfigServer>("ConfigServer");
    const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
    const tables = databaseServer.getTables();
    const items = tables.templates.items;
    const traders = tables.traders

    // console.log(Object.values(EquipmentSlots))


    Object.keys(tables.bots.types.usec.inventory.equipment).forEach((key) => {
        tables.bots.types.usec.inventory.equipment[key] = {}
    })

    Object.keys(tables.bots.types.bear.inventory.equipment).forEach((key) => {
        tables.bots.types.bear.inventory.equipment[key] = {}
    })


    const usecEquip = tables.bots.types.usec.inventory.equipment
    const bearEquip = tables.bots.types.bear.inventory.equipment

    const AmmoParent = "5485a8684bdc2da71d8b4567"

    // Fix PP-9 
    tables.templates.items["57f4c844245977379d5c14d1"]._props.ammoCaliber = "Caliber9x18PM"

    // Fix MP-19 
    tables.templates.items["61f7c9e189e6fb1a5e3ea78d"]._props.BoltAction = true

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
    const tradersMasterList:
        { 1: Set<string>, 2: Set<string>, 3: Set<string>, 4: Set<string> } =
        { 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set() }

    traderList.forEach(({ assort: { items: tradItems, loyal_level_items } = {} }) => {
        if (!tradItems) return
        tradItems.forEach(({ _tpl, _id, parentId }) => {
            const loyaltyLevel = loyal_level_items[_id] || loyal_level_items[parentId]
            if (loyaltyLevel) {
                tradersMasterList[loyaltyLevel].add(_tpl)
            }
        })
    })

    // Eliminates duplicate id's in later levels
    const numList = [1, 2, 3, 4]
    // numList.forEach((num) => {
    //     tradersMasterList[num].forEach((id) => {
    //         numList.slice(num, 4).forEach(numListNum => {
    //             tradersMasterList[numListNum].delete(id)
    //         })
    //     })
    // })

    const levelRange = {
        1: {
            min: 1,
            max: 14
        },
        2: {
            min: 15,
            max: 21
        },
        3: {
            min: 22,
            max: 34
        },
        4: {
            min: 35,
            max: 100
        }
    }

    const updatedData: EquipmentFilters = {
        blacklist: [],
        weaponModLimits: {},
        weaponSightWhitelist: {},
        clothing: [],
        randomisation: [],
        ...botConfig.equipment.pmc,
        whitelist: [],
        weightingAdjustments: [],
    }

    if (updatedData?.blacklist?.[0]?.equipment?.FirstPrimaryWeapon) {
        updatedData.blacklist[0].equipment.FirstPrimaryWeapon = ["624c0b3340357b5f566e8766"]
    }

    for (let index = 0; index < numList.length; index++) {
        const loyalty = numList[index];
        const itemList = [...tradersMasterList[loyalty]]
        const copyOfPreviousWhitelist = !!updatedData.whitelist[index - 1] ?
            cloneDeep(updatedData.whitelist[index - 1]) :
            { equipment: {}, cartridge: {} }

        const whitelistItem = {
            ...copyOfPreviousWhitelist,
            levelRange: levelRange[loyalty],
        } as EquipmentFilterDetails

        const weightingAdjustmentItem = {
            levelRange: levelRange[loyalty],
            ammo: { add: {}, edit: {} },
            equipment: { add: {}, edit: {} },
            // clothing: {} //Implement later
        } as WeightingAdjustmentDetails

        for (let k = 0; k < itemList.length; k++) {
            const id = itemList[k];
            const item = items[id]
            const parent = item._parent

            if (parent === AmmoParent) {
                const calibre = item._props.Caliber || item._props.ammoCaliber
                whitelistItem.cartridge[calibre] =
                    [...whitelistItem.cartridge[calibre] ? whitelistItem.cartridge[calibre] : [], id]

                if (!weightingAdjustmentItem.ammo.add?.[calibre]) { weightingAdjustmentItem.ammo.add = { ...weightingAdjustmentItem.ammo.add, [calibre]: {} } }
                const ammoWeight = getAmmoWeighting(items[id])

                tables.bots.types.usec.inventory.Ammo[calibre] =
                    { ...tables.bots.types.usec.inventory.Ammo[calibre] || {}, [id]: 1 }
                tables.bots.types.bear.inventory.Ammo[calibre] =
                    { ...tables.bots.types.bear.inventory.Ammo[calibre] || {}, [id]: 1 }

                weightingAdjustmentItem.ammo.add[calibre] =
                    { ...weightingAdjustmentItem.ammo.add[calibre] || {}, [id]: ammoWeight }
                continue
            }

            const equipmentType = getEquipmentType(parent)

            if (equipmentType) {
                whitelistItem.equipment[equipmentType] =
                    [...whitelistItem.equipment[equipmentType] ? whitelistItem.equipment[equipmentType] : [], id]
            }
        }

        updatedData.whitelist.push(whitelistItem)

        const combinedWhiteLists = {} as EquipmentFilterDetails
        for (const key of updatedData.whitelist) {
            mergeDeep(combinedWhiteLists, key)
        }

        const combinedWeightingAdjustmentItem = {} as WeightingAdjustmentDetails
        for (const key of updatedData.weightingAdjustments) {
            mergeDeep(combinedWeightingAdjustmentItem, key)
        }
        mergeDeep(combinedWeightingAdjustmentItem, weightingAdjustmentItem)


        for (let k = 0; k < itemList.length; k++) {
            const id = itemList[k];
            const item = items[id]
            const parent = item._parent
            const equipmentType = getEquipmentType(parent)

            switch (true) {
                case items[parent]?._parent === "5422acb9af1c889c16000029": // Ammo Parent

                    const calibre = item._props.Caliber || item._props.ammoCaliber

                    if (combinedWhiteLists?.cartridge?.[calibre]) {
                        if (!weightingAdjustmentItem.equipment.add?.[equipmentType]) {
                            weightingAdjustmentItem.equipment.add = { ...weightingAdjustmentItem.equipment.add, [equipmentType]: {} }
                        }

                        const highestScoringAmmo = getHighestScoringAmmoValue(combinedWeightingAdjustmentItem.ammo.add[calibre])
                        const weaponRating = getWeaponWeighting(item, highestScoringAmmo)
                        usecEquip[equipmentType][id] = weaponRating
                        bearEquip[equipmentType][id] = weaponRating
                        weightingAdjustmentItem.equipment.add[equipmentType] = {
                            ...weightingAdjustmentItem.equipment.add[equipmentType] || {},
                            [id]: weaponRating
                        }
                    } else {
                        console.log(item._name, " likely has the incorrect calibre: ", calibre)
                    }
                    break;

                case parent === "5448e54d4bdc2dcc718b4568": //"ArmorParent"
                    if (!weightingAdjustmentItem.equipment.add?.[equipmentType]) {
                        weightingAdjustmentItem.equipment.add = { ...weightingAdjustmentItem.equipment.add, [equipmentType]: {} }
                    }

                    const armorRating = getArmorRating(item)

                    usecEquip[equipmentType][id] = armorRating
                    bearEquip[equipmentType][id] = armorRating

                    weightingAdjustmentItem.equipment.add[equipmentType] = {
                        ...weightingAdjustmentItem.equipment.add[equipmentType] || {},
                        [id]: armorRating
                    }
                    break;
                case equipmentType === "Magazine" && !!item._props.Cartridges[0]._max_count: //"MagazineParent"
                    if (!weightingAdjustmentItem.equipment.add?.[equipmentType]) {
                        weightingAdjustmentItem.equipment.add = { ...weightingAdjustmentItem.equipment.add, [equipmentType]: {} }
                    }



                    weightingAdjustmentItem.equipment.add[equipmentType] = {
                        ...weightingAdjustmentItem.equipment.add[equipmentType] || {},
                        [id]: item._props.Cartridges[0]._max_count
                    }

                    break;
                default:
                    if (!!equipmentType) {
                        if (!weightingAdjustmentItem.equipment.add?.[equipmentType]) {
                            weightingAdjustmentItem.equipment.add = { ...weightingAdjustmentItem.equipment.add, [equipmentType]: {} }
                        }

                        usecEquip[equipmentType][id] = 1
                        bearEquip[equipmentType][id] = 1

                        weightingAdjustmentItem.equipment.add[equipmentType] = {
                            ...weightingAdjustmentItem.equipment.add[equipmentType] || {},
                            [id]: 1
                        }
                    } else {
                        // console.log(item._parent, "=", items[item._parent]._name)
                    }
                    break;
            }
        }

        // updatedData.weightingAdjustments.push(weightingAdjustmentItem)
    }

    botConfig.equipment.pmc = updatedData

    console.log(JSON.stringify(updatedData))

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

}
