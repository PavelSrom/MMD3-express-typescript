import express from 'express'
import mongoose from 'mongoose'
import config from 'config'

import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'
import postRoutes from './routes/bullshit'
import eventRoutes from './routes/event'
import announcementRoutes from './routes/announcement'
const app = express()

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/announcements', announcementRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/posts', postRoutes)

const PORT = process.env.PORT || 5000

mongoose
  .connect(config.get('mongoURI'), {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
  })
  .catch(err => {
    console.log(err)
    console.log('Database not connected')
  })
