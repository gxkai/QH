<template>
  <div class="app-container">
    <upload-excel-component
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />
    <!--<el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">-->
    <!--<el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />-->
    <!--</el-table>-->
    {{ progress }}
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      progress: '0%'
    }
  },
  methods: {
    async beforeUpload(file) {
      console.log(file)
      const form = new FormData()
      form.append('file', file)
      const config = {
        onUploadProgress: progressEvent => {
          if (progressEvent.lengthComputable) {
            const rate = progressEvent.loaded / progressEvent.total
            if (rate < 1) {
              this.progress = rate * 100 + '%'
            }
          }
        }
      }

      await this.$axios.post(`/api/v1/bom`, form, config)
      this.progress = '100%'
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    }
  }
}
</script>
