<script>
    export let y;
    export let tabs = [
      { name: "Projects", link: "#projects" },
      { name: "About me", link: "#about" },
      { name: "Blog", link: "https://samuelndubuisi.vercel.app/blog.html" },
    ];
  
    let menuOpen = false; // State for the menu
  
    function toggleMenu() {
      menuOpen = !menuOpen; // Toggle the menu open/close
    }
  </script>
  
  <header
    class={
      "sticky z-[10] top-0 duration-200 px-6 flex items-center justify-between border-b border-solid " +
      (y > 0 ? " py-4 bg-red-950 border-red-950" : " py-6 bg-transparent border-transparent")
    }
  >
    <h1 class="font-medium">
      <b class="font-bold poppins">Samuel</b> <span class="">Ndubuisi</span>
    </h1>
    
    <!-- Hamburger menu button for mobile -->
    <div class="sm:hidden block z-[20] relative"> <!-- Ensure this button is above the sticky menu -->
      <button on:click={toggleMenu} class="focus:outline-none">
        {#if menuOpen} 
          <!-- X button when menu is open -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        {:else}
          <!-- Hamburger icon when menu is closed -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        {/if}
      </button>
    </div>
    
    <!-- Desktop Menu -->
    <div class="hidden sm:flex items-center gap-4">
      {#each tabs as tab, index}
        <a
          href={tab.link}
          class="duration-200 hover:text-red-400"
          target={index === 2 ? "_blank" : ""}
        >
          <p>{tab.name}</p>
        </a>
      {/each}
      <a href="#contact">
        <button
          class="redShadow relative overflow-hidden px-5 py-2 group rounded-full bg-white text-slate-950"
        >
          <div
            class="absolute top-0 right-full w-full h-full bg-red-400 opacity-20 group-hover:translate-x-full z-0 duration-200"
          ></div>
          <h4 class="relative z-9">Get in touch</h4>
        </button>
      </a>
    </div>
  
    <!-- Mobile Menu -->
    <div
      class={
        "sm:hidden fixed inset-0 bg-red-950 bg-opacity-90 flex flex-col justify-center items-center transition-transform duration-300 ease-in-out z-[15]" +
        (menuOpen ? " translate-x-0" : " -translate-x-full")
      }
    >
      {#each tabs as tab, index}
        <a
          href={tab.link}
          class="text-white text-2xl mb-4 duration-200 hover:text-red-400"
          on:click={toggleMenu}
          target={index === 2 ? "_blank" : ""}
        >
          {tab.name}
        </a>
      {/each}
      <a href="#contact" on:click={toggleMenu}>
        <button
          class="redShadow relative overflow-hidden px-5 py-2 group rounded-full bg-white text-slate-950"
        >
          <div
            class="absolute top-0 right-full w-full h-full bg-red-400 opacity-20 group-hover:translate-x-full z-0 duration-200"
          ></div>
          <h4 class="relative z-9">Get in touch</h4>
        </button>
      </a>
    </div>
  </header>
  