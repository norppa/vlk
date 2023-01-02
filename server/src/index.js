import express from 'express'
import songsRouter from './songsRouter.js'
import feedbackRouter from './feedbackRouter.js'
import userRouter from './userRouter.js'

const server = express()
server.use(express.json())

server.use('/', express.static('./client/user'))
server.use('/admin', express.static('client/admin'))

server.use('/api/songs', songsRouter)
server.use('/api/feedback', feedbackRouter)
server.use('/api/user', userRouter)


server.listen(3000, () => {
    console.log('VLK Server listening port 3000')
})