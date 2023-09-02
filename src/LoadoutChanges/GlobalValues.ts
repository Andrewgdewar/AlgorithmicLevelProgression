import { Equipment } from './../../types/models/eft/common/tables/IBotType.d';
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import config from "../../config/config.json"
import advancedConfig from "../../config/advancedConfig.json"
import { IBotConfig, WeightingAdjustmentDetails } from "@spt-aki/models/spt/config/IBotConfig";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";

export class globalValues {
    public static Logger: ILogger;
    public static tables: IDatabaseTables;
    public static config = config
    public static advancedConfig = advancedConfig
    public static originalWeighting: WeightingAdjustmentDetails[]
    public static botConfig: IBotConfig
    public static configServer: ConfigServer

    public static setValuesForLocation(location: keyof typeof advancedConfig.locations) {
        // globalValues.config.debug && globalValues.Logger.info(`Algorthimic LevelProgression: Setting up values for map ${location}`)
        const botConfig = this.configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
        const mapWeightings = advancedConfig.locations[location].weightingAdjustments
        const items = this.tables.templates.items;
        if (!mapWeightings) {
            return this.Logger.warning(`Algorthimic LevelProgression: did not recognize 'location': ${location}, using defaults`)
        }
        if (!this.originalWeighting) {
            return this.Logger.error(`Algorthimic LevelProgression: 'originalWeighting' was not set correctly`)
        }
        if (!items) {
            return this.Logger.error(`Algorthimic LevelProgression: 'items' was not set correctly`)
        }

        const firstPrimaryWeaponTypes = mapWeightings.FirstPrimaryWeapon
        const pmcWeighting = botConfig.equipment.pmc.weightingAdjustments
        // console.log("\nlocation ======>", location)
        this.originalWeighting?.forEach((weightTier, index) => {
            const firstPrimary = weightTier.equipment.edit.FirstPrimaryWeapon
            const firstPrimaryKeys = Object.keys(firstPrimary)
            if (!pmcWeighting[index].equipment.edit.FirstPrimaryWeapon) {
                return this.Logger.warning(`Algorthimic LevelProgression: 'pmcWeighting' was not set correctly`)
            }
            // console.log("tier >>>>>>>>>>>>>>>", index + 1)
            firstPrimaryKeys?.forEach((weaponId) => {
                const parentId = items[weaponId]?._parent
                const parent = items?.[parentId]?._name
                if (parent && firstPrimaryWeaponTypes[parent]) {
                    const multiplier = firstPrimaryWeaponTypes[parent]
                    pmcWeighting[index].equipment.edit.FirstPrimaryWeapon[weaponId] = Math.round(multiplier * firstPrimary[weaponId])
                    // console.log(firstPrimary[weaponId], " to ", pmcWeighting[index].equipment.edit.FirstPrimaryWeapon[weaponId], parent, items[weaponId]._name,)
                } else {
                    this.Logger.warning(`Algorthimic LevelProgression:  Unable to set map settings for ${items[weaponId]._name} - ${weaponId} `)
                }
            })
        })
    }
}