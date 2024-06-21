
const express = require("express")
const app = express()
let winner = "";
let difficultyLevel = "easy"


const amountOfRows = 10


const Player = 0;
const computer = 1;

let turn = Player


const gameBoardPlayer = []
const gameBoardComputer = []


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

function fillShips(shipsArray){
    shipsArray[0] =  new ship("ship0", "destroyer", 2)
    shipsArray[1] =  new ship("ship1", "submarine", 3)
    shipsArray[2] = new ship("ship2", "cruiser", 3)
    shipsArray[3] = new ship("ship3", "battleship", 4)
    shipsArray[4] = new ship("ship4", "carrier", 5)
}
const ships = []

const shipsComputer = [ new ship("ship0", "destroyer", 2),  new ship("ship1", "submarine", 3),  
new ship("ship2", "cruiser", 3),  new ship("ship3", "battleship", 4), 
new ship("ship4", "carrier", 5)]


app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded({extended : true }))

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/startGame", (req, res) => {
    difficultyLevel = req.body.difficultyLevel
    
    winner = ""
    fillShips(ships)
    fillShips(shipsComputer)
    fillgameBoard(gameBoardPlayer)
    fillgameBoard(gameBoardComputer)
    setComputerShips()
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
            addFieldProperty(getShipPosition(req.body.FieldAppendShipTo, ship), ship)
        }
    }
})

app.get("/hitField/Player/:id", (req, res) => {
    console.log("hitfiled1")
    let IdOfField = req.params.id

    hitField(IdOfField, gameBoardComputer, res)
    console.log("hitfiled2")
})

app.get("/hitField/Computer", (req, res) => {
    let IdOfField = getRandomField()
    hitField(IdOfField, gameBoardPlayer, res)

    

})


app.listen(8000)



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


function getRandomField(){
    let randomField
    do {
        randomField = Math.floor(Math.random() *(amountOfRows * amountOfRows));    
    } while (gameBoardPlayer[randomField].hit != false);
    return randomField
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