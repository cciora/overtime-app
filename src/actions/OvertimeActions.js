import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/Constants';
import OvertimesAPI from '../utils/OvertimesAPI';

export default {

  loadOvertimes: () => {
    OvertimesAPI
      .getOvertimes()
      .then(overtimes => {
        AppDispatcher.dispatch({
          actionType: Constants.RECIEVE_OVERTIMES,
          overtimes: overtimes
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: Constants.RECIEVE_OVERTIMES_ERROR,
          message: message
        });
      });
  },

  getOvertimeAfterLoad: (id) => {
    OvertimesAPI
      .getOvertimes()
      .then(overtimes => {
        AppDispatcher.dispatch({
          actionType: Constants.RECIEVE_OVERTIMES_AND_SELECT,
          overtimes: overtimes,
          overtimeId: id
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: Constants.RECIEVE_OVERTIMES_ERROR,
          message: message
        });
      });
  },

  getOvertime: (id) => {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_OVERTIME,
      overtimeId: id
    });
  },

  saveOvertime: (data) => {
    OvertimesAPI
      .saveOvertime(data)
      .then(result => {
        AppDispatcher.dispatch({
          actionType: Constants.SAVE_OVERTIME,
          result: result
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: Constants.SAVE_OVERTIME_ERROR,
          message: message
        });
      });
  },

  deleteOvertime: (id) => {
    OvertimesAPI.deleteOvertime(id)
    .then(result => {
      AppDispatcher.dispatch({
        actionType: Constants.DELETE_OVERTIME,
        result: result
      });
    })
    .catch(message => {
      AppDispatcher.dispatch({
        actionType: Constants.DELETE_OVERTIME_ERROR,
        message: message
      })
    })
  }

}
