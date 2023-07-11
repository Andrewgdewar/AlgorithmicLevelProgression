import { IBotController } from './../types/models/spt/controllers/IBotController.d';
import { DependencyContainer } from "tsyringe";
import { BotGenerator } from "@spt-aki/generators/BotGenerator";
import { BotGenerationDetails } from "@spt-aki/models/spt/bots/BotGenerationDetails";
import { IBotBase } from "@spt-aki/models/eft/common/tables/IBotBase";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { IBotConfig } from "@spt-aki/models/spt/config/IBotConfig";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import config from "../config/config.json"

export default function BotLevelChanges(
    container: DependencyContainer
): undefined {
    const { botRelativeDelta } = config as { botRelativeDelta?: number }
    const configServer = container.resolve<ConfigServer>("ConfigServer");
    const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
    const botGenerator = container.resolve<BotGenerator>("BotGenerator");

    // container.afterResolution("BotGenerator", (_t, result: BotGenerator) => {
    //     result.prepareAndGenerateBots = (sessionId: string, botGenerationDetails: BotGenerationDetails): IBotBase[] => {
    //         const value = botGenerator.prepareAndGenerateBots(sessionId, botGenerationDetails)
    //         console.log(value.map(val => ({ level: val?.Info?.Level, items: val?.Inventory?.items })))
    //         return value
    //     }
    // }, { frequency: "Always" });

    // container.afterResolution("BotGenerator", (_t, result: BotGenerator) => {
    //     result.prepareAndGenerateBots = (sessionId: string, botGenerationDetails: BotGenerationDetails): IBotBase[] => {
    //         const value = botGenerator.prepareAndGenerateBots(sessionId, botGenerationDetails)
    //         console.log(value.map(val => ({ level: val?.Info?.Level, items: val?.Inventory?.items })))
    //         return value
    //     }
    // }, { frequency: "Always" });

    // if (botRelativeDelta) {
    //     botConfig.pmc.botRelativeLevelDeltaMax = botRelativeDelta
    // }
}

