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

  getOvertime: (url) => {
    return new Promise((resolve, reject) => {
      request
        .get(url)
        .end((err, response) => {
          if (err) reject(err);
          resolve(JSON.parse(response.text));
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
