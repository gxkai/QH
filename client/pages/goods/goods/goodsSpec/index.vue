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
    <el-row slot="header" class="mt-5">
      <el-tag type="success">{{ goodsInfo.name }}</el-tag>
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
      @bom-emit="handleBomBind"
    >
    </d2-crud>
  </div>
</template>

<script>
import I from '@/components/goods/goodsSpec/I'
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
          title: '编号',
          key: 'code'
        },
        {
          title: '级别',
          key: 'I'
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
        width: '400',
        custom: [
          {
            text: '绑物料',
            size: 'small',
            type: 'primary',
            emit: 'bom-emit',
            show(index, row) {
              if (row.showGoodsButton) {
                return true
              }
              return false
            },
            disabled(index, row) {
              if (row.forbidGoods) {
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
      addTemplate: {
        name: {
          title: '名称',
          value: ''
        },
        code: {
          title: '编号',
          value: ''
        },
        I: {
          title: '级别',
          value: 1,
          component: {
            name: I
          }
        }
      },
      addRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        I: [{ required: true, message: '请选择级别', trigger: 'blur' }]
      },
      formOptions: {
        labelWidth: '80px',
        labelPosition: 'left',
        saveLoading: false
      },
      goods: '',
      goodsInfo: {}
    }
  },
  async beforeMount() {
    this.goods = this.$route.query.goods
    this.getList()
    this.getGoods()
  },
  methods: {
    clear() {
      for (let key in this.params) {
        this.params[key] = ''
      }
    },
    async getGoods() {
      const { result } = await this.$axios.$get(`/api/v1/goods/${this.goods}`)
      this.goodsInfo = result
    },
    async getList() {
      const result = await this.$axios.$get(`/api/v1/goodsSpec`, {
        params: Object.assign(this.params, {
          pageSize: this.pagination.pageSize,
          currentPage: this.pagination.currentPage,
          goods: this.goods
        })
      })
      const { total, data } = result
      data.map(e => {
        e.updatedAt = this.moment(e.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        e.$NOH = this.$t(e.NOH)
        e.$type = this.$t(e.type)
        Object.assign(e, {
          forbidEdit: false,
          showEditButton: true,
          forbidRemove: false,
          showRemoveButton: true,
          showGoodsButton: e.goods.type === 'GOODS_FINISHED',
          forbidGoods: false
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
        await this.$axios.put(`/api/v1/goodsSpec/${row._id}`, {
          name: row.name
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
        await this.$axios.$delete(`/api/v1/goodsSpec/${row._id}`)
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
        await this.$axios.post(
          `/api/v1/goodsSpec`,
          Object.assign(row, { goods: this.goods })
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
    },
    async handleBomBind({ row, index }) {
      this.$router.push({
        path: `/goods/goods/goodsSpec/goodsBom`,
        query: { goodsSpec: row._id }
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
