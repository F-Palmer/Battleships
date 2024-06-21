function startGame(){
    console.log("start game")
    let difficultyLevel = document.getElementById("selectDifficulty").value 
    if(difficultyLevel != ""){
        fetch(`/startGame` , { headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ difficultyLevel : difficultyLevel})
        })
        console.log("battleship.html")
        document.location.href = "/battleships.html"
        console.log("battleship.html")

    }else{
        
    }
}