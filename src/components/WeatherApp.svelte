<script>
    import { onMount } from 'svelte';
    import { systemStatus } from '../lib/systemStatus.js';
    
    // These props are passed by the Window component wrapper
    export let window = {};
    export let closeWindow = () => {};
    export let minimizeWindow = () => {};
    export let maximizeWindow = () => {};
    
    let status = $systemStatus;
    let currentTime = new Date();
    let timeInterval;
    
    onMount(() => {
        // Update time every second
        timeInterval = setInterval(() => {
            currentTime = new Date();
        }, 1000);
        
        return () => {
            if (timeInterval) clearInterval(timeInterval);
        };
    });
    
    function getWeatherIcon(condition) {
        const icons = {
            'sunny': 'fas fa-sun',
            'clear': 'fas fa-sun',
            'partly-cloudy': 'fas fa-cloud-sun',
            'cloudy': 'fas fa-cloud',
            'overcast': 'fas fa-cloud',
            'rainy': 'fas fa-cloud-rain',
            'rain': 'fas fa-cloud-rain',
            'drizzle': 'fas fa-cloud-drizzle',
            'thunderstorm': 'fas fa-bolt',
            'storm': 'fas fa-bolt',
            'snow': 'fas fa-snowflake',
            'snowy': 'fas fa-snowflake',
            'mist': 'fas fa-smog',
            'fog': 'fas fa-smog',
            'foggy': 'fas fa-smog',
            'haze': 'fas fa-smog',
            'dust': 'fas fa-smog',
            'sand': 'fas fa-smog',
            'ash': 'fas fa-smog',
            'squall': 'fas fa-wind',
            'tornado': 'fas fa-tornado',
            'windy': 'fas fa-wind',
            'hot': 'fas fa-thermometer-full',
            'cold': 'fas fa-thermometer-empty',
            'humid': 'fas fa-tint',
            'dry': 'fas fa-sun'
        };
        return icons[condition] || 'fas fa-sun';
    }
    
    function getWeatherDescription(condition) {
        const descriptions = {
            'sunny': 'Sunny',
            'clear': 'Clear',
            'partly-cloudy': 'Partly Cloudy',
            'cloudy': 'Cloudy',
            'overcast': 'Overcast',
            'rainy': 'Rainy',
            'rain': 'Rain',
            'drizzle': 'Drizzle',
            'thunderstorm': 'Thunderstorm',
            'storm': 'Storm',
            'snow': 'Snow',
            'snowy': 'Snowy',
            'mist': 'Misty',
            'fog': 'Foggy',
            'foggy': 'Foggy',
            'haze': 'Hazy',
            'dust': 'Dusty',
            'sand': 'Sandy',
            'ash': 'Ashy',
            'squall': 'Squally',
            'tornado': 'Tornado',
            'windy': 'Windy',
            'hot': 'Hot',
            'cold': 'Cold',
            'humid': 'Humid',
            'dry': 'Dry'
        };
        return descriptions[condition] || 'Unknown';
    }
    
    function getGreeting() {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    }
</script>

<div class="w-full h-full bg-gray-900 text-white flex flex-col">
    <!-- Weather Header -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
        <div class="text-6xl mb-4">
            <i class="{getWeatherIcon(status.weather.condition)} text-yellow-300"></i>
        </div>
        <h1 class="text-4xl font-bold mb-2">{status.weather.temp}°F</h1>
        <p class="text-xl text-gray-200">{getWeatherDescription(status.weather.condition)}</p>
        <p class="text-sm text-gray-300 mt-2">
            <i class="fas fa-map-marker-alt mr-1"></i>
            {status.weather.location}
        </p>
    </div>
    
    <!-- Weather Details -->
    <div class="flex-1 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Current Time -->
            <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="text-lg font-semibold mb-3 flex items-center">
                    <i class="fas fa-clock mr-2 text-blue-400"></i>
                    Current Time
                </h3>
                <div class="text-3xl font-mono font-bold text-green-400">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div class="text-sm text-gray-400 mt-2">
                    {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>
            
            <!-- Weather Info -->
            <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="text-lg font-semibold mb-3 flex items-center">
                    <i class="fas fa-cloud mr-2 text-blue-400"></i>
                    Weather Details
                </h3>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Temperature:</span>
                        <span class="font-semibold">{status.weather.temp}°F</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Condition:</span>
                        <span class="font-semibold">{getWeatherDescription(status.weather.condition)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Location:</span>
                        <span class="font-semibold">{status.weather.location}</span>
                    </div>
                </div>
            </div>
            
            <!-- System Status -->
            <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="text-lg font-semibold mb-3 flex items-center">
                    <i class="fas fa-battery-half mr-2 text-green-400"></i>
                    System Status
                </h3>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Battery:</span>
                        <span class="font-semibold">{status.battery}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">WiFi:</span>
                        <span class="font-semibold">{status.wifi}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Status:</span>
                        <span class="font-semibold text-green-400">Online</span>
                    </div>
                </div>
            </div>
            
            <!-- Greeting -->
            <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="text-lg font-semibold mb-3 flex items-center">
                    <i class="fas fa-user mr-2 text-purple-400"></i>
                    Greeting
                </h3>
                <div class="text-xl font-semibold text-purple-400">
                    {getGreeting()}, Samuel!
                </div>
                <div class="text-sm text-gray-400 mt-2">
                    Welcome to your portfolio OS
                </div>
            </div>
        </div>
        
        <!-- Weather Forecast Placeholder -->
        <div class="mt-6 bg-gray-800 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-3 flex items-center">
                <i class="fas fa-chart-line mr-2 text-yellow-400"></i>
                Weather Forecast
            </h3>
            <div class="text-center text-gray-400 py-4">
                <i class="fas fa-cloud-sun text-4xl mb-2"></i>
                <p>Extended forecast coming soon...</p>
            </div>
        </div>
    </div>
</div>
