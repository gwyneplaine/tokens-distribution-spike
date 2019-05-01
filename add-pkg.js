const { execSync } = require("child_process");
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');


async function run () {
  const namespace = "@gwyneplaine";

  const pkgName = await inquirer.prompt([{
    message: "First, what is the name of your new package?",
    name: 'pkgName',
    validate: input => input.length > 0
  }]).then(responses => {
    return responses.pkgName
  });

  const entryPoint = await inquirer.prompt([{
    message: "Next, please the entrypoint for your package? (i.e. index.js)",
    name: 'entryPoint',
    validate: input => input.length > 0
  }]).then(responses => responses.entryPoint);

  const packageConfig = await inquirer.prompt([{
    message: 'Please specify your package manager (npm is the default)',
    name: 'packageManager',
  }]).then(({ packageManager }) => {
    switch (packageManager.toLowerCase()) {
      // TODO Add cocoapods support
      case 'npm':
      default:
        return 'package.json'
    }
  });

  let folderPath = path.resolve(__dirname, `packages/${pkgName}`);

  try {
    if (fs.existsSync(folderPath)) {
      throw Error(`Could not create ${pkgName}. \nFolder already exists in ${folderPath}`);
    }

    let packageJSON = JSON.stringify({
      name: `${namespace}/${pkgName}`,
      version: "0.0.0",
      main: entryPoint,
      license: "ISC",
      author: "Atlassian",
    }, "utf-8", 2);

    fs.mkdirSync(`${folderPath}`);
    fs.writeFileSync(`${folderPath}/${packageConfig}`, packageJSON);
  } catch (e) {
    console.error(chalk.red(e));
  }
}


run();
