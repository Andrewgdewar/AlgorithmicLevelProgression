import { cloneDeep, mergeDeep, saveToFile } from "./utils";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import config from "../../config/config.json";
import advancedConfig from "../../config/advancedConfig.json";
import {
  EquipmentFilters,
  IBotConfig,
} from "@spt/models/spt/config/IBotConfig";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IBotType } from "@spt/models/eft/common/tables/IBotType";
import {
  cullModItems,
  makeMapSpecificWeaponWeightings,
  makeRandomisationAdjustments,
  updateScopes,
} from "./OnGameStartUtils";
import { ProfileHelper } from "@spt/helpers/ProfileHelper";
import {
  StoredWeightingAdjustmentDetails,
  buffScavGearAsLevel,
  setPlateWeightings,
} from "../NonPmcBotChanges/NonPmcUtils";

export class globalValues {
  public static Logger: ILogger;
  public static profileHelper: ProfileHelper;
  public static storedEquipmentValues: Record<
    string,
    StoredWeightingAdjustmentDetails[]
  > = {};
  public static tables: IDatabaseTables;
  public static originalBotTypes: Record<string, IBotType>;
  public static config = config;
  public static advancedConfig = advancedConfig;
  public static originalWeighting: EquipmentFilters;
  public static configServer: ConfigServer;

  public static updateInventory(
    currentLevel: number,
    location: keyof typeof advancedConfig.locations
  ) {
    const items = this.tables.templates.items;
    const nameList = Object.keys(this.storedEquipmentValues);
    if (!nameList.length || !currentLevel) return;
    const botConfig = this.configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
    const firstPrimaryWeaponMultiplier =
      advancedConfig.locations[location].weightingAdjustments
        .FirstPrimaryWeapon;

    nameList.forEach((botName) => {
      const copiedInventory = cloneDeep(
        this.originalBotTypes[botName].inventory
      );

      const currentLevelIndex = this.storedEquipmentValues[botName].findIndex(
        ({ levelRange: { min, max } }) =>
          currentLevel <= max && currentLevel >= min
      );

      const weightingToUpdate =
        this.storedEquipmentValues[botName][currentLevelIndex];

      if (!weightingToUpdate) return;
      if (weightingToUpdate?.ammo) {
        for (const caliber in weightingToUpdate.ammo) {
          copiedInventory.Ammo[caliber] = {
            ...copiedInventory.Ammo[caliber],
            ...weightingToUpdate.ammo[caliber],
          };
        }
      }

      if (weightingToUpdate?.equipment) {
        for (const equipmentType in weightingToUpdate.equipment) {
          copiedInventory.equipment[equipmentType] = {
            ...copiedInventory.equipment[equipmentType],
            ...weightingToUpdate.equipment[equipmentType],
          };
          try {
            //update weapon type weightings per map here
            if (
              equipmentType === "FirstPrimaryWeapon" &&
              botName !== "marksman"
            ) {
              // console.log("Updating", botName, " weapons for map", location);
              const firstPrimary: Record<string, number> = cloneDeep(
                copiedInventory.equipment[equipmentType]
              );

              const firstPrimaryKeys = Object.keys(firstPrimary);
              firstPrimaryKeys?.forEach((weaponId) => {
                const parentId = items[weaponId]?._parent;
                const parent = items?.[parentId]?._name;
                if (parent && firstPrimaryWeaponMultiplier[parent]) {
                  const multiplier =
                    (firstPrimaryWeaponMultiplier[parent] - 1) / 2 + 1;

                  copiedInventory.equipment[equipmentType][weaponId] =
                    Math.round(multiplier * firstPrimary[weaponId]);

                  // if (botName === "assault") {
                  //   console.log(
                  //     multiplier,
                  //     location,
                  //     botName,
                  //     firstPrimary[weaponId],
                  //     " to ",
                  //     copiedInventory.equipment[equipmentType][weaponId],
                  //     parent,
                  //     items[weaponId]._name
                  //   );
                  // }
                } else {
                  console.log(
                    `[AlgorithmicLevelProgression]: Unable to set map settings for bot ${botName}'s item ${items[weaponId]._name} - ${weaponId} `
                  );
                }
              });
            }
          } catch (error) {
            `[AlgorithmicLevelProgression]: Failed to update bot ${botName}'s ${equipmentType}`;
          }
        }

        if (botName === "assault") {
          //adjust randomization
          buffScavGearAsLevel(botConfig.equipment[botName], currentLevelIndex);
        }

        setPlateWeightings(
          botName,
          botConfig.equipment[botName],
          currentLevelIndex
        );

        // if (botName === "assault") {
        //   saveToFile(this.tables.bots.types[botName], `refDBS/assault.json`);
        // }
      }

      this.tables.bots.types[botName].inventory = copiedInventory;
    });
  }

  public static setValuesForLocation(
    location: keyof typeof advancedConfig.locations,
    hours: number
  ) {
    if (location === "factory4_day") hours = 12;
    if (location === "factory4_night") hours = 1;
    if (location === "laboratory") hours = 12;

    this.config.debug &&
      this.Logger.info(
        `Algorthimic LevelProgression: Setting up values for map ${location}`
      );
    const botConfig = this.configServer.getConfig<IBotConfig>(ConfigTypes.BOT);

    const mapWeightings =
      advancedConfig.locations?.[location]?.weightingAdjustments;

    const items = this.tables.templates.items;

    if (!mapWeightings) {
      return this.Logger.warning(
        `Algorthimic LevelProgression: did not recognize 'location': ${location}, using defaults`
      );
    }

    if (!this.originalWeighting) {
      return this.Logger.error(
        `Algorthimic LevelProgression: 'originalWeighting' was not set correctly`
      );
    }

    if (!items) {
      return this.Logger.error(
        `Algorthimic LevelProgression: 'items' was not set correctly`
      );
    }

    const finalEquipment: EquipmentFilters = cloneDeep(this.originalWeighting);

    const isNight = hours < 7 || hours >= 19;

    config.debug &&
      console.log(
        "The server thinks it is ",
        isNight ? "NIGHT" : "DAY",
        hours,
        " do appropriate things."
      );

    const randomisation = finalEquipment.randomisation;

    makeRandomisationAdjustments(
      isNight,
      this.originalWeighting,
      randomisation,
      location
    );

    const originalBotTypesCopy: Record<string, IBotType> = cloneDeep(
      this.originalBotTypes
    );

    cullModItems(
      originalBotTypesCopy.usec.inventory.mods,
      isNight,
      items,
      location
    );

    updateScopes(
      originalBotTypesCopy.usec.inventory.mods,
      isNight,
      items,
      location
    );

    originalBotTypesCopy.bear.inventory.mods =
      originalBotTypesCopy.usec.inventory.mods;

    const pmcWeighting = finalEquipment.weightingAdjustmentsByBotLevel;
    makeMapSpecificWeaponWeightings(
      location,
      items,
      this.originalWeighting,
      pmcWeighting
    );

    // saveToFile(originalBotTypesCopy.usec.inventory.mods, "updated.json")
    // saveToFile(originalBotTypesCopy.usec.inventory, "refDBS/usecInventoryRef.json")
    // saveToFile(finalEquipment, "finalEquipment.json");
    // saveToFile(this.originalWeighting, "originalWeighting.json")
    botConfig.equipment.pmc = finalEquipment;
    this.tables.bots.types = originalBotTypesCopy;
  }
}
