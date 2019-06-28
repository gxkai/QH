<template>
  <div>
    <el-form :model="flow" :rules="rules" ref="flow" :inline="true">
      <el-form-item label="名称" prop="name">
        <el-input v-model="flow.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="flow.remark" disabled></el-input>
      </el-form-item>
    </el-form>
    <lux-node :nodes="nodes" :actions="actions" disabled="true"></lux-node>
    <el-dialog
      title="请选择插件"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-select v-model="toolId" placeholder="请选择插件" disabled>
        <el-option label="未设置" value=""></el-option>
        <el-option
          :label="$t(v.name)"
          :value="v._id"
          v-for="(v, k) in tools"
          :key="k"
        ></el-option>
      </el-select>
      <check-goods
        :params="{ taskInfo: taskInfo }"
        v-if="toolName === 'CheckGoods'"
        v-model="rule"
      />
    </el-dialog>
  </div>
</template>

<script>
import node from '@/bin/node'
export default {
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      loading: false,
      nodes: {
        children: [
          {
            id: 0,
            parent: null,
            name: 'start',
            before: [],
            after: [],
            children: [],
            focus: false,
            active: false,
            edit: false
          }
        ]
      },
      actions: {},
      tools: [],
      dialogFormVisible: false,
      formLabelWidth: '120px',
      toolName: '',
      toolId: '',
      tool: '',
      seat: '',
      comp: '',
      type: '',
      rule: ''
    }
  },
  watch: {
    async toolId(n) {
      if (n) {
        let { result } = await this.$axios.$get(`/api/v1/tool/${n}`)
        this.toolName = result.name
      } else {
        this.toolName = n
      }
    }
  },
  async asyncData({ query, params, $axios }) {
    const { result: taskInfo } = await $axios.$get(`/api/v1/task/${query.task}`)
    let { data: tools } = await $axios.$get('/api/v1/tool')
    console.info(taskInfo)
    return {
      task: query.task,
      taskInfo: taskInfo,
      goodsSpecInfo: taskInfo.workorder.goodsSpec,
      goodsSpec: taskInfo.workorder.goodsSpec._id,
      tools: tools,
      flowId: query._id,
      flow: {
        flowType: '',
        name: `${taskInfo.workorder.goodsSpec.goods.name}-${
          taskInfo.workorder.goodsSpec.name
        }`,
        remark: '',
        status: 'FLOW_EDIT',
        task: query.task,
        goodsSpec: taskInfo.workorder.goodsSpec._id
      }
    }
  },
  async created() {
    let { flow, nodes } = await this.$axios.$get(`/api/v1/flow/${this.flowId}`)
    this.flow = flow
    this.nodes.children = node.encode(nodes)
    let app = this
    app.actions = {
      addTool: (seat, comp) => {
        app.seat = seat
        app.comp = comp
        this.dialogFormVisible = true
        this.type = 'ADD'
      },
      editTool: (tool, seat, index, comp) => {
        app.seat = seat
        app.comp = comp
        this.tool = tool.tool
        app.toolId = tool.tool._id
        app.rule = tool.rule
        this.dialogFormVisible = true
        this.type = 'EDIT'
      }
    }
  },
  methods: {
    async confirmDialog() {
      switch (this.type) {
        case 'ADD':
          if (this.toolId !== '') {
            let { result } = await this.$axios.$get(
              `/api/v1/tool/${this.toolId}`
            )
            let index = this.seat.findIndex(e => e.tool._id === this.toolId)
            if (index === -1) {
              this.seat.push({ tool: result, rule: this.rule })
            }
          }
          this.comp.reSelect()
          this.dialogFormVisible = false
          this.tool = ''
          this.toolId = ''
          this.rule = ''
          break
        case 'EDIT':
          let index = this.seat.findIndex(e => e.tool._id === this.tool._id)
          if (this.toolId !== '') {
            let { result } = await this.$axios.$get(
              `/api/v1/tool/${this.toolId}`
            )
            this.seat[index] = { tool: result, rule: this.rule }
          } else {
            this.seat.splice(index, 1)
          }
          this.comp.reSelect()
          this.dialogFormVisible = false
          this.tool = ''
          this.toolId = ''
          this.rule = ''
          break
        default:
          break
      }
    },
    cancelDialog() {
      this.dialogFormVisible = false
    },
    handleClose(done) {
      this.tool = ''
      this.toolId = ''
      this.rule = ''
      done()
    },
    async save() {
      const validated = await this.validate(this, 'flow')
      if (!validated) {
        return
      }
      console.log(this.nodes)
      let data = node.decode(this.nodes)
      console.log(data)
      this.loading = true
      try {
        await this.$axios.put(
          `/api/v1/flow/${this.flowId}`,
          Object.assign(this.flow, { nodes: data })
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
