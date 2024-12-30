export interface IEventPayload<T = any> {
  target: T;
  actor: string;
}
