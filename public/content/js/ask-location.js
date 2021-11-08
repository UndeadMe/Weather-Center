const locationBtn = document.querySelector(".allow-my-location")

//* request to user for allow location 
const geolocationReq = () => {
    navigator.geolocation.getCurrentPosition(
        (success) => {
            location.replace(`home.html?lat=${success.coords.latitude}&long=${success.coords.longitude}`)
        }
    )
}

locationBtn.addEventListener("click", geolocationReq)