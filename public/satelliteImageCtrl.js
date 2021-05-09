
const image = document.getElementById("satelliteImage");
const buttonGetSatImage = document.getElementById("getSatImageButton")
const latitudeInput = document.getElementById("latitudeInput")
const longitudeInput = document.getElementById("longitudeInput")
const todaysDate = new Date()
const dateInput = document.getElementById("dateInput")
buttonGetSatImage.addEventListener("click",async ()=>{
  const date = getFormattedDateString(dateInput.value?new Date(dateInput.value):todaysDate)
  document.body.style.cursor='wait'
  getSatelliteImage(date,getLongitudeValue(),getLatitudeValue())
});

(async function geoFindUser() {
    async function success(position) {
      const latitude  = position.coords.latitude.toFixed(2);
      const longitude = position.coords.longitude.toFixed(2);

      latitudeInput.value = latitude
      longitudeInput.value = longitude
      getSatelliteImage(getFormattedDateString(todaysDate),longitude,latitude)
    }
  
    function error() {
      console.log('Unable to retrieve your location')
    }
  
    if(!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser')
    } else {
      console.log('Locating…')
      navigator.geolocation.getCurrentPosition(success, error);
    }
  })()
  function getLatitudeValue(){
    return  document.querySelector('input[name="N/S"]:checked').value === document.getElementsByName("N/S")[0].value? +latitudeInput.value : -latitudeInput.value
  }
  function getLongitudeValue(){
    return  document.querySelector('input[name="E/W"]:checked').value === document.getElementsByName("E/W")[0].value? +longitudeInput.value : -longitudeInput.value
  }
  function getFormattedDateString(date){
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
  }
  async function getSatelliteImage(date, longitude, latitude){
    let response
    response = await fetch("/satellite/" + date + "/" + longitude + "/" + latitude)
    .then(response =>{
      console.log(response)
      return response.json()
  })
  .then(response =>{
    console.log(response)
    if(image.src) image.src = response.url
    else alert("Image for chosen date not found")
    document.body.style.cursor='default'
  })
  .catch(err=>{
    console.error(err);
    document.body.style.cursor='default'
  })
  }