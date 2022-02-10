<template>
  <div id="app">
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

<script lang="ts" setup>
import axios from 'axios';
import {onMounted, reactive, ref} from "vue";

// Icon
import {ArrowDownBold, ArrowUpBold} from "@element-plus/icons-vue";

interface Tree {
  id?: number,
  label?: string,
  isLeaf?: boolean,
  children?: Tree[]
}

const tree: any = ref(null)
const log = ref("")

const handleNodeClick = (data: Tree) => {
  if (data.isLeaf) {
    // 叶子节点
    let path: string = tree.value.getNode(data.id).parent.data.label
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
let data: { data: Tree [] } = reactive({data: []})

const initTree = () => {
  let id: number = 1;
  axios.get('/api/dir')
      .then(res => {
        Object.keys(res.data).forEach((key: string) => {
          data.data.push({
            id: id++,
            label: key,
            children: res.data[key].map((filename: string) => {
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
const scroll = (pos: number) => {
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