module.exports = {
    server: {
        trust_proxy_host: "",
        port: 8080,
        session_expire: 1080000,
        single_cluster: false,
        accept_domain: "",
        auth_key: "auth_key"
    },
    store: {
        storeDBMS: "mysql",
        mysqlHost: "",
        mysqlPort: "3306",
        mysqlUser: "",
        mysqlPassword: "",
        mysqlDatabase: "",
        ConnectionLimit: 100,
        ConnectionMinimum: 0,
        ConnectionIdle: 10000
    },
    redis: {
        redisHost: "",
        redisPort: "",
        redisDatabase: 0,
        redisPassword: ""
    }
};
