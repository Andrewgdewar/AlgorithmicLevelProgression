"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recoilAmmoChanges_1 = __importDefault(require("./recoilAmmoChanges"));
const ProgressionChanges_1 = __importDefault(require("./ProgressionChanges"));
class MoarAmmoConfig {
    postDBLoad(container) {
        (0, recoilAmmoChanges_1.default)(container);
        (0, ProgressionChanges_1.default)(container);
    }
}
module.exports = { mod: new MoarAmmoConfig() };
