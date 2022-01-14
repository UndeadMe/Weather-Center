
//? get elements
const headerDate = document.querySelector(".header-date")
const headerTime = document.querySelector(".navbar-hour")
const weatherTodayGps = document.querySelector(".weather-today-gps")
const weatherTodayDate = document.querySelector(".weather-today-date")
const wrap = document.querySelector(".weather-wrap")
const searchCityInput = document.getElementById("search-city-input")
const searchCityBtn = document.getElementById("search-city-btn")
const loadingElem = document.querySelector(".loading")
const weatherWeekHeadings = document.querySelector(".weather-week-headings")
const cityElem = document.querySelector(".city-section-title")

//* get location of user from url ( city )
const getCityOfUserFromLocalStorage = () => {
    //* take city from localStorage
    const Geolocation = JSON.parse(localStorage.getItem("Geolocation"))
    
    //* check city aren't undefined or null
    if (Geolocation) {
        return Geolocation.city
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
const makeRequest = (url, err = '') => {
    //* return a response in a promise
    return fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(err)
                //* return response
                return res.json() 
            })
}

//* request to one call api
const getWeatherResponse = (latt, longt, err) => {
    //* geocode API Setting
    const EXCLUDE = "hourly,minutely,current"
    const API_KEY = "af18dfbb2d163485e7669b46fb2f7c76"
    const API = `https://api.openweathermap.org/data/2.5/onecall?lat=${latt}&lon=${longt}&appid=${API_KEY}&exclude=${EXCLUDE}`
    return makeRequest(API, err)
}

//* create weather data box
const createWeatherDataBox = (weatherResponse) => {
    const day = createDays(weatherResponse.dt)
    const humidity = weatherResponse.humidity
    const min_temp = weatherResponse.temp.min
    const pressure = weatherResponse.pressure
    const today = createDate().split(",")[0]

    const children_element_of_weather_box =
    `<h3 class="p-0 m-0">${day}</h3>
    <h3 class="p-0 m-0">${min_temp}k</h3>
    <h3 class="p-0 m-0">${humidity}% <i class="bi bi-droplet"></i></h3>
    <h3 class="p-0 m-0">${pressure}Pa</h3>
    <h3 class="p-0 m-0"><span class="more-info-span"><i class="bi bi-three-dots"></i></span></h3>`
    
    const weather_box = document.createElement("div")
    weather_box.classList.add("weather-week")
    weather_box.insertAdjacentHTML("beforeend", children_element_of_weather_box)
    
    //* if weather reponse day === today , change the backgorund of this box
    if (day === today) weather_box.classList.add("active")

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

//* create Day Name by time of forecasted data
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
    if (country && city) return { country, city }
}

//* put city and country in dom
const putCountry_CityInDom = (countryArg = '', cityArg = '') => {
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
    loading(true)
    
    //* geocode api setting for get lat and long of city
    const API_KEY = "944987828534649747748x76064"
    const geoit = "json"
    const API = `https://geocode.xyz?auth=${API_KEY}&locate=${city}&geoit=${geoit}`
    
    let res_country = null
    let res_city = null

    //* get request to geocode api
    makeRequest(API)
        .then(res => {
            if (res.error) throw new Error("city not found please enter the correct city")

            res_country = res.standard.countryname
            res_city = res.standard.city
            
            return getWeatherResponse(res.latt, res.longt, "problem getting weather info of city")
        })
        .then(res => {
            //* upload weather boxes in dom by lat and longt that we get them
            uploadWeatherBoxInDom(res)
            //* put country and city name in dom
            putCountry_CityInDom(res_country, res_city)

            weatherWeekHeadings.style.display = "flex"
        })
        .catch(err => {
            cityElem.innerHTML = ""
            createErorr(err.message)
        })
        .finally(() => loading(false))
}

//* start loading or stop loading
const loading = (bool) => {
    bool ? loadingElem.classList.add("active") : loadingElem.classList.remove("active")
}

//* create error 
const createErorr = (err = '') => {
    weatherWeekHeadings.style.display = "none"

    const errorBox = document.createElement("div")
    errorBox.className = "d-flex justify-content-between error-box"
    errorBox.classList.add("error-box")
    errorBox.innerHTML = err

    const div = document.createElement("div")

    const tryAgainBtn = document.createElement("btn")
    tryAgainBtn.classList.add("try-again-btn")
    tryAgainBtn.innerHTML = "try again"
    tryAgainBtn.addEventListener("click", () => getLatAndLonOfCity(searchCityInput.value))

    const requestToRandomCity = document.createElement("btn")
    requestToRandomCity.innerHTML = "show a default city"
    requestToRandomCity.classList.add("request-to-random-city")
    requestToRandomCity.addEventListener("click", () => getLatAndLonOfCity(getCityOfUserFromLocalStorage()))

    wrap.innerHTML = ""

    div.append(tryAgainBtn, requestToRandomCity)
    errorBox.append(div)
    wrap.appendChild(errorBox)
}

searchCityBtn.addEventListener("click", () => getLatAndLonOfCity(searchCityInput.value))

window.addEventListener("load", () => {
    //* get city from local storage
    const city = getCityOfUserFromLocalStorage()
    
    //* get weather responses with lat and longt and then upload 
    getLatAndLonOfCity(city)

    //* create date, time and put them in some elements
    headerDate.innerHTML = createDate()
    
    //* create date, time and put them in some elements
    headerDate.innerHTML = createDate()

    //* put data in weather today box
    weatherTodayDate.innerHTML = `<i class="bi bi-calendar2 me-1"></i>  ${createDate()}`

    //* put city name in value of search input
    searchCityInput.value = getCountry_CityUserFromLocalStorage().city

    //* start interval
    clock()
})