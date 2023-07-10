/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import RecoilAndAmmoChanges from "./recoilAmmoChanges";
import ProgressionChanges from "./ProgressionChanges";


class MoarAmmoConfig implements IPostDBLoadMod {
    public postDBLoad(container: DependencyContainer): void {
        RecoilAndAmmoChanges(container)
        ProgressionChanges(container)
    }
}

module.exports = { mod: new MoarAmmoConfig() }