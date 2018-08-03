import request from 'superagent/lib/client';
import Utils from './Utils.js'
import Config from '../config';

export default {

  getUsers: () => {
    return new Promise((resolve, reject) => {
      request
        .post(Config.SERVER_URL[Config.BACKEND_INSTALLATION_TYPE])
        .send('query=query{users{id,firstName,lastName,roles}}')
        .then((response) => {
          resolve(JSON.parse(response.text).data.users);
        }).catch((err) => {
          reject(err);
        })
    });
  },

  getUser: (id) => {
    return new Promise((resolve, reject) => {
      request
        .post(Config.SERVER_URL[Config.BACKEND_INSTALLATION_TYPE])
        .send('query=query{user (id:"'+id+'") {id, firstName, lastName, roles}}')
        .then((response) => {
          resolve(JSON.parse(response.text).data.user);
        }).catch((err) => {
          reject(err);
        })
    });
  },

  saveUser: (data) => {
    return new Promise((resolve, reject) => {
      let dataStr = '';
      dataStr += Utils.queryParam('id', data.id, true);
      dataStr += Utils.queryParam('firstName', data.firstName);
      dataStr += Utils.queryParam('lastName', data.lastName);
      dataStr += Utils.queryParamStrArray('roles', data.roles);
      request
        .post(Config.SERVER_URL[Config.BACKEND_INSTALLATION_TYPE])
        .send('query=mutation AddUser { addUser (' + dataStr + '){id,firstName,lastName,roles}}')
        .then((response) => {
          resolve(JSON.parse(response.text));
        }).catch((err) => {
          reject(err);
        })
    });
  },

  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      request
        .post(Config.SERVER_URL[Config.BACKEND_INSTALLATION_TYPE])
        .send('query=mutation DeleteUser { deleteUser (id:"'+id+'") {id}}')
        .then((response) => {
          resolve(id);
        })
        .catch((err) => {
          reject(err);
        })
    })
  }
}
