import { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { DependencyContainer } from 'tsyringe';
import { globalValues } from './GlobalValues';


export const LocationUpdater = (
    container: DependencyContainer
): undefined => {
    const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");

    //Raid start
    staticRouterModService.registerStaticRouter(`AlgorithmicLevelProgressionMapUpdater`, [{
        url: "/client/raid/configuration",
        action: (_url, info, _sessionId, output) => {
            globalValues.setValuesForLocation(info.location.toLowerCase())
            return output
        }
    }], "aki");

    globalValues.config.debug && console.log("Algorthimic LevelProgression: Custom router AlgorithmicLevelProgressionMapUpdater Registered")
}