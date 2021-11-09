//? get elements
const headerDate = document.querySelector(".header-date")
const headerTime = document.querySelector(".navbar-hour")

//* get location of user from url (lat and )
const getLocationOfUserFromUrl = () => {
    //* take lat and long from url and put the in array
    const lat_long = location.search.slice(1,location.href.length).split("&")

    //* check user gave his access of geo or no
    if (lat_long.toString().trim().length !== 0) {
        const lat = lat_long[0].slice(4, lat_long[0].length)
        const long = lat_long[1].slice(5, lat_long[1].length)
        return { lat, long }
    } else {
        location.replace("ask-location.html")
    }
}

//* main function --> this function calls to all of the functions we need to call for upload weather datas //FIXME
const weatherCenter = () => {
    const { lat, long } = getLocationOfUserFromUrl()
    let responses = requestToOneCallApi({ lat, long })
}

//* request to one call api //FIXME
const requestToOneCallApi = ({ lat, long }) => {
    const EXCLUDE = "daily"
    const API_KEY = "af18dfbb2d163485e7669b46fb2f7c76"
    const API = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=${EXCLUDE}&appid=${API_KEY}`
    
    //? request to api
    fetch(API)
        .then(res => res.json()).then(res => console.log(res))
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

//* create time
const createTime = () => {
    setInterval(() => {
        let time ;
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
    createTime()
})