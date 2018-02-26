import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/Constants';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';
const SAVE_EVENT = 'save';
const DELETE_EVENT = 'delete';

let _overtimes = [];
let _overtime = {};

function setOvertimes(overtimes) {
    _overtimes = overtimes;
}

function setOvertime(overtime) {
  _overtime = overtime;
}

class OvertimeStoreClass extends EventEmitter {

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }

  emitSaveEvent(payload) {
    this.emit(SAVE_EVENT, payload);
  }

  addSaveChangeListener(callback) {
    this.on(SAVE_EVENT, callback);
  }

  removeSaveChangeListener(callback) {
    this.removeListener(SAVE_EVENT, callback);
  }

  emitDeleteEvent(payload) {
    this.emit(DELETE_EVENT, payload);
  }

  addDeleteChangeListener(callback) {
    this.on(DELETE_EVENT, callback);
  }

  removeDeleteChangeListener(callback) {
    this.removeListener(DELETE_EVENT, callback);
  }

  getOvertimes() {
    return _overtimes;
  }

  getOvertime() {
    return _overtime;
  }

}

const OvertimeStore = new OvertimeStoreClass();

// Here we register a callback for the dispatcher
// and look for our various action types so we can
// respond appropriately
OvertimeStore.dispatchToken = AppDispatcher.register(action => {

  switch(action.actionType) {
    case Constants.RECIEVE_OVERTIMES:
        setOvertimes(action.overtimes);
        // We need to call emitChange so the event listener
        // knows that a change has been made
        OvertimeStore.emitChange();
        break

    case Constants.RECIEVE_OVERTIME:
        setOvertime(action.overtime);
        OvertimeStore.emitChange();
        break

    case Constants.RECIEVE_OVERTIME_ERROR:
        alert(action.message);
        OvertimeStore.emitChange();
        break

    case Constants.RECIEVE_OVERTIMES_ERROR:
        alert(action.message);
        OvertimeStore.emitChange();
        break

    case Constants.SAVE_OVERTIME:
        if(action.result.isValid) {
          setOvertime(action.result.overtime);
          OvertimeStore.emitChange();
        }
        OvertimeStore.emitSaveEvent(action.result);
        break
    case Constants.DELETE_OVERTIME:
        OvertimeStore.emitDeleteEvent(action.result);
        break

    default:
  }

});

export default OvertimeStore;