const locationBtn = document.querySelector(".allow-my-location")
const loadingElem = document.querySelector(".loading")
const gpsMsg = document.querySelector(".gps-msg")

//* request to user for allow location 
const geolocationReq = () => {    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            //* set geolocation of user in localStorage
            localStorage.setItem("Geolocation", JSON.stringify({
                lat: position.coords.latitude,
                lon: position.coords.longitude
            }))
            //* go to the home page and send the geo info
            location.replace(`home.html`)
        },
        (err) => {
            //* stop loading
            loading(false)
        }
    )
}

//* start loading or stop loading
const loading = (bool) => {
    if (bool) loadingElem.classList.add("active")
    else loadingElem.classList.remove("active")
}

window.addEventListener("load", () => {
    //* check browser is support geolocation
    if ("geolocation" in navigator) {
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