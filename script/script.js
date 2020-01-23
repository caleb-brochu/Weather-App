
$('.five-day').hide();

$( document ).ready(function() {
    
    let input = $("#userInput");
    let addCity = $(".addBtn");
    let search = $("#search");
    let location = $('#location')
    let temp = $('#temp')
    let windSpeed = $('#wind-speed')
    let uvIndex = $('#uv-index')
    let forecast =  $("#addFiveDay")
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    
    createBtn()
    search.on("click", function(){
        event.preventDefault();
        if(input.val()===""){
            alert("No location entered!")
        }
        else{
            //push input.val() to cities array 
            cities.push(input.val());
            localStorage.setItem('cities', JSON.stringify(cities))
            // call a function that creates a button for each element in cities array
            findWeather(input.val());
            $('.five-day').show();
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
            a.addClass("btn btn-lg btn-block city");
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
            let weatherIcon = "http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png";
            $("#location").html(response.city.name + " (" + moment().format('l') + ")" + "<img  src='" +  weatherIcon  + "'>");
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

          for (let i = 7; i < 40; i=i+8){
            // Create button element 
            let icon = response.list[i].weather[0].icon;
            let iconURL = "http://openweathermap.org/img/w/" + icon + ".png";

            let column = $("<div>").addClass("block");
            let card = $("<div>").addClass("card");
            let cardBody = $("<div>").addClass("card-body");
            let fiveDate =  $("<div>").text(moment().add(i/8, 'days').format('l'));
            let fiveIcon = $("<div>").html("<img src='" + iconURL  + "'>");
            let fiveTemp = $("<div>").text("Temp: " + response.list[i].main.temp + String.fromCharCode(176) + "F");
            let fiveHumidity = $("<div>").text("Humidity: " + response.list[i].main.humidity + "%");

            cardBody.append(fiveDate);
            cardBody.append(fiveIcon);
            cardBody.append(fiveTemp);
            cardBody.append(fiveHumidity);
            card.append(cardBody);
            column.append(card);
            $("#addFiveDay").append(column);
            $('.five-day').show();
            
          }
          // Log the resulting object
          console.log(response);
        });
    };
});    
