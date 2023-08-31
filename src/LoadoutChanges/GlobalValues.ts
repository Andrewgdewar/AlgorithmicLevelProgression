import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import config from "../../config/config.json"
import advancedConfig from "../../config/advancedConfig.json"
import { IBotConfig, WeightingAdjustmentDetails } from "@spt-aki/models/spt/config/IBotConfig";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";

export class globalValues {
    public static Logger: ILogger;
    public static database: IDatabaseTables;
    public static config = config
    public static advancedConfig = advancedConfig
    public static originalWeighting: WeightingAdjustmentDetails[]
    public static botConfig: IBotConfig
    public static configServer: ConfigServer

    public static setValuesForLocation(location: string) {
        // globalValues.config.debug && globalValues.Logger.info(`Algorthimic LevelProgression: Setting up values for map ${location}`)
        const botConfig = this.configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
        const weightings = advancedConfig.locationWeaponWeightings[location]
        if (!weightings) {
            return this.Logger.warning(`Algorthimic LevelProgression: unable to set custom weightings for ${location}, using defaults`)
        }
        //TODO: 
    }
}