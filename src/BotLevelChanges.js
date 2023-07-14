"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("../config/config.json");
const utils_1 = require("./utils");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
function BotLevelChanges(container) {
    const profileHelper = container.resolve("ProfileHelper");
    const botLevelGenerator = container.resolve("BotLevelGenerator");
    const configServer = container.resolve("ConfigServer");
    const botConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
    botConfig.pmc.botRelativeLevelDeltaMax = 1;
    if (config_json_1.debug) {
        console.log("\nCurrent levelRange config:", config_json_1.levelRange);
        console.log("\nbotRangeAtLevel by percentage:");
        Object.keys(config_json_1.botRangeAtLevel).forEach(lev => {
            const thing = {};
            for (let index = 0; index < 100; index++) {
                const test = config_json_1.botRangeAtLevel[lev].map((val, k) => ({ levelRange: k + 1, val: Math.random() * val }));
                const playerLevel = 20;
                const result = test.sort((a, b) => b.val - a.val)[0];
                const range = { ...config_json_1.levelRange[result.levelRange] };
                if (range.max > 99) {
                    range.max = Math.min(range.max, Math.max(range.min + 10, playerLevel + 10, range.max - range.min));
                }
                const level = Math.round((range.max - range.min) * Math.random()) + range.min;
                const levelName = result.levelRange;
                thing[levelName] = (thing[levelName] || 0) + 1;
            }
            console.log(thing);
        });
    }
    container.afterResolution("BotLevelGenerator", (_t, result) => {
        result.generateBotLevel = (levelDetails, botGenerationDetails, bot) => {
            if (!botGenerationDetails.isPmc)
                return botLevelGenerator.generateBotLevel(levelDetails, botGenerationDetails, bot);
            const { playerLevel } = botGenerationDetails;
            const currentLevelRange = (0, utils_1.getCurrentLevelRange)(playerLevel);
            const currentRangeArray = config_json_1.botRangeAtLevel[currentLevelRange];
            const test = currentRangeArray.map((val, k) => ({ levelRange: k + 1, val: Math.random() * val }));
            const randomizedRange = test.sort((a, b) => b.val - a.val)[0].levelRange;
            const range = { ...config_json_1.levelRange[randomizedRange] };
            if (range.max > 99) {
                range.max = Math.min(range.max, Math.max(range.min + 10, playerLevel + 10, range.max - range.min));
            }
            const level = Math.round((range.max - range.min) * Math.random()) + range.min;
            const final = {
                level,
                exp: profileHelper.getExperience(level)
            };
            config_json_1.debug && console.log(final);
            return final;
        };
    }, { frequency: "Always" });
}
exports.default = BotLevelChanges;
