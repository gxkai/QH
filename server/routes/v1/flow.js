const {
  request,
  summary,
  body,
  tags,
  middlewares,
  path,
  description,
  query,
  deprecated,
  tagsAll,
  middlewaresAll,
  queryAll,
  deprecatedAll
} = require('koa-swagger-decorator')

@tagsAll(['Flow'])
class FlowRouter {
  @request('POST', '/flow')
  @summary('create')
  @description('create')
  @body({
    name: { type: 'string', required: true },
    remark: { type: 'string', required: true },
    status: { type: 'string', required: true },
    goodsSpec: { type: 'string', required: true },
    line: { type: 'string', required: true },
    nodes: { type: 'object', required: true }
  })
  static async create(ctx) {
    const { app } = ctx
    const { name, remark, status, goodsSpec, line, nodes } = ctx.validatedBody
    const { _id: flow } = await app.db.model.Flow.create({
      name,
      remark,
      status,
      goodsSpec
    })
    await app.db.model.Line.findByIdAndUpdate(line, { flow })
    for (let v of nodes) {
      const { I, L, R, after, before, name } = v
      const { _id: flowNode } = await app.db.model.FlowNode.create({
        I,
        L,
        R,
        name,
        flow
      })
      for (let k in before) {
        const rule = before[k].rule
        const { _id: tool, name: type } = before[k].tool
        const { _id: flowTool } = await app.db.model.FlowTool.create({
          flowNode,
          sort: k,
          seat: 0,
          tool
        })
        await app.db.model.CheckRule.create({
          type,
          flowTool,
          rule
        })
      }
      for (let k in after) {
        const rule = after[k].rule
        const { _id: tool, name: type } = after[k].tool
        const { _id: flowTool } = await app.db.model.FlowTool.create({
          flowNode,
          sort: k,
          seat: 1,
          tool
        })
        await app.db.model.CheckRule.create({
          type,
          flowTool,
          rule
        })
      }
    }
    ctx.body = flow
    ctx.status = 200
  }
  @request('PUT', '/flow/{id}')
  @summary('update')
  @description('update')
  @body({
    name: { type: 'string', required: true },
    remark: { type: 'string', required: true },
    status: { type: 'string', required: true },
    nodes: { type: 'object', required: true }
  })
  @path({
    id: { type: 'string', required: true }
  })
  static async update(ctx) {
    const { app } = ctx
    const { id: flow } = ctx.validatedParams
    const { name, remark, status, nodes } = ctx.validatedBody
    await app.db.model.Flow.findByIdAndUpdate(flow, { name, remark, status })
    console.info('1--------')
    console.info(nodes)
    for (let v of nodes) {
      const { _id, I, L, R, after, before, name } = v
      if (!_id) {
        const { _id: flowNode } = await app.db.model.FlowNode.create({
          I,
          L,
          R,
          name,
          flow
        })
        for (let k in before) {
          const rule = before[k].rule
          const { _id: tool, name: type } = before[k].tool
          const { _id: flowTool } = await app.db.model.FlowTool.create({
            flowNode,
            sort: k,
            seat: 0,
            tool
          })
          await app.db.model.CheckRule.create({
            type,
            flowTool,
            rule
          })
        }
        for (let k in after) {
          const rule = after[k].rule
          const { _id: tool, name: type } = after[k].tool
          const { _id: flowTool } = await app.db.model.FlowTool.create({
            flowNode,
            sort: k,
            seat: 1,
            tool
          })
          await app.db.model.CheckRule.create({
            type,
            flowTool,
            rule
          })
        }
      } else {
        let flowTools = await app.db.model.FlowTool.find({ flowNode: _id })
        let beforeTools = flowTools
          .filter(e => e.seat === 0)
          .sort((a, b) => a.sort - b.sort)
        let afterTools = flowTools
          .filter(e => e.seat === 1)
          .sort((a, b) => a.sort - b.sort)
        console.info(2222222222222222)
        console.info(beforeTools)
        console.info(before)
        for (let v of beforeTools) {
          let exist = before.some(
            e => e.tool._id.toString() === v.tool.toString()
          )
          if (!exist) {
            console.log('1111')
            await app.db.model.FlowTool.deleteById(v._id)
          }
        }
        for (let v of afterTools) {
          let exist = after.some(
            e => e.tool._id.toString() === v.tool.toString()
          )
          if (!exist) {
            console.log('1111')
            await app.db.model.FlowTool.deleteById(v._id)
          }
        }
        const { _id: flowNode } = await app.db.model.FlowNode.findByIdAndUpdate(
          _id,
          {
            I,
            L,
            R,
            name,
            flow
          }
        )
        console.info('---------------------')
        console.info(before)
        console.info(after)
        for (let k in before) {
          const rule = before[k].rule
          const { _id: tool, name: type } = before[k].tool
          let $flowTool = await app.db.model.FlowTool.findOneAndUpdate(
            { flowNode, tool, seat: 0 },
            { sort: k }
          )
          if (!$flowTool) {
            $flowTool = await app.db.model.FlowTool.create({
              flowNode,
              tool,
              seat: 0,
              sort: k
            })
          }
          let flowToolId = $flowTool._id
          const $checkRule = await app.db.model.CheckRule.findOneAndUpdate(
            { flowTool: flowToolId },
            {
              type,
              rule
            }
          )
          if (!$checkRule) {
            await app.db.model.CheckRule.create({
              flowTool: flowToolId,
              type,
              rule
            })
          }
        }
        for (let k in after) {
          const rule = after[k].rule
          const { _id: tool, name: type } = after[k].tool
          let $flowTool = await app.db.model.FlowTool.findOneAndUpdate(
            { flowNode, tool, seat: 1 },
            { sort: k }
          )
          if (!$flowTool) {
            $flowTool = await app.db.model.FlowTool.create({
              flowNode,
              tool,
              seat: 1,
              sort: k
            })
          }
          let flowToolId = $flowTool._id
          const $checkRule = await app.db.model.CheckRule.findOneAndUpdate(
            { flowTool: flowToolId },
            {
              type,
              rule
            }
          )
          if (!$checkRule) {
            await app.db.model.CheckRule.create({
              flowTool: flowToolId,
              type,
              rule
            })
          }
        }
      }
    }
    ctx.body = null
    ctx.status = 200
  }
  @request('DELETE', '/flow/{id}')
  @summary('delete')
  @description('delete')
  @path({
    id: { type: 'string', required: true }
  })
  static async delete(ctx) {
    const { app } = ctx
    const { id } = ctx.validatedParams
    const result = await app.db.model.Flow.deleteById(id)
    ctx.body = { result }
    ctx.status = 200
  }
  @request('GET', '/flow')
  @summary('findPage')
  @description('findPage')
  @query({
    pageSize: { type: Number, required: false, default: 15 },
    currentPage: { type: Number, required: false, default: 1 }
  })
  static async findPage(ctx) {
    const { app } = ctx
    const [data, total] = await Promise.all([
      app.dao.flow.findPage(ctx.validatedQuery),
      app.dao.flow.findPageCount(ctx.validatedQuery)
    ])
    ctx.body = { total, data }
    ctx.status = 200
  }
  @request('GET', '/flow/{id}')
  @summary('findOne')
  @description('findOne')
  @path({ id: { type: 'string', required: true } })
  static async findOne(ctx) {
    const { app } = ctx
    const { id: flowId } = ctx.validatedParams
    const flow = await app.db.model.Flow.findById(flowId)
    let result = await app.db.model.FlowNode.find({ flow: flowId })
    let nodes = []
    for (let v of result) {
      const { _id: flowNodeId } = v
      let flowTools = await app.db.model.FlowTool.find({
        flowNode: flowNodeId,
        deleted: false
      })
      let before = []
      let after = []
      let beforeTools = flowTools
        .filter(e => e.seat === 0)
        .sort((a, b) => a.sort - b.sort)
      let afterTools = flowTools
        .filter(e => e.seat === 1)
        .sort((a, b) => a.sort - b.sort)
      for (let v of beforeTools) {
        const { tool: toolId, _id: flowToolId } = v
        let tool = await app.db.model.Tool.findById(toolId)
        let rule = ''
        let $checkRule = await app.db.model.CheckRule.findOne({
          flowTool: flowToolId
        })
        if ($checkRule) {
          rule = $checkRule.rule
        }
        before.push({ tool, rule })
      }
      for (let v of afterTools) {
        const { tool: toolId, _id: flowToolId } = v
        const tool = await app.db.model.Tool.findById(toolId)
        let rule = ''
        let $checkRule = await app.db.model.CheckRule.findOne({
          flowTool: flowToolId
        })
        if ($checkRule) {
          rule = $checkRule.rule
        }
        after.push({ tool, rule })
      }
      v = v.toObject()
      v = Object.assign(v, { before, after })
      nodes.push(v)
    }
    ctx.body = { flow, nodes }
    ctx.status = 200
  }
}
export default FlowRouter
