function startGame(){
    console.log("start game")
    let difficultyLevel = document.getElementById("selectDifficulty").value 
    if(difficultyLevel != ""){
        fetch(`/setDifficultyLevel` , { headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ difficultyLevel : difficultyLevel})
        })
        
        fetch(`/startGame` , { headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: "GET"
        })



        console.log("battleship.html")
        document.location.href = "/battleships.html"
        console.log("battleship.html")

    }
}