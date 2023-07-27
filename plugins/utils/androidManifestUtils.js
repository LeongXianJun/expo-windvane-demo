/**
 * intent has same typing as intentFilter
 * @typedef {import('@expo/config-plugins/build/android/Manifest').ManifestIntentFilter} ManifestQueriesIntent
 */

/**
 * @param {ManifestQueriesIntent} intent
 * @returns {ManifestQueriesIntent}
 */
function createAndroidManifestQueriesIntent(intent) {
    return intent;
}

/**
 *
 * @param {import('@expo/config-plugins').AndroidManifest['manifest']} manifest
 * @param {ManifestQueriesIntent} intent
 * @return {import('@expo/config-plugins').AndroidManifest}
 */
function addAndroidManifestQueriesIntent(manifest, intent) {
    // create dummmy queries array if queries is undefined
    // eslint-disable-next-line no-param-reassign
    manifest['queries'] = manifest['queries'] || [{ intent: [{}] }];

    // check if intent array already contains this intent, return manifest if it does
    if (
        manifest['queries'][0].intent.find(
            (i) =>
                JSON.stringify(intent.action) === JSON.stringify(i.action) &&
                JSON.stringify(intent.category) === JSON.stringify(i.category) &&
                JSON.stringify(intent.data) === JSON.stringify(i.data),
        )
    ) {
        return manifest;
    }

    manifest['queries'][0].intent.push(intent);
    return manifest;
}

module.exports = {
    createAndroidManifestQueriesIntent,
    addAndroidManifestQueriesIntent,
};
