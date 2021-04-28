const express = require("express")
const axios = require("axios")
const app = express()
const ejs = require("ejs")
//const expressLayouts = require('express-ejs-layouts');
const bodyParser = require("body-parser")
const API_KEY = "f9awZEgOl40uWVlNWMMwkS7TK3YcB0rtghWcanMU"
app.use("/public", express.static("public"))
app.use("/views", express.static("views"))
app.set('views', __dirname + '/views');
app.use(express({urlencoded:true}))
app.use(express.json())
app.set('view engine','ejs')
//app.use(expressLayouts);
app.route("/").get((req, res)=>{
    //getEarthPictures()
    res.sendFile(__dirname + "/public/index.html")
})
app.route("/APOD/:articleDate").get(async (req,res)=>{
    let response = await getSpecificAPOD(req.params.articleDate)
    .then((response)=>{
        res.render("singleImageView",{
            title: response.title,
            date:response.date,
            explanation: response.explanation,
            hdurl: response.hdurl

        })
    })

}).post((req,res)=>{
    res.set({
        "type":"text/html",
        "redirected":"true"
    })
    console.log(req.body);
    res.render("singleImageView.ejs",{title: req.body.title, 
                                hdurl: req.body.hdurl,
                                date: req.body.date,
                                explanation : req.body.explanation}) 
})
app.get("/APOD", async (req, res)=>{
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    let response = "kupa tu jest"
    console.log(response);
    response = await getEarthPictures().then((response) => {
        console.log("response w app.get: " + response)
        console.log(typeof response)
        res.send(response)})
       
    
})
async function getSpecificAPOD(date){
    let response
    try{
        response = await axios.get("https://api.nasa.gov/planetary/apod?api_key=" + API_KEY + "&date=" + date)
        .then((response)=>{
            return response
        })
    }catch(error){
        return error
    }
    return response.data
}

async function getEarthPictures(){
    const count = 30
    console.log("This is server here! https://api.nasa.gov/planetary/apod?api_key=" + API_KEY + "&count=" + count.toString());
    let response
    try {
        response = await axios.get("https://api.nasa.gov/planetary/apod?api_key=" + API_KEY + "&count=" + count.toString())
        .then((response)=>{
            //response.json()
            console.log(response.data);
            console.log("End of server logging")
            return response
        })
    } catch (error) {
        console.log(error);
        return error;
    }
    return response.data
}

app.listen(process.env.PORT || 3000, function(){
    console.log("Listening on port 3000");
})