/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from 'node:events';
// *INFO: internal modules
import * as emitters from './emitter';

type EntityEventEmitter = typeof emitters;

class _AppEventEmitter {
  private _eventEmitter: EventEmitter;
  public entityEventEmitter: EntityEventEmitter;

  constructor() {
    this._eventEmitter = new EventEmitter();
    this.entityEventEmitter = emitters;
  }

  private getDuplicates(arr: string[]): string[] {
    const uniqueSet = new Set();
    const duplicates = new Set();

    arr.forEach((element) => {
      if (uniqueSet.has(element)) {
        duplicates.add(element);
      } else {
        uniqueSet.add(element);
      }
    });

    return Array.from(duplicates) as string[];
  }

  private getDuplicateEntityNames(eventEmitter: EntityEventEmitter): string[] {
    const entityNames: string[][] = Object.keys(eventEmitter).map((key) => {
      const entityEventHandler = (eventEmitter as any)[key];
      const entityName = entityEventHandler.entityName;
      return entityName;
    });
    const allEntityNames: string[] = entityNames.flat();
    const duplicateEventNames = this.getDuplicates(allEntityNames);

    return duplicateEventNames;
  }

  public register(): void {
    const duplicatedEventNames: string[] = this.getDuplicateEntityNames(this.entityEventEmitter);
    if (duplicatedEventNames.length > 0) {
      const duplicatedEventNamesString = duplicatedEventNames.join(', ');

      throw Error(`Event entity "${duplicatedEventNamesString}" is duplicated`);
    }

    Object.keys(this.entityEventEmitter).forEach((entityName) => {
      const currentEntityEventEmitter = (this.entityEventEmitter as any)[entityName];

      currentEntityEventEmitter.registerEvents(this._eventEmitter);
    });
  }

  public emit(eventName: string, target: any): void {
    this._eventEmitter.emit(eventName, target);
  }
}

export const AppEventEmitter = new _AppEventEmitter();
