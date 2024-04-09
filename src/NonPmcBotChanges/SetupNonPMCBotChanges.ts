import { DependencyContainer } from "tsyringe";

import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import config from "../../config/config.json";
import nonPmcBotConfig from "../../config/nonPmcBotConfig.json";
import { IBotConfig } from "../../types/models/spt/config/IBotConfig";

import {
  addItemsToBotInventory,
  applyValuesToStoredEquipment,
  buildEmptyWeightAdjustmentsByDevision,
  normalizeMedianInventoryValues,
} from "./NonPmcUtils";
import { globalValues } from "../LoadoutChanges/GlobalValues";
import { saveToFile } from "../LoadoutChanges/utils";

// const bots = [
//   // BloodHounds
//   "arenafighterevent",
//   "arenafighter",
//   //rogues
//   "exusec", //
//   //Scavs
//   "assault", //
//   "assaultgroup", // Uses assault inventory
//   "cursedassault",
//   //Snipers
//   "marksman", //
//   //raiders
//   "pmcbot", //
// ];

export default function SetupNonPMCBotChanges(
  container: DependencyContainer
): undefined {
  const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
  const tables = databaseServer.getTables();
  const items = tables.templates.items;
  const botsForUpdate = nonPmcBotConfig?.nonPmcBots;

  Object.keys(nonPmcBotConfig?.nonPmcBots).forEach((name) => {
    if (nonPmcBotConfig[name]?.length) {
      nonPmcBotConfig[name].forEach((listName) => {
        botsForUpdate[listName] = nonPmcBotConfig.nonPmcBots[name];
      });
    }
  });

  const botConfig = globalValues.configServer.getConfig<IBotConfig>(
    ConfigTypes.BOT
  );

  Object.keys(botsForUpdate).forEach((name) => {
    if (botConfig.equipment.assault.weightingAdjustmentsByPlayerLevel) {
      botConfig.equipment.assault.weightingAdjustmentsByPlayerLevel = [];
    }

    if (!tables.bots.types[name]?.inventory?.Ammo) return;
    const inventory = tables.bots.types[name].inventory;

    addItemsToBotInventory(inventory, nonPmcBotConfig.nonPmcBots[name], items);

    normalizeMedianInventoryValues(inventory);

    const storedEquipmentValues = buildEmptyWeightAdjustmentsByDevision(
      nonPmcBotConfig.nonPmcBots[name]
    );

    applyValuesToStoredEquipment(inventory, items, storedEquipmentValues);

    globalValues.storedEquipmentValues[name] = storedEquipmentValues;
  });
  // globalValues.updateInventory(25);
  // saveToFile(
  //   globalValues.tables.bots.types["assault"]?.inventory,
  //   `NonPmcBotChanges/botsRef/${"assault"}-inventory.json`
  // );

  // saveToFile(botConfig.equipment.marksman, "refDBS/weightings.json");
  // saveToFile(
  //   globalValues.storedEquipmentValues,
  //   `NonPmcBotChanges/botsRef/storedEquipmentValues1.json`
  // );

  config.debug &&
    console.log("Algorthimic Progression: nonPmcBots equipment stored!");
}
