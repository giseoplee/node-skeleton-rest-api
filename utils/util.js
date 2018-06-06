const uuid = require('node-uuid');
const crypto = require("crypto");
const util = require('util');

const config = require('../config');


const Util = {};
Util.functional = {};

/* EX) common.Encryption(description, 'aes-256-ctr') */

Util.encrypt = function (description, algorithm) {

    const cipher = crypto.createCipher(algorithm, config.server.auth_key);
    let encipherContent = cipher.update(description, 'utf8', 'hex');
    encipherContent += cipher.final('hex');
    return encipherContent;
}

/* EX) common.Decryption(description, 'aes-256-ctr') */

Util.decrypt = function (description, algorithm) {

    const decipher = crypto.createDecipher(algorithm, config.server.auth_key);
    let decipherContent = decipher.update(description, 'hex', 'utf8');
    decipherContent += decipher.final('utf8');
    return decipherContent;
}

/* EX) common.Hashing(description, 'ripemd160WithRSA') */

Util.hash = function (description, algorithm) {

    const hash = crypto.createHash(algorithm);
    let hashedContent = hash.update(config.server.auth_key + description);
    hashedContent = hash.digest('hex');
    return hashedContent;
}

module.exports = Util;
