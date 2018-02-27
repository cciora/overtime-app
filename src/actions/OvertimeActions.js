import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/Constants';
import OvertimesAPI from '../utils/OvertimesAPI';

export default {

  recieveOvertimes: () => {
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

  getOvertime: (id) => {
    if(id == 'new') {
      AppDispatcher.dispatch({
        actionType: Constants.RECIEVE_OVERTIME,
        overtime: {
          // date : getDateString(0),
          startTime: '18:00',
          endTime: '19:00'
          // freeTimeOn: '',
          // comment: 'HZM Deployment 1'
        }
      });
    } else {
      OvertimesAPI
        .getOvertime(id)
        .then(overtime => {
          AppDispatcher.dispatch({
            actionType: Constants.RECIEVE_OVERTIME,
            overtime: overtime
          });
        })
        .catch(message => {
          AppDispatcher.dispatch({
            actionType: Constants.RECIEVE_OVERTIME_ERROR,
            message: message
          });
        });
    }
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
