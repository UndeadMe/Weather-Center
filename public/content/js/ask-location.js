const locationBtn = document.querySelector(".allow-my-location")
const loadingElem = document.querySelector(".loading")
const gpsMsg = document.querySelector(".gps-msg")

//* request to user for allow location 
const geolocationReq = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            //* set geolocation of user in localStorage
            localStorage.setItem("Geolocation", JSON.stringify({
                lat: position.coords.latitude,
                lon: position.coords.longitude
            }))
            //* go to the home page and send the geo info
            location.replace(`home.html`)
        },
        err => {
            //* stop loading
            loading(false)
            returnGeoErr(err.code)
        }
    )
}

//* start loading or stop loading
const loading = (bool) => {
    bool ? loadingElem.classList.add("active") : loadingElem.classList.remove("active")
}

//? return geolocation err for users
const returnGeoErr = (err) => {
    gpsMsg.classList.add("gps-msg-err")
    switch (err) {
        case 1: 
            gpsMsg.innerHTML = "The acquisition of the geolocation information failed because the page didn't have the permission to do it."
            break
        case 2:
            gpsMsg.innerHTML = "The acquisition of the geolocation failed <br> try again!"
            break
        case 3: 
            gpsMsg.innerHTML = "something went wrong <br> try agian!"
            break
    }
}

window.addEventListener("load", () => {
    //* check browser is support geolocation
    if (navigator.geolocation) {
        locationBtn.addEventListener("click", () => {
            //* show loading
            loading(true)
            //* fetch geolocation 
            geolocationReq()
        })
    } else {
        gpsMsg.innerHTML += `<br> <span class="gps-msg-err">
            sorry, your browser doesn't support geolocation for access your location
        </span>`
    }
})

// fetch("ea94944d14ab47d9bba7da95c31880f5")