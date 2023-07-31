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
                    `pod 'EMASWindVaneMiniApp', '0.9.5.4-nanozip'`,
                    `pod 'EMASUniappMiniApp'`,
                    ``,
                    ``,
                    `#-common lib`,
                    `pod 'UserTrack', '6.3.5.46-poc'`,
                    `pod 'Reachability', '3.2'`,
                    `pod 'FMDB', '2.7.2'`,
                    `pod 'NetworkSDK', '10.0.4.6'`,
                    `pod 'tnet', '10.3.0'`,
                    `pod 'AliEMASConfigure', '0.0.1.19'`,
                    `pod 'AlicloudUTDID', '1.1.0.19'`,
                    ``,
                    ``,
                    `pod 'WindVane', '2.1.2-SNAPSHOT'`,
                    `pod 'Windmill', '1.2.6.7'`,
                    `pod 'RiverLogger'`,
                    ``,
                    `pod 'TBJSONModel', '0.1.15.2-SNAPSHOT'`,
                    ``,
                    `pod 'ZCache', '10.0.10'`,
                    ``,
                    `pod 'DynamicConfiguration', '10.0.4'`,
                    `pod 'DynamicConfigurationAdaptor', '10.0.4'`,
                    ``,
                    `pod 'ZipArchive', '~> 1.4.0'`,
                    ``,
                    `pod 'MtopSDK', '10.1.7'`,
                    `pod 'mtopext/MtopCore', '10.1.6'`,
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
