"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const config_json_1 = __importDefault(require("../config/config.json"));
function BotLevelChanges(container) {
    const { botRelativeDelta } = config_json_1.default;
    const configServer = container.resolve("ConfigServer");
    const botConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
    const botGenerator = container.resolve("BotGenerator");
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
exports.default = BotLevelChanges;
