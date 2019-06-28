<template>
  <div class="mt-5">
    <el-button slot="header" class="mb-5" @click="addRowWithNewTemplate">{{
      $t(`button.add`)
    }}</el-button>
    <el-row slot="header" class="mb-5 w-1/6 mt-5">
      <el-input
        v-model="params.name"
        :placeholder="$t(`placeholder.name`)"
      ></el-input>
    </el-row>
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
    >
    </d2-crud>
  </div>
</template>

<script>
import MyTag from '@/components/tool/tool/MyTag'
import MyTag1 from '@/components/tool/tool/MyTag1'
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
          key: '$name'
        },
        {
          title: '图标',
          key: 'icon',
          component: {
            name: MyTag1
          }
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
        icon: ''
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
      addTemplate: {
        name: {
          title: '名称',
          value: '',
          component: {
            name: 'el-select',
            options: [
              {
                value: 'CheckGoods',
                label: this.$t('CheckGoods')
              }
            ]
          }
        },
        icon: {
          title: '图标',
          value: '',
          component: {
            name: MyTag
          }
        }
      },
      addRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        icon: [{ required: true, message: '请选择图标', trigger: 'blur' }]
      },
      formOptions: {
        labelWidth: '80px',
        labelPosition: 'left',
        saveLoading: false
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    clear() {
      for (let key in this.params) {
        this.params[key] = ''
      }
    },
    async getList() {
      const result = await this.$axios.$get(`/api/v1/tool`, {
        params: Object.assign(this.params, {
          pageSize: this.pagination.pageSize,
          currentPage: this.pagination.currentPage
        })
      })
      const { total, data } = result
      data.map(e => {
        e.updatedAt = this.moment(e.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        e.$name = this.$t(e.name)
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
      console.log(`edit`)
      console.log(row)
      try {
        this.formOptions.saveLoading = true
        await this.$axios.put(`/api/v1/tool/${row._id}`, {
          name: row.name,
          icon: row.icon
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
      console.log(`delete`)
      console.log(row)
      try {
        this.formOptions.saveLoading = true
        await this.$axios.$delete(`/api/v1/tool/${row._id}`)
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
      console.log(row)
      try {
        this.formOptions.saveLoading = true
        await this.$axios.post(`/api/v1/tool`, row)
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
