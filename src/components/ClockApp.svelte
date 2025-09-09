<script>
    import { onMount } from 'svelte';
    
    // These props are passed by the Window component wrapper
    export let window = {};
    export let closeWindow = () => {};
    export let minimizeWindow = () => {};
    export let maximizeWindow = () => {};
    
    let currentTime = new Date();
    let timeInterval;
    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    onMount(() => {
        // Update time every second
        timeInterval = setInterval(() => {
            currentTime = new Date();
        }, 1000);
        
        return () => {
            if (timeInterval) clearInterval(timeInterval);
        };
    });
    
    function getGreeting() {
        const hour = currentTime.getHours();
        if (hour < 5) return 'Good Night';
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        if (hour < 21) return 'Good Evening';
        return 'Good Night';
    }
    
    function getTimeOfDay() {
        const hour = currentTime.getHours();
        if (hour < 6) return 'Night';
        if (hour < 12) return 'Morning';
        if (hour < 17) return 'Afternoon';
        if (hour < 21) return 'Evening';
        return 'Night';
    }
    
    function getTimeIcon() {
        const hour = currentTime.getHours();
        if (hour < 6) return 'fas fa-moon';
        if (hour < 12) return 'fas fa-sun';
        if (hour < 17) return 'fas fa-sun';
        if (hour < 21) return 'fas fa-sunset';
        return 'fas fa-moon';
    }
    
    function getTimeColor() {
        const hour = currentTime.getHours();
        if (hour < 6) return 'text-blue-400';
        if (hour < 12) return 'text-yellow-400';
        if (hour < 17) return 'text-orange-400';
        if (hour < 21) return 'text-red-400';
        return 'text-blue-400';
    }
</script>

<div class="w-full h-full bg-gray-900 text-white flex flex-col">
    <!-- Clock Header -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
        <div class="text-6xl mb-4 {getTimeColor()}">
            <i class="{getTimeIcon()}"></i>
        </div>
        <h1 class="text-5xl font-bold font-mono mb-2 {getTimeColor()}">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </h1>
        <p class="text-xl text-gray-200">{getGreeting()}, Samuel!</p>
    </div>
    
    <!-- Clock Details -->
    <div class="flex-1 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Digital Clock -->
            <div class="bg-gray-800 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <i class="fas fa-clock mr-2 text-blue-400"></i>
                    Digital Clock
                </h3>
                <div class="text-center">
                    <div class="text-4xl font-mono font-bold text-green-400 mb-2">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <div class="text-lg text-gray-300">
                        {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>
            
            <!-- Time Zone Info -->
            <div class="bg-gray-800 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <i class="fas fa-globe mr-2 text-green-400"></i>
                    Time Zone
                </h3>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Timezone:</span>
                        <span class="font-semibold">{timezone}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">UTC Offset:</span>
                        <span class="font-semibold">{currentTime.getTimezoneOffset() / -60}h</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Time of Day:</span>
                        <span class="font-semibold text-purple-400">{getTimeOfDay()}</span>
                    </div>
                </div>
            </div>
            
            <!-- Analog Clock Placeholder -->
            <div class="bg-gray-800 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <i class="fas fa-circle mr-2 text-yellow-400"></i>
                    Analog Clock
                </h3>
                <div class="text-center">
                    <div class="w-32 h-32 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <div class="text-4xl {getTimeColor()}">
                            <i class="{getTimeIcon()}"></i>
                        </div>
                    </div>
                    <p class="text-sm text-gray-400">Analog clock coming soon...</p>
                </div>
            </div>
            
            <!-- Time Statistics -->
            <div class="bg-gray-800 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <i class="fas fa-chart-bar mr-2 text-red-400"></i>
                    Time Statistics
                </h3>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Hour:</span>
                        <span class="font-semibold">{currentTime.getHours()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Minute:</span>
                        <span class="font-semibold">{currentTime.getMinutes()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Second:</span>
                        <span class="font-semibold">{currentTime.getSeconds()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Day of Year:</span>
                        <span class="font-semibold">{Math.floor((currentTime - new Date(currentTime.getFullYear(), 0, 0)) / 86400000)}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- World Clock Placeholder -->
        <div class="mt-6 bg-gray-800 rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4 flex items-center">
                <i class="fas fa-globe-americas mr-2 text-indigo-400"></i>
                World Clock
            </h3>
            <div class="text-center text-gray-400 py-4">
                <i class="fas fa-clock text-4xl mb-2"></i>
                <p>Multiple timezone support coming soon...</p>
            </div>
        </div>
    </div>
</div>
