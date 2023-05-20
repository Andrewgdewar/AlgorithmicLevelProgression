/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import config from "../config/config.json"


class MoarAmmoConfig implements IPostDBLoadMod {

    public postDBLoad(container: DependencyContainer): void {
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = databaseServer.getTables();

        const adjustableValueList =
            [
                {
                    name: "Damage",
                    callback: (val, configVal) => Math.round(val * configVal)
                },
                {
                    name: "ammoRec",
                    callback: (val, configVal) => val > 0 ? Math.round(val * configVal) : Math.round(val / configVal)
                },
                {
                    name: "ammoAccr",
                    callback: (val, configVal) => val > 0 ? Math.round(val * configVal) : Math.round(val / configVal)
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
                    callback: (val, configVal) => Math.round((val * configVal) * 1000000) / 1000000
                }
            ]

        Object.keys(tables?.templates?.items || {}).forEach(name => {
            const bulletType = tables?.templates?.items[name]?._props
            if (bulletType?.PenetrationPower && bulletType.Name !== "Shrapnel") {
                if (config?.debug) console.log(tables?.templates?.items[name]._name?.replace("patron_", "").replace("_", " - "))
                adjustableValueList.forEach(({ name, callback }) => {
                    if (!!config[name] && bulletType[name] !== undefined) {
                        const oldValue = bulletType[name]
                        bulletType[name] = callback(bulletType[name], config[name])
                        const newValue = bulletType[name]
                        if (config?.debug) console.log(`${name}: ${oldValue} > ${newValue}`)
                    }
                })
                if (config?.debug) console.log("\n")
            }
        })
    }
}

module.exports = { mod: new MoarAmmoConfig() }