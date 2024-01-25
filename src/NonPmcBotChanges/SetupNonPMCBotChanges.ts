import { DependencyContainer } from "tsyringe";

import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import config from "../../config/config.json";
import { IBotConfig } from "../../types/models/spt/config/IBotConfig";

import {
  BotUpdateInterface,
  addItemsToBotInventory,
  applyValuesToStoredEquipment,
  buildEmptyWeightAdjustmentsByDevision,
  normalizeMedianInventoryValues,
} from "./NonPmcUtils";
import { globalValues } from "../LoadoutChanges/GlobalValues";

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

const bots = [
  // BloodHounds
  "arenafighterevent",
  "arenafighter",
  //rogues
  "exusec",
  //Scavs
  "assault",
  "assaultgroup", // Uses assault inventory
  "cursedassault",
  //Snipers
  "marksman",
  //raiders
  "pmcbot",
];

export default function SetupNonPMCBotChanges(
  container: DependencyContainer
): undefined {
  const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
  const configServer = container.resolve<ConfigServer>("ConfigServer");
  const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
  const tables = databaseServer.getTables();
  const items = tables.templates.items;

  const combinedBotList = new Set([...bosses, ...followers, ...bots]);

  const botsToUpdate: BotUpdateInterface[] = [
    {
      name: "assault",
      division: 3,
      maxLevelRange: 50,
      addEquipment: true,
      equipmentStart: 0,
      equipmentEnd: 0.3,
      addAmmo: true,
      ammoStart: 0,
      ammoEnd: 0.5,
    },
  ];

  botsToUpdate.forEach((updateInfo) => {
    const { name } = updateInfo;

    if (!tables.bots.types[name]?.inventory?.Ammo) return;
    const inventory = tables.bots.types[name].inventory;

    addItemsToBotInventory(inventory, updateInfo, items);

    normalizeMedianInventoryValues(inventory);

    const storedEquipmentValues =
      buildEmptyWeightAdjustmentsByDevision(updateInfo);

    applyValuesToStoredEquipment(inventory, items, storedEquipmentValues);

    globalValues.storedEquipmentValues[name] = storedEquipmentValues;

    globalValues.updateInventory(45);
    // const botConfig2 = globalValues.configServer.getConfig<IBotConfig>(
    //   ConfigTypes.BOT
    // );
    // saveToFile(
    //   botConfig2.equipment[updateInfo.name],
    //   `NonPmcBotChanges/botsRef/${updateInfo.name}-equipment1.json`
    // );
    // tables.bots.types[updateInfo.name]?.inventory &&
    //   saveToFile(
    //     tables.bots.types[updateInfo.name]?.inventory,
    //     `NonPmcBotChanges/botsRef/${updateInfo.name}-inventory3.json`
    //   );
    // saveToFile(
    //   storedEquipmentValues,
    //   `NonPmcBotChanges/botsRef/${updateInfo.name}-storedValues2.json`
    // );
  });

  config.debug && console.log("Algorthimic Progression: Equipment DB updated");
}
