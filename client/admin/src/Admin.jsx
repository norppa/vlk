import { useEffect } from 'react'
import { useState } from 'react'
import Songs from './Songs'
import Feedback from './Feedback'
import Login from './Login'
import logo from './assets/VLK_logo_transparent.png'
import './Admin.css'

const KEY = '@VLK_token'

export default function () {
    const [page, setPage] = useState('songs')
    const [token, setToken] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem(KEY)
        if (token) setToken(token)
    }, [])

    const login = (token) => {
        setToken(token)
        localStorage.setItem(KEY, token)
    }

    const logout = () => {
        setToken(false)
        localStorage.removeItem(KEY)
    }

    if (!token) return <Login login={login}/>

    return (
        <div className='Admin'>
            <div className='header'>
                <img src={logo} />
                <div>
                    <div className={page === 'feedback' ? 'selected button' : 'button'}
                        onClick={() => setPage('feedback')}>
                        Palaute
                    </div>
                    <div className={page === 'songs' ? 'selected button' : 'button'}
                        onClick={() => setPage('songs')}>
                        Laulut
                    </div>
                    <div className={'button'}
                        onClick={logout}>
                        Poistu
                    </div>
                </div>
            </div>

            {page === 'songs' && <Songs token={token} />}
            {page === 'feedback' && <Feedback token={token} />}
        </div>
    )
}