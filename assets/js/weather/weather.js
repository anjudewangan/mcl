fetch('https://ipapi.co/json/')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // console.log(data);


        // current data type is string 'data'
        // console.log(typeof data);
        // console.log("~~~~~~~~~Step 1 done!!!~~~~~~~~~")
        // convert data into JSON object
        //var parsedData = json.parse(data);
        //console.log(typeof parsedData);

        // get value from JSON object in JavaScript
        // console.log(data.latitude,
        //     data.longitude,
        //     data.city);

        arrangeApi(data.latitude, data.longitude);
    });

const showFinal = document.getElementById('weather-body');
const getBody = document.querySelector('body');


function arrangeApi(latitude, longitude) {
    const apiKey = "9cde11b82b4efe17f8560ddb3a935587";
    const api = "https://api.openweathermap.org/data/2.5/weather?lat=latitude&lon=longitude&appid=apiKey";
    const firstHalfApi = "https://api.openweathermap.org/data/2.5/weather?lat=";
    const secondHalfApi = "&lon=";
    const thirdHalfApi = "&appid=";
    const fullAPI = firstHalfApi + latitude + secondHalfApi + longitude + thirdHalfApi + apiKey;
    //console.log(fullAPI);
    retData(fullAPI);
}

async function retData(fullAPi) {
    const apiUrlData = await fetch(fullAPi);
    const DataApi = await apiUrlData.json();
    //console.log(DataApi);
    showData(DataApi);
}

function showData(DataWeather) {
    // console.log(DataWeather);
    const { main, wind, sys } = DataWeather;

    // console.log(main);
    // console.log(main.feels_like);
    var finalTemp = parseInt(main.feels_like - 273.15);
    // console.log(main.humidity);
    // console.log(DataWeather.name);
    // console.log(DataWeather.weather[0].main);
    // console.log(DataWeather.weather[0].description);
    // console.log(wind);
    // console.log(wind.speed);
    // console.log(sys.sunrise);
    // console.log(sys.sunset);
    // console.log(DataWeather.weather[0].icon);
    var sunriseTime = sunrise(sys.sunrise);
    var sunsetTime = sunset(sys.sunset);

    // console.log(sunriseTime);
    // console.log(sunsetTime);

    showFinal.innerHTML = `
    <div class="weather-data f-w-800 f-20">${finalTemp}<sup>&#176</sup>C</div><div class="weather-description font-primary f-w-700 text-capitalize"">${DataWeather.weather[0].description}</div><p class="city-name f-10">Beautiful Day in ${DataWeather.name}</p>`;

}

function sunrise(datae) {
    var date = new Date(datae * 1000);
    var timestr = date.toLocaleTimeString();

    //console.log(timestr);
    return timestr;
}

function sunset(dat) {
    var date = new Date(dat * 1000);
    var timestr = date.toLocaleTimeString();

    //console.log(timestr);
    return timestr;
}
