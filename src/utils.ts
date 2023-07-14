import { MinMax } from './../types/models/common/MinMax.d';
import { ITemplateItem } from "@spt-aki/models/eft/common/tables/ITemplateItem";
import { RandomisationDetails } from "@spt-aki/models/spt/config/IBotConfig";
import { levelRange } from "../config/config.json"

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
    let armClass = armorClass - 1
    const repair = RepairCost * 0.1
    let durability = (((Durability - 20) * armorZone?.length) * armClass) * 0.15
    if (durability < 0) durability = 0

    const total = Math.round((repair + durability))

    return total || 1
}

export const getAmmoWeighting = ({ _props: { PenetrationPower, Damage, InitialSpeed, ProjectileCount }, _id, _name }: ITemplateItem): number => {
    let pen = ((PenetrationPower - 15) * 10)
    if (pen < 0) pen = 0
    const dam = (ProjectileCount ? (Damage * (ProjectileCount * 0.6)) : Damage) * 0.5
    let speed = (InitialSpeed - 600) * 0.2
    if (speed < 0) speed = 0

    return Math.round(pen + dam + speed) || 1
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

interface Randomization extends RandomisationDetails {
}

export const randomization: RandomisationDetails[] = [{
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
    }
}]

export type oneToFour = "1" | "2" | "3" | "4"

export const getCurrentLevelRange = (currentLevel: number): oneToFour | undefined => {
    for (const key in levelRange) {
        const { min, max } = levelRange[key] as MinMax;
        if (currentLevel >= min && currentLevel <= max) return key as oneToFour
    }
}

export const arrSum = (arr: number[]): number => arr.reduce((a, b) => a + b, 0)