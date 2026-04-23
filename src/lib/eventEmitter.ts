import { EventEmitter } from 'events';

declare global {
  var _eventEmitter: EventEmitter | undefined;
}

const eventEmitter = global._eventEmitter || new EventEmitter();
global._eventEmitter = eventEmitter;

export default eventEmitter;
