import { IPreAkiLoadMod } from './../types/models/external/IPreAkiLoadMod.d';
/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import ProgressionChanges from "./ProgressionChanges";
import BotLevelChanges from "./BotLevelChanges";
import { enabled } from "../config/config.json"

class MoarAmmoConfig implements IPreAkiLoadMod, IPostDBLoadMod {
    postDBLoad(container: DependencyContainer): void {
        enabled && ProgressionChanges(container)
    }
    preAkiLoad(container: DependencyContainer): void {
        // BotLevelChanges(container)
    }
}

module.exports = { mod: new MoarAmmoConfig() }