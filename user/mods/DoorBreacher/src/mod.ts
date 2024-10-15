/* eslint-disable @typescript-eslint/no-var-requires */
import type { DependencyContainer } from "tsyringe";
import type { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import type { CustomItemService } from "@spt/services/mod/CustomItemService";
import type { ITemplateItem, Props } from "@spt/models/eft/common/tables/ITemplateItem";
import type { LocaleDetails, NewItemDetails} from "@spt/models/spt/mod/NewItemDetails";
import type { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import type { IPostSptLoadMod } from "@spt/models/external/IPostSptLoadMod";
import type { ILogger } from "@spt/models/spt/utils/ILogger";
import type { DatabaseServer } from "@spt/servers/DatabaseServer";
import type { HashUtil } from "@spt/utils/HashUtil";
import { Money } from "@spt/models/enums/Money";
import { TraderHelper } from "./traderHelpers";
import { FluentAssortConstructor } from "./fluentTraderAssortCreator";
import type { ItemsJson} from './items.type';
import type { VFS } from "@spt/utils/VFS";

import { jsonc } from "jsonc";
import path from "node:path";

let logger: ILogger;

interface Filter {
  Filter: string[];
}

interface Chamber {
  _name: string;
  _props: {
      filters: Filter[];
  };
}

interface WeaponProperty {
  name: string;
  index: number;
}

class Mod implements IPreSptLoadMod, IPostDBLoadMod, IPostSptLoadMod {
  //declare private variable db of DatabaseServer type
  private db: DatabaseServer;
  private traderHelper: TraderHelper;
  private fluentTraderAssortHelper: FluentAssortConstructor;
  private traderID: string;
  private itemsJson: ItemsJson;

  public preSptLoad(container: DependencyContainer): void
  {
      logger = container.resolve<ILogger>("WinstonLogger");
  }

  public postDBLoad(container: DependencyContainer): void {
    // Resolve containers
    const CustomItem =
      container.resolve<CustomItemService>("CustomItemService");
    const hashUtil: HashUtil = container.resolve<HashUtil>("HashUtil");
    
    this.db = container.resolve<DatabaseServer>("DatabaseServer");
    this.traderHelper = new TraderHelper();
    this.fluentTraderAssortHelper = new FluentAssortConstructor(
      hashUtil,
      logger
    );

    // Get VFS to read in configs
    const vfs = container.resolve<VFS>("VFS");
    const itemsJsonPath = path.resolve(__dirname, '../database/templates/items.jsonc');

    // Read the items.json file with type ItemsJson
    this.itemsJson = jsonc.parse(vfs.readFile(itemsJsonPath)) as ItemsJson;

    //set trader id we want to add assort items to
    this.traderID = "5a7c2eca46aef81a7ca2145d"; //existing trader Mechanic

    setupItems(this.itemsJson, CustomItem);
    handleAssorts(
      CustomItem,
      this.db,
      this.fluentTraderAssortHelper,
      this.traderID,
      this.itemsJson
    );
  }

  //Check if our item is in the server or not
  public postSptLoad(container: DependencyContainer): void {

    ModifyAmmoPropForWeapons(this.db, this.itemsJson);
    logger.info("DoorBreacher: Finished Modifying Ammo Properties for Weapons");
  }
}

module.exports = { mod: new Mod() };

function setupItems(itemsjson: ItemsJson, CustomItem: CustomItemService) {
  //make locale for DoorBreacher
  const DoorBreacherLocale: Record<string, LocaleDetails> = {
    en: {
      name: "12/70 Door-Breaching Round",
      shortName: "Breach",
      description:
        "The door-breaching round is designed to destroy deadbolts, locks, and hinges without risking lives by ricocheting or penetrating through doors. These frangible rounds are made of a dense sintered material which can destroy a lock or hinge and then immediately disperse.",
    },
  };

  //add new custom item
  const DoorBreacher: NewItemDetails = {
    newItem: itemsjson.doorbreacher,
    fleaPriceRoubles: 8000,
    handbookPriceRoubles: 10000,
    handbookParentId: "5b47574386f77428ca22b33b",
    locales: DoorBreacherLocale,
  };

  //make locale for DoorBreacherBox
  const DoorBreacherBoxLocale: Record<string, LocaleDetails> = {
    en: {
      name: "12/70 Door-Breaching 5-Round Box",
      shortName: "Breach",
      description:
        "A 5-round box of 12ga door breaching shells. The door-breaching round is designed to destroy deadbolts, locks, and hinges without risking lives by ricocheting or penetrating through doors.  These frangible rounds are made of a dense sintered material which can destroy a lock or hinge and then immediately disperse.",
    },
  };

  //add new custom item
  const DoorBreacherBox: NewItemDetails = {
    newItem: itemsjson.doorbreacherbox,
    fleaPriceRoubles: 40000,
    handbookPriceRoubles: 50000,
    handbookParentId: "5b47574386f77428ca22b33c",
    locales: DoorBreacherBoxLocale,
  };

   //make locale for DoorBreacher
   const C4ExplosiveLocale: Record<string, LocaleDetails> = {
    en: {
      name: "C4 Explosive",
      shortName: "C4",
      description:
        "This C4 Explosive is used for breaching reinforced doors. It is a powerful explosive that is used in the military and law enforcement. It is a plastic explosive that is stable and safe to handle and triggered after a set timer.",
    },
  };

  //add new custom item
  const C4Explosive: NewItemDetails = {
    newItem: itemsjson.C4Explosive,
    fleaPriceRoubles: 45000,
    handbookPriceRoubles: 40000,
    handbookParentId: "5b47574386f77428ca22b2f2",
    locales: C4ExplosiveLocale,
  };


  //create the items
  CustomItem.createItem(DoorBreacher);
  CustomItem.createItem(DoorBreacherBox);
  CustomItem.createItem(C4Explosive);
}

function ModifyAmmoPropForWeapons(db, itemsJson) {
  const weaponProperties = [
      { name: "Chambers", index: 0 },
      { name: "Cartridges", index: 1 },
      { name: "camora_000", index: 2 },
      { name: "camora_001", index: 3 },
      { name: "camora_002", index: 4 },
      { name: "camora_003", index: 5 },
      { name: "camora_004", index: 6 }
  ];

  const is12GaugeAmmo = (filters) => {
      return filters ? filters.some(filter => filter.Filter?.includes("560d5e524bdc2d25448b4571")) : false;
  };

  const addDoorBreacher = (item, filters, weaponPropName) => {
      console.info(`DoorBreacher added to: ${item._name} in weaponPropName: ${weaponPropName}`);
      filters[0].Filter.push(itemsJson.doorbreacher._id.toString());
  };

  const processWeaponProperty = (item, weaponPropName) => {
      const property = item._props[weaponPropName];
      if (!property) {
          return;
      }

      if (Array.isArray(property)) {
          // For properties like "Chambers"
          for (const subProperty of property) {
              if (subProperty._props.filters && is12GaugeAmmo(subProperty._props.filters)) {
                  addDoorBreacher(item, subProperty._props.filters, weaponPropName);
              }
          }
      } else {
          // For properties directly under _props like "Cartridges"
          if (property.filters && is12GaugeAmmo(property.filters)) {
              addDoorBreacher(item, property.filters, weaponPropName);
          }
      }
  };

  const processSlots = (slots) => {
      if (!slots || slots.length === 0) {
          return;
      }

      for (const slot of slots) {
          if (slot._props.filters && is12GaugeAmmo(slot._props.filters)) {
              addDoorBreacher(slot, slot._props.filters, slot._name);
          }
      }
  };

  // Iterate over all items
  for (const item of Object.values(db.getTables().templates.items)) {
      for (const prop of weaponProperties) {
          if (item._props[prop.name]) {
              processWeaponProperty(item, prop.name);
          }
      }

      // Process slots for "camora"
      if (item._props.Slots) {
          processSlots(item._props.Slots);
      }
  }
}



function handleAssorts(
  CustomItem: CustomItemService,
  db: DatabaseServer,
  assortHelper: FluentAssortConstructor,
  traderID: string,
  itemsjson: ItemsJson
) {
  const targetTrader = db.getTables().traders[traderID];

  //create assort for doorbreacher. no money, add barter only later
  assortHelper
    .createSingleAssortItem(itemsjson.doorbreacher._id)
    .addStackCount(100)
    .addUnlimitedStackCount()
    .addLoyaltyLevel(1)
    .addMoneyCost(Money.ROUBLES, 10000)
    .export(targetTrader);

  //create assort for doorbreacherbox - no assort since no other trader sells a packl
  // assortHelper
  //   .createSingleAssortItem(itemsjson.doorbreacherbox._id)
  //   .addStackCount(100)
  //   .addUnlimitedStackCount()
  //   .addLoyaltyLevel(1)
  //   .addMoneyCost(Money.ROUBLES, 50000)
  //   .export(targetTrader);

  //create barter item for doorbreacher
  const electricWire = "5c06779c86f77426e00dd782";
  assortHelper
    .createSingleAssortItem(itemsjson.doorbreacher._id)
    .addStackCount(100)
    .addUnlimitedStackCount()
    .addBarterCost(electricWire, 1)
    .addLoyaltyLevel(1)
    .export(targetTrader);

}
