
import Toastify from './toastify-js/src/toastify-es.js'



const state = {
    secret: '',
    grid: Array(5)
    .fill()
    .map(() => Array(4).fill('')),
    currentRow: 0,
    currentCol: 0,
    valid: false,
    letters: '',
    letterCount: '',
    over: false,
};


function randomWord(arr){
    let number = [];
    for (var i = 0 ; i  < arr.length; i++){
        let obj  = arr[i];
        for(var j = 0; j < obj.length; j++){
            let obj2 = obj[j];
            if(obj2.word.length == 4){
                
                number.push(obj2.word);
            }
        }
    }
    let index = Math.floor(Math.random()*number.length);
    return number[index];
}




async function getWord(){
    let arr = [];
    const call = await fetch(`https://api.datamuse.com/words?rel_trg=cow`);
    const words = await call.json();
    arr.push(words);
    for(var i = 0 ; i < words.length ; i++){
        var obj = words[i];
        var word = obj.word;
       
        const getWord = await fetch(`https://api.datamuse.com/words?rel_trg=${word}`);
        const json = await getWord.json();
        arr.push(json);
    }

    state.secret = randomWord(arr);
	return new Promise((resolve) => {
        console.log("this is secret " + state.secret);
        resolve();
    });
}


function getLetter(){
    let letters = state.secret.charAt(0);
    for(let i = 1 ; i < state.secret.length; i++){
        if(!letters.includes(state.secret.charAt(i))){
            letters = letters + state.secret.charAt(i);
        }
    }
    state.letters = letters;
    return new Promise((resolve) => {
        console.log("this is letters " + letters);
        resolve();
    });
}

function getLetterCount(){
    let count = "";
    for(let i = 0; i < state.letters.length; i++){
        let num = 0;
        for (let j = 0; j < state.secret.length; j++){
            if (state.letters.charAt(i) == state.secret.charAt(j)){
                num++;
            }
        }
        count = count + num.toString();
    }
    state.letterCount = count;
}


async function initialSteps(){
    const firstStep  = await getWord();
    const secondStep = await getLetter();
    getLetterCount();

}
initialSteps();

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
    if(!state.over){
        console.log("this is id "+ this.id);
        console.log(this.textContent);
        const id = this.id;
        if(id == "enter" || id == "backspace" ){
            if(id == "enter"){
                
                if (state.currentCol === 4){
                    const word = getCurrentWord();
                    if(word == state.secret){
                            revealWord(word);
                            
                    
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
    for (let i = 0; i < 5; i++){
        for (let j = 0; j< 4; j++){
            drawBox(grid, i ,j);
        }
    }

    container.appendChild(grid);

}


function registerKeyboardEvents(){

    document.body.onkeydown = (e) => {
        if (!state.over){
            const key = e.key;
            if(key === '5'){
                console.log(state.currentRow);
            }
            if(key === 'Enter'){
                
                if (state.currentCol === 4){
                    const word = getCurrentWord();
                    if(word == state.secret){
                        revealWord(word)
                        state.over = true;
                        
                        Toastify({
                            text: "YAY! Good Job.",
                            newWindow: true,
                            className: "end",
                            duration: -1,
                            newWindow: false,
                            position: "center",
                            destination: window.location.href
                            
                            
                
                        }).showToast();
                
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
        }
    };

}
function isLetter(key){
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter){
    if(state.currentCol === 4) return;
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


function guessLetters(word){
    let letters = word.charAt(0);
    for(let i = 1 ; i < 4; i++){
        if(!letters.includes(word.charAt(i))){
            letters = letters + word.charAt(i);
        }
    }
    return letters;
}

function guessLetterCount(guess, letters){
    let count = "";
    for(let i = 0; i < letters.length; i++){
        let num = 0;
        for (let j = 0; j < 4; j++){
            if (letters.charAt(i) == guess.charAt(j)){
                num++;
            }
        }
        count = count + num.toString();
    }
    return count;
}

function getPositions(letter, word){
    let positions = '';
    for(let i = 0; i< 4; i++){
        if (letter = word.charAt(i)) positions = positions + i.toString();
    }

    return positions;
}








function revealWord(guess){
    const row = state.currentRow;
  

    for(let i = 0; i < 4; i++){
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






    // const isGameOver = state.currentRow === 4;
    
  
    //     if (isGameOver && guess != state.secret){
    //     alert('YOU SUCK \n YOU NEED A LIFE \nTHE SECRET WORD WAS \n' + state.secret )
    //     }
   
    endGame();
    
 
}

function endGame(guess){
    let isGameOver = state.currentRow === 4;
    console.log(state.over);
    if(isGameOver){
        state.over =true;
        Toastify({
            text: "Game Over...ur bad...but nice try \n again? click me",
            newWindow: true,
            className: "end",
            duration: -1,
            newWindow: false,
            position: "center",
            destination: window.location.href
            
            

        }).showToast();
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
}

//anything you want that happens in the begining
startup();




