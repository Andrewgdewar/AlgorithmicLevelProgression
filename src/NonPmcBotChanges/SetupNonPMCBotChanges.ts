import { DependencyContainer } from "tsyringe";

import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

import config from "../../config/config.json";
import { IBotConfig } from "../../types/models/spt/config/IBotConfig";
import { saveToFile } from "../LoadoutChanges/utils";

export default function SetupNonPMCBotChanges(
  container: DependencyContainer
): undefined {
  const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
  const configServer = container.resolve<ConfigServer>("ConfigServer");
  const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
  const tables = databaseServer.getTables();

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
    "assaultgroup",
    "cursedassault",
    //Snipers
    "marksman",
    //raiders
    "pmcbot",
  ];

  const combinedBotList = new Set([...bosses, ...followers, ...bots]);

  combinedBotList.forEach((name) => {
    saveToFile(
      botConfig.equipment[name],
      `NonPmcBotChanges/botsRef/${name}-equipment.json`
    );
    tables.bots.types[name]?.inventory &&
      saveToFile(
        tables.bots.types[name]?.inventory,
        `NonPmcBotChanges/botsRef/${name}-inventory.json`
      );
  });

  config.debug && console.log("Algorthimic Progression: Equipment DB updated");
}
