#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();
inquirer.prompt([
  {
    type: 'list',
    name: 'template',
    message: 'Choose a template:',
    choices: ['默认模板']
  },
  {
    type: 'input',
    name: 'projectName',
    message: 'Enter the project name:',
    validate(input) {
      if (!input) return 'Please enter a project name';
      //验证文件名是否合法
      if (!/^[a-zA-Z0-9_-]+$/.test(input)) return 'Please enter a valid project name';
      if (input == 'main') return 'main is a reserved word';
      //验证文件夹是否存在
      if (fs.existsSync(`${__dirname}/packages/${input}`)) return 'Project already exists';
      return true;
    }
  }
]).then((res) => {
  toCreateProject(res.projectName);
}).catch((error) => {
  console.error(error);
});
function toCreateProject(folderName) {
  copyDirectory('/cli/template/', `/packages/${folderName}/`)
}
function copyDirectory(src, dest) {
  const originPath = __dirname + src;
  const targetUrl = __dirname + dest;

  fs.mkdir(targetUrl, { recursive: true }, (err) => {
    if (err) throw err;
  });
  let files = fs.readdirSync(originPath);
  files.forEach(item => {
    let originItemPath = originPath + item
    let itemStat = fs.statSync(originItemPath);// 获取文件信息
    if (itemStat.isFile()) {
      let fileName = targetUrl + path.basename(originItemPath);// 获取文件名称
      fs.writeFileSync(fileName, fs.readFileSync(originItemPath)); // 写到这个路径
    } else {
      let fliename = path.join(__dirname, `${dest}/${item}/`);
      fs.mkdir(fliename, { recursive: true }, (err) => {
        if (err) {
          throw err;
        } else {
          copyDirectory(src + item + '/', dest + item + '/')
        }
      });
    }
  })
}