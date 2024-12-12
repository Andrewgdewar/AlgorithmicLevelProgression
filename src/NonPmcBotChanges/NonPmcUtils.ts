import {
  IEquipment,
  IInventory,
  IMods,
} from "@spt/models/eft/common/tables/IBotType";
import { EquipmentFilters } from "@spt/models/spt/config/IBotConfig";
import {
  armorParent,
  blacklistedItems,
  checkParentRecursive,
  cloneDeep,
  deleteBlacklistedItemsFromInventory,
  getAmmoWeighting,
  getArmorRating,
  getBackPackInternalGridValue,
  getTacticalVestValue,
  getWeaponWeighting,
  headwearParent,
  rigParent,
  saveToFile,
  weaponTypeNameToId,
} from "../LoadoutChanges/utils";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import advancedConfig from "../../config/advancedConfig.json";
import nonPmcBotConfig from "../../config/nonPmcBotConfig.json";
import { MinMax } from "@spt/models/common/MinMax";
import { inventory as cachedInventory } from "../Cache/tablesbotstypesusec.json";
import { weightingAdjustmentsByBotLevel as botWeights } from "../Cache/botConfigequipmentpmc.json";
import tieredItems from "../Constants/tieredItems.json";
import mappedPresets from "../Constants/mappedPresets.json";
import { IPreset } from "@spt/models/eft/common/IGlobals";

const objectToOrderedList = (
  equipment: Record<string, number>,
  items: Record<string, ITemplateItem>
) =>
  Object.keys(equipment)
    .sort((a, b) => equipment[a] - equipment[b])
    .map((id) => ({ id, value: equipment[id], name: items[id]._name }));

const blackList = new Set<string>([
  "5e4abc6786f77406812bd572",
  "628bc7fb408e2b2e9c0801b1",
  "5b3b713c5acfc4330140bd8d",
  "5e997f0b86f7741ac73993e2",
  "5c0126f40db834002a125382",
  "601948682627df266209af05",
  "63495c500c297e20065a08b1",
  "59ef13ca86f77445fd0e2483",
  "670e8eab8c1bb0e5a7075acf", //mag_pm_izhmeh_9x18pm_999_infectedMagazin
  "671d85439ae8365d69117ba6", //mag_tt_toz_std_762x25tt_999_infectedMagazin
  "671d8617a3e45c1f5908278c", //mag_mp443_izhmeh_std_9x19_999_infectedMagazin
  "671d8ac8a3e45c1f59082799", //mag_glock_glock_w_pad_9x19_999_fde_Infected
  "671d8b38b769f0d88c0950f8", //mag_m1911_colt_m45a1_std_1143x23_999_infected
  "671d8b8c0959c721a50ca838", //mag_usp_hk_usp_tactical_1143x23_999_infected
  "628120f210e26c1f344e6558", // mxc broken mag
]);

const makeRare = new Set<string>([
  "6038b4ca92ec1c3103795a0d",
  "6038b4b292ec1c3103795a0b",
  "5fd4c474dd870108a754b241",
  "628b9c7d45122232a872358f",
  "628baf0b967de16aab5a4f36",
  "628b9784bcf6e2659e09b8a2",
  "628baf0b967de16aab5a4f36",
  "5c0e541586f7747fa54205c9",
  "5bffdd7e0db834001b734a1a",
]);

export const buldTieredItemTypes = (items: Record<string, ITemplateItem>) => {
  const result = {};

  botWeights.forEach((weight, index) => {
    for (const key in weight.equipment.edit) {
      Object.keys(weight.equipment.edit[key]).forEach((id) => {
        if (blackList.has(id)) return;
        if (!result[key]) result[key] = {};

        result[key][id] = Math.max(
          result[key][id] || 1,
          weight.equipment.edit[key][id]
        );
      });
    }
  });

  for (const key in result) {
    for (const id in result[key]) {
      if (makeRare.has(id)) {
        result[key][id] = result[key][id] * 3;
      }
    }
  }

  for (const key in result) {
    const equipmentSet = result[key] as Record<string, number>;
    result[key] = objectToOrderedList(equipmentSet, items);
  }

  // AMMO
  const ammo = {};

  for (const caliber in cachedInventory.Ammo) {
    for (const ammoId in cachedInventory.Ammo[caliber]) {
      if (items[ammoId]) {
        ammo[ammoId] = getAmmoWeighting(items[ammoId]);
      }
    }
  }

  result["Ammo"] = objectToOrderedList(ammo, items);

  const map = {};

  for (const key in result) {
    result[key].forEach(({ id, value }) => {
      map[id] = value;
    });
  }

  result["mapper"] = map;

  return result;
};

export interface BotUpdateInterface {
  tiers: Array<number[]>;
  HasModdedWeapons?: boolean;
  AllowSniperRifles?: boolean;
  Ammo: number[];
  TacticalVest?: number[];
  ArmorVest?: number[];
  Backpack?: number[];
  Earpiece?: number[];
  Eyewear?: number[];
  Headwear?: number[];
  FaceCover?: number[];
  // Scabbard?: number[];
  FirstPrimary?: number[];
  Holster?: number[];
  BasePlateChance: number;
  SidePlateChance?: number;
}

const equipmentTypesTochange = new Set([
  "TacticalVest",
  "ArmorVest",
  "Backpack",
  "Earpiece",
  "Eyewear",
  "Headwear",
  "FaceCover",
  // "Scabbard",
  "FirstPrimaryWeapon",
  "Holster",
]);

const getRating = (id: string, dflt = 10) => tieredItems.mapper[id] || dflt;

export const normalizeMedianInventoryValues = (inventory: IInventory) => {
  for (const caliber in inventory.Ammo) {
    let highest = 0;

    Object.values(inventory.Ammo[caliber]).forEach((value) => {
      if (value > highest) highest = value;
    });

    const multiplier = 100 / highest;
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

      const multiplier = 200 / highest;
      Object.keys(inventory.equipment[equipmentType]).forEach((id) => {
        inventory.equipment[equipmentType][id] =
          Math.round(inventory.equipment[equipmentType][id] * multiplier) || 10;
      });
    }
  }
};

export const addItemsToBotInventory = (
  inventory: IInventory,
  botToUpdate: BotUpdateInterface,
  items: Record<string, ITemplateItem>
) => {
  const { Ammo: botToUpdateAmmo, BasePlateChance, ...equipment } = botToUpdate;

  const ammoToAdd = new Set<string>([]);

  Object.keys(tieredItems).forEach((key) => {
    if (equipment[key]) {
      const equipmentStart = equipment[key][0];
      const equipmentEnd = equipment[key][1];

      if (equipmentStart || equipmentEnd) {
        const startIndex = Math.floor(tieredItems[key].length * equipmentStart);
        const endIndex = Math.floor(tieredItems[key].length * equipmentEnd);

        tieredItems[key]
          .slice(startIndex, endIndex)
          .forEach(({ id, value }) => {
            if (
              !botToUpdate.AllowSniperRifles &&
              checkParentRecursive(id, items, [
                weaponTypeNameToId.SniperRifle,
                weaponTypeNameToId.MarksmanRifle,
              ])
            ) {
              // console.log(items[id]._name);
              return;
            }

            if (blacklistedItems.has(id) || blackList.has(id)) return;
            if (!inventory.equipment[key][id]) {
              inventory.equipment[key][id] = value;
            }
            const item = items[id];
            if (inventory.mods[id]) return;
            switch (key) {
              case "Headwear":
              case "ArmorVest":
              case "TacticalVest":
                if (!inventory.mods[id]) {
                  const newModObject = {};
                  item._props.Slots.forEach((mod) => {
                    if (mod._props.filters[0].Plate) {
                      newModObject[mod._name] = newModObject[mod._name] = [
                        mod._props.filters[0].Plate,
                      ];
                    }
                  });
                  inventory.mods[id] = newModObject;
                }
                break;
              case "FirstPrimaryWeapon":
              case "Holster":
                if (!cachedInventory.mods[id] || !mappedPresets[id]) {
                  break;
                }
                inventory.mods[id] = mappedPresets[id];

                if (cachedInventory.mods[id]["patron_in_weapon"]) {
                  mappedPresets[id]["patron_in_weapon"] =
                    cachedInventory.mods[id]["patron_in_weapon"];
                }
                if (cachedInventory.mods[id]["patron_in_weapon_000"]) {
                  mappedPresets[id]["patron_in_weapon_000"] =
                    cachedInventory.mods[id]["patron_in_weapon_000"];
                }

                if (cachedInventory.mods[id]["patron_in_weapon_001"]) {
                  mappedPresets[id]["patron_in_weapon_001"] =
                    cachedInventory.mods[id]["patron_in_weapon_001"];
                }

                const ammo = [
                  ...(cachedInventory.mods[id]["patron_in_weapon"]
                    ? cachedInventory.mods[id]["patron_in_weapon"]
                    : []),
                  ...(cachedInventory.mods[id]["patron_in_weapon_000"]
                    ? cachedInventory.mods[id]["patron_in_weapon_000"]
                    : []),
                  ...(cachedInventory.mods[id]["patron_in_weapon_001"]
                    ? cachedInventory.mods[id]["patron_in_weapon_001"]
                    : []),
                ];
                ammo.forEach((id) => {
                  ammoToAdd.add(id);
                });

                break;
              default:
                break;
            }
          });
      }
    }
  });

  if (botToUpdate?.Ammo?.[1] > 0) {
    const Ammo = tieredItems.Ammo;

    const ammoStart = botToUpdateAmmo[0];
    const ammoEnd = botToUpdateAmmo[1];
    if (ammoStart || ammoEnd) {
      const startIndex = Math.floor(Ammo.length * ammoStart);
      const endIndex = Math.floor(Ammo.length * ammoEnd);

      const toAddAmmo = [...ammoToAdd]
        .map((id) => ({
          id,
          value: tieredItems.mapper[id],
        }))
        .sort((a, b) => a.value - b.value);
      const toAddAmmoStartIndex = Math.floor(toAddAmmo.length * ammoStart);
      const toAddAmmoEndIndex = Math.floor(toAddAmmo.length * ammoEnd);

      [
        ...toAddAmmo.slice(toAddAmmoStartIndex, toAddAmmoEndIndex),
        ...Ammo.slice(startIndex, endIndex),
      ].forEach(({ id, value }) => {
        const calibre =
          items[id]?._props?.Caliber || items[id]?._props?.ammoCaliber;

        if (
          calibre &&
          inventory.Ammo[calibre] &&
          !inventory.Ammo?.[calibre]?.[id]
        ) {
          inventory.Ammo[calibre][id] = value;
        }
      });
    }
  }

  // Add all plates to all equipment for all bots <<PLATE VARIETY>>
  Object.keys(inventory.mods).forEach((id) => {
    if (
      !checkParentRecursive(id, items, [headwearParent]) &&
      checkParentRecursive(id, items, [armorParent, rigParent])
    ) {
      const item = items[id];
      if (item?._props?.Slots?.length > 0) {
        // if (!inventory.mods[id]) {
        const newModObject = {};
        item._props.Slots.forEach((mod) => {
          if (mod._props.filters[0].Plate) {
            newModObject[mod._name] = mod._props.filters[0].Filter;
          }
        });
        if (Object.keys(newModObject).length) inventory.mods[id] = newModObject;
      }
    }
  });

  const itemsToAdd = new Set<string>([]);

  Object.keys(inventory.mods).forEach((id) => {
    Object.values(inventory.mods[id])
      .flat(1)
      .forEach((item) => {
        if (!inventory.mods[item]) itemsToAdd.add(item);
      });
  });

  while (itemsToAdd.size) {
    const [id] = itemsToAdd;
    if (!inventory.mods[id]) {
      if (mappedPresets[id]) {
        inventory.mods[id] = mappedPresets[id];
      } else if (cachedInventory.mods[id]) {
        inventory.mods[id] = cachedInventory.mods[id];
      }
    }
    itemsToAdd.delete(id);
  }

  deleteBlacklistedItemsFromInventory(inventory, blackList);
};

const defaultRandomisation = [
  {
    levelRange: {
      min: 1,
      max: 100,
    },
    equipmentMods: { mod_nvg: 0 },
  },
];

export const setPlateWeightings = (
  name: string,
  equipmentFilters: EquipmentFilters,
  index: number,
  equipment: IInventory,
  items: Record<string, ITemplateItem>
) => {
  equipmentFilters.armorPlateWeighting = [
    {
      levelRange: {
        min: 1,
        max: 100,
      },
      front_plate: {
        "1": 1,
        "2": 3,
        "3": 20,
        "4": 20,
        "5": 4,
        "6": 1,
      },
      back_plate: {
        "1": 1,
        "2": 3,
        "3": 20,
        "4": 20,
        "5": 4,
        "6": 1,
      },
      side_plate: {
        "1": 1,
        "2": 3,
        "3": 20,
        "4": 20,
        "5": 4,
        "6": 1,
      },
      left_side_plate: {
        "1": 1,
        "2": 3,
        "3": 20,
        "4": 20,
        "5": 4,
        "6": 1,
      },
      right_side_plate: {
        "1": 1,
        "2": 3,
        "3": 20,
        "4": 20,
        "5": 4,
        "6": 1,
      },
    },
  ] as any;

  if (!nonPmcBotConfig.nonPmcBots?.[name]?.BasePlateChance) {
    return;
  }
  //=========================================
  // UPDATE PLATE SPAWN CHANCE

  if (!equipmentFilters?.randomisation) {
    equipmentFilters.randomisation = defaultRandomisation;
  }

  const randomizationToUpdate = cloneDeep(equipmentFilters.randomisation[0]);

  if (nonPmcBotConfig.nonPmcBots[name].BasePlateChance < 101) {
    let front = nonPmcBotConfig.nonPmcBots[name].BasePlateChance + index * 15;
    if (front > 100) front = 100;
    randomizationToUpdate.equipmentMods["front_plate"] = front;

    let back =
      nonPmcBotConfig.nonPmcBots[name].BasePlateChance - 20 + index * 15;
    if (back > 100) back = 100;
    randomizationToUpdate.equipmentMods["back_plate"] = back;
  }

  if (nonPmcBotConfig.nonPmcBots?.[name]?.SidePlateChance) {
    ["left_side_plate", "right_side_plate"].forEach((key) => {
      let value = nonPmcBotConfig.nonPmcBots[name].SidePlateChance + index * 10;
      if (value > 100) value = 100;
      if (value < 0) value = 0;
      randomizationToUpdate.equipmentMods[key] = value;
    });
  } else {
    ["left_side_plate", "right_side_plate"].forEach((key) => {
      let value =
        nonPmcBotConfig.nonPmcBots[name].BasePlateChance - 30 + index * 10;
      if (value > 100) value = 100;
      if (value < 0) value = 0;
      randomizationToUpdate.equipmentMods[key] = value;
    });
  }
  // console.log(name, randomizationToUpdate.equipmentMods);
  equipmentFilters.randomisation[0] = randomizationToUpdate;
  //=========================================
};

export const buffScavGearAsLevel = (
  equipmentFilters: EquipmentFilters,
  index: number
) => {
  equipmentFilters.weightingAdjustmentsByPlayerLevel = [
    {
      levelRange: {
        min: 1,
        max: 99,
      },
    },
  ];

  if (!index) return;

  const randomizationToUpdate = cloneDeep(
    advancedConfig.otherBotTypes.assault.randomisation[0]
  );

  [
    "Headwear",
    "Earpiece",
    "ArmorVest",
    "FaceCover",
    // "Scabbard",
    "Eyewear",
    "Backpack",
  ].forEach((key) => {
    randomizationToUpdate.equipment[key] += index * 15;
    if (randomizationToUpdate.equipment[key] > 99)
      randomizationToUpdate.equipment[key] = 99;
  });

  equipmentFilters.randomisation[0] = randomizationToUpdate;
  equipmentFilters.blacklist = advancedConfig.otherBotTypes.assault.blacklist;
  equipmentFilters.whitelist = advancedConfig.otherBotTypes.assault.whitelist;
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
  inventory: IInventory,
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

  Object.keys(inventory.equipment).forEach((key: keyof IEquipment) => {
    if (equipmentTypesTochange.has(key)) {
      equipmentList[key] = [];
      Object.keys(inventory.equipment[key]).forEach((id) => {
        //Zero out equipment
        if (key === "FirstPrimaryWeapon" || key === "Holster") {
          const defAmmoWeight = getAmmoWeighting(
            items[items[id]._props.defAmmo]
          );
          equipmentList[key].push({
            id,
            rating: getRating(id),
            // +  inventory.equipment[key][id],
          });
        } else {
          equipmentList[key].push({
            id,
            rating: getRating(id), //+ inventory.equipment[key][id],
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

    Object.keys(equipmentList).forEach((key: keyof IEquipment) => {
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
