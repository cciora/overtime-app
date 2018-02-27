import request from 'superagent/lib/client';
import Utils from './Utils.js'

export default {

  getOvertimes: () => {
    return new Promise((resolve, reject) => {
      request
        .get('http://localhost:8080/')
        .query('query=query{overtimes {id, comment, date, startTime, endTime, freeTimeOn}}')
        .then((response) => {
          resolve(JSON.parse(response.text).data.overtimes);
        }).catch((err) => {
          reject(err);
        })
    });
  },

  getOvertime: (id) => {
    return new Promise((resolve, reject) => {
      request
        .get('http://localhost:8080/')
        .query('query=query{overtime (id:"'+id+'") {id, comment, date, startTime, endTime, freeTimeOn}}')
        .then((response) => {
          resolve(JSON.parse(response.text).data.overtime);
        }).catch((err) => {
          reject(err);
        })
    });
  },

  saveOvertime: (data) => {
    return new Promise((resolve, reject) => {
      let dataStr = '';
      dataStr += Utils.queryParam('id', data.id, true);
      dataStr += Utils.queryParam('comment', data.comment);
      dataStr += Utils.queryParam('date', data.date);
      dataStr += Utils.queryParam('startTime', data.startTime);
      dataStr += Utils.queryParam('endTime', data.endTime);
      dataStr += Utils.queryParam('freeTimeOn', data.freeTimeOn);
      request
        .post('http://localhost:8080/')
        .send('query=mutation Add { add (' + dataStr + '){id}}')
        .then((response) => {
          resolve(JSON.parse(response.text));
        }).catch((err) => {
          reject(err);
        })
    });
  },

  deleteOvertime: (id) => {
    return new Promise((resolve, reject) => {
      request
        .post('http://localhost:8080/')
        .send('query=mutation Delete { delete (id:"'+id+'") {id}}')
        .then((response) => {
          resolve(JSON.parse(response.text))
        })
        .catch((err) => {
          reject(err);
        })
    })
  }
}
