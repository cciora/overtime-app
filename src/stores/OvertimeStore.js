import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/Constants';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';
const SAVE_EVENT = 'save';
const DELETE_EVENT = 'delete';

let _hasLoaded = false;
let _overtimes = [];
let _overtime = {};

function setOvertimes(overtimes) {
    _overtimes = overtimes;
}

function selectOvertime(overtimeId) {
  _overtime = null;
  if (overtimeId == "new") {
    _overtime = {
      startTime: '18:00',
      endTime: '19:00'
    }
  } else {
    for (let i=0; i< _overtimes.length; i++ ) {
      if(_overtimes[i].id == overtimeId) {
        _overtime = _overtimes[i];
        break;
      }
    }
  }
}

function findOvertimeIdx(overtimeId) {
  let idx = -1;
  for (let i=0; i< _overtimes.length; i++ ) {
    if(_overtimes[i].id == overtimeId) {
      idx = i;
      break;
    }
  }
  return idx;
}

function saveOvertime(overtime) {
  let idx = findOvertimeIdx(overtime.id);
  if(idx != -1) {
    _overtimes.splice(idx,1,overtime);
  } else {
    _overtimes.push(overtime);
  }
}

function deleteOvertime(overtimeId) {
  let idx = findOvertimeIdx(overtimeId);
  if(idx != -1) {
    _overtimes.splice(idx, 1);
  }
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

  addSaveListener(callback) {
    this.on(SAVE_EVENT, callback);
  }

  removeSaveListener(callback) {
    this.removeListener(SAVE_EVENT, callback);
  }

  getOvertimes(startDate, endDate) {
    var startDateStr = startDate.format ? startDate.format('YYYY-MM-DD') : startDate;
    var endDateStr = endDate.format ? endDate.format('YYYY-MM-DD') : endDate;
    return _overtimes.filter(overtime => {
      return startDateStr <= overtime.date && endDateStr >= overtime.date;
    }).sort((o1,o2) => {
      return o1.date > o2.date;
    });
  }

  getOvertime() {
    return _overtime;
  }

  hasLoaded() {
    return _hasLoaded;
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
        _hasLoaded = true;
        // We need to call emitChange so the event listener
        // knows that a change has been made
        OvertimeStore.emitChange();
        break

    case Constants.RECIEVE_OVERTIMES_ERROR:
        alert(action.message);
        OvertimeStore.emitChange();
        break

    case Constants.SELECT_OVERTIME:
        selectOvertime(action.overtimeId);
        OvertimeStore.emitChange();
        break

    case Constants.SAVE_OVERTIME:
        saveOvertime(action.result.data.add);
        OvertimeStore.emitSaveEvent();
        break
    case Constants.SAVE_OVERTIME_ERROR:
        alert("Could not save overtime! \n" + action.message);
        break
    case Constants.DELETE_OVERTIME:
        deleteOvertime(action.result);
        OvertimeStore.emitChange();
        break
    case Constants.DELETE_OVERTIME_ERROR:
        alert("Could not delete overtime!");
        break
    default:
  }

});

export default OvertimeStore;
