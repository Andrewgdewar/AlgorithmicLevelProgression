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
import nonPmcBotConfig from "../../config/nonPmcBotConfig.json";
import Armor from "../Constants/Armor";
import Helmets from "../Constants/Helmets";
import Vests from "../Constants/Vests";
import ArmoredRigs from "../Constants/ArmoredRigs";
import Ammo from "../Constants/Ammo";
import { MinMax } from "@spt-aki/models/common/MinMax";
import Backpacks from "../Constants/Backpacks";

export interface BotUpdateInterface {
  name: string;
  tiers: Array<number[]>;
  Headwear: number[];
  ArmorVest: number[];
  TacticalVest: number[];
  Backpack: number[];
  Ammo: number[];
}

const equipmentToAdd = {
  Headwear: Helmets,
  ArmorVest: Armor,
  TacticalVest: Vests,
  Backpack: Backpacks,
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
  const { name, Ammo: botToUpdateAmmo, ...equipment } = botToUpdate;

  Object.keys(equipmentToAdd).forEach((key) => {
    const equipmentStart = equipment[key][0];
    const equipmentEnd = equipment[key][1];
    if (equipmentStart || equipmentEnd) {
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
    }
  });

  const ammoStart = botToUpdateAmmo[0];
  const ammoEnd = botToUpdateAmmo[1];
  if (ammoStart || ammoEnd) {
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
    randomizationToUpdate.equipment[key] += index;
    if (randomizationToUpdate.equipment[key] > 99)
      randomizationToUpdate.equipment[key] = 99;
  });

  mergeDeep(
    equipmentFilters.blacklist,
    advancedConfig.otherBotTypes.assault.blacklist
  );

  equipmentFilters.randomisation[0] = randomizationToUpdate;
};

export interface StoredWeightingAdjustmentDetails {
  levelRange: MinMax;
  ammo: Record<string, Record<string, number>>;
  equipment: Record<string, Record<string, number>>;
}

export const buildEmptyWeightAdjustmentsByDevision = (
  botToUpdate: BotUpdateInterface
): StoredWeightingAdjustmentDetails[] => {
  const { tiers } = botToUpdate;
  const result = [];

  tiers.forEach((tier) => {
    result.push({
      levelRange: {
        min: tier[0],
        max: tier[1],
      },
      ammo: {},
      equipment: {},
    });
  });

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
            rating: ratingFunc(items[id], defAmmoWeight),
            // +  inventory.equipment[key][id],
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
            const modifier = (caliberList.length - rank) / caliberList.length;
            weight.ammo[caliber][id] =
              Math.round(weight.ammo[caliber][id] * modifier) || 1;
          }
        }
      });
    });

    // Apply randomness
    for (const category in weight.ammo) {
      const randomnessMultiplier = nonPmcBotConfig.botAmmoRandomness;
      if (!randomnessMultiplier) return;
      const list = weight.ammo[category];
      const keys = Object.keys(list);
      const sortedValues = Object.values(list).sort((a, b) => a - b);
      const middleIndex = 0 + Math.round((sortedValues.length - 1) / 2);
      const medianValue = sortedValues[middleIndex];
      const highestValue = sortedValues[sortedValues.length - 1];
      const lowestValue = sortedValues[0];
      const betterValue = Math.round(
        (medianValue + highestValue + lowestValue) / 3
      );
      if (betterValue > 1) {
        keys.forEach((key) => {
          const valToAdjust = list[key];
          if (valToAdjust > 5) {
            const adjustedAmountMax = betterValue - valToAdjust;
            const amountAfterAdjustment = Math.round(
              valToAdjust + adjustedAmountMax * randomnessMultiplier
            );
            if (weight.ammo[category][key]) {
              weight.ammo[category][key] = Math.abs(amountAfterAdjustment);
            }
          }
        });
      }
    }

    // Fix weapon weightings
    Object.keys(weight.equipment?.FirstPrimaryWeapon || []).forEach((id) => {
      const calibre =
        items[id]?._props?.Caliber || items[id]?._props?.ammoCaliber;
      if (calibre && weight.ammo[calibre]) {
        let highestRating = 0;
        Object.keys(weight.ammo[calibre]).forEach((key) => {
          if (weight.ammo[calibre][key] > highestRating) {
            highestRating = weight.ammo[calibre][key];
          }
        });
        if (highestRating) {
          weight.equipment.FirstPrimaryWeapon[id] = getWeaponWeighting(
            items[id],
            highestRating
          );
        }
      }
    });

    for (const category in weight.equipment) {
      const randomnessMultiplier = nonPmcBotConfig.botEquipmentRandomness;
      if (!randomnessMultiplier) return;
      const list = weight.equipment[category];
      const keys = Object.keys(list);
      const sortedValues = Object.values(list).sort((a, b) => a - b);
      const middleIndex = 0 + Math.round((sortedValues.length - 1) / 2);
      const medianValue = sortedValues[middleIndex];
      const highestValue = sortedValues[sortedValues.length - 1];
      const lowestValue = sortedValues[0];
      const betterValue = Math.round(
        (medianValue + highestValue + lowestValue) / 3
      );
      if (betterValue > 1) {
        keys.forEach((key) => {
          const valToAdjust = list[key];
          if (valToAdjust > 5) {
            const adjustedAmountMax = betterValue - valToAdjust;
            const amountAfterAdjustment = Math.round(
              valToAdjust + adjustedAmountMax * randomnessMultiplier
            );
            if (weight.equipment[category][key]) {
              weight.equipment[category][key] = Math.abs(amountAfterAdjustment);
            }
          }
        });
      }
    }
  });
};
