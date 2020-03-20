import { Req, Res, Router } from '../types'
import auth from '../middleware/auth'
import Profile, { IProfile } from '../models/Profile'
const router = Router()

router.get('/', auth, async (req: Req, res: Res) => {
  try {
    const allProfiles: IProfile[] = await Profile.find()

    return res.send(allProfiles)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

router.get('/me', auth, async (req: Req, res: Res) => {
  try {
    const myProfile: IProfile = await Profile.findOne({ user: req.userID })

    return res.send(myProfile)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

router.get('/:id', auth, async (req: Req, res: Res) => {
  try {
    const targetUser: IProfile = await Profile.findOne({ user: req.params.id })
    if (!targetUser) return res.status(404).send({ message: 'Profile not found' })

    return res.send(targetUser)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

interface CreateProfileBody {
  firstName: string
  lastName: string
  role: string
  interests: string[]
  phoneNumber?: string
  isAdmin?: boolean
}
router.post('/', auth, async (req: Req<CreateProfileBody>, res: Res) => {
  const { firstName, lastName, role, interests, phoneNumber, isAdmin } = req.body

  interface NewProfile extends CreateProfileBody {
    user: string
  }
  const profile: NewProfile = {
    user: req.userID,
    firstName,
    lastName,
    role,
    interests
  }

  if (phoneNumber) profile.phoneNumber = phoneNumber
  if (isAdmin) profile.isAdmin = isAdmin

  try {
    const profileExists: IProfile = await Profile.findOne({ user: req.userID })
    if (profileExists)
      return res.status(400).send({ message: 'Profile already exists' })

    const newProfile = new Profile(profile)
    await newProfile.save()

    return res.status(201).send(newProfile)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

interface UpdateProfileBody {
  role?: string
  interests?: string[]
  phoneNumber?: string
  isPresent?: boolean
}
router.put('/me', auth, async (req: Req<UpdateProfileBody>, res: Res) => {
  const { role, interests, phoneNumber, isPresent } = req.body

  try {
    const profile: IProfile = await Profile.findOne({ user: req.userID })
    if (!profile) return res.status(404).send({ message: 'Profile not found' })

    if (role) profile.role = role
    if (interests) profile.interests = interests
    if (phoneNumber) profile.phoneNumber = phoneNumber
    isPresent && isPresent === true
      ? (profile.isPresent = true)
      : (profile.isPresent = false)

    await profile.save()

    return res.send(profile)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

interface AdminUpdateProfile {
  isAdmin: boolean
  isFeatured: boolean
}
router.put('/:id', auth, async (req: Req<AdminUpdateProfile>, res: Res) => {
  const { isAdmin, isFeatured } = req.body

  try {
    const myProfile: IProfile = await Profile.findOne({ user: req.userID })
    if (!myProfile) return res.status(404).send({ message: 'Profile not found' })
    if (!myProfile.isAdmin) return res.status(403).send({ message: 'Access denied' })

    const profile: IProfile = await Profile.findById(req.params.id)
    if (!profile)
      return res.status(404).send({ messsage: 'Target profile not found' })

    if (isAdmin) profile.isAdmin = isAdmin
    if (isFeatured) profile.isFeatured = isFeatured

    await profile.save()

    return res.send(profile)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

export default router
