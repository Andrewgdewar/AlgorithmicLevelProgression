"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BotLevelChanges_1 = __importDefault(require("./LevelChanges/BotLevelChanges"));
const config_json_1 = require("../config/config.json");
const ProgressionChanges_1 = __importDefault(require("./LoadoutChanges/ProgressionChanges"));
const SetupLocationGlobals_1 = require("./LoadoutChanges/SetupLocationGlobals");
const LocationUpdater_1 = require("./LoadoutChanges/LocationUpdater");
class AlgorithmicLevelProgression {
    preAkiLoad(container) {
        config_json_1.enableLevelChanges && (0, BotLevelChanges_1.default)(container);
        config_json_1.enableProgressionChanges && (0, LocationUpdater_1.LocationUpdater)(container);
    }
    postAkiLoad(container) {
        config_json_1.enableProgressionChanges && (0, ProgressionChanges_1.default)(container);
        config_json_1.enableProgressionChanges && (0, SetupLocationGlobals_1.SetupLocationGlobals)(container);
    }
}
module.exports = { mod: new AlgorithmicLevelProgression() };
//# sourceMappingURL=mod.js.map