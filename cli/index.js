#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import apps from "../config/apps.js";
const __dirname = path.resolve();
inquirer.prompt([
  // {
  //   type: 'list',
  //   name: 'templateName',
  //   message: 'Choose a template:',
  //   choices: ['vue', 'react']
  // },
  {
    type: 'input',
    name: 'projectName',
    message: '请输入项目名称：',
    validate(input) {
      if (!input) return '请输入项目名称';
      if (!/^[a-zA-Z0-9_-]+$/.test(input)) return '请输入合法的项目名称';
      if (input == 'main') return '请输入关键字main以外的项目名称';
      if (isHasApp(input)) return '子模块' + input + '已存在';
      if (fs.existsSync(`${__dirname}/packages/${input}`)) return '文件夹' + input + '已存在';
      return true;
    }
  },
  {
    type: 'input',
    name: 'projectPort',
    message: '请输入项目启动端口：',
    validate(input) {
      if (!input) return '请输入项目启动端口';
      if (!/^\d+$/.test(input)) return '请输入合法的项目启动端口';
      if (input < 3000 || input > 65535) return '项目启动端口要在3000-65535之间';
      if (isPortUsed(input)) return '项目启动端口' + input + '已存在';
      return true;
    }
  }
]).then((res) => {
  toCreateProject(res.projectName, res.projectPort);
}).catch((error) => {
  console.error(error);
});
function toCreateProject(projectName, projectPort) {
  copyDirectory(`/template/`, `/packages/${projectName}/`)
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
//验证端口是否被占用
function isPortUsed(port) {
  apps.forEach(app => {
    if (app.port == port) {
      return true;
    }
  })
  return false;
}
//验证子模块是否存在
function isHasApp(appName) {
  apps.forEach(app => {
    if (app.name == appName) {
      return true;
    }
  })
  return false;
}