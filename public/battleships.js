
const container1 = document.getElementById('container1')
const container2 = document.getElementById('container2')

const shipContainer = document.getElementById("shipContainer")

const gameStartDialog = document.getElementById("gameStartDialog")
const divdialog = document.getElementById("divdialog")

const gameEndDialog = document.getElementById("gameEndDialog")


const startGameButton = document.getElementById("startGameButton")

let draggedShip;
let mouseX;
let mouseY;

let mouseX2;
let mouseY2;

let winner = "";

const ships = [ new ship("ship0", "destroyer", 2),  new ship("ship1", "submarine", 3),  
new ship("ship2", "cruiser", 3),  new ship("ship3", "battleship", 4), 
new ship("ship4", "carrier", 5)]

const squareWidth = 50;
const amountOfRows = 10

let FieldsOccupied = []

function startGame(){
    if(Array.from(shipContainer.children).length === 0){
        containerEventListener()
        document.getElementById("divGameStartDialog").innerHTML ="<p> Game started!<p/>"
        startGameButton.classList.add("hidden")
    }else{
        document.getElementById("divGameStartDialog").innerHTML ="<p> Place all ships to start the Game!<p/>"
        
    }
    gameStartDialog.show()

}



setContainerStyle(container1)
setContainerStyle(container2)

setShipElements()
addShipEventListener()
fillContainer(container1)
fillContainer(container2)
addEventListener()


function closeGameStartDialog(){
    gameStartDialog.close()
}

function closeGameEndDialog(){
    document.location.href = "/"
    gameEndDialog.close()
}

function repeatGameEndDialog(){
    document.location.href = "/battleships.html"
    gameEndDialog.close()
}

function setContainerStyle(container){
    container.style.width = `${squareWidth * amountOfRows}px`
    container.style.height = `${squareWidth * amountOfRows}px`
    container.style.minWidth = `${squareWidth * amountOfRows}px`
    container.style.minHeight = `${squareWidth * amountOfRows}px`
}

function setShipElements(){
    for(ship of ships){
        const shipElement = document.createElement("img")
        shipElement.id = ship.id
        shipElement.classList.add(ship.name)
        shipElement.classList.add("ship")
        shipElement.setAttribute("alt", ship.name)
        shipElement.src = "/Images/schlachtschiff.png"
        shipContainer.append(shipElement)
    }
}
function containerEventListener(){

    let fieldElementArray = Array.from(container2.children)
        
        for(let i = 0; i < amountOfRows * amountOfRows; i ++){
            fieldElementArray[i].addEventListener('click', event => {
                if( winner == ""){
                    // console.log("click")
                    // mouseX2 = event.clientX - container2.getBoundingClientRect().x 
                    // mouseY2 = event.clientY - container2.getBoundingClientRect().y 
                    let IdOfField = parseInt(fieldElementArray[i].id)
                    console.log(IdOfField)
                    
                    hitField( IdOfField)      
                }
            })
        }
}


function hitField( IdOfField){
    let color;
    console.log("before fetch")
    fetch(`/hitField/Player/${IdOfField}` , { headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: "GET",

    })
    .then(response => response.json() )
    .then(data => {
        console.log("in fetch")
            winner = data.winner;
        
            if(data.alreadyHit == false){
                console.log("color")
                if(data.hitShip == true){
                    color = "red"
                }else{
                    color = "darkblue"
                }
                
                if(data.shipSunk != false ){
                    paintShipImage(data.shipSunk)
                }
                getField(container2, IdOfField).style.backgroundColor = color 



                fetch("/hitField/Computer" , { headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
                    method: "GET",
                })
                .then(response => response.json() )
                .then(data => {

                    winner = data.winner;
                    
                    if(data.alreadyHit == false){
                
                        if(data.hitShip == true){
                               color = "red"
                        }else{
                            color = "darkblue"
                        }
                            
                        getField(container1, `0${data.IdOfField}`  ).style.backgroundColor = color 
                    }
                    showDialog()
                })
            }
            showDialog()
    })
}


function showDialog(){
    if(winner != "" ){
        document.getElementById("divGameEndDialog").innerHTML ="<p> "+ winner +" Won!<p/>"
        gameEndDialog.show()
    }
}


function addShipEventListener(){
    for( let shipElement of Array.from(document.getElementById('shipContainer').children)){

        shipElement.addEventListener('dragstart', e => {
            
            
            draggedShip = getShipById(`${e.target.id}`)
            
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
            let FieldAppendShipTo = parseInt(field.id) - getFieldShift(draggedShip)

            getField(container1, `0${FieldAppendShipTo}`).prepend(getShipElement(draggedShip.id))



            fetch("/setShip" , {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                method: "POST",
                body: JSON.stringify({ FieldAppendShipTo: `${FieldAppendShipTo}`, ship: draggedShip})
            })
            addOccupiedFields(FieldAppendShipTo, draggedShip)
            
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
        if(container == container1){
            field.id = `0${i}`

        }else{

            field.id = i
        }
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


function paintShipImage(ship){
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




function getShipElement(id){
    for( let ship of Array.from(document.getElementById('shipContainer').children)){

        if(ship.id == id){
            return ship
        }
    }
}


function addOccupiedFields(IdOfField, ship){
    FieldsOccupied = FieldsOccupied.concat(getShipPosition(IdOfField, ship))
}