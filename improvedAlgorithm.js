let shotStatus = 1; 
let nextPossibleHits = [];

function getNextField(difficulty){
    let field;
    if(shotStatus == 1){

        let rand = Math.random();
        
        if(rand>difficulty){

            do{
                field = Math.floor(Math.random() * (amountOfRows * amountOfRows));
                console.log("1")
            }while(gameBoardPlayer[field].hit)

            gameBoardPlayer[field].hit = true;

            if(gameBoardPlayer[field].ship){

                if(gameBoardPlayer[field].ship.remainingFields == 0){
                    shotStatus = 1;
                    return field;
                }else{
                    shotStatus = 2;
                    getAllAdjacentFields(field); 
                    console.log(nextPossibleHits);
                    return field;
                }
            }else{
                shotStatus = 1;
                return field;
            }
        }else{

            do{
                field = Math.floor(Math.random() * (amountOfRows * amountOfRows));
                console.log("2")
            }while(!gameBoardPlayer[field].ship || gameBoardPlayer[field].hit)

            gameBoardPlayer[field].hit = true;

            if(gameBoardPlayer[field].ship.remainingFields == 0){
                shotStatus = 1; 
                return field;
            }else{
                shotStatus = 2; 
                getAllAdjacentFields(field);
                console.log(nextPossibleHits);
                return field;
            }
        }
    }else{
        
        do{

            let nextFieldPossition = nextPossibleHits.pop();
            let tmpRow = nextFieldPossition.row;
            let tmpColum = nextFieldPossition.colum;
            field = rowColumToNumber(tmpRow, tmpColum); 
            console.log("3")

        }while(gameBoardPlayer[field].hit)

        if(gameBoardPlayer[field].ship){

            if(gameBoardPlayer[field].ship.remainingFields == 1){
                
                nextPossibleHits.splice(0, nextPossibleHits.length);
                shotStatus = 1;
                gameBoardPlayer[field].hit = true;
                return field;
            }else{
                getAllAdjacentFields(field); 
                shotStatus = 2;
                gameBoardPlayer[field].hit = true;
                return field;
            }
        }else{
            shotStatus = 2; 
            gameBoardPlayer[field].hit = true; 
            return field;
        }
    }

}

function getAllAdjacentFields(field){
    let row = numberToRow(field);
    let colum = numberToColum(field);

    let rowTmp; 
    let columTmp;

    if(row+1 < 10){

        let fieldTop = rowColumToNumber(row+1, colum);

        if(!gameBoardPlayer[fieldTop].hit){
            rowTmp = row+1;
            columTmp = colum;
            nextPossibleHits.push(new pos(rowTmp, columTmp)); 
        }
    }
    
    if(row-1 > -1){

        let fieldBottom = rowColumToNumber(row-1, colum);

        if(!gameBoardPlayer[fieldBottom].hit){
            rowTmp = row-1;
            columTmp = colum;
            nextPossibleHits.push(new pos(rowTmp, columTmp)); 
        }
    }
    
    if(colum+1 < 10){

        let fieldRight = rowColumToNumber(row, colum+1);

        if(!gameBoardPlayer[fieldRight].hit){
            rowTmp = row;
            columTmp = colum+1;
            nextPossibleHits.push(new pos(rowTmp, columTmp)); 
        }
    }
    
    if(colum-1 > -1){

        let leftRight = rowColumToNumber(row, colum-1);

        if(!gameBoardPlayer[leftRight].hit){
            rowTmp = row;
            columTmp = colum-1;
            nextPossibleHits.push(new pos(rowTmp, columTmp)); 
        }
    }
}

function temp(){
    
    let nextField = getNextField(0.1); 
    console.log(shotStatus + " " + nextField);
    hitFieldComputer(container1 , nextField, gameBoardPlayer);
    turn = Player;

    console.log("_______________");
}

function hitFieldComputer(container, IdOfField, gameBoard){
    
        let color;
        let currentShip = gameBoard[IdOfField].ship

        if(currentShip == false){

            color = "darkblue"
        }else{
            currentShip.remainingFields--;
            if(currentShip.remainingFields > 0){
                color = "red"
            }else{
                color = "red"
                
                if(turn == Player){
                    
                    paintShipImage(currentShip, gameBoard)
                }
            }
        }
        getField(container, IdOfField).style.backgroundColor = color
        checkForWin(shipsComputer)
        checkForWin(ships)
    
}
