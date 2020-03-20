import { Document, Schema, Model, model } from 'mongoose'

export interface IEvent extends Document {
  _id: string
  text: string
  targetDate: string
}

const eventSchema: Schema = new Schema({
  text: {
    type: String,
    required: true
  },
  targetDate: {
    type: String,
    required: true,
    maxlength: 10
  }
})

const Event: Model<IEvent> = model('Event', eventSchema)

export default Event
