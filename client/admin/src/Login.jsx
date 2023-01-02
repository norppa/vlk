import { useState } from 'react'
import logo from './assets/VLK_logo_transparent.png'
import './Login.css'

export default function ({ login }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const onPasswordKeyDown = (event) => event.key === 'Enter' && submit()

    const submit = async (event) => {
        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        if (response.status === 401) {
            return setMessage('Invalid username or password')
        }

        setMessage('')
        setUsername('')
        setPassword('')

        const { token } = await response.json()
        login(token)
    }

    return (

        <div className='Login'>

            <img src={logo} />
            <div className='container'>
                <h1>VLK Admin</h1>
                <label>
                    Käyttäjätunnus<br />
                    <input type='text' value={username} onChange={(event) => setUsername(event.target.value)} autoFocus />
                </label>
                <label>
                    Salasana<br />
                    <input type='password' value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        onKeyDown={onPasswordKeyDown} />
                </label>

                <button onClick={submit}>Kirjaudu sisään</button>


                {message}
            </div>
        </div>
    )
}