<script>
    import { onMount } from 'svelte';
    import { systemStatus, initSystemStatus, getBatteryIcon, getWiFiIcon, getWeatherIcon } from '../lib/systemStatus.js';
    
    export let openWindows = [];
    export let activeWindow = null;
    export let openApp;
    export let focusWindow;

    let showStartMenu = false;
    let status = $systemStatus;

    onMount(() => {
        initSystemStatus();
    });

    function toggleStartMenu() {
        showStartMenu = !showStartMenu;
    }

    function handleAppClick(windowId) {
        const window = openWindows.find(w => w.id === windowId);
        if (window) {
            if (window.minimized) {
                minimizeWindow(windowId);
            } else {
                focusWindow(windowId);
            }
        }
    }

    function minimizeWindow(windowId) {
        // This will be handled by the parent component
        const event = new CustomEvent('minimize', { detail: { windowId } });
        window.dispatchEvent(event);
    }

    function getAppIcon(appType) {
        const icons = {
            'file-manager': 'fa-folder',
            'terminal': 'fa-terminal',
            'projects': 'fab fa-github',
            'resume': 'fa-file-pdf',
            'about': 'fa-user',
            'contact': 'fa-envelope'
        };
        return icons[appType] || 'fa-window-maximize';
    }
</script>

<div class="absolute bottom-0 left-0 right-0 h-12 sm:h-14 bg-gray-800 border-t border-gray-600 flex items-center px-1 sm:px-2 z-50">
    <!-- Start Menu Button -->
    <button
        class="taskbar-item px-2 sm:px-3 py-1 sm:py-2 rounded flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
        on:click={toggleStartMenu}
        class:bg-gray-700={showStartMenu}
    >
        <img src="/sam-logo.png" alt="Samuel" class="w-5 h-5 sm:w-6 sm:h-6" />
        <span class="hidden sm:block">Samuel</span>
    </button>

    <!-- App Buttons -->
    <div class="flex-1 flex items-center gap-1 ml-2 sm:ml-4 overflow-x-auto">
        {#each openWindows as window (window.id)}
            <button
                class="taskbar-item px-2 sm:px-3 py-1 sm:py-2 rounded flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium min-w-0 flex-shrink-0"
                class:bg-gray-700={activeWindow === window.id}
                class:opacity-50={window.minimized}
                on:click={() => handleAppClick(window.id)}
            >
                <i class="fas {getAppIcon(window.type)} text-xs"></i>
                <span class="hidden md:block truncate max-w-20 sm:max-w-24">{window.title}</span>
                {#if window.minimized}
                    <i class="fas fa-minus text-xs opacity-50"></i>
                {/if}
            </button>
        {/each}
    </div>

    <!-- System Tray -->
    <div class="flex items-center gap-2">
        <!-- Weather -->
        <div class="flex items-center gap-1 text-xs">
            <i class="{getWeatherIcon(status.weather.condition)} text-yellow-400"></i>
            <span class="hidden sm:block">{status.weather.temp}°F</span>
        </div>
        <!-- WiFi -->
        <div class="flex items-center gap-1 text-xs">
            <i class="{getWiFiIcon(status.wifi)}"></i>
            <span class="hidden sm:block">{status.wifi}%</span>
        </div>
        <!-- Battery -->
        <div class="flex items-center gap-1 text-xs">
            <i class="{getBatteryIcon(status.battery, status.charging)}"></i>
            <span class="hidden sm:block">{status.battery}%</span>
        </div>
        <!-- Time -->
        <div class="text-xs mono">
            {status.time}
        </div>
    </div>
</div>

<!-- Start Menu -->
{#if showStartMenu}
    <div class="absolute bottom-12 left-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
        <div class="p-4">
            <div class="text-sm font-semibold mb-3 text-gray-300">Applications</div>
            <div class="space-y-1">
                <button
                    class="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-3"
                    on:click={() => { openApp('terminal'); showStartMenu = false; }}
                >
                    <i class="fas fa-terminal kali-green"></i>
                    <span>Terminal</span>
                </button>
                <button
                    class="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-3"
                    on:click={() => { openApp('file-manager'); showStartMenu = false; }}
                >
                    <i class="fas fa-folder kali-blue"></i>
                    <span>File Manager</span>
                </button>
                <button
                    class="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-3"
                    on:click={() => { openApp('projects'); showStartMenu = false; }}
                >
                    <i class="fab fa-github kali-yellow"></i>
                    <span>GitHub Projects</span>
                </button>
                <button
                    class="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-3"
                    on:click={() => { openApp('about'); showStartMenu = false; }}
                >
                    <i class="fas fa-user kali-red"></i>
                    <span>About Samuel</span>
                </button>
                <button
                    class="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-3"
                    on:click={() => { openApp('contact'); showStartMenu = false; }}
                >
                    <i class="fas fa-envelope kali-blue"></i>
                    <span>Contact</span>
                </button>
                <button
                    class="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-3"
                    on:click={() => { openApp('weather'); showStartMenu = false; }}
                >
                    <i class="fas fa-cloud-sun kali-yellow"></i>
                    <span>Weather</span>
                </button>
                        <button
                            class="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-3"
                            on:click={() => { openApp('clock'); showStartMenu = false; }}
                        >
                            <i class="fas fa-clock kali-green"></i>
                            <span>Clock</span>
                        </button>
                        <div class="border-t border-gray-600 my-2"></div>
                        <div class="text-xs font-semibold text-gray-400 mb-2 px-3">Games</div>
                        <button
                            class="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-3"
                            on:click={() => { openApp('memory'); showStartMenu = false; }}
                        >
                            <i class="fas fa-brain kali-purple"></i>
                            <span>Memory Game</span>
                        </button>
            </div>
        </div>
    </div>
{/if}
