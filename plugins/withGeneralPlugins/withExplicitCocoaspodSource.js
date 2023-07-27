const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const { addContent } = require('../utils/addContent');

function updatePodfile(config) {
    return withDangerousMod(config, [
        'ios',
        (cfg) => {
            const { platformProjectRoot } = cfg.modRequest;
            const podfile = resolve(platformProjectRoot, 'Podfile');
            const contents = readFileSync(podfile, 'utf-8');

            let latestContent = '';

            /**
             * when anchor not found, mean no custom source
             * thus, it is safe to not add cocoaspod source explicitly
             */
            try {
                latestContent = addContent({
                    src: contents,
                    content: [
                        '# Explicitly add cocoapods sources when there are custom source(s)',
                        "source 'https://cdn.cocoapods.org/'",
                    ].join('\n'),
                    tag: 'Cocoapods Source',
                    anchor: /^source/,
                    offset: -1, // required due to presense of header
                    comment: {
                        open: '#',
                    },
                }).contents;
            } catch {
                return cfg;
            }

            writeFileSync(podfile, latestContent);

            return cfg;
        },
    ]);
}

function withExplicitCocoaspodSource(config) {
    const plugins = [updatePodfile];
    return withPlugins(config, plugins);
}

module.exports = {
    withExplicitCocoaspodSource,
};
