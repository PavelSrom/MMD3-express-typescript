import { Req, Res, Router } from '../types'
import auth from '../middleware/auth'
import Event, { IEvent } from '../models/Event'
import Profile, { IProfile } from '../models/Profile'

const router = Router()

router.get('/', auth, async (req: Req, res: Res) => {
  try {
    const todayEvents: IEvent[] = await Event.find({
      targetDate: new Date().toLocaleDateString()
    })

    return res.send(todayEvents)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

interface CreateEventBody {
  text: string
  targetDate: string
}
router.post('/', auth, async (req: Req<CreateEventBody>, res: Res) => {
  const { text, targetDate } = req.body

  try {
    const me: IProfile = await Profile.findOne({ user: req.userID })
    if (!me.isAdmin) return res.status(403).send({ message: 'Access denied' })

    const newEvent: IEvent = new Event({ text, targetDate })
    await newEvent.save()

    return res.status(201).send(newEvent)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

export default router
