import {
  Equipment,
  IBotType,
  Inventory,
} from "@spt-aki/models/eft/common/tables/IBotType";
import {
  EquipmentFilters,
  IBotConfig,
  RandomisationDetails,
  WeightingAdjustmentDetails,
} from "@spt-aki/models/spt/config/IBotConfig";
import {
  buildEmptyWeightAdjustments,
  cloneDeep,
  getAmmoWeighting,
  getArmorRating,
  getBackPackInternalGridValue,
  getHeadwearRating,
  getTacticalVestValue,
  getWeaponWeighting,
  mergeDeep,
} from "../LoadoutChanges/utils";
import { ITemplateItem } from "@spt-aki/models/eft/common/tables/ITemplateItem";
import advancedConfig from "../../config/advancedConfig.json";
import Armor from "../Constants/Armor";
import Helmets from "../Constants/Helmets";
import Vests from "../Constants/Vests";
import ArmoredRigs from "../Constants/ArmoredRigs";
import Ammo from "../Constants/Ammo";
import { MinMax } from "@spt-aki/models/common/MinMax";

export interface BotUpdateInterface {
  name: string;
  division: number;
  maxLevelRange: number;
  addEquipment?: boolean;
  equipmentStart?: number;
  equipmentEnd?: number;
  addAmmo?: boolean;
  ammoStart?: number;
  ammoEnd?: number;
}

const equipmentToAdd = {
  Headwear: Helmets,
  ArmorVest: Armor,
  TacticalVest: Vests,
};

const equipmentTypesTochange = new Set([
  "Backpack",
  "Headwear",
  "ArmorVest",
  "FirstPrimaryWeapon",
  "TacticalVest",
  "Holster",
]);

const getRatingFuncForEquipmentType = (equipmentType: keyof Equipment) => {
  const equipmentFunctions = {
    Backpack: (item) => getBackPackInternalGridValue(item) * 10,
    Headwear: getHeadwearRating,
    ArmorVest: getArmorRating,
    FirstPrimaryWeapon: getWeaponWeighting,
    Holster: getWeaponWeighting,
    TacticalVest: getTacticalVestValue,
  };
  return equipmentFunctions[equipmentType];
};

export const normalizeMedianInventoryValues = (inventory: Inventory) => {
  for (const caliber in inventory.Ammo) {
    let highest = 0;

    Object.values(inventory.Ammo[caliber]).forEach((value) => {
      if (value > highest) highest = value;
    });

    const multiplier = 50 / highest;
    Object.keys(inventory.Ammo[caliber]).forEach((id) => {
      inventory.Ammo[caliber][id] =
        Math.round(inventory.Ammo[caliber][id] * multiplier) || 10;
    });
  }

  for (const equipmentType in inventory.equipment) {
    if (equipmentTypesTochange.has(equipmentType)) {
      let highest = 0;

      Object.values(inventory.equipment[equipmentType]).forEach(
        (value: number) => {
          if (value > highest) highest = value;
        }
      );

      const multiplier = 50 / highest;
      Object.keys(inventory.equipment[equipmentType]).forEach((id) => {
        inventory.equipment[equipmentType][id] =
          Math.round(inventory.equipment[equipmentType][id] * multiplier) || 10;
      });
    }
  }
};

export const addItemsToBotInventory = (
  inventory: Inventory,
  botToUpdate: BotUpdateInterface,
  items: Record<string, ITemplateItem>
) => {
  const {
    name,
    addEquipment,
    equipmentStart,
    equipmentEnd,
    addAmmo,
    ammoStart,
    ammoEnd,
  } = botToUpdate;

  if (addEquipment) {
    Object.keys(equipmentToAdd).forEach((key) => {
      const startIndex = Math.floor(
        equipmentToAdd[key].length * equipmentStart
      );
      const endIndex = Math.floor(equipmentToAdd[key].length * equipmentEnd);
      equipmentToAdd[key].slice(startIndex, endIndex).forEach((id: string) => {
        if (!inventory.equipment[key][id]) {
          inventory.equipment[key][id] = 1;
        }
      });
      if (key === "TacticalVest") {
        const startIndx = Math.floor(ArmoredRigs.length * equipmentStart);

        const endIndx = Math.floor(ArmoredRigs.length * equipmentEnd);

        ArmoredRigs.slice(startIndx, endIndx).forEach((id: string) => {
          if (!inventory.equipment[key][id]) {
            inventory.equipment[key][id] = 1;
          }
        });
      }
    });
  }

  if (addAmmo) {
    const startIndex = Math.floor(Ammo.length * ammoStart);
    const endIndex = Math.floor(Ammo.length * ammoEnd);
    Ammo.slice(startIndex, endIndex).forEach((id: string) => {
      const calibre =
        items[id]?._props?.Caliber || items[id]?._props?.ammoCaliber;

      if (
        calibre &&
        inventory.Ammo[calibre] &&
        !inventory.Ammo?.[calibre]?.[id]
      ) {
        inventory.Ammo[calibre][id] = 1;
      }
    });
  }
};

export const buffGearAsLevel = (
  equipmentFilters: EquipmentFilters,
  index: number
) => {
  delete equipmentFilters.weightingAdjustmentsByPlayerLevel;
  if (!index) return;

  const randomizationToUpdate = cloneDeep(
    advancedConfig.otherBotTypes.assault.randomisation[0]
  );

  [
    "Headwear",
    "Earpiece",
    "ArmorVest",
    "FaceCover",
    "Scabbard",
    "Eyewear",
    "Backpack",
  ].forEach((key) => {
    randomizationToUpdate.equipment[key] += index * 15;
    if (randomizationToUpdate.equipment[key] > 99)
      randomizationToUpdate.equipment[key] = 99;
  });

  mergeDeep(
    equipmentFilters.blacklist,
    advancedConfig.otherBotTypes.assault.blacklist
  );

  equipmentFilters.randomisation[0] = randomizationToUpdate;
};

// "Headwear": 40,
// "Earpiece": 20,
// "FaceCover": 35,
// "ArmorVest": 50,
// "ArmBand": 5,
// "TacticalVest": 100,
// "Pockets": 25,
// "SecondPrimaryWeapon": 1,
// "Scabbard": 45,
// "FirstPrimaryWeapon": 95,
// "Holster": 1,
// "Eyewear": 30,
// "Backpack": 25

export interface StoredWeightingAdjustmentDetails {
  levelRange: MinMax;
  ammo: Record<string, Record<string, number>>;
  equipment: Record<string, Record<string, number>>;
}

export const buildEmptyWeightAdjustmentsByDevision = (
  botToUpdate: BotUpdateInterface
): StoredWeightingAdjustmentDetails[] => {
  const { division, maxLevelRange } = botToUpdate;
  const unitOfJump = Math.round(maxLevelRange / division);
  const result = [];
  for (let index = 1; index <= division; index++) {
    result.push({
      levelRange: {
        min: index === 1 ? index : unitOfJump * (index - 1) + 1,
        max: index === division ? 100 : unitOfJump * index,
      },
      ammo: {},
      equipment: {},
    });
  }
  return result as StoredWeightingAdjustmentDetails[];
};

export const applyValuesToStoredEquipment = (
  inventory: Inventory,
  items: Record<string, ITemplateItem>,
  storedWeightingAdjustmentDetails: StoredWeightingAdjustmentDetails[]
) => {
  const ammoList = {};
  Object.keys(inventory.Ammo).forEach((key) => {
    ammoList[key] = [];
    Object.keys(inventory.Ammo[key]).forEach((id) => {
      //Zero out ammo
      ammoList[key].push({
        id,
        rating: getAmmoWeighting(items[id]), // + inventory.Ammo[key][id],
      });
    });
  });

  Object.keys(ammoList).forEach((key) => {
    ammoList[key] = ammoList[key].sort((a, b) => a.rating - b.rating);
  });

  const equipmentList = {};

  Object.keys(inventory.equipment).forEach((key: keyof Equipment) => {
    if (equipmentTypesTochange.has(key)) {
      const ratingFunc = getRatingFuncForEquipmentType(key);
      equipmentList[key] = [];
      Object.keys(inventory.equipment[key]).forEach((id) => {
        //Zero out equipment
        if (key === "FirstPrimaryWeapon" || key === "Holster") {
          const defAmmoWeight = getAmmoWeighting(
            items[items[id]._props.defAmmo]
          );
          equipmentList[key].push({
            id,
            rating:
              ratingFunc(items[id], defAmmoWeight) +
              inventory.equipment[key][id],
          });
        } else {
          equipmentList[key].push({
            id,
            rating: ratingFunc(items[id]), //+ inventory.equipment[key][id],
          });
        }
      });
    }
  });

  Object.keys(equipmentList).forEach((key) => {
    equipmentList[key] = equipmentList[key].sort((a, b) => a.rating - b.rating);
  });

  const division = storedWeightingAdjustmentDetails.length;

  for (let index = 0; index < division; index++) {
    const currentLevelRange = storedWeightingAdjustmentDetails[index];
    Object.keys(ammoList).forEach((key) => {
      const listPortion = ammoList[key];
      const quantityPerLevel = Math.round(listPortion.length / division);
      const resultingList = (listPortion as Array<{ id; rating }>).slice(
        0,
        index === division - 1
          ? listPortion.length
          : index * quantityPerLevel + quantityPerLevel
      );

      resultingList.forEach(({ id, rating }) => {
        if (!currentLevelRange.ammo[key]) currentLevelRange.ammo[key] = {};
        currentLevelRange.ammo[key][id] =
          Math.round(rating + rating * (index * 0.4)) + inventory.Ammo[key][id];
      });
    });

    Object.keys(equipmentList).forEach((key: keyof Equipment) => {
      const listPortion = equipmentList[key];
      const quantityPerLevel = Math.round(listPortion.length / division);
      const resultingList = (listPortion as Array<{ id; rating }>).slice(
        0,
        index === division - 1
          ? listPortion.length
          : index * quantityPerLevel + quantityPerLevel
      );
      resultingList.forEach(({ id, rating }) => {
        if (!currentLevelRange.equipment[key])
          currentLevelRange.equipment[key] = {};
        currentLevelRange.equipment[key][id] =
          Math.round(rating + rating * (index * 0.4)) +
          inventory.equipment[key][id];
      });
    });
  }

  storedWeightingAdjustmentDetails.forEach((_, index) => {
    const weight = storedWeightingAdjustmentDetails[index];
    Object.keys(weight.ammo).forEach((caliber) => {
      const caliberList = Object.keys(weight.ammo[caliber]).sort(
        (a, b) => weight.ammo[caliber][b] - weight.ammo[caliber][a]
      );
      caliberList.forEach((id, rank) => {
        if (caliberList.length > 1 && rank > 0) {
          if (rank > 3) {
            weight.ammo[caliber][id] = Math.round(
              weight.ammo[caliber][id] * 0.5
            );
          } else {
            const modifier =
              ((caliberList.length - rank) / caliberList.length + 1) / 2;
            weight.ammo[caliber][id] =
              Math.round(weight.ammo[caliber][id] * modifier) || 1;
          }
        }
      });
    });
  });

  // storedWeightingAdjustmentDetails.forEach((_, index) => {
  //   storedWeightingAdjustmentDetails.forEach((_, internalIndex) => {
  //     if (internalIndex >= index) return;
  //     console.log(index, internalIndex);
  //     const current = storedWeightingAdjustmentDetails[index];
  //     const previous = storedWeightingAdjustmentDetails[internalIndex];
  //   });
  // });
};
