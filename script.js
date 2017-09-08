
// weather backgrounds
var clearSky        = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504020580/WWWeather/clearsky.png",
    fewClouds       = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504018658/WWWeather/fewclouds.jpg",
    scatteredClouds = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504015796/WWWeather/scattered-clouds.png",
    brokenClouds    = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504018658/WWWeather/brokenclouds.jpg",
    drizzle         = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504018659/WWWeather/drizzle.png",
    rain            = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504018658/WWWeather/rain.jpg",
    thunderStorm    = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504018659/WWWeather/thunderstorm.jpg",
    snow            = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504018659/WWWeather/snow.jpg",
    mist            = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504018660/WWWeather/mist.jpg";
// weather SVGs
var sun             = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504119685/WWWeather/SVGs/Sun.svg",
    cloudSun        = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504119681/WWWeather/SVGs/Cloud-Sun.svg",
    cloud           = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504119681/WWWeather/SVGs/Cloud.svg",
    cloudDrizzle    = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504119681/WWWeather/SVGs/Cloud-Drizzle.svg",
    cloudRain       = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504119681/WWWeather/SVGs/Cloud-Rain.svg",
    cloudLightning  = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504119681/WWWeather/SVGs/Cloud-Lightning.svg",
    cloudFog        = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504119681/WWWeather/SVGs/Cloud-Fog.svg",
    cloudWind       = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504119685/WWWeather/SVGs/Cloud-Wind.svg",
    snowflake       = "http://res.cloudinary.com/detqxj5bf/image/upload/v1504119684/WWWeather/SVGs/Snowflake.svg";



$(document).ready(function() {
    $("#permission_geolocation").on("click", getWeather);
});

function getWeather() {

    var longitude;
    var latitude;
    var weatherUrl = "";

    $(".permission").hide();
    $("body").css("margin-top", "4.5rem");


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            // save the coordinates as longitude and latitude
            longitude = pos.coords.longitude;
            latitude = pos.coords.latitude;
            weatherUrl = "https://fcc-weather-api.glitch.me/api/current?lat=" + latitude + "&lon=" + longitude;
            // make ajax request with longitude and latitude
            $.ajax({
                url: weatherUrl,
                success: function(data) {
                    console.log("area: " + data.name + ", " + data.sys.country);
                    // get background for the page
                    var backgroundUrl = getBackground(data.weather[0].id);
                    // get the apt icon (based off background and the weather id)
                    var weatherIcon = getIcon(getBackground(data.weather[0].id), data.weather[0].id);

                    $("body").css({
                        "background" : "url(" + backgroundUrl + ")",
                        "background-repeat" : "no-repeat",
                        "background-position": "center center",
                        "background-attachment" : "fixed",
                        "background-size": "cover"
                    });

                    $(".weather-icon").attr("src", weatherIcon);

                    var description = data.weather[0].description + " in " + data.name + ", " + data.sys.country;
                    description = capitalizeFirstLetter(description);
                    var celsius = Math.round(data.main.temp);
                    // var fahrenheit = (celsius * (9/5)) + 32;
                    var fahrenheit = Math.round((celsius * (9/5)) + 32);
                    var unit = "C";
                    $(".weather-description h3").text(description);
                    // $(".weather-description h4").text(celsius + "° " + unit);
                    $("#temp_value").text(celsius + "°");
                    $("#temp_unit").text(" " + unit);

                    $("#change_unit").on("click", function(){
                        if (unit === "C") {
                            unit = "F";
                            $("#temp_value").text(fahrenheit + "°");
                            $("#temp_unit").text(" " + unit);

                        } else {
                            (unit = "C");
                            $("#temp_value").text(celsius + "°");
                            $("#temp_unit").text(" " + unit);
                        }
                    });
                },
                error: function(xhr, textStatus, errorThrown) {
                    console.log("Whoops, something bad happened :(");
                },
                cache: false
            });
        });
    }
}

function getBackground(id) {
    if (id >= 200 && id <= 232) return thunderStorm;
    if (id >= 300 && id <= 321) return drizzle;
    if (id >= 500 && id <= 531) return rain;
    if (id >= 600 && id <= 622) return snow;
    if (id === 701 || id === 741) return mist;
    if (id === 800) return clearSky;
    if (id === 801) return fewClouds;
    if (id === 802) return scatteredClouds;
    if (id === 803 || id === 804 || id === 905) return brokenClouds; // 905 - windy
}

function getIcon(backGround, id) { // id is only important for the 'windy' condition
    if (id === 905) return cloudWind;
    if (backGround === clearSky) return sun;
    if (backGround === fewClouds) return cloudSun;
    if (backGround === scatteredClouds || backGround === brokenClouds) return cloud;
    if (backGround === drizzle) return cloudDrizzle;
    if (backGround === rain) return cloudRain;
    if (backGround === thunderStorm) return cloudLightning;
    if (backGround === snow) return snowflake;
    if (backGround === mist) return cloudFog;
}

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}
