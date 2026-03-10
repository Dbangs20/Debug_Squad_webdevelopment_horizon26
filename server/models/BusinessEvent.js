import mongoose from 'mongoose'

const businessEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Number,
      required: true,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    impactScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { versionKey: false },
)

businessEventSchema.index({ timestamp: -1 })

export const BusinessEvent = mongoose.model('BusinessEvent', businessEventSchema)
