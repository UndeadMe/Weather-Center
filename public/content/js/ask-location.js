const locationBtn = document.querySelector(".allow-my-location")
const loadingElem = document.querySelector(".loading")
const gpsMsg = document.querySelector(".gps-msg")

//* request to user for allow location 
const geolocationReq = () => {
    fetch("https://api.ipify.org/?format=json")
        .then(result => result.json())
        .then(data => { 
            return fetch(`https://geocode.xyz?auth=629829819389156476277x31205&locate=${data.ip}&geoit=json`)
        })
        .then(res => res.json())
        .then(data => {
            //* set geolocation of user in localStorage
            localStorage.setItem("Geolocation", JSON.stringify({
                country: data.country,
                city: data.city,
                latt: data.latt,
                longt: data.longt
            }))
            //* go to the home page and send the geo info
            location.replace(`home.html`)
        })
        .catch(err => {
            //* stop loading
            loading(false)
            //* render error
            renderErr(`${err.message} <br> couldn't get access`)
        })
}

//* start loading or stop loading
const loading = (bool) => {
    bool ? loadingElem.classList.add("active") : loadingElem.classList.remove("active")
}

//* render errors
const renderErr = (err) => {
    gpsMsg.classList.add("gps-msg-err")
    gpsMsg.innerHTML = err
}

locationBtn.addEventListener("click", () => {
    //* show loading
    loading(true)
    //* fetch geolocation 
    geolocationReq()
})

window.addEventListener("load", () => localStorage.clear())