// const mongoose = require('mongoose')
// const xlsx = require('xlsx')
// const {
//   request,
//   summary,
//   body,
//   tags,
//   middlewares,
//   path,
//   description,
//   query,
//   deprecated,
//   tagsAll,
//   middlewaresAll,
//   queryAll,
//   deprecatedAll
// } = require('koa-swagger-decorator')
// const { uplader } = require('../../lib/util')
//
// @tagsAll(['Bom'])
// class BomRouter {
//   @request('POST', '/bom')
//   @summary('create')
//   @description('create')
//   @body({})
//   @middlewares([uplader.single('file')])
//   static async create(ctx) {
//     const { app } = ctx
//     const file = ctx.req.file
//     const workbook = xlsx.readFile(file.path)
//     const sheetNames = workbook.SheetNames
//     const Bom = app.db.model.Bom
//     const BomItem = app.db.model.BomItem
//     const session = await mongoose.startSession()
//     await session.startTransaction()
//     ctx.logger.info(`bom导入开始`)
//     try {
//       const opts = { session, new: true }
//       for (let v of sheetNames) {
//         const worksheet = workbook.Sheets[v]
//         const materialNo = worksheet.C3.w
//         const caseName = worksheet.E3.w
//         const engineerName = worksheet.G3.w
//         const exportTime = worksheet.I3.w
//         const filePath = `http://${process.env.HTTP_URL}:${
//           process.env.HTTP_PORT
//         }/${file.filename}`
//         const bom = await Bom.create(
//           [
//             {
//               materialNo,
//               caseName,
//               engineerName,
//               exportTime,
//               filePath
//             }
//           ],
//           opts
//         )
//         let i = 5
//         while (i >= 5) {
//           if (worksheet[`B${i}`]) {
//             const Bom = bom._id
//             const materialNo = worksheet[`B${i}`] ? worksheet[`B${i}`].w : ''
//             const brandName = worksheet[`C${i}`] ? worksheet[`C${i}`].w : ''
//             const specName = worksheet[`D${i}`] ? worksheet[`D${i}`].w : ''
//             const unit = worksheet[`E${i}`] ? worksheet[`E${i}`].w : ''
//             const dosage = worksheet[`F${i}`] ? worksheet[`F${i}`].w : ''
//             const baseCount = worksheet[`G${i}`] ? worksheet[`G${i}`].w : ''
//             const sourceCode = worksheet[`H${i}`] ? worksheet[`H${i}`].w : ''
//             const remark = worksheet[`I${i}`] ? worksheet[`I${i}`].w : ''
//             await BomItem.create(
//               [
//                 {
//                   Bom,
//                   materialNo,
//                   brandName,
//                   specName,
//                   unit,
//                   dosage,
//                   baseCount,
//                   sourceCode,
//                   remark
//                 }
//               ],
//               opts
//             )
//             i++
//           } else {
//             break
//           }
//         }
//       }
//       await session.commitTransaction()
//       ctx.logger.info(`bom导入成功`)
//     } catch (e) {
//       await session.abortTransaction()
//       ctx.logger.info(`bom导入失败`)
//       ctx.throw(e)
//     } finally {
//       await session.endSession()
//     }
//     ctx.body = null
//     ctx.status = 200
//   }
//   @request('PUT', '/bom/{_id}')
//   @summary('update')
//   @description('update')
//   @body({
//     name: { type: 'string', required: true }
//   })
//   @path({
//     _id: { type: 'string', required: true }
//   })
//   static async update(ctx) {
//     const { app } = ctx
//     const { _id } = ctx.validatedParams
//     const result = await app.db.model.Bom.findByIdAndUpdate(
//       _id,
//       ctx.validatedBody
//     )
//     ctx.body = { result }
//     ctx.status = 200
//   }
//   @request('DELETE', '/bom/{_id}')
//   @summary('delete')
//   @description('delete')
//   @path({
//     _id: { type: 'string', required: true }
//   })
//   static async delete(ctx) {
//     const { app } = ctx
//     const { _id } = ctx.validatedParams
//     const result = await app.db.model.Bom.deleteById({ _id })
//     ctx.body = { result }
//     ctx.status = 200
//   }
//   @request('GET', '/bom')
//   @summary('findPage')
//   @description('findPage')
//   @query({
//     pageSize: { type: 'number', required: false, default: 15 },
//     currentPage: { type: 'number', required: false, default: 1 },
//     pagination: { type: 'boolean', required: false, default: true }
//   })
//   static async findPage(ctx) {
//     const { app } = ctx
//     const { pagination } = ctx.validatedQuery
//     if (pagination) {
//       const [data, total] = await app.dao.bom.findPage(ctx.validatedQuery)
//       ctx.body = { total, data }
//     } else {
//       const result = await app.db.model.Bom.find()
//       ctx.body = { result }
//     }
//     ctx.status = 200
//   }
//   @request('GET', '/bom/{_id}')
//   @summary('findOne')
//   @description('findOne')
//   @path({ _id: { type: 'string', required: true } })
//   static async findOne(ctx) {
//     const { app } = ctx
//     const { _id } = ctx.validatedParams
//     const result = await app.db.model.Bom.findById(_id)
//     ctx.body = { result }
//     ctx.status = 200
//   }
// }
// export default BomRouter
