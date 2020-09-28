// Global declarations
var forecastHeader = document.querySelector("#five-day-header")
// dom variable for five day forecast display
var forecast = document.querySelector("#five-day-forecast");
//dom variable for info div
var information = document.querySelector("#information");
//api key from openweather
var apiKey = "e4b680d278f0e38d842f8c42dba89837";
// dom variable for city
var cityNameEl = document.querySelector("#city");
// empty string to pass into getCoordinates function
var currentCity = "";
// string to hold api url
var apiUrl = "";
//dynamic html variable
var newCity = document.createElement("li");
//dynamic html variable
var infoEl = document.createElement("div");
// array to store city search history
var cityList = [];
// DOM variable to reference list space for search history
var cityListEl = document.querySelector("#history");
//DOM variable for form id
var formEl = document.querySelector("#input");
//format for the moment object european style
var today = moment().format("D/M/YYYY");

// submit button
var formSubmitHandler = function(event) {
    //prevent default behavior of event
    event.preventDefault();
    // store value from city element
    currentCity = cityNameEl.value.trim();
    // reset input to an empty string
    cityNameEl.value = "";
    // pass currentCity into getInfo() function
    getInfo(currentCity);
};

//click event listener for city search
formEl.addEventListener("submit", formSubmitHandler);

//function to retrieve open weather api, 
var getInfo = function(city) {
            //api url definition
            apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
            //grab city lat and lon
            fetch(apiUrl).then(function(response) {
                if (response.ok) {
                    response.json().then(function(data) {
                        //store lat and lon and call another function
                        customWeather(data.coord.lat, data.coord.lon);
                        // append and save city only if it is not listed yet -- causes error 1 displayed below
                        // Put this in here so no erroneous inputs get saved to local storage
                        if (cityList.includes(currentCity)) {
                            return;
                        } else {
                            // Function to append city to search history and save to local storage
                            listCity(currentCity);
                        }
                    });
                //error message
                } else {
                    alert("Error: " + response.statusText);
                }
            });
     
};

// input lat and long and link onecall weather api
var customWeather = function (lat, lon) {
    //api url definition
    apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;
    //grab current response and pass into info function. Get daily data and pass into fiveday function
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //function calls
                todaysInfo(data.current);
                displayFiveDay(data.daily);
            });
        } else {
            //error message
            alert("Error: " + response.statusText);
        }
    });
};

// function to display today's weather
var todaysInfo = function(info) {
    //clear last search
    information.innerHTML = "";
    // grab tons of info from data key 'current' value and display via innerHTML
    infoEl.innerHTML = "<h4>" + currentCity + " (" + today + ") <img src='http://openweathermap.org/img/w/" + info.weather[0].icon + ".png'></img></h4><p>Temperature: " + info.temp + " &#8457</p><p>Humidity: " + info.humidity + "%</p><p>Wind Speed: " + info.wind_speed + " MPH</p><p>UV Index: <span id='uv-index'>" + info.uvi + "</span></p>";
    //append infoEl div to information id
    information.appendChild(infoEl);
    // DOM variable from dynamically created span above
    var uvIndexColor = document.getElementById("uv-index");
    // conditional statements to color uv-index text
    if (info.uvi >= 1 && info.uvi < 3) {
        //green
        uvIndexColor.setAttribute("class", "badge badge-success")
    }
    else if (info.uvi >= 3 && info.uvi < 6) {
        //yellow
        uvIndexColor.setAttribute("class", "badge badge-warning");
    } else if (info.uvi >= 6 && info.uvi < 10) {
        //red
        uvIndexColor.setAttribute("class", "badge badge-danger");
    } else if (info.uvi >= 10) {
        //purple
        uvIndexColor.setAttribute("class", "badge badge-dark");
    }
};

// function to display the five day forecast
var displayFiveDay = function(fiveDay) {
    // clear
    forecast.innerHTML = "";
    //add text to dynamic header displayed above forecast
    forecastHeader.textContent = "Five Day Forecast";
    // for loop to get data on all five upcoming days
    for (var i = 1; i < 6; i++) {
    //create a date for the current day - euro format
    var forecastDate = moment().add(i, 'days').format("M/D/YYYY");
    //add class to newly created div
    var infoEl1 = document.createElement("div");
    infoEl1.setAttribute("class", "badge badge-primary p-3 mb-3 text-left");
    //another large data pull, this time from the 'daily' value of data
    infoEl1.innerHTML = "<h6>" + forecastDate + "</h6><img src='http://openweathermap.org/img/w/" + fiveDay[i].weather[0].icon + ".png'></img><p>Temp: " + fiveDay[i].temp.max + " &#8457</p><p>Humidity: " + fiveDay[i].humidity + "%</p>";
    forecast.appendChild(infoEl1);
    }
};

//function to list the searched cities
var listCity = function(cityName) {
    // add text to empty li
    newCity.textContent = cityName;
    // add class of list-group-item since this element can be dynamically created with other cities
    newCity.setAttribute("class", "list-group-item");
    // append li element
    cityListEl.appendChild(newCity);
    //push name of city to global array
    cityList.push(cityName);
    //local storage push
    localStorage.setItem("cityList", JSON.stringify(cityList));
};

// load saved cities after page refresh
var loadCities = function() {
    //pull local storage data
    cityList = JSON.parse(localStorage.getItem("cityList"));
    // if local storage is null, set array to null
    if (!cityList) {
        cityList = [];
    }
    // add saved cities
    for (i = 0; i < cityList.length; i++) {
        // assign city name to new list element
        newCity.textContent = cityList[i];
        // add class so all of the html elements so they are similar
        newCity.setAttribute("class", "list-group-item");
        //append li to html
        cityListEl.appendChild(newCity);
    }
};

//call function
loadCities();

// ISSUES:

// -ERROR 1:
// cannot get local storage to store more than one task in the list
// -Description:
// it will store the first city you enter, then every time you enter a NEW city. If it's a city already located in localStorage, it will not be displayed in the list below /search div

// -ERROR 2: 
// upon refresh, only one city is displayed

// -ERROR 3:
// upon click of local storage city list, the city does not search