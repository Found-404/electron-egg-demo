<template>
    <div v-for="item in file_list" class="list">
        <div class="file" @click="selectFiles(item)">{{ item.isDirectory ? '-文件夹' : '-文件' }}：{{ item.name }}</div>
        <FileRow :file_list="item.children || []" v-if="item.children?.length" @select_File="selectFiles"/>
    </div>
</template>
  
<script setup>
defineProps({
    file_list: Array,
})

const emit = defineEmits(['select_File'])
const selectFiles = (item) => {
    emit('select_File', item)
}

</script>

<style scoped>
.list {
    margin-left: 30px;
}

.file:hover {
    background-color: #dedede;
    cursor: pointer;
}
</style>
    