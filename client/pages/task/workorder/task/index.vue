<template>
  <div class="mt-5">
    <el-button slot="header" class="mb-5" @click="addRowWithNewTemplate">{{
      $t(`button.add`)
    }}</el-button>
    <el-row slot="header" class="mt-5" v-if="workorder">
      <el-tag type="success">{{ `工单${workorder.sn} ` }}</el-tag>
    </el-row>
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
          title: '编号',
          key: 'sn'
        },
        {
          title: '产线名称',
          key: 'line.name'
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
      params: {
        sn: '',
        line: '',
        workshop: '',
        factory: ''
      },
      rowHandle: {
        columnHeader: '操作',
        width: '400',
        custom: [],
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
      addRules: {
        line: [{ required: true, message: '请选择产线', trigger: 'blur' }]
      },
      formOptions: {
        labelWidth: '80px',
        labelPosition: 'left',
        saveLoading: false
      }
    }
  },
  async asyncData({ query, params, $axios }) {
    const { result: workorder } = await $axios.$get(
      `/api/v1/workorder/${query.workorderId}`
    )
    const { result: lines } = await $axios.$get(`/api/v1/line`, {
      params: {
        product: workorder.product,
        pagination: false
      }
    })
    let $lines = []
    for (let v of lines) {
      $lines.push({
        value: v._id,
        label: v.name
      })
    }
    return {
      workorderId: query.workorderId,
      workorder: workorder,
      addTemplate: {
        line: {
          title: '产线名称',
          value: '',
          component: {
            name: 'el-select',
            options: $lines
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
      const result = await this.$axios.$get(`/api/v1/task`, {
        params: Object.assign(this.params, {
          pageSize: this.pagination.pageSize,
          currentPage: this.pagination.currentPage,
          workorder: this.workorder._id
        })
      })
      const { total, data } = result
      data.map(e => {
        e.updatedAt = this.moment(e.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        Object.assign(e, {
          forbidEdit: false,
          showEditButton: true,
          forbidRemove: false,
          showRemoveButton: true,
          showGoodsButton: true,
          forbidGoods: false
        })
      })
      this.data = data
      this.pagination.total = total
    },
    handleDialogOpen({ mode, row }) {},
    async handleRowEdit({ index, row }, done) {
      try {
        this.formOptions.saveLoading = true
        await this.$axios.put(`/api/v1/task/${row._id}`, {
          sn: row.sn,
          line: row.line,
          factory: row.factory,
          workshop: row.workshop,
          workorder: row.workorder,
          planTime: row.planTime,
          actualTime: row.actualTime,
          productionAmount: row.productionAmount
        })
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
        await this.$axios.$delete(`/api/v1/task/${row._id}`)
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
      try {
        this.formOptions.saveLoading = true
        await this.$axios.post(
          `/api/v1/task`,
          Object.assign(row, { workorder: this.workorder._id })
        )
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
