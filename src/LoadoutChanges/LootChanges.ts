import { IBotType } from "@spt-aki/models/eft/common/tables/IBotType";
import { IHandbookBase } from "@spt-aki/models/eft/common/tables/IHandbookBase";
import { IBotConfig } from "@spt-aki/models/spt/config/IBotConfig";
import BaseClasses from "../Constants/BaseClasses";
import { blacklistedItems, checkParentRecursive, saveToFile } from "./utils";
import { ITemplateItem } from "@spt-aki/models/eft/common/tables/ITemplateItem";
import { IPmcConfig } from "@spt-aki/models/spt/config/IPmcConfig";

export const buildLootChanges = (
  items: Record<string, ITemplateItem>,
  handbook: IHandbookBase,
  prices: Record<string, number>,
  _: IPmcConfig,
  botConfig: IBotConfig,
  types: Record<string, IBotType>
) => {
  const assaultInventory = types.assault.inventory;
  //   const usecInventory = types.usec.inventory;
  //   const bearInventory = types.bear.inventory;
  const handbookMapper = {} as Record<string, number>;

  // Zero out all current items
  for (const key in assaultInventory.items.Backpack) {
    assaultInventory.items.Backpack[key] = 1;
  }
  for (const key in assaultInventory.items.Pockets) {
    assaultInventory.items.Pockets[key] = 1;
  }
  for (const key in assaultInventory.items.TacticalVest) {
    assaultInventory.items.TacticalVest[key] = 1;
  }

  handbook.Items.forEach(({ Id, Price }) => {
    handbookMapper[Id] = Price;
  });

  const getFleaPrice = (itemID: string): number => {
    if (typeof prices[itemID] != "undefined") {
      return prices[itemID];
    } else {
      return handbookMapper[itemID];
    }
  };

  const newToAdd = {
    [BaseClasses.BARTER_ITEM]: 50,
    [BaseClasses.HOUSEHOLD_GOODS]: 50,
    [BaseClasses.FOOD_DRINK]: 50,
    [BaseClasses.ELECTRONICS]: 1,
    [BaseClasses.JEWELRY]: 2,
    [BaseClasses.OTHER]: 1,
    [BaseClasses.TOOL]: 5,
    [BaseClasses.REPAIR_KITS]: 1,
    [BaseClasses.MONEY]: 1,
  };

  const itemsToRemove = new Set([
    BaseClasses.AMMO_BOX,
    BaseClasses.KEY_MECHANICAL,
    BaseClasses.GEAR_MOD,
    BaseClasses.SILENCER,
    BaseClasses.KNIFE,
    BaseClasses.ASSAULT_SCOPE,
    BaseClasses.COLLIMATOR,
    BaseClasses.SPECIAL_SCOPE,
    BaseClasses.OPTIC_SCOPE,
    BaseClasses.FOREGRIP,
    BaseClasses.ARMOR,
    BaseClasses.VEST,
    BaseClasses.TACTICAL_COMBO,
    "62a09d3bcf4a99369e262447", //gingy
    "5783c43d2459774bbe137486", //wallet
    "60b0f6c058e0b0481a09ad11", //walletz
  ]);

  const addList = Object.keys(newToAdd);
  const removeList = [...itemsToRemove];

  //limit keys on scavs
  botConfig.itemSpawnLimits.assault[BaseClasses.KEY_MECHANICAL] = 1;

  const loot = Object.keys(items).filter(
    (id) =>
      !blacklistedItems.has(id) &&
      checkParentRecursive(id, items, addList) &&
      !checkParentRecursive(id, items, [BaseClasses.MONEY, ...removeList]) &&
      !items[id]?._props?.QuestItem &&
      !!getFleaPrice(id)
  );

  const allLoot = loot
    .map((id) => ({
      id,
      value: Math.round(getFleaPrice(id) / 200) || 1,
      name: items[id]._name,
    }))
    .sort(({ value: b }, { value: a }) => b - a);

  const reverseLoot = [...allLoot].reverse().map(({ value }) => value);

  const finalValues: Record<string, number> = {};

  [...allLoot].forEach(({ value, id, name }, index) => {
    finalValues[id] = reverseLoot[index] < 100 ? 1 : reverseLoot[index];
  });

  //   saveToFile(finalValues, "allLoot.json");

  assaultInventory.items.Backpack = finalValues;
  assaultInventory.items.Pockets = finalValues;
  assaultInventory.items.TacticalVest = finalValues;

  //   usecInventory.items.Backpack = finalValues;
  //   usecInventory.items.Pockets = finalValues;
  //   usecInventory.items.TacticalVest = finalValues;

  //   bearInventory.items.Backpack = finalValues;
  //   bearInventory.items.Pockets = finalValues;
  //   bearInventory.items.TacticalVest = finalValues;

  botConfig.walletLoot.chancePercent = 0;
  botConfig.walletLoot.walletTplPool = [];
  //   pmcConfig.maxBackpackLootTotalRub *= 2;
  //   pmcConfig.maxPocketLootTotalRub *= 2;
  //   pmcConfig.maxVestLootTotalRub *= 2;
  //   pmcConfig.backpackLoot.whitelist = pmcConfig.backpackLoot.whitelist.filter(
  //     (id) => !itemsToRemove.has(id)
  //   );

  //   pmcConfig.vestLoot.whitelist = pmcConfig.vestLoot.whitelist.filter(
  //     (id) => !itemsToRemove.has(id)
  //   );

  //   const backpackloot = new Set(pmcConfig.backpackLoot.whitelist);
  //   const vestloot = new Set(pmcConfig.vestLoot.whitelist);

  itemsToRemove.forEach((id) => {
    // if (botConfig.itemSpawnLimits.pmc[id])
    //   delete botConfig.itemSpawnLimits.pmc[id];
    if (botConfig.itemSpawnLimits.assault[id])
      delete botConfig.itemSpawnLimits.assault[id];
    if (assaultInventory.items.Backpack[id])
      delete assaultInventory.items.Backpack[id];
    if (assaultInventory.items.TacticalVest[id])
      delete assaultInventory.items.TacticalVest[id];
    if (assaultInventory.items.Pockets[id])
      delete assaultInventory.items.Pockets[id];
  });

  Object.keys(newToAdd).forEach((id) => {
    // if (!backpackloot.has(id)) pmcConfig.backpackLoot.whitelist.push(id);
    // if (!vestloot.has(id)) pmcConfig.vestLoot.whitelist.push(id);

    // pmcConfig.backpackLoot.blacklist = pmcConfig.backpackLoot.blacklist.filter(
    //   (blackId) => id !== blackId
    // );
    // pmcConfig.vestLoot.blacklist = pmcConfig.backpackLoot.blacklist.filter(
    //   (blackId) => id !== blackId
    // );
    // botConfig.itemSpawnLimits.default[id] = newToAdd[id];
    // botConfig.itemSpawnLimits.pmc[id] = newToAdd[id];
    botConfig.itemSpawnLimits.assault[id] = newToAdd[id];
    botConfig.itemSpawnLimits.assaultgroup[id] = newToAdd[id];
  });

  return finalValues;
};
