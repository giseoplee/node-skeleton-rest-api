const mysql = require('mysql');
const config = require('../config');
const util = require('util');

const DBService = function(){};

DBService.Init = () => {

    this._pool = mysql.createPool({
        host: config.store.mysqlHost,
        user: config.store.mysqlUser,
        password: config.store.mysqlPassword,
        database: config.store.mysqlDatabase,
        connectionLimit: config.store.ConnectionLimit,
    });

    // 사용 가능한 커넥션이 없을경우
    this._pool.on('enqueue', function () {
        console.log(util.format("## Waiting for available connection slot ##"));
    });

    console.log(util.format('## mysql connected ##'));
};


// sequelize로 성능 보장이 되지 않는 쿼리를 수행할 때 사용할 함수
DBService.Query = function (query, value, succEvent) {

    this._pool.getConnection(function (err, connection) {
        connection.query(query, value, function (err, rows) {
            if (err) {
                connection.release();
                throw err;
            }

            succEvent(rows);
            connection.release();
        });
    });
};

module.exports = DBService;
