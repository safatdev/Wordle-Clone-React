import React, {useState, useEffect} from 'react'
import Grid from './Grid'
import Keyboard from './Keyboard'
import {MdDarkMode,MdOutlineDarkMode} from 'react-icons/md'

import './css/main.css'
import './css/light.css'
import './css/dark.css'

function App() {

  // initialise
  let lastUpdate = ''
  const [darkMode, setDarkMode] = useState(true)
  const [wordOfDay, setWordOfDay] = useState([])
  const [guessedLetters, setGuessedLetters] = useState([])
  const [completed, setCompleted] = useState(false)
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState([])

  // helper functions
  function hasGuessedWord() {
    return guesses[guesses.length - 1].w.filter(letter => { return letter.s === 'p' }).length === 5
  }
  function noMoreGuesses() {
    return guesses.length === 6
  }

  // adding a letter to guess
  const addLetterToGuess = (letter) => {
    if (currentGuess.length >= 5 || completed || guesses.length === 6) return
    setCurrentGuess([...currentGuess, {i: currentGuess.length, c: letter}])
  }

  // remove letter from guess
  const removeLetterFromGuess = () => {
    if (currentGuess.length <= 0 || completed) return
    setCurrentGuess(currentGuess.slice(0,-1))
  }

  // guessed
  const userNewGuess = () => {
    if (currentGuess.length !== 5 || completed) return

    let newGuess = {i: guesses.length, w: []}
    let newGuessedLetters = []
    for (let i = 0; i < currentGuess.length; i++) {
      let state = 'n'
      if (currentGuess[i].c === wordOfDay[i]) {
        state = 'p'
      } else {
        if (wordOfDay.filter(letter => { return letter === currentGuess[i].c }).length > 0) {
          state = 'c'
        }
      }
      newGuess.w.push({i: i, c: currentGuess[i].c, s: state})
      newGuessedLetters.push({c: currentGuess[i].c, s: state})
    }
    setGuesses([...guesses, newGuess])
    setGuessedLetters([...guessedLetters, ...newGuessedLetters])
    setCurrentGuess([])

    localStorage.setItem('guesses', JSON.stringify([...guesses, newGuess]))
    localStorage.setItem('guessedLetters', JSON.stringify([...guessedLetters, ...newGuessedLetters]))
  }

  // handle user input
  const handleInput = (event) => {
    let {key, keyCode, ctrlKey} = event
    if (ctrlKey) return
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)) {
      addLetterToGuess(key);
    } else if (keyCode === 8) {
      removeLetterFromGuess();
    } else if (keyCode === 13) {
      userNewGuess();
    }
  }

  // fetching from api
  const fetchFromAPI = () => {
    fetch('http://localhost/wordle/api.php')
    .then(res => res.json())
    .then(data => {
      setWordOfDay(data.CURRENT_WORD.split(''))
      localStorage.setItem('dataPayload', JSON.stringify(data))
      localStorage.setItem('guesses', '[]')
      localStorage.setItem('completed', false)
      localStorage.setItem('guessedLetters', '[]')
    })
  }

  // load from localstorage and api
  useEffect(() => {
    let dataPayload = localStorage.getItem('dataPayload')

    // data payload
    if (dataPayload === null) {
      fetchFromAPI()
    } else {
      dataPayload = JSON.parse(dataPayload)
      let lastUpdate = new Date(dataPayload.LAST_UPDATE + ' ' + dataPayload.TIME_CHANGE)
      let curDate = new Date()
      if (Math.floor(Math.abs(curDate - lastUpdate) / (parseInt(dataPayload.SECONDS_TILL_UPDATE) * 1000)) > 0) {
        fetchFromAPI()
      } else {
        setWordOfDay(dataPayload.CURRENT_WORD.split(''))
      }
    }

    // other checks
    let storedGuesses = localStorage.getItem('guesses')
    let storedComplete = localStorage.getItem('complete')
    let storedLetters = localStorage.getItem('guessedLetters')
    if (storedGuesses !== null) {
      setGuesses(JSON.parse(storedGuesses))
    }
    if (storedComplete !== null) {
      setCompleted(storedComplete)
    }
    if (storedLetters !== null) {
      setGuessedLetters(JSON.parse(storedLetters))
    }
  }, [])

  // on user input
  useEffect(() => {
    window.addEventListener('keydown', handleInput);
    return () => {
      window.removeEventListener('keydown', handleInput)
    }
  }, [currentGuess]);

  // on new guess
  useEffect(() => {
    if (guesses <= 0) return
    if (hasGuessedWord() || noMoreGuesses()) {
      setCompleted(true)
      setInterval(nextWordleCountdown, 1000)
      localStorage.setItem('completed', true)
    }
  }, [guesses])

  // based on dark mode
  useEffect(() => {
    let body = document.getElementsByTagName('body')[0]
    if (darkMode) {
      body.classList.remove('light')
      body.classList.add('dark')
    } else {
      body.classList.remove('dark')
      body.classList.add('light')
    }
  }, [darkMode])

  // countdown
  const nextWordleCountdown = () => {
    let dataPayload = JSON.parse(localStorage.getItem('dataPayload'))
    let lastUpdate = new Date(`${dataPayload.LAST_UPDATE} ${dataPayload.TIME_CHANGE}`)
    let futureDate = lastUpdate.setDate(lastUpdate.getDate() + 1)
    let curDate = new Date()
    let diff = new Date(futureDate - curDate)
    
    let seconds = diff.getSeconds().toString()
    let paddedSeconds = seconds.length < 2 ? '0' + seconds : seconds
    document.getElementById('countdownClock').innerHTML = `${diff.getHours()}:${diff.getMinutes()}:${paddedSeconds}`
  }
  
  const Completed = () => {
    if (completed) {
      return (
        <>
          <div className="alert">
            {hasGuessedWord() ? <span className="success">Congratulations, you guessed the word!</span> : <span className="failure">Nice try, the word was {wordOfDay.map(l=>{return l})}, maybe next time?</span>}
          </div>
          <div id="countdownClock" className="countdown-clock"></div>
        </>
      )
    }
    return <></>
  }

  const handleDarkMode = () => {
    if (darkMode) {
      setDarkMode(false)
    } else {
      setDarkMode(true)
    }
  }

  return (
    <>
    <div className="header">
      <button onClick={() => {handleDarkMode()}} className="dark-mode-button">
        {darkMode ? <MdDarkMode /> : <MdOutlineDarkMode />}
      </button>
      <h1 className="title">Wordle Clone</h1>
    </div>

    <Completed />

    <Grid guesses={guesses} currentGuess={currentGuess} />
    <Keyboard addLetterToGuess={addLetterToGuess} removeLetterFromGuess={removeLetterFromGuess} userNewGuess={userNewGuess} guessedLetters={guessedLetters}/>
    </>
  );
}

export default App;
