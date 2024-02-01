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

  const botsToAdd = [];

  const botsForUpdate = nonPmcBotConfig?.nonPmcBots.filter(
    ({ name, ...rest }) => {
      if (nonPmcBotConfig[name]?.length) {
        nonPmcBotConfig[name].forEach((listName) =>
          botsToAdd.push({ name: listName, ...rest })
        );
        return false;
      }
      return true;
    }
  );

  botsForUpdate.push(...botsToAdd);

  botsForUpdate.forEach((updateInfo) => {
    const { name } = updateInfo;

    if (!tables.bots.types[name]?.inventory?.Ammo) return;
    const inventory = tables.bots.types[name].inventory;

    addItemsToBotInventory(inventory, updateInfo, items);

    normalizeMedianInventoryValues(inventory);

    const storedEquipmentValues =
      buildEmptyWeightAdjustmentsByDevision(updateInfo);

    applyValuesToStoredEquipment(inventory, items, storedEquipmentValues);

    globalValues.storedEquipmentValues[name] = storedEquipmentValues;

    // globalValues.updateInventory(1);
    //   saveToFile(
    //     globalValues.tables.bots.types[updateInfo.name]?.inventory,
    //     `NonPmcBotChanges/botsRef/${updateInfo.name}-inventory1.json`
    //   );
  });

  // saveToFile(
  //   globalValues.storedEquipmentValues,
  //   `NonPmcBotChanges/botsRef/storedEquipmentValues1.json`
  // );
  config.debug &&
    console.log("Algorthimic Progression: nonPmcBots equipment stored!");
}
