<template>
  <div>
    <el-form :model="flow" :rules="rules" ref="flow" :inline="true">
      <el-form-item label="名称" prop="name">
        <el-input v-model="flow.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="flow.remark"></el-input>
      </el-form-item>
      <!--<el-form-item label="状态" prop="status">-->
      <!--<el-select v-model="flow.status" placeholder="请选择状态">-->
      <!--<el-option :label="$t(`FLOW_EDIT`)" value="FLOW_EDIT"></el-option>-->
      <!--<el-option :label="$t(`FLOW_OPEN`)" value="FLOW_OPEN"></el-option>-->
      <!--<el-option-->
      <!--:label="$t(`FLOW_FORBIDDEN`)"-->
      <!--value="FLOW_FORBIDDEN"-->
      <!--&gt;</el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
    </el-form>
    <lux-node :nodes="nodes" :actions="actions"></lux-node>
    <el-button @click="save" type="primary" :loading="loading">保存</el-button>
    <el-dialog
      title="请选择插件"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-select v-model="toolId" placeholder="请选择插件">
        <el-option label="未设置" value=""></el-option>
        <el-option
          :label="$t(v.name)"
          :value="v._id"
          v-for="(v, k) in tools"
          :key="k"
        ></el-option>
      </el-select>
      <check-goods
        :params="{ lineInfo: lineInfo }"
        v-if="toolName === 'CheckGoods'"
        v-model="rule"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click="confirmDialog">确 定</el-button>
      </div>
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
    const { result: lineInfo } = await $axios.$get(`/api/v1/line/${query.line}`)
    console.info(lineInfo)
    return {
      line: query.line,
      lineInfo: lineInfo,
      goodsSpecInfo: lineInfo.goodsSpec,
      goodsSpec: lineInfo.goodsSpec._id,
      flow: {
        flowType: '',
        name: `${lineInfo.goodsSpec.goods.name}-${lineInfo.goodsSpec.name}`,
        remark: '',
        status: 'FLOW_EDIT',
        line: query.line,
        goodsSpec: lineInfo.goodsSpec._id
      }
    }
  },
  async created() {
    let { data: tools } = await this.$axios.$get('/api/v1/tool')
    this.tools = tools
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
          this.toolId = ''
          this.tool = ''
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
          this.toolId = ''
          this.tool = ''
          this.rule = ''
          break
        default:
          break
      }
    },
    cancelDialog() {
      this.dialogFormVisible = false
      this.toolId = ''
      this.tool = ''
      this.rule = ''
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
        await this.$axios.post(
          `/api/v1/flow`,
          Object.assign(this.flow, { nodes: data })
        )
        this.$message({
          message: '创建成功',
          type: 'success'
        })
        this.$router.go(-1)
      } catch (e) {
        this.$message({
          message: '创建失败',
          type: 'error'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less"></style>
