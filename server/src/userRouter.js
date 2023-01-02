import express from 'express'
import argon from 'argon2'
import jwt from 'jsonwebtoken'
import { getAdminUser } from './dao.js'

const router = express.Router()

router.get('/hash', async (req, res) => {
    const { password } = req.body
    if (!password) return res.status(400).send()

    const hash = await argon.hash(password)
    res.send({ password, hash })
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(401).send('Invalid username or password')
    }

    const { hash } = await getAdminUser(username) ?? {}
    if (!hash || !await argon.verify(hash, password)) {
        return res.status(401).send('Invalid username or password')
    }
    res.send({ token: jwt.sign({ username }, process.env.VLK_SECRET) })
})


export default router