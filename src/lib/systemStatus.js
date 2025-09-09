import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const systemStatus = writable({
    battery: 85,
    charging: false,
    wifi: 100,
    connectionType: 'unknown',
    weather: {
        temp: 72,
        condition: 'sunny',
        location: 'Current Location'
    },
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    online: navigator.onLine,
    deviceMemory: navigator.deviceMemory || 'unknown',
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown'
});

// Get device status from API
async function getDeviceStatus() {
    if (!browser) return;
    
    try {
        const response = await fetch('/api/device');
        
        if (response.ok) {
            const data = await response.json();
            
            systemStatus.update(status => ({
                ...status,
                battery: data.battery,
                charging: data.charging,
                wifi: data.wifi,
                connectionType: data.connectionType,
                online: data.online
            }));
        } else {
            throw new Error(`API error: ${response.status}`);
        }
    } catch {
        getBrowserDeviceStatus();
    }
}

function getBrowserDeviceStatus() {
    
    // Try Battery API if available
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            
            const updateBatteryStatus = () => {
                const level = Math.round(battery.level * 100);
                const charging = battery.charging;
                
                
                systemStatus.update(status => ({
                    ...status,
                    battery: level,
                    charging: charging
                }));
            };

            updateBatteryStatus();
            battery.addEventListener('chargingchange', updateBatteryStatus);
            battery.addEventListener('levelchange', updateBatteryStatus);
        }).catch(() => {
            simulateBattery();
        });
    } else {
        simulateBattery();
    }
    
    // Get network status
    getRealNetworkStatus();
}

// Battery simulation fallback
function simulateBattery() {
    let battery = 85;
    let charging = false;
    let drainRate = 0.1; // Battery drains by 0.1% every 30 seconds
    
    setInterval(() => {
        if (charging) {
            battery = Math.min(100, battery + 0.5);
            if (battery >= 100) charging = false;
        } else {
            battery = Math.max(0, battery - drainRate);
            if (battery <= 20) charging = true; // Auto-charge when low
        }
        
        systemStatus.update(status => ({
            ...status,
            battery: Math.round(battery)
        }));
    }, 30000); // Update every 30 seconds
}

// Real network status using Network Information API
function getRealNetworkStatus() {
    
    // Get connection info if available
    let connection = null;
    if ('connection' in navigator) {
        connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    }
    
    const updateNetworkStatus = () => {
        const isOnline = navigator.onLine;
        let wifiLevel = isOnline ? 100 : 0;
        let connectionType = 'unknown';
        
        if (connection) {
            connectionType = connection.effectiveType || connection.type || 'unknown';
            // Map connection types to signal strength
            switch (connectionType) {
                case '4g':
                case 'wifi':
                    wifiLevel = 100;
                    break;
                case '3g':
                    wifiLevel = 75;
                    break;
                case '2g':
                    wifiLevel = 50;
                    break;
                case 'slow-2g':
                    wifiLevel = 25;
                    break;
                default:
                    wifiLevel = isOnline ? 100 : 0;
            }
        }
        
        
        systemStatus.update(status => ({
            ...status,
            online: isOnline,
            wifi: wifiLevel,
            connectionType: connectionType
        }));
    };

    updateNetworkStatus();
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    // Listen for connection changes
    if (connection) {
        connection.addEventListener('change', updateNetworkStatus);
    }
}

// WiFi signal simulation fallback (removed - using API now)

// Get weather data from API
async function getWeatherData() {
    if (!browser) return;
    
    try {
        
        // Try to get user's location first
        let lat, lon, city;
        
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve, 
                    reject,
                    {
                        enableHighAccuracy: false,
                        timeout: 5000,
                        maximumAge: 300000 // 5 minutes
                    }
                );
            });
            lat = position.coords.latitude;
            lon = position.coords.longitude;
        } catch {
            city = 'Cleveland,OH,US';
        }
        
        // Build API URL
        const params = new URLSearchParams();
        if (lat && lon) {
            params.set('lat', lat);
            params.set('lon', lon);
        } else if (city) {
            params.set('city', city);
        }
        
        const response = await fetch(`/api/weather?${params.toString()}`);
        
        if (response.ok) {
            const data = await response.json();
            
            systemStatus.update(status => ({
                ...status,
                weather: {
                    temp: data.temp,
                    condition: data.condition,
                    location: data.location
                }
            }));
            
        } else {
            throw new Error(`Weather API error: ${response.status}`);
        }
    } catch {
        simulateWeather();
    }
}


function simulateWeather() {
    const conditions = ['sunny', 'cloudy', 'rainy', 'partly-cloudy'];
    const temps = [65, 70, 75, 80, 85, 90]; // Fahrenheit temperatures
    
    setInterval(() => {
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const temp = temps[Math.floor(Math.random() * temps.length)];
        
        systemStatus.update(status => ({
            ...status,
            weather: {
                ...status.weather,
                temp,
                condition
            }
        }));
    }, 300000); // Update every 5 minutes
}

function updateTime() {
    systemStatus.update(status => ({
        ...status,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
    
    setInterval(() => {
        systemStatus.update(status => ({
            ...status,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
    }, 1000); // Update every second
}

function getSystemInfo() {
    
    const systemInfo = {
        deviceMemory: navigator.deviceMemory || 'unknown',
        hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
        platform: navigator.platform || 'unknown',
        userAgent: navigator.userAgent || 'unknown',
        language: navigator.language || 'unknown'
    };
    
    
    systemStatus.update(status => ({
        ...status,
        deviceMemory: systemInfo.deviceMemory,
        hardwareConcurrency: systemInfo.hardwareConcurrency,
        platform: systemInfo.platform,
        language: systemInfo.language
    }));
}

export function initSystemStatus() {
    if (!browser) return;
    
    getSystemInfo();
    getDeviceStatus();
    getWeatherData();
    updateTime();
    
    setInterval(() => {
        getDeviceStatus();
    }, 30000); // Update device status every 30 seconds
    
    setInterval(() => {
        getWeatherData();
    }, 300000); // Update weather every 5 minutes
    
}

export function getWeatherIcon(condition) {
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

// Get battery icon based on level and charging state
export function getBatteryIcon(level, charging = false) {
    if (level >= 90) return charging ? 'fas fa-battery-bolt' : 'fas fa-battery-full';
    if (level >= 75) return charging ? 'fas fa-battery-bolt' : 'fas fa-battery-three-quarters';
    if (level >= 50) return charging ? 'fas fa-battery-bolt' : 'fas fa-battery-half';
    if (level >= 25) return charging ? 'fas fa-battery-bolt' : 'fas fa-battery-quarter';
    return charging ? 'fas fa-battery-bolt' : 'fas fa-battery-empty';
}

// Get WiFi icon based on signal strength
export function getWiFiIcon(level) {
    if (level >= 80) return 'fas fa-wifi';
    if (level >= 60) return 'fas fa-wifi';
    if (level >= 40) return 'fas fa-wifi';
    if (level > 0) return 'fas fa-wifi';
    return 'fas fa-wifi-slash';
}
