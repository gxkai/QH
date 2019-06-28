<template>
  <div>
    <el-button slot="header" class="mb-5" @click="addRowWithNewTemplate">{{
      $t(`button.add`)
    }}</el-button>
    <el-button slot="header" class="mb-5" @click="getList()">{{
      $t(`button.search`)
    }}</el-button>
    <el-button slot="header" class="mb-5" @click="clear()">{{
      $t(`button.clear`)
    }}</el-button>
    <el-row slot="header" class="mt-5">
      <el-tag type="success"
        >{{ goodsSpecInfo.goods.name }} ({{ goodsSpecInfo.name }})</el-tag
      >
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
import GoodsSpec from '@/components/inventory/inventory/GoodsSpec'
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
          title: '物料',
          key: 'subGoodsSpec.goods.name'
        },
        {
          title: '规格',
          key: 'subGoodsSpec.name'
        },
        {
          title: '剂量',
          key: 'dosage'
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
      addTemplate: {
        subGoodsSpec: {
          title: '名称',
          value: '',
          component: {
            name: GoodsSpec
          }
        },
        dosage: {
          title: '剂量',
          value: '',
          component: {
            name: 'el-input-number',
            span: 12
          }
        }
      },
      addRules: {
        subGoodsSpec: [
          { required: true, message: '请选择物料', trigger: 'blur' }
        ],
        dosage: [{ required: true, message: '请输入剂量', trigger: 'blur' }]
      },
      formOptions: {
        labelWidth: '80px',
        labelPosition: 'left',
        saveLoading: false
      }
    }
  },
  async asyncData({ params, query, $axios }) {
    const { result } = await $axios.$get(`/api/v1/goodsSpec/${query.goodsSpec}`)
    return {
      goodsSpec: query.goodsSpec,
      goodsSpecInfo: result
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
      const { total, data } = await this.$axios.$get(`/api/v1/goodsBom`, {
        params: Object.assign(this.params, {
          pageSize: this.pagination.pageSize,
          currentPage: this.pagination.currentPage,
          goodsSpec: this.goodsSpec
        })
      })
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
      console.log(`edit`)
      console.log(row)
      try {
        this.formOptions.saveLoading = true
        await this.$axios.put(`/api/v1/goodsBom/${row._id}`, {
          goodsSpec: row.goodsSpec._id,
          subGoodsSpec: row.subGoodsSpec,
          dosage: row.dosage
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
        await this.$axios.$delete(`/api/v1/goodsBom/${row._id}`)
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
          `/api/v1/goodsBom`,
          Object.assign(row, { goodsSpec: this.goodsSpec })
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
