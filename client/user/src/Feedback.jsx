import { useEffect, useState } from 'react';
import './Feedback.css'

const styles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: 10,
        border: '2px solid #320d3e',
        display: 'flex',
        flexDirection: 'column',
        width: 500,
        color: '#320d3e'
    },
};

export default function ({ isOpen, close, songs, selected }) {
    const [message, setMessage] = useState('')
    const [sender, setSender] = useState('')
    const [song, setSong] = useState(selected.id)
    const [showExitMsg, setShowExitMsg] = useState(false)

    useEffect(() => {
        setSong(selected.id)
    }, [selected])

    useEffect(() => {
        setShowExitMsg(false)
    }, [isOpen])

    const submit = async () => {
        const id = Number(song)
        const selectedSong = songs.find(song => song.id === id)
        const relatesTo = selectedSong ? `${selectedSong.title}(${selectedSong.id})` : undefined
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, sender, relatesTo })
        })
        if (response.status === 200) {
            setShowExitMsg(true)
            setTimeout(closeModal, 3000)

        }
    }

    const closeModal = () => {
        setMessage('')
        setSender('')
        close()
    }

    const classes = isOpen ? 'modal' : 'modal hidden'

    return <div className={classes}>
        <div className='contents'>
            <h1>Anna palautetta VLK:lle</h1>

            {showExitMsg
                ? <>
                    <p>Kiitos palautteestasi!</p>
                    <button onClick={close}>Sulje</button>
                </>
                : <>
                    <label>Mitä on mielessä?</label>
                    <textarea value={message} onChange={(event) => setMessage(event.target.value)}></textarea>

                    <label>Liittyy kappaleeseen</label>
                    <select value={song} onChange={(event) => setSong(event.target.value)}>
                        <option value={0}>Eikä liity</option>
                        {songs.map(song => <option key={song.id} value={song.id}>{song.title}</option>)}
                    </select>

                    <label>Lähettäjä (vapaaehtoinen)</label>
                    <input type='text' value={sender} onChange={(event) => setSender(event.target.value)} />

                    <div className='buttons'>
                        <button disabled={!message} onClick={submit}>Lähetä</button>
                        <button onClick={closeModal}>Peruuta</button>
                    </div>
                </>}
        </div>
    </div>

}