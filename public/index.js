function startGame(){
    let difficultyLevel = document.getElementById("selectDifficulty").value 
    if(difficultyLevel != ""){
        fetch(`/startGame` , { headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
        method: "POST",
        body: JSON.stringify({ difficultyLevel : difficultyLevel})
    })
    document.location.href = "/battleships.html"
    }
}