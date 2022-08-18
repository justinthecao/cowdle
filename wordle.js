const state = {
    secret: '',
    grid: Array(6)
    .fill()
    .map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
    valid: false
};



const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'b1c4a03d8bmsh447cb94a8464348p12e0d1jsn6a24161449b4',
		'X-RapidAPI-Host': 'random-words5.p.rapidapi.com'
	}
};
getWord()

async function getWord(){
    const wait = await fetch('https://random-words5.p.rapidapi.com/getRandom?wordLength=5', options);
    const word = await wait.text();
    state.secret = word;
	console.log("this is secret" + state.secret);
}



//synchronizes state and ui, you have an object state and this function compares the current state 
function updateGrid(){
    for (let i = 0; i < state.grid.length; i++){
        for(let j = 0; j < state.grid[i].length; j++){
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}


//takes four arguments container that it will be added, row column of grid, and the letter
function drawBox(container, row, col, letter=''){
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;
    container.appendChild(box);
    return box;
}

function drawGrid(container){
    const grid = document.createElement('div');
    grid.className = 'grid';
    for (let i = 0; i < 6; i++){
        for (let j = 0; j< 5; j++){
            drawBox(grid, i ,j);
        }
    }

    container.appendChild(grid);

}

function registerKeyboardEvents(){
    document.body.onkeydown = (e) => {
        const key = e.key;
        if(key === 'Enter'){
            if (state.currentCol === 5){
                const word = getCurrentWord();
                isWordValid(word)
            }
        }
        if (key === 'Backspace'){
            removeLetter();
        }
        if (isLetter(key)){
            addLetter(key);
        }


        updateGrid();
    };
}
function isLetter(key){
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter){
    if(state.currentCol === 5) return;
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter(){
    if(state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '' ;
    state.currentCol--;
}

function getCurrentWord(){
    return state.grid[state.currentRow].reduce((prev,curr) => prev+curr);
}

async function isWordValid(word){
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'b1c4a03d8bmsh447cb94a8464348p12e0d1jsn6a24161449b4',
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
        }
    };
    console.log(state.valid)
    const wait = await fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}`, options)
        .then(res => {if(res.ok) state.valid = true; else throw new Error(res.status)})
        .catch(response => {state.valid = false});
    console.log(state.valid)
    if(state.valid){
        revealWord(word);
        state.currentRow++;
        state.currentCol = 0;
        state.valid = false;
    } else{
        const game = document.getElementById('errors');
        errorPopUp(game);
    }
}

function revealWord(guess){
    const row = state.currentRow;

    for(let i = 0; i < 5; i++){
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        if (letter === state.secret[i]){
            box.classList.add('right');
        } else if (state.secret.includes(letter)){
            box.classList.add('wrong');
        } else{
            box.classList.add('empty');


        }
    }

    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 5;
    if (isWinner){
        alert('YAY CONGRAGULATIONS JK')
    }
    else{
        if (isGameOver){
        alert('YOU SUCK \n YOU NEED A LIFE \nTHE SECRET WORD WAS \n' + state.secret )
        }
    }   
}



async function errorPopUp(container){
    const popup = document.createElement('div');
    popup.className = 'errors';
    popup.textContent = "NOT A VALID WORD STUPID HEAD";
    container.appendChild(popup);


    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done!"), 2800)
    });
    await promise;
    popup.classList.toggle('show');


}


function startup() {
    const game = document.getElementById('game');
    drawGrid(game);
    registerKeyboardEvents();
    console.log(state.secret);
    
}

//anything you want that happens in the begining
startup();




