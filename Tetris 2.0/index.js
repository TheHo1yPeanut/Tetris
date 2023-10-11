
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


            currentBlock[subBlock][key] = value;

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
    checkForLines();
    spawnBlock();
}


function checkForLines(){

    let linesToBeChecked = [];
    let linesToBeDestroyed = [];
    let lineNotFull = false;

    for(const key in currentBlock){
        if(!linesToBeChecked.includes(currentBlock[key].row)){
            linesToBeChecked.push(currentBlock[key].row);
        }
    }

    for(let i = 0; i < linesToBeChecked.length; i++){

        lineNotFull = false; // this needs to get reset in order to not lock out the following rows

            for(let j = 1; j <= 10; j++){ // the width of one row is 10 blocks (i.e. 10 columns), so the loop goes through all 10 blocks to check if they're all set to "stat"
                if(!document.getElementById(`r${linesToBeChecked[i]}`).querySelector(`.c${j}`).classList.contains("stat") || lineNotFull){ // this checks for "stat", if it isn't present then lineNotFull = true which in turn then ignores the rest of the blocks
                    lineNotFull = true;
                }
            }

            if(!lineNotFull){ // if this is not true that means that the line is full as per the logic above, hence the line number aka the row number gets pushed into the "toBeDestroyed" array 
                linesToBeDestroyed.push(linesToBeChecked[i]);
            }
    }

    if(linesToBeDestroyed.length != 0){ // prevents unnecessary execution of further functions, if the length is 0 that means no lines need to be destroyed hence no reason to call the function
        destroyLines(linesToBeDestroyed);
    }

}

function destroyLines(arr){

    for(let i = 0; i < arr.length; i++){ // nested loop to move through rows and columns
            for(let j = 1; j <= 10; j++){
                document.getElementById(`r${arr[i]}`).querySelector(`.c${j}`).classList.remove("stat");
            }
    }

    moveLines(Math.max(...arr), arr.length);
}

function moveLines(n1, n2){ // input "n1" is the highest line that does not need to be moved, e.g. if lines 7 and 8 got broken, line 8 would then be highest line and everything above would be moved down. input "n2" is the length of the array of row numbers, this is used in order to define the amount of time the rows above need to be moved down
    for(let i = n1 + 1; i <= 20; i++){ // nested loop to move through rows and columns
        for(let j = 1; j <= 10; j++){
            if(document.getElementById(`r${i}`).querySelector(`.c${j}`).classList.contains("stat")){

                document.getElementById(`r${i}`).querySelector(`.c${j}`).classList.remove("stat");
                document.getElementById(`r${i - n2}`).querySelector(`.c${j}`).classList.add("stat");

            }
        }
    }
}

function gLoop(){
    if(checkForObstructionBottom(currentBlock)){
        moveBlockDown();
    }

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