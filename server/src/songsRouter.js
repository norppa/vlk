import express from 'express'
import * as dao from './dao.js'
import { authenticate } from './middleware.js'

const router = express.Router()

router.get('/enumerate', (req, res) => {
    dao.enumerateSongs()
    res.send('ok')
})

router.get('/', async (req, res) => {
    const songs = await dao.getSongs()
    res.send(songs)
})

router.post('/', authenticate, async (req, res) => {
    const { title, lyrics, number } = req.body
    console.log(number)
    const song = await dao.addSong(title, lyrics, number)
    res.send(song)
})

router.put('/:id', authenticate, async (req, res) => {
    const { title, lyrics, number } = req.body
    const { id } = req.params
    console.log('PUT', id, title, lyrics, number)
    const isModified = await dao.setSong(id, title, lyrics, number)
    isModified ? res.send({id, title, lyrics}) : res.status(404).send(`No song with id ${id}`)
})

router.delete('/:id', authenticate, async (req, res) => {
    await dao.delSong(req.params.id)
    res.send()
})

export default router