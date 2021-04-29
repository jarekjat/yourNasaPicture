class ImageCard extends HTMLElement{
    constructor(){
        super();
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