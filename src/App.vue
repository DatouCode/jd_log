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
      <div ref="log" style="height: 0">
        {{ log }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'App',
  data() {
    return {
      data: [
        {
          id: 1,
          label: '02-07',
          children: [
            {
              id: 3,
              label: 'aa.log',
            },
          ],
        },
        {
          id: 2,
          label: '02-08',
          children: [
            {
              id: 5,
              label: 'bb.log',
            },
            {
              id: 7,
              label: 'cc.log',
            }
          ],
        },
      ],
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

        console.log(window.getComputedStyle(this.$refs.log).height)
      }
    },
    async get(filename) {
      let {data} = await axios.get(`/api/get?filename=${filename}`)
      return data
    }

  },
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
  height: 0;
  background: aliceblue;
  left: 20%;
  position: relative;
}

</style>
