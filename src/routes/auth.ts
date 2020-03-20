import { Req, Res, Router } from '../types'
import User, { IUser } from '../models/User'
import Profile, { IProfile } from '../models/Profile'
import auth from '../middleware/auth'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const router = Router()

router.get('/', auth, async (req: Req, res: Res) => {
  try {
    const user: IUser = await User.findById(req.userID).select('-password')

    return res.send(user)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

interface RegisterBody {
  email: string
  password: string
}
router.post('/register', async (req: Req<RegisterBody>, res: Res) => {
  const { email, password } = req.body

  try {
    const userExists: IUser = await User.findOne({ email })
    if (userExists) return res.status(400).send({ message: 'User already exists' })

    const newUser: IUser = new User(req.body)
    newUser.password = await bcrypt.hash(password, 8)
    await newUser.save()

    const token = jwt.sign({ id: newUser.id }, 'pavelski')

    return res.status(201).send({ token })
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

interface LoginBody {
  email: string
  password: string
}
router.post('/login', async (req: Req<LoginBody>, res: Res) => {
  const { email, password } = req.body

  try {
    const user: IUser = await User.findOne({ email })
    if (!user) return res.status(400).send({ message: 'Invalid email' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).send({ message: 'Invalid password' })

    const token = jwt.sign({ id: user.id }, 'pavelski')

    return res.send({ token })
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

router.delete('/:id', auth, async (req: Req, res: Res) => {
  try {
    const me: IProfile = await Profile.findOne({ user: req.userID })
    if (!me.isAdmin) return res.status(403).send({ message: 'Access denied' })

    const profileToDelete: IProfile = await Profile.findOne({ user: req.params.id })
    const userToDelete: IUser = await User.findById(req.params.id)

    await profileToDelete.remove()
    await userToDelete.remove()

    return res.send({ message: 'Profile and account removed successfully' })
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

export default router
