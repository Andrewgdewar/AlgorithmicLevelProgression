"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationUpdater = void 0;
const GlobalValues_1 = require("./GlobalValues");
const LocationUpdater = (container) => {
    const staticRouterModService = container.resolve("StaticRouterModService");
    //Raid start
    staticRouterModService.registerStaticRouter(`AlgorithmicLevelProgressionMapUpdater`, [{
            url: "/client/raid/configuration",
            action: (_url, info, _sessionId, output) => {
                GlobalValues_1.globalValues.setValuesForLocation(info.location.toLowerCase());
                return output;
            }
        }], "aki");
    GlobalValues_1.globalValues.config.debug && console.log("Algorthimic LevelProgression: Custom router AlgorithmicLevelProgressionMapUpdater Registered");
};
exports.LocationUpdater = LocationUpdater;
