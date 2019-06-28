const mongooseDelete = require('mongoose-delete')
const mongooseTimestamp = require('mongoose-timestamp')
const mongoose = require('mongoose')

module.exports = {
  lastModified(schema, options) {
    schema.plugin(mongooseDelete, { deleteBy: true, overrideMethods: 'all' })
    schema.plugin(mongooseTimestamp)
    schema.post('init', function(doc) {
      // console.log('%s has been initialized from the db', doc._id)
    })

    schema.post('validate', function(doc) {
      // console.log('%s has been validated (but not saved yet)', doc._id)
    })

    schema.post('save', function(doc) {
      // console.log('%s has been saved', doc._id)
    })

    schema.post('remove', function(doc) {
      // console.log('%s has been removed', doc._id)
    })
  }
}
