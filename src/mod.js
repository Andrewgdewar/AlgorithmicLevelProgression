"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProgressionChanges_1 = __importDefault(require("./ProgressionChanges"));
const config_json_1 = require("../config/config.json");
class MoarAmmoConfig {
    postDBLoad(container) {
        config_json_1.enabled && (0, ProgressionChanges_1.default)(container);
    }
    preAkiLoad(container) {
        // BotLevelChanges(container)
    }
}
module.exports = { mod: new MoarAmmoConfig() };
