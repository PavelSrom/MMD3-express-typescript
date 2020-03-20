import { Document, Schema, Model, model } from "mongoose"

export interface IUser extends Document {
  _id: string
  email: string
  password: string
}

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
})

const User: Model<IUser> = model("User", userSchema)

export default User
