const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const empSchema = new Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    age:{ type: Number },
    other:{ type:  Schema.Types.Mixed },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('employee', empSchema, 'employee');