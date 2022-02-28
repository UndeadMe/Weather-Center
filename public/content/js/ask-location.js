const locationBtn = document.querySelector(".allow-my-location")
const loadingElem = document.querySelector(".loading")
const gpsMsg = document.querySelector(".gps-msg")

//* request to user for allow location 
const geolocationReq = () => {
    getPosition()
        .then(res => {
            const { latitude: latt, longitude: longt } = res
            return fetch(`https://us1.locationiq.com/v1/reverse.php?key=pk.5717d3458249d3af26201b6e2442aa88&lat=${latt}&lon=${longt}&format=json&accept-language=en`)
        })
        .then(res => res.json())
        .then(data => {
            //* error handler
            if (data.error) throw new Error("please try again later")

            //* set user info datas
            const user_info = {
                country: data.address.country,
                city: data.address.town,
                latitude: data.lat,
                longitude: data.lon,
            }

            //* save user data in localStorage
            saveInLocalStorage(user_info)

            //* go to the home page and send the geo info
            location.replace(`index.html`)
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

//* get position of user
const getPosition = () => {
    return new Promise((res, rej) => {
        //* get geolocation
        navigator.geolocation.getCurrentPosition(
            //* success 
            position => {
                res(position.coords)
            },
            //* error
            err => {
                rej(new Error("problem getting your geolocation of city"))
            }
        )
    })
}

//* save datas in localStorage
const saveInLocalStorage = (object) => localStorage.setItem("Geolocation", JSON.stringify(object))

//* events handlers
locationBtn.addEventListener("click", () => {
    //* show loading
    loading(true)
    //* fetch geolocation 
    geolocationReq()
})

window.addEventListener("load", () => localStorage.clear())
