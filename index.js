
var speed = 3000;
var slidetime = 1500;

var gameTimer;

var currentBlock = {};

const blocks = {
    testBlock: {
        block1: {
           row: 20,
           column: 5 
        },
        block2: {
            row: 20,
            column: 6
        },
        block3: {
            row: 19,
            column: 5 
        },
        block4: {
            row: 19,
            column: 6 
        }
    }
};

function spawnBlock(){
    gameTimer = setInterval(gLoop, speed);
    for(let i = 1; i < 5; i++){

        let subBlock = `block${i}`;

        currentBlock[subBlock] = {};

        for(let [key, value] of Object.entries(blocks.testBlock[subBlock])){

            console.log(blocks.testBlock);

            currentBlock[subBlock][key] = value;
            console.log(currentBlock[subBlock]);
        } // gives currentBlock all the values of blocks.testBlock (i hope), without making a reference to the original Object (had to make a nested loop in order too "deepcopy" correctly)
    }


    //god is dead, block1-4 are objects and hence get referenced in the currentBlock[key] = value; 

    for(const key in currentBlock){

        document.getElementById(`r${currentBlock[key].row}`).querySelector(`.c${currentBlock[key].column}`).classList.add("active");
    }
}

function eraseCurrentBlock(){
    for(const key in currentBlock){
        document.getElementById(`r${currentBlock[key].row}`).querySelector(`.c${currentBlock[key].column}`).classList.remove("active");
    }
}

function drawCurrentBlock(){
    for(const key in currentBlock){
        document.getElementById(`r${currentBlock[key].row}`).querySelector(`.c${currentBlock[key].column}`).classList.add("active");
    }
}

function moveBlockDown(){
    eraseCurrentBlock();
        for(const key in currentBlock){
            currentBlock[key].row -= 1;
        }
    drawCurrentBlock();
}

function moveBlockLeft(){
    eraseCurrentBlock();
        for(const key in currentBlock){
            currentBlock[key].column -= 1;
        }
    drawCurrentBlock();
}

function moveBlockRight(){
    eraseCurrentBlock();
        for(const key in currentBlock){
            currentBlock[key].column += 1;
        }
    drawCurrentBlock();
}

function checkForObstructionLeft(){
    for(const key in currentBlock){
        if(currentBlock[key].column - 1 == 0 || document.getElementById(`r${currentBlock[key].row}`).querySelector(`.c${currentBlock[key].column-1}`).classList.contains("stat")){
            return false //obstructed
        } 
    }
    return true; //unobstructed
}

function checkForObstructionRight(){
    for(const key in currentBlock){
        if(currentBlock[key].column + 1 == 11 || document.getElementById(`r${currentBlock[key].row}`).querySelector(`.c${currentBlock[key].column+1}`).classList.contains("stat")){
            return false //obstructed
        }
    }
    return true; //unobstructed
}

function checkForObstructionBottom(){
    for(const key in currentBlock){

        if(currentBlock[key].row - 1 == 0){
            return false //obstructed
        } else if(document.getElementById(`r${currentBlock[key].row-1}`).querySelector(`.c${currentBlock[key].column}`).classList.contains("stat")){
            slideLogic();
            return false //obstructed
        }
    }
    return true; //unobstructed
}

function slideLogic(){
    const slideTimer = setTimeout(() => {
        for(const key in currentBlock){
            if(document.getElementById(`r${currentBlock[key].row-1}`).querySelector(`.c${currentBlock[key].column}`).classList.contains("stat")){
                lockBlock();
            } else {
                clearTimeout(slideTimer);
            }
        }
    }, slidetime);

}

function lockBlock(){
    for(key in currentBlock){
        document.getElementById(`r${currentBlock[key].row}`).querySelector(`.c${currentBlock[key].column}`).classList.remove("active");
        document.getElementById(`r${currentBlock[key].row}`).querySelector(`.c${currentBlock[key].column}`).classList.add("stat");
    }

    clearInterval(gameTimer);
    spawnBlock();
}

function checkForLines(){
    return;
}

function gLoop(){
    if(checkForObstructionBottom()){
        moveBlockDown();
    }

    checkForLines();
    console.log(blocks.testBlock);
}

function gameStart(){

    spawnBlock();
}

gameStart();

addEventListener("keydown", (e) => {
    if(e.key == "ArrowLeft" && checkForObstructionLeft()){
        moveBlockLeft();
    } else if(e.key == "ArrowRight" && checkForObstructionRight()){
        moveBlockRight();
    } else if(e.key == "ArrowDown" && checkForObstructionBottom()){
        moveBlockDown();
    }
})