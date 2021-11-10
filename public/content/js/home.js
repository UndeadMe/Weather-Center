//? get elements
const headerDate = document.querySelector(".header-date")
const headerTime = document.querySelector(".navbar-hour")
const weatherTodayGps = document.querySelector(".weather-today-gps")
const weatherTodayDate = document.querySelector(".weather-today-date")

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

//* main function --> this function calls to all of the functions we need to call for upload weather datas //FIXME
const weatherCenter = () => {
    const { lat, lon } = getLocationOfUserFromUrl()
    requestToOneCallApi({ lat, lon })
}

//* request to one call api //FIXME
const requestToOneCallApi = ({ lat, lon }) => {
    const EXCLUDE = "daily"
    const API_KEY = "af18dfbb2d163485e7669b46fb2f7c76"
    const API = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&exclude=${EXCLUDE}`
    
    //? request to api
    fetch(API)
        .then(response => {
            if (!response.ok) throw new Error("err")
            return response.json()
        })
        .then(response => console.log(response))
        .catch(err => console.log(err))
}

const createWeatherDataBox = (weatherResponse) => {
    const wrap = document.querySelector(".weather-week")
}

//* create date
const createDate = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"]
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    const nowDate = new Date()
    const yearNumber  = nowDate.getFullYear()
    const monthName = monthNames[nowDate.getMonth()]
    const dayName = dayNames[nowDate.getDay()]
    let dayNumber = nowDate.getDate()

    //* if day number for example is 9 --> put 0 in before 9 like 09
    if (dayNumber.toString().length === 1) {
        dayNumber = `0${dayNumber}`
    }

    return `${dayName}, ${dayNumber} ${monthName} ${yearNumber}`
}

//* create dayName based api day index
const createDayName = (dayDate) => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return dayNames[dayDate]
}

//* create time
const createTime = () => {
    setInterval(() => {
        let time
        const nowTime = new Date()
        const hour = nowTime.getHours()
        let minut = nowTime.getMinutes()

        if (minut.toString().trim().length === 1) {
            minut = `0${minut}`
        }
        
        hour >= 12 && hour <= 24 ? time = `${hour}:${minut} PM` : time = `${hour}:${minut} AM`

        headerTime.innerHTML = time
    }, 1000)
}

//* call to some functions to do something
window.addEventListener("load", () => {
    //* create weather boxes
    weatherCenter()
    //* create date, time and put them in some elements
    headerDate.innerHTML = createDate()
    weatherTodayDate.innerHTML = `<i class="bi bi-calendar2 me-1"></i>  ${createDate()}`
    createTime()
})
