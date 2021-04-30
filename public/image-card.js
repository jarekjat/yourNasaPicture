

export default class ImageCard extends HTMLElement{
    constructor(imgSrc, title, date){
        super();

        const newDiv = document.createElement("div")
        newDiv.classList.add("image-div")
        const newForm = document.createElement("form")
        newForm.action = "/APOD/" + date
        const newImg = document.createElement("input")
        newImg.type = "image"
        newImg.src = imgSrc
        newImg.alt = title
        newImg.classList.add("image-outline")
        const newTitle = document.createElement("p")
        newTitle.textContent = title
        const newDate = document.createElement("span")
        newDate.textContent = date
        newForm.appendChild(newImg)
        newForm.appendChild(newTitle)
        newForm.appendChild(newDate) 
        newDiv.appendChild(newForm)
        this.appendChild(newDiv)
    }
    attributeChangedCallback(name, oldValue, newValue){

    }
    connectedCallback(){
        console.log("Connected Callback");
    }
    disconnectedCallback(){
        console.log("Disconnected callback");
    }
    
}
customElements.define('image-card',ImageCard);