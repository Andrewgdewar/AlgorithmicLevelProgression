/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import config from "../config/config.json"


class MoarAmmoConfig implements IPostDBLoadMod {

    public postDBLoad(container: DependencyContainer): void {
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = databaseServer.getTables();


        if (config?.weaponRecoilModifier !== 1) {
            tables.templates.items
            for (const item in tables.templates.items) {
                if (tables.templates.items[item]._props.ItemSound == "mod") {
                    tables.templates.items[item]._props.Recoil =
                        Math.round((tables.templates.items[item]._props.Recoil / config?.weaponRecoilModifier) * 100) / 100;
                }
                if (tables.templates.items[item]._props.ItemSound == "mag_plastic") {
                    tables.templates.items[item]._props.Recoil =
                        Math.round((tables.templates.items[item]._props.Recoil / config?.weaponRecoilModifier) * 100) / 100
                }
            }
        }


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
                    callback: (val, configVal) => val < 0 ? Math.round(val * configVal) : Math.round(val / configVal)
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
                    if (!!config.BulletChanges[name] && bulletType[name] !== undefined) {
                        const oldValue = bulletType[name]
                        bulletType[name] = callback(bulletType[name], config.BulletChanges[name])
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