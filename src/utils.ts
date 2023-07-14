import { MinMax } from './../types/models/common/MinMax.d';
import { ITemplateItem } from "@spt-aki/models/eft/common/tables/ITemplateItem";
import { EquipmentFilterDetails, IBotConfig, RandomisationDetails, WeightingAdjustmentDetails } from "@spt-aki/models/spt/config/IBotConfig";
import { levelRange } from "../config/config.json"
import { EquipmentSlots } from '@spt-aki/models/enums/EquipmentSlots';
import { Generation, ItemMinMax } from '@spt-aki/models/eft/common/tables/IBotType';

export const deDupeArr = (arr: any[]) => [...new Set(arr)]

export const checkParentRecursive = (parentId: string, items: Record<string, ITemplateItem>, queryIds: string[]): boolean => {
    if (queryIds.includes(items?.[parentId]?._id)) return true
    if (items?.[parentId]?._parent) return false

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
    const repair = RepairCost * 0.01
    let arm = (armorClass - 2) * 10
    if (arm < 1) arm = 1


    const armorZoneCoverage = armorZone?.length || 0

    const durability = Durability * 0.3

    const total = Math.round(repair + durability + armorZoneCoverage + arm)

    return total || 1
}

export const getAmmoWeighting = ({ _props: { PenetrationPower, Damage, InitialSpeed, ProjectileCount }, _id, _name }: ITemplateItem): number => {
    let penBonus = ((PenetrationPower - 15))
    if (penBonus < 0) penBonus = 0
    const damBonus = (ProjectileCount ? (Damage * (ProjectileCount * 0.6)) : Damage) * 0.1
    let speedBonus = InitialSpeed > 600 ? 5 : 0

    return Math.round(penBonus + speedBonus + damBonus) || 1
}

export const getEquipmentType = (id: string) => {
    const equipmentKeys = Object.keys(equipmentIdMapper)
    for (let index = 0; index < equipmentKeys.length; index++) {
        const key = equipmentKeys[index];
        if (equipmentIdMapper[key].includes(id)) {
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
    return Math.round(gunBase + ammo) || 1
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
}

interface Gentype extends MinMax {
    whitelist?: string[]
}
interface Randomization extends RandomisationDetails {
    generation: {
        grenades?: Gentype;
        healing?: Gentype;
        drugs?: Gentype;
        stims?: Gentype;
        looseLoot?: Gentype;
        magazines?: Gentype;
        specialItems?: Gentype;
    }
}

export const randomization: Randomization[] = [{
    "levelRange": {
        "min": 1,
        "max": 100
    },
    "equipment": {
        "Headwear": 40,
        "Earpiece": 35,
        "FaceCover": 5,
        "ArmorVest": 1,
        "ArmBand": 90,
        "TacticalVest": 1,
        "Pockets": 1,
        "SecuredContainer": 1,
        "SecondPrimaryWeapon": 1,
        "Scabbard": 1,
        "FirstPrimaryWeapon": 80,
        "Holster": 5,
        "Eyewear": 5,
        "Backpack": 35,
    },
    "generation": {
        "drugs": {
            "min": 0,
            "max": 1
        },
        "grenades": {
            "min": 0,
            "max": 1,
            "whitelist": [
                "5710c24ad2720bc3458b45a3",
                "58d3db5386f77426186285a0",
                "5448be9a4bdc2dfd2f8b456a"
            ]
        },
        "healing": {
            "min": 0,
            "max": 1
        },
        "looseLoot": {
            "min": 0,
            "max": 5
        },
        "magazines": {
            "min": 1,
            "max": 2
        },
        "stims": {
            "min": 0,
            "max": 0
        }
    },
}]

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
    tradersMasterList: TradersMasterList) => {
    numList.forEach((num, index) => {
        const loyalty = num;
        const whitelist = botConfig.equipment.pmc.whitelist
        const itemList = [...tradersMasterList[loyalty]]

        itemList.forEach(id => {
            const item = items[id]
            const parent = item._parent
            const equipmentType = getEquipmentType(parent)

            switch (true) {
                case items[parent]?._parent === "5422acb9af1c889c16000029": // Ammo Parent
                    const calibre = item._props.Caliber || item._props.ammoCaliber
                    whitelist[index].cartridge[calibre] =
                        [...whitelist[index].cartridge[calibre] ? whitelist[index].cartridge[calibre] : [], id]
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
            whitelist[index + 1].cartridge = { ...whitelist[index].cartridge }
            whitelist[index + 1].equipment = { ...whitelist[index].equipment }
        }
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

const setWeightItem = (weight: WeightingAdjustmentDetails, equipmentType, id, rating: number) => {
    weight.equipment.edit[equipmentType] = {
        ...weight.equipment.edit[equipmentType] || {},
        [id]: rating
    }
}


export const setWeightingAdjustments = (
    items: Record<string, ITemplateItem>,
    botConfig: IBotConfig,
    tradersMasterList: TradersMasterList,
    itemCosts: Record<string, number>) => {
    botConfig.equipment.pmc.weightingAdjustments = buildEmptyWeightAdjustments()
    const weight = botConfig.equipment.pmc.weightingAdjustments

    numList.forEach((num, index) => {
        console.log("\n")
        const loyalty = num;

        const itemList = [...tradersMasterList[loyalty]]

        // First edit ammo
        itemList.forEach(id => {
            const item = items[id]
            const parent = item._parent

            // Ammo Parent
            if (parent === "5485a8684bdc2da71d8b4567") {
                const calibre = item._props.Caliber || item._props.ammoCaliber

                if (!weight[index]?.ammo.edit?.[calibre]) {
                    weight[index].ammo.edit = { ...weight[index].ammo.edit, [calibre]: {} }
                }
                const ammoWeight = getAmmoWeighting(item)

                weight[index].ammo.edit[calibre] =
                    { ...weight[index].ammo.edit[calibre] || {}, [id]: ammoWeight }
            }
        })

        const combinedWhiteLists = {} as EquipmentFilterDetails
        for (const key of botConfig.equipment.pmc.whitelist) {
            mergeDeep(combinedWhiteLists, key)
        }

        const combinedWeightingAdjustmentItem = {} as WeightingAdjustmentDetails
        for (const key of botConfig.equipment.pmc.weightingAdjustments) {
            mergeDeep(combinedWeightingAdjustmentItem, key)
        }
        mergeDeep(combinedWeightingAdjustmentItem, weight[index])

        itemList.forEach(id => {
            const item = items[id]
            const parent = item._parent
            const equipmentType = getEquipmentType(parent)

            if (equipmentType) {
                if (!weight[index]?.equipment?.edit?.[equipmentType]) {
                    weight[index].equipment.edit = { ...weight[index].equipment.edit, [equipmentType]: {} }
                }
            }

            switch (equipmentType) {
                case "FirstPrimaryWeapon":
                    const calibre = item._props.Caliber || item._props.ammoCaliber
                    if (combinedWhiteLists?.cartridge?.[calibre]) {
                        const highestScoringAmmo = getHighestScoringAmmoValue(combinedWeightingAdjustmentItem.ammo.edit[calibre])
                        const weaponRating = getWeaponWeighting(item, highestScoringAmmo)

                        setWeightItem(weight[index], equipmentType, id, weaponRating)
                    }
                    break;
                case "Headwear":
                    const coverageBonus = item?._props?.headSegments?.length || 0
                    const helmetBonus = Math.round(((item?._props?.MaxDurability || 0) * item?._props?.armorClass) / 10)
                    const repairCostBonus = Math.round(item?._props?.RepairCost * 0.005)
                    let rating = coverageBonus + helmetBonus + repairCostBonus
                    if (rating < 5) rating = 5
                    setWeightItem(weight[index], equipmentType, id, rating)
                    break;
                case "Earpiece":
                    const ambientVolumeBonus = item?._props?.AmbientVolume * -1
                    const compressorBonus = Math.round(item?._props?.CompressorVolume * -0.5)

                    setWeightItem(weight[index], equipmentType, id, compressorBonus + ambientVolumeBonus)
                    break;
                case "FaceCover":
                    const faceCoverCost = (itemCosts[id]) * 0.0005
                    const experience = item._props.LootExperience

                    setWeightItem(weight[index], equipmentType, id, Math.round(faceCoverCost) + experience)
                    break;
                case "ArmorVest":

                    const armorRating = getArmorRating(item)
                    setWeightItem(weight[index], equipmentType, id, armorRating)
                    break;
                case "ArmBand":

                    break;
                case "SecuredContainer":

                    break;
                case "Scabbard":

                    break;
                case "Holster":

                    break;
                case "Eyewear":

                    break;
                case "Backpack":

                    break;
                default:
                    break;
            }
        })

        if (!!weight[index + 1]) {
            weight[index + 1].ammo = { ...weight[index].ammo }
            weight[index + 1].equipment = { ...weight[index].equipment }
        }
    })
}
