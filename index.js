
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

function drop(){

    var dropNum = 0;
    var dropNums = [];

    for(const key in currentBlock){

        for(let i = 0; currentBlock[key].row - i != 0 && !document.getElementById(`r${currentBlock[key].row-i}`).querySelector(`.c${currentBlock[key].column}`).classList.contains("stat"); i++){
            console.log(document.getElementById(`r${currentBlock[key].row-i}`).querySelector(`.c${currentBlock[key].column}`).classList.contains("stat"));
            dropNum = i;
        }

        dropNums.push(dropNum);

    }

    console.log(dropNums);

    eraseCurrentBlock();

    for(const key in currentBlock){
        currentBlock[key].row = currentBlock[key].row - Math.min(...dropNums);
    }

    lockBlock();

}



//          !!!!!!!!!!!!   obstruction checks   !!!!!!!!!!!!

function checkForObstructionLeft(FcurrentBlock){
    for(const key in currentBlock){
        if(FcurrentBlock[key].column - 1 == 0 || document.getElementById(`r${FcurrentBlock[key].row}`).querySelector(`.c${FcurrentBlock[key].column-1}`).classList.contains("stat")){
            return false //obstructed
        } 
    }
    return true; //unobstructed
}

function checkForObstructionRight(FcurrentBlock){
    for(const key in currentBlock){
        if(FcurrentBlock[key].column + 1 == 11 || document.getElementById(`r${FcurrentBlock[key].row}`).querySelector(`.c${FcurrentBlock[key].column+1}`).classList.contains("stat")){
            return false //obstructed
        }
    }
    return true; //unobstructed
}

function checkForObstructionBottom(FcurrentBlock){
    for(const key in FcurrentBlock){

        if(FcurrentBlock[key].row - 1 == 0 || document.getElementById(`r${FcurrentBlock[key].row-1}`).querySelector(`.c${FcurrentBlock[key].column}`).classList.contains("stat")){
            slideLogic();
            return false //obstructed
        }
    }
    return true; //unobstructed
}

//          !!!!!!!!!!!!   obstruction checks   !!!!!!!!!!!!





function slideLogic(){
    const slideTimer = setTimeout(() => {
        for(const key in currentBlock){
            console.log(currentBlock[key].row);
            if(currentBlock[key].row-1 != 0){
                if(document.getElementById(`r${currentBlock[key].row-1}`).querySelector(`.c${currentBlock[key].column}`).classList.contains("stat")){
                    //i cant use checkForObstructionBottom() since that would in turn call slideLogic() creating an infinite loop
                    lockBlock();
                } else {
                    clearTimeout(slideTimer);
                }
            } else {
                lockBlock();
            }
        }
    }, slidetime);

}

function lockBlock(){
    for(const key in currentBlock){
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
    if(checkForObstructionBottom(currentBlock)){
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
    if(e.key == "ArrowLeft" && checkForObstructionLeft(currentBlock)){
        moveBlockLeft();
    } else if(e.key == "ArrowRight" && checkForObstructionRight(currentBlock)){
        moveBlockRight();
    } else if(e.key == "ArrowDown" && checkForObstructionBottom(currentBlock)){
        moveBlockDown();
    } else if(e.key == " "){
        console.log("dropping...")
        drop();
    }
})