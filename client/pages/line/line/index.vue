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
      @flow-bind="handleFlowBind"
      @flow-edit="handleFlowEdit"
    >
    </d2-crud>
  </div>
</template>

<script>
import MyTag from '@/components/line/line/Mytag'

export default {
  components: {
    MyTag
  },
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
          title: '名称',
          key: 'name'
        },
        {
          title: '产品',
          key: 'product'
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
        name: '',
        company: '',
        factory: '',
        workshop: ''
      },
      rowHandle: {
        columnHeader: '操作',
        width: '300',
        custom: [
          {
            text: '绑流程',
            size: 'small',
            type: 'primary',
            emit: 'flow-bind',
            show(index, row) {
              if (row.showFlowBindButton) {
                return true
              }
              return false
            },
            disabled(index, row) {
              if (row.forbidFlowBind) {
                return true
              }
              return false
            }
          },
          {
            text: '编辑流程',
            size: 'small',
            type: 'primary',
            emit: 'flow-edit',
            show(index, row) {
              if (row.showFlowEditButton) {
                return true
              }
              return false
            },
            disabled(index, row) {
              if (row.forbidFlowEdit) {
                return true
              }
              return false
            }
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
      formOptions: {
        labelWidth: '80px',
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
        name: {
          title: '名称',
          value: ''
        },
        product: {
          title: '产品',
          value: '',
          component: {
            name: 'el-select',
            options: options
          }
        }
      },
      addRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        product: [{ required: true, message: '请选择产品', trigger: 'blur' }]
      }
    }
  },
  async beforeMount() {
    this.getList()
  },
  methods: {
    clear() {
      console.log(this.params)
      for (let key in this.params) {
        this.params[key] = ''
      }
    },
    async getList() {
      const { total, data } = await this.$axios.$get(`/api/v1/line`, {
        params: Object.assign(this.params, {
          pageSize: this.pagination.pageSize,
          currentPage: this.pagination.currentPage
        })
      })
      data.map(e => {
        e.updatedAt = this.moment(e.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        Object.assign(e, {
          forbidEdit: false,
          showEditButton: true,
          forbidRemove: false,
          showRemoveButton: true,
          forbidFlowBind: false,
          showFlowBindButton: !e.flow,
          forbidFlowEdit: false,
          showFlowEditButton: e.flow
        })
      })
      this.data = data
      this.pagination.total = total
    },
    handleDialogOpen({ mode, row }) {},
    async handleRowEdit({ index, row }, done) {
      try {
        this.formOptions.saveLoading = true
        await this.$axios.put(`/api/v1/line/${row._id}`, row)
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
        await this.$axios.$delete(`/api/v1/line/${row._id}`)
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
        await this.$axios.post(`/api/v1/line`, row)
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
    },
    handleFlowBind({ row, index }) {
      this.$router.push({
        path: '/line/line/flow/add',
        query: { line: row._id }
      })
    },
    handleFlowEdit({ row, index }) {
      this.$router.push({
        path: '/line/line/flow/edit',
        query: { flowId: row.flow._id, goodsSpecId: row.goodsSpec._id }
      })
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
