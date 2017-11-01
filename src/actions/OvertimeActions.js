import AppDispatcher from '../dispatcher/AppDispatcher';
import Constants from '../constants/Constants';
import OvertimesAPI from '../utils/OvertimesAPI';

export default {

  recieveOvertimes: () => {
    OvertimesAPI
      .getOvertimes('http://localhost:3001/api/overtimes')
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
    OvertimesAPI
      .getOvertime('http://localhost:3001/api/overtimes/' + id)
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
  },

  saveOvertime: (data) => {
    OvertimesAPI
      .saveOvertime('http://localhost:3001/api/overtimes/save', data)
      .then(overtime => {
        AppDispatcher.dispatch({
          actionType: Constants.SAVE_OVERTIME,
          overtime: overtime
        });
      })
      .catch(message => {
        AppDispatcher.dispatch({
          actionType: Constants.SAVE_OVERTIME_ERROR,
          message: message
        });
      });
  }
  
}