import { IPreAkiLoadMod } from './../types/models/external/IPreAkiLoadMod.d';
/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { IPostAkiLoadMod } from "@spt-aki/models/external/IPostAkiLoadMod";
import ProgressionChanges from "./ProgressionChanges";
import BotLevelChanges from "./BotLevelChanges";
import { enableProgressionChanges, enableLevelChanges } from "../config/config.json"

class AlgorithmicLevelProgression implements IPreAkiLoadMod, IPostAkiLoadMod {
    postAkiLoad(container: DependencyContainer): void {
        enableProgressionChanges && ProgressionChanges(container)
    }
    preAkiLoad(container: DependencyContainer): void {
        enableLevelChanges && BotLevelChanges(container)
    }
}

module.exports = { mod: new AlgorithmicLevelProgression() }