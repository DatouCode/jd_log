<template>
  <div class="list">
    <el-table :data="items" style="width: 100%">
      <el-table-column prop="title" label="Title">
      </el-table-column>
      <el-table-column prop="url" label="URL" width="100">
        <template slot-scope="scope">
          <el-link :href="scope.row.url" target="_blank" type="primary">
            {{ scope.row.url.match(/u.jd.com\/(\w*)/)[1] }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Jingfen",
  data() {
    return {
      items: [],
      UA: ""
    }
  },
  mounted() {
    this.UA = navigator.userAgent

    this.axios.get('/api/jf_get').then(res => {
      for (let item of res.data) {
        let title = item.match(/^http/) ? '' : item.split('\n')[0]
        let url = item.match(/http.*/)[0]
        console.log(title, url)
        if (this.UA.indexOf('iPhone') > -1) {
          url = `openapp.jdpingou://virtual?params=%7B%22category%22:%22jump%22,%22des%22:%22m%22,%22sourceValue%22:%22babel-act%22,%22sourceType%22:%22babel%22,%22url%22:%22${url}%22%7D`
        }

        this.items.push({
          title: title,
          url: url
        })
      }
    })

  }
}
</script>