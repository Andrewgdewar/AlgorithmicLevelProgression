import {
    ICustomizationItem
} from '@spt-aki/models/eft/common/tables/ICustomizationItem';
import { ITemplateItem } from '@spt-aki/models/eft/common/tables/ITemplateItem';
import { ISuit } from '@spt-aki/models/eft/common/tables/ITrader';
import {
    EquipmentFilterDetails,
    IBotConfig,
    WeightingAdjustmentDetails
} from '@spt-aki/models/spt/config/IBotConfig';

import advancedConfig from '../config/advancedConfig.json';
import config, { levelRange } from '../config/config.json';
import { MinMax } from '../types/models/common/MinMax.d';
import {
    Appearance,
    Inventory,
    Mods
} from '../types/models/eft/common/tables/IBotType.d';

export const headwearParent = "5a341c4086f77401f2541505"
export const AmmoParent = "5485a8684bdc2da71d8b4567"
export const magParent = "5448bc234bdc2d3c308b4569"
export const barterParent = "5448eb774bdc2d0a728b4567"
export const keyMechanical = "5c99f98d86f7745c314214b3"
export const stimParent = "5448f3a64bdc2d60728b456a"
export const painKillerParent = "5448f3a14bdc2d27728b4569"
export const medicalParent = "5448f3ac4bdc2dce718b4569"
export const medKitParent = "5448f39d4bdc2d0a728b4568"
export const FoodDrinkParent = "543be6674bdc2df1348b4569"
export const medsParent = "543be5664bdc2dd4348b4569"
export const modParent = "5448fe124bdc2da5018b4567"
export const masterMod = "55802f4a4bdc2ddb688b4569"
export const moneyParent = "543be5dd4bdc2deb348b4569"
export const sightParent = "5448fe7a4bdc2d6f028b456b"
export const stockParent = "55818a594bdc2db9688b456a"
export const pistolGripParent = "55818a684bdc2ddd698b456d"
export const muzzleParent = "5448fe394bdc2d0d028b456c"
export const receiverParent = "55818a304bdc2db5418b457d"
export const gasblockParent = "56ea9461d2720b67698b456f"
export const barrelParent = "555ef6e44bdc2de9068b457e"
export const handguardParent = "55818a104bdc2db9688b4569"
export const chargeParent = "55818a104bdc2db9688b4569"
export const mountParent = "55818b224bdc2dde698b456f"

export enum SightType {
    AssaultScope = "55818add4bdc2d5b648b456f",
    Collimator = "55818ad54bdc2ddc698b4569",
    CompactCollimator = "55818acf4bdc2dde698b456b",
    OpticScope = "55818ae44bdc2dde698b456c",
}

export const addToModsObject = (
    mods: { "1": {}, "2": {}, "3": {}, "4": {} },
    _tpl: string,
    items: Record<string, ITemplateItem>,
    loyaltyLevel: number,
    slotId: string = "") => {
    switch (true) {
        case checkParentRecursive(_tpl, items, [magParent]):
            if (!mods[loyaltyLevel]?.["mod_magazine"]) mods[loyaltyLevel]["mod_magazine"] = []
            mods[loyaltyLevel]["mod_magazine"].push(_tpl)
            break;
        case slotId !== "hideout":
            if (!mods[loyaltyLevel]?.[slotId]) mods[loyaltyLevel][slotId] = []
            mods[loyaltyLevel][slotId].push(_tpl)
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

}

export const addKeysToPockets = (traderItems: Set<string>, items: Record<string, ITemplateItem>, inventory: Inventory) => {
    traderItems.forEach((id) => {
        if (id && items[id]?._parent && checkParentRecursive(id, items, [keyMechanical])) {
            inventory.items.Pockets.push(id)
            inventory.items.Backpack.push(id)
            inventory.items.TacticalVest.push(id)
        }
    })
    inventory.items.Pockets = deDupeArr(inventory.items.Pockets)
    inventory.items.Backpack = deDupeArr(inventory.items.Backpack)
    inventory.items.TacticalVest = deDupeArr(inventory.items.TacticalVest)
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

export const getArmorRating = ({ _props: { RepairCost, Durability, armorClass, armorZone, Weight }, _name, _id }: any): number => {
    const armorZoneCoverage = armorZone?.length || 0
    const durability = Durability * 0.1
    const total = Math.round((armorClass * 30) + durability + (armorZoneCoverage * 3) - Weight)

    if (total < 0) return 1
    return total
}

export const getAmmoWeighting = ({ _props: { PenetrationPower, Damage, InitialSpeed, ProjectileCount }, _id, _name }: ITemplateItem): number => {
    let penBonus = ((PenetrationPower - 20) * 10)
    if (penBonus < 0) penBonus = 0
    const damBonus = (ProjectileCount ? (Damage * ProjectileCount) * 0.1 : Damage)
    let speedBonus = InitialSpeed > 600 ? 10 : 0
    const rating = Math.round(penBonus + speedBonus + damBonus)
    // if (rating > 20) console.log(rating || 3, _name)

    return rating || 3
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
    let highestKey = ""
    for (const key in ammoWeight) {
        const value = ammoWeight[key];
        if (value > highestValue) {
            highestValue = value
            highestKey = key
        }
    }
    // console.log(highestKey, highestValue)
    return highestValue
}

export const getWeaponWeighting = ({
    _props: { Ergonomics, BoltAction, weapClass, weapFireType, RecoilForceUp, ReloadMode } = {}, _name, _id }: ITemplateItem,
    highestScoringAmmo: number,
): number => {
    let ammo = highestScoringAmmo
    let gun = Ergonomics

    if (ReloadMode.includes("OnlyBarrel")) ammo = ammo / 6
    if (RecoilForceUp > 300) ammo = ammo / 4
    if (weapClass === "pistol") ammo = ammo / 2
    if (BoltAction) ammo = ammo / 4
    if (weapFireType.includes('fullauto')) ammo = ammo * 1.5
    if (weapClass !== "pistol" && RecoilForceUp < 100) gun = gun + 10

    const finalValue = Math.round(gun + ammo)
    // if (finalValue > 5) console.log(finalValue > 0 ? finalValue : 1, Math.round(ammo), Math.round(gun), _name, weapClass)
    return finalValue > 1 ? finalValue : 1
}


export const getBackPackInternalGridValue = ({
    _props: { Grids, Weight } = {}, _name, _id }: ITemplateItem,
): number => {
    let total = 0
    Grids.forEach(({ _props }) => {
        total += _props?.cellsH * _props?.cellsV
        // if the backpack can't hold "Items" give it a severe lower ranking
        if (_props.filters?.[0]?.Filter?.length && !_props.filters?.[0]?.Filter?.includes("54009119af1c881c07000029")) {
            total = total / 6
        }
    })

    total = Math.round(((total) - (Weight * 5)) - ((Grids.length - 1) * 3))
    if (["6034d103ca006d2dca39b3f0", "6038d614d10cbf667352dd44"].includes(_id)) {
        total = Math.round(total * 0.7)
    }
    // console.log(_name, _id, " - ", (total > 1 ? total : 1) + 20)
    return (total > 1 ? total : 1) + 30
}


export const getTacticalVestValue = (item: ITemplateItem,
): number => {
    const { Grids } = item._props
    let spaceTotal = 0
    Grids.forEach(({ _props }) => {
        spaceTotal = spaceTotal + (_props?.cellsH * _props?.cellsV)
    })
    spaceTotal = Math.round(spaceTotal) || 3
    const armorRating = getArmorRating(item) * 0.3
    // console.log(item._name, item._id, " - ", armorRating > 5 ? armorRating + spaceTotal : spaceTotal * 4)
    return Math.round(armorRating > 5 ? armorRating : (spaceTotal * 10))
}

export const equipmentIdMapper = {
    Headwear: [headwearParent],
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
                case id === "60db29ce99594040e04c4a27":
                    whitelist[index].equipment["FirstPrimaryWeapon"] =
                        [...whitelist[index].equipment["FirstPrimaryWeapon"] ? whitelist[index].equipment["FirstPrimaryWeapon"] : [], id]
                    break;
                case !!equipmentType:
                    whitelist[index].equipment[equipmentType] =
                        [...whitelist[index].equipment[equipmentType] ? whitelist[index].equipment[equipmentType] : [], id]
                    break;
                default:
                    break;
            }
        })



        if (!!whitelist[index + 1]) {
            // if (!whitelist[index + 1]["ammo"]) whitelist[index + 1]["ammo"] = {}
            // whitelist[index + 1]["ammo"] = { ...whitelist[index]["ammo"] }
            whitelist[index + 1].equipment = cloneDeep(whitelist[index].equipment)
        }
    })
    // console.log(JSON.stringify(botConfig.equipment.pmc.whitelist))
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
            [id]: rating + config.equipmentRandomness
        }
    } else {
        weight.equipment.edit[equipmentType] = {
            ...weight.equipment.edit[equipmentType] || {},
            [id]: rating + config.equipmentRandomness
        }
    }
}


export const setWeightingAdjustments = (
    items: Record<string, ITemplateItem>,
    botConfig: IBotConfig,
    tradersMasterList: TradersMasterList,
    mods: Record<string, Record<string, string[]>>
) => {
    botConfig.equipment.pmc.weightingAdjustments = buildEmptyWeightAdjustments()
    const weight = botConfig.equipment.pmc.weightingAdjustments

    const itemsForNextLevel = {}

    numList.forEach((num, index) => {
        const loyalty = num;
        const itemList = [...tradersMasterList[loyalty]]
        const finalList = [
            ...new Set([
                ...itemsForNextLevel[num] || [],
                ...itemList,
                ...num === 4 && config.addDangerousBulletsToTier4Bots ? advancedConfig.forbiddenBullets : []
            ])]

        // First edit ammo
        finalList.forEach(id => {
            const item = items[id]
            const parent = item._parent

            // Ammo Parent
            if (checkParentRecursive(parent, items, [AmmoParent])) {
                const calibre = item._props.Caliber || item._props.ammoCaliber
                if ((num + 1) < 5) {
                    if (!itemsForNextLevel[num + 1]) itemsForNextLevel[num + 1] = new Set([])
                    itemsForNextLevel[num + 1].add(id)
                }
                if (!weight[index]?.ammo.edit?.[calibre]) {
                    weight[index].ammo.edit = { ...weight[index].ammo.edit, [calibre]: {} }
                }

                const ammoWeight = getAmmoWeighting(item)

                weight[index].ammo.edit[calibre] =
                    { ...weight[index].ammo.edit[calibre] || {}, [id]: ammoWeight }
            }
        })

    })

    //Make bad ammos worse, better ones better
    numList.forEach((num, index) => {
        Object.keys(weight[index].ammo.edit).forEach((caliber => {
            const caliberList = Object.keys(weight[index].ammo.edit[caliber]).sort((a, b) => weight[index].ammo.edit[caliber][b] - weight[index].ammo.edit[caliber][a])
            caliberList.forEach((id, rank) => {
                if (caliberList.length > 1 && rank > 0) {
                    if (rank > 3) weight[index].ammo.edit[caliber][id] = 1
                    const modifier = (caliberList.length - rank) / caliberList.length
                    weight[index].ammo.edit[caliber][id] = Math.round(weight[index].ammo.edit[caliber][id] * modifier) || 1
                }
            })
        }))
        // console.log(JSON.stringify(weight[index].ammo.edit))
    })


    numList.forEach((num, index) => {
        const loyalty = num;
        const itemList = [...tradersMasterList[loyalty]]
        const finalList = [...new Set([...itemsForNextLevel[num] || [], ...itemList])]

        // Was this needed?
        // const combinedWeightingAdjustmentItem = {} as WeightingAdjustmentDetails
        // for (const key of botConfig.equipment.pmc.weightingAdjustments) {
        //     mergeDeep(combinedWeightingAdjustmentItem, key)
        // }
        // mergeDeep(combinedWeightingAdjustmentItem, weight[index])

        finalList.forEach(id => {
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
                    if ((num + 1) < 5) {
                        if (!itemsForNextLevel[num + 1]) itemsForNextLevel[num + 1] = new Set([])
                        itemsForNextLevel[num + 1].add(id)
                    }
                    const isFromPreviousLevel = !!itemsForNextLevel[num]?.has(id)
                    const calibre = item._props.Caliber || item._props.ammoCaliber
                    const highestScoringAmmo = getHighestScoringAmmoValue(weight[index].ammo.edit[calibre])
                    const weaponRating = isFromPreviousLevel ?
                        Math.round(getWeaponWeighting(item, highestScoringAmmo) * 0.8) :
                        getWeaponWeighting(item, highestScoringAmmo)
                    // Check if revolver shotgun
                    if (id === "60db29ce99594040e04c4a27") setWeightItem(weight[index], "FirstPrimaryWeapon", id, weaponRating)
                    else {
                        setWeightItem(weight[index], equipmentType, id, weaponRating)
                    }
                    break;
                case "Headwear":
                    const blocksEarpiece = item?._props?.BlocksEarpiece
                    const coverageBonus = item?._props?.headSegments?.length || 0
                    const helmetBonus = item?._props?.armorClass * 30
                    const durability = item?._props?.Durability * 0.1
                    const ricochetChance = ((item?._props?.RicochetParams.x + item?._props?.RicochetParams.y) * item?._props?.RicochetParams.z) * 0.2
                    let rating = helmetBonus - item?._props?.Weight + coverageBonus + ricochetChance + durability
                    if (blocksEarpiece) rating = (rating) * 0.1
                    if (rating < 10) rating = 10
                    // if (rating > 10) console.log(loyalty, item._name, blocksEarpiece, Math.round(rating))
                    setWeightItem(weight[index], equipmentType, id, Math.round(rating))
                    break;
                case "Earpiece":
                    const ambientVolumeBonus = item?._props?.AmbientVolume * -1
                    const compressorBonus = item?._props?.CompressorVolume * -0.5

                    setWeightItem(weight[index], equipmentType, id, Math.round(compressorBonus + ambientVolumeBonus))
                    break;
                case "FaceCover":
                    setWeightItem(weight[index], equipmentType, id, loyalty * 3)
                    break;
                case "ArmorVest":
                    const armorRating = getArmorRating(item)
                    setWeightItem(weight[index], equipmentType, id, armorRating)
                    break;
                case "ArmBand":
                    setWeightItem(weight[index], equipmentType, id, loyalty * 5)
                    break;
                case "SecuredContainer":
                    setWeightItem(weight[index], equipmentType, id, ((item._props.sizeWidth * item._props.sizeHeight) || 3))
                    break;
                case "Scabbard":
                    setWeightItem(weight[index], equipmentType, id, ((loyalty * 10) || 3))
                    break;
                case "Eyewear":
                    setWeightItem(weight[index], equipmentType, id,
                        (Math.round(item._props.LootExperience + (item._props.BlindnessProtection * 5)) || 3))
                    break;
                case "Backpack":
                    const backpackInternalGridValue = getBackPackInternalGridValue(item)
                    setWeightItem(weight[index], equipmentType, id, backpackInternalGridValue)
                    break;
                case "TacticalVest":
                    const tacticalVestWeighting = getTacticalVestValue(item)
                    setWeightItem(weight[index], equipmentType, id, tacticalVestWeighting)
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

            const modsList = mods[num]
            Object.keys(modsList).forEach(modtype => {
                modsList[modtype].forEach(modId => {
                    setWeightItem(weight[index], modtype, modId, (loyalty * 20), true)
                })
            })
        })
    })

    // console.log(JSON.stringify(weight))
}

const weaponsToAllowAllMods = { "5ae08f0a5acfc408fb1398a1": true }

const checkForScopeTypeRecursive = (modId: string, items: Record<string, ITemplateItem>, weaponId: string, mods: Mods) => {
    // if (memo[modId] !== undefined) return memo[modId]
    if (checkParentRecursive(items[modId]?._parent, items, [sightParent])) {
        const allowedSightParents = weaponTypes[items[weaponId]?._parent]
        if (allowedSightParents.length === 0) {
            // memo[modId] = false
            return false
        }
        // console.log(allowedSightParents)
        const result = checkParentRecursive(items[modId]?._parent, items, allowedSightParents)
        // memo[modId] = result
        return result
    } else {
        const isMount = items?.[items?.[modId]?._parent]?._id === mountParent
        if (isMount) {
            const newModObject = {}
            let pass = true
            if (items[modId]?._props?.Slots?.length > 0) {
                items[modId]._props.Slots.forEach(mod => {
                    if (mod._props?.filters?.[0]?.Filter?.length) {
                        if (mod._name.includes("scope")) {
                            const allowedItems = mod._props.filters[0].Filter.filter((_tpl) => checkForScopeTypeRecursive(_tpl, items, weaponId, mods))
                            if (allowedItems.length) {
                                newModObject[mod._name] = allowedItems
                            } else {
                                pass = false
                            }
                        } else {
                            newModObject[mod._name] = mod._props.filters[0].Filter
                        }
                    }
                })
            }

            if (pass && Object.keys(newModObject).length) {
                mods[modId] = newModObject
                // memo[modId] = true
                return true
            }
        }
        // memo[modId] = false
        return false
    }
}

export const buildOutModsObject = (
    traderList: Set<string>,
    items: Record<string, ITemplateItem>,
    inventory: Inventory,
    botConfig: IBotConfig
) => {
    traderList.forEach((id) => {
        const item = items[id]
        const newModObject = {} as Record<string, string[]>
        const siteWhiteList = botConfig.equipment.pmc.weaponSightWhitelist
        if (!blacklistedItems.has(id) && checkParentRecursive(item._parent, items, [magParent, "5422acb9af1c889c16000029", headwearParent])) {
            switch (true) {
                case checkParentRecursive(item._parent, items, [magParent]):
                    if ((item?._props?.Height * item?._props?.Width) < 3) {
                        const bulletList = item?._props?.Cartridges?.[0]?._props?.filters?.[0]?.Filter.filter((_tpl) => !blacklistedItems.has(_tpl))
                        if (bulletList) {
                            newModObject["cartridges"] = bulletList
                            inventory.mods[id] = newModObject
                        }
                    } else {
                        console.warn(id, item._name, item?._props?.Cartridges?.[0]?._max_count)
                    }
                    break;
                case checkParentRecursive(item._parent, items, ["5422acb9af1c889c16000029"])://Weapon
                    if (item?._props?.Slots?.length > 0) {
                        item._props.Slots.forEach(mod => {
                            if (!weaponsToAllowAllMods[id] && mod._name?.includes("scope")) {
                                newModObject[mod._name] = mod._props?.filters[0].Filter.filter((_tpl) => !blacklistedItems.has(_tpl) && checkForScopeTypeRecursive(_tpl, items, id, inventory.mods))
                            } else if (mod._props?.filters?.[0]?.Filter?.length) {
                                newModObject[mod._name] = mod._props.filters[0].Filter.filter((_tpl) => !blacklistedItems.has(_tpl))
                            }
                        })
                    }
                    if (item._props?.Chambers?.[0]?._name === "patron_in_weapon" &&
                        item._props?.Chambers?.[0]?._props?.filters?.[0]?.Filter?.length
                    ) {
                        newModObject["patron_in_weapon"] = item._props.Chambers[0]._props?.filters[0].Filter.filter((_tpl) => !blacklistedItems.has(_tpl))
                    }
                    if (Object.keys(newModObject)) {
                        inventory.mods[id] = newModObject
                    }
                    break;
                case checkParentRecursive(item._parent, items, [headwearParent])://Headwear
                    inventory.mods[id] = newModObject
                    break;
                default:
                    // console.log(items[item._parent]._name, id)
                    break;
            }
        }
    })

    traderList.forEach((id) => {
        const item = items[id]
        const newModObject = {} as Record<string, string[]>
        const siteWhiteList = botConfig.equipment.pmc.weaponSightWhitelist
        if (!inventory.mods[id] && !blacklistedItems.has(id) && checkParentRecursive(item._parent, items, [modParent])) {
            if (item?._props?.Slots?.length > 0) {
                item._props.Slots.forEach(mod => {
                    if (mod._props?.filters?.[0]?.Filter?.length) {
                        switch (true) {
                            case mod._name?.includes("scope") && checkParentRecursive(item._parent, items, [handguardParent, gasblockParent]):/*gasblockParent,*/
                                newModObject[mod._name] = []
                                break;
                            // case mod._name?.includes("scope"):
                            //     newModObject[mod._name] = mod._props?.filters[0].Filter.filter((_tpl) => siteWhiteList["5447bedf4bdc2d87278b4568"].includes(_tpl))
                            // console.log(item._name, newModObject[mod._name])
                            default:
                                newModObject[mod._name] = mod._props?.filters[0].Filter.filter((_tpl) => !blacklistedItems.has(_tpl))
                                break;
                        }
                    }
                })
                if (Object.keys(newModObject)) {
                    inventory.mods[id] = newModObject
                }
            }
        }
    })
    // console.log(JSON.stringify(inventory.mods))
}

export const buildInitialRandomization = (items: Record<string, ITemplateItem>, botConfig: IBotConfig, traderList: TradersMasterList) => {
    const randomizationItems = []
    numList.forEach((num, index) => {
        const range = levelRange[num]
        const loyalty = num
        const itemList = new Set([...traderList[loyalty]])

        const newItem = {
            levelRange: range,
            equipment: {
                "Headwear": [75, 85, 99, 99][index],
                "Earpiece": [50, 65, 90, 100][index],
                "FaceCover": [15, 25, 35, 45][index],
                "ArmorVest": [99, 99, 99, 99][index],
                "ArmBand": [25, 45, 59, 69][index],
                "TacticalVest": [96, 96, 99, 99][index],
                "Pockets": [25, 45, 59, 69][index],
                "SecuredContainer": 100,
                "SecondPrimaryWeapon": [0, 0, 1, 2][index],
                "Scabbard": [1, 5, 5, 10][index],
                "FirstPrimaryWeapon": [85, 98, 99, 99][index],
                "Holster": [1, 5, 10, 10][index],
                "Eyewear": [5, 15, 26, 49][index],
                "Backpack": [70, 80, 90, 99][index],
            },
            generation: {
                "stims": {
                    "min": 1,
                    "max": [1, 1, 2, 2][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.stims?.whitelist ? { whitelist: randomizationItems[index - 1].generation.stims.whitelist } : {} }
                },
                "drugs": {
                    "min": 1,
                    "max": [1, 2, 2, 2][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.drugs?.whitelist ? { whitelist: randomizationItems[index - 1].generation.drugs.whitelist } : {} }
                },
                "healing": {
                    "min": 1,
                    "max": [1, 1, 1, 2][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.healing?.whitelist ? { whitelist: randomizationItems[index - 1].generation.healing.whitelist } : {} }
                },
                "grenades": {
                    "min": [0, 0, 0, 1][index],
                    "max": [1, 2, 2, 2][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.grenades?.whitelist ? { whitelist: randomizationItems[index - 1].generation.grenades.whitelist } : {} }
                },
                "looseLoot": {
                    "min": [0, 1, 2, 3][index],
                    "max": [3, 5, 6, 8][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.looseLoot?.whitelist ? { whitelist: randomizationItems[index - 1].generation.looseLoot.whitelist } : {} }
                },
                "magazines": {
                    "min": [2, 2, 3, 3][index],
                    "max": [3, 3, 4, 4][index],
                    "whitelist": botConfig.equipment.pmc.whitelist[index].equipment.mod_magazine
                },

            },
            "randomisedWeaponModSlots": [
                // "mod_barrel",
                // "mod_scope",
                // "mod_scope_000",
                // "mod_scope_001",
                // "mod_scope_002",
                // "mod_scope_003",
                // "mod_handguard",
                // "mod_magazine",
                // "mod_muzzle",
                // "mod_bipod",
                // "mod_muzzle_000",
                // "mod_charge",
                // "mod_reciever",
                // "mod_trigger",
                // "mod_gas_block",
                // "mod_pistol_grip",
                // "mod_pistol_grip_akms",
                // "mod_foregrip",
                // "mod_stock",
                // "mod_stock_000",
                // "mod_stock_001",
                // "mod_stock_akms",
                // "mod_stock_axis",
                // "mod_mount_000",
                // "mod_mount_001",
                // "mod_mount_002",
                // "mod_mount_003",
                // "mod_mount_004",
                // "mod_mount_005",
                // "mod_mount_006",
                // "mod_tactical",
                // "mod_tactical_2",
                // "mod_tactical_000",
                // "mod_tactical_001",
                // "mod_tactical_002",
                // "mod_tactical_003"
            ],
            "mods": {
                "mod_barrel": [15, 20, 25, 25][index],
                "mod_bipod": [1, 10, 5, 11][index],
                "mod_flashlight": [35, 50, 70, 90][index],
                "mod_foregrip": [30, 60, 70, 90][index],
                "mod_handguard": [20, 30, 70, 90][index],
                "mod_launcher": [0, 0, 5, 15][index],
                "mod_magazine": [50, 60, 80, 90][index],
                "mod_magazine_000": [0, 0, 25, 35][index],
                "mod_mount": [60, 90, 100, 100][index],
                "mod_mount_000": [40, 45, 65, 90][index],
                "mod_mount_001": [40, 45, 65, 90][index],
                "mod_mount_002": [40, 45, 65, 90][index],
                "mod_mount_003": [40, 45, 65, 90][index],
                "mod_mount_004": [40, 45, 65, 90][index],
                "mod_mount_005": [40, 45, 65, 90][index],
                "mod_mount_006": [40, 45, 65, 90][index],
                "mod_muzzle": [15, 35, 65, 85][index],
                "mod_muzzle_000": [15, 35, 65, 85][index],
                "mod_muzzle_001": [15, 35, 65, 85][index],
                "mod_equipment": [15, 25, 25, 35][index],
                "mod_equipment_000": [15, 25, 25, 35][index],
                "mod_equipment_001": [15, 25, 25, 35][index],
                "mod_equipment_002": [15, 25, 25, 35][index],
                "mod_pistol_grip_akms": [1, 15, 25, 35][index],
                "mod_pistol_grip": [1, 15, 25, 35][index],
                "mod_scope": [90, 95, 100, 100][index],
                "mod_scope_000": [90, 95, 100, 100][index],
                "mod_scope_001": [90, 95, 100, 100][index],
                "mod_scope_002": [90, 95, 100, 100][index],
                "mod_scope_003": [90, 95, 100, 100][index],
                "mod_tactical": [15, 30, 35, 50][index],
                "mod_tactical_2": 0,
                "mod_tactical001": [15, 30, 35, 50][index],
                "mod_tactical002": [15, 30, 35, 50][index],
                "mod_tactical_000": [1, 5, 5, 10][index],
                "mod_tactical_001": [1, 5, 5, 10][index],
                "mod_tactical_002": [15, 30, 35, 50][index],
                "mod_tactical_003": [15, 30, 35, 50][index],
                "mod_charge": [10, 20, 35, 50][index],
                "mod_stock": 99,
                "mod_stock_000": 99,
                // "mod_stock_001": [1, 10, 15, 20][index],
                "mod_stock_akms": 100,
                // "mod_sight_front": 20,
                // "mod_sight_rear": 50,
                // "mod_reciever": 100,
                // "mod_gas_block": [1, 10, 15, 20][index],
                "mod_pistolgrip": [1, 15, 25, 35][index],
                // "mod_trigger": 1,
                // "mod_hammer": 1,
                // "mod_catch": 1
            }
        }

        const medkits = {
            1: ["590c661e86f7741e566b646a", "590c661e86f7741e566b646a"],
            2: ["544fb45d4bdc2dee738b4568"],
            3: ["590c678286f77426c9660122"],
            4: ["60098ad7c2240c0fe85c570a"]
        }


        itemList.forEach((id) => {
            const item = items[id]
            const parent = item._parent
            switch (true) {
                case checkParentRecursive(parent, items, num >= 3 ? [painKillerParent, stimParent] : [painKillerParent]): //stims
                    newItem.generation.stims["whitelist"] = [...newItem.generation.stims["whitelist"] || [], id]
                    break;
                case checkParentRecursive(parent, items, [medicalParent]): //drugs
                    newItem.generation.drugs["whitelist"] = [...newItem.generation.drugs["whitelist"] || [], id]
                    break;
                case checkParentRecursive(parent, items, [medKitParent]): //meds
                    newItem.generation.healing["whitelist"] = [...medkits[num], ...newItem.generation.healing["whitelist"] || [], id]
                    break;
                case checkParentRecursive(parent, items, ["543be6564bdc2df4348b4568"]): //ThrowWeap
                    if (items[id]._props.ThrowType !== "smoke_grenade") {
                        newItem.generation.grenades["whitelist"] = [...newItem.generation.grenades["whitelist"] || [], id]
                    }
                    break;
                case checkParentRecursive(parent, items, [barterParent, FoodDrinkParent]): //FoodDrink/barter
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
    // console.log(JSON.stringify(botConfig.equipment.pmc.randomisation))
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

    suit.forEach(({ suiteId, requirements: { profileLevel, loyaltyLevel } = {} }) => {
        if (!profileLevel || !suiteId || loyaltyLevel === undefined) return;
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
    // console.log(JSON.stringify(clothingAdjust))
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
    const traderItems = [...new Set([...a, ...b, ...c])] //, ...d

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
    // console.log(JSON.stringify(sightWhitelist))
}

export const buildBlacklist = (items: Record<string, ITemplateItem>, botConfig: IBotConfig, mods: { "1": {}, "2": {}, "3": {}, "4": {} }) => {
    delete botConfig.equipment.pmc.blacklist[0].equipment.mod_magazine
    const currentBlacklist = cloneDeep(botConfig.equipment.pmc.blacklist[0])
    botConfig.equipment.pmc.blacklist = []
    const blacklist = botConfig.equipment.pmc.blacklist

    // const itemsToAddToBlacklist = ["mod_scope", "mod_magazine"]
    numList.forEach((num, index) => {
        const modList = mods[num]
        const range = levelRange[num]
        const loyalty = num
        const base = { ...cloneDeep(currentBlacklist), levelRange: range }
        if (index < 2) {
            numList.splice(0, index + 2).forEach((numInner) => {
                Object.keys(mods[numInner]).forEach(key => {
                    if (!base.equipment[key]) base.equipment[key] = []
                    base.equipment[key].push(...mods[numInner][key])
                })
            })
        }
        blacklist.push(base)
    })
}



//skull lock
export const blacklistedItems = new Set([
    ...config.addDangerousBulletsToTier4Bots ? [] : advancedConfig.forbiddenBullets,
    ...config.customBlacklist,
    "544a3d0a4bdc2d1b388b4567",
    "5a16bb52fcdbcb001a3b00dc", //skull lock
    "5a1eaa87fcdbcb001865f75e", //reap-ir
    "5d1b5e94d7ad1a2b865a96b0", //flir
    "5c066ef40db834001966a595", //helmet_armasight_nvg_googles_mask
    '5a0c59791526d8dba737bba7', // butt pad
    "57371aab2459775a77142f22",
    //small mags 
    "57838f0b2459774a256959b2",
    "5aaa5e60e5b5b000140293d6",
    "5b1fd4e35acfc40018633c39",
    "59e5d83b86f7745aed03d262",
    "5b7bef1e5acfc43d82528402",
    "617130016c780c1e710c9a24",
    "55d4837c4bdc2d1d4e8b456c",
    "5c503ac82e221602b21d6e9a",
    "6241c2c2117ad530666a5108",
    //large mags
    "55d485804bdc2d8c2f8b456b",
    "56deeefcd2720bc8328b4568",
    "5882163224597757561aa920",
    "5a78832ec5856700155a6ca3",
    "5a966f51a2750c00156aacf6",
    "5cf8f3b0d7f00c00217872ef",
    "625ff2eb9f5537057932257d",
    "625ff3046d721f05d93bf2ee",
    "625ff31daaaa8c1130599f64",
    "627bce33f21bc425b06ab967",
    '564ca9df4bdc2d35148b4569',
    '55d481904bdc2d8c2f8b456a',
    '55d482194bdc2d1d4e8b456b',
    '5bed625c0db834001c062946',
    '55d485be4bdc2d962f8b456f',
    '5cbdc23eae9215001136a407',
    '5c6175362e221600133e3b94',
    '5cfe8010d7ad1a59283b14c6',
    '61695095d92c473c7702147a',
    '5ea034f65aad6446a939737e',
    '59c1383d86f774290a37e0ca',
    '5c6592372e221600133e47d7',
    '544a37c44bdc2d25388b4567',
    '5a718f958dc32e00094b97e7',
    '5c5db6742e2216000f1b2852',
    '5a351711c4a282000b1521a4',
    '5addccf45acfc400185c2989',
    '5b7bef9c5acfc43d102852ec',
    "5b1fb3e15acfc4001637f068",
    "59e5f5a486f7746c530b3ce2",
    "544a378f4bdc2d30388b4567",
    "5d1340bdd7ad1a0e8d245aab",
    "630e295c984633f1fb0e7c30",
    "5ba26586d4351e44f824b340",
    "5c5db6652e221600113fba51",
    "5cffa483d7ad1a049e54ef1c",
    "5d52d479a4b936793d58c76b",
    // stm-9
    // stocks
    "5c0faeddd174af02a962601f",
    "5d120a10d7ad1a4e1026ba85",
    "5b0800175acfc400153aebd4",
    "5947e98b86f774778f1448bc",
    "5947eab886f77475961d96c5",
    // "602e3f1254072b51b239f713",
    "5c793fb92e221644f31bfb64",
    "5c793fc42e221600114ca25d",
    "591aef7986f774139d495f03",
    "591af10186f774139d495f0e",
    "627254cc9c563e6e442c398f",
    "638de3603a1a4031d8260b8c",
    "5a33ca0fc4a282000d72292f",
    // Saiga-9 9x19 carbine
    // stocks
    "5cf50fc5d7f00c056c53f83c", //AK-74M CAA AKTS AK74 buffer tube > 25
    "5ac78eaf5acfc4001926317a", //AK-74M/AK-100 Zenit PT Lock >2
    //Full Size AK mods
    // stocks
    // "628a6678ccaab13006640e49", //AKM/AK-74 RD AK to M4 buffer tube adapter > 17
    "5b222d335acfc4771e1be099", //AKM/AK-74 Zenit PT Lock > 1
    "59ecc28286f7746d7a68aa8c", // AK-74U Zenit PT Lock > 1
    "5839a40f24597726f856b511", // bufferTubes > 21
    "5cf518cfd7f00c065b422214",
    "5649b2314bdc2d79388b4576",
    "5b04473a5acfc40018632f70", //beefy Stock
    "5e217ba4c1434648c13568cd", //Red funky stock
    "5b0e794b5acfc47a877359b2", // Zhokov black 
    "6087e2a5232e5a31c233d552", //Archangel 
    //DustCovers 
    // "59d6507c86f7741b846413a2", // AKM dust cover (6P1 0-1) allowing one
    "59e6449086f7746c9f75e822",
    "628a665a86cbd9750d2ff5e5",
    "5649af094bdc2df8348b4586",
    "5ac50da15acfc4001718d287",
    //bullets that think they are guns
    "624c0b3340357b5f566e8766",
    "624c0b3340357b5f566e8766",
    "6217726288ed9f0845317459",
    //Mosin shorty,
    "5bfd36ad0db834001c38ef66",
    "5bfd36290db834001966869a",
    "5a16b9fffcdbcb0176308b34",
    "5c07c9660db834001a66b588",
    "5d2f25bc48f03502573e5d85",
    "5a7c74b3e899ef0014332c29",
    //Waffle 545
    "615d8f8567085e45ef1409ca",
    //Mosin stocks
    "5bbdb870d4351e00367fb67d",
    "5bae13bad4351e00320204af",
    //IR lasers
    "57fd23e32459772d0805bcf1",
    "544909bb4bdc2d6f028b4577",
    "5d10b49bd7ad1a1a560708b0",
    "5c06595c0db834001a66af6c",
    "5c5952732e2216398b5abda2",
    "5a5f1ce64f39f90b401987bc",
    "61605d88ffa6e502ac5e7eeb",
    //pistolGrips
    "5b07db875acfc40dc528a5f6",
    "615d8faecabb9b7ad90f4d5d",
    "59db3acc86f7742a2c4ab912",
    "59db3b0886f77429d72fb895",
    "59db3a1d86f77429e05b4e92",
    "5d025cc1d7ad1a53845279ef",
    "5f6341043ada5942720e2dc5",
    "6087e663132d4d12c81fd96b",
    "5e2192a498a36665e8337386",
    "5cf54404d7f00c108840b2ef",
    "5b30ac585acfc433000eb79c",
    "628a664bccaab13006640e47",
    "628c9ab845c59e5b80768a81",
    "5c6bf4aa2e2216001219b0ae",
    "5649ae4a4bdc2d1b2b8b4588",
    "6113c3586c780c1e710c90bc",
    "6113cce3d92c473c770200c7",
    "6113cc78d3a39d50044c065a",
    "5b7d679f5acfc4001a5c4024",
    //Handguards
    "595cfa8b86f77427437e845b",
    "595cf16b86f77427440c32e2",
    "55f84c3c4bdc2d5f408b4576",
    "5c9a25172e2216000f20314e",
    "619b5db699fb192e7430664f",
    "5b2cfa535acfc432ff4db7a0",
    "5c9a25172e2216000f20314e",
    "55f84c3c4bdc2d5f408b4576",
    "588b56d02459771481110ae2",
    "5c9a26332e2216001219ea70",
    "5ea16ada09aa976f2e7a51be",
    "5ea16acdfadf1d18c87b0784",
    "5d4405f0a4b9361e6a4e6bd9",
    "5c78f2492e221600114c9f04",
    "5c78f2612e221600114c9f0d",
    "6034e3e20ddce744014cb878",
    "6034e3d953a60014f970617b",
    "6034e3cb0ddce744014cb870",
    "5c6d5d8b2e221644fc630b39",
    "5d00e0cbd7ad1a6c6566a42d",
    "5d00f63bd7ad1a59283b1c1e",
    "6087e0336d0bd7580617bb7a",
    "63888bbd28e5cc32cc09d2b6",
    //Foregrips
    "5fc0f9b5d724d907e2077d82",
    "5cda9bcfd7f00c0c0b53e900",
    "59f8a37386f7747af3328f06",
    "5a7dbfc1159bd40016548fde",
    "619386379fb0c665d5490dbe",
    "5de8fbad2fbe23140d3ee9c4",
    "5b057b4f5acfc4771e1bd3e9",
    "5c791e872e2216001219c40a",
    "5f6340d3ca442212f4047eb2",
    "591af28e86f77414a27a9e1d",
    "5c1bc5612e221602b5429350",
    "5c1cd46f2e22164bef5cfedb",
    "5c1bc5af2e221602b412949b",
    //long handgun stock
    "5d1c702ad7ad1a632267f429",

    "620109578d82e67e7911abf2",// signal pistol
    "62389aaba63f32501b1b444f",// signal ammo
    "62389ba9a63f32501b1b4451",
    "62389bc9423ed1685422dc57",
    "62389be94d5d474bf712e709",
    "635267f063651329f75a4ee8"
])