import mongoose from 'mongoose'

const templateSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, 'Name is required'],
    trim:     true,
  },
}, {
  timestamps: true,
  versionKey: false,
})

const Template = mongoose.model('Template', templateSchema)
export default Template
