$(document).ready(function () {

    // Use to get data for getting the date and time
    var forecastWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var forecastMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var forecastDates = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31st"];
    var forecastTimes = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    // Target search history section to append new Ul and li's to it
    var searchHistorySection = $("#searchHistory");

    // Create a search history array
    var searchHistoryArr = [];

    // Store search history array into local storage
    function storeSearchHistory() {
        localStorage.setItem("searchHistoryArr", JSON.stringify(searchHistoryArr));
    }

    // Create a function to render search history
    function renderSearchHistory() {
        // Clear the search history section
        searchHistorySection.html("");
        // Create ul and add classes
        var searchHistoryUl = $("<ul>").addClass("uk-slider-items uk-grid cityChips");
        for (var i = 0; i < searchHistoryArr.length; i++) {
            // Create li's and add classes
            var newSearchLi = $("<li>").addClass("sliderItem uk-padding");
            var newSearchSpan = $("<span>").addClass("uk-button uk-button-default uk-button-small cityChip");
            var newSearchDelete = $("<span>").addClass("uk-icon-button uk-light closeBtn");
            // Set contexts
            newSearchSpan.text(searchHistoryArr[i]);
            newSearchDelete.attr("uk-icon", "close");
            // Append each to the Ul
            newSearchSpan.append(newSearchDelete);
            newSearchLi.append(newSearchSpan);
            searchHistoryUl.prepend(newSearchLi);
        }
        // Append Ul to the search history section
        searchHistorySection.append(searchHistoryUl);
    }

    init();

    // Create an init function
    function init() {
        // Get search history array from localStorage
        var storedSearchHistory = JSON.parse(localStorage.getItem("searchHistoryArr"));
        // If array were retrieved from localStorage, update the todos array to it
        if (storedSearchHistory !== null) {
            searchHistoryArr = storedSearchHistory;
        }
        // Render array to the DOM
        renderSearchHistory();
    }



    // Declare global variable inputValue for use on events
    var inputValue;

    // Listen to an event when a button from the search history bar is clicked
    $(document).on("click", ".cityChip", function () {
        // Set input value to the text of the cityChip
        inputValue = $(this).text();
        // Display data on screen
        displayWeatherData();
    })

    // Listen to an event when a close button is clicked
    $(document).on("click", ".closeBtn", function (e) {
        // Stop propagation
        e.stopPropagation();
        // Get the text of it's parent element
        var cityChipText = $(this).parent().text();
        // Find its index in the search history array
        var cityChipIndex = searchHistoryArr.indexOf(cityChipText);
        // Remove it from the array
        searchHistoryArr.splice(cityChipIndex, 1);
        // Store it in the localStorage
        storeSearchHistory();
        // Get the updated array back from the localStorage and render on screen
        renderSearchHistory();
    })

    // Create a function that calls the weather api using ajax and displays the data requested
    function displayWeatherData() {
        // Target the div to append dynamically created divs to
        var todayWeatherSection = $(".todayWeatherSection");
        // Clear section of any html
        todayWeatherSection.empty();
        // $(".fiveDaySection").empty();
        $(".fiveDaySection").children().not(':first').remove();
        // Store api key
        var APIKey = "5af80191049a5aac0e5b1a43d2d1ccfe";
        // Store queryURL with the proper strings
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputValue + "&appid=" + APIKey;

        // If the inputValue is not empty
        if (inputValue !== "" && searchHistoryArr.indexOf(inputValue) == -1) {
            // Push it into the array
            searchHistoryArr.push(inputValue);
            // Store array into localstorage and render to screen
            storeSearchHistory();
            renderSearchHistory();
            // Then clear the input field
            $("#cityInput").val("");
        }

        // Use ajax to get data for the city
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            // Use response to get the necessary data: City name, Temperature in Fahrenheit, Humidity, Wind speed, and Coordinates (to use for UV Index)
            var curCity = response.name;
            var curCountry = response.sys.country;
            // var curDateTime = moment().format('MMM Do, h:mm a'); // Get current time using moment.js
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
                var currentDataTemp = $("<div>").addClass("uk-heading-2xlarge uk-margin-remove tempVal");
                var currentDataTempUnit = $("<span>").addClass("uk-heading-large uk-text-top tempUnit");
                var currentDataHumidity = $("<div>").addClass("otherInfo");
                var currentHumidityLabel = $("<span>").addClass("uk-text-small");
                var currentHumidityVal = $("<span>").addClass("uk-text-bold");
                var currentDataWindSpeed = $("<div>").addClass("otherInfo");
                var currentWindSpeedLabel = $("<span>").addClass("uk-text-small");
                var currentWindSpeedVal = $("<span>").addClass("uk-text-bold");
                var currentWeatherImage = $("<img>");
                var currentWeatherDescription = $("<p>").addClass("weatherDes uk-text-small uk-margin-remove uk-padding-large uk-padding-remove-vertical");


                // Set contexts
                currentDataCity.text(curCity + ", " + curCountry); // Get city from response
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
                currentDataText.append(currentDataCity).append(currentDataTemp).append(currentDataHumidity).append(currentDataWindSpeed);
                currentDataGraphic.append(currentWeatherImage).append(currentWeatherDescription);
                currentWeatherData.append(currentDataText).append(currentDataGraphic);
                todayWeatherSection.append(currentWeatherData);


                // To display searched city's local date and time
                var apiKeyTimezone = "KDN1W1M1XRYJ";
                var queryURLTimezone = "https://api.timezonedb.com/v2.1/get-time-zone?key=" + apiKeyTimezone + "&format=json" + "&by=position" + "&lat=" + cityLat + "&lng=" + cityLon;

                $.ajax({
                    url: queryURLTimezone,
                    method: "GET"
                }).then(function (response) {
                    // Request for the city's local date and time
                    var cityDateTimeUnformated = response.formatted;
                    // Create an instance of each date and time
                    var cityDateInstance = new Date(cityDateTimeUnformated);
                    // Get Month
                    var cityMonth = forecastMonths[cityDateInstance.getMonth()];
                    // Get Day of month
                    var cityDayOfMonth = forecastDates[cityDateInstance.getDate() - 1];
                    // Get the hour
                    var cityHour = forecastTimes[cityDateInstance.getHours()];
                    // Get minutes
                    var cityMinutes = cityDateInstance.getMinutes();
                    // If minutes is less than 10, add a 0 in front of it
                    if (cityMinutes < 10) {
                        cityMinutes = "0" + cityMinutes;
                    }
                    // Get am or pm
                    var cityTimePeriod;
                    if (cityDateInstance.getHours() >= 0 && cityDateInstance.getHours() < 12) {
                        cityTimePeriod = "am";
                    } else {
                        cityTimePeriod = "pm";
                    }
                    // Format the date and time
                    var cityDateTimeFormatted = cityMonth + " " + cityDayOfMonth + ", " + cityHour + ":" + cityMinutes + " " + cityTimePeriod;
                    // Create a div to add the formatted date and time to
                    var currentDataDate = $("<div>").text(cityDateTimeFormatted);
                    // Prepend it to the currentDataText div
                    currentDataText.prepend(currentDataDate);


                    renderBackground();
                    // Create a function to change the background gradient depending on city's local time
                    function renderBackground() {
                        // Target divs
                        var todayWeather = $("#todayWeather");
                        // Get cityHour in 24-hr format
                        var cityHour = cityDateInstance.getHours();
                        // Adjust color based on the city's local hour
                        if (cityHour >= 6 && cityHour < 19) {
                            todayWeather.css("background-image", "var(--daytime)");
                            currentWeatherDescription.addClass("uk-mute");
                        } else {
                            todayWeather.css("background-image", "var(--nighttime)");
                            currentWeatherDescription.addClass("uk-light");
                        }
                    }
                })


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

            }


            // Store the queryURL needed to get the data for the 5-day forecast
            var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + inputValue + "&appid=" + APIKey;

            // Use a separate ajax call for getting the UV Index with a different queryURL
            $.ajax({
                url: queryURL3,
                method: "GET"
            }).then(function (response) {

                // Target fiveDaySection
                var fiveDaySection = $(".fiveDaySection");

                // Get list array
                var listArray = response.list;

                renderForecast();
                // Create a function to render data for the forecast
                function renderForecast() {
                    // Loop through array
                    for (var i = 0; i < listArray.length; i++) {
                        // Find the date and time data
                        var futureDate = listArray[i].dt_txt;
                        // Create an instance of each date and time
                        var dateInstance = new Date(futureDate);
                        // Get the hours
                        var futureHour = dateInstance.getHours();
                        // If the hours is greater than the current hour
                        if (futureHour === 12) {
                            // Then get the date, weather icon, temperature, humidity
                            // Turn date to format Saturday, Mar 28
                            var forecastDay = forecastWeekdays[dateInstance.getDay()];
                            var forecastMonth = forecastMonths[dateInstance.getMonth()];
                            var forecastDate = dateInstance.getDate();
                            var forecastDayDate = forecastDay + ", " + forecastMonth + " " + forecastDate;
                            var forecastIcon = listArray[i].weather[0].icon;
                            var forecastIconUrl = "https://openweathermap.org/img/wn/" + forecastIcon + "@2x.png";
                            var forecastTempK = listArray[i].main.temp;
                            var forecastHumidity = listArray[i].main.humidity;
                            // Convert temp to F
                            var forecastTempF = ((forecastTempK - 273.15) * 1.80 + 32).toFixed();
                            // Create divs and add classes
                            var forecastCardWrapper = $("<div>").addClass("uk-width-1-5@m uk-width-1-3@s uk-light forecastCardWrapper");
                            var forecastCard = $("<div>").addClass("uk-card uk-card-body uk-flex uk-flex-column uk-flex-middle forecastCard");
                            var forecastDateSpan = $("<span>").addClass("uk-text-bold forecastDate");
                            var forecastIconImg = $("<img>");
                            var forecastTempDiv = $("<div>").addClass("uk-heading-medium uk-margin-remove");
                            var forecastTempUnitSpan = $("<span>").addClass("uk-heading-small uk-text-top");
                            var forecastHumidityDiv = $("<div>").addClass("humidityForecast");
                            var forecastHumidityLabel = $("<span>").addClass("uk-text-small");
                            var forecastHumidityVal = $("<span>").addClass("uk-text-bold");
                            // Set the contexts
                            forecastDateSpan.text(forecastDayDate);
                            forecastIconImg.attr({ "data-src": forecastIconUrl, alt: "Weather icon", width: "40px", "uk-img": "" });
                            forecastTempDiv.text(forecastTempF);
                            forecastTempUnitSpan.html("&#176F");
                            forecastHumidityLabel.text("Humidity: ");
                            forecastHumidityVal.text(forecastHumidity + "%");

                            // Append
                            forecastHumidityDiv.append(forecastHumidityLabel).append(forecastHumidityVal);
                            forecastTempDiv.append(forecastTempUnitSpan);
                            forecastCard.append(forecastDateSpan).append(forecastIconImg).append(forecastTempDiv).append(forecastHumidityDiv);
                            forecastCardWrapper.append(forecastCard);
                            fiveDaySection.append(forecastCardWrapper);
                        }

                    }

                }

            })

        })
        // Clear the input field
        $("#cityInput").val("");

    }

    // Add a submit event to the search form
    $("#searchForm").on("submit", function (e) {
        e.preventDefault();
        // Define global variable inputValue;
        inputValue = $("#cityInput").val().trim()
        // Display data on screen
        displayWeatherData();
    })

    // Add a click event to the search button
    $("#searchBtn").on("click", function (e) {
        e.preventDefault();
        // Define global variable inputValue;
        inputValue = $("#cityInput").val().trim()
        // Do nothing if inputValue is empty
        if (inputValue == "") {
            return;
        }
        // Display data on screen
        displayWeatherData();
    })


})