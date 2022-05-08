/**
 * Checks whether the song provided is a URL.
 * @param {string} song
 */
function isURL (song) {
    const urlPattern = /(mailto|news|tel(net)?|urn|ldap|ftp|https?):\+?(\/\/)?\[?([a-zA-Z0-9]\]?.{0,})/gmi;
    const urlRegex = new RegExp(urlPattern);
    return song.match(urlRegex);
}

module.exports = { isURL };
