$(document).ready(function () {

    $("#searchForm").on("submit", function (e) {
        e.preventDefault();

        var inputValue = $("#cityInput").val();
        var APIKey = "5af80191049a5aac0e5b1a43d2d1ccfe";

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputValue + "&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var curCity = response.name;
            var curDateTime = moment().format('MMM Do, h:mm a');
            var curKelvinTemp = response.main.temp;
            var curFahrenheit = ((curKelvinTemp - 273.15) * 1.80 + 32).toFixed();
            var curHumidity = response.main.humidity;
            var curWindSpeed = response.wind.speed;

            renderData();

            // Render data on screen
            function renderData() {
                // Create divs and add classes
                var currentWeatherData = $("<div>").addClass("uk-grid");
                var currentDataText = $("<div>").addClass("uk-width-2-3 uk-width-1-2@s uk-text-secondary");
                var currentDataGraphic = $("<div>").addClass("uk-width-1-3 uk-width-1-2@s weatherGraphic");
                var currentDataCity = $("<div>").addClass("uk-text-bold uk-text-large");
                var currentDataDate = $("<div>");
                var currentDataTemp = $("<div>").addClass("uk-heading-2xlarge uk-margin-remove");
                var currentDataTempUnit = $("<span>").addClass("uk-heading-large uk-text-top");
                var currentDataHumidity = $("<div>");
                var currentHumidityLabel = $("<span>").addClass("uk-text-small");
                var currentHumidityVal = $("<span>").addClass("uk-text-bold");
                var currentDataWindSpeed = $("<div>");
                var currentWindSpeedLabel = $("<span>").addClass("uk-text-small");
                var currentWindSpeedVal = $("<span>").addClass("uk-text-bold");
                var currentDataUVIndex = $("<div>");
                var currentUVIndexLabel = $("<span>").addClass("uk-text-small");
                var currentUVIndexVal = $("<span>").addClass("uk-text-bold");;
                // Set contexts
                currentDataCity.text(curCity); // Get city from response
                currentDataDate.text(curDateTime); // Use moment.js
                currentDataTemp.text(curFahrenheit); // Get temp from response
                currentDataTempUnit.html("&#176F");
                currentHumidityLabel.text("Humidity: ");
                currentHumidityVal.text(curHumidity + "%");
                currentWindSpeedLabel.text("Wind Speed: ");
                currentWindSpeedVal.text(curWindSpeed + "kph")
                // Append
                currentDataUVIndex.append(currentUVIndexLabel).append(currentUVIndexVal);
                currentDataWindSpeed.append(currentWindSpeedLabel).append(currentWindSpeedVal);
                currentDataHumidity.append(currentHumidityLabel).append(currentHumidityVal);
                currentDataTemp.append(currentDataTempUnit);
                currentDataText.append(currentDataCity).append(currentDataDate).append(currentDataTemp).append(currentDataHumidity).append(currentDataWindSpeed).append(currentDataUVIndex);
                currentWeatherData.append(currentDataText).append(currentDataGraphic);
                $(".todayWeatherSection").append(currentWeatherData);
            }
        })
    })

})