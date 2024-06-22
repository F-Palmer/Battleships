function startGame(){
    console.log("start game")
    let difficultyLevel = document.getElementById("selectDifficulty").value 
    if(difficultyLevel != ""){

        switch(difficultyLevel){
            case "easy":
                difficultyLevel = 0;
            case "medium":
                difficultyLevel = 0.1
            case "hard":
                difficultyLevel = 0.2
        }

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