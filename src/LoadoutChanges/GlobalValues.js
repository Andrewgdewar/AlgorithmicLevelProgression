"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalValues = void 0;
const utils_1 = require("./utils");
const config_json_1 = __importDefault(require("../../config/config.json"));
const advancedConfig_json_1 = __importDefault(require("../../config/advancedConfig.json"));
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const OnGameStartUtils_1 = require("./OnGameStartUtils");
class globalValues {
    static setValuesForLocation(location, hours) {
        if (location === "factory4_day")
            hours = 12;
        if (location === "factory4_night")
            hours = 1;
        if (location === "laboratory")
            hours = 12;
        this.config.debug && this.Logger.info(`Algorthimic LevelProgression: Setting up values for map ${location}`);
        const botConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
        const mapWeightings = advancedConfig_json_1.default.locations[location].weightingAdjustments;
        const items = this.tables.templates.items;
        if (!mapWeightings) {
            return this.Logger.warning(`Algorthimic LevelProgression: did not recognize 'location': ${location}, using defaults`);
        }
        if (!this.originalWeighting) {
            return this.Logger.error(`Algorthimic LevelProgression: 'originalWeighting' was not set correctly`);
        }
        if (!items) {
            return this.Logger.error(`Algorthimic LevelProgression: 'items' was not set correctly`);
        }
        const finalEquipment = (0, utils_1.cloneDeep)(this.originalWeighting);
        // TODO: build cleaning function
        // for (const weaponType in sightConfiguration) {
        //     const weaponTypeUUID = weaponTypeNameToId[weaponType]
        //     if (weaponTypeUUID && weaponSightWhitelist[weaponTypeUUID]) {
        //         const sightSet = new Set(sightConfiguration[weaponType].map((name => SightType[name])))
        //         // console.log("🚀 ", botConfig.equipment.pmc.weaponSightWhitelist[weaponTypeUUID].length)
        //         botConfig.equipment.pmc.weaponSightWhitelist[weaponTypeUUID] = weaponSightWhitelist[weaponTypeUUID].filter(id => {
        //             const result = sightSet.has(items[id]?._parent)
        //             // if (result) console.log(items[id]?._name, "== type ==", items[items[id]?._parent]?._name)
        //             return result
        //         })
        //         // console.log("🚀 ", botConfig.equipment.pmc.weaponSightWhitelist[weaponTypeUUID].length)
        //     }
        // }
        const isNight = hours < 7 || hours >= 19;
        config_json_1.default.debug && console.log("isNight", isNight ? "YES" : "NO", hours);
        const randomisation = finalEquipment.randomisation;
        //Adjust for Nighttime
        (0, OnGameStartUtils_1.makeRandomisationAdjustments)(isNight, this.originalWeighting, randomisation, location);
        const originalBotTypesCopy = (0, utils_1.cloneDeep)(this.originalBotTypes);
        (0, OnGameStartUtils_1.cullModItems)(originalBotTypesCopy.usec.inventory.mods, isNight, items, location);
        (0, OnGameStartUtils_1.updateScopes)(originalBotTypesCopy.usec.inventory.mods, isNight, items, location);
        originalBotTypesCopy.bear.inventory.mods = originalBotTypesCopy.usec.inventory.mods;
        const pmcWeighting = finalEquipment.weightingAdjustmentsByBotLevel;
        (0, OnGameStartUtils_1.makeMapSpecificWeaponWeightings)(location, items, this.originalWeighting, pmcWeighting);
        (0, utils_1.saveToFile)(originalBotTypesCopy.usec.inventory.mods, "updated.json");
        // saveToFile(originalBotTypesCopy.bear.inventory.mods, "changedInventory.json")
        // saveToFile(finalEquipment, "finalEquipment.json")
        // saveToFile(this.originalWeighting, "originalWeighting.json")
        botConfig.equipment.pmc = finalEquipment;
        this.tables.bots.types = originalBotTypesCopy;
    }
}
exports.globalValues = globalValues;
globalValues.config = config_json_1.default;
globalValues.advancedConfig = advancedConfig_json_1.default;
