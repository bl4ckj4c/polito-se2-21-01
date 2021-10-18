'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const db = require('./db');


// add a new selecttype
/*exports.selectType = (e, userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO exam(coursecode, date, score, userid) VALUES(?, DATE(?), ?, ?)';
    db.run(sql, [e.value, 0, e.label, 1], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};*/

exports.listSelection = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT serviceType, date FROM Service';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const types = rows.map((type) => ({ serviceType: type.serviceType, date: type.date }));
      resolve(types);
    });
  });
};


// add new client
exports.addClient = (client) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Client(clientId, officeId, serviceId) VALUES(?, ?, ?)';
    db.run(sql, [client.id, 10, client.id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

//TODO ANDREA
//get statistics about all counters per service type
exports.getStatisticsAllCounters = (startDate, endDate, manager) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT counterId, serviceType, COUNT(*) AS numCost\n' +
      'FROM Service \n' +
      'WHERE DATE(date) BETWEEN ? AND ?' +
      '   AND officeId IN (SELECT officeId \n' +
      '                    FROM Manager\n' +
      '                    WHERE managerId = ?)' +
      'GROUP BY counterId, serviceType';
    db.all(sql, [startDate, endDate, 'M1'], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const stats = rows.map((t) => ({ counterId: t.counterId, serviceType: t.serviceType, customerServed: t.numCost }));
      resolve(stats);
    });
  });
};

//TODO ANDREA
//get statistics about all service types
exports.getStatisticsAllServices = (startDate, endDate, manager) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT serviceType, COUNT(*) AS numCost\n' +
      'FROM Service \n' +
      'WHERE DATE(date) BETWEEN ? AND ?' +
      '   AND officeId IN (SELECT officeId \n' +
      '                    FROM Manager\n' +
      '                    WHERE managerId = ?)' +
      'GROUP BY serviceType';
    db.all(sql, [startDate, endDate, 'M1'], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const stats = rows.map((t) => ({ serviceType: t.serviceType, customerServed: t.numCost }));
      resolve(stats);
    });
  });
};





// Get statistics about a specific counter
exports.getStatisticsCounter = (counter, startDate, endDate, manager) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*)\n' +
      'FROM Service \n' +
      'WHERE counterId = ? AND DATE(date) BETWEEN ? AND ?' +
      '   AND officeId IN (SELECT officeId \n' +
      '                    FROM Manager\n' +
      '                    WHERE managerId = ?)';
    db.run(sql, [counter, startDate, endDate, 'M1'], function (err, row) {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
};

// Get statistics about a specific service type
exports.getStatisticsServiceType = (serviceType, startDate, endDate, manager) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*)\n' +
      'FROM Service \n' +
      'WHERE serviceType = ? AND DATE(date) BETWEEN ? AND ?' +
      '   AND officeId IN (SELECT officeId \n' +
      '                    FROM Manager\n' +
      '                    WHERE managerId = ?)';
    db.run(sql, [serviceType, startDate, endDate, 'M1'], function (err, row) {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
};

