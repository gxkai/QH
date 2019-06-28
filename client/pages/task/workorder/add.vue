<template>
  <div>
    <el-form
      style="width: 420px;"
      :model="workorder"
      :rules="rules"
      ref="workorder"
    >
      <el-form-item label="工单编号" prop="sn">
        <el-input v-model="workorder.sn"></el-input>
      </el-form-item>
      <el-form-item label="计划开始时间" prop="planTime">
        <el-date-picker
          v-model="workorder.planTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="实际开始时间" prop="actualTime">
        <el-date-picker
          v-model="workorder.actualTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="排产量" prop="productionAmount">
        <el-input v-model="workorder.productionAmount"></el-input>
      </el-form-item>
      <el-form-item label="完成量" prop="completedAmount">
        <el-input v-model="workorder.completedAmount"></el-input>
      </el-form-item>
      <el-form-item label="不良数" prop="failedAmount">
        <el-input v-model="workorder.failedAmount"></el-input>
      </el-form-item>
    </el-form>
    <el-button @click="save" type="primary" :loading="loading">保存</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      workorder: {
        sn: '',
        materialSpec: '',
        planTime: '',
        actualTime: '',
        productionAmount: '',
        completedAmount: '',
        failedAmount: ''
      },
      rules: {
        materialSpec: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ]
      },
      loading: false,
      actions: {}
    }
  },
  watch: {},
  async created() {},
  methods: {
    async save() {
      const validated = await this.validate(this, 'workorder')
      if (!validated) {
        return
      }
      this.loading = true
      try {
        await this.$axios.post(
          `/api/v1/workorder`,
          Object.assign(this.workorder)
        )
        this.$message({
          message: '创建成功',
          type: 'success'
        })
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less"></style>
