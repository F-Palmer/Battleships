 
 
 
 
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