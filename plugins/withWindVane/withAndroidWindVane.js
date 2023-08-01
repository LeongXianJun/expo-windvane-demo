const { withPlugins, withProjectBuildGradle } = require('@expo/config-plugins');
const { addContent } = require('../utils/addContent');

function updateProjectBuildGradle(config) {
    return withProjectBuildGradle(config, (cfg) => {
        const { modResults } = cfg;

        const credential = {
            repo: 'http://nexus-ce.emas-poc.com/repository/maven-public',
            username: 'CenterExperience',
            password: '77kkyy99',
        };

        modResults.contents = addContent({
            src: modResults.contents,
            content: [
                'maven {',
                `    url '${credential.repo}'`,
                '    allowInsecureProtocol = true',
                '    credentials {',
                `        username = '${credential.username}'`,
                `        password = '${credential.password}'`,
                '    }',
                '}',
            ].join('\n'),
            tag: 'EMAS WindVane MiniApp implementations',
            anchor: [/^allprojects {$/, /^ {4}repositories {$/, /^ {4}}$/],
            offset: 0,
            comment: {
                open: '//',
            },
            tabWidth: 8,
        }).contents;

        return cfg;
    });
}

function withAndroidWindVane(config) {
    const plugins = [updateProjectBuildGradle];
    return withPlugins(config, plugins);
}

module.exports = {
    withAndroidWindVane,
};
