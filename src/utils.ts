import { Level } from './../types/models/eft/common/IGlobals.d';
import { Appearance, Equipment, Inventory, ModsChances } from './../types/models/eft/common/tables/IBotType.d';
import { MinMax } from './../types/models/common/MinMax.d';
import { ITemplateItem } from "@spt-aki/models/eft/common/tables/ITemplateItem";
import { EquipmentFilterDetails, IBotConfig, RandomisationDetails, WeightingAdjustmentDetails } from "@spt-aki/models/spt/config/IBotConfig";
import { levelRange } from "../config/config.json"
import { ISuit } from '@spt-aki/models/eft/common/tables/ITrader';
import { ICustomizationItem } from '@spt-aki/models/eft/common/tables/ICustomizationItem';


export enum SightType {
    AssaultScope = "55818add4bdc2d5b648b456f",
    Collimator = "55818ad54bdc2ddc698b4569",
    CompactCollimator = "55818acf4bdc2dde698b456b",
    OpticScope = "55818ae44bdc2dde698b456c",
}

export const setupMods = (mods: Record<string, Record<string, string[]>>) => {
    Object.keys(mods).forEach(numstr => {
        const num = Number(numstr)
        Object.keys(mods[num]).forEach(mod => {
            mods[num][mod] = deDupeArr(mods[num][mod])
            if (mods[num + 1]) {
                if (!mods[num + 1]?.[mod]) mods[num + 1][mod] = mods[num][mod]
                else {
                    mods[num + 1][mod].push(...mods[num][mod])
                }
            }
        })
    })
}

export const reduceEquipmentChancesTo1 = (inventory: Inventory) => {
    Object.keys(inventory.equipment).forEach((equipType => {
        Object.keys(inventory.equipment[equipType]).forEach(id => {
            if (inventory.equipment[equipType][id] !== 0) {
                inventory.equipment[equipType][id] = 1
            }
        })
    }))
}

export const reduceAmmoChancesTo1 = (inventory: Inventory) => {
    Object.keys(inventory.Ammo).forEach((caliber => {
        Object.keys(inventory.Ammo[caliber]).forEach(id => {
            if (inventory.Ammo[caliber][id] !== 0) {
                inventory.Ammo[caliber][id] = 1
            }
        })
    }))
}

export const deDupeArr = (arr: any[]) => [...new Set(arr)]

export const checkParentRecursive = (parentId: string, items: Record<string, ITemplateItem>, queryIds: string[]): boolean => {
    if (queryIds.includes(parentId)) return true
    if (!items?.[parentId]?._parent) return false

    return checkParentRecursive(items[parentId]._parent, items, queryIds)
}

export const cloneDeep = (objectToClone: any) => JSON.parse(JSON.stringify(objectToClone));

export const isObject = (item) => {
    return (item && typeof item === "object" && !Array.isArray(item));
}

export const mergeDeep = (target, ...sources) => {
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

export const getArmorRating = ({ _props: { RepairCost, Durability, armorClass, armorZone, Name }, _name, _id }: any): number => {
    const armorZoneCoverage = armorZone?.length || 0

    const durability = Durability * 0.3

    const total = Math.round((armorClass * 20) + durability + (armorZoneCoverage * 5))

    return total || 3
}

export const getAmmoWeighting = ({ _props: { PenetrationPower, Damage, InitialSpeed, ProjectileCount }, _id, _name }: ITemplateItem): number => {
    let penBonus = ((PenetrationPower - 15) * 3)
    if (penBonus < 0) penBonus = 0
    const damBonus = (ProjectileCount ? (Damage * (ProjectileCount * 0.6)) : Damage) * 0.1
    let speedBonus = InitialSpeed > 600 ? 5 : 0
    return Math.round(penBonus + speedBonus + damBonus) || 3
}

export const getEquipmentType = (id: string, items: Record<string, ITemplateItem>) => {
    const equipmentKeys = Object.keys(equipmentIdMapper)
    for (let index = 0; index < equipmentKeys.length; index++) {
        const key = equipmentKeys[index];
        if (checkParentRecursive(id, items, equipmentIdMapper[key])) {
            return key
        }
    }
}

export const getHighestScoringAmmoValue = (ammoWeight: Record<string, number>): number => {
    let highestValue = 1

    for (const key in ammoWeight) {
        const value = ammoWeight[key];
        if (value > highestValue) {
            highestValue = value

        }
    }
    return highestValue
}

export const getWeaponWeighting = ({
    _props: { Ergonomics, RepairCost, BoltAction, weapClass, weapFireType, RecoilForceUp, ReloadMode } = {}, _name, _id }: ITemplateItem,
    highestScoringAmmo: number,
): number => {
    let ammo = highestScoringAmmo

    let ergoBonus = Ergonomics * 0.1
    const lowRecoilBonus = RecoilForceUp < 100 ? 3 : 0
    const isAutomatic = weapFireType.includes('fullauto') ? 5 : 0
    const isBoltAction = BoltAction ? - 10 : 0
    const isPistol = weapClass === "pistol" ? - 15 : 0
    const isBarrelLoader = ReloadMode.includes("OnlyBarrel") ? -15 : 0
    const gunBase = ergoBonus + lowRecoilBonus + isAutomatic + isBoltAction + isPistol + isBarrelLoader
    if (BoltAction || weapClass === "pistol") ammo = ammo / 2
    if (ReloadMode.includes("OnlyBarrel")) ammo = ammo / 3
    const finalValue = Math.round(gunBase + ammo)
    // console.log(_name, _id, " - ", Math.round(gunBase), Math.round(ammo), finalValue)
    return finalValue > 0 ? finalValue : 1
}


export const getBackPackInternalGridValue = ({
    _props: { Grids, Weight } = {}, _name, _id }: ITemplateItem,
): number => {
    let total = 0
    Grids.forEach(({ _props }) => {
        total += _props?.cellsH * _props?.cellsV
        // if the backpack can't hold "Items" give it a severe lower ranking
        if (_props.filters?.[0]?.Filter?.length && !_props.filters?.[0]?.Filter?.includes("54009119af1c881c07000029")) {
            total = total / 2
        }
    })
    total = Math.round((total * 0.6) - Weight)

    // console.log(_name, _id, " - ", total)
    return total > 0 ? total : 1
}


export const getTacticalVestValue = (item: ITemplateItem,
): number => {
    const { Grids } = item._props
    let spaceTotal = 0
    Grids.forEach(({ _props }) => {
        spaceTotal = spaceTotal + (_props?.cellsH * _props?.cellsV)
    })
    spaceTotal = Math.round((spaceTotal * 0.6)) || 3
    const armorRating = getArmorRating(item) * 0.6
    // console.log(item._name, item._id, " - ", armorRating > 5 ? armorRating + spaceTotal : spaceTotal * 4)
    return armorRating || spaceTotal
}

export const equipmentIdMapper = {
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
    mod_magazine: [
        "5448bc234bdc2d3c308b4569",
        "610720f290b75a49ff2e5e25"
    ],
    // Stock: ["55818a594bdc2db9688b456a"],
    mod_scope: [...Object.values(SightType)],
}


export type oneToFour = "1" | "2" | "3" | "4"

export const getCurrentLevelRange = (currentLevel: number): oneToFour | undefined => {
    for (const key in levelRange) {
        const { min, max } = levelRange[key] as MinMax;
        if (currentLevel >= min && currentLevel <= max) return key as oneToFour
    }
}

export const numList = [1, 2, 3, 4]

export const arrSum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0)

export const setupBaseWhiteList = (): EquipmentFilterDetails[] => {
    return numList.map(num => ({
        levelRange: levelRange[num],
        "equipment": {},
        "cartridge": {}
    }))
}

export type TradersMasterList = { 1: Set<string>, 2: Set<string>, 3: Set<string>, 4: Set<string> }

export const setWhitelists = (
    items: Record<string, ITemplateItem>,
    botConfig: IBotConfig,
    tradersMasterList: TradersMasterList,
    mods: Record<string, Record<string, string[]>>
) => {
    numList.forEach((num, index) => {
        const loyalty = num;
        const whitelist = botConfig.equipment.pmc.whitelist
        const itemList = [...tradersMasterList[loyalty]]

        whitelist[index].equipment = { ...whitelist[index].equipment, ...mods[num] }

        itemList.forEach(id => {
            const item = items[id]
            const parent = item._parent
            const equipmentType = getEquipmentType(parent, items)

            switch (true) {
                // case items[parent]?._parent === "5422acb9af1c889c16000029": // Ammo Parent
                //     const calibre = item._props.Caliber || item._props.ammoCaliber

                //     whitelist[index].cartridge[calibre] =
                //         [...whitelist[index].cartridge[calibre] ? whitelist[index].cartridge[calibre] : [], id]
                //     break;
                case !!equipmentType:
                    whitelist[index].equipment[equipmentType] =
                        [...whitelist[index].equipment[equipmentType] ? whitelist[index].equipment[equipmentType] : [], id]
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
        })



        if (!!whitelist[index + 1]) {
            // if (!whitelist[index + 1]["ammo"]) whitelist[index + 1]["ammo"] = {}
            // whitelist[index + 1]["ammo"] = { ...whitelist[index]["ammo"] }
            whitelist[index + 1].equipment = { ...whitelist[index].equipment }
        }
        // console.log(whitelist[0]["ammo"])
    })
}


const buildEmptyWeightAdjustments = (): WeightingAdjustmentDetails[] => {
    return numList.map(num => ({
        levelRange: levelRange[num],
        "equipment": {
            "add": {},
            "edit": {}
        },
        "ammo": {
            "add": {},
            "edit": {}
        }
    }))
}

const buildEmptyClothingAdjustments = (levels: number[][]): WeightingAdjustmentDetails[] => {
    return levels.map(num => ({
        levelRange: { min: num[0], max: num[1] },
        "clothing": {
            "add": {},
            "edit": {}
        },
    }))
}

const setWeightItem = (weight: WeightingAdjustmentDetails, equipmentType, id, rating: any, add?: boolean) => {
    if (add) {
        weight.equipment.add[equipmentType] = {
            ...weight.equipment.add[equipmentType] || {},
            [id]: rating
        }
    } else {
        weight.equipment.edit[equipmentType] = {
            ...weight.equipment.edit[equipmentType] || {},
            [id]: rating
        }
    }
}
export const AmmoParent = "5485a8684bdc2da71d8b4567"
export const magParent = "5448bc234bdc2d3c308b4569"
export const barterParent = "5448eb774bdc2d0a728b4567"
export const keyParent = "543be5e94bdc2df1348b4568"
export const medsParent = "543be5664bdc2dd4348b4569"
export const modParent = "5448fe124bdc2da5018b4567"
export const moneyParent = "543be5dd4bdc2deb348b4569"
export const sightParent = "5448fe7a4bdc2d6f028b456b"
export const stockParent = "55818a594bdc2db9688b456a"
export const mountParent = "55818b224bdc2dde698b456f"


export const setWeightingAdjustments = (
    items: Record<string, ITemplateItem>,
    botConfig: IBotConfig,
    tradersMasterList: TradersMasterList,
) => {
    botConfig.equipment.pmc.weightingAdjustments = buildEmptyWeightAdjustments()
    const weight = botConfig.equipment.pmc.weightingAdjustments

    const additionalChancePerItem = 5

    numList.forEach((num, index) => {
        const loyalty = num;

        const itemList = [...tradersMasterList[loyalty]]

        // First edit ammo
        itemList.forEach(id => {
            const item = items[id]
            const parent = item._parent

            // Ammo Parent
            if (checkParentRecursive(parent, items, [AmmoParent])) {
                const calibre = item._props.Caliber || item._props.ammoCaliber

                if (!weight[index]?.ammo.edit?.[calibre]) {
                    weight[index].ammo.edit = { ...weight[index].ammo.edit, [calibre]: {} }
                }
                const ammoWeight = getAmmoWeighting(item)

                weight[index].ammo.edit[calibre] =
                    { ...weight[index].ammo.edit[calibre] || {}, [id]: ammoWeight }
            }
        })

        const combinedWeightingAdjustmentItem = {} as WeightingAdjustmentDetails
        for (const key of botConfig.equipment.pmc.weightingAdjustments) {
            mergeDeep(combinedWeightingAdjustmentItem, key)
        }
        mergeDeep(combinedWeightingAdjustmentItem, weight[index])


        itemList.forEach(id => {
            const item = items[id]
            const parent = item._parent
            const equipmentType = getEquipmentType(parent, items)

            if (equipmentType) {
                if (!weight[index]?.equipment?.edit?.[equipmentType]) {
                    weight[index].equipment.edit = { ...weight[index].equipment.edit, [equipmentType]: {} }
                }
            }

            switch (equipmentType) {
                case "FirstPrimaryWeapon":
                case "Holster":
                    const calibre = item._props.Caliber || item._props.ammoCaliber
                    const highestScoringAmmo = getHighestScoringAmmoValue(combinedWeightingAdjustmentItem.ammo.edit[calibre])
                    const weaponRating = getWeaponWeighting(item, highestScoringAmmo)

                    setWeightItem(weight[index], equipmentType, id, weaponRating * additionalChancePerItem)
                    // }
                    break;
                case "Headwear":
                    // TODO: Make it so earphones are prioritized
                    const coverageBonus = item?._props?.headSegments?.length || 0
                    const helmetBonus = Math.round(((item?._props?.MaxDurability || 0) * item?._props?.armorClass) / 10)
                    const repairCostBonus = Math.round(item?._props?.RepairCost * 0.005)
                    let rating = coverageBonus + helmetBonus + repairCostBonus
                    if (rating < 5) rating = 5
                    setWeightItem(weight[index], equipmentType, id, rating * additionalChancePerItem)
                    break;
                case "Earpiece":
                    const ambientVolumeBonus = item?._props?.AmbientVolume * -1
                    const compressorBonus = Math.round(item?._props?.CompressorVolume * -0.5)

                    setWeightItem(weight[index], equipmentType, id, (compressorBonus + ambientVolumeBonus) * additionalChancePerItem)
                    break;
                case "FaceCover":
                    const experience = item._props.LootExperience
                    setWeightItem(weight[index], equipmentType, id, experience * additionalChancePerItem)
                    break;
                case "ArmorVest":
                    const armorRating = getArmorRating(item)
                    setWeightItem(weight[index], equipmentType, id, armorRating * additionalChancePerItem)
                    break;
                case "ArmBand":
                    setWeightItem(weight[index], equipmentType, id, 5 * additionalChancePerItem)
                    break;
                case "SecuredContainer":
                    setWeightItem(weight[index], equipmentType, id, ((item._props.sizeWidth * item._props.sizeHeight) || 3) * additionalChancePerItem)
                    break;
                case "Scabbard":
                    setWeightItem(weight[index], equipmentType, id, ((item._props.LootExperience) || 3) * additionalChancePerItem)
                    break;
                case "Eyewear":
                    setWeightItem(weight[index], equipmentType, id,
                        (Math.round(item._props.LootExperience + (item._props.BlindnessProtection * 10)) || 3) * additionalChancePerItem)
                    break;
                case "Backpack":
                    const backpackInternalGridValue = getBackPackInternalGridValue(item)
                    setWeightItem(weight[index], equipmentType, id, backpackInternalGridValue * additionalChancePerItem)
                    break;
                case "TacticalVest":
                    const tacticalVestWeighting = getTacticalVestValue(item)
                    setWeightItem(weight[index], equipmentType, id, tacticalVestWeighting * additionalChancePerItem)
                    break;
                case "mod_magazine":
                case "mod_scope":
                    setWeightItem(weight[index], equipmentType, id, (loyalty * 10) * additionalChancePerItem, true)
                    break;
                default:
                    switch (true) {
                        //     case checkParentRecursive(id, items, [...Object.values(SightType)]):
                        //         setWeightItem(weight[index], "mod_scope", id, (loyalty * 10) * additionalChancePerItem, true)
                        //         break;
                        case checkParentRecursive(id, items, [stockParent, mountParent]):
                            setWeightItem(weight[index], "Others", id, (loyalty * 10) * additionalChancePerItem, true)
                            break;
                        default:
                            break;
                    }
                    break;
            }
        })


        // if (!!weight[index + 1]) {
        //     weight[index + 1].ammo = { ...weight[index].ammo }
        //     weight[index + 1].equipment = { ...weight[index].equipment }
        // }
    })
}

export const buildOutModsObject = (id: string, items: Record<string, ITemplateItem>, inventory: Inventory) => {
    const item = items[id]
    const newModObject = {}
    if (checkParentRecursive(items[id]._parent, items, [modParent, "5422acb9af1c889c16000029", "5a341c4086f77401f2541505"])) {
        switch (true) {
            case checkParentRecursive(items[id]._parent, items, [magParent]):
                const bulletList = item?._props?.Cartridges?.[0]?._props?.filters?.[0]?.Filter
                if (bulletList) {
                    newModObject["cartridges"] = bulletList
                    inventory.mods[id] = newModObject
                    inventory.mods[id] = newModObject
                }
                break;
            case checkParentRecursive(items[id]._parent, items, ["5422acb9af1c889c16000029"])://Weapon
                if (item?._props?.Slots?.length > 0) {
                    item._props.Slots.forEach(mod => {
                        if (mod._props?.filters?.[0]?.Filter?.length) {
                            // console.log(item._name, "adding ", mod._props?.filters[0].Filter.length, mod._name)
                            newModObject[mod._name] = mod._props?.filters[0].Filter
                        }
                    })
                }
                if (item._props?.Chambers?.[0]?._name === "patron_in_weapon" &&
                    item._props?.Chambers?.[0]?._props?.filters?.[0]?.Filter?.length
                ) {
                    newModObject["patron_in_weapon"] = item._props.Chambers[0]._props?.filters[0].Filter
                }
                if (Object.keys(newModObject)) {
                    inventory.mods[id] = newModObject
                    inventory.mods[id] = newModObject
                }
                break;
            case checkParentRecursive(items[id]._parent, items, ["5a341c4086f77401f2541505", modParent])://Headwear
                if (item?._props?.Slots?.length > 0) {
                    item._props.Slots.forEach(mod => {
                        if (mod._props?.filters?.[0]?.Filter?.length) {
                            // console.log(item._name, "adding ", mod._props?.filters[0].Filter.length, mod._name)
                            newModObject[mod._name] = mod._props?.filters[0].Filter
                        }
                    })
                    if (Object.keys(newModObject)) {
                        inventory.mods[id] = newModObject
                        inventory.mods[id] = newModObject
                    }
                }
                break;
            default:
                // console.log(items[item._parent]._name, id)
                break;
        }
    }

}

export const buildInitialRandomization = (items: Record<string, ITemplateItem>, botConfig: IBotConfig, traderList: TradersMasterList) => {
    const randomizationItems = []
    numList.forEach((num, index) => {
        const range = levelRange[num]
        const loyalty = num
        const itemList = [...traderList[loyalty]]
        const newItem = {
            levelRange: range,
            equipment: {
                "Headwear": [95, 95, 99, 99][index],
                "Earpiece": [70, 80, 90, 95][index],
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
                "Sights": 80,
            },
            generation: {
                "drugs": {
                    "min": 0,
                    "max": [2, 2, 3, 4][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.drugs?.whitelist ? { whitelist: randomizationItems[index - 1].generation.drugs.whitelist } : {} }
                },
                "grenades": {
                    "min": [0, 0, 1, 1][index],
                    "max": [1, 2, 2, 3][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.grenades?.whitelist ? { whitelist: randomizationItems[index - 1].generation.grenades.whitelist } : {} }
                },
                "healing": {
                    "min": [1, 1, 1, 2][index],
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
                    "whitelist": botConfig.equipment.pmc.whitelist[index].equipment.mod_magazine
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
                "mod_foregrip": [20, 25, 30, 35][index],
                "mod_handguard": [10, 20, 25, 35][index],
                "mod_launcher": 0,
                "mod_magazine": [25, 30, 35, 45][index],
                "mod_mount": [15, 20, 25, 35][index],
                "mod_mount_000": [5, 10, 25, 35][index],
                "mod_mount_001": [5, 10, 25, 35][index],
                "mod_mount_002": [5, 10, 25, 35][index],
                "mod_mount_003": [5, 10, 25, 35][index],
                "mod_mount_004": [5, 10, 25, 35][index],
                "mod_mount_005": [5, 10, 25, 35][index],
                "mod_mount_006": [5, 10, 25, 35][index],
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
                "mod_scope": 100, //[15, 20, 25, 35][index],
                "mod_scope_000": 0,//[15, 20, 25, 35][index],
                "mod_scope_001": 0,//[15, 20, 25, 35][index],
                "mod_scope_002": 0,//[15, 20, 25, 35][index],
                "mod_scope_003": 0,//[15, 20, 25, 35][index],
                "mod_tactical": [5, 10, 15, 15][index],
                "mod_tactical001": [5, 10, 15, 15][index],
                "mod_tactical002": [5, 10, 15, 15][index],
                "mod_tactical_000": [5, 10, 15, 15][index],
                "mod_tactical_001": [5, 10, 15, 15][index],
                "mod_tactical_002": [5, 10, 15, 15][index],
                "mod_tactical_003": [5, 10, 15, 15][index],
                "mod_tactical_2": [5, 10, 15, 15][index],
            }
        }


        itemList.forEach((id) => {
            const item = items[id]
            const parent = item._parent
            switch (true) {
                case checkParentRecursive(parent, items, ["5448f3a64bdc2d60728b456a"]): //stims
                    newItem.generation.stims["whitelist"] = [...newItem.generation.stims["whitelist"] || [], id]
                    break;
                case checkParentRecursive(parent, items, ["5448f3a14bdc2d27728b4569"]): //ThrowWeap
                    newItem.generation.drugs["whitelist"] = [...newItem.generation.drugs["whitelist"] || [], id]
                    break;
                case checkParentRecursive(parent, items, ["543be6564bdc2df4348b4568"]): //ThrowWeap
                    newItem.generation.grenades["whitelist"] = [...newItem.generation.grenades["whitelist"] || [], id]
                    break;
                case checkParentRecursive(parent, items, [medsParent]): //FoodDrink
                    newItem.generation.healing["whitelist"] = [...newItem.generation.healing["whitelist"] || [], id]
                    break;
                case checkParentRecursive(parent, items, [barterParent, "543be6674bdc2df1348b4569"]): //FoodDrink
                    newItem.generation.looseLoot["whitelist"] = [...newItem.generation.looseLoot["whitelist"] || [], id]
                    break;
                case checkParentRecursive(parent, items, [magParent]):
                    // newItem.generation.magazines["whitelist"] = [...newItem.generation.magazines["whitelist"] || [], id]
                    break;
                default:
                    break;
            }
        })

        Object.keys(newItem.generation).forEach((key) => {
            if (!newItem.generation[key]?.whitelist) {
                newItem.generation[key] = { ...newItem.generation[key], min: 0, max: 0 }
            } else {
                newItem.generation[key].whitelist = deDupeArr(newItem.generation[key].whitelist)
            }
        })

        randomizationItems.push(newItem)
    })

    botConfig.equipment.pmc.randomisation = randomizationItems
}


export const buildInitialUsecAppearance = (appearance: Appearance) => {
    appearance.feet = {
        "5cde95ef7d6c8b04713c4f2d": 1
    }
    appearance.body = {
        "5cde95d97d6c8b647a3769b0": 1
    }
}


export const buildInitialBearAppearance = (appearance: Appearance) => {
    appearance.feet = {
        "5cc085bb14c02e000e67a5c5": 1
    }
    appearance.body = {
        "5cc0858d14c02e000c6bea66": 1
    }
}

export const buildClothingWeighting = (suit: ISuit[], items: Record<string, ICustomizationItem>, botConfig: IBotConfig) => {
    const levels: number[][] = [[1, 4], [5, 7], [8, 15], [16, 22], [23, 30], [31, 40], [41, 100]]
    botConfig.equipment.pmc.clothing = buildEmptyClothingAdjustments(levels)
    const clothingAdjust = botConfig.equipment.pmc.clothing

    suit.forEach(({ suiteId, requirements: { profileLevel, loyaltyLevel } }) => {
        if (profileLevel === 0) return;
        const index = levels.findIndex(([min, max]: number[]) => {
            if (profileLevel >= min && profileLevel <= max) {
                return true
            }
        })
        if (index === undefined) return console.log('Empty index for: ', suiteId)
        if (items[suiteId]?._props?.Body) {
            if (!clothingAdjust[index].clothing.add["body"]) clothingAdjust[index].clothing.add["body"] = {}
            clothingAdjust[index].clothing.add["body"][items[suiteId]._props.Body] = (profileLevel * loyaltyLevel)
        }

        if (items[suiteId]?._props?.Feet) {
            if (!clothingAdjust[index].clothing.add["feet"]) clothingAdjust[index].clothing.add["feet"] = {}
            clothingAdjust[index].clothing.add["feet"][items[suiteId]._props.Feet] = (profileLevel * loyaltyLevel)
        }
    })
}




export const weaponTypes = {
    "5447b6254bdc2dc3278b4568": [SightType.AssaultScope, SightType.OpticScope],// SniperRifle
    "5447b6194bdc2d67278b4567": [SightType.AssaultScope, SightType.OpticScope],// MarksmanRifle
    "5447b5fc4bdc2d87278b4567": [SightType.CompactCollimator, SightType.Collimator, SightType.AssaultScope],// AssaultCarbine
    "5447b5f14bdc2d61278b4567": [SightType.CompactCollimator, SightType.Collimator, SightType.AssaultScope],// AssaultRifle
    "5447bed64bdc2d97278b4568": [SightType.CompactCollimator, SightType.Collimator],// MachineGun
    "5447b5e04bdc2d62278b4567": [SightType.CompactCollimator, SightType.Collimator],// Smg
    "5447bee84bdc2dc3278b4569": [SightType.CompactCollimator, SightType.Collimator],// SpecialWeapon
    "5447b6094bdc2dc3278b4567": [SightType.CompactCollimator, SightType.Collimator],// Shotgun
    "5447b5cf4bdc2d65278b4567": [SightType.CompactCollimator, SightType.Collimator],// Pistol
    "617f1ef5e8b54b0998387733": [SightType.CompactCollimator, SightType.Collimator],// Revolver
    "5447bedf4bdc2d87278b4568": [SightType.CompactCollimator, SightType.Collimator],// GrenadeLauncher
}

export const buildWeaponSightWhitelist = (
    items: Record<string, ITemplateItem>,
    botConfig: IBotConfig,
    { 1: a, 2: b, 3: c, 4: d }: TradersMasterList) => {
    botConfig.equipment.pmc.weaponSightWhitelist = {}
    const sightWhitelist = botConfig.equipment.pmc.weaponSightWhitelist
    const traderItems = [...new Set([...a, ...b, ...c, ...d])]

    traderItems.forEach(id => {
        if (checkParentRecursive(id, items, Object.values(SightType))) {
            for (const key in weaponTypes) {
                const sightsToCheck = weaponTypes[key];
                if (checkParentRecursive(id, items, sightsToCheck)) {
                    if (!sightWhitelist[key]) sightWhitelist[key] = []
                    sightWhitelist[key].push(id)
                }
            }
        }
    })
}