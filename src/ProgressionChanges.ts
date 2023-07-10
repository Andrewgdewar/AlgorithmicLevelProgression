import { IBotConfig, EquipmentFilters, EquipmentFilterDetails, WeightingAdjustmentDetails } from './../types/models/spt/config/IBotConfig.d';
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { DependencyContainer } from "tsyringe";
import config from "../config/config.json";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITemplateItem } from '@spt-aki/models/eft/common/tables/ITemplateItem';

export default function ProgressionChanges(
    container: DependencyContainer
): undefined {
    if (config?.enableProgressionChanges) {
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
        const tables = databaseServer.getTables();
        const items = tables.templates.items;
        const traders = tables.traders

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

        traderList.forEach(({ assort: { items, loyal_level_items, barter_scheme } = {} }) => {
            if (!items) return
            items.forEach(({ _tpl, _id, parentId }) => {
                const loyaltyLevel = loyal_level_items[_id] || loyal_level_items[parentId]
                if (loyaltyLevel) {
                    tradersMasterList[loyaltyLevel].add(_tpl)
                }
            })
        })

        // Eliminates duplicate id's in later levels
        const numList = [1, 2, 3, 4]
        numList.forEach((num) => {
            tradersMasterList[num].forEach((id) => {
                numList.slice(num, 4).forEach(numListNum => {
                    tradersMasterList[numListNum].delete(id)
                })
            })
        })

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
            ...botConfig.equipment.pmc,
            // randomisation: [],
            // blacklist: [],
            weightingAdjustments: [],
            whitelist: [],
            // clothing: [], // TODO: Add full clothing levels
        }

        if (updatedData?.blacklist?.[0]?.equipment?.FirstPrimaryWeapon)
            updatedData.blacklist[0].equipment.FirstPrimaryWeapon = ["624c0b3340357b5f566e8766"]



        for (let index = 0; index < numList.length; index++) {
            const loyalty = numList[index];
            const itemList = [...tradersMasterList[loyalty]]
            const copyOfPreviousWhitelist = !!updatedData.whitelist[index - 1] ? cloneDeep(updatedData.whitelist[index - 1]) : { equipment: {}, cartridge: {} }

            const whitelistItem = {
                ...copyOfPreviousWhitelist,
                levelRange: levelRange[loyalty],
            } as EquipmentFilterDetails

            const weightingAdjustmentItem = {
                levelRange: levelRange[loyalty],
                ammo: {},
                equipment: {},
                clothing: {} //Implement later
            } as WeightingAdjustmentDetails

            for (let k = 0; k < itemList.length; k++) {
                const id = itemList[k];
                const item = items[id]
                const parent = item._parent

                if (parent === AmmoParent) {
                    whitelistItem.cartridge[item._props.Caliber] =
                        [...whitelistItem.cartridge[item._props.Caliber] ? whitelistItem.cartridge[item._props.Caliber] : [], id]

                    if (!weightingAdjustmentItem.ammo.edit?.[item._props.Caliber]) { weightingAdjustmentItem.ammo.edit = { ...weightingAdjustmentItem.ammo.edit, [item._props.Caliber]: {} } }
                    weightingAdjustmentItem.ammo.edit[item._props.Caliber] =
                        { ...weightingAdjustmentItem.ammo.edit[item._props.Caliber] || {}, [id]: getAmmoWeighting(items[id]) }
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
                            if (!weightingAdjustmentItem.equipment.edit?.[equipmentType]) {
                                weightingAdjustmentItem.equipment.edit = { ...weightingAdjustmentItem.equipment.edit, [equipmentType]: {} }
                            }

                            const highestScoringAmmo = getHighestScoringAmmoValue(combinedWeightingAdjustmentItem.ammo.edit[calibre])

                            weightingAdjustmentItem.equipment.edit[equipmentType] = {
                                ...weightingAdjustmentItem.equipment.edit[equipmentType] || {},
                                [id]: getWeaponWeighting(item, highestScoringAmmo)
                            }
                        } else {
                            console.log(item._name, " likely has the incorrect calibre: ", calibre)
                        }
                        break;

                    case parent === "5448e54d4bdc2dcc718b4568": //"ArmorParent"
                        if (!weightingAdjustmentItem.equipment.edit?.[equipmentType]) {
                            weightingAdjustmentItem.equipment.edit = { ...weightingAdjustmentItem.equipment.edit, [equipmentType]: {} }
                        }

                        weightingAdjustmentItem.equipment.edit[equipmentType] = {
                            ...weightingAdjustmentItem.equipment.edit[equipmentType] || {},
                            [id]: getArmorRating(item)
                        }
                        break;
                    default:
                        break;
                }
            }

            updatedData.weightingAdjustments.push(weightingAdjustmentItem)
        }

        botConfig.equipment.pmc = updatedData

        console.log(JSON.stringify(updatedData.weightingAdjustments))

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
}

const cloneDeep = (objectToClone: any) => JSON.parse(JSON.stringify(objectToClone));

const isObject = (item) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

const mergeDeep = (target, ...sources) => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

const getArmorRating = ({ _props: { RepairCost, Durability, armorClass, armorZone, Name }, _name, _id }: any): number => {
    let armClass = armorClass - 1
    const repair = RepairCost * 0.1
    let durability = (((Durability - 20) * armorZone?.length) * armClass) * 0.15
    if (durability < 0) durability = 0

    const total = Math.round((repair + durability))

    return total
}

const getAmmoWeighting = ({ _props: { PenetrationPower, Damage, InitialSpeed, ProjectileCount }, _id, _name }: ITemplateItem): number => {
    let pen = ((PenetrationPower - 15) * 10)
    if (pen < 0) pen = 0
    const dam = (ProjectileCount ? (Damage * (ProjectileCount * 0.6)) : Damage) * 0.5
    let speed = (InitialSpeed - 600) * 0.2
    if (speed < 0) speed = 0

    return Math.round(pen + dam + speed)
}

const getEquipmentType = (id: string) => {
    const equipmentKeys = Object.keys(equipmentIdMapper)
    for (let index = 0; index < equipmentKeys.length; index++) {
        const key = equipmentKeys[index];
        if (equipmentIdMapper[key].includes(id)) {
            return key
        }
    }
}

const getHighestScoringAmmoValue = (ammoWeight: Record<string, number>): number => {
    let highestValue = 0

    for (const key in ammoWeight) {
        const value = ammoWeight[key];
        if (value > highestValue) {
            highestValue = value

        }
    }
    return highestValue
}

const getWeaponWeighting = ({
    _props: { bFirerate, Ergonomics, RepairCost, BoltAction, weapClass } = {}, _name, _id }: ITemplateItem,
    highestScoringAmmo: number,
): number => {
    const ammo = highestScoringAmmo > 90 ? highestScoringAmmo * 0.8 : 0

    let fireRate = ((bFirerate - 500) * 0.05)
    if (fireRate < 0) fireRate = 0

    let ergo = (Ergonomics - 20) * 0.2
    if (ergo < 0) ergo = 0

    let repCost = (RepairCost - 10) * 0.3
    if (repCost < 0) repCost = 0

    const gunBase = fireRate + ergo + repCost

    if (BoltAction) return Math.round((gunBase + ammo) * 0.7)
    if (weapClass === "pistol") return Math.round((gunBase + ammo) * 0.4)
    return Math.round(gunBase + ammo)
}

const equipmentIdMapper = {
    Headwear: ["5a341c4086f77401f2541505"],
    Earpiece: ["5645bcb74bdc2ded0b8b4578"],
    FaceCover: ["5a341c4686f77469e155819e"],
    Eyewear: ["5448e5724bdc2ddf718b4568"],
    ArmBand: ["5b3f15d486f77432d0509248"],
    ArmorVest: ["5448e54d4bdc2dcc718b4568"],
    TacticalVest: ["5448e5284bdc2dcb718b4567"],
    // Pockets: ["557596e64bdc2dc2118b4571"],
    Backpack: ["5448e53e4bdc2d60728b4567"],
    // SecuredContainer: [],
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
}
