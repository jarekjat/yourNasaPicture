import ImageCard from './image-card.js';
let APODdata = [];
let initializeWebsite
const loadingDiv = document.getElementsByClassName("lds-spinner")[0];
(initializeWebsite = async function(){
    addLoading()
    removeMoreButton()
    await renderAPODPictures()
    .then(response => {
        console.log(response)
        if(response.name && response.name == "Error"){
            printServerError()
            return
        }
        removeLoading()
        addMoreButton()
        populateWebsiteAndArray(response)
    })
})();
function addMoreButton(){
    const divId = "add-more-button"
    const newDiv = document.createElement("div")
    newDiv.id = divId 
    newDiv.classList.add("button-div")
    const newButton = document.createElement("button")
    newButton.addEventListener("click", (req, res)=>{
        initializeWebsite()
    })
    newButton.classList.add("more-button")
    newButton.textContent = "+"
    newDiv.appendChild(newButton)
    document.body.appendChild(newDiv)
}
function removeMoreButton(){
    if(document.getElementById("add-more-button")) document.getElementById("add-more-button").remove()
}
function populateWebsiteAndArray(response){
    for(let i = 0;i < response.length;++i){
        APODdata.push(response[i])
        console.log(response[i]);
        createWindow(response[i],i)
    }
}
function addLoading(){
    document.body.appendChild(loadingDiv)
}
function removeLoading(){
    document.getElementsByClassName("lds-spinner")[0].remove()
}
function printServerError(){
    const errorDiv = document.createElement("div")
    const errorParagraph = document.createElement("p")
    const errorImg = document.createElement("img")
    errorImg.src = "/public/images/error.png"
    errorParagraph.textContent = "There has been an error on the server side. Please visit us again soon."
    errorParagraph.classList.add("error-text")
    errorDiv.classList.add("error-div")
    errorDiv.appendChild(errorImg)
    errorDiv.appendChild(errorParagraph)
    document.body.appendChild(errorDiv)
}
async function createWindow(picDiv, whichNumber){
        const newImageContainer = new ImageCard(picDiv.url,picDiv.title,picDiv.date)
        document.getElementById("APODwrapper").appendChild(newImageContainer)
}

async function renderAPODPictures(){
    const count = 30
    let response
        response = await fetch("/APOD", {
            method: "GET",
            mode: "cors"
        })
        .then((response) => {
            console.log("End of indexCtrl fetching");
            return response.json()})
        .catch(err=>{
            console.error(err);
        })

    return response
}
