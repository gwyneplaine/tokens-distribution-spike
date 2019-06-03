const fs = require('fs');
const path = require('path');
function deleteDirectory (directoryPath) {
  if (!fs.existsSync(directoryPath)) return;
  const entryPaths = fs.readdirSync(directoryPath);
  entryPaths.forEach(entryPath => {
    const resolvedPath = path.resolve(directoryPath, entryPath);
    if (fs.lstatSync(resolvedPath).isDirectory()) {
      deleteDirectory(resolvedPath);
    } else {
      fs.unlinkSync(resolvedPath);
    };
  });
  fs.rmdirSync(directoryPath);
}

module.exports = {
  deleteDirectory,
}
