
//? get elements
const headerDate = document.querySelector(".header-date")
const headerTime = document.querySelector(".navbar-hour")
const weatherTodayGps = document.querySelector(".weather-today-gps")
const weatherTodayDate = document.querySelector(".weather-today-date")
const wrap = document.querySelector(".weather-wrap")
const searchCityInput = document.getElementById("search-city-input")
const searchCityBtn = document.getElementById("search-city-btn")
const loadingElem = document.querySelector(".loading")

//* get location of user from url ( latt and longt )
const getLocationOfUserFromLocalStorage = () => {
    //* take latt and longt from localStorage
    const Geolocation = JSON.parse(localStorage.getItem("Geolocation"))
    
    //* check latt and longt aren't undefined or null
    if (Geolocation) {
        const { latt, longt } = Geolocation
        return { latt, longt }
    } else 
        location.replace("ask-location.html")
}

//* upload weather boxes
const uploadWeatherBoxInDom = ( weatherResponseObject ) => {    
    wrap.innerHTML = ""
    const Fragment = new DocumentFragment()

    weatherResponseObject.daily.forEach((dayObject, dayIndex) => {
        //* don't appendChild last object and don't create weather data box for that
        if (dayIndex !== weatherResponseObject.daily.length - 1)
            //* call to (createWeatherDataBox) to make weather boxes
            Fragment.appendChild(createWeatherDataBox(dayObject))
    })
    
    //* append Fragment That is full of the weather boxes
    wrap.appendChild(Fragment)
}

//* send request and return response in a promise
const makeRequest = (url) => {
    //* return a response in a promise
    return fetch(url)
            .then(res => { if (res.ok) { 
                //* return response
                return res.json() 
            }})
}

//* request to one call api
const getWeatherResponse = (latt, longt) => {
    //* active loader
    loading(true)

    //* geocode API Setting
    const EXCLUDE = "hourly,minutely,current"
    const API_KEY = "af18dfbb2d163485e7669b46fb2f7c76"
    const API = `https://api.openweathermap.org/data/2.5/onecall?lat=${latt}&lon=${longt}&appid=${API_KEY}&exclude=${EXCLUDE}`
    const weatherResponses = makeRequest(API)
    
    return weatherResponses
        .then(res => res)
        .catch(() => {
            //* no internet ( create a error to show you dont have internet )

            //* deactive loader
        })
        .finally(() => {
            //* deactive loader
            loading(false)
        })
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

//* get city and country of user
const getCountry_CityUserFromLocalStorage = () => {
    //* take lat and lon from localStorage
    const { country, city } = JSON.parse(localStorage.getItem("Geolocation"))

    //* check county and city of user arn't null or undefined
    if (country && city)
        return { country, city }
}

//* put city and country in dom
const putCountry_CityInDom = (countryArg = '', cityArg = '') => {
    const cityElem = document.querySelector(".city-section-title")
    
    //* if I don't set argument take city and country name from localStorage and put them in dom
    //* else I set country and city arguments just put them in dom
    if (countryArg === "" && cityArg === "") {
        const { country, city } = getCountry_CityUserFromLocalStorage()
        cityElem.innerHTML = `${country} - ${city}`
    } else 
        cityElem.innerHTML = `${countryArg} - ${cityArg}`
}

//* get lat and lon of cities by name of them and send them to receive weather responses then upload weather boxes
const getLatAndLonOfCity = (city) => {
    //* geocode api setting for get lat and long of city
    const API_KEY = "629829819389156476277x31205"
    const geoit = "json"
    const API = `https://geocode.xyz?auth=${API_KEY}&locate=${city}&geoit=${geoit}`
    
    //* get request to geocode api
    makeRequest(API)
        .then(res => {
            if (res.error) throw new Error(res.error.description)
            
            const { latt, longt } = res

            //* upload weather boxes in dom by lat and longt that we get them
            getWeatherResponse(latt, longt)
                .then(data => uploadWeatherBoxInDom(data))
            
            //* put country and city name in dom
            putCountry_CityInDom(res.standard.countryname , res.standard.city)
        })
        .catch(err => console.error(err.message))
}

//* start loading or stop loading
const loading = (bool) => {
    bool ? loadingElem.classList.add("active") : loadingElem.classList.remove("active")
}

searchCityBtn.addEventListener("click", () => getLatAndLonOfCity(searchCityInput.value))

window.addEventListener("load", () => {
    //* get latt and longt from local storage
    const { latt, longt } = getLocationOfUserFromLocalStorage()
    
    //* get weather responses with lat and longt and then upload 
    getWeatherResponse(latt, longt)
        .then(data => uploadWeatherBoxInDom(data))
    
    //* create date, time and put them in some elements
    headerDate.innerHTML = createDate()
    
    //* create date, time and put them in some elements
    headerDate.innerHTML = createDate()

    //* put data in weather today box
    weatherTodayDate.innerHTML = `<i class="bi bi-calendar2 me-1"></i>  ${createDate()}`

    //* put Country and city names in dom
    putCountry_CityInDom()

    //* put city name in value of search input
    searchCityInput.value = getCountry_CityUserFromLocalStorage().city

    //* start interval
    clock()
})