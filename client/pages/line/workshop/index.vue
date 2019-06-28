<template>
  <div class="mt-5">
    <el-button slot="header" class="mb-5" @click="addRowWithNewTemplate">{{
      $t(`button.add`)
    }}</el-button>
    <el-row slot="header" class="mb-5 w-1/6 mt-5">
      <el-input v-model="params.name" :placeholder="$t(`placeholder.name`)">
      </el-input>
    </el-row>
    <my-tag1 v-model="params.factory" class="mb-5" />
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
      :edit-template="editTemplate"
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
import MyTag from '@/components/line/factory/Mytag'
import MyTag1 from '@/components/line/workshop/Mytag1'
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
          title: '名称',
          key: 'name'
        },
        {
          title: '公司',
          key: 'factory.company.name'
        },
        {
          title: '工厂',
          key: 'factory.name'
        },
        {
          title: '状态',
          key: '_status'
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
        factory: ''
      },
      rowHandle: {
        columnHeader: '操作',
        width: '300',
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
      editTemplate: {
        name: {
          title: '名称',
          value: ''
        },
        factory: {
          title: '工厂',
          value: ' ',
          component: {
            name: MyTag1
          }
        }
      },
      addTemplate: {
        factory: {
          title: '工厂',
          value: '',
          component: {
            name: MyTag1
          }
        },
        name: {
          title: '名称',
          value: ''
        }
      },
      addRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        factory: [{ required: true, message: '请选择产线', trigger: 'blur' }],
        company: [{ required: true, message: '请选择公司', trigger: 'blur' }]
      },
      formOptions: {
        labelWidth: '80px',
        labelPosition: 'left',
        saveLoading: false
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
      const result = await this.$axios.$get(`/api/v1/workshop`, {
        params: Object.assign(this.params, {
          pageSize: this.pagination.pageSize,
          currentPage: this.pagination.currentPage
        })
      })
      console.log(`workshopResult:${result}`)
      const { total, data } = result
      data.map(e => {
        e.updatedAt = this.moment(e.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        e._status = this.$t(e.status)
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
    handleDialogOpen({ mode, row }) {
      console.log(`mode:`)
      console.log(mode)
      console.log(`row:`)
      console.log(row)
    },
    async handleRowEdit({ index, row }, done) {
      console.log(`edit`)
      console.log(row)
      try {
        this.formOptions.saveLoading = true
        await this.$axios.put(`/api/v1/workshop/${row._id}`, {
          name: row.name,
          factory: row.factory
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
      console.log('rrrrrr', row)
      try {
        this.formOptions.saveLoading = true
        await this.$axios.$delete(`/api/v1/workshop/${row._id}`)
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
      console.log(`add`)
      console.log('rrrrr', row)
      try {
        this.formOptions.saveLoading = true
        await this.$axios.post(`/api/v1/workshop`, row)
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
