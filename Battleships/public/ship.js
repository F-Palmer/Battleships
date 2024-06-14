 class ship{
    degreeRotated
    constructor(id, name, element, length){
        this.id = id
        this.name = name
        this.element = element
        this.length = length
        this.remainingFields = length
    } 
    
    setElement(element) {
        this.element = element;
    }

    setDegreeRotated(degreeRotated){
        this.degreeRotated =  degreeRotated
    }
}