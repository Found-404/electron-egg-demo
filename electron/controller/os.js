'use strict';
const _ = require('lodash');
const path = require('path');
const { Controller } = require('ee-core');
const Services = require('ee-core/services');
const Log = require('ee-core/log');
const fs = require('fs')
// const glob = require('glob');

const { app: electronApp, dialog, shell } = require('electron');

// 定义递归函数来构建树形结构
function buildTree(dirPath) {
  const contents = fs.readdirSync(dirPath);

  const files = [];

  contents.forEach(content => {
    const contentPath = path.join(dirPath, content);
    const stats = fs.statSync(contentPath);

    const file = {
      name: content,
      path: contentPath,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile(),
      children: stats.isDirectory() ? buildTree(contentPath) : null
    };

    files.push(file);
  });

  return files;
}


/**
 * 操作系统 - 功能demo
 * @class
 */
class OsController extends Controller {

  constructor(ctx) {
    super(ctx);
  }

  /**
   * 选择目录
   */
  selectFolder() {
    const filePaths = dialog.showOpenDialogSync({
      properties: ['openDirectory', 'createDirectory']
    });
    if (_.isEmpty(filePaths)) {
      return null
    }
    return filePaths[0];
  }

  /**
   * 打开目录
   */
  openDirectory(fPath) {
    if (!fPath) {
      return false;
    }
    let dir = '';
    if (path.isAbsolute(fPath)) {
      dir = fPath;
    } else {
      dir = electronApp.getPath(fPath);
    }
    Log.info('dir====>', dir)
    shell.openPath(dir);
    return true;
  }

  /**
   * 创建json文件
   */
  jsonCreat(params) {
    const { file_path, file_json_name, file_json_value } = params
    try {
      fs.writeFileSync(file_path + '/' + file_json_name + '.json', file_json_value, 'utf8')
      return true
    } catch (error) {
      return false
    }
  }


  // 文件目录读取
  fileListInit(params) {
    Log.info('params==>', params)
    return buildTree(params)
  }


  // 文件夹创建
  fileCreat(params) {
    const { file_path, file_name } = params
    if (!file_path || !file_name) return false
    const fs = require('fs');
    try {
      fs.mkdirSync(file_path + '/' + file_name);
      Log.info('创建成功')
      return true
    } catch (error) {
      return false
    }
  }

  // 读取文件内容
  getFileDetail(filePath) {
    const data = fs.readFileSync(filePath);
    return data.toString()
  }


  /**
 * json数据库操作
 */
  async jsondbOperation(args) {
    const { action, info, delete_name, update_name, update_age, search_age, data_dir } = args;

    const data = {
      action,
      result: null,
      all_list: []
    };

    Log.info('data result:', data, Services.get('database.jsondb'));

    switch (action) {
      case 'add':
        data.result = await Services.get('database.jsondb').addTestData(info);
        break;
      case 'del':
        data.result = await Services.get('database.jsondb').delTestData(delete_name);
        break;
      case 'update':
        data.result = await Services.get('database.jsondb').updateTestData(update_name, update_age);
        break;
      case 'get':
        data.result = await Services.get('database.jsondb').getTestData(search_age);
        break;
      case 'getDataDir':
        data.result = await Services.get('database.jsondb').getDataDir();
        break;
      case 'setDataDir':
        data.result = await Services.get('database.jsondb').setCustomDataDir(data_dir);
        break;
    }

    data.all_list = await Services.get('database.jsondb').getAllTestData();

    return data;
  }


}

OsController.toString = () => '[class OsController]';
module.exports = OsController;