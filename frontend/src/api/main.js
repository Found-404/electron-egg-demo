
/**
 * 主进程与渲染进程通信频道定义
 * Definition of communication channels between main process and rendering process
 */
const ipcApiRoute = {
  test: 'controller.example.test',

  // os
  selectFolder: 'controller.os.selectFolder',
  // 文件初始化
  fileListInit: 'controller.os.fileListInit',
  // 文件创建
  fileCreat: 'controller.os.fileCreat',
  // 读取文件
  getFileDetail: 'controller.os.getFileDetail',
  // 打开目录
  openDirectory: 'controller.os.openDirectory',
  // 创建json文件
  jsonCreat: 'controller.os.jsonCreat',

  jsondbOperation: 'controller.os.jsondbOperation',
}

export {
  ipcApiRoute
}

