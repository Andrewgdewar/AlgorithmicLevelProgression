import { DependencyContainer } from "tsyringe";

import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import config from "../../config/config.json";
import nonPmcBotConfig from "../../config/nonPmcBotConfig.json";
import { IBotConfig } from "../../types/models/spt/config/IBotConfig";

import {
  addItemsToBotInventory,
  applyValuesToStoredEquipment,
  buildEmptyWeightAdjustmentsByDevision,
  buldTieredItemTypes,
  normalizeMedianInventoryValues,
} from "./NonPmcUtils";
import { saveToFile } from "../LoadoutChanges/utils";
import { globalValues } from "../LoadoutChanges/GlobalValues";
import { ConfigServer } from "@spt/servers/ConfigServer";

export default function SetupNonPMCBotChanges(
  container: DependencyContainer
): undefined {
  const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
  const tables = databaseServer.getTables();
  const items = tables.templates.items;
  const botsForUpdate = nonPmcBotConfig?.nonPmcBots;
  const configServer = container.resolve<ConfigServer>("ConfigServer");
  // const tieredItemTypes = buldTieredItemTypes(items);
  // saveToFile(tieredItemTypes, "Constants/tieredItems.json");

  const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);

  Object.keys(botsForUpdate).forEach((name) => {
    if (botConfig.equipment?.[name]?.weightingAdjustmentsByPlayerLevel) {
      botConfig.equipment[name].weightingAdjustmentsByPlayerLevel = [];
    }

    if (
      botConfig.equipment[name] &&
      !botConfig.equipment[name]?.forceOnlyArmoredRigWhenNoArmor &&
      nonPmcBotConfig.nonPmcBots[name].forceOnlyArmoredRigWhenNoArmor
    ) {
      botConfig.equipment[name]["forceOnlyArmoredRigWhenNoArmor"] = true;
    }

    if (!tables.bots.types[name]?.inventory?.Ammo) return;
    const inventory = tables.bots.types[name].inventory;
    const chances = tables.bots.types[name].chances;

    if (name !== "assault") {
      Object.keys(nonPmcBotConfig.nonPmcBots[name]).forEach((key) => {
        if (
          chances.equipment[key] !== undefined &&
          chances.equipment[key] < 30 &&
          nonPmcBotConfig.nonPmcBots[name][key][1] > 0
        ) {
          switch (key) {
            case "Scabbard":
              break;
            case "Backpack":
            case "Holster":
            case "Eyewear":
            case "FaceCover":
            case "Earpiece":
              chances.equipment[key] = 30;
              break;

            default:
              if (name.includes("infected")) {
                chances.equipment[key] = 50;
                break;
              }
              chances.equipment[key] = 70;
              break;
          }
        }
      });

      if (chances.equipment.SecondPrimaryWeapon) {
        chances.equipment.SecondPrimaryWeapon = 10;
      } else {
        chances.equipment.SecondPrimaryWeapon = 0;
      }
      // console.log("\n");
    }

    // if (name === "marksman") {
    //   saveToFile(tables.bots.types[name].inventory, `refDBS/marksman.json`);
    // }
    // console.log("\n", name);
    addItemsToBotInventory(inventory, nonPmcBotConfig.nonPmcBots[name], items);

    if (nonPmcBotConfig.nonPmcBots[name].HasModdedWeapons) {
      inventory.mods = tables.bots.types.usec.inventory.mods;
    }

    normalizeMedianInventoryValues(inventory);

    const storedEquipmentValues = buildEmptyWeightAdjustmentsByDevision(
      nonPmcBotConfig.nonPmcBots[name]
    );

    applyValuesToStoredEquipment(inventory, items, storedEquipmentValues);

    // if (name === "assault") {
    //   saveToFile(tables.bots.types[name].inventory, `refDBS/assault1.json`);
    // }

    globalValues.storedEquipmentValues[name] = storedEquipmentValues;
  });
  // console.log(bots);

  // saveToFile(
  //   globalValues.storedEquipmentValues,
  //   `refDBS/storedEquipmentValues.json`
  // );

  // saveToFile(botConfig.equipment.assault, "refDBS/equipmentAssault.json");
  // saveToFile(
  //   globalValues.tables.bots.types["assault"]?.inventory,
  //   `NonPmcBotChanges/botsRef/storedAssault.json`
  // );

  config.debug &&
    console.log("Algorthimic Progression: nonPmcBots equipment stored!");
}
