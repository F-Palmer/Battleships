
const fieldContainer1 = document.getElementById('fieldContainer1')
const fieldContainer2 = document.getElementById('fieldContainer2')

const shipContainer = document.getElementById("shipContainer")

const gameStartDialog = document.getElementById("gameStartDialog")
const divdialog = document.getElementById("divdialog")

const gameEndDialog = document.getElementById("gameEndDialog")

const startGameButton = document.getElementById("startGameButton")

let draggedShip;
let mouseX;
let mouseY;

let winner = "";

const ships = [ new ship("ship0", "destroyer", 2),  new ship("ship1", "submarine", 3),  
new ship("ship2", "cruiser", 3),  new ship("ship3", "battleship", 4), 
new ship("ship4", "carrier", 5)]



let FieldsOccupied = []


//Größe der Spielfeldcontainer wird festgelegt
const squareWidth = 50;
const amountOfRows = 10
setContainerStyle(fieldContainer1, squareWidth, amountOfRows)
setContainerStyle(fieldContainer2, squareWidth, amountOfRows)

//Die Spielfeldcontainer werden mit den einzelnen Feldern gefüllt
fillContainer(fieldContainer1)
fillContainer(fieldContainer2)

setShipElements()
addShipEventListener()

addEventListener()

//Funktionen
function startGame(){
    if(Array.from(shipContainer.children).length === 0){
        containerEventListener()
        document.getElementById("divGameStartDialog").innerHTML ="<p> Gefecht gestartet!<p/>"
        startGameButton.classList.add("hidden")
        document.getElementById("gamebtns").removeChild(document.getElementById("startGameButton"))
        document.getElementById("gamebtns").removeChild(document.getElementById("rotateShipsButton"))
        document.getElementById("gameContainer").removeChild(document.getElementById("shipContainer"))
    }else{
        document.getElementById("divGameStartDialog").innerHTML ="<p> Setze alle Schiffe um das Gefecht zu starten!<p/>"
        
    }
    gameStartDialog.showModal()

}

function repeatGameEndDialog(){
    fetch(`/startGame` , { headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
    method: "GET",
    })
    gameEndDialog.close()
    document.location.href = "/battleships.html"
    
}

function closeGameStartDialog(){
    gameStartDialog.close()
}

function closeGameEndDialog(){
    document.location.href = "/"
    gameEndDialog.close()
}

function setContainerStyle(container, squareWidth, amountOfRows){
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

    let fieldElementArray = Array.from(fieldContainer2.children)
        
        for(let i = 0; i < amountOfRows * amountOfRows; i ++){
            fieldElementArray[i].addEventListener('click', event => {
                if( winner == ""){
                    let IdOfField = parseInt(fieldElementArray[i].id)
                    hitField( IdOfField)      
                }
            })
        }
}

function hitField( IdOfField){
    let color;
    fetch(`/hitField/Player/${IdOfField}` , { headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
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
                
                if(data.shipSunk != false ){
                    paintShipImage(data.shipSunk)
                }
                getField(fieldContainer2, IdOfField).style.backgroundColor = color 



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
                            
                        getField(fieldContainer1, `0${data.IdOfField}`  ).style.backgroundColor = color 
                    }
                    showDialog()
                })
            }
            showDialog()
    })
}

function showDialog(){
    if(winner != "" ){
        document.getElementById("divGameEndDialog").innerHTML ="<p> "+ winner +" hat gewonnen!<p/>"
        gameEndDialog.showModal()
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
    for ( const field of Array.from(fieldContainer1.children)){

        
        field.addEventListener('dragover', event =>{

            
            if(isSetShipAllowed(parseInt(field.id) - getFieldShift(draggedShip), draggedShip) == true){
                event.preventDefault()
            } 
             
        })
        
   
        field.addEventListener('drop', event =>{
            getShipElement(draggedShip.id).classList.add("unselectable")
            let FieldAppendShipTo = parseInt(field.id) - getFieldShift(draggedShip)

            getField(fieldContainer1, `0${FieldAppendShipTo}`).prepend(getShipElement(draggedShip.id))



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

    for(let i = 0 ; i < amountOfRows * amountOfRows; i++){
        const field = document.createElement('div')
        field.classList.add('field')
        if(container == fieldContainer1){
            field.id = `0${i}`

        }else{

            field.id = i
        }
        container.append(field)
    }
}

function flip(){

    const shipsLeftToPlace = Array.from(document.getElementById('shipContainer').children)
    for(const shipElement of shipsLeftToPlace){

        const ship = ships.find(ship => ship.id == shipElement.id) 
        switch(ship.degreeRotated) {
            case 0:
                ship.setDegreeRotated(90)

                //sorgt dafür, dass der Container um die Schiffe größer wird, wenn diese rotiert werden
                document.getElementById('shipContainer').style.paddingBottom = "230px"
                break;
            case 90:
                ship.setDegreeRotated(0)

                //sorgt dafür, dass der Container um die Schiffe kleiner wird, wenn diese rotiert werden
                document.getElementById('shipContainer').style.paddingBottom = "30px"
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
    let fieldElement = Array.from(fieldContainer2.children).find((element) => element.id == ship.position)
    const shipElement = document.createElement("img")
    shipElement.id = `0${ship.id}`
    shipElement.classList.add(ship.name)
    shipElement.classList.add("ship")
    shipElement.setAttribute("alt", ship.name)
    shipElement.src = "/Images/schlachtschiffDestroyed.png"
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