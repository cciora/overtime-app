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
          reject(err);
        })
    });
  },

  getOvertime: (id) => {
    return new Promise((resolve, reject) => {
      request
        .get('http://localhost:8080/')
        .query('query=query{overtime (id:'+id+') {id, comment, date, startTime, endTime, freeTimeOn}}')
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
      if (data.id) {
        dataStr = 'id: "'+data.id+ '", ';
      }
      dataStr += 'comment: "'+data.comment+'", date: "'+data.date+'", startTime: "'+data.startTime+'", endTime: "'+data.endTime+'", freeTimeOn: "'+data.freeTimeOn+'"';
      request
        .post('http://localhost:8080/')
        .send('query=mutation Mutation { add (' + dataStr + '){id}}')
        .then((response) => {
          resolve(JSON.parse(response.text));
        }).catch((err) => {
          reject(err);
        })
    });
  }
}
