import { useEffect, useState } from 'react'
import { FaDice, FaChevronLeft, FaChevronRight, FaRegComment } from 'react-icons/fa'
import Feedback from './Feedback'
import logo from './assets/VLK_logo_transparent.png'
import './App.css'

function App() {
    const [songs, setSongs] = useState([])
    const [selected, setSelected] = useState(false)
    const [showIndex, setShowIndex] = useState(false)
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState(null)
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

    useEffect(() => {
        initialize()
    }, [])

    useEffect(() => {
        const searchText = search.toLowerCase()
        if (searchText === '') return setSearchResults(null)

        const searchResults = {
            matchInTitle: [],
            matchInLyrics: []
        }

        for (let i = 0; i < songs.length; i++) {
            const indexOfMatchInTitle = songs[i].title.toLowerCase().indexOf(searchText)
            if (indexOfMatchInTitle >= 0) {
                searchResults.matchInTitle.push({ ...songs[i], indexOfMatch: indexOfMatchInTitle })
            } else {
                const searchableText = songs[i].lyrics.replace(/\s+/g, ' ')
                const indexOfMatchInLyrics = searchableText.toLowerCase().indexOf(searchText)
                if (indexOfMatchInLyrics >= 0) {
                    const snippetLength = 45
                    const snippetMargin = Math.floor((snippetLength - searchText.length) / 2)
                    const snippetStartIndex = indexOfMatchInLyrics - snippetMargin
                    const snippetEndIndex = indexOfMatchInLyrics + searchText.length + snippetMargin
                    const snippet = []
                    snippet.push(searchableText.substring(snippetStartIndex, indexOfMatchInLyrics))
                    snippet.push(searchableText.substring(indexOfMatchInLyrics, indexOfMatchInLyrics + searchText.length))
                    snippet.push(searchableText.substring(indexOfMatchInLyrics + searchText.length, snippetEndIndex))
                    searchResults.matchInLyrics.push({ ...songs[i], snippet })
                }
            }
        }

        setSearchResults(searchResults)
    }, [search])

    const initialize = async () => {
        const result = await fetch('/api/songs')
        const songs = await result.json()
        setSongs(songs)
    }

    const select = (id) => {
        const song = songs.find(song => song.id === id)
        setSelected(song)
        setShowIndex(false)
        setSearch('')
    }

    const selectPrevious = () => {
        const currentIndex = songs.indexOf(selected)
        const previousIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1
        setSelected(songs[previousIndex])
    }

    const selectNext = () => {
        const currentIndex = songs.indexOf(selected)
        const nextIndex = currentIndex === songs.length - 1 ? 0 : currentIndex + 1
        setSelected(songs[nextIndex])
    }

    const selectRandom = () => {
        const randomIndex = Math.floor(Math.random() * songs.length)
        setSelected(songs[randomIndex])
    }

    const selectFrontpage = () => {
        setSelected(false)
    }

    const selectSearched = (event) => {
        if (event.key === 'Enter' && searchResults) {
            const results = searchResults.matchInTitle.concat(searchResults.matchInLyrics)
            if (results.length === 1) {
                select(results[0].id)
                event.target.blur()
            }
        }
    }

    const Index = () => {
        return <div className='Index'>
            <ul>
                {songs.map(({ id, title, number }) => <li key={id}
                    className={id === selected.id ? 'selected' : undefined}
                    onMouseDown={() => select(id)}>
                    {number}. {title}
                </li>)}
            </ul>
        </div>
    }

    const SearchResults = () => {
        return <div className='Index'>
            <ul>
                {searchResults.matchInTitle.map(({ id, title, number, indexOfMatch }) => {
                    const beforeMatch = title.substring(0, indexOfMatch)
                    const match = title.substring(indexOfMatch, indexOfMatch + search.length)
                    const afterMatch = title.substring(indexOfMatch + search.length)
                    return <li key={id}
                        className={id === selected.id ? 'selected' : undefined}
                        onMouseDown={() => select(id)}>
                        {number}. {beforeMatch}<span className='highlight'>{match}</span>{afterMatch}
                    </li>
                })}

                {searchResults.matchInTitle.length > 0 && searchResults.matchInLyrics.length > 0 && <li><hr /></li>}

                {searchResults.matchInLyrics.map(({ id, title, number, snippet }) => {
                    return <li key={id}
                        className={id === selected.id ? 'selected' : undefined}
                        onMouseDown={() => select(id)}>
                        {number}. {title}
                        <div className='snippet'>
                            ...
                            {snippet[0]}
                            <span className='highlight'>{snippet[1]}</span>
                            {snippet[2]}
                            ...
                        </div>

                    </li>
                })}
            </ul>
        </div>
    }

    const Song = () => {
        return (
            <div className='Song'>
                <h1>{selected.number}. {selected.title}</h1>
                <div className='lyrics'>
                    {selected.lyrics}
                </div>
            </div>
        )
    }

    const Frontpage = () => {
        return (
            <div className='Song'>
                <h1>Vaan Laulukirja</h1>
                <div className='lyrics'>
                    Selaa kappaleita klikkaamalla yläreunan hakupalkkia
                </div>
            </div>
        )
    }

    return (
        <div className='App'>
            <div className='navi'>
                <span className='naviBtn' onClick={selectPrevious}>
                    <FaChevronLeft className='icon' />
                    <span className='desktop'>edellinen</span>
                </span>
                <span>
                    <input
                        onFocus={() => setShowIndex(true)}
                        onBlur={() => setShowIndex(false)}
                        onKeyDown={selectSearched}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <FaDice size={20} className='naviBtn' onClick={selectRandom} />
                </span>
                <span className='naviBtn' onClick={selectNext}>
                    <span className='desktop'>seuraava</span>
                    <FaChevronRight className='icon' />
                </span>
            </div>

            {showIndex && searchResults && <SearchResults />}
            {showIndex && !searchResults && <Index />}
            {!showIndex && selected && <Song song={selected} />}
            {!showIndex && !selected && <Frontpage />}


            <hr />
            <div className='Footer'>
                <img src={logo} onMouseDown={selectFrontpage} />
                <div className='feedbackBtn'
                    onMouseDown={() => setIsFeedbackOpen(true)}>
                    <FaRegComment className='icon' />
                    <div>Palaute? Idea? <br className='mobile' />Korjausehdotus?<br />Kerro se meille!</div>
                </div>

            </div>

            <Feedback isOpen={isFeedbackOpen}
                close={() => setIsFeedbackOpen(false)}
                songs={songs}
                selected={selected} />
        </div>
    )
}

export default App
