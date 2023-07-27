const { withPlugins } = require('@expo/config-plugins');
const { withAndroidWindVane } = require('./withAndroidWindVane');
const { withIOSWindVane } = require('./withIOSWindVane');

function withWindVane(config) {
    const plugins = [withAndroidWindVane, withIOSWindVane];
    return withPlugins(config, plugins);
}

module.exports = {
    withWindVane,
};
