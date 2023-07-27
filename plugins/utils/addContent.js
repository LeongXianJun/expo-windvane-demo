const {
    createGeneratedHeaderComment,
    removeGeneratedContents,
} = require('@expo/config-plugins/build/utils/generateCode');

/**
 * @typedef {string | RegExp} Anchor
 *
 *
 * @typedef Comment
 * @property {string} open
 * @property {string | undefined} close
 *
 *
 * @typedef AddContentConfig
 * @property {string} src
 * @property {string} content
 * @property {Anchor | Anchor[]} anchor
 * @property {number} offset
 * @property {string} tag
 * @property {Comment} comment
 * @property {number | undefined} tabWidth
 */

/**
 * @param {string} content
 * @param {string} tag
 * @param {Comment} comment
 * @returns {string}
 */
function generateHeader(content, tag, comment) {
    const header = createGeneratedHeaderComment(content, tag, comment.open);
    return header + (comment.close ?? '');
}

/**
 * @param {string} src
 * @param {string} header
 * @param {string} tag
 * @returns {string | undefined}
 */
function sanitize(src, header, tag) {
    if (src.includes(header)) {
        const sanitizedTarget = removeGeneratedContents(src, tag);
        return sanitizedTarget;
    }

    return src;
}

/**
 * @param {string} tag
 * @param {Comment} comment
 * @returns {string}
 */
function generateClosure(tag, comment) {
    return `${comment.open} @generated end ${tag} ${comment.close ?? ''}`;
}

/**
 * @param {string[]} srcLines
 * @param {Anchor} anchor
 * @param {number | undefined} startingOffset
 * @returns {number}
 */
function getLineIndex(srcLines, anchor, startingOffset = 0) {
    const lineIndex = startingOffset + srcLines.slice(startingOffset).findIndex((line) => line.match(anchor));
    if (lineIndex < 0) {
        const error = new Error(`Failed to match "${anchor}"`);
        // @ts-ignore
        error.code = 'ERR_NO_MATCH';
        throw error;
    }
    return lineIndex;
}

/**
 * @param {string[]} srcLines
 * @param {Anchor | Anchor[]} anchor
 * @returns {number}
 */
function getAnchorIndex(srcLines, anchor) {
    if (Array.isArray(anchor)) {
        const lineIndex = anchor.reduce((index, current) => getLineIndex(srcLines, current, index), 0);
        return lineIndex;
    }

    const lineIndex = getLineIndex(srcLines, anchor);
    return lineIndex;
}

/**
 * @param {AddContentConfig} config
 * @returns {import('@expo/config-plugins/build/utils/generateCode').MergeResults}
 *
 * @limitation Only work on string-based file changes.
 */
function addContent({ anchor, comment, content, offset, src, tabWidth, tag }) {
    const header = generateHeader(content, tag, comment);
    const sanitizedSrc = sanitize(src, header, tag);
    const closure = generateClosure(tag, comment);

    const spaces = ' '.repeat(tabWidth ?? 0);
    const lines = (sanitizedSrc ?? src).split('\n');
    const anchorIndex = getAnchorIndex(lines, anchor) + offset;

    const newContent = [
        ...lines.slice(0, anchorIndex),
        spaces + header,
        ...content.split('\n').map((line) => `${spaces + line}`),
        spaces + closure,
        ...lines.slice(anchorIndex),
    ]
        .join('\n')
        .trim();

    const didClear = src.includes(header) && Boolean(sanitizedSrc);
    const didMerge = src.includes(header);

    return {
        contents: newContent,
        didClear,
        didMerge,
    };
}

module.exports = {
    addContent,
};
