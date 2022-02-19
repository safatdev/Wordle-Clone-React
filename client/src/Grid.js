const Grid = ({guesses, currentGuess}) => {

    const padCurrentGuess = () => {
        let guess = [...currentGuess]
        for (let i = guess.length; i < 5; i++) {
            guess.push({i: i, c: ""})
        }
        return guess
    }

    const padGuessed = () => {
        let words = [];
        for (let i = guesses.length; i < 6-1; i++) {
            let word = {i: i, w: []};
            for (let j = 0; j < 5; j++) {
                word.w.push(j);
            }
            words.push(word)
        }
        return words;
    }

    return (
        <div className="grid">
            {guesses.map(word => {
                return (
                    <div key={word.i} className="word">
                        {word.w.map(letter => {
                            return <div key={letter.i} className={`letter filled ${letter.s}`} >{letter.c}</div>
                        })}
                    </div>
                )
            })}

            <div className="word">
                { guesses.length < 6 ? padCurrentGuess().map(letter => {
                    return <div key={letter.i} className={`letter ${letter.c.length > 0 ? 'filling' : 'empty'}`}>{letter.c}</div>
                }) : ''}
            </div>

            {padGuessed().map(word => {
                return (
                    <div key={word.i} className="word">
                        {word.w.map(i => {
                            return <div key={i} className="letter empty"></div>
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default Grid