import { useState, useEffect } from 'react'

export default function ({ token }) {
    const [songs, setSongs] = useState([])
    const [number, setNumber] = useState(0)
    const [title, setTitle] = useState('')
    const [lyrics, setLyrics] = useState('')
    const [selected, setSelected] = useState(false)
    const [message, setMessage] = useState(false)

    useEffect(() => {
        reload()
    }, [])

    const reload = async () => {
        setMessage('Ladataan lauluja')
        const result = await fetch('/api/songs')
        const songs = await result.json()
        console.log('songs', songs)
        setSongs(songs)
        setNumber(songs.length + 1)
        setSelected(false)
        setTitle('')
        setLyrics('')
        setMessage(false)
    }

    useEffect(() => {
        setTitle(selected?.title ?? '')
        setLyrics(selected?.lyrics ?? '')
        setNumber(selected?.number ?? songs.length + 1)
    }, [selected])

    const addSong = async () => {
        const response = await fetch('/api/songs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + token
            },
            body: JSON.stringify({ title, lyrics, number })
        })
        if (response.status !== 200) {
            return console.error(response)
        }
        reload()
    }

    const setSong = async () => {
        const response = await fetch('/api/songs/' + selected.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + token
            },
            body: JSON.stringify({ title, lyrics, number })
        })
        if (response.status !== 200) {
            return console.error(response)
        }
        reload()
    }

    const delSong = async () => {
        await fetch('/api/songs/' + selected.id, {
            method: 'DELETE',
            headers: { 'Authorization': 'bearer ' + token }
        })
        reload()
    }

    const onNumberChange = (event) => {
        const n = event.target.value

        if (n === '' || (n > 0 && n <= songs.length + 1)) {
            setNumber(event.target.value)
        }
    }

    return (
        <div className='Songs'>
            <div className='list'>
                {message}
                <ul>
                    {songs.map(song => {
                        const classes = selected === song ? 'selected' : ''
                        return <li key={song.id} className={classes} onClick={() => setSelected(song)}>{song.number}. {song.title}</li>
                    })}
                </ul>

            </div>

            <div className='editor'>
                {selected && <>
                    <label>
                        ID<br />
                        <input disabled value={selected.id} />
                    </label>
                </>
                }


                <label>
                    Number<br />
                    <input type='number' value={number} onChange={onNumberChange} />
                </label>

                <label>
                    Title<br />
                    <input type='text' value={title} onChange={(event) => setTitle(event.target.value)} />
                </label>

                <label>
                    Lyrics <br />
                    <textarea value={lyrics} onChange={(event) => setLyrics(event.target.value)}></textarea>
                </label>

                <div className='buttons'>
                    {selected
                        ? <>
                            <button onClick={setSong}>Päivitä</button>
                            <button onClick={delSong}>Poista</button>
                            <button onClick={() => setSelected(false)}>Peruuta</button>
                        </>
                        : <>
                            <button onClick={addSong}>Lisää uusi kappale</button>
                            <button onClick={reload}>Tyhjennä</button>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}