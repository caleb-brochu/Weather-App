$( document ).ready(function() {
    
    let input = $("#userInput");
    let addCity = $(".addBtn");
    let search = $("#search");
    let location = $('#location')
    let temp = $('#temp')
    let windSpeed = $('#wind-speed')
    let uvIndex = $('#uv-index')
    let forecast =  $("#addFiveDay")
    let cities = ["Seattle"];

    createBtn()
    search.on("click", function(){
        event.preventDefault();
        if(input.val()===""){
            alert("No location entered!")
        }
        else{
            //push input.val() to cities array 
            cities.push(input.val());
            // call a function that creates a button for each element in cities array
            findWeather(input.val());
            createBtn();
        }
    });

    //function to loop through array and create buttons 
    function createBtn(){
        addCity.empty();
        forecast.empty();
        for (let i = 0; i < cities.length; i++){
            // Create button element 
            let a = $("<button>");
            // Adding a class's to button
            a.addClass("btn btn-secondary btn-lg btn-block city");
            // Adding a data-attribute
            a.attr("data-name", cities[i]);
            // Providing the initial button text
            a.text(cities[i]);
            // Adding the button to the addCity div
            addCity.prepend(a);
        }
    };

    
    $(document).on("click", ".city", function(){
        findWeather($(this).attr("data-name"));
    });



    function findWeather(location){
        
        let APIKey = "e1ded9334debf557f66848e3668d8c49";
        let queryURL = "https://api.openweathermap.org/data/2.5/forecast?" +
        "q=" + location + "&units=imperial&appid=" + APIKey;
        forecast.empty();
      // Here we run our AJAX call to the OpenWeatherMap API
      $.ajax({
        url: queryURL,
        method: "GET"
      })
        // We store all of the retrieved data inside of an object called "response"
        .then(function(response) {
            let latitude = response.city.coord.lat;
            let longitude = response.city.coord.lon;
            $("#location").text(response.city.name + " (" + moment().format('l') + ")")
            $("#temp").text("Temperature: " + response.list[0].main.temp + String.fromCharCode(176) + "F");
            $("#humidity").text("Humidity: " + response.list[0].main.humidity + "%");
            $("#wind-speed").text("Wind Speed: " + response.list[0].wind.speed+ " MPH");

            let UVindex = "";
            let UVindexURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid="+ 
             APIKey + "&lat="+ latitude + "&lon=" + longitude;
  
            $.ajax({
                url: UVindexURL,
                method: "GET"
              }).then(function(index) {
                  UVindex = index[0].value;
                  $("#uv-index").text("UV Index: " + UVindex);
              });

          for (let i = 1; i < 6; i++){
            // Create button element 
            let icon = response.list[i].weather[0].icon;
            let iconURL = "http://openweathermap.org/img/w/" + icon + ".png";

            let column = $("<div>").addClass("col-md-2");
            let card = $("<div>").addClass("card");
            let cardBody = $("<div>").addClass("card-body");
            let fiveDate =  $("<div>").text(moment().add(i, 'days').format('l'))
            let fiveIcon = $("<div>").html("<img src='" + iconURL  + "'>");
            let fiveTemp = $("<div>").text("Temp: " + response.list[i].main.temp + String.fromCharCode(176) + "F")
            let fiveHumidity = $("<div>").text("Humidity: " + response.list[i].main.humidity + "%")

            cardBody.append(fiveDate);
            cardBody.append(fiveIcon);
            cardBody.append(fiveTemp);
            cardBody.append(fiveHumidity);
            card.append(cardBody);
            column.append(card);
            $("#addFiveDay").append(column);

            
          }
          // Log the resulting object
          console.log(response);
        });
    };
});    
