$(document).ready(function() {
    const server = 'https://backend-lk6q.onrender.com';


    function saveWeatherData(data) {
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem('weatherData', JSON.stringify({ date: today, data: data }));
    }
    
    function loadWeatherData() {
        const savedData = JSON.parse(localStorage.getItem('weatherData'));
        if (savedData && savedData.date === new Date().toISOString().split('T')[0]) {
            return savedData.data;
        }
        return null;
    }

    function displayWeather(data) {
        $('#location').text(data.current.location + ' (' + data.forecast[0]["date"] + ')');
        $('#weather-icon').attr('src', data.current.icon);
        $('#temperature').text(data.current.temperature);
        $('#wind_speed').text(data.current.wind_speed.toFixed(2));
        $('#humidity').text(data.current.humidity);
        $('#condition').text(data.current.condition);
        $('#weather-info').show();  
        
        var totalDay = data.forecast.length; 
        $('#forecast-title').text(totalDay + "-Day Forecast")
        $('#forecast-list').empty();
        data.forecast.forEach(function(day) {
            $('#forecast-list').append(`
                <div class="col-md-3">
                    <div class="card mb-3 bg-secondary text-white">
                        <div class="card-body">
                            <h5 class="card-title">${day.date}</h5>
                            <img src="${day.icon}" alt="Weather icon" />
                            <p class="card-text">Temp: ${day.temperature} °C</p>
                            <p class="card-text">Wind: ${day.wind_speed.toFixed(2)} m/s</p>
                            <p class="card-text">Humidity: ${day.humidity}%</p>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    $('#search-button').click(function() {
        const city = $('#city-search').val();
        getWeather(city);
    });

    $('#current-location-button').click(function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeather(`${lat},${lon}`);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });

    function getWeather(location) {
        console.log('Fetching weather for:', location);
        $.get(`${server}/weather_app/weather/${location}/`, function(data) {
            console.log('Weather data received:', data);
            displayWeather(data);
            saveWeatherData(data);
        }).fail(function(xhr, status, error) {
            console.error('Error fetching weather data:', error);
            console.error('Status:', status);
            console.error('XHR:', xhr);
            alert('Error retrieving weather data');
        });
    }

    const savedWeatherData = loadWeatherData();
    if (savedWeatherData) {
        displayWeather(savedWeatherData);
    }

    $('#subscribe-button').on('click', function () {
        var email = $('#email-subscription').val();
        var city = $('#city-subscription').val();
        $.ajax({
            url: `${server}/email/subscribe/`,
            type: 'POST',
            data: { email: email, city: city },
            success: function (data) {
                alert(data.message);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    $('#unsubscribe-button').on('click', function () {
        var email = $('#email-subscription').val();
        var city = $('#city-subscription').val();
        $.ajax({
            url: `${server}/email/unsubscribe/`,
            type: 'POST',
            data: { email: email, city: city },
            success: function (data) {
                alert(data.message);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
});