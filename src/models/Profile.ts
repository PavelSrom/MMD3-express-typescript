import { Document, Schema, Model, model } from 'mongoose'
import { IUser } from './User'

export interface IProfile extends Document {
  _id: string
  user: IUser['_id']
  firstName: string
  lastName: string
  role: string
  interests: string[]
  isPresent: boolean
  isAdmin: boolean
  isFeatured: boolean
  phoneNumber: string
}

const profileSchema: Schema = new Schema({
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
  role: {
    type: String,
    required: true
  },
  interests: {
    type: [String]
  },
  isPresent: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  phoneNumber: {
    type: String
  }
})

const Profile: Model<IProfile> = model('Profile', profileSchema)

export default Profile
