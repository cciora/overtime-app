import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/Constants';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';
const SAVE_EVENT = 'save';
const DELETE_EVENT = 'delete';

let _hasLoaded = false;
let _users = [];
let _user = {};

function setUsers(users) {
    _users = users;
}

function selectUser(userId) {
    _user = null;
    for (let i=0; i< _users.length; i++ ) {
        if(_users[i].id === userId) {
        _users = _users[i];
        break;
        }
    }
}

function findUserIdx(userId) {
  let idx = -1;
  for (let i=0; i< _users.length; i++ ) {
    if(_users[i].id === userId) {
      idx = i;
      break;
    }
  }
  return idx;
}

function saveUser(user) {
  let idx = findUserIdx(user.id);
  if(idx != -1) {
    _users.splice(idx,1,user);
  } else {
    _users.push(user);
  }
}

function deleteUser(userId) {
  let idx = findUserIdx(userId);
  if(idx != -1) {
    _users.splice(idx, 1);
  }
}

class UserStoreClass extends EventEmitter {

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

  getUsers() {
    return _users;
  }

  getUser() {
    return _user;
  }

  hasLoaded() {
    return _hasLoaded;
  }

}

const UserStore = new UserStoreClass();

// Here we register a callback for the dispatcher
// and look for our various action types so we can
// respond appropriately
UserStore.dispatchToken = AppDispatcher.register(action => {

  switch(action.actionType) {
    case Constants.RECIEVE_USERS:
        setUsers(action.users);
        _hasLoaded = true;
        // We need to call emitChange so the event listener
        // knows that a change has been made
        UserStore.emitChange();
        break

    case Constants.RECIEVE_USERS_AND_SELECT:
        setUsers(action.users);
        selectUser(action.userId);
        _hasLoaded = true;
        UserStore.emitChange();
        break

    case Constants.RECIEVE_USERS_ERROR:
        alert(action.message);
        UserStore.emitChange();
        break

    case Constants.SELECT_USER:
        selectUser(action.userId);
        UserStore.emitChange();
        break

    case Constants.SAVE_USER:
        saveUser(action.result.data.addUser);
        UserStore.emitSaveEvent();
        break
    case Constants.SAVE_USER_ERROR:
        alert("Could not save user! \n" + action.message);
        break
    case Constants.DELETE_USER:
        deleteUser(action.result);
        UserStore.emitChange();
        break
    case Constants.DELETE_USER_ERROR:
        alert("Could not delete user!");
        break
    default:
  }

});

export default UserStore;