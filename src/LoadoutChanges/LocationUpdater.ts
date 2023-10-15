import { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import { WeatherController } from "@spt-aki/controllers/WeatherController"
import { DependencyContainer } from 'tsyringe';
import { globalValues } from './GlobalValues';
import { WeatherGenerator } from "@spt-aki/generators/WeatherGenerator";


export const LocationUpdater = (
    container: DependencyContainer
): undefined => {
    const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");
    const weatherGenerator = container.resolve<WeatherGenerator>("WeatherGenerator");

    staticRouterModService.registerStaticRouter(`AlgorithmicLevelProgressionMapUpdater`, [{
        url: "/client/raid/configuration",
        action: (_url, info, _sessionId, output) => {

            const date = weatherGenerator.getInRaidTime(new Date())
            const hours = info.timeVariant === "PAST" ? date.getHours() - 12 : date.getHours()
            globalValues.setValuesForLocation(info.location.toLowerCase(), hours)
            return output
        }
    }], "aki");

    globalValues.config.debug && console.log("Algorthimic LevelProgression: Custom router AlgorithmicLevelProgressionMapUpdater Registered")
}