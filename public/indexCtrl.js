import defaultExport from 'image-card.js';
let whetherFirstBatch = true
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
        if(whetherFirstBatch) whetherFirstBatch = false
        removeLoading()
        addMoreButton()
        populateWebsiteAndArray(response)
    })
})();
function addScrollListenerForWindow(){
    window.addEventListener("scroll",function(){
        if(window.scrollTop + window.innerHeight > document.innerHeight -100){
            initializeWebsite()
        }
    })
}
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
        const newDiv = document.createElement("div")
        newDiv.classList.add("image-div")
        newDiv.id = "APOD" + whichNumber.toString()
        const newForm = document.createElement("form")
        //newForm.method = "POST"
        newForm.body = picDiv
        newForm.action = "/APOD/" + picDiv.date.toString()
        const newImg = document.createElement("input")
        newImg.type = "image"
        newImg.src = picDiv.url
        newImg.alt = picDiv.title
        newImg.classList.add("image-outline")

        const newTitle = document.createElement("p")
        newTitle.textContent = picDiv.title
        const newDate = document.createElement("span")
        newDate.textContent = picDiv.date

        newForm.appendChild(newImg)
        newForm.appendChild(newTitle)
        newForm.appendChild(newDate) 
        newDiv.appendChild(newForm)
        // newForm.addEventListener("submit", (e)=>{
        //     console.log(APODdata);
        //     e.preventDefault()
        //     const data = new FormData()
        //     //JSON.stringify(APODdata[whichNumber])
        //     for(const key in APODdata[whichNumber]){
        //         data.append(key, APODdata[whichNumber][key])
        //     }
        //     let request = new XMLHttpRequest();
        //     request.open("POST", "/APOD/" + APODdata[whichNumber].date);
        //     //request.send(data);
        //     e.open(data)
        //     //postObjectAfterClick(newForm,APODdata[whichNumber])
        // })
        document.getElementById("APODwrapper").appendChild(newDiv)
}
// async function postObjectAfterClick(form,APODObject){

//     let oData = new FormData(form)

//     oData.append


//     post
//     console.log("postObjectAfterClick " + JSON.stringify(APODObject));
//     fetch("/APOD/" + APODObject.date,{
//         method:"POST",
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           },
//         redirect: 'follow',
//         body: JSON.stringify(APODObject)
//     })    .then((response) => {
//         // HTTP 301 response
//         // HOW CAN I FOLLOW THE HTTP REDIRECT RESPONSE?
//         console.log(response);
//         if (response.redirected) {
//             window.location.href = response.url;
//         }
//     }).catch(function(err) {
//             console.info(err + " url: " + url);
//         });
// }
async function renderAPODPictures(){
    const count = 30
    let response
    try{
        response = await fetch("/APOD", {
            method: "GET",
            mode: "cors"
        })
        .then((response) => {

            console.log("indexCtrl fetching");
            //console.log(response.json())
            //console.log(JSON.parse(response.body))
            console.log("End of indexCtrl fetching");
            return response.json()})
     }catch(err){
          console.log(err)
     }
    return response
}
