# Weather-Center ⛅
it's kind of weather app but it has some features. I desided to develope this kind of weather app for make myself better. I wanted to learn APIs and after this [Pixel-World](https://github.com/Banana021s/Pixel-World) I started this new project for challenging myself. I hope this project attract your attention. let me explain all works that I did in this project.

## Approach of Weather Center ⚙
when you open the home page you think you should see this page but I check one parameter: <br>
 - this page needs to takes access your `location` and shows weahter of your area so this page needs to your `Geolocation` and you have to give access. if you gave access, you can open home page all of the time otherwise you redirect to `ask-location` page to take your access.
 
 ## ask-location page
![ask-location](https://user-images.githubusercontent.com/89915857/155968058-db4b864e-6ed6-4551-b047-560aef711be8.png)
as you see this page created for ask you a kind of question like "can I take access to your location ? " and you have two tracks for answer:
  - If you're going to say `No` so you can't go to the home page because as I told you, home page needs your location 
  - If you're going to say `Yes` so your location will store in `localStorage` and you will redirect to home page
 <br><br>

> ❗❗Attention❗❗: **sometimes If you accept that the website takes access to your location it will show a error message like this**:

![Screenshot 2022-02-28 142925](https://user-images.githubusercontent.com/89915857/155971916-1d3bb408-5a82-48d4-9252-240760e941c0.png)

this error is because of your connection, we recommand use a `vpn` for solve this problem.

## home page
![Screenshot 2022-02-28 144202](https://user-images.githubusercontent.com/89915857/155973653-a1389418-b0fa-40ad-867a-2660411f3250.png)
welcome to the home page. this is where that you can search `any` places, areas, countries, streets and etc then then you can see all weather datas are collecting for you.

# Features
 - beautiful design
 - powerful search 🗺 you can search `anything` like:
   - streets 
   - countries
   - squares
   - historic places like Colosseum 
   - etc everywhere you wnat 
 - show today date and clock ⏱
 - show some weather datas like :
   - Min Temp 
   - Humidity 
   - Pressure 
 # future featues
 - [ ] create a calender
 - [ ] change between seasons themes like between Winter theme or spring theme 
 - [ ] add chart for show weather datas
 - [ ] add Cities section to add cities you like to check weather
