
//? get elements
const headerDate = document.querySelector(".header-date")
const headerTime = document.querySelector(".navbar-hour")
const weatherTodayGps = document.querySelector(".weather-today-gps")
const weatherTodayDate = document.querySelector(".weather-today-date")
const wrap = document.querySelector(".city-weather-week-wrap")

//* get location of user from url (lat and )
const getLocationOfUserFromUrl = () => {
    //* take lat and lon from url and put the in array
    const lat_lon = JSON.parse(localStorage.getItem("Geolocation"))
    
    //* check user gave his access of geo or no
    if (lat_lon) {
        return { lat, lon } = lat_lon
    } else 
        location.replace("ask-location.html")
}

//* upload weather boxes --> this function calls to all of the functions we need to call for upload weather datas
const uploadWeatherBoxInDom = ({ lat, lon }) => {
    const weatherDatas = getWeatherResponse({ lat, lon })
    
    wrap.innerHTML = ""
    const Fragment = new DocumentFragment()

    weatherDatas
    .then(res => {
        res.daily.forEach(dayObject => Fragment.appendChild(createWeatherDataBox(dayObject)))
        wrap.appendChild(Fragment)
    })
    .catch(console.error)
}

//? send request and return response
const makeRequest = (url) => {
    return fetch(url)
            .then(res => { if (res.ok) { return res.json() } })
}

//* request to one call api
const getWeatherResponse = ({ lat, lon }) => {
    //? API Setting
    const EXCLUDE = "hourly,minutely,current"
    const API_KEY = "af18dfbb2d163485e7669b46fb2f7c76"
    const API = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&exclude=${EXCLUDE}`
    
    //? request to api
    return makeRequest(API)
}

//* create weather data box
const createWeatherDataBox = (weatherResponse) => {
    const day = createDays(weatherResponse.dt)
    const humidity = weatherResponse.humidity
    const min_temp = weatherResponse.temp.min
    const pressure = weatherResponse.pressure

    const children_element_of_weather_box =
    `<h3 class="p-0 m-0">${day}</h3>
    <h3 class="p-0 m-0">${min_temp}k</h3>
    <h3 class="p-0 m-0">${humidity}% <i class="bi bi-droplet"></i></h3>
    <h3 class="p-0 m-0">${pressure}Pa</h3>
    <h3 class="p-0 m-0"><span class="more-info-span"><i class="bi bi-three-dots"></i></span></h3>`
    
    const weather_box = document.createElement("div")
    weather_box.classList.add("weather-week")
    weather_box.insertAdjacentHTML("beforeend", children_element_of_weather_box)
    
    return weather_box
}

//* create date
const createDate = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"]

    const nowDate = new Date()
    const yearNumber  = nowDate.getFullYear()
    const monthName = monthNames[nowDate.getMonth()]
    const dayName = createDayName(nowDate.getDay())
    let dayNumber = nowDate.getDate()

    //* if day number for example is 9 --> put 0 in before 9 like 09
    if (dayNumber.toString().length === 1) dayNumber = `0${dayNumber}`

    return `${dayName}, ${dayNumber} ${monthName} ${yearNumber}`
}

//* create Day Name by number of day
const createDayName = (dayDate) => { return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayDate] }

//? create Day Name by time of forecasted data
const createDays = (dt) => {
    const date = new Date(dt * 1000)
    const numberOfDay = date.getDay()
    const dayName = createDayName(numberOfDay)

    return dayName
}

//* create time
const clock = () => {
    setInterval(() => {
        let time
        const nowTime = new Date()
        const hour = nowTime.getHours()
        let minut = nowTime.getMinutes()

        if (minut.toString().trim().length === 1) minut = `0${minut}`
        
        hour >= 12 && hour <= 24 ? time = `${hour}:${minut} PM` : time = `${hour}:${minut} AM`

        headerTime.innerHTML = time
    }, 1000)
}

//* call to some functions to do something
window.addEventListener("load", () => {
    //* create weather boxes
    uploadWeatherBoxInDom(getLocationOfUserFromUrl())
    //* create date, time and put them in some elements
    headerDate.innerHTML = createDate()
    weatherTodayDate.innerHTML = `<i class="bi bi-calendar2 me-1"></i>  ${createDate()}`
    clock()
})