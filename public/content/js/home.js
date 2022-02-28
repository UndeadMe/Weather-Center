//? get elements
const headerDate = document.querySelector(".header-date")
const headerTime = document.querySelector(".navbar-hour")
const wrap = document.querySelector(".weather-wrap")
const weatherTodayGps = document.querySelector(".weather-today-gps")
const searchCityInput = document.getElementById("search-city-input")
const searchCityBtn = document.getElementById("search-city-btn")
const loadingElem = document.querySelector(".loading")
const weatherWeekHeadings = document.querySelector(".weather-week-headings")
const cityElem = document.querySelector(".city-section-title")
const weatherTodayBoxInner = document.querySelector(".weather-today-box-inner")

//* check user is init or no
const check_get_UserInfo = () => {
    //* take geolocation from localStorage
    const Geolocation = JSON.parse(localStorage.getItem("Geolocation"))

    //* check user's geolocation is init
    if (Geolocation) {
        return Geolocation
    } else
        location.replace("ask-location.html")
}

//* upload weather boxes
const uploadWeatherBoxInDom = (weatherResponseObject) => {
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
    const units = "metric"
    const API = `https://api.openweathermap.org/data/2.5/onecall?lat=${latt}&lon=${longt}&appid=${API_KEY}&exclude=${EXCLUDE}&units=${units}`
    return makeRequest(API, err)
}

//* create weather data box
const createWeatherDataBox = (weatherResponse) => {
    const day = createDays(weatherResponse.dt)
    const humidity = weatherResponse.humidity
    const min_temp = weatherResponse.temp.min
    const pressure = weatherResponse.pressure
    const weather_icon = weatherResponse.weather[0].icon
    const today = createDate().split(",")[0]

    const children_element_of_weather_box =
        `<h3 class="p-0 m-0"><img src="https://openweathermap.org/img/w/${weather_icon}.png"> ${day}</h3>
    <h3 class="p-0 m-0">${min_temp}°C</h3>
    <h3 class="p-0 m-0">${humidity}% <i class="bi bi-droplet"></i></h3>
    <h3 class="p-0 m-0">${pressure}Pa</h3>`

    //* create weather box
    const weather_box = document.createElement("div")
    weather_box.classList.add("weather-week")
    weather_box.insertAdjacentHTML("beforeend", children_element_of_weather_box)

    //* if weather reponse day === today , change the backgorund of this box
    if (day === today) {
        //* active today weather box
        weather_box.classList.add("active")
        //* create today weather box and save data in dom
        createTodayWeatherDataBox(weatherResponse)
    }

    return weather_box
}

//* create today weather data box
const createTodayWeatherDataBox = (weather_today_object) => {
    const weather_main = weather_today_object.weather[0].main
    const weather_main_desc = weather_today_object.weather[0].description
    const weather_icon_id = weather_today_object.weather[0].icon
    const weather_temp_day = `${weather_today_object.temp.day}°C`
    const weather_temp_eve = `${weather_today_object.temp.eve}°C`
    const weather_temp_night = `${weather_today_object.temp.day}°C`

    const weather_icon = document.createElement("img")
    weather_icon.src = `https://openweathermap.org/img/w/${weather_icon_id}.png`

    //* add datas in dom
    document.querySelector(".weather-today-today").innerHTML = "today"
    document.querySelector(".weather-today-day").innerHTML = weather_main
    document.querySelector(".weather-today-like").innerHTML = weather_main_desc
    document.querySelectorAll(".weather-today-temp")[0].innerHTML = `day: ${weather_temp_day}`
    document.querySelectorAll(".weather-today-temp")[1].innerHTML = `eve: ${weather_temp_eve}`
    document.querySelectorAll(".weather-today-temp")[2].innerHTML = `night: ${weather_temp_night}`
    document.querySelector(".weather-today-date").innerHTML = `<i class="bi bi-calendar2 me-1"></i>  ${createDate()}`
    document.querySelector(".weather-icon").innerHTML = ""
    document.querySelector(".weather-icon").append(weather_icon)
}

//* empty the weather today box
const convertWeatherTodayBoxToError = () => {
    document.querySelector(".weather-today-today").innerHTML = ""
    document.querySelector(".weather-today-day").innerHTML = ""
    document.querySelector(".weather-icon").innerHTML = ""
    document.querySelector(".weather-today-like").innerHTML = ""
    document.querySelectorAll(".weather-today-temp").forEach(item => item.innerHTML = "")
    weatherTodayGps.innerHTML = ""
    document.querySelector(".weather-today-date").innerHTML = ""
    weatherTodayBoxInner.classList.add("error")
}

//* create date
const createDate = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const nowDate = new Date()
    const yearNumber = nowDate.getFullYear()
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

//* get lat and lon of cities by name of them and send them to receive weather responses then upload weather boxes
const getLatAndLonOfCity = (city) => {
    //* active loading
    loading(true)

    //* geocode api setting for get lat and long of city
    const API_KEY = "pk.5717d3458249d3af26201b6e2442aa88"
    const Accept_Language = "en"
    const format = "json"
    const limit = 1
    const API = `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${city}&format=${format}&accept-language=${Accept_Language}&limit=${limit}`

    let res_address = ""

    //* get request to geocode api
    makeRequest(API, "city not found please enter the correct city")
        .then(res => {
            const [{ lat: latt, lon: longt }] = res

            res_address = createUserAddress(res[0].display_name)

            return getWeatherResponse(latt, longt, "problem getting weather info of city")
        })
        .then(res => {
            //* upload weather boxes in dom by lat and longt that we get them
            uploadWeatherBoxInDom(res)
            weatherTodayBoxInner.classList.remove("error")

            //* put country and city name in dom
            cityElem.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${res_address}`
            weatherTodayGps.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${res_address}`

            weatherWeekHeadings.style.display = "flex"
        })
        .catch(err => {
            cityElem.innerHTML = ""
            createErorr(err.message)
            convertWeatherTodayBoxToError()
            cityElem.innerHTML = "problem getting address"
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
    requestToRandomCity.addEventListener("click", () => getLatAndLonOfCity(check_get_UserInfo().city))

    wrap.innerHTML = ""

    div.append(tryAgainBtn, requestToRandomCity)
    errorBox.append(div)
    wrap.appendChild(errorBox)
}

//* handle user address
const createUserAddress = (address) => {
    const adrs = `${address.split(",")[0]} - ${address.split(",")[address.split(",").length - 1]}`
    return adrs.split("-").reverse().join(" - ").trim()
}

searchCityBtn.addEventListener("click", () => getLatAndLonOfCity(searchCityInput.value))
searchCityInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter" ) getLatAndLonOfCity(e.target.value)
})

window.addEventListener("load", () => {
    //* get city from local storage
    if (check_get_UserInfo()) {
        //* get weather responses with lat and longt and then upload 
        getLatAndLonOfCity(check_get_UserInfo().city)

        //* create date, time and put them in some elements
        headerDate.innerHTML = createDate()

        //* put city name in value of search input
        if (check_get_UserInfo().city) {
            searchCityInput.value = check_get_UserInfo().city
        }

        //* start interval
        clock()
    }
})