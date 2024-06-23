function startGame(){
    let difficultyLevelText = document.getElementById("selectDifficulty").value 
    if(difficultyLevelText != ""){
        let difficultyLevel

        if(difficultyLevelText == "easy"){
            difficultyLevel = 0;
        }else if(difficultyLevelText == "medium"){
            difficultyLevel = 0.1;
        }else if(difficultyLevelText == "hard"){
            difficultyLevel = 0.2;
        }

        fetch(`/setDifficultyLevel` , { headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ difficultyLevel : difficultyLevel})
        })

        fetch(`/startGame` , { headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: "GET"
        })

        document.location.href = "/battleships.html"

    }else{
        document.getElementById("noDifficultySelectedDialogDiv").innerHTML='<p> Du musst einen Schwierigkeitsgrad wählen, bevor du das Spiel starten kannst!</p>'
        document.getElementById("noDifficultySelectedDialog").showModal()
    }
}

function backToIndex(){
    document.location.href = "/index.html"
}

function openAnleitung(){
    document.location.href = "/anleitung.html"    
}

function closeDialog(){
    document.getElementById("noDifficultySelectedDialog").close()
}