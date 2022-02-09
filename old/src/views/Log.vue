<template>
  <div>
    <div class="files" ref="files">
      <el-menu :default-openeds="['1']" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
               @select="openLog">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">导航一</span>
          </template>
          <el-menu-item v-for="(file,index) in files" :index="index.toString()">{{ file }}</el-menu-item>
        </el-submenu>
      </el-menu>
      <br>
      <el-button type="danger" round style="margin-left:23px;">危险按钮</el-button>
    </div>

    <div class="logs" :style="{width:tabWidth}">
      <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" @tab-click="tabClick">
        <el-tab-pane
            :key="item.name"
            v-for="(item, index) in editableTabs"
            :label="item.title"
            :name="item.name"
            style="white-space: pre-wrap">
          <el-button type="danger" icon="el-icon-delete" circle @click="clearLog(item.name)"></el-button>
          <br>
          <br>
          {{ item.content }}
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      tabWidth: 0,
      files: [],  // 日志列表
      logs: [],  // 日志内容
      editableTabsValue: '',  // 当前激活标签
      editableTabs: [], // 标签组
      tabOpen: [], // 已经打开过的
      live: false, // 是否在监听
      index: -1, // 当前日志索引
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    tabClick(tab) {
      this.index = this.files.indexOf(tab.name)
    },
    async openLog(index) {
      this.index = index;
      let logName = this.files[index]
      await this.getLog(logName);
      // console.log(this.logs)
      console.log('openLog', index, logName)
      if (this.tabOpen.indexOf(logName) === -1) {
        console.log('第一次打开')
        this.editableTabs.push({
          title: logName,
          name: logName,
          content: this.logs[logName]
        })
        this.tabOpen.push(logName)
      } else {
        console.log('已经打开')
        for (let i = 0; i < this.editableTabs.length; i++) {
          if (this.editableTabs[i].name === logName) {
            this.editableTabs[i].content = this.logs[logName]
          }
        }
      }
      this.editableTabsValue = logName
    },
    async getLog(name) {
      await this.axios.get(`/api/getLog?name=${name}`).then(res => {
        this.logs[name] = res.data
        console.log('日志读取完成')
      })
    },
    clearLog(name) {
      console.log('清空：', name)
      this.axios.get(`/api/clearLog?name=${name}`).then(res => {
        if (res.data === 'OK') {
          this.$message({
            message: `${name}日志已清空`,
            type: 'success'
          });
          this.logs[name] = ''
          for (let i = 0; i < this.editableTabs.length; i++) {
            if (this.editableTabs[i].name === name) {
              this.editableTabs[i].content = ''
              break
            }
          }
        }
      })
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName;
      }
      if (action === 'remove') {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    }
  },
  mounted() {
    this.axios.get('/api/').then(res => {
      this.files = res.data;
    })
    this.tabWidth = document.body.clientWidth - 180 + 'px'
    let timer = setInterval(() => {
      if (this.index !== -1) {
        this.openLog(this.index)
      }
    }, 3000)
  }
}
</script>

<style>
.files {
  width: 150px;
  height: calc(100vh);
  float: left;
  overflow: hidden;
  overflow-y: auto;
  position: fixed;
}

.logs {
  width: 100%;
  float: left;
  position: relative;
  left: 150px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 400px;
}

.el-tab-pane {
  height: calc(100vh - 60px);
  overflow-y: auto;
}
</style>