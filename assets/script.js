let cityChosen = $('#CityName');
let searchButton = $('#SerchButton');

let curentWetherSection = $(".CurrentWether")

let cityTitle = $('<h1>');

let futureDates = $('.futuredates');

let futureWeather = $('.FutureWether');

let searchedItems = $('.searced-items')



let temp = $('<p>');
let wind = $('<p>');
let humidity = $('<p>');
let uvi = $('<p>');
let iconOfWether = $('<img>');

let citiesSearched = [];

let search = $('.search');

let infoOfCities = {};

const apiKey = "0ee3bf11765f2dbf4429370b2519d0e2";

let queryURL;
let otherURL;

var today = moment();

let newCityname = "";

let cityinsearchhistory = false;


let originalCitychosen = false;

function futureWether(data){
    console.log(data);
    futureDates.empty();

    for(let i=1;i<6;i++){

        let info = $('<div>');
        let futuretemp = $('<span>');
        let futureWind = $('<span>');
        let futureHumidity = $('<span>');
        let futureicon = $('<img>')

        let index = i-1;
        console.log( "index " + index.toString());
        futuretemp.text("Temp: " + data["daily"][index]["temp"]["day"]);
        futureWind.text("Wind: " + data["daily"][index]["wind_speed"]);
        futureHumidity.text("Humidity " + data["daily"][index]["humidity"]);
        futureicon.attr('src', 'https://openweathermap.org/img/w/' + data["daily"][index]["weather"]["0"]["icon"] + '.png')

        let new_date = moment().add(i, 'days');
        let advancdedFate = new_date.toString().substring(4,15);
        info.addClass('formatColumns');
        info.append(advancdedFate);
        info.append(futureicon);
        info.append(futuretemp);
        info.append(futureWind);
        info.append(futureHumidity);
        
        

        futureDates.append(info);

        console.log("futuredates " + futureDates);

        futureWeather.append(futureDates);




        console.log( "thissss " + advancdedFate);
    }
    
}


function something(data){
    console.log(data);
    let currentDate = today.format("MMM Do, YYYY");
    if(cityinsearchhistory){
        cityTitle.text(newCityname + " (" + currentDate + ")");
        cityinsearchhistory = false;
    }
    else{
        cityTitle.text(cityChosen.val() + " (" + currentDate + ")");
    }
    curentWetherSection.append(cityTitle);

   
    iconOfWether.attr('src', 'https://openweathermap.org/img/w/' + data["current"]["weather"]["0"]["icon"] + '.png');
    curentWetherSection.append(iconOfWether);

    temp.text("Temp: " + data["current"]["temp"] + " deg");
    curentWetherSection.append(temp);

    wind.text("Wind: " + data["current"]["wind_speed"]);
    curentWetherSection.append(wind);

    humidity.text("Humidity " + data["current"]["humidity"] + " %");
    curentWetherSection.append(humidity);

    uvi.text("UV index: " + data["current"]["uvi"]);
    curentWetherSection.append(uvi);

    
    
    

    
}

searchButton.on('click', function(){
    DisplayCities(cityChosen.val());
    console.log("this " + cityChosen.val());
    queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityChosen.val() + "&units=metric&appid=" + apiKey;
    FindData();
   
    
})


function FindData(){
    
    

    fetch(queryURL)
        .then(function(response){
            return response.json();
        })

        .then(function(data){
            otherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data["coord"]["lat"] + "&units=metric&lon=" + data["coord"]["lon"] + "&appid=" +  apiKey;
            fetch(otherURL)
                .then(function(response){
                    return response.json();
                })
                .then(function(data1){
                    something(data1)
                    futureWether(data1);
                    console.log(data1);
                })
    
        
        
        })

}

function DisplayCities(city){
    citiesSearched.push(city);

    let placeForCity = $('<h3>');
    placeForCity.text(city);
    placeForCity.css('background-color', 'gray');
    searchedItems.append(placeForCity);

    placeForCity.on('click',function(){
        cityinsearchhistory = true;
        console.log($(this).text());
        newCityname = $(this).text();
        queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + $(this).text() + "&units=metric&appid=" + apiKey;
        FindData();
        
    })
    

    

    if(localStorage.getItem('items') == null){
        localStorage.setItem('items', JSON.stringify(citiesSearched));
    }
    else{
        citiesSearched = JSON.parse(localStorage.getItem('items'));
        citiesSearched.push(city)
        localStorage.setItem('items',JSON.stringify(citiesSearched));
    }


}

$(document).ready(function(){
    
    if(localStorage.getItem('items') !==null){
        let items = JSON.parse(localStorage.getItem('items'));
        for(let i=0;i<items.length;i++){
            let placeForCity = $('<h3>');
            placeForCity.text(items[i]);
            placeForCity.css('background-color', 'gray');
            searchedItems.append(placeForCity);
        }
    }

    $(".searced-items h3").on("click", function(){
        newCityname = $(this).text();
        cityinsearchhistory = true;
        queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + $(this).text() + "&units=metric&appid=" + apiKey;
        FindData();
    })
    

})