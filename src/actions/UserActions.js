import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/Constants';
import UsersAPI from '../utils/UsersAPI';

export default {

  loadUsers: () => {
    UsersAPI
      .getUsers()
      .then(users => {
        AppDispatcher.dispatch({
          actionType: Constants.RECIEVE_USERS,
          users: users
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: Constants.RECIEVE_USERS_ERROR,
          message: message
        });
      });
  },

  getCurrentUser: (id) => {
    UsersAPI.getUser(id)
    .then(user => {
      AppDispatcher.dispatch({
        actionType: Constants.GET_CURRENT_USER,
        user: user
      });
    })
    .catch(message => {
      AppDispatcher.dispatch({
        actionType: Constants.GET_CURRENT_USER_ERROR,
        message: message
      });
    });
  },
  
  getUser: (id) => {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_USER,
      userId: id
    });
  },

  saveUser: (data) => {
    UsersAPI
      .saveUser(data)
      .then(result => {
        AppDispatcher.dispatch({
          actionType: Constants.SAVE_USER,
          result: result
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: Constants.SAVE_USER_ERROR,
          message: message
        });
      });
  },

  deleteUser: (id) => {
    UsersAPI.deleteUser(id)
    .then(result => {
      AppDispatcher.dispatch({
        actionType: Constants.DELETE_USER,
        result: result
      });
    })
    .catch(message => {
      AppDispatcher.dispatch({
        actionType: Constants.DELETE_USER_ERROR,
        message: message
      })
    })
  }

}
