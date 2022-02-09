<template>
  <div id="app">
    <el-tree
        ref="tree"
        :data="data"
        :props="defaultProps"
        accordion
        @node-click="handleNodeClick"
        node-key="id"
        :default-expanded-keys="[2]"
    >
    </el-tree>

    <div ref="right" class="right">
      {{ log }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'App',
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      log: '',
    }
  },
  methods: {
    async handleNodeClick(data) {
      if (!data.children) {
        let dir = this.$refs.tree.getNode(data.id).parent.data.label
        let filename = data.label
        dir += '/' + filename
        console.log(dir)
        this.log = await this.get(dir)
      }
    },
    async get(filename) {
      let {data} = await axios.get(`/api/get?filename=${filename}`)
      return data
    }
  },
  async mounted() {
    let id = 1
    let {data} = await axios.get('/api/dir')
    console.log(data)
    Object.keys(data).forEach(item => {
      this.data.push({
        id: id++,
        label: item,
        children: data[item].map(item => {
          return {
            id: id++,
            label: item
          }
        })
      })
    })
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.el-tree {
  width: 20%;
  position: fixed;
}

.right {
  width: 80%;
  background: aliceblue;
  left: 20%;
  position: relative;
}

</style>
