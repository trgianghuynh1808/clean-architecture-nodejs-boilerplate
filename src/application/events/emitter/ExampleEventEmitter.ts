import { ERecordStatus } from '@storkyle/shared/enum';

// *INFO: internal modules
import { IEventPayload, IExampleEventPayload } from '../../interfaces';
import { exampleHandler } from '../handler/example.event_handler';
import BaseEventEmitter from './__base_emitter';

// *INFO: event name
const EVENT_CREATED = 'created';
const EVENT_UPDATED = 'edited';
const EVENT_STATUS_CHANGED = 'status-changed';
const EVENT_REMOVED = 'removed';

// *INFO: entity name
const ENTITY_NAME = 'example';

// *INFO: event map
const EVENT_MAP = {
  [EVENT_CREATED]: [exampleHandler],
  [EVENT_UPDATED]: [exampleHandler],
  [EVENT_STATUS_CHANGED]: [],
  [EVENT_REMOVED]: [],
};

class _ExampleEventEmitter extends BaseEventEmitter {
  constructor() {
    super(ENTITY_NAME, EVENT_MAP);
  }

  emitEventSignUp(eventPayload: IEventPayload<IExampleEventPayload>): void {
    this.eventEmitter.emit(`${ENTITY_NAME}:${EVENT_CREATED}`, eventPayload);
  }

  emitEventCreated(eventPayload: IEventPayload<IExampleEventPayload>): void {
    this.eventEmitter.emit(`${ENTITY_NAME}:${EVENT_CREATED}`, eventPayload);
  }

  emitEventEdited(eventPayload: IEventPayload<IExampleEventPayload>): void {
    this.eventEmitter.emit(`${ENTITY_NAME}:${EVENT_UPDATED}`, eventPayload);
  }

  emitEventStatusChanged<T = ERecordStatus>(
    payload: IEventPayload<{ id: string; status: T }>
  ): void {
    this.eventEmitter.emit(`${ENTITY_NAME}:${EVENT_STATUS_CHANGED}`, payload);
  }

  emitEventRemove(payload: IEventPayload<{ id: string }>): void {
    this.eventEmitter.emit(`${ENTITY_NAME}:${EVENT_REMOVED}`, payload);
  }
}

export const ExampleEventEmitter = new _ExampleEventEmitter();
