const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Log = new Schema(
  {
    projectName: {
      type: String
    },
    serverIp: {
      type: String
    },
    method: {
      type: String
    },
    url: {
      type: String
    },
    host: {
      type: String
    },
    message: {
      type: Object
    },
    created: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'Log'
  }
)

const Company = new Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    collection: 'Company'
  }
)

const Factory = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    }
  },
  {
    collection: 'Factory'
  }
)

const Workshop = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: false,
      default: 'WORKSHOP_OPEN',
      enum: ['WORKSHOP_OPEN', 'WORKSHOP_FORBIDDEN']
    },
    factory: {
      type: Schema.Types.ObjectId,
      ref: 'Factory',
      required: true
    }
  },
  {
    collection: 'Workshop'
  }
)

// const Line = new Schema(
//   {
//     name: {
//       type: String
//     },
//     status: {
//       type: String,
//       required: false,
//       default: 'LINE_EDIT',
//       enum: ['LINE_OPEN', 'LINE_EDIT', 'LINE_FORBIDDEN']
//     },
//     workshop: {
//       type: Schema.Types.ObjectId,
//       ref: 'Workshop'
//     },
//     goodsSpec: {
//       type: Schema.Types.ObjectId,
//       ref: 'GoodsSpec'
//     },
//     // TODO 移除
//     flow: {
//       type: Schema.Types.ObjectId,
//       ref: 'Flow'
//     }
//   },
//   {
//     collection: 'Line'
//   }
// )

const Flow = new Schema(
  {
    // TODO 移除
    flowType: {
      type: Schema.Types.ObjectId
    },
    name: {
      type: String
    },
    remark: {
      type: String
    },
    goodsSpec: {
      type: Schema.Types.ObjectId,
      ref: 'GoodsSpec'
    },
    // TODO 移除
    status: {
      type: String,
      required: false,
      default: 'FLOW_EDIT',
      enum: ['FLOW_OPEN', 'FLOW_EDIT', 'FLOW_FORBIDDEN']
    }
  },
  {
    collection: 'Flow'
  }
)

const FlowNode = new Schema(
  {
    flow: {
      type: Schema.Types.ObjectId,
      ref: 'Flow'
    },
    L: {
      type: Number
    },
    R: {
      type: Number
    },
    I: {
      type: Number
    },
    name: {
      type: String
    }
  },
  {
    collection: 'FlowNode'
  }
)

const FlowTool = new Schema(
  {
    flowNode: {
      type: Schema.Types.ObjectId,
      ref: 'FlowNode'
    },
    tool: {
      type: Schema.Types.ObjectId,
      ref: 'Tool'
    },
    seat: {
      type: Number
    },
    sort: {
      type: Number
    }
  },
  {
    collection: 'FlowTool'
  }
)

const CheckRule = new Schema(
  {
    flowTool: {
      type: Schema.Types.ObjectId,
      ref: 'FlowTool'
    },
    type: {
      type: String,
      required: true,
      enum: ['CheckGoods']
    },
    rule: {
      type: Schema.Types.Mixed
    }
  },
  {
    collection: 'CheckRule'
  }
)
// TODO 移除
const FlowType = new Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    collection: 'FlowType'
  }
)

const Tool = new Schema(
  {
    name: {
      type: String
    },
    icon: {
      type: String
    },
    v: {
      type: Number
    },
    version: {
      type: String
    },
    path: {
      type: String
    },
    status: {
      type: String,
      required: false,
      default: 'ENABLED',
      enum: ['ENABLED', 'DISABLED']
    },
    expTime: {
      type: Date
    },
    token: {
      type: String
    }
  },
  {
    collection: 'Tool'
  }
)

// const Workorder = new Schema(
//   {
//     sn: {
//       type: String
//     },
//     planTime: {
//       type: Date
//     },
//     actualTime: {
//       type: Date
//     },
//     productionAmount: {
//       type: Number
//     },
//     completedAmount: {
//       type: Number
//     },
//     failedAmount: {
//       type: Number
//     },
//     goodsSpec: {
//       type: Schema.Types.ObjectId,
//       ref: 'GoodsSpec'
//     }
//   },
//   {
//     collection: 'Workorder'
//   }
// )

const Class = new Schema(
  {
    name: {
      type: String
    },
    code: {
      type: String
    }
  },
  {
    collection: 'Class'
  }
)

// const Task = new Schema(
//   {
//     sn: {
//       type: String
//     },
//     workorder: {
//       type: Schema.Types.ObjectId,
//       ref: 'Workorder'
//     },
//     // TODO 移除
//     class: {
//       type: Schema.Types.ObjectId,
//       ref: 'Class'
//     },
//     line: {
//       type: Schema.Types.ObjectId,
//       ref: 'Line'
//     },
//     planTime: {
//       type: Date
//     },
//     actualTime: {
//       type: Date
//     },
//     productionAmount: {
//       type: Number
//     },
//     completedAmount: {
//       type: Number
//     },
//     failedAmount: {
//       type: Number
//     }
//   },
//   {
//     collection: 'Task'
//   }
// )

const TaskFlow = new Schema(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task'
    },
    flow: {
      type: Schema.Types.ObjectId,
      ref: 'Flow'
    }
  },
  {
    collection: 'TaskFlow'
  }
)

const Goods = new Schema(
  {
    name: {
      type: String
    },
    type: {
      type: String,
      required: false,
      default: 'PART',
      enum: [
        'GOODS_RAW',
        'GOODS_CONSUMABLE',
        'GOODS_SEMI-FINISHED',
        'GOODS_FINISHED'
      ]
    },
    code: {
      type: String
    },
    // TODO 移除
    flow: {
      type: Schema.Types.ObjectId,
      ref: 'Flow'
    },
    unit: {
      type: String
    },
    NOH: {
      type: String,
      required: false,
      default: 'NOH_ALLOW',
      enum: ['NOH_ALLOW', 'NOH_DENY']
    }
  },
  {
    collection: 'Goods'
  }
)

const GoodsBom = new Schema(
  {
    goodsSpec: {
      type: Schema.Types.ObjectId,
      ref: 'GoodsSpec'
    },
    subGoodsSpec: {
      type: Schema.Types.ObjectId,
      ref: 'GoodsSpec'
    },
    // TODO 移除
    flowNode: {
      type: Schema.Types.ObjectId,
      ref: 'FlowNode'
    },
    dosage: {
      type: Number
    },
    sku: {
      type: String
    },
    interval: {
      type: Number
    },
    yield: {
      type: Number
    },
    sort: {
      type: Number
    }
  },
  {
    collection: 'GoodsBom'
  }
)

const GoodsSpec = new Schema(
  {
    name: {
      type: String
    },
    code: {
      type: String
    },
    goods: {
      type: Schema.Types.ObjectId,
      ref: 'Goods'
    },
    L: {
      type: Number
    },
    R: {
      type: Number
    },
    I: {
      type: Number
    }
  },
  {
    collection: 'GoodsSpec'
  }
)

const Inventory = new Schema(
  {
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier'
    },
    goodsSpec: {
      type: Schema.Types.ObjectId,
      ref: 'GoodsSpec'
    },
    sku: {
      type: String
    },
    inventory: {
      type: String
    }
  },
  {
    collection: 'Inventory'
  }
)

const Supplier = new Schema(
  {
    name: {
      type: String
    }
  },
  {
    collection: 'Supplier'
  }
)
// TODO 移除
const Section = new Schema(
  {
    name: {
      type: String
    },
    status: {
      type: String,
      required: false,
      default: 'SECTION_UP',
      enum: ['SECTION_UP', 'SECTION_DOWN']
    },
    line: {
      type: Schema.Types.ObjectId,
      ref: 'Line'
    }
  },
  {
    collection: 'Section'
  }
)
// TODO 移除
const Station = new Schema(
  {
    name: {
      type: String
    },
    status: {
      type: String,
      required: false,
      default: 'STATION_UP',
      enum: ['STATION_UP', 'STATION_DOWN']
    },
    section: {
      type: Schema.Types.ObjectId,
      ref: 'Section'
    }
  },
  {
    collection: 'Station'
  }
)

/**
 * ****************************机器人内部****************************
 * **/

const Bom = new Schema(
  {
    caseName: String,
    materialNo: {
      type: String,
      unique: true
    },
    engineerName: String,
    exportTime: String,
    filePath: String
  },
  {
    collection: 'Bom'
  }
)

const BomItem = new Schema(
  {
    Bom: {
      type: Schema.Types.ObjectId
    },
    materialNo: String,
    brandName: String,
    specName: String,
    unit: String,
    dosage: Number,
    baseCount: Number,
    sourceCode: String,
    remark: String
  },
  {
    collection: 'BomItem'
  }
)

BomItem.index({ Bom: 1, materialNo: 1 }, { unique: true })

const ProductionLog = new Schema(
  {
    product: String,
    material: String,
    dosage: Number,
    operator: String,
    result: String,
    explanation: String,
    line: {
      type: Schema.Types.ObjectId,
      ref: 'Line'
    }
  },
  {
    collection: 'ProductionLog'
  }
)

const Line = new Schema(
  {
    name: {
      type: String
    },
    product: {
      type: String
    }
  },
  {
    collection: 'Line'
  }
)

const Workorder = new Schema(
  {
    sn: {
      type: String
    },
    productionAmount: {
      type: Number,
      default: 0
    },
    completedAmount: {
      type: Number,
      default: 0
    },
    failedAmount: {
      type: Number,
      default: 0
    },
    product: {
      type: String
    },
    caseName: {
      type: String
    }
  },
  {
    collection: 'Workorder'
  }
)

const Task = new Schema(
  {
    sn: {
      type: String
    },
    workorder: {
      type: Schema.Types.ObjectId,
      ref: 'Workorder'
    },
    line: {
      type: Schema.Types.ObjectId,
      ref: 'Line'
    },
    productionAmount: {
      type: Number,
      default: 1
    },
    completedAmount: {
      type: Number,
      default: 0
    },
    failedAmount: {
      type: Number,
      default: 0
    }
  },
  {
    collection: 'Task'
  }
)

module.exports = {
  /*
  http 日志
   */
  Log: mongoose.model('Log', Log),
  /*
  公司
   */
  Company: mongoose.model('Company', Company),
  /*
  工厂
   */
  Factory: mongoose.model('Factory', Factory),
  /*
  车间
   */
  Workshop: mongoose.model('Workshop', Workshop),
  /*
  工位
   */
  // Station: mongoose.model('Station', Station),
  /*
  流程
   */
  Flow: mongoose.model('Flow', Flow),
  /*
  节点
   */
  FlowNode: mongoose.model('FlowNode', FlowNode),
  /*
  流程类型
   */
  FlowType: mongoose.model('FlowType', FlowType),
  /*
  流程工具
   */
  FlowTool: mongoose.model('FlowTool', FlowTool),
  /*
  工具
   */
  Tool: mongoose.model('Tool', Tool),
  /*
  班次
   */
  // Class: mongoose.model('Class', Class),
  /*
  物料
   */
  Goods: mongoose.model('Goods', Goods),
  /*
  物料规格
   */
  GoodsSpec: mongoose.model('GoodsSpec', GoodsSpec),
  /*
  产品BOM
   */
  GoodsBom: mongoose.model('GoodsBom', GoodsBom),
  /*
  库存
   */
  Inventory: mongoose.model('Inventory', Inventory),
  /*
  供应商
   */
  Supplier: mongoose.model('Supplier', Supplier),
  /*
  计划流程
   */
  // TaskFlow: mongoose.model('TaskFlow', TaskFlow),
  /*
  卡关规则
   */
  CheckRule: mongoose.model('CheckRule', CheckRule),

  /**
   * ****************************机器人内部****************************
   * **/
  Bom: mongoose.model('Bom', Bom),
  BomItem: mongoose.model('BomItem', BomItem),
  ProductionLog: mongoose.model('ProductionLog', ProductionLog),
  /*
 产线
  */
  Line: mongoose.model('Line', Line),
  /*
 工单
  */
  Workorder: mongoose.model('Workorder', Workorder),
  /*
 任务
  */
  Task: mongoose.model('Task', Task)
}
