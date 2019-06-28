<template>
  <div class="mt-5">
    <el-button slot="header" class="mb-5" @click="addRowWithNewTemplate">{{
      $t(`button.add`)
    }}</el-button>
    <el-row slot="header" class="mb-5 w-1/6 mt-5">
      <el-input v-model="params.name" :placeholder="$t(`placeholder.name`)">
      </el-input>
    </el-row>
    <el-button slot="header" class="mb-5" @click="getList()">{{
      $t(`button.search`)
    }}</el-button>
    <el-button slot="header" class="mb-5" @click="clear()">{{
      $t(`button.clear`)
    }}</el-button>
    <el-row slot="header" class="mt-5" v-if="taskInfo">
      <el-tag type="success">{{
        `${taskInfo.line.workshop.factory.company.name}-${
          taskInfo.line.workshop.factory.name
        }-${taskInfo.line.workshop.name}-${taskInfo.line.name}`
      }}</el-tag>
    </el-row>
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
      @edit-emit="editRowWithNewTemplate"
      @delete-emit="deleteRowWithNewTemplate"
      @info-emit="infoRowWithNewTemplate"
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
          title: '名称',
          key: 'flow.name'
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
        name: ''
      },
      rowHandle: {
        columnHeader: '操作',
        width: '300',
        custom: [
          {
            icon: 'el-icon-edit',
            text: '编辑',
            size: 'small',
            emit: 'edit-emit'
          },
          {
            icon: 'el-icon-delete',
            text: '删除',
            size: 'small',
            type: 'danger',
            emit: 'delete-emit'
          },
          {
            icon: 'el-icon-info',
            text: '查看',
            size: 'small',
            type: 'primary',
            emit: 'info-emit'
          }
        ]
      },
      editTemplate: {
        name: {
          title: '名称',
          value: ''
        },
        forbidEdit: {
          title: '禁用按钮',
          value: false,
          component: {
            show: false
          }
        },
        showEditButton: {
          title: '显示按钮',
          value: true,
          component: {
            show: false
          }
        }
      },
      addTemplate: {
        name: {
          title: '名称',
          value: ''
        }
      },
      addRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        content: [{ required: true, message: '请设定流程', trigger: 'blur' }]
      },
      formOptions: {
        labelWidth: '80px',
        labelPosition: 'left',
        saveLoading: false
      }
    }
  },
  async asyncData({ query, params, $axios }) {
    const { result } = await $axios.$get(`/api/v1/task/${query.task}`)
    console.log(result)
    return {
      task: query.task,
      taskInfo: result
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
      const result = await this.$axios.$get(`/api/v1/taskFlow`, {
        params: Object.assign(this.params, {
          pageSize: this.pagination.pageSize,
          currentPage: this.pagination.currentPage,
          task: this.task
        })
      })
      const { total, data } = result
      data.map(e => {
        e.updatedAt = this.moment(e.updatedAt).format('YYYY-MM-DD HH:mm:ss')
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
      this.$router.push({ path: `/flow/flow/edit`, query: { _id: row._id } })
      console.log(`edit`)
      console.log(row)
      try {
        this.formOptions.saveLoading = true
        await this.$axios.put(`/api/v1/flow/${row._id}`, { name: row.name })
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
        await this.$axios.$delete(`/api/v1/flow/${row._id}`)
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
      this.$router.push({
        path: `/task/workorder/task/flow/add`,
        query: { task: this.task }
      })
    },
    editRowWithNewTemplate({ index, row }) {
      this.$router.push({
        path: `/task/workorder/task/flow/edit`,
        query: { task: this.task, _id: row.flow._id }
      })
    },
    infoRowWithNewTemplate({ index, row }) {
      this.$router.push({
        path: `/task/workorder/task/flow/info`,
        query: { task: this.task, _id: row.flow._id }
      })
    },
    deleteRowWithNewTemplate({ index, row }) {
      this.$confirm('确定删除吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          console.log(`delete`)
          console.log(row)
          try {
            this.formOptions.saveLoading = true
            await this.$axios.$delete(`/api/v1/taskFlow/${row._id}`)
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
      console.log(`add`)
      console.log(row)
      try {
        this.formOptions.saveLoading = true
        await this.$axios.post(`/api/v1/flow`, row)
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
