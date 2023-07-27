const { withPlugins, withProjectBuildGradle, withAppBuildGradle } = require('@expo/config-plugins');
const { addContent } = require('../utils/addContent');

function updateAppBuildGradle(config) {
    return withAppBuildGradle(config, (cfg) => {
        const { modResults } = cfg;

        modResults.contents = addContent({
            src: modResults.contents,
            content: [
                `// The basic SDK for the miniapp container. This dependency is required for both WindVane and uni-app.`,
                `implementation 'com.aliyun.emas.suite.core:servicebus:1.0.0'`,
                `api "com.aliyun.emas.suite.foundation:mini-app-adapter:1.3.0"`,
                `// The SDK for the WindVane miniapp container. If you want to integrate the WindVane miniapp container into the app, include this dependency. `,
                `implementation "com.aliyun.emas.suite.foundation:windvane-mini-app:1.2.1"`,
            ].join('\n'),
            tag: 'EMAS WindVane MiniApp implementations',
            anchor: [/^dependencies {$/, /^}$/],
            offset: 0,
            comment: {
                open: '//',
            },
            tabWidth: 4,
        }).contents;

        return cfg;
    });
}

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
    const plugins = [updateProjectBuildGradle, updateAppBuildGradle];
    return withPlugins(config, plugins);
}

module.exports = {
    withAndroidWindVane,
};
