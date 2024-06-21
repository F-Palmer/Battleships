
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
const amountOfRows = 8

 container1.style.width = `${squareWidth * amountOfRows}px`
 container1.style.height = `${squareWidth * amountOfRows}px`

 container2.style.width = `${squareWidth * amountOfRows}px`
 container2.style.height = `${squareWidth * amountOfRows}px`


 container1.style.minWidth = `${squareWidth * amountOfRows}px`
 container1.style.minHeight = `${squareWidth * amountOfRows}px`

 container2.style.minWidth = `${squareWidth * amountOfRows}px`
 container2.style.minHeight = `${squareWidth * amountOfRows}px`
const Player = 0;
const computer = 1;

let turn = Player

/*
const gameBoardPlayer = []
const gameBoardComputer = []
*/
let FieldsOccupied = []



const ships = [ new ship("ship0", "destroyer", 2),  new ship("ship1", "submarine", 3),  
                new ship("ship2", "cruiser", 3),  new ship("ship3", "battleship", 4), 
                new ship("ship4", "carrier", 5)]

const shipsComputer = [ new ship("ship0", "destroyer", 2),  new ship("ship1", "submarine", 3),  
                new ship("ship2", "cruiser", 3),  new ship("ship3", "battleship", 4), 
                new ship("ship4", "carrier", 5)]


function startGame(){

}

setShipElements()
addShipEventListener()
fillContainer(container1)
fillContainer(container2)
addEventListener()
containerEventListener()
/*
fillgameBoard(gameBoardPlayer)
fillgameBoard(gameBoardComputer)
setComputerShips()
*/

//Frontend
/*
function fillgameBoard(gameBoard){
    for( let i = 0; i < amountOfRows * amountOfRows; i++){
        gameBoard[i] = new fieldProperty(false, false);
    }
}
*/

function setShipElements(){
    for(ship of ships){
        const shipElement = document.createElement("img")
        shipElement.id = ship.id
        shipElement.classList.add(ship.name)
        shipElement.classList.add("ship")
        shipElement.src = "./Images/schlachtschiff.png"
        shipContainer.append(shipElement)
    }
}
function containerEventListener(){
    container2.addEventListener('click', event => {
        mouseX2 = event.clientX - container2.getBoundingClientRect().x 
        mouseY2 = event.clientY - container2.getBoundingClientRect().y 
        let IdOfField = getMousePositionX() + getMousePositionY() * amountOfRows

        console.log("click "+ IdOfField)

        fetch("http://localhost:8000/ping" , {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: "POST",
            body: JSON.stringify({ message: "ping"})
        })
        .then(response => console.log("Pingpong") )
     

        //Backend
        if(turn == Player){
            hitField( IdOfField)
            //turn = computer
            //setTimeout(() =>hitRandomField(),200)
        }
            
        
    })
}



//Backend
function hitField( IdOfField){
    let color;
    console.log("hit "+ IdOfField)
    fetch("http://localhost:8000/hitField/Player" , { headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ IdOfField: `${IdOfField}`})
    })
    .then(response => response.json() )
    .then(data => {
        console.log("paint "+ IdOfField)
        console.log(data)
        if(data.alreadyHit == false){
        
            if(data.hitShip == true){
                color = "red"
            }else{
                color = "darkblue"
            }
            
            if(data.shipSunk != false ){
                paintShipImage(data.shipSunk)
            }
            getField(container2, IdOfField).style.backgroundColor = color //Frontend: return Field color



        fetch("http://localhost:8000/hitField/Computer" , { headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
            method: "GET",
        })
        .then(response => response.json() )
        .then(data => {

            
            if(data.alreadyHit == false){
        
                if(data.hitShip == true){
                    color = "red"
                }else{
                    color = "darkblue"
                }
                
                getField(container1, data.IdOfField).style.backgroundColor = color 
            }
    
        })



        }
    })
    console.log("after fetch")
}



//Frontend
function addShipEventListener(){
    for( let shipElement of Array.from(document.getElementById('shipContainer').children)){

        shipElement.addEventListener('dragstart', e => {
            
            
            draggedShip = getShipById(`${e.target.id}`)
/*
            fetch("http://localhost:8000/draggedShip" , {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                method: "POST",
                body: JSON.stringify({ ShipId: `${e.target.id}`})
            })
            .then(response => response.json() )
            //.then(ship => {draggedShip = ship})
*/
            
            mouseX = e.clientX - shipElement.getBoundingClientRect().x 
            mouseY = e.clientY - shipElement.getBoundingClientRect().y 
            
        }) 
    }
}


function addEventListener(){
    for ( const field of Array.from(container1.children)){

        
        field.addEventListener('dragover', event =>{

            
            if(isSetShipAllowed(parseInt(field.id) - getFieldShift(draggedShip), draggedShip) == true){
                event.preventDefault()
            } 
             
        })
        
   
        field.addEventListener('drop', event =>{
            getShipElement(draggedShip.id).classList.add("unselectable")
            //draggedShip.setDegreeRotated(degreeRotated)
            let FieldAppendShipTo = parseInt(field.id) - getFieldShift(draggedShip)

            getField(container1,FieldAppendShipTo).prepend(getShipElement(draggedShip.id))




            fetch("http://localhost:8000/setShip" , {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                method: "POST",
                body: JSON.stringify({ FieldAppendShipTo: `${FieldAppendShipTo}`, ship: draggedShip})
            })
            addOccupiedFields(FieldAppendShipTo, draggedShip)
            
            //addFieldProperty(getShipPosition(FieldAppendShipTo, draggedShip), draggedShip)
        })
    }
}

function shipWithinTheBoard(field){
    if(draggedShip.degreeRotated == 0){
        if(Math.floor((field + parseInt(draggedShip.length) - 1) / amountOfRows) != Math.floor(field/ amountOfRows)){
            return false
        }
    }else if(draggedShip.degreeRotated == 90){
        if(field < 0 || field + (parseInt(draggedShip.length) - 1) * amountOfRows > amountOfRows * amountOfRows - 1){
            return false
        }
    }
    return true
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
    for( const ship of Array.from(document.getElementById('shipContainer').children)){


    }
    const shipsLeftToPlace = Array.from(document.getElementById('shipContainer').children)
    for(const shipElement of shipsLeftToPlace){

        const ship = ships.find(ship => ship.id == shipElement.id) 
        switch(ship.degreeRotated) {
            case 0:
                ship.setDegreeRotated(90)
                break;
            case 90:
                ship.setDegreeRotated(0)
                break;
        }
        console.log()
        shipElement.style.transform=`rotate(${ship.degreeRotated}deg)`
    }    
}

function isSetShipAllowed(field, ship){
    if(ship.degreeRotated == 0){
        if(Math.floor((field + parseInt(ship.length) - 1) / amountOfRows) != Math.floor(field/ amountOfRows)){
            return false
        }
    }else if(ship.degreeRotated == 90){
        if(field < 0 || field + (parseInt(ship.length) - 1) * amountOfRows > amountOfRows * amountOfRows - 1){
            return false
        }
    }
    console.log(getShipPosition(field, ship).some(IdOfField => FieldsOccupied.includes(IdOfField)))
    return !(getShipPosition(field, ship).some(IdOfField => FieldsOccupied.includes(IdOfField)))
    
}

function getFieldShift(draggedShip){
    if(draggedShip.degreeRotated == 0){
        return getDraggedPositionX()
    }else if(draggedShip.degreeRotated == 90){
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
        if(ship.id == id){
            return ship
        }
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


function getField(container , id){
    fields = Array.from(container.children)
    for( let field of fields){
        if(field.id == id){
            return field
        }
    }
}

/*
function addFieldProperty(shipPositions, ship){
    for( let shipPosition of shipPositions){
        gameBoardPlayer[shipPosition].setShip(ship)
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

function addFieldPropertyComputer(shipPositions, ship){
    for( let shipPosition of shipPositions){
        gameBoardComputer[shipPosition].setShip(ship)
    }
}
*/
/*
function setShipColorGrey(ship, gameBoard, container){
    for( let i = 0 ; i < amountOfRows* amountOfRows; i ++){
        if(gameBoard[i].ship == ship){
            getField(container, i).style.backgroundColor = "red"

        }
    }
}
*/

function paintShipImage(ship){

    console.log("shipPOSITION:"+ship.position)

    let fieldElement = Array.from(container2.children).find((element) => element.id == ship.position)
    const shipElement = document.createElement("img")
    shipElement.id = ship.id
    shipElement.classList.add(ship.name)
    shipElement.classList.add("ship")
    shipElement.src = "./Images/schlachtschiffDestroyed.png"
    shipElement.style.opacity = "1"
    shipElement.style.transform=`rotate(${ship.degreeRotated}deg)`
    fieldElement.append(shipElement)
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

/*
function hitRandomField(){
    if(turn == computer){    
        let randomField = Math.floor(Math.random() *(amountOfRows * amountOfRows));
        while(hitField(container1 , randomField, gameBoardPlayer) == false){
            randomField = Math.floor(Math.random() *(amountOfRows * amountOfRows));    
        }
        turn = Player
    }
}
*/
function getShipElement(id){
    for( let ship of Array.from(document.getElementById('shipContainer').children)){

        if(ship.id == id){
            return ship
        }
    }
}


function addOccupiedFields(IdOfField, ship){
    FieldsOccupied = FieldsOccupied.concat(getShipPosition(IdOfField, ship))
    console.log(FieldsOccupied)
}