
const express = require("express")
const app = express()

app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded({extended : true }))


let winner = "";
let difficultyLevel = 0

const amountOfRows = 10

const gameBoardPlayer = []
const gameBoardComputer = []

const ships = []
const shipsComputer = []


app.get("/", (req, res) => {
    res.render("index")
    
    res.sendStatus(200)
})


app.post("/setDifficultyLevel", (req, res) => {
    
    difficultyLevel = req.body.difficultyLevel
    res.sendStatus(200)
})


app.get("/startGame", (req, res) => {
    winner = ""
    fillShips(ships)
    fillShips(shipsComputer)
    fillgameBoard(gameBoardPlayer)
    fillgameBoard(gameBoardComputer)
    setComputerShips()
    
    res.sendStatus(200)
})


app.get("/getShip/:id", (req, res) => {
    
    let id = req.params.id
    for(let ship of ships){
        if(ship.id == id){
            res.send({ ship : ship })
        }
    }
})

app.post("/setShip", (req, res) => {
    for(let ship of ships){
        if(req.body.ship.id == ship.id){
            ship.setDegreeRotated(req.body.ship.degreeRotated)
            addFieldProperty(getShipPosition(req.body.FieldAppendShipTo, ship), ship)
        }
    }
    res.sendStatus(200)
})

app.get("/hitField/Player/:id", (req, res) => {
    let IdOfField = req.params.id
    
    hitField(IdOfField, gameBoardComputer, res)
})

app.get("/hitField/Computer", (req, res) => {
    let IdOfField = getNextField(difficultyLevel)   
    hitField(IdOfField, gameBoardPlayer, res)
    
})


const port = 8000;
app.listen(port, () => {
    console.log(`Server started on ${port}`);
});

function fillShips(shipsArray){
    shipsArray[0] =  new ship("ship0", "destroyer", 2)
    shipsArray[1] =  new ship("ship1", "submarine", 3)
    shipsArray[2] = new ship("ship2", "cruiser", 3)
    shipsArray[3] = new ship("ship3", "battleship", 4)
    shipsArray[4] = new ship("ship4", "carrier", 5)
}

function hitField(IdOfField, gameBoard, res){
    if(winner == "" && gameBoard[IdOfField].hit == false){
        let shipSunk = false;
        let hitShip;
        let currentShip = gameBoard[IdOfField].ship
        if(currentShip == false){
            hitShip = false;
        }else{
            hitShip = true;
            currentShip.remainingFields--;
            if(currentShip.remainingFields == 0){
                shipSunk = currentShip;
            }
        }
        gameBoard[IdOfField].hit = true
        checkForWin(ships)
        checkForWin(shipsComputer)
        res.send({hitShip: hitShip, shipSunk: shipSunk, alreadyHit : false, IdOfField : IdOfField , winner : winner })
    }else{
        res.send({ alreadyHit : true , winner: winner})
    }
}


function fillgameBoard(gameBoard){
    for( let i = 0; i < amountOfRows * amountOfRows; i++){
        gameBoard[i] = new fieldProperty(false, false);
    }
}

function getShipPosition( shipPosistion , ship){
    
    const shipPosistions = []
    for(let i = 0; i <= ship.length - 1; i++){
        if(ship.degreeRotated == 0){
            shipPosistions[i] = (parseInt(shipPosistion) + i ) 
        }else if( ship.degreeRotated == 90){
            shipPosistions[i] = (parseInt(shipPosistion) + i * amountOfRows)
        }
    }
    return shipPosistions
}


function addFieldProperty(shipPositions, ship){
    ship.position = shipPositions[0]
    for( let shipPosition of shipPositions){
        gameBoardPlayer[shipPosition].setShip(ship)
    }
}

function addFieldPropertyComputer(shipPositions, ship){
    ship.position = shipPositions[0]

    for( let shipPosition of shipPositions){
        gameBoardComputer[shipPosition].setShip(ship)
    }
}


function setComputerShips(){
    for(let ship of shipsComputer){
        let randomField;
        let randomDegreeRotated;
        do{
            randomField = Math.floor(Math.random() *(amountOfRows * amountOfRows));
            randomDegreeRotated = Math.round(Math.random()) * 90
            ship.setDegreeRotated(randomDegreeRotated)

        }while(isSetShipAllowed(randomField, ship, gameBoardComputer) == false)

        addFieldPropertyComputer(getShipPosition(randomField, ship,), ship)
    }
}

function isSetShipAllowed(field, ship, gameBoard){
    if(ship.degreeRotated == 0){
        if(Math.floor((field + parseInt(ship.length) - 1) / amountOfRows) != Math.floor(field/ amountOfRows)){
            return false
        }
    }else if(ship.degreeRotated == 90){
        if(field < 0 || field + (parseInt(ship.length) - 1) * amountOfRows > amountOfRows * amountOfRows - 1){
            return false
        }
    }
    for(let shipPosition of getShipPosition(field, ship)){
        if(gameBoard[shipPosition].ship != false){
            return false
        }
    }
    return true
}

function checkForWin(currentships){
    for(let currentship of currentships){
        if(currentship.remainingFields != 0){
            return false
        }
    }
    
    if(currentships == shipsComputer){
        winner = "Player"
    }else if(currentships == ships){
        winner = "Computer"
    }
    return true
}










let shotStatus = 1; 
let nextPossibleHits = [];

function getNextField(difficulty){
    let field;
    if(shotStatus == 1){

        let rand = Math.random();
        
        if(rand>difficulty){

            do{
                field = Math.floor(Math.random() * (amountOfRows * amountOfRows));
            }while(gameBoardPlayer[field].hit)

            if(gameBoardPlayer[field].ship){

                if(gameBoardPlayer[field].ship.remainingFields == 0){
                    shotStatus = 1;
                    return field;
                }else{
                    shotStatus = 2;
                    getAllAdjacentFields(field); 
                    return field;
                }
            }else{
                shotStatus = 1;
                return field;
            }
        }else{

            do{
                field = Math.floor(Math.random() * (amountOfRows * amountOfRows));
            }while(!gameBoardPlayer[field].ship || gameBoardPlayer[field].hit)

            if(gameBoardPlayer[field].ship.remainingFields == 0){
                shotStatus = 1; 
                return field;
            }else{
                shotStatus = 2; 
                getAllAdjacentFields(field);
                return field;
            }
        }
    }else{
        
        do{

            let nextFieldPossition = nextPossibleHits.pop();
            let tmpRow = nextFieldPossition.row;
            let tmpColum = nextFieldPossition.colum;
            field = rowColumToNumber(tmpRow, tmpColum); 

        }while(gameBoardPlayer[field].hit)

        if(gameBoardPlayer[field].ship){

            if(gameBoardPlayer[field].ship.remainingFields == 1){
                
                nextPossibleHits.splice(0, nextPossibleHits.length);
                shotStatus = 1;
                return field;
            }else{
                getAllAdjacentFields(field); 
                shotStatus = 2;
                return field;
            }
        }else{
            shotStatus = 2; 
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


function numberToRow(number){
    let row = Math.floor(number/amountOfRows);
    return row;
}

function numberToColum(number){
    let colum = number % amountOfRows; 
    return colum;
}

function rowColumToNumber(row, colum){
    let number = row*10 + colum;
    return number;
}




class ship{
    degreeRotated = 0;
    position;
    constructor(id, name, length){
        this.id = id
        this.name = name
        this.length = length
        this.remainingFields = length
    } 

    setDegreeRotated(degreeRotated){
        this.degreeRotated =  degreeRotated
    }
    setPosition(position){
        this.position = position
    }

}
    
class fieldProperty{
    constructor(hit, ship){
        this.hit = hit 
        this.ship = ship
    }
    setShip(ship){
        this.ship = ship
    }
}

class pos{
    constructor(row, colum){
        this.colum = colum; 
        this.row = row;
    }
}