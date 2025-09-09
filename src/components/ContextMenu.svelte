<script>
    import { onMount } from 'svelte';
    
    export let position;
    export let onAction;
    export let onClose;

    let contextMenuRef;

    const menuItems = [
        {
            id: 'terminal',
            label: 'Open Terminal',
            icon: 'fas fa-terminal',
            color: 'kali-green'
        },
        {
            id: 'file-manager',
            label: 'Open File Manager',
            icon: 'fas fa-folder',
            color: 'kali-blue'
        },
        {
            id: 'projects',
            label: 'View Projects',
            icon: 'fab fa-github',
            color: 'kali-yellow'
        },
        {
            id: 'about',
            label: 'About Samuel',
            icon: 'fas fa-user',
            color: 'kali-red'
        },
        {
            id: 'contact',
            label: 'Contact Me',
            icon: 'fas fa-envelope',
            color: 'kali-blue'
        }
    ];

    function handleItemClick(item) {
        onAction(item.id);
    }

    function handleClickOutside(event) {
        if (contextMenuRef && !contextMenuRef.contains(event.target)) {
            onClose();
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<div
    bind:this={contextMenuRef}
    class="context-menu fixed z-50 py-2 rounded-lg min-w-48"
    style="left: {position.x}px; top: {position.y}px;"
>
    {#each menuItems as item}
        <button
            class="context-menu-item w-full px-4 py-2 text-left flex items-center gap-3 text-sm text-gray-300 hover:text-white"
            on:click={() => handleItemClick(item)}
        >
            <i class="{item.icon} {item.color} w-4"></i>
            {item.label}
        </button>
    {/each}
    
    <div class="border-t border-gray-600 my-1"></div>
    
    <button
        class="context-menu-item w-full px-4 py-2 text-left flex items-center gap-3 text-sm text-gray-300 hover:text-white"
        on:click={onClose}
    >
        <i class="fas fa-times text-gray-400 w-4"></i>
        Close
    </button>
</div>
