<template>
  <div class="demo">
    <div class="path_input">
      <input type="text" :value="file_path" placeholder="选择项目目录">
      <button @click="slectCatalogue">选择目录</button>
      <button @click="openCatalogue">打开目录</button>
      <div>
        <span>当前选择项目目录：</span>
        <span>{{ file_path }}</span>
      </div>
    </div>
    <div class="path_input">
      <div>
        <input type="text" v-model="file_name" placeholder="输入文件夹名">{{ file_name }}
        <button @click="dbOperation">添加文件夹</button>
      </div>
      <div>
        <input type="text" v-model="file_json_name" placeholder="输入JSON文件夹">{{ file_json_name }}
        <input type="text" v-model="file_json_value" placeholder="输入JSON内容">
        <button @click="dbOperationJson">添加JSON文件</button>
      </div>
    </div>
    <div class="file_Edit">
      <div class="file_list">
        <FileRow :file_list="file_list" @select_File="selectFile" />
      </div>
      <div class="file_detail">
        <p>{{ file_detail }}</p>
        <div>
          <p>文件内容读取：</p>
          {{ file_detail_value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ipcApiRoute } from '@/api/main';
import { ipc } from '@/utils/ipcRenderer';
import FileRow from './FileRow.vue';
import { ref, onMounted } from 'vue';

const file_path = ref('')
const file_list = ref([])
const file_detail = ref('')
const file_detail_value = ref('')

const file_name = ref('')
const file_json_name = ref('')
const file_json_value = ref('')

// 初始化
const init = (path) => {
  ipc.invoke(ipcApiRoute.fileListInit, path).then(r => {
    console.log('初始化文件', r);
    file_list.value = r
  })
}

// 选择目录
const slectCatalogue = () => {
  ipc.invoke(ipcApiRoute.selectFolder, '').then(r => {
    console.log('选择目录', r);
    file_path.value = r;
    // 修改数据目录
    init(r)
  })
}

// 打开目录
const openCatalogue = () => {
  ipc.invoke(ipcApiRoute.openDirectory, file_path.value).then(res => {

  })
}

// 添加文件夹
const dbOperation = () => {
  const params = {
    file_path: file_path.value,
    file_name: file_name.value
  }
  console.log(params);
  ipc.invoke(ipcApiRoute.fileCreat, params).then(res => {
    console.log('res:', res);
    if (res) {
      // true 重新加载目录
      init(file_path.value)
    }
  })
}

// 添加json文件
const dbOperationJson = () => {
  const params = {
    file_path: file_path.value,
    file_json_name: file_json_name.value,
    file_json_value: file_json_value.value
  }
  ipc.invoke(ipcApiRoute.jsonCreat, params).then(res => {
    if (res) {
      init(file_path.value)
    }
  })
}

// 修改所选文件
const selectFile = (file) => {
  console.log('fileDetail', file);
  ipc.invoke(ipcApiRoute.getFileDetail, file.path).then(res => {
    console.log('res:', res);
    file_detail_value.value = res
  })
  file_detail.value = JSON.stringify(file)
}

onMounted(() => {
  init(file_path.value)
})

</script>
<style scoped>
.demo {
  height: 100%;
}

.path_input {
  display: flex;
}

.file_Edit {
  display: flex;
  height: calc(100% - 47px);
}

.file_list {
  width: 300px;
  height: 100%;
  background-color: rgb(199, 199, 199);
}

.file_detail {
  flex: 1;
  height: 100%;
  background-color: #afafaf;
}
</style>
  