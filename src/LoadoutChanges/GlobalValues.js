"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalValues = void 0;
const config_json_1 = __importDefault(require("../../config/config.json"));
const advancedConfig_json_1 = __importDefault(require("../../config/advancedConfig.json"));
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
class globalValues {
    static setValuesForLocation(location) {
        // globalValues.config.debug && globalValues.Logger.info(`Algorthimic LevelProgression: Setting up values for map ${location}`)
        const botConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
        const weightings = advancedConfig_json_1.default.locationWeaponWeightings[location];
        if (!weightings) {
            return this.Logger.warning(`Algorthimic LevelProgression: unable to set custom weightings for ${location}, using defaults`);
        }
    }
}
exports.globalValues = globalValues;
globalValues.config = config_json_1.default;
globalValues.advancedConfig = advancedConfig_json_1.default;
