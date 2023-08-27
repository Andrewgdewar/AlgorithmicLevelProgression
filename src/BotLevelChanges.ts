import { IBotBase } from './../types/models/eft/common/tables/IBotBase.d';
import { BotGenerationDetails } from './../types/models/spt/bots/BotGenerationDetails.d';
import { IRandomisedBotLevelResult } from './../types/models/eft/bot/IRandomisedBotLevelResult.d';
import { MinMax } from './../types/models/common/MinMax.d';
import { DependencyContainer } from "tsyringe";
import { botRangeAtLevel, levelRange, debug } from "../config/config.json"
import { getCurrentLevelRange } from './utils';
import { IBotConfig } from '@spt-aki/models/spt/config/IBotConfig';
import { ConfigTypes } from '@spt-aki/models/enums/ConfigTypes';
import { ConfigServer } from '@spt-aki/servers/ConfigServer';
import { BotLevelGenerator } from '@spt-aki/generators/BotLevelGenerator';
import { ProfileHelper } from '@spt-aki/helpers/ProfileHelper';
import config from "../config/config.json"

export default function BotLevelChanges(
    container: DependencyContainer
): undefined {
    const profileHelper = container.resolve<ProfileHelper>("ProfileHelper");
    const botLevelGenerator = container.resolve<BotLevelGenerator>("BotLevelGenerator");
    const configServer = container.resolve<ConfigServer>("ConfigServer");
    const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);

    botConfig.pmc.botRelativeLevelDeltaMax = 1

    // if (debug) {
    //     console.log("\nCurrent levelRange config:", levelRange)
    //     console.log("\nbotRangeAtLevel by percentage:")
    //     Object.keys(botRangeAtLevel).forEach(lev => {
    //         const thing = {}
    //         for (let index = 0; index < 100; index++) {

    //             const test = botRangeAtLevel[lev].map((val, k) => ({ levelRange: k + 1, val: Math.random() * val }))
    //             const playerLevel = 20
    //             const result = test.sort((a, b) => b.val - a.val)[0]
    //             const range = { ...levelRange[result.levelRange] } as MinMax
    //             if (range.max > 99) {
    //                 range.max = Math.min(range.max, Math.max(range.min + 10, playerLevel + 10, range.max - range.min))
    //             }

    //             // const level = Math.round((range.max - range.min) * Math.random()) + range.min
    //             const levelName = result.levelRange
    //             thing[levelName] = (thing[levelName] || 0) + 1
    //         }
    //         console.log(thing)
    //     })
    // }


    container.afterResolution("BotLevelGenerator", (_t, result: BotLevelGenerator) => {
        result.generateBotLevel = (
            levelDetails: MinMax,
            botGenerationDetails: BotGenerationDetails,
            bot: IBotBase): IRandomisedBotLevelResult => {
            if (!botGenerationDetails.isPmc) return botLevelGenerator.generateBotLevel(levelDetails, botGenerationDetails, bot)

            const { playerLevel } = botGenerationDetails

            const currentLevelRange = getCurrentLevelRange(playerLevel)
            const currentRangeArray = botRangeAtLevel[currentLevelRange]
            const test = currentRangeArray.map((val, k) => ({ levelRange: k + 1, val: Math.random() * val }))

            const randomizedRange = test.sort((a, b) => b.val - a.val)[0].levelRange
            const range = { ...levelRange[randomizedRange] } as MinMax
            if (range.max > 99) {
                range.max = Math.min(range.max, Math.max(range.min + 10, playerLevel + 10, range.max - range.min))
            }

            const level = Math.round((range.max - range.min) * Math.random()) + range.min

            const final = {
                level,
                exp: profileHelper.getExperience(level)
            }

            // debug && console.log(final)

            return final
        }
    }, { frequency: "Always" });

    config.debug && console.log("Algorthimic Progression: BotLevelGenerator registered")
}

