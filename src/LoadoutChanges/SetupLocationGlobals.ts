import { DependencyContainer } from 'tsyringe';
import { globalValues } from './GlobalValues';
import { ConfigServer } from '@spt-aki/servers/ConfigServer';
import { cloneDeep } from './utils';
import { IBotConfig } from '@spt-aki/models/spt/config/IBotConfig';
import { ConfigTypes } from '@spt-aki/models/enums/ConfigTypes';
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer';


export const SetupLocationGlobals = (
    container: DependencyContainer
): undefined => {
    const configServer = container.resolve<ConfigServer>("ConfigServer");
    const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT)
    const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
    const tables = databaseServer.getTables();
    globalValues.Logger = container.resolve("WinstonLogger")
    globalValues.tables = tables
    globalValues.configServer = configServer
    globalValues.originalWeighting = cloneDeep(botConfig.equipment.pmc.weightingAdjustments)
    // globalValues.setValuesForLocation('factory4_day')
}