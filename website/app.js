/* Global Variables */
let baseURL = 'https://api.openweathermap.org/data/2.5/weather?q='
let apiKey= '&APPID=3d42d650d5ee6afd9dfb820e0f1d4ff4&units=metric'
// Create a new date instance dynamically with 
let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
let d = new Date();
let newDate = (d.getMonth()+1)+'.'+ d.getDate()+'.'+ d.getFullYear();
let day= days[d.getDay()];// generate the day of the week
if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {//fetching data from localstorage on reloading
    console.info( "This page is reloaded" );
    for (let i = 0; i < localStorage.length; i++){
    let data = JSON.parse(window.localStorage.getItem(localStorage.key(i)))
    console.log(data)
    updateUI(data)
}
  }
document.getElementById('generate').addEventListener('click',getData)
function getData (e) {
    e.preventDefault()
    document.getElementsByClassName('error')[0].innerHTML=''//reset the error message content
    const zipCode = document.getElementById('zip').value// getting the zip code or the city name value
    for (let i = 0; i < localStorage.length; i++){
        if (localStorage.key(i)== zipCode){
            return document.getElementsByClassName('error')[0].innerHTML=`You already know the weather on ${zipCode}`
        }}
    getWeather(baseURL,zipCode,apiKey)
    .then(
        function(data){
            console.log(data)
            window.localStorage.setItem(zipCode,JSON.stringify(data))//addind data to localstorage
            const {name, sys, weather } = data// getting the weather data from the api
            console.log( name, sys, weather )
            updateUI(data)
        }
    ).catch((error)=>{
        document.getElementsByClassName('error')[0].innerHTML='Please Enter a valid City!'
        console.log('errors',error)// catching errors and send a message with it
    })
}

const getWeather = async (baseURL,zipCode,apiKey) => {// fetching data from the weather api
    const res = await fetch(baseURL+zipCode+apiKey)
    try {
        const data = await res.json()
        console.log(data)
        return data
    } catch(error){
        console.log('error',error)
    }
}

function updateUI(data) {// updating the ui with the new data from user and api
        document.getElementById('zip').value=''
        const icon = `https://openweathermap.org/img/wn/${data.weather[0]["icon"]}@2x.png`;// getting the weather icons from openweathermap web app
        const li = document.createElement('li')
        const cities=document.querySelector('.cities')
        li.classList.add('city')
        li.innerHTML=`<div id = "entryHolder" tabindex="1">
        <h2 class="city-name" tabindex="1">
          <span class="name" tabindex="1">${data.name}</span>
          <sup class="sys" tabindex="1">${data.sys.country}</sup>
        </h2>
        <div class="date" id = "date" tabindex="1"><span tabindex="1">${day}</span>&nbsp;${newDate}</div> 
        <div class="temp" id ="temp" tabindex="1">${Math.round((data.main.temp))}<sup tabindex="1">°C</sup></div>
          <figure>
            <img class="city-icon" src=${icon} tabindex="1" alt="${data.weather[0]['description']}image">
            <figcaption class="weather" tabindex="1">${data.weather[0]['description']}</figcaption>
          </figure>
    </div>`
        cities.appendChild(li)
}
//register service worker
navigator.serviceWorker
            .register('sw.js')
            .then(function(){console.log('Service worker registerd')})
            .catch(function(error){
                console.log(error)
            })

// installing app events
var promptEvt = 0
window.addEventListener('beforeinstallprompt',evt=>{
    evt.preventDefault();
    promptEvt = evt
    if(promptEvt !== undefined){
        promptEvt.prompt()
        promptEvt.userChoice.then(choice=>{
            var message = choice.outcome === 'dismissed'
            ? 'User cancelled'
            : 'User installed';
    
            console.log(message)
        })
    }
    return false
})


