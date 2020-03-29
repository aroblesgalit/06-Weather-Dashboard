$(document).ready(function () {

    // // Target search history section to append new Ul and li's to it
    // var searchHistorySection = $("#searchHistory");

    // // Create a search history array
    // var searchHistoryArr = [];

    // // Store array into local storage
    // localStorage.setItem("searchHistoryArr", JSON.stringify(searchHistoryArr));
    // // Get array back from local storage
    // localStorage.getItem("searchHistoryArr");
    // // Render array on screen
    // renderSearchHistory();
    // // Create a function to render search history
    // function renderSearchHistory() {
    //     // Clear the search history section
    //     searchHistorySection.html("");
    //     // Create ul and add classes
    //     var searchHistoryUl = $("<ul>").addClass("uk-slider-items uk-grid");
    //     for (var i = 0; i < searchHistoryArr.length; i++) {
    //         // Create li's and add classes
    //         var newSearchLi = $("<li>").addClass("sliderItem uk-padding");
    //         var newSearchSpan = $("<span>").addClass("uk-button uk-button-default uk-button-small cityChip");
    //         var newSearchDelete = $("<span>").addClass("uk-icon-button uk-light closeBtn");
    //         // Set contexts
    //         newSearchSpan.text(searchHistoryArr[i]);
    //         newSearchDelete.attr("uk-icon", "close");
    //         // Append each to the Ul
    //         newSearchSpan.append(newSearchDelete);
    //         newSearchLi.append(newSearchSpan);
    //         searchHistoryUl.append(newSearchLi);
    //     }
    //     // Append Ul to the search history section
    //     searchHistorySection.append(searchHistoryUl);
    // }

    // init();

    // // Create an init function
    // function init() {
    //     // Get search history array from localStorage
    //     // Parse json string to object
    //     var storedSearchHistoryArr = JSON.parse(localStorage.getItem("searchHistoryArr"));
    //     // If array were retrieved from localStorage, update the todos array to it
    //     if (storedSearchHistoryArr !== null) {
    //         searchHistoryArr = storedSearchHistoryArr;
    //     }

    //     // Render array to the DOM
    //     renderSearchHistory();
    // }

    // Add a submit event to the search form
    $("#searchForm").on("submit", function (e) {
        e.preventDefault();

        // Target the div to append dynamically created divs to
        var todayWeatherSection = $(".todayWeatherSection");
        // Clear section of any html
        todayWeatherSection.empty();
        // Get value from the input field
        var inputValue = $("#cityInput").val().trim();
        // Store api key
        var APIKey = "5af80191049a5aac0e5b1a43d2d1ccfe";
        // Store queryURL with the proper strings
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputValue + "&appid=" + APIKey;


        // // If the inputValue is not empty
        // if (inputValue !== "") {
        //     // Push it into the array
        //     searchHistoryArr.push(inputValue);
        //     // // Then clear the input field
        //     // $("#cityInput").val("");
        // }


        // Use ajax to get data for the city
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            // Use response to get the necessary data: City name, Temperature in Fahrenheit, Humidity, Wind speed, and Coordinates (to use for UV Index)
            var curCity = response.name;
            var curDateTime = moment().format('MMM Do, h:mm a'); // Get current time using moment.js
            var curKelvinTemp = response.main.temp;
            var curFahrenheit = ((curKelvinTemp - 273.15) * 1.80 + 32).toFixed();
            var curHumidity = response.main.humidity;
            var curWindSpeed = response.wind.speed;
            var curWeatherIcon = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
            var curWeatherDes = response.weather[0].description;
            var cityLat = response.coord.lat;
            var cityLon = response.coord.lon;

            // Render data and display to the screen
            renderData();

            // Create a function to render data
            function renderData() {
                // Create divs and add classes
                var currentWeatherData = $("<div>").addClass("uk-grid");
                var currentDataText = $("<div>").addClass("uk-width-1-2 uk-text-secondary dataText");
                var currentDataGraphic = $("<div>").addClass("uk-width-1-2 uk-flex uk-flex-column uk-flex-middle weatherGraphic");
                var currentDataCity = $("<div>").addClass("uk-text-bold uk-text-large");
                var currentDataDate = $("<div>");
                var currentDataTemp = $("<div>").addClass("uk-heading-2xlarge uk-margin-remove tempVal");
                var currentDataTempUnit = $("<span>").addClass("uk-heading-large uk-text-top tempUnit");
                var currentDataHumidity = $("<div>").addClass("otherInfo");
                var currentHumidityLabel = $("<span>").addClass("uk-text-small");
                var currentHumidityVal = $("<span>").addClass("uk-text-bold");
                var currentDataWindSpeed = $("<div>").addClass("otherInfo");
                var currentWindSpeedLabel = $("<span>").addClass("uk-text-small");
                var currentWindSpeedVal = $("<span>").addClass("uk-text-bold");
                var currentWeatherImage = $("<img>");
                var currentWeatherDescription = $("<p>").addClass("uk-text-small uk-light uk-margin-remove uk-padding-large uk-padding-remove-vertical");
                // Set contexts
                currentDataCity.text(curCity); // Get city from response
                currentDataDate.text(curDateTime); // Use moment.js
                currentDataTemp.text(curFahrenheit); // Get temp from response
                currentDataTempUnit.html("&#176F");
                currentHumidityLabel.text("Humidity: ");
                currentHumidityVal.text(curHumidity + "%");
                currentWindSpeedLabel.text("Wind Speed: ");
                currentWindSpeedVal.text(curWindSpeed + "kph");
                currentWeatherImage.attr({ "data-src": curWeatherIcon, alt: "Weather Icon", "uk-img": "", width: "200px" });
                currentWeatherDescription.text(curWeatherDes);

                // Append to each other
                currentDataWindSpeed.append(currentWindSpeedLabel).append(currentWindSpeedVal);
                currentDataHumidity.append(currentHumidityLabel).append(currentHumidityVal);
                currentDataTemp.append(currentDataTempUnit);
                currentDataText.append(currentDataCity).append(currentDataDate).append(currentDataTemp).append(currentDataHumidity).append(currentDataWindSpeed);
                currentDataGraphic.append(currentWeatherImage).append(currentWeatherDescription);
                currentWeatherData.append(currentDataText).append(currentDataGraphic);
                todayWeatherSection.append(currentWeatherData);
            }


            // Store the queryURL needed to get the data for UV Index
            var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + cityLat + "&lon=" + cityLon;
            // Use a separate ajax call for getting the UV Index with a different queryURL
            $.ajax({
                url: queryURL2,
                method: "GET"
            }).then(function (response) {
                // Get the UV Index value and store in a variable
                var uvIndexVal = response.value;

                // Render the UV Index and display on screen
                renderUVIndex();

                // Create a function that would render the UV Index
                function renderUVIndex() {
                    // Target the div where to append the UV Index
                    var currentDataText = $(".dataText");

                    // Create divs and add class
                    var currentDataUVIndex = $("<div>").addClass("otherInfo");
                    var currentUVIndexLabel = $("<span>").addClass("uk-text-small");
                    var currentUVIndexVal = $("<span>").addClass("uk-text-bold uvIndex");
                    // Set contexts
                    currentUVIndexLabel.text("UV Index: ");
                    currentUVIndexVal.text(uvIndexVal);
                    // Create conditionals for color coding
                    if (uvIndexVal >= 0 && uvIndexVal < 3) {
                        currentUVIndexVal.css("color", "var(--very-low)");
                    } else if (uvIndexVal >= 3 && uvIndexVal < 5) {
                        currentUVIndexVal.css("color", "var(--low)");
                    } else if (uvIndexVal >= 5 && uvIndexVal < 7) {
                        currentUVIndexVal.css("color", "var(--moderate)");
                    } else if (uvIndexVal >= 7 && uvIndexVal < 10) {
                        currentUVIndexVal.css("color", "var(--high)");
                    } else if (uvIndexVal >= 10) {
                        currentUVIndexVal.css("color", "var(--very-high)");
                    }

                    // Append
                    currentDataUVIndex.append(currentUVIndexLabel).append(currentUVIndexVal);
                    currentDataText.append(currentDataUVIndex);
                }
            })



            // Store the queryURL needed to get the data for the 5-day forecast
            var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputValue + "&appid=" + APIKey;
            console.log(queryURL3)
            // Use a separate ajax call for getting the UV Index with a different queryURL
            $.ajax({
                url: queryURL3,
                method: "GET"
            }).then(function(response) {
                console.log(response);
            })


        })
    })




})