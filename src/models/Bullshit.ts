import { Document, Schema, Model, model } from 'mongoose'
import { IUser } from './User'

export interface Comment extends Document {
  user: IUser['_id']
  text: string
  firstName: string
  lastName: string
}

export interface IBullshit extends Document {
  _id: string
  user: IUser['_id']
  firstName: string
  lastName: string
  text: string
  comments: Comment[]
}

const bullshitSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        text: {
          type: String,
          required: true
        },
        firstName: {
          type: String
        },
        lastName: {
          type: String
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

const Bullshit: Model<IBullshit> = model('Bullshit', bullshitSchema)

export default Bullshit
