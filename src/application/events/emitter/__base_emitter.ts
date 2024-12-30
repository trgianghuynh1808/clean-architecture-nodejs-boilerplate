/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from 'node:events';
// *INFO: internal modules
import AppEvent from '../app_event';

class BaseEventEmitter {
  entityName: string;
  eventMap: any;
  eventEmitter: EventEmitter;

  constructor(entityName: string, eventMap: any) {
    this.entityName = entityName;
    this.eventMap = eventMap;
  }

  registerEvents(eventEmitter: EventEmitter): void {
    if (this.eventEmitter) {
      return;
    }

    Object.keys(this.eventMap).forEach((eventName: string) => {
      const eventCallBacks = this.eventMap[eventName];

      new AppEvent(`${this.entityName}:${eventName}`, eventCallBacks, eventEmitter).subscribe();
    });

    this.eventEmitter = eventEmitter;
  }
}

export default BaseEventEmitter;
