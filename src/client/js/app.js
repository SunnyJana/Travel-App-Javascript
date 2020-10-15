// Variable Declaration

const output = document.querySelector("#result");
const tripPlanner = document.querySelector("#planner");
const addNewTrip = document.querySelector(".map__link");
const printingButton = document.querySelector("#save");
const deleteButton = document.querySelector("#delete");
const form = document.querySelector("#form");
const departuringFrom = document.querySelector('input[name="from"]');
const destinationPlace = document.querySelector('input[name="to"]');
const deparDate = document.querySelector('input[name="date"]');


// EVENT LISTENERS

// add trip button
const addTripEventListeners = addNewTrip.addEventListener('click', function (e) {
  e.preventDefault();
  tripPlanner.scrollIntoView({ behavior: 'smooth' });
})
// form submit
form.addEventListener('submit', addTrip);
// print button
printingButton.addEventListener('click', function (e) {
  window.print();
  location.reload();
});
// delete button
deleteButton.addEventListener('click', function (e) {
  form.reset();
  output.classList.add("invisible");
  location.reload();
})


// API Keys and link Declaration
const geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
const username = "swarna.lyf";
const timestampNow = (Date.now()) / 1000;
const darkAPIURL = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/";
const darkAPIkey = "841a9888f38f0d5458c1f32b892d2d1b";
const pixabayAPIURL = "https://pixabay.com/api/?key=";
const pixabayAPIkey = "16825537-9cefd2c8c91e6e9cb6e2bc4ea";


// FUNCTIONS 

// Function called when form is submitted
export function addTrip(e) {
  e.preventDefault();
  //Acquiring and storing user trip data
  const leavingFromText = departuringFrom.value;
  const destinationPlaceText = destinationPlace.value;
  const deparDateText = deparDate.value;
  const timestamp = (new Date(deparDateText).getTime()) / 1000;

  // function checkInput to validate input 
  Client.checkInput(leavingFromText, destinationPlaceText);

  getCityInfo(geoNamesURL, destinationPlaceText, username)
    .then((cityData) => {
      const cityLatitude = cityData.geona
      mes[0].lat;
      const cityLong = cityData.geonames[0].lng;
      const country = cityData.geonames[0].countryName;
      const weatherData = getWeather(cityLatitude, cityLong, country, timestamp)
      return weatherData;
    })
    .then((weatherData) => {
      const daysLeft = Math.round((timestamp - timestampNow) / 86400);
      const userData = postData('http://localhost:4000/add', { leavingFromText, destinationPlaceText, deparDateText, weather: weatherData.currently.temperature, summary: weatherData.currently.summary, daysLeft });
      return userData;
    }).then((userData) => {
      updateUI(userData);
    })
}


// function getWeather to get weather information from Dark Sky API 
export const getWeather = async (cityLatitude, cityLong, country, timestamp) => {
  const req = await fetch(darkAPIURL + "/" + darkAPIkey + "/" + cityLatitude + "," + cityLong + "," + timestamp + "?exclude=minutely,hourly,daily,flags");
  try {
    const weatherData = await req.json();
    return weatherData;
  } catch (error) {
    console.log("error", error);
  }
}


//function getCityInfo to get city information from Geonames (latitude, longitude, country)
export const getCityInfo = async (geoNamesURL, destinationPlaceText, username) => {
  // res equals to the output of fetch function
  const res = await fetch(geoNamesURL + destinationPlaceText + "&maxRows=10&" + "username=" + username);
  try {
    const cityData = await res.json();
    return cityData;
  } catch (error) {
    console.log("error", error);
  }
};


// Function postData to POST data to our local server
export const postData = async (url = '', data = {}) => {
  const req = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify({
      deparCity: data.leavingFromText,
      arrivCity: data.destinationPlaceText,
      deparDate: data.deparDateText,
      weatherDetails: data.weatherDetails,
      summary: data.summary,
      daysLeft: data.daysLeft
    })
  })
  try {
    const userData = await req.json();
    return userData;
  } catch (error) {
    console.log("error", error);
  }
}


// Function update UI that reveals the outputs page with updated trip information including fetched image of the destination
export const updateUI = async (userData) => {
  output.classList.remove("invisible");
  output.scrollIntoView({ behavior: "smooth" });

  const res = await fetch(pixabayAPIURL + pixabayAPIkey + "&q=" + userData.arrCity + "+city&image_type=photo");

  try {
    const imageLink = await res.json();
    const dateSplit = userData.deparDate.split("-").reverse().join(" / ");
    document.querySelector("#city").innerHTML = userData.arrivCity;
    document.querySelector("#date").innerHTML = dateSplit;
    document.querySelector("#days").innerHTML = userData.daysLeft;
    document.querySelector("#summary").innerHTML = userData.summary;
    document.querySelector("#temp").innerHTML = userData.weatherDetails;
    document.querySelector("#fromPixabay").setAttribute('src', imageLink.hits[0].webformatURL);
  }
  catch (error) {
    console.log("error", error);
  }
}

export { addTripEventListeners }