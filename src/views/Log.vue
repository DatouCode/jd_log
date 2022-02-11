<template>
  <div class="app">
    <div class="left">
      <el-tree ref="tree" node-key="id" :data="data.data" :props="defaultProps" @node-click="handleNodeClick"
               default-expanded-keys="[1]" accordion/>

      <div class="button">
        <el-button type="primary" :icon="ArrowUpBold" circle @click="scroll(0)"></el-button>
        <el-button type="primary" :icon="ArrowDownBold" circle @click="scroll(1)"></el-button>
      </div>
    </div>

    <div class="right">
      {{ log }}
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import {onMounted, reactive, ref} from "vue";
import {ArrowDownBold, ArrowUpBold} from "@element-plus/icons-vue";

const log = ref("")
const tree = ref(null)

const handleNodeClick = data => {
  if (data.isLeaf) {
    // 叶子节点
    let path = tree.value.getNode(data.id).parent.data.label
    path += '/' + data.label
    axios.get(`/api/get?filename=${path}`)
        .then(res => {
          log.value = res.data
        })
  }
}

const defaultProps = {
  children: 'children',
  label: 'label',
}
let data = reactive({data: []})

const initTree = () => {
  let id = 1;
  axios.get('/api/dir')
      .then(res => {
        Object.keys(res.data).forEach(key => {
          data.data.push({
            id: id++,
            label: key,
            children: res.data[key].map(filename => {
              return {
                id: id++,
                label: filename,
                isLeaf: true
              }
            })
          })
        })
      })
}

// 日志滚动
const scroll = (pos) => {
  window.scrollTo({
    top: pos ? document.body.clientHeight : 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  initTree();
  console.log(data.data)
})

</script>

<style>
* {
  margin: 0;
  padding: 0;
}

.left {
  width: 200px;
  height: 100vh;
  float: left;
  position: fixed;
}

.right {
  width: calc(100% - 200px);
  background: antiquewhite;
  word-wrap: normal;
  white-space: pre-wrap;
  overflow: hidden;
  position: relative;
  left: 200px;
}

</style>