const dirTree = require('directory-tree');

function readDir(dirpath) {
    let tree = dirTree(dirpath, { extensions: /\.(mov|r3d|mp4|aac|mp3)$/i });
    console.log('tree:\n', tree);
}

// readDir('/Users/volving/Git/__tmp/nodejs/try-mocha/old_data');
readDir('/Users/volving/Downloads/raw/movs');
// readDir('/Users/volving/Downloads/raw/movsasdf');

module.exports = {
    readDir
};
