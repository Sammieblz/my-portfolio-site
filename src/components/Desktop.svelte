<script>
    import { onMount } from 'svelte';
    import Taskbar from './Taskbar.svelte';
    import FileManager from './FileManager.svelte';
    import Terminal from './Terminal.svelte';
    import ProjectViewer from './ProjectViewer.svelte';
    import ResumeViewer from './ResumeViewer.svelte';
    import AboutApp from './AboutApp.svelte';
    import ContactApp from './ContactApp.svelte';
import WeatherApp from './WeatherApp.svelte';
import ClockApp from './ClockApp.svelte';
import MemoryGame from './MemoryGame.svelte';
    import DesktopIcons from './DesktopIcons.svelte';
    import ContextMenu from './ContextMenu.svelte';
    import Window from './Window.svelte';

    let openWindows = [];
    let activeWindow = null;
    let showContextMenu = false;
    let contextMenuPosition = { x: 0, y: 0 };
    let desktopRef;

    // Desktop wallpaper with subtle pattern
    const wallpaperStyle = `
        background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(81, 207, 102, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #0d1117 0%, #161b22 100%);
    `;

    function openApp(appType, data = {}) {
        const windowId = `${appType}_${Date.now()}`;
        
        // Responsive window sizing
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth < 1024;
        
        let defaultWidth = 800;
        let defaultHeight = 600;
        let defaultX = 100;
        let defaultY = 100;
        
        if (isMobile) {
            // Mobile: Use 80% of screen width and 60% of screen height for better UX
            defaultWidth = Math.min(window.innerWidth * 0.8, 350);
            defaultHeight = Math.min(window.innerHeight * 0.6, 400);
            defaultX = (window.innerWidth - defaultWidth) / 2; // Center horizontally
            defaultY = 60; // Leave space for desktop icons
        } else if (isTablet) {
            // Tablet: Use 70% of screen width and 65% of screen height
            defaultWidth = Math.min(window.innerWidth * 0.7, 500);
            defaultHeight = Math.min(window.innerHeight * 0.65, 450);
            defaultX = (window.innerWidth - defaultWidth) / 2; // Center horizontally
            defaultY = 50;
        }
        
        // Better window positioning to avoid overlap on mobile
        let windowX = defaultX;
        let windowY = defaultY;
        
        if (isMobile) {
            // On mobile, stack windows more vertically to avoid overlap
            windowX = defaultX;
            windowY = defaultY + (openWindows.length * 30);
        } else if (isTablet) {
            // On tablet, moderate offset
            windowX = defaultX + (openWindows.length * 25);
            windowY = defaultY + (openWindows.length * 25);
        } else {
            // On desktop, normal offset
            windowX = defaultX + (openWindows.length * 20);
            windowY = defaultY + (openWindows.length * 20);
        }
        
        const newWindow = {
            id: windowId,
            type: appType,
            title: data.title || getAppTitle(appType),
            x: windowX,
            y: windowY,
            width: data.width || defaultWidth,
            height: data.height || defaultHeight,
            minimized: false,
            maximized: false,
            data: data
        };
        
        openWindows = [...openWindows, newWindow];
        activeWindow = windowId;
    }

    function getAppTitle(appType) {
        const titles = {
            'file-manager': 'File Manager',
            'terminal': 'Terminal',
            'projects': 'GitHub Projects',
            'resume': 'Resume.pdf',
            'about': 'About Samuel',
            'contact': 'Contact Me',
            'weather': 'Weather',
            'clock': 'Clock',
            'memory': 'Memory Game'
        };
        return titles[appType] || 'Application';
    }

    function closeWindow(windowId) {
        openWindows = openWindows.filter(w => w.id !== windowId);
        if (activeWindow === windowId) {
            activeWindow = openWindows.length > 0 ? openWindows[openWindows.length - 1].id : null;
        }
    }

    function minimizeWindow(windowId) {
        openWindows = openWindows.map(w => 
            w.id === windowId ? { ...w, minimized: !w.minimized } : w
        );
    }

    function maximizeWindow(windowId) {
        openWindows = openWindows.map(w => 
            w.id === windowId ? { ...w, maximized: !w.maximized } : w
        );
    }

    function focusWindow(windowId) {
        activeWindow = windowId;
        // Bring window to front
        const window = openWindows.find(w => w.id === windowId);
        if (window) {
            openWindows = [
                ...openWindows.filter(w => w.id !== windowId),
                window
            ];
        }
    }

    function handleDesktopClick(event) {
        if (event.target === desktopRef) {
            activeWindow = null;
            showContextMenu = false;
        }
    }

    function handleContextMenu(event) {
        event.preventDefault();
        contextMenuPosition = { x: event.clientX, y: event.clientY };
        showContextMenu = true;
    }

    function handleContextMenuAction(action) {
        showContextMenu = false;
        switch (action) {
            case 'terminal':
                openApp('terminal');
                break;
            case 'file-manager':
                openApp('file-manager');
                break;
            case 'projects':
                openApp('projects');
                break;
        }
    }

    onMount(() => {
        // Open welcome terminal on startup
        setTimeout(() => {
            openApp('terminal', { 
                title: 'Welcome Terminal',
                width: 700,
                height: 400 
            });
        }, 500);
    });
</script>

    <div 
        class="w-full h-screen relative overflow-hidden"
        style={wallpaperStyle}
        role="main"
        on:click={handleDesktopClick}
        on:contextmenu={handleContextMenu}
        bind:this={desktopRef}
    >
    <!-- Desktop Icons -->
    <DesktopIcons {openApp} />
    
    <!-- Open Windows -->
    {#each openWindows as window (window.id)}
        <Window
            {window}
            {closeWindow}
            {minimizeWindow}
            {maximizeWindow}
            zIndex={activeWindow === window.id ? 1000 : 100 + openWindows.length - openWindows.indexOf(window)}
            on:click={() => focusWindow(window.id)}
        >
            {#if window.type === 'file-manager'}
                <FileManager 
                    {window}
                    {closeWindow}
                    {minimizeWindow}
                    {maximizeWindow}
                />
            {:else if window.type === 'terminal'}
                <Terminal 
                    {window}
                    {closeWindow}
                    {minimizeWindow}
                    {maximizeWindow}
                />
            {:else if window.type === 'projects'}
                <ProjectViewer 
                    {window}
                    {closeWindow}
                    {minimizeWindow}
                    {maximizeWindow}
                />
            {:else if window.type === 'resume'}
                <ResumeViewer 
                    {window}
                    {closeWindow}
                    {minimizeWindow}
                    {maximizeWindow}
                />
            {:else if window.type === 'about'}
                <AboutApp 
                    {window}
                    {closeWindow}
                    {minimizeWindow}
                    {maximizeWindow}
                />
            {:else if window.type === 'contact'}
                <ContactApp 
                    {window}
                    {closeWindow}
                    {minimizeWindow}
                    {maximizeWindow}
                />
            {:else if window.type === 'weather'}
                <WeatherApp 
                    {window}
                    {closeWindow}
                    {minimizeWindow}
                    {maximizeWindow}
                />
            {:else if window.type === 'clock'}
                <ClockApp 
                    {window}
                    {closeWindow}
                    {minimizeWindow}
                    {maximizeWindow}
                />
            {:else if window.type === 'memory'}
                <MemoryGame 
                    {window}
                    {closeWindow}
                    {minimizeWindow}
                    {maximizeWindow}
                />
            {/if}
        </Window>
    {/each}

    <!-- Context Menu -->
    {#if showContextMenu}
        <ContextMenu 
            position={contextMenuPosition}
            onAction={handleContextMenuAction}
            onClose={() => showContextMenu = false}
        />
    {/if}

    <!-- Taskbar -->
    <Taskbar 
        {openWindows}
        {activeWindow}
        {openApp}
        {focusWindow}
    />
</div>
