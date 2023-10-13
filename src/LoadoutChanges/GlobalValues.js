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
    static setValuesForLocation(location, timeVariant) {
        globalValues.config.debug && globalValues.Logger.info(`Algorthimic LevelProgression: Setting up values for map ${location}`);
        const botConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
        const mapWeightings = advancedConfig_json_1.default.locations[location].weightingAdjustments;
        const sightConfiguration = advancedConfig_json_1.default.locations[location].sightConfiguration;
        const items = this.tables.templates.items;
        if (!mapWeightings /*|| !sightConfiguration*/) {
            return this.Logger.warning(`Algorthimic LevelProgression: did not recognize 'location': ${location}, using defaults`);
        }
        if (!this.originalWeighting) {
            return this.Logger.error(`Algorthimic LevelProgression: 'originalWeighting' was not set correctly`);
        }
        if (!items) {
            return this.Logger.error(`Algorthimic LevelProgression: 'items' was not set correctly`);
        }
        const weaponSightWhitelist = globalValues.originalWeighting.weaponSightWhitelist;
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
        const randomisation = botConfig.equipment.pmc.randomisation;
        globalValues.originalWeighting.randomisation.forEach((_, index) => {
            if (randomisation?.[index]?.mods?.mod_nvg !== undefined) {
                randomisation[index].mods.mod_nvg = (timeVariant === "PAST" ? 100 : 0);
            }
            if (randomisation?.[index]?.mods?.mod_muzzle !== undefined) {
                randomisation[index].mods.mod_muzzle += (timeVariant === "PAST" ? 35 : 0);
                if (randomisation[index].mods.mod_muzzle > 100)
                    randomisation[index].mods.mod_muzzle = 100;
            }
        });
        const firstPrimaryWeaponTypes = mapWeightings.FirstPrimaryWeapon;
        const pmcWeighting = botConfig.equipment.pmc.weightingAdjustmentsByBotLevel;
        // console.log("\nlocation ======>", location)
        this.originalWeighting?.weightingAdjustmentsByBotLevel.forEach((weightTier, index) => {
            const firstPrimary = weightTier.equipment.edit.FirstPrimaryWeapon;
            const firstPrimaryKeys = Object.keys(firstPrimary);
            if (!pmcWeighting[index].equipment.edit.FirstPrimaryWeapon) {
                return this.Logger.warning(`Algorthimic LevelProgression: 'pmcWeighting' was not set correctly`);
            }
            // console.log("tier >>>>>>>>>>>>>>>", index + 1)
            firstPrimaryKeys?.forEach((weaponId) => {
                const parentId = items[weaponId]?._parent;
                const parent = items?.[parentId]?._name;
                if (parent && firstPrimaryWeaponTypes[parent]) {
                    const multiplier = firstPrimaryWeaponTypes[parent];
                    pmcWeighting[index].equipment.edit.FirstPrimaryWeapon[weaponId] = Math.round(multiplier * firstPrimary[weaponId]);
                    // console.log(firstPrimary[weaponId], " to ", pmcWeighting[index].equipment.edit.FirstPrimaryWeapon[weaponId], parent, items[weaponId]._name)
                }
                else {
                    this.Logger.warning(`Algorthimic LevelProgression:  Unable to set map settings for ${items[weaponId]._name} - ${weaponId} `);
                }
            });
        });
    }
}
exports.globalValues = globalValues;
globalValues.config = config_json_1.default;
globalValues.advancedConfig = advancedConfig_json_1.default;
