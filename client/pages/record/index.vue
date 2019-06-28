<template>
  <div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="80px" size="small">
      <el-form-item label="产品名称" prop="product" class="mb-5">
        <el-input
          v-model="ruleForm.product"
          :placeholder="$t(`placeholder.name`)"
          style="width: 200px;"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="选择时间" prop="time">
        <el-col :span="3.5">
          <el-date-picker
            type="datetime"
            placeholder="请选择开始时间"
            style="width: 100%;"
            v-model="ruleForm.time[0]"
          ></el-date-picker>
        </el-col>
        <el-col class="line" :span="1" style="width: 40px;text-align: center"
          >-</el-col
        >
        <el-col :span="3.5">
          <el-date-picker
            type="datetime"
            placeholder="请选择结束时间"
            style="width: 100%;"
            v-model="ruleForm.time[1]"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="getList()">{{
          $t(`button.search`)
        }}</el-button>
        <el-button size="small" @click="resetForm('ruleForm')">
          {{ $t(`button.clear`) }}</el-button
        >
      </el-form-item>
    </el-form>
    <d2-crud
      ref="d2Crud"
      :options="options"
      :columns="columns"
      :data="data"
      :pagination="pagination"
      edit-title="编辑"
      :edit-rules="addRules"
      add-title="新增"
      :add-rules="addRules"
      :form-options="formOptions"
      @dialog-open="handleDialogOpen"
      @row-edit="handleRowEdit"
      @row-remove="handleRowRemove"
      @row-add="handleRowAdd"
      @dialog-cancel="handleDialogCancel"
      @pagination-current-change="paginationCurrentChange"
    >
    </d2-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        product: '',
        time: []
      },
      options: {
        defaultSort: {
          prop: 'name',
          order: 'descending'
        }
      },
      columns: [
        {
          title: '产品名称',
          key: 'product'
        },
        {
          title: '所属产线',
          key: 'line'
        },
        {
          title: '物料名称',
          key: 'material'
        },
        {
          title: '物料用量',
          key: 'dosage'
        },
        {
          title: '负责人',
          key: 'operator'
        },
        {
          title: '生产状况',
          key: 'result'
        },
        {
          title: '不良原因',
          key: 'explanation'
        },
        {
          title: '创建时间',
          key: 'createdAt'
        }
      ],
      data: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      addRules: {},
      formOptions: {
        labelWidth: '80px',
        labelPosition: 'left',
        saveLoading: false
      }
    }
  },
  async asyncData({ $axios }) {
    const { result } = await $axios.$get('/api/v1/line', {
      params: { pagination: false }
    })
    let options = []
    result.forEach(e => {
      const { product: value, name } = e
      options.push({ value, label: `${value}(${name})` })
    })
    console.log('oooo', options)
  },
  async beforeMount() {
    this.getList()
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async getList() {
      const result = await this.$axios.$get(`/api/v1/productlog`, {
        params: Object.assign(
          {
            product: this.ruleForm.product,
            startTime: this.ruleForm.time[0],
            endTime: this.ruleForm.time[1]
          },
          {
            pageSize: this.pagination.pageSize,
            currentPage: this.pagination.currentPage
          }
        )
      })
      const { total, data } = result
      data.map(e => {
        e.updatedAt = this.moment(e.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        e.createdAt = this.moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss')
        Object.assign(e, {
          forbidEdit: false,
          showEditButton: true,
          forbidRemove: false,
          showRemoveButton: true
        })
      })
      this.data = data
      this.pagination.total = total
    },
    handleDialogOpen({ mode, row }) {},
    async handleRowEdit({ index, row }, done) {
      try {
        this.formOptions.saveLoading = true
        await this.$axios.put(`/api/v1/productlog/${row._id}`)
        this.$message({
          message: '编辑成功',
          type: 'success'
        })
        done()
        this.getList()
      } catch (e) {
        this.$message({
          message: '保存失败',
          type: 'error'
        })
      } finally {
        this.formOptions.saveLoading = false
      }
    },
    async handleRowRemove({ index, row }, done) {
      try {
        this.formOptions.saveLoading = true
        await this.$axios.$delete(`/api/v1/productlog/${row._id}`)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        done()
        this.getList()
      } catch (e) {
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      } finally {
        this.formOptions.saveLoading = false
      }
    },
    handleDialogCancel(done) {
      this.$message({
        message: '取消',
        type: 'warning'
      })
      done()
    },
    paginationCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage
      this.getList()
    },
    addRowWithNewTemplate() {
      this.$refs.d2Crud.showDialog({
        mode: 'add'
      })
    },
    async handleRowAdd(row, done) {
      console.log('rrrrrr', row)
      try {
        this.formOptions.saveLoading = true
        await this.$axios.post(`/api/v1/productlog`, row)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        done()
        this.getList()
      } catch (e) {
        this.$message({
          message: '保存失败',
          type: 'error'
        })
      } finally {
        this.formOptions.saveLoading = false
      }
    }
  }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
  .container {
    @apply min-h-screen flex justify-center items-center text-center mx-auto;
  }
  */
</style>
