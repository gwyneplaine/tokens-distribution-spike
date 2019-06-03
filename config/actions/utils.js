const fs = require('fs');
const path = require('path');
// TODO: IO PROCEDURES ARE GROSS
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

function analyseDestinationPath(filePath) {
  const [match] = filePath.match(/\.[0-9a-z]+$/i);
  const fileExt = match.substring(1);
  const filename = filePath.split('/').pop();
  const [directoryPath] = filePath.match(/.+?(?=\/[0-9a-z]+\.[0-9a-z]+$)/i);

  return { fileExt, directoryPath, filename };
}

module.exports = {
  analyseDestinationPath,
  deleteDirectory
}
