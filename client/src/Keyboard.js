import { useEffect, useState } from 'react'
import {IoBackspaceOutline} from 'react-icons/io5'

const Keyboard = ({addLetterToGuess, removeLetterFromGuess, userNewGuess, guessedLetters}) => {

    const [keyboardLayout, setKeyboardLayout] = useState([
        {i: 0, r: [{k: 'q'}, {k: 'w'}, {k: 'e'}, {k: 'r'}, {k: 't'}, {k: 'y'}, {k: 'u'}, {k: 'i'}, {k: 'o'}, {k: 'p'}]},
        {i: 1, r: [{k: 'a'}, {k: 's'}, {k: 'd'}, {k: 'f'}, {k: 'g'}, {k: 'h'}, {k: 'j'}, {k: 'k'}, {k: 'l'}]},
        {i: 2, r: [{k: 'enter'}, {k: 'z'}, {k: 'x'}, {k: 'c'}, {k: 'v'}, {k: 'b'}, {k: 'n'}, {k: 'm'}, {k: 'bspace'}]}
    ])

    const handleClick = (keyN) => {
        if (keyN === 'bspace') {
            removeLetterFromGuess()
        } else if (keyN === 'enter') {
            userNewGuess()
        } else {
            addLetterToGuess(keyN)
        }
    }

    useEffect(() => {
        if (guessedLetters.length <= 0) return
        let newKeyboard = keyboardLayout
        for (let i = 0; i < newKeyboard.length; i++) {
            for (let j = 0; j < newKeyboard[i].r.length; j++) {
                let guessed = guessedLetters.filter(letter => {return newKeyboard[i].r[j].k === letter.c})[0];
                if (guessed !== undefined) {
                    newKeyboard[i].r[j].s = guessed.s
                }
            }
        }
        setKeyboardLayout(newKeyboard)
    }, [guessedLetters]);

    return (
        <div className="keyboard">
            {keyboardLayout.map(row => {
                return <div key={row.i} className="row">
                    {row.r.map(keyN => {
                        return <button key={keyN.k} onClick={() => handleClick(keyN.k)} className={`key ${keyN.s !== undefined ? keyN.s : ''}`}>{keyN.k === 'bspace' ? <IoBackspaceOutline/> : keyN.k}</button>
                    })}
                </div>
            })}
        </div>
    )
}

export default Keyboard