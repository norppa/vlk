import { useState, useEffect } from 'react'

export default function ({ token }) {
    const [feedbacks, setFeedbacks] = useState(false)
    const [selected, setSelected] = useState(false)

    useEffect(() => {
        initialize()
    }, [])

    const initialize = async () => {
        const response = await fetch('/api/feedback', { headers: { 'Authorization': 'bearer ' + token } })
        const feedbacks = await response.json()
        setFeedbacks(feedbacks)
        console.log(feedbacks)
        if (feedbacks.length > 0) {
            setSelected(feedbacks[0])
        }
    }

    const remove = async () => {
        const response = await fetch('/api/feedback/' + selected.id, {
            method: 'DELETE',
            headers: { 'Authorization': 'bearer ' + token }
        })
        if (response.status !== 200) {
            return console.error(response)
        }

        const newFeedbacks = feedbacks.filter(feedback => feedback.id !== selected.id)
        setFeedbacks(newFeedbacks)
        setSelected(newFeedbacks.length > 0 ? newFeedbacks[0] : false)
    }

    return (
        <div className='Feedback'>
            <div className='list'>
                {feedbacks
                    ? <ul>
                        {feedbacks.map(feedback => {
                            const classes = selected === feedback ? 'selected' : ''
                            const shortMessage = feedback.message.length > 15 ? feedback.message.substring(0, 15) + '...' : feedback.message
                            return <li key={feedback.id} className={classes} onClick={() => setSelected(feedback)}>{shortMessage}</li>
                        })}
                    </ul>
                    : <span>Haetaan palautteita...</span>
                }

            </div>

            <div className='editor'>
                {selected
                    ? <>{selected && <label>
                        ID<br />
                        <input disabled value={selected.id} />
                    </label>
                    }

                        <label>
                            Palaute<br />
                            <textarea value={selected.message} disabled />
                        </label>

                        <label>
                            Lähettäjä <br />
                            <input value={selected.sender} disabled />
                        </label>

                        {selected.relates_to && <label>
                            Liittyy kappaleeseen  <br />
                            <input value={selected.relates_to} disabled />
                        </label>}

                        <div className='buttons'>
                            <button onClick={remove}>Poista</button>
                        </div></>
                    : <span className='centered'>Ei yhtään palautetta :(</span>}


            </div>

        </div>
    )
}