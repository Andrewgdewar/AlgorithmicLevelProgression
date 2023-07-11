"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recoilAmmoChanges_1 = __importDefault(require("./recoilAmmoChanges"));
const ProgressionChanges_1 = __importDefault(require("./ProgressionChanges"));
const config_json_1 = require("../config/config.json");
class MoarAmmoConfig {
    postDBLoad(container) {
        config_json_1.enableRecoilAndAmmoChanges && (0, recoilAmmoChanges_1.default)(container);
        config_json_1.enableProgressionChanges && (0, ProgressionChanges_1.default)(container);
    }
    preAkiLoad(container) {
        // BotLevelChanges(container)
    }
}
module.exports = { mod: new MoarAmmoConfig() };
