import { DependencyContainer } from 'tsyringe';
import { globalValues } from './GlobalValues';
import { ConfigServer } from '@spt-aki/servers/ConfigServer';
import { cloneDeep } from './utils';
import { IBotConfig } from '@spt-aki/models/spt/config/IBotConfig';
import { ConfigTypes } from '@spt-aki/models/enums/ConfigTypes';


export const SetupLocationGlobals = (
    container: DependencyContainer
): undefined => {
    const configServer = container.resolve<ConfigServer>("ConfigServer");
    const botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT)
    globalValues.Logger = container.resolve("WinstonLogger")
    globalValues.configServer = configServer
    globalValues.originalWeighting = cloneDeep(botConfig.equipment.pmc.weightingAdjustments)
    globalValues.setValuesForLocation('factory4_day')
}