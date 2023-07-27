const { withPlugins } = require('@expo/config-plugins');
const { withGeneralPlugins } = require('./withGeneralPlugins');
const { withWindVane } = require('./withWindVane');

module.exports = function withCustomPlugins(config) {
    // always run the last plugin always run first
    const plugins = [withGeneralPlugins, withWindVane];
    return withPlugins(config, plugins);
};
