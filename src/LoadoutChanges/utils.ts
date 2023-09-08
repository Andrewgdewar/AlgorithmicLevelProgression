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

import advancedConfig from '../../config/advancedConfig.json';
import config, { levelRange } from '../../config/config.json';
import { MinMax } from '../../types/models/common/MinMax';
import {
    Appearance,
    Inventory,
    Mods
} from '../../types/models/eft/common/tables/IBotType';
import InternalBlacklist from './InternalBlacklist';

export const saveToFile = (data, filePath) => {
    var fs = require('fs');
    let dir = __dirname;
    let dirArray = dir.split("\\");
    const directory = (`${dirArray[dirArray.length - 5]}/${dirArray[dirArray.length - 4]}/${dirArray[dirArray.length - 3]}/${dirArray[dirArray.length - 2]}/`);
    fs.writeFile(directory + filePath, JSON.stringify(data, null, 4), function (err) {
        if (err) throw err;
    });
}

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
export const weaponParent = "5422acb9af1c889c16000029"

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
    const total = Math.round(((armorClass * 30) + durability + (armorZoneCoverage * 3)) - Weight)

    if (total < 1) return 1
    // console.log(_name, total)
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

export const getHeadwearRating = ({ _props: { BlocksEarpiece, headSegments, armorClass, Durability, RicochetParams, Weight }, _id, _name }: ITemplateItem) => {
    const blocksEarpiece = BlocksEarpiece
    const coverageBonus = headSegments?.length || 0
    const helmetBonus = armorClass * 20
    const durability = Durability * 0.1
    const ricochetChance = ((RicochetParams.x + RicochetParams.y) * RicochetParams.z) * 0.2
    let rating = helmetBonus - Weight + coverageBonus + ricochetChance + durability
    if (blocksEarpiece) rating = (rating) * 0.1
    if (rating < 10) rating = 10
    // console.log(_name, Math.round(rating))
    return Math.round(rating)
}

export const getEquipmentType = (id: string, items: Record<string, ITemplateItem>) => {
    const equipmentKeys = Object.keys(equipmentIdMapper)
    for (let index = 0; index < equipmentKeys.length; index++) {
        const key = equipmentKeys[index] as keyof typeof equipmentIdMapper | undefined
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
    if (_id === "5bfd297f0db834001a669119") ammo * 0.7 //Make mosin infantry less desirable
    if (weapFireType.length === 1 && weapFireType.includes('single')) ammo = ammo * 0.8
    if (ReloadMode.includes("OnlyBarrel")) ammo = ammo / 4
    if (RecoilForceUp > 200) ammo = ammo * 0.8
    if (BoltAction) ammo = ammo / 2
    if (weapFireType.includes('fullauto')) ammo = ammo * 1.2
    if (weapClass !== "pistol" && RecoilForceUp < 100) ammo * 1.2

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


export const getTacticalVestValue = (item: ITemplateItem): number => {
    const { Grids } = item._props
    let spaceTotal = 0
    Grids.forEach(({ _props }) => {
        spaceTotal = spaceTotal + (_props?.cellsH * _props?.cellsV)
    })
    spaceTotal = (Math.round(spaceTotal) - item._props.Weight) || 3
    if (spaceTotal < 5) spaceTotal = 5
    const armorRating = getArmorRating(item) * 0.8
    // if (armorRating < 5) console.log(item._name, item._id, " - ", armorRating > 5 ? armorRating : spaceTotal * 10)
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


export type oneToFive = "1" | "2" | "3" | "4" | "5"

export const getCurrentLevelRange = (currentLevel: number): oneToFive | undefined => {
    for (const key in levelRange) {
        const { min, max } = levelRange[key] as MinMax;
        if (currentLevel >= min && currentLevel <= max) return key as oneToFive
    }
}

export const numList = [1, 2, 3, 4, 5]

export const arrSum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0)

export const setupBaseWhiteList = (): EquipmentFilterDetails[] => {
    return numList.map(num => ({
        levelRange: levelRange[num],
        "equipment": {},
        "cartridge": {}
    }))
}

export type TradersMasterList = { 1: Set<string>, 2: Set<string>, 3: Set<string>, 4: Set<string>, 5: Set<string> }

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
                // case items[parent]?._parent === "5422acb9af1c889c16000029": < this is weapon PArent?
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
                ...num === 4 ?
                    (config.addDangerousBulletsToTier4Bots ? advancedConfig.forbiddenBullets[num] : [])
                    : (advancedConfig.forbiddenBullets[num] || []),
                ...itemsForNextLevel[num] || [],
                ...itemList,
            ])]

        // First edit ammo
        finalList.forEach(id => {
            const item = items[id]
            const parent = item._parent

            // Ammo Parent
            if (checkParentRecursive(parent, items, [AmmoParent])) {
                const calibre = item._props.Caliber || item._props.ammoCaliber
                if ((num + 1) < 6) {
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
                    if ((num + 1) < 6) {
                        if (!itemsForNextLevel[num + 1]) itemsForNextLevel[num + 1] = new Set([])
                        itemsForNextLevel[num + 1].add(id)
                    }

                    const calibre = item._props.Caliber || item._props.ammoCaliber
                    const highestScoringAmmo = getHighestScoringAmmoValue(weight[index].ammo.edit[calibre])
                    const weaponRating = getWeaponWeighting(item, highestScoringAmmo) + (tradersMasterList[num].has(id) ? (num * 20) : 0)
                    // Check if revolver shotgun
                    if (id === "60db29ce99594040e04c4a27") setWeightItem(weight[index], "FirstPrimaryWeapon", id, weaponRating)
                    else {
                        setWeightItem(weight[index], equipmentType, id, weaponRating)
                    }
                    break;
                case "Headwear":
                    const rating = getHeadwearRating(item)
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
        if (!blacklistedItems.has(id) && checkParentRecursive(item._parent, items, [magParent, weaponParent, headwearParent])) {
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
                case checkParentRecursive(item._parent, items, [weaponParent])://Weapon
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
                "Headwear": [75, 85, 99, 99, 99][index],
                "Earpiece": [50, 65, 90, 100, 100][index],
                "FaceCover": [15, 25, 35, 45, 80][index],
                "ArmorVest": [99, 99, 99, 99, 99][index],
                "ArmBand": [25, 45, 59, 69, 80][index],
                "TacticalVest": [96, 96, 99, 99, 99][index],
                "Pockets": [25, 45, 59, 69, 80][index],
                "SecuredContainer": 100,
                "SecondPrimaryWeapon": [0, 0, 1, 1, 1][index],
                "Scabbard": [1, 5, 5, 10, 40][index],
                "FirstPrimaryWeapon": [85, 98, 99, 99, 99][index],
                "Holster": [1, 5, 10, 10, 10][index],
                "Eyewear": [5, 15, 26, 49, 75][index],
                "Backpack": [70, 80, 90, 99, 99][index],
            },
            generation: {
                "stims": {
                    "min": 0,
                    "max": [1, 1, 2, 2, 2][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.stims?.whitelist ? { whitelist: randomizationItems[index - 1].generation.stims.whitelist } : {} }
                },
                "drugs": {
                    "min": 0,
                    "max": [1, 2, 2, 2, 2][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.drugs?.whitelist ? { whitelist: randomizationItems[index - 1].generation.drugs.whitelist } : {} }
                },
                "healing": {
                    "min": [0, 1, 1, 1, 1][index],
                    "max": [1, 1, 1, 1, 2][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.healing?.whitelist ? { whitelist: randomizationItems[index - 1].generation.healing.whitelist } : {} }
                },
                "grenades": {
                    "min": [0, 0, 0, 1, 1][index],
                    "max": [1, 2, 2, 2, 3][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.grenades?.whitelist ? { whitelist: randomizationItems[index - 1].generation.grenades.whitelist } : {} }
                },
                "looseLoot": {
                    "min": config.removePMCLootForLootingBots ? [0, 0, 0, 0, 1][index] : [0, 1, 2, 3, 4][index],
                    "max": config.removePMCLootForLootingBots ? [1, 1, 1, 2, 3] : [3, 5, 6, 8, 9][index],
                    ...{ ...randomizationItems[index - 1]?.generation?.looseLoot?.whitelist ? { whitelist: randomizationItems[index - 1].generation.looseLoot.whitelist } : {} }
                },
                "magazines": {
                    "min": [2, 2, 3, 3, 4][index],
                    "max": [3, 3, 4, 4, 5][index],
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
                "mod_barrel": [15, 20, 25, 35, 45][index],
                "mod_bipod": [1, 10, 5, 11, 50][index],
                "mod_flashlight": [35, 50, 70, 90, 95][index],
                "mod_foregrip": [30, 60, 70, 90, 95][index],
                "mod_handguard": [20, 30, 70, 90, 95][index],
                "mod_launcher": [0, 0, 5, 15, 50][index],
                "mod_magazine": [50, 60, 80, 90, 95][index],
                "mod_magazine_000": [0, 0, 25, 35, 50][index],
                "mod_mount": [60, 90, 100, 100, 100][index],
                "mod_mount_000": [40, 45, 65, 90, 95][index],
                "mod_mount_001": [40, 45, 65, 90, 95][index],
                "mod_mount_002": [40, 45, 65, 90, 95][index],
                "mod_mount_003": [40, 45, 65, 90, 95][index],
                "mod_mount_004": [40, 45, 65, 90, 95][index],
                "mod_mount_005": [40, 45, 65, 90, 95][index],
                "mod_mount_006": [40, 45, 65, 90, 95][index],
                "mod_muzzle": [15, 35, 65, 85, 99][index],
                "mod_muzzle_000": [15, 35, 65, 85, 99][index],
                "mod_muzzle_001": [15, 35, 65, 85, 99][index],
                "mod_equipment": [15, 25, 25, 35, 50][index],
                "mod_equipment_000": [15, 25, 25, 35, 50][index],
                "mod_equipment_001": [15, 25, 25, 35, 50][index],
                "mod_equipment_002": [15, 25, 25, 35, 50][index],
                "mod_pistol_grip_akms": [1, 15, 25, 35, 50][index],
                "mod_pistol_grip": [1, 15, 25, 35, 50][index],
                "mod_scope": [90, 95, 100, 100, 100][index],
                "mod_scope_000": [90, 95, 100, 100, 100][index],
                "mod_scope_001": [90, 95, 100, 100, 100][index],
                "mod_scope_002": [90, 95, 100, 100, 100][index],
                "mod_scope_003": [90, 95, 100, 100, 100][index],
                "mod_tactical": [15, 30, 35, 50, 75][index],
                "mod_tactical_2": 0,
                "mod_tactical001": [15, 30, 35, 50, 75][index],
                "mod_tactical002": [15, 30, 35, 50, 75][index],
                "mod_tactical_000": [1, 5, 5, 10, 15][index],
                "mod_tactical_001": [1, 5, 5, 10, 15][index],
                "mod_tactical_002": [15, 30, 35, 50, 75][index],
                "mod_tactical_003": [15, 30, 35, 50, 75][index],
                "mod_charge": [10, 20, 35, 50, 75][index],
                "mod_stock": 99,
                "mod_stock_000": 99,
                // "mod_stock_001": [1, 10, 15, 20][index],
                "mod_stock_akms": 100,
                // "mod_sight_front": 20,
                // "mod_sight_rear": 50,
                // "mod_reciever": 100,
                // "mod_gas_block": [1, 10, 15, 20][index],
                "mod_pistolgrip": [1, 15, 25, 35, 50][index],
                // "mod_trigger": 1,
                // "mod_hammer": 1,
                // "mod_catch": 1
            }
        }

        const medkitsAdd = {
            1: ["590c661e86f7741e566b646a"],
            2: [],
            3: ["590c678286f77426c9660122"],
            4: ["60098ad7c2240c0fe85c570a"],
            5: []
        }

        const medkitsRemove = {
            1: new Set([]),
            2: new Set(["5755356824597772cb798962"]),
            3: new Set(["590c661e86f7741e566b646a"]),
            4: new Set([]),
            5: new Set(["544fb45d4bdc2dee738b4568"]),
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
                    newItem.generation.healing["whitelist"] = [...medkitsAdd[num], ...newItem.generation.healing["whitelist"] || [], id].filter(medKitID => !medkitsRemove[num].has(medKitID))
                    break;
                case checkParentRecursive(parent, items, ["543be6564bdc2df4348b4568"]): //ThrowWeap
                    if (items[id]._props.ThrowType !== "smoke_grenade") {
                        newItem.generation.grenades["whitelist"] = [...newItem.generation.grenades["whitelist"] || [], id]
                    }
                    break;
                case checkParentRecursive(parent, items, config.removePMCLootForLootingBots ? [FoodDrinkParent] : [barterParent, FoodDrinkParent]): //FoodDrink/barter
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
    const traderItems = [...new Set([...a, ...b, ...c, ...d])] //, ...d
    const blacklist = new Set(InternalBlacklist)
    traderItems.forEach(id => {
        if (blacklist.has(id)) return
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

export const buildBlacklist = (items: Record<string, ITemplateItem>, botConfig: IBotConfig, mods: { "1": {}, "2": {}, "3": {}, "4": {}, "5": {} }) => {
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

export const combinedForbiddenBullets = new Set(Object.values(advancedConfig.forbiddenBullets).flat(1))

export const blacklistedItems = new Set([
    ...config.addDangerousBulletsToTier4Bots ? [] : combinedForbiddenBullets,
    ...config.customBlacklist,
    ...InternalBlacklist
])