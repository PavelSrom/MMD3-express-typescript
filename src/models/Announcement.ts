import { Document, Schema, Model, model } from 'mongoose'
import { IUser } from './User'

export interface IAnnouncement extends Document {
  _id: string
  user: IUser['_id']
  firstName: string
  lastName: string
  text: string
  expireAt: Date
}

const announcementSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  text: {
    type: String,
    required: true
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: '1d' } // expire after 1 day
  }
})

const Announcement: Model<IAnnouncement> = model('Announcement', announcementSchema)

export default Announcement
