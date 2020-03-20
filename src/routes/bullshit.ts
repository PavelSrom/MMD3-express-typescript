import { Req, Res, Router } from '../types'
import auth from '../middleware/auth'
import Bullshit, { IBullshit } from '../models/Bullshit'
import Profile, { IProfile } from '../models/Profile'

const router = Router()

router.get('/', auth, async (req: Req, res: Res) => {
  try {
    const allPosts: IBullshit[] = await Bullshit.find().sort({ createdAt: -1 })

    return res.send(allPosts)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

router.get('/:id', auth, async (req: Req, res: Res) => {
  try {
    const bullshit: IBullshit = await Bullshit.findById(req.params.id)
    if (!bullshit) return res.status(404).send({ message: 'Post not found' })

    return res.send(bullshit)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

interface CreatePostBody {
  text: string
}
router.post('/', auth, async (req: Req<CreatePostBody>, res: Res) => {
  try {
    const userWhoPosted: IProfile = await Profile.findOne({ user: req.userID })
    if (!userWhoPosted) return res.status(404).send({ message: 'User not found' })

    const newBullshit: IBullshit = new Bullshit({
      user: req.userID,
      firstName: userWhoPosted.firstName,
      lastName: userWhoPosted.lastName,
      text: req.body.text
    })

    await newBullshit.save()

    return res.status(201).send(newBullshit)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

router.delete('/:id', auth, async (req: Req, res: Res) => {
  try {
    const postToDelete: IBullshit = await Bullshit.findById(req.params.id)
    if (!postToDelete) return res.status(404).send({ message: 'Post not found' })

    if (postToDelete.user.toString() !== req.userID)
      return res.status(403).send({ message: 'Access denied' })

    await postToDelete.remove()

    return res.send({ message: 'Post deleted successfully' })
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

interface CreateCommentBody {
  text: string
}
router.post('/:id/comment', auth, async (req: Req<CreateCommentBody>, res: Res) => {
  try {
    const myProfile: IProfile = await Profile.findOne({ user: req.userID })
    const targetPost: IBullshit = await Bullshit.findById(req.params.id)

    const newComment: IBullshit = new Bullshit({
      user: req.userID,
      firstName: myProfile.firstName,
      lastName: myProfile.lastName,
      text: req.body.text
    })

    targetPost.comments.unshift(newComment)
    await targetPost.save()

    return res.status(201).send(targetPost)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

router.delete('/:postId/:commentId', auth, async (req: Req, res: Res) => {
  try {
    const targetPost: IBullshit = await Bullshit.findById(req.params.id)
    if (!targetPost) return res.status(404).send({ message: 'Post not found' })

    const targetComment = targetPost.comments.find(
      com => com._id.toString() === req.params.commentId
    )
    if (!targetComment)
      return res.status(400).send({ message: 'Comment does not exist' })
    if (targetComment.user.toString() !== req.userID)
      return res.status(403).send({ message: 'Access denied' })

    targetPost.comments = targetPost.comments.filter(
      com => com.id !== targetComment.id
    )

    await targetPost.save()

    return res.send(targetPost)
  } catch ({ message }) {
    console.log(message)
    return res.status(500).send({ message })
  }
})

export default router
