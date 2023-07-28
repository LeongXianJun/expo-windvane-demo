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

            let latestContent = addContent({
                src: contents,
                content: [
                    "source 'http://gitlab-ce.emas-poc.com/EMAS-iOS/emas-specs-thirdpart'",
                    "source 'http://gitlab-ce.emas-poc.com/EMAS-iOS/emas-specs'",
                ].join('\n'),
                tag: 'EMAS WindVane MiniApp Sources',
                anchor: /./, // basically the first line
                offset: 0,
                comment: {
                    open: '#',
                },
            }).contents;

            latestContent = addContent({
                src: latestContent,
                content: [
                    `pod 'EMASServiceManager'`,
                    `pod 'EMASMiniAppAdapter'`,
                    `pod 'EMASWindVaneMiniApp', '0.9.5.5-nanozip'`,
                ].join('\n'),
                tag: 'EMAS WindVane MiniApp pods',
                anchor: /\s+use_expo_modules!/,
                offset: 0,
                comment: {
                    open: '#',
                },
                tabWidth: 2,
            }).contents;

            writeFileSync(podfile, latestContent);

            return cfg;
        },
    ]);
}

function withIOSWindVane(config) {
    const plugins = [updatePodfile];
    return withPlugins(config, plugins);
}

module.exports = {
    withIOSWindVane,
};
