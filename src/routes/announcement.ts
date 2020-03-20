import { Req, Res, Router } from '../types'
import auth from '../middleware/auth'
import Announcement, { IAnnouncement } from '../models/Announcement'
import Profile, { IProfile } from '../models/Profile'
const router = Router()

router.get('/', auth, async (req: Req, res: Res) => {
  try {
    const announcements: IAnnouncement[] = await Announcement.find()

    return res.send(announcements)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

interface PostAnnBody {
  text: string
}
router.post('/', auth, async (req: Req<PostAnnBody>, res: Res) => {
  try {
    const me: IProfile = await Profile.findOne({ user: req.userID })
    if (!me.isAdmin) return res.status(403).send({ message: 'Access denied' })

    const newAnnouncement: IAnnouncement = new Announcement({
      user: req.userID,
      firstName: me.firstName,
      lastName: me.lastName,
      text: req.body.text
    })

    await newAnnouncement.save()

    return res.status(201).send(newAnnouncement)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

export default router
