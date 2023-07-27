const { withPlugins } = require('@expo/config-plugins');
const { withExplicitCocoaspodSource } = require('./withExplicitCocoaspodSource');

function withGeneralPlugins(config) {
    const plugins = [withExplicitCocoaspodSource];
    return withPlugins(config, plugins);
}

module.exports = {
    withGeneralPlugins,
};
