/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { EventEmitter } from 'node:events';

class AppEvent {
  private _name: string;
  private _callbacks: Function[];
  private _eventEmitter: EventEmitter;

  constructor(name: string, callbacks: Function[], eventEmitter: EventEmitter) {
    this._name = name;
    this._eventEmitter = eventEmitter;
    this._callbacks = callbacks;
  }

  public subscribe(): void {
    this._eventEmitter.on(this._name, (data: any) => {
      this._callbacks.forEach((callback: Function) => {
        callback(data);
      });
    });
  }
}

export default AppEvent;
