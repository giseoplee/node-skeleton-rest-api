const config = require('../config');

const AuthModel = {}

AuthModel.login = async function(options) {
    return await user.findOne(options)
}

AuthModel.createUser = async function(options) {

}

module.exports = AuthModel;
