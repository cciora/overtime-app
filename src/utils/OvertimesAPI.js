import request from 'superagent/lib/client';

export default {

  getOvertimes: () => {
    return new Promise((resolve, reject) => {
      request
        .get('http://localhost:8080/')
        .query('query=query{overtimes {id, comment, date, startTime, endTime, freeTimeOn}}')
        .then((response) => {
          resolve(JSON.parse(response.text).data.overtimes);
        }).catch((err) => {
          reject(err)
        })
    });
  },

  getOvertime: (id) => {
    return new Promise((resolve, reject) => {
      request
        .get('http://localhost:8080/')
        .query('query=query{overtime (id:'+id+') {id, comment, date, startTime, endTime, freeTimeOn}}')
        .end((err, response) => {
          if (err) reject(err);
          resolve(JSON.parse(response.text).data.overtime);
        })
    });
  },

  saveOvertime: (url, data) => {
    return new Promise((resolve, reject) => {
      request
        .post(url)
        .send(data)
        .end((err, response) => {
          if (err || !response.ok) reject(err);
          resolve(JSON.parse(response.text));
        })
    });
  }
}
