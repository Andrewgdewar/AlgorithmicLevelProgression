import { IPreAkiLoadMod } from './../types/models/external/IPreAkiLoadMod.d';
/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { IPostAkiLoadMod } from "@spt-aki/models/external/IPostAkiLoadMod";
import BotLevelChanges from "./LevelChanges/BotLevelChanges";
import { enableProgressionChanges, enableLevelChanges } from "../config/config.json"
import ProgressionChanges from './LoadoutChanges/ProgressionChanges';
import { SetupLocationGlobals } from './LoadoutChanges/SetupLocationGlobals';
import { LocationUpdater } from './LoadoutChanges/LocationUpdater';

class AlgorithmicLevelProgression implements IPreAkiLoadMod, IPostAkiLoadMod {

    preAkiLoad(container: DependencyContainer): void {
        enableLevelChanges && BotLevelChanges(container)
        enableProgressionChanges && LocationUpdater(container)
    }

    postAkiLoad(container: DependencyContainer): void {
        enableProgressionChanges && ProgressionChanges(container)
        enableProgressionChanges && SetupLocationGlobals(container)
    }
}

module.exports = { mod: new AlgorithmicLevelProgression() }