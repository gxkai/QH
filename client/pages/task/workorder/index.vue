<template>
  <div class="mt-5">
    <el-button slot="header" class="mb-5" @click="addRowWithNewTemplate">{{
      $t(`button.add`)
    }}</el-button>
    <el-button slot="header" class="mb-5" @click="getList()">{{
      $t(`button.search`)
    }}</el-button>
    <el-button slot="header" class="mb-5" @click="clear()">{{
      $t(`button.clear`)
    }}</el-button>
    <d2-crud
      ref="d2Crud"
      :options="options"
      :columns="columns"
      :data="data"
      :pagination="pagination"
      :row-handle="rowHandle"
      edit-title="编辑"
      :edit-template="addTemplate"
      :edit-rules="addRules"
      add-title="新增"
      :add-template="addTemplate"
      :add-rules="addRules"
      :form-options="formOptions"
      @dialog-open="handleDialogOpen"
      @row-edit="handleRowEdit"
      @row-remove="handleRowRemove"
      @row-add="handleRowAdd"
      @dialog-cancel="handleDialogCancel"
      @pagination-current-change="paginationCurrentChange"
      @task-emit="handleTaskList"
    >
    </d2-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {
        defaultSort: {
          prop: 'name',
          order: 'descending'
        }
      },
      columns: [
        {
          title: '工单编号',
          key: 'sn'
        },
        {
          title: '专案',
          key: 'caseName'
        },
        {
          title: '产品',
          key: 'product'
        },
        {
          title: '排产量',
          key: 'productionAmount'
        },
        {
          title: '完成量',
          key: 'completedAmount'
        },
        {
          title: '不良数',
          key: 'failedAmount'
        },
        {
          title: '最后修改时间',
          key: 'updatedAt'
        }
      ],
      data: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      params: {},
      rowHandle: {
        columnHeader: '操作',
        width: '400',
        custom: [
          {
            text: '绑产线',
            size: 'small',
            type: 'primary',
            emit: 'task-emit'
          }
        ],
        edit: {
          icon: 'el-icon-edit',
          text: '编辑',
          size: 'small',
          show(index, row) {
            if (row.showEditButton) {
              return true
            }
            return false
          },
          disabled(index, row) {
            if (row.forbidEdit) {
              return true
            }
            return false
          }
        },
        remove: {
          icon: 'el-icon-delete',
          size: 'small',
          fixed: 'right',
          confirm: true,
          show(index, row) {
            if (row.showRemoveButton) {
              return true
            }
            return false
          },
          disabled(index, row) {
            if (row.forbidRemove) {
              return true
            }
            return false
          }
        }
      },
      addRules: {},
      formOptions: {
        labelWidth: '100px',
        labelPosition: 'left',
        saveLoading: false
      }
    }
  },
  async asyncData({ $axios }) {
    const { result } = await $axios.$get('/api/v1/bom', {
      params: { pagination: false }
    })
    let options = []
    result.forEach(e => {
      const { materialNo: value } = e
      options.push({ value, label: value })
    })
    return {
      addTemplate: {
        product: {
          title: '产品',
          value: '',
          component: {
            name: 'el-select',
            options: options
          }
        },
        productionAmount: {
          title: '排产量',
          value: '',
          component: {
            name: 'el-input-number',
            span: 10
          }
        }
      }
    }
  },
  async beforeMount() {
    this.getList()
  },
  methods: {
    clear() {
      for (let key in this.params) {
        this.params[key] = ''
      }
    },
    async getList() {
      const result = await this.$axios.$get(`/api/v1/workorder`, {
        params: Object.assign(this.params, {
          pageSize: this.pagination.pageSize,
          currentPage: this.pagination.currentPage
        })
      })
      const { total, data } = result
      data.map(e => {
        e.updatedAt = this.moment(e.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        e.planTime = this.moment(e.planTime).format('YYYY-MM-DD HH:mm:ss')
        e.actualTime = this.moment(e.actualTime).format('YYYY-MM-DD HH:mm:ss')
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
        await this.$axios.put(`/api/v1/workorder/${row._id}`, row)
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
        await this.$axios.$delete(`/api/v1/workorder/${row._id}`)
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
    handleTaskList({ row, index }) {
      this.$router.push({
        path: '/task/workorder/task',
        query: { workorderId: row._id }
      })
    },
    deleteRowWithNewTemplate({ index, row }) {
      this.$confirm('确定删除吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            this.formOptions.saveLoading = true
            await this.$axios.$delete(`/api/v1/workorder/${row._id}`)
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          } catch (e) {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          } finally {
            this.formOptions.saveLoading = false
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async handleRowAdd(row, done) {
      try {
        this.formOptions.saveLoading = true
        await this.$axios.post(`/api/v1/workorder`, row)
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
.el-form-item__label {
}
.el-input {
  margin-right: 15px;
}
</style>
