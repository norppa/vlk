import express from 'express'
import { addFeedback, delFeedback, getFeedback } from './dao.js'
import { authenticate } from './middleware.js'

const router = express.Router()

router.get('/', authenticate, async (req, res) => {
    const feedback = await getFeedback()
    res.send(feedback)
})

router.post('/', async (req, res) => {
    const { message, sender, relatesTo } = req.body
    const success = await addFeedback(message, sender, relatesTo)
    const status = success ? 200 : 500
    res.status(status).send()
})

router.delete('/:id', authenticate, async (req, res) => {
    await delFeedback(req.params.id)
    res.send()
})

export default router