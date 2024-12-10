import { StaticRouterModService } from "@spt/services/mod/staticRouter/StaticRouterModService";
import { DependencyContainer } from "tsyringe";
import { globalValues } from "./GlobalValues";
import { WeatherController } from "@spt/controllers/WeatherController";
import { saveToFile } from "./utils";
import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IBotConfig } from "@spt/models/spt/config/IBotConfig";
import { enableNonPMCBotChanges } from "../../config/config.json";

export const LocationUpdater = (container: DependencyContainer): undefined => {
  const staticRouterModService = container.resolve<StaticRouterModService>(
    "StaticRouterModService"
  );

  const weatherController =
    container.resolve<WeatherController>("WeatherController");

  staticRouterModService.registerStaticRouter(
    `AlgorithmicLevelProgressionMapUpdater`,
    [
      {
        url: "/client/match/local/start",
        action: async (_url, info, sessionId, output) => {
          const time = weatherController.generate().time;
          // const timestamp =
          //   weatherController.generate().weather.sptInRaidTimestamp;
          // console.log(
          //   timestamp,
          //   timestamp / 360000,
          //   timestamp / 3600,
          //   timestamp / 6000,
          //   timestamp / 24,
          //   timestamp / 24 / 60
          // );

          const hours = getTime(time, info.timeVariant === "PAST" ? 12 : 0);
          // console.log("hours", hours);
          globalValues.setValuesForLocation(info.location.toLowerCase(), hours);
          if (enableNonPMCBotChanges) {
            const pmcData = globalValues.profileHelper.getPmcProfile(sessionId);
            globalValues.updateInventory(
              pmcData?.Info?.Level || 1,
              info.location.toLowerCase()
            );
          }
          console.log("Algorthimic LevelProgression: Loaded");
          return output;
        },
      },
    ],
    "aki"
  );

  globalValues.config.debug &&
    console.log(
      "Algorthimic LevelProgression: Custom router AlgorithmicLevelProgressionMapUpdater Registered"
    );
};

function getTime(time: string, hourDiff: number): number {
  let [hours, minutes] = time.split(":");

  if (hourDiff == 12 && parseInt(hours) >= 12) {
    return Math.abs(parseInt(hours) - hourDiff);
  }
  return Math.abs(parseInt(hours) + hourDiff);
}
