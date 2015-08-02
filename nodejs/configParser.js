/**
 * Module dependencies.
 */
var yaml = require('js-yaml'),
    fs   = require('fs');

/**
 * Parse Config
 */
try {
  var config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
  console.log("=>Config file loaded");
} catch (e) {
  console.log(e);
}

exports.config = config;
exports.config_public = config.global_public;