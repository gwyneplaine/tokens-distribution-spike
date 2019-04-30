const { execSync } = require("child_process");
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');


async function run () {
  const namespace = "@gwyneplaine";
  let [pkg, format] = process.argv.splice(2);
  let folderPath = path.resolve(__dirname, `packages/${pkg}`);
  try {
    if (fs.existsSync(folderPath)) {
      throw Error(`Could not create ${pkg}. \nFolder already exists in ${folderPath}`);
    }

    let packageJSON = JSON.stringify({
      name: `${namespace}/${pkg}`,
      version: "0.0.1",
      main: `index.${format}`,
      license: "ISC",
      author: "Atlassian",
    }, "utf-8", 2);

    fs.mkdirSync(`${folderPath}`);
    fs.writeFileSync(`${folderPath}/package.json`, packageJSON);
  } catch (e) {
    console.error(chalk.red(e));
  }
}


run();
