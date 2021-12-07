<template>
  <div class="list">
    <el-table :data="items" style="width: 100%">
      <el-table-column prop="title" label="Title"></el-table-column>
      <el-table-column prop="url" label="URL" width="100">
        <template slot-scope="scope">
          <el-link class="link" target="_blank" type="primary" @click="linkClick(scope.row.title, scope.row.url)"
                   :data-clipboard-text="scope.row.url">
            {{ scope.row.url.match(/u.jd.com\/(\w*)/)[1] }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-radio v-model="radio" label="1">app</el-radio>
    <el-radio v-model="radio" label="2">web</el-radio>
    <el-radio v-model="radio" label="3">copy</el-radio>
  </div>
</template>

<script>
import Clipboard from 'clipboard'

export default {
  name: "Jingfen",
  data() {
    return {
      items: [],
      UA: "",
      radio: '1'
    }
  },
  methods: {
    linkClick(title, url) {
      if (this.radio === '1') {
        // 跳转app
        if (title.includes('京喜')) {
          window.open(`openapp.jdpingou://virtual?params=%7B%22category%22:%22jump%22,%22des%22:%22m%22,%22sourceValue%22:%22babel-act%22,%22sourceType%22:%22babel%22,%22url%22:%22${url}%22%7D`)
        } else if (title.includes('京东')) {
          window.open(`openjd://virtual?params=%7B%22category%22:%22jump%22,%22des%22:%22m%22,%22sourceValue%22:%22babel-act%22,%22sourceType%22:%22babel%22,%22url%22:%22${url}%22%7D`)
        }
      } else if (this.radio === '2') {
        // web
        window.open(url, '_blank')
      } else {
        // copy
        new Clipboard('.link', {
          text: function () {
            return url;
          }
        });
      }
    },
  },
  mounted() {
    this.UA = navigator.userAgent
    this.axios.get('/api/jf_get').then(res => {
      for (let [index, item] of res.data.entries()) {
        let title = item.match(/^http/) ? '' : item.split('\n')[0]
        let url = item.match(/http.*/)[0]
        if (this.UA.indexOf('iPhone') > -1) {
          this.radio = '1'
        } else {
          this.radio = '2'
        }
        this.items.push({
          title: `${index + 1} ${title}`,
          url: url
        })
      }
    })
  }
}
</script>