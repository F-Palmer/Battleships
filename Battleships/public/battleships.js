
const container1 = document.getElementById('container1')
const container2 = document.getElementById('container2')

const shipContainer = document.getElementById("shipContainer")
let draggedShip;
let mouseX;
let mouseY;

let mouseX2;
let mouseY2;
let degreeRotated = 0;

const squareWidth = 50;
let amountOfRows = 9


 container1.style.width = `${squareWidth * amountOfRows}px`
 container1.style.height = `${squareWidth * amountOfRows}px`

 container2.style.width = `${squareWidth * amountOfRows}px`
 container2.style.height = `${squareWidth * amountOfRows}px`

const Player = 0;
const computer = 1;

let turn = Player


const gameBoardPlayer = []
const gameBoardComputer = []



const ships = [ new ship("ship0", "destroyer", undefined, 2),  new ship("ship1", "submarine", undefined, 3),  
                new ship("ship2", "cruiser", undefined, 3),  new ship("ship3", "battleship", undefined, 4), 
                new ship("ship4", "carrier", undefined, 5)]

const shipsComputer = [ new ship("ship0", "destroyer", undefined, 2),  new ship("ship1", "submarine", undefined, 3),  
                new ship("ship2", "cruiser", undefined, 3),  new ship("ship3", "battleship", undefined, 4), 
                new ship("ship4", "carrier", undefined, 5)]


function startGame(){

}

setShipElements()
addShipEventListener()
fillContainer(container1)
fillContainer(container2)
fillgameBoard(gameBoardPlayer)
fillgameBoard(gameBoardComputer)
addEventListener()
containerEventListener()
setComputerShips()



function containerEventListener(){
        container2.addEventListener('click', event => {
        if(turn == Player){
            mouseX2 = event.clientX - container2.getBoundingClientRect().x 
            mouseY2 = event.clientY - container2.getBoundingClientRect().y 
            let IdOfField = getMousePositionX() + getMousePositionY() * amountOfRows
            if(gameBoardComputer[IdOfField].hit == false){
                hitField(container2, IdOfField, gameBoardComputer)
                turn = computer
                setTimeout(() =>hitRandomField(),200)
            }
            
        }
    })
}

function hitField(container, IdOfField, gameBoard){
    if(gameBoard[IdOfField].hit == false){
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
                //setShipColorGrey(currentShip, gameBoard, container)
                if(turn == Player){
                    paintShipImage(currentShip, gameBoard)
                }
            }


        }
        getField(container, IdOfField).style.backgroundColor = color
        gameBoard[IdOfField].hit = true

        checkForWin(shipsComputer)
        checkForWin(ships)

        return true
    }
    return false
}

function fillgameBoard(gameBoard){
    for( let i = 0; i < amountOfRows * amountOfRows; i++){
        gameBoard[i] = new fieldProperty(false, false);
    }
}

function setShipElements(){
    for(ship of ships){
        const shipElement = document.createElement("img")
        shipElement.id = ship.id
        shipElement.classList.add(ship.name)
        shipElement.classList.add("ship")
        shipElement.src = "./Images/schlachtschiff.png"
        shipContainer.append(shipElement)
        ship.setElement(shipElement)
    }
}


function addShipEventListener(){
    for(let i = 0; i <= ships.length - 1 ; i++){
        ships[i].element.addEventListener('dragstart', e => {
    
            draggedShip = getShipById(`${e.target.id}`)
            mouseX = e.clientX - draggedShip.element.getBoundingClientRect().x 
            mouseY = e.clientY - draggedShip.element.getBoundingClientRect().y 
            
        }) 
    }
}


function addEventListener(){
    for ( const field of Array.from(container1.children)){

        
        field.addEventListener('dragover', event =>{
            if(isSetShipAllowed(parseInt(field.id) - getFieldShift(), draggedShip, degreeRotated, gameBoardPlayer) == true){
                event.preventDefault()
            }    
        })
        
   
        field.addEventListener('drop', event =>{
            draggedShip.element.classList.add("unselectable")
            draggedShip.setDegreeRotated(degreeRotated)
            let FieldAppendShipTo = parseInt(field.id) - getFieldShift()
            getField(container1,FieldAppendShipTo).prepend(draggedShip.element)
            addFieldProperty(getShipPosition(FieldAppendShipTo, draggedShip.length, degreeRotated), draggedShip)

        })
    }
}

function fillContainer(container){

    for( let i = 0 ; i < amountOfRows * amountOfRows; i++){
        const field = document.createElement('div')
        field.classList.add('field')
        field.id = i
        container.append(field)
    }
}

function flip(){
    switch(degreeRotated) {
        case 0:
          degreeRotated = 90;
          break;
        case 90:
          degreeRotated = 0;
          break;
    }
    const shipsLeftToPlace = Array.from(document.getElementById('shipContainer').children)
    for(const ship of shipsLeftToPlace){
        ship.style.transform=`rotate(${degreeRotated}deg)`
    }    
}

function isSetShipAllowed(field, ship, degreeRot, gameBoard){
    if(degreeRot == 0){
        if(Math.floor((field + parseInt(ship.length) - 1) / amountOfRows) != Math.floor(field/ amountOfRows)){
            return false
        }
    }else if(degreeRot == 90){
        if(field < 0 || field + (parseInt(ship.length) - 1) * amountOfRows > amountOfRows * amountOfRows - 1){
            return false
        }
    }
    for(let shipPosition of getShipPosition(field, ship.length, degreeRot)){
        if(gameBoard[shipPosition].ship != false){
            return false
        }
    }
    return true
}

function getFieldShift(){
    if(degreeRotated == 0){
        return getDraggedPositionX()
    }else if(degreeRotated == 90){
        return getDraggedPositionY() *amountOfRows
    }
}
function getDraggedPositionX(){
    return Math.floor(mouseX / squareWidth) 
}

function getDraggedPositionY(){
    return Math.floor(mouseY / squareWidth)
}

function getMousePositionX(){
    return Math.floor(mouseX2 / squareWidth) 
}

function getMousePositionY(){
    return Math.floor(mouseY2 / squareWidth)
}

function getShipById(id){
    for(ship of ships){
        if(ship.element.id == id){
            return ship
        }
    }
}


function getShipPosition( shipPosistion , shipLength, degRotated){
    
    const shipPosistions = []
    for(let i = 0; i <= shipLength - 1; i++){
        if(degRotated == 0){
            shipPosistions[i] = (parseInt(shipPosistion) + i ) 
        }else if( degRotated == 90){
            shipPosistions[i] = (parseInt(shipPosistion) + i * amountOfRows)
        }
    }
    return shipPosistions
}

function addFieldProperty(shipPositions, ship){
    for( let shipPosition of shipPositions){
        gameBoardPlayer[shipPosition].setShip(ship)
    }
}

function getField(container , id){
    fields = Array.from(container.children)
    for( let field of fields){
        if(field.id == id){
            return field
        }
    }
}

function setComputerShips(){
    for(let ship of shipsComputer){
        let randomField;
        let randomDegreeRotated;
        do{
            randomField = Math.floor(Math.random() *(amountOfRows * amountOfRows));
            randomDegreeRotated = Math.round(Math.random()) * 90

        }while(isSetShipAllowed(randomField, ship, randomDegreeRotated, gameBoardComputer) == false)

        ship.setDegreeRotated(randomDegreeRotated)
        addFieldPropertyComputer(getShipPosition(randomField, ship.length, randomDegreeRotated), ship)
    }
}


function addFieldPropertyComputer(shipPositions, ship){
    for( let shipPosition of shipPositions){
        gameBoardComputer[shipPosition].setShip(ship)
    }
}

function setShipColorGrey(ship, gameBoard, container){
    for( let i = 0 ; i < amountOfRows* amountOfRows; i ++){
        if(gameBoard[i].ship == ship){
            getField(container, i).style.backgroundColor = "red"

        }
    }
}

function paintShipImage(ship, gameBoard){
    let field
    for(let i = 0; i < amountOfRows * amountOfRows; i ++){
        if(gameBoardComputer[i].ship == ship){
            field = i;
            break;
        }
    }

    let fieldElement = Array.from(container2.children).find((element) => element.id == field)
    const shipElement = document.createElement("img")
    shipElement.id = ship.id
    shipElement.classList.add(ship.name)
    shipElement.classList.add("ship")
    shipElement.src = "./Images/schlachtschiffDestroyed2.png"
    shipElement.style.opacity = "1"
    shipElement.style.transform=`rotate(${ship.degreeRotated}deg)`
    console.log(fieldElement +" "+ shipElement)
    fieldElement.append(shipElement)
    ship.setElement(shipElement)
}

function checkForWin(ships){
    for(let ship of ships){
        if(ship.remainingFields != 0){
            return false
        }
    }
    console.log("GAME ENDS")
    if(ships == shipsComputer){
        console.log("PLAYER WON!")
    }else if(ships == ships){
        console.log("COMPUTER WON!")
    }
    return true
}

function hitRandomField(){
    if(turn == computer){    
        let randomField = Math.floor(Math.random() *(amountOfRows * amountOfRows));
        while(hitField(container1 , randomField, gameBoardPlayer) == false){
            randomField = Math.floor(Math.random() *(amountOfRows * amountOfRows));    
        }
        turn = Player
    }
}
