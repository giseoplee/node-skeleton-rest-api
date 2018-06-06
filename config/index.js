/**
 * Dependencies
 */

const path = require('path');
const development = !require('./env/development') ? require('./env/development_sample') : require('./env/development');
const production = require('./env/production');


const defaults = {
    root: path.join(__dirname, '..')
}

/**
 * Expose
 */
module.exports = {
    development: Object.assign({}, development, defaults),
    production: Object.assign({}, production, defaults),
}[process.env.NODE_ENV || 'development']
