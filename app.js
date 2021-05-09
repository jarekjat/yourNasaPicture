const express = require("express")
require('dotenv').config()
const axios = require("axios")
const app = express()

const ejs = require("ejs")
const bodyParser = require("body-parser")
const API_KEY = process.env.API_KEY
app.use("/public", express.static("public"))
app.use("/views", express.static("views"))
app.set('views', __dirname + '/views');
app.use(express({urlencoded:true}))
app.use(express.json())
app.set('view engine','ejs')
app.route("/").get((req, res)=>{
    //getEarthPictures()
    res.render("index.ejs")
})
app.route("/APOD/:articleDate").get(async (req,res)=>{
    getSpecificAPOD(req.params.articleDate)
    .then((response)=>{
        res.render("singleImageView",{
            title: response.title,
            date:response.date,
            copyright: response.copyright,
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
                                copyright: req.body.copyright,
                                explanation : req.body.explanation}) 
})
app.route("/satellite").get((req,res)=>{
    res.render("satelliteImage")
})
app.route("/satellite/:date/:longitude/:latitude").get(async (req,res)=>{
    const response = await getSattelliteImage(req.params.date, req.params.longitude, req.params.latitude)
    res.send(response)
})
app.route("/epic").get((req,res)=>{

    res.render("epic")
})

app.get("/APOD", async (req, res)=>{
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    const response = await getAPODPictures().then((response) => {
        console.log("response w app.get: " + response)
        console.log(typeof response)
        res.send(response)})
       
    
})
async function getSpecificAPOD(date){
       const  response = await axios.get("https://api.nasa.gov/planetary/apod?api_key=" + API_KEY + "&date=" + date)
        .then((response)=>{
            return response
        }).catch(()=> {return {data:{name: "Error", code: "503"}}})

    return response.data
}

async function getAPODPictures(){
    const count = 30
    console.log("This is server here! https://api.nasa.gov/planetary/apod?api_key=" + API_KEY + "&count=" + count.toString());

       const response = await axios.get("https://api.nasa.gov/planetary/apod?api_key=" + API_KEY + "&count=" + count.toString())
        .then((response)=>{
            console.log(response.data);
            console.log("End of server logging")
            return response
        })
        .catch((reason)=> {
            console.log(reason)
            return {data:{name: "Error", code: "503"}}})
        
    return response.data
}
async function getSattelliteImage(date, longitude, latitude){
    const dim = 0.4
    console.log("https://api.nasa.gov/planetary/earth/assets?api_key=" + API_KEY + "&lon=" + longitude + "&lat=" + latitude + "&date=" + date + "&dim=" + dim)
   const response = await axios.get("https://api.nasa.gov/planetary/earth/assets?api_key=" + API_KEY + "&lon=" + longitude + "&lat=" + latitude + "&date=" + date + "&dim=" + dim)
   .then(response => response)
   .catch((reason) =>  {//console.log(reason)
     return {data:{name: "Error", code: "503"}}})
   return response.data
}
app.listen(process.env.PORT || 3000, function(){
    console.log("Listening on port 3000");
})