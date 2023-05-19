/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import config from "../config/config.json"


class MoarAmmoConfig implements IPostDBLoadMod {

    public postDBLoad(container: DependencyContainer): void {
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = databaseServer.getTales();

        const adjustableValueList =
            [
                {
                    name: "Damage",
                    callback: (val, configVal) => Math.round(val * configVal)
                },
                {
                    name: "ammoRec",
                    callback: (val, configVal) => Math.round(val * configVal)
                },
                {
                    name: "ammoAccr",
                    callback: (val, configVal) => Math.round(val * configVal)
                },
                {
                    name: "PenetrationPower",
                    callback: (val, configVal) => Math.round(val * configVal)
                },
                {
                    name: "FragmentationChance",
                    callback: (val, configVal) => Math.round((val * configVal) * 100) / 100
                },
                {
                    name: "InitialSpeed",
                    callback: (val, configVal) => Math.round(val * configVal)
                },
                {
                    name: "SpeedRetardation",
                    callback: (val, configVal) => Math.round((val * configVal) * 100000) / 100000
                }
            ]

        Object.keys(tables?.templates?.items || {}).forEach(name => {
            const bulletType = tables?.templates?.items[name]?._props
            if (bulletType?.PenetrationPower) {
                config?.debug && console.log(bulletType.Name)
                adjustableValueList.forEach(({ name, callback }) => {
                    if (!!config[name] && bulletType[name] !== undefined) {
                        bulletType[name] = callback(bulletType[name], config[name])
                    }
                })
            }
        })
    }
}

module.exports = { mod: new MoarAmmoConfig() }