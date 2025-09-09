import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET({ url }) {
    try {
        const lat = url.searchParams.get('lat');
        const lon = url.searchParams.get('lon');
        const city = url.searchParams.get('city');
        
        // Default to Cleveland if no parameters provided
        const fallbackLat = lat || '41.4993';
        const fallbackLon = lon || '-81.6944';
        const fallbackCity = city || 'Cleveland, OH';

        // Try OpenWeatherMap first if API key is available
        const apiKey = env.OPENWEATHER_API_KEY;
        if (apiKey && apiKey !== 'your_openweathermap_api_key_here' && apiKey !== '') {
            try {
                let weatherUrl;
                if (city) {
                    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`;
                } else {
                    weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
                }
                
                const response = await fetch(weatherUrl, {
                    timeout: 5000
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return json({
                        temp: Math.round(data.main.temp),
                        condition: mapOpenWeatherCondition(data.weather[0].main),
                        location: data.name,
                        source: 'OpenWeatherMap'
                    });
                }
            } catch (error) {
                console.log('OpenWeatherMap failed, trying fallback:', error.message);
            }
        }

        // Fallback to Open-Meteo (no API key required)
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${fallbackLat}&longitude=${fallbackLon}&current_weather=true&temperature_unit=fahrenheit`, {
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.current_weather) {
                    return json({
                        temp: Math.round(data.current_weather.temperature),
                        condition: mapWeatherCode(data.current_weather.weathercode),
                        location: fallbackCity,
                        source: 'Open-Meteo'
                    });
                }
            }
        } catch (error) {
            console.log('Open-Meteo failed, using simulation:', error.message);
        }

        // Final fallback - return default data
        return json({
            temp: 72,
            condition: 'sunny',
            location: fallbackCity,
            source: 'simulation'
        });

    } catch (error) {
        console.error('Weather API error:', error);
        // Return default data instead of error to prevent 500
        return json({
            temp: 72,
            condition: 'sunny',
            location: 'Current Location',
            source: 'simulation'
        });
    }
}

function mapOpenWeatherCondition(condition) {
    const conditionMap = {
        'Clear': 'sunny',
        'Sunny': 'sunny',
        'Clouds': 'cloudy',
        'Overcast': 'cloudy',
        'Rain': 'rainy',
        'Drizzle': 'rainy',
        'Thunderstorm': 'rainy',
        'Snow': 'rainy',
        'Mist': 'cloudy',
        'Fog': 'cloudy',
        'Haze': 'cloudy',
        'Dust': 'cloudy',
        'Sand': 'cloudy',
        'Ash': 'cloudy',
        'Squall': 'rainy',
        'Tornado': 'rainy'
    };
    return conditionMap[condition] || 'sunny';
}

function mapWeatherCode(code) {
    const weatherMap = {
        0: 'sunny',
        1: 'partly-cloudy',
        2: 'partly-cloudy', 
        3: 'cloudy',
        45: 'cloudy',
        48: 'cloudy',
        51: 'rainy',
        53: 'rainy',
        55: 'rainy',
        61: 'rainy',
        63: 'rainy',
        65: 'rainy',
        71: 'rainy',
        73: 'rainy',
        75: 'rainy',
        77: 'rainy',
        80: 'rainy',
        81: 'rainy',
        82: 'rainy',
        85: 'rainy',
        86: 'rainy',
        95: 'rainy',
        96: 'rainy',
        99: 'rainy'
    };
    return weatherMap[code] || 'sunny';
}
