<script>
    import Footer from "../components/Footer.svelte";
    import Header from "../components/Header.svelte";
    import "../app.css";
    import AOS from "aos"; // Import AOS JavaScript
    import "aos/dist/aos.css"; // Import AOS CSS from the installed library
    
    let y;
    let innerWidth = 0;
    let innerHeight = 0;

    // Initialize AOS when the component mounts
    import { onMount } from "svelte";

    onMount(() => {
        AOS.init({
            duration: 800, // The duration of the animations
            once: true, // Whether the animations should happen only once or every time
            offset: 120, // The offset (distance in px) to start the animation
        });
    });

    function goTop() {
        document.body.scrollIntoView();
    }
</script>

<div
    class="container relative flex flex-col max-w-[1400px] mx-auto w-full text-sm sm:text-base min-h-screen"
>
    <div
        class={"fixed bottom-0 w-full duration-200 flex p-10 z-[10] " +
            (y > 0
                ? " opacity-full pointer-events-auto"
                : " pointer-events-none opacity-0")}
    >
        <button
            on:click={goTop}
            class="ml-auto rounded-full bg-gray-900 text-red-400 px-3 sm:px-4 hover:bg-red-800 cursor-pointer aspect-square grid place-items-center"
            data-aos="fade-up"
        >
            <i class="fa-solid fa-arrow-up" />
        </button>
    </div>
    <Header {y} {innerHeight} data-aos="fade-down" /> <!-- AOS animation for the header -->
    <slot data-aos="fade-in" /> <!-- AOS animation for the slot content -->
    <Footer data-aos="fade-up" /> <!-- AOS animation for the footer -->
</div>
<svelte:window bind:scrollY={y} bind:innerHeight bind:innerWidth />
