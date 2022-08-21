import Toastify from './toastify-js/src/toastify-es.js'

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
    const wait = await fetch('https://random-word-api.herokuapp.com/word?length=5');
    const word = await wait.json();
    state.secret = word[0];
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
function drawBox(container, row, col, letter= ''){
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;
    container.appendChild(box);
    return box;
}

function drawKey(container, row, col, letter = ''){
    const box = document.createElement('div');
    box.className = 'key';
    box.id = letter;
    box.textContent = letter;
    container.appendChild(box);
    return box;
}

function drawEnter(container, row, col){
    const box = document.createElement('div');
    box.className = 'enterkey keyboard3';
    box.id = `enter`;
    box.textContent = "enter";
    container.appendChild(box);
    return box;
}

function drawBackspace(container, row, col){
    const box = document.createElement('div');
    box.className = 'backspace keyboard3';
    box.id = `backspace`;
    container.appendChild(box);
    return box;
}

function clicked(){
    console.log("this is id "+ this.id);
    console.log(this.textContent);
    const id = this.id;
    if(id == "enter" || id == "backspace" ){
        if(id == "enter"){
            
            if (state.currentCol === 5){
                const word = getCurrentWord();
                if(word == state.secret){
                        revealWord(word);
                        alert('YAY CONGRAGULATIONS JK')
                   
                }
                else {isWordValid(word)}
            }
        }
        if (id === "backspace"){
            removeLetter();
        }
    }
    else{
        addLetter(this.textContent);
    }


    updateGrid();
}

function drawKeyboard(container){
    const row1 = document.createElement('div');
    row1.className = 'keyboard1';
    const firstrow = "qwertyuiop";
    for (let i = 0; i < 10; i++){
        drawKey(row1, 0, i, firstrow[i]).onclick = clicked;
       
    }
    container.appendChild(row1);
    const row2 = document.createElement('div');
    row2.className = 'keyboard2';
    const secondrow = "asdfghjkl";
    for (let i = 0; i < 9; i++){
        drawKey(row2, 1, i, secondrow[i]).onclick = clicked;
       
    }
    container.appendChild(row2);
    const row3 = document.createElement('div');
    row3.className = 'keyboard3';
    const thirdrow = "zxcvbnm";
    drawEnter(row3, 2, 0, 'enter').onclick = clicked;

    for (let i = 0; i < 7; i++){
        drawKey(row3, 2, i+1, thirdrow[i]).onclick = clicked;
       
    }
    drawBackspace(row3, 2,  8).onclick = clicked;
    
    
    container.appendChild(row3);
    
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
                if(word == state.secret){
                    revealWord(word)
                    alert('YAY CONGRAGULATIONS JK')
               
            }
            else {isWordValid(word)}
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
    if(word == "taser"){
        state.valid = true;
    }
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
        const key = document.getElementById(guess.charAt(i));
        console.log("this is the guess " + guess.charAt(i));
        const letter = box.textContent;

        if (letter === state.secret[i]){
            box.classList.add('right');
            key.classList.add('right');
            
        } else if (state.secret.includes(letter)){
            box.classList.add('wrong');

            key.classList.add('wrong');
        } else{
            box.classList.add('empty');
            key.classList.add('empty');


        }
    }

    const isGameOver = state.currentRow === 5;
    
  
        if (isGameOver && guess != state.secret){
        alert('YOU SUCK \n YOU NEED A LIFE \nTHE SECRET WORD WAS \n' + state.secret )
        }
 
}



async function errorPopUp(container){
    Toastify({
        text: "NOT A VALID WORD",
        duration: 2000,
        className: "textWhite",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          }
        
      }).showToast();


}


function startup() {
    const game = document.getElementById('game');
    drawGrid(game);
    registerKeyboardEvents();
    const keyboard = document.getElementById('keyboard')
    drawKeyboard(keyboard);
    console.log(state.secret);
}

//anything you want that happens in the begining
startup();




