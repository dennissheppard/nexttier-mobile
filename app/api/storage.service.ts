import { Injectable } from '@angular/core';
import * as appSettings from "application-settings";

@Injectable()
export class StorageService {

  getItem(key: string): any {
      let stringItem = appSettings.getString(key);
      if (stringItem !== undefined) {
          return stringItem;
      }
      let numberItem = appSettings.getNumber(key);
      if (numberItem !== undefined) {
          return numberItem;
      }
      let booleanItem = appSettings.getBoolean(key);
      if (booleanItem !== undefined) {
          return booleanItem;
      }
  }
  setItem(key: string, value: any): boolean {
      if(typeof value === 'string') {
          appSettings.setString(key, value);
      } else if (typeof value === 'number'){
          appSettings.setNumber(key, value);
      } else if (typeof value === 'boolean') {
          appSettings.setBoolean(key, value);          
      } else {
          return false;
      }
      return true;
  }
  removeItem(key: string) {
      appSettings.remove(key);
  }
  removeAllItems(): void {
      appSettings.clear();
  }

  hasItem(key: string): boolean {
      return appSettings.hasKey(key);
  }

}
