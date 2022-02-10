<template>
  <div id="app">
    <div class="left">

      <a-directory-tree
          v-model:expandedKeys="expandedKeys"
          v-model:selectedKeys="selectedKeys"
          multiple
          :tree-data="treeData"
          :load-data="onLoadData"
          @select="handleSelect"
      ></a-directory-tree>

      <hr>
      <a-button class="btn" type="primary" shape="circle" @click="scrollToBottom(0)">
        <template #icon>
          <UpOutlined/>
        </template>
      </a-button>

      <a-button class="btn" type="primary" shape="circle" @click="scrollToBottom(1)">
        <template #icon>
          <DownOutlined/>
        </template>
      </a-button>

      <a-button class="btn" type="danger" shape="circle" @click="deleteLog">
        <template #icon>
          <DeleteOutlined/>
        </template>
      </a-button>
    </div>

    <div class="right">
      {{ log }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {UpOutlined, DownOutlined, DeleteOutlined} from '@ant-design/icons-vue';
import {defineComponent, onMounted, ref} from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    UpOutlined,
    DownOutlined,
    DeleteOutlined
  },
  setup() {
    const expandedKeys = ref(['0-0']);
    const selectedKeys = ref([]);
    const log = ref('')
    let treeData = ref([]);

    treeData.value = []

    const handleSelect = (selectedKeys, e) => {
      if (selectedKeys[0].includes('.log')) {
        // 加载日志
        axios.get(`/api/get?filename=${selectedKeys[0].replace('-jd', '/jd')}`).then(res => {
          log.value = res.data
        });
      }
    }

    const onLoadData = treeNode => {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
        } else {
          axios.get(`/api/dir?dir=${treeNode.dataRef.key}`).then(res => {
            let temp = []
            Object.keys(res.data).forEach(key => {
              temp.push({
                title: key,
                key: `${treeNode.dataRef.key}-${key}`,
                isLeaf: true
              })
            })
            treeNode.dataRef.children = temp
            treeData.value = [...treeData.value]
            resolve()
          })
        }
      })
    }

    onMounted(() => {
      axios.get('/api/dir').then(res => {
        Object.keys(res.data).forEach(key => {
          treeData.value.push({
            title: key,
            key: key,
          })
        })
        treeData.value = [...treeData.value]
      })
    });

    return {
      expandedKeys,
      selectedKeys,
      treeData,
      log,

      handleSelect,
      onLoadData
    }
  },
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

.left .btn {
  margin-right: 20px;
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