// Global declarations
// dom variable for city
var cityNameEl = document.querySelector("#city");
// empty string to pass into getCoordinates function
var currentCity = "";
// string to hold api url
var apiUrl = "";

// submit button
var formSubmitHandler = function(event) {
    //prevent default behavior of event
    event.preventDefault();
    // store value from city element
    currentCity = cityNameEl.value.trim();
    // reset input to an empty string
    cityNameEl.value = "";
    // pass currentCity into getCoordinates() function
    getInfo(currentCity);
};
//click event listener for city search
inputEl.addEventListener("submit", formSubmitHandler);

var getInfo = function() {
    
}











var apiKey = e4b680d278f0e38d842f8c42dba89837;
apiUrl="https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" +lon + "&exclude=minutely,hourly&units=imperial&&appid=" +apiKey;