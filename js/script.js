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
        })
    })

    function renderData() {
        
    }


})