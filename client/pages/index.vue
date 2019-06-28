<template>
  <div class="homePage">
    <el-select
      v-model="lineID"
      placeholder="请选择产线进行切换"
      @change="initSocket"
    >
      <el-option
        v-for="v in productList"
        :key="v._id"
        :label="`${v.product}--${v.name}`"
        :value="v._id"
      >
      </el-option>
    </el-select>
    <el-button @click="clear()"> {{ $t(`button.clear`) }}</el-button>
    <el-table
      :data="data"
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="product" label="产品"></el-table-column>
      <el-table-column prop="material" label="来料" align="center">
      </el-table-column>
      <el-table-column prop="dosage" label="剂量" width="180"></el-table-column>
      <el-table-column prop="operator" label="操作人"> </el-table-column>
      <el-table-column prop="result" label="结果"> </el-table-column>
      <el-table-column prop="explanation" label="说明"> </el-table-column>
      <el-table-column prop="createdAt" label="操作时间"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
const io = require('socket.io-client')
export default {
  head() {
    return {
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'My custom description',
          title: 'description'
        }
      ]
    }
  },
  data() {
    return {
      lineID: '',
      productList: [],
      data: [
        {
          product: 1,
          date: '2016-05-02',
          name: 'watch',
          address: 'd08',
          status: 'pass'
        }
      ]
    }
  },
  async asyncData(ctx) {
    const { $axios } = ctx
    const { result: productList } = await $axios.$get('/api/v1/line', {
      params: { pagination: false }
    })
    console.log(productList)
    return {
      productList: productList,
      lineID: productList[0]._id
    }
  },
  async created() {},
  mounted() {
    this.initSocket()
  },
  methods: {
    initSocket() {
      console.log(process.env.HTTP_URL, process.env.HTTP_PORT)
      this.socket = io(
        // `http://${process.env.HTTP_URL}:${process.env.HTTP_PORT}/home?roomId=1`
        `http://${process.env.HTTP_URL}:${process.env.HTTP_PORT}/home?roomId=${
          this.lineID
        }`
      )
      this.socket.on('disconnect', err => {
        if (err === 'transport close') {
          this.$message({
            message: '服务器异常，连接断开',
            type: 'error'
          })
        }
      })
      this.socket.on('reconnecting', attemptNumber => {})
      this.socket.on('initData', data => {
        data.forEach(e => {
          e.createdAt = this.moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
        })
        this.data = data
      })
      this.socket.on('appendData', data => {
        console.log(data)
        data.createdAt = this.moment(data.createdAt).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        this.data.pop()
        this.data.unshift(data)
      })
    },
    clear() {
      this.lineID = ''
      this.initSocket()
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.data[rowIndex].result === 'ng') {
        return 'warning-row'
      } else if (this.data[rowIndex].result === 'pass') {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>

<style lang="less">
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.homePage {
  text-align: left;
  .el-table {
    margin-top: 10px;
  }
  .el-table th > .cell {
    color: #3b99fc;
  }
  .el-table .warning-row {
    color: #ff0000;
  }
  .el-table .success-row {
    color: #1a2b3c;
  }
}
</style>
