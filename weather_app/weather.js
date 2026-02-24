const apiKey = "YOUR_API_KEY_HERE";

function getWeather() {

    const city = document.getElementById("cityInput").value;

    if(city === "") {
        alert("Please enter city name");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
    .then(response => response.json())
    .then(data => {

        if(data.cod === "404") {
            alert("City not found");
            return;
        }

        document.getElementById("weatherBox").style.display = "block";

        document.getElementById("cityName").innerText =
            data.name + ", " + data.sys.country;

        document.getElementById("temperature").innerText =
            "Temperature: " + data.main.temp + " °C";

        document.getElementById("condition").innerText =
            "Condition: " + data.weather[0].main;

        document.getElementById("humidity").innerText =
            "Humidity: " + data.main.humidity + "%";

        document.getElementById("wind").innerText =
            "Wind Speed: " + data.wind.speed + " m/s";

    })
    .catch(error => {
        alert("Error fetching weather");
        console.log(error);
    });

}