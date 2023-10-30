import { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
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
            const time = weatherGenerator.calculateGameTime({ acceleration: 0, time: "", date: "" }).time

            const hours = getTime(time, info.timeVariant === "PAST" ? 12 : 0);

            globalValues.setValuesForLocation(info.location.toLowerCase(), hours)
            return output
        }
    }], "aki");

    globalValues.config.debug && console.log("Algorthimic LevelProgression: Custom router AlgorithmicLevelProgressionMapUpdater Registered")
}


function getTime(time: string, hourDiff): number {
    let [h, m] = time.split(':');
    // console.log("minutes", m)
    if (parseInt(h) == 0) {
        return Number(h)
    }
    return Number(Math.abs(parseInt(h) - hourDiff))
}