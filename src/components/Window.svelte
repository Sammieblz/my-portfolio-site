<script>
    import { onMount } from 'svelte';
    
    export let window;
    export let closeWindow;
    export let minimizeWindow;
    export let maximizeWindow;

    let windowElement;
    let isDragging = false;
    let isResizing = false;
    let dragStart = { x: 0, y: 0 };
    let resizeStart = { x: 0, y: 0, width: 0, height: 0 };
    let currentPosition = { x: window.x, y: window.y };
    let currentSize = { width: window.width, height: window.height };

    function handleMouseDown(event) {
        if (event.target.closest('.window-controls')) return;
        
        isDragging = true;
        dragStart = {
            x: event.clientX - currentPosition.x,
            y: event.clientY - currentPosition.y
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        event.preventDefault();
    }

    function handleMouseMove(event) {
        if (isDragging) {
            currentPosition = {
                x: event.clientX - dragStart.x,
                y: event.clientY - dragStart.y
            };
            
            // Keep window within bounds - responsive taskbar height
            const taskbarHeight = window.innerWidth < 768 ? 48 : 56;
            currentPosition.x = Math.max(0, Math.min(document.documentElement.clientWidth - currentSize.width, currentPosition.x));
            currentPosition.y = Math.max(0, Math.min(document.documentElement.clientHeight - currentSize.height - taskbarHeight, currentPosition.y));
        }
        
        if (isResizing) {
            const minWidth = window.innerWidth < 768 ? 250 : 300;
            const minHeight = window.innerWidth < 768 ? 200 : 200;
            const maxWidth = window.innerWidth < 768 ? window.innerWidth * 0.9 : window.innerWidth;
            const maxHeight = window.innerWidth < 768 ? window.innerHeight * 0.7 : window.innerHeight;
            
            const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStart.width + (event.clientX - resizeStart.x)));
            const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStart.height + (event.clientY - resizeStart.y)));
            
            currentSize = { width: newWidth, height: newHeight };
        }
    }

    function handleMouseUp() {
        isDragging = false;
        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    function handleResizeMouseDown(event) {
        isResizing = true;
        resizeStart = {
            x: event.clientX,
            y: event.clientY,
            width: currentSize.width,
            height: currentSize.height
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        event.preventDefault();
    }

    function handleMaximize() {
        if (window.maximized) {
            // Restore
            currentPosition = { x: window.x, y: window.y };
            currentSize = { width: window.width, height: window.height };
        } else {
            // Maximize - responsive taskbar height and mobile-friendly sizing
            const taskbarHeight = window.innerWidth < 768 ? 48 : 56;
            const isMobile = window.innerWidth < 768;
            
            if (isMobile) {
                // On mobile, maximize to 90% of screen for better UX
                currentPosition = { 
                    x: window.innerWidth * 0.05, 
                    y: 20 
                };
                currentSize = { 
                    width: window.innerWidth * 0.9, 
                    height: window.innerHeight - taskbarHeight - 40 
                };
            } else {
                // On desktop, full maximize
                currentPosition = { x: 0, y: 0 };
                currentSize = { 
                    width: document.documentElement.clientWidth, 
                    height: document.documentElement.clientHeight - taskbarHeight 
                };
            }
        }
        maximizeWindow(window.id);
    }

    onMount(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    });
</script>

    <div
        bind:this={windowElement}
        class="absolute app-window window-enter"
        class:window-exit={window.minimized}
        role="application"
        style="
            left: {window.maximized ? 0 : currentPosition.x}px;
            top: {window.maximized ? 0 : currentPosition.y}px;
            width: {window.maximized ? '100vw' : currentSize.width}px;
            height: {window.maximized ? 'calc(100vh - 48px)' : currentSize.height}px;
            z-index: {window.zIndex || 100};
        "
        on:mousedown={handleMouseDown}
    >
    <!-- Window Header -->
    <div class="window-header flex items-center justify-between px-2 sm:px-4 py-1 sm:py-2 cursor-move">
        <div class="flex items-center gap-1 sm:gap-2">
            <div class="flex gap-1">
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
            </div>
            <span class="text-xs sm:text-sm font-medium mono truncate">{window.title}</span>
        </div>
        <div class="flex gap-1 window-controls">
            <button
                class="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-gray-600 rounded"
                on:click={() => minimizeWindow(window.id)}
            >
                <i class="fas fa-minus text-xs"></i>
            </button>
            <button
                class="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-gray-600 rounded"
                on:click={handleMaximize}
            >
                <i class="fas {window.maximized ? 'fa-compress' : 'fa-expand'} text-xs"></i>
            </button>
            <button
                class="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center hover:bg-red-600 rounded"
                on:click={() => closeWindow(window.id)}
            >
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>
    </div>

    <!-- Window Content -->
    <div class="flex-1 overflow-hidden">
        <slot />
    </div>

    <!-- Resize Handle -->
    {#if !window.maximized}
        <div
            class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity"
            role="button"
            tabindex="0"
            on:mousedown={handleResizeMouseDown}
        >
            <div class="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400"></div>
        </div>
    {/if}
</div>

<style>
    .window-header {
        background: #21262d;
        border-bottom: 1px solid #30363d;
    }
    
    .app-window {
        background: #0d1117;
        border: 1px solid #30363d;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
</style>
