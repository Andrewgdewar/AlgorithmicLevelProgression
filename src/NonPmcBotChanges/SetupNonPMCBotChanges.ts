import { DependencyContainer } from "tsyringe";

import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import config from "../../config/config.json";
import advancedConfig from "../../config/advancedConfig.json";
import { IBotConfig } from "../../types/models/spt/config/IBotConfig";

import {
  addItemsToBotInventory,
  applyValuesToStoredEquipment,
  buildEmptyWeightAdjustmentsByDevision,
  normalizeMedianInventoryValues,
} from "./NonPmcUtils";
import { globalValues } from "../LoadoutChanges/GlobalValues";
import { saveToFile } from "../LoadoutChanges/utils";

const bosses = [
  "bossbully",
  "bossgluhar",
  "bossboar",
  "bosskilla",
  "bosskojaniy",
  "bosssanitar",
  "bosstagilla",
  "bossknight",
  "bosszryachiy",
];

const followers = [
  "followerbirdeye",
  "followerbully",
  "followergluharassault",
  "followergluharscout",
  "followergluharsecurity",
  "followerboar",
  "followergluharsnipe",
  "followerkojaniy",
  "followersanitar",
  "followertagilla",
  "followertest",
  "followerzryachiy",
  "followerbigpipe",
  "bossboarsniper",
];

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

  const botsForUpdate = advancedConfig?.botsToUpdate.filter(
    ({ name, ...rest }) => {
      if (name === "allBossFollowers") {
        followers.forEach((followerName) =>
          botsToAdd.push({ name: followerName, ...rest })
        );
        return false;
      }
      if (name === "allBosses") {
        bosses.forEach((followerName) =>
          botsToAdd.push({ name: followerName, ...rest })
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
    // const botConfig2 = globalValues.configServer.getConfig<IBotConfig>(
    //   ConfigTypes.BOT
    // );
    // tables.bots.types[updateInfo.name]?.inventory &&
    //   saveToFile(
    //     tables.bots.types[updateInfo.name]?.inventory,
    //     `NonPmcBotChanges/botsRef/${updateInfo.name}-inventory3.json`
    //   );
  });

  // saveToFile(
  //   globalValues.storedEquipmentValues,
  //   `NonPmcBotChanges/botsRef/storedEquipmentValues1.json`
  // );
  config.debug &&
    console.log("Algorthimic Progression: All bots equipment stored!");
}
