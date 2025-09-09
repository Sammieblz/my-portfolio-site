<script>
    export let openApp;

    const desktopIcons = [
        {
            name: 'Terminal',
            icon: 'fas fa-terminal',
            color: 'kali-green',
            action: () => openApp('terminal', { title: 'Terminal', width: 700, height: 400 })
        },
        {
            name: 'File Manager',
            icon: 'fas fa-folder',
            color: 'kali-blue',
            action: () => openApp('file-manager', { title: 'File Manager', width: 800, height: 600 })
        },
        {
            name: 'GitHub Projects',
            icon: 'fab fa-github',
            color: 'kali-yellow',
            action: () => openApp('projects', { title: 'GitHub Projects', width: 900, height: 700 })
        },
        {
            name: 'Resume.pdf',
            icon: 'fas fa-file-pdf',
            color: 'kali-red',
            action: () => openApp('resume', { title: 'Resume.pdf', width: 800, height: 600 })
        },
        {
            name: 'About Samuel',
            icon: 'fas fa-user',
            color: 'kali-red',
            action: () => openApp('about', { title: 'About Samuel', width: 700, height: 500 })
        },
        {
            name: 'Contact',
            icon: 'fas fa-envelope',
            color: 'kali-blue',
            action: () => openApp('contact', { title: 'Contact Me', width: 600, height: 500 })
        }
    ];

    let selectedIcon = null;

    function handleIconClick(icon) {
        selectedIcon = icon.name;
        icon.action();
        setTimeout(() => selectedIcon = null, 200);
    }

    function handleIconDoubleClick(icon) {
        icon.action();
    }
</script>

<div class="absolute top-2 sm:top-4 left-2 sm:left-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-4 w-32 sm:w-48">
    {#each desktopIcons as icon (icon.name)}
        <div
            class="desktop-icon p-2 sm:p-3 text-center cursor-pointer select-none"
            class:bg-blue-500={selectedIcon === icon.name}
            class:bg-opacity-20={selectedIcon === icon.name}
            role="button"
            tabindex="0"
            on:click={() => handleIconClick(icon)}
            on:dblclick={() => handleIconDoubleClick(icon)}
            on:keydown={(e) => e.key === 'Enter' && handleIconClick(icon)}
        >
            <div class="text-2xl sm:text-4xl mb-1 sm:mb-2 {icon.color}">
                <i class={icon.icon}></i>
            </div>
            <div class="text-xs text-white font-medium leading-tight">
                {icon.name}
            </div>
        </div>
    {/each}
</div>
