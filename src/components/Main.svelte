<script>
    import Step from "./Step.svelte";
    

    let steps = [
        {
            name: "Cleveland Tennis Lessons",
            icon: "fa-solid fa-table-tennis-paddle-ball",
            description:
                "Web-app for a professional Tennis Coach targeted towards scheduling of tennis lessons.",
        },
        {
            name: "V3locity",
            icon: "fa-solid fa-gauge",
            description:
                "React-native Digital speedometer that tracks a user's speed using speed logic and position in real time using a compass",
        },
        {
            name: "Client Management Portal",
            icon: "fa-solid fa-chart-line",
            description:
                "CRUD application featuring a dynamic Dashboard and an interactive Kanban board to streamline client and project management.",
        },
    ];

    let benefits = [
        {
            metric: "10x",
            name: "A new grad",
            description:
                "I earned an Associate of Business and a Bachelor of Science in Computer Information Systems Programming from The University of Akron in 2024. I am currently pursuing advanced studies in technology.",
        },
        {
            name: "A strong programmer",
            description:
                "Possessing a solid foundation in programming languages such as JavaScript, Python, Java, and C++, as well as frameworks like React, I am passionate about transforming innovative concepts into engaging web applications.",
        },
        {
            name: "A Byteflow Pioneer",
            description:
                "Byteflow LLC, a collaborative venture initiated by a group of peers, provided a platform to apply and enhance our academic knowledge through practical experience.",
        },
    ];
</script>

<main class="flex flex-col flex-1 p-4">
    <section
        id="introPage"
        class="grid grid-cols-1 lg:grid-cols-2 gap-10 py-8 sm:py-14"
    >
        <div
            class="flex flex-col lg:justify-center text-center lg:text-left gap-6 md:gap-8 lg:gap-10"
        >
            <h2 class="font-semibold text-4xl sm:text-5xl md:text-6xl">
                Hi! I'm <span class="poppins text-red-400">Samuel</span> Ndubuisi
                <br />Full Stack
                <span class="poppins text-red-400">Developer</span>
            </h2>
            <p class="text-base sm:text-lg md:text-xl">
                My <span class="text-red-400"> favorite tech</span> includes JavaScript (Frontend: React, Svelte, Angular, NEXT.JS or SvelteKit, TailwindCSS) Node.js + Express.js & MongoDB
                or Firebase/Vercel! I also love Python and Java.
            </p>
            <a href="https://docs.google.com/document/d/1_AfELZwVgLlHB0wwCv0CHn36P4Npz1fD" target="_blank" rel="noopener noreferrer">
                <button
                  class="redShadow mx-auto lg:mr-auto lg:ml-0 text-base sm:text-lg md:text-xl poppins relative overflow-hidden px-6 py-3 group rounded-full bg-white text-slate-950"
                >
                  <div
                    class="absolute top-0 right-full w-full h-full bg-red-400 opacity-20 group-hover:translate-x-full z-0 duration-200"
                  ></div>
                  <h4 class="relative z-9">Resume &rarr;</h4>
                </button>
              </a>
              
        </div>
        <div class="relative shadow-2xl grid place-items-center">
            <img
                src={"images/sam-svelte-bg.png"}
                alt="pfp"
                class="object-cover z-[2] max-h-[70vh]"
            />
        </div>
    </section>
    <section class="py-20 lg:py-32 flex flex-col gap-24" id="projects">
        <div class="flex flex-col gap-2 text-center">
            <h6 class="text-large sm:text-xl md:text-2xl">
                A few of my projects.
            </h6>
            <h3 class="font-semibold text-3xl sm:text-4xl md:text-5xl">
                Curious to <span class="poppins text-red-400">see</span> some of my <span class="poppins text-red-400">work?</span>
            </h3>
        </div>
        <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            class="mx-auto px-4 py-2 rounded-md border border-solid border-white flex items-center gap-2 -mb-4 sm:-mb-0 -mt-10 hover:border-red-700 duration-200"
        >
            <i class="fa-regular fa-circle-play" />
            <p>Watch the video</p>
        </a>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-10">
            <Step step={steps[0]}>
                <p>
                    Cleveland Tennis Lessons is a Web app for booking Tennis Lessons, built with <strong
                        class="text-red-400"
                        >React, Next.js, Express.js, Emailjs and Calendly!</strong
                    >.
                </p>
                <div class="flex items-center justify-center sm:flex-row">
                    <button onclick="window.location.href='https://clevelandtennislessons.com'" class="bg-red-600 text-white font-bold py-2 
                        px-4 rounded-full hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 animate-bounce">
                        Visit
                    </button>
                </div>
            </Step>
            <Step step={steps[1]}>
                <p>
                    V3locity uses speed algorithms like Kalman Filter and tech stack of <strong
                        class="text-red-400">Next.js</strong
                    >,
                    <strong class="text-red-400">React-native</strong
                    >
                    & <strong class="text-red-400">Vercel</strong> for hosting. V3locity is a digital speedometer that tracks a user's speed using speed logic and position in real time using a compass.
                </p>
                <div class="flex items-center justify-center sm:flex-row">
                    <button onclick="window.location.href='https://github.com/Sammieblz/V3l0city'" class="bg-green-600 text-white font-bold py-2 
                        px-4 rounded-full hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 animate-bounce">
                        Repo
                    </button>
                </div>
            </Step>
            <Step step={steps[2]}>
                <p>
                    Client portal is a <strong class="text-red-400"
                        >Refine Framework, Next.js + Express.js, GraphQL</strong
                    >
                    CRUD application
                    <strong class="text-red-400">Ant Design</strong> for UI.
                    <strong class="text-red-400">Custom Auth provider</strong> for login.
                </p>
                <div class="flex items-center justify-center sm:flex-row">
                    <button onclick="window.location.href='https://github.com/Sammieblz/byteflow-client-management-portal'" class="bg-violet-600 text-white font-bold py-2 
                        px-4 rounded-full hover:bg-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 animate-bounce">
                        Repo
                    </button>
                </div>
            </Step>
        </div>
    </section>
    <section
        id="about"
        class="py-20 pt-10 lg:pt-16 lg:py-32 flex flex-col gap-16 sm:gap-20 md:gap-24 relative"
    >
        <div
            class="flex flex-col gap-2 text-center relative before:absolute before:top-0 before:left-0 before:w-2/3 before:h-1.5 before:bg-red-700 after:absolute after:bottom-0 after:right-0 after:w-2/3 after:h-1.5 after:bg-red-700 py-4"
        >
            <h6 class="text-large sm:text-xl md:text-2xl">
                Want to know more?
            </h6>
            <h3 class="font-semibold text-3xl sm:text-4xl md:text-5xl">
                A bit <span class="poppins text-red-400">about</span> me.
            </h3>
        </div>
        <p class="mx-auto poppins font-semibold text-lg sm:text-xl md:text-2xl">
            I am . . .
        </p>
        <div class="flex flex-col gap-20 w-full mx-auto max-w-[800px]">
            {#each benefits as benefit, index}
                <div class="flex gap-6 sm:gap-8">
                    <p
                        class="poppins text-4xl sm:text-5xl md:text-6xl text-slate-500 font-semibold"
                    >
                        0{index + 1}
                    </p>
                    <div class="flex flex-col gap-6 sm:gap-8">
                        <h3 class="text-2xl sm:text-3xl md:text-5xl">
                            {benefit.name}
                        </h3>
                        <p>{benefit.description}</p>
                    </div>
                </div>
            {/each}
        </div>
        <h5 class={" text-2xl sm:text-3xl font-semibold text-center poppins "}>
            The <span class="text-red-400">Complete</span> Package
        </h5>
        <div
            class="flex flex-col overflow-x-scroll gap-10 max-w-[800px] mx-auto w-full"
        >
            <table class="bg-white text-slate-700 rounded text-center">
                <thead class={"border-b border-solid border-slate-200  "}>
                    <tr class="">
                        <th />
                        <th class="whitespace-nowrap p-2 px-4">Candidate #1</th>
                        <th class="whitespace-nowrap p-2 px-4">Candidate #2</th>
                        <th class="whitespace-nowrap p-2 px-4">Candidate #3</th>
                        <th
                            class="bg-red-700 text-white whitespace-nowrap p-4 px-8"
                            >Me</th
                        >
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b border-solid border-slate-200">
                        <td
                            class="border-r border-solid border-white pl-4 pr-8 py-4 font-semibold text-sm"
                            >Dedication</td
                        >
                        <td><i class="fa-solid fa-xmark text-slate-500" /></td>
                        <td><i class="fa-solid fa-check text-slate-500" /></td>
                        <td><i class="fa-solid fa-xmark text-slate-500" /></td>
                        <td><i class="fa-solid fa-check text-green-500" /></td>
                    </tr>
                    <tr class="border-b border-solid border-slate-200">
                        <td
                            class="border-r border-solid border-white pl-4 pr-8 py-4 font-semibold text-sm"
                            >Critical Thought</td
                        >
                        <td><i class="fa-solid fa-xmark text-slate-500" /></td>
                        <td><i class="fa-solid fa-check text-slate-500" /></td>
                        <td><i class="fa-solid fa-check text-slate-500" /></td>
                        <td><i class="fa-solid fa-check text-green-500" /></td>
                    </tr>
                    <tr>
                        <td
                            class="border-r border-solid border-white pl-4 pr-8 py-4 font-semibold text-sm"
                            >Interpersonal Skills</td
                        >
                        <td><i class="fa-solid fa-check text-slate-500" /></td>
                        <td><i class="fa-solid fa-check text-slate-500" /></td>
                        <td><i class="fa-solid fa-xmark text-slate-500" /></td>
                        <td><i class="fa-solid fa-check text-green-500" /></td>
                    </tr>
                    <tr class="border-t border-solid border-slate-200">
                        <td
                            class="border-r border-solid border-white pl-4 pr-8 py-4 font-semibold text-sm"
                            >Progamming Ability</td
                        >
                        <td><i class="fa-solid fa-check text-slate-500" /></td>
                        <td><i class="fa-solid fa-xmark text-slate-500" /></td>
                        <td><i class="fa-solid fa-check text-slate-500" /></td>
                        <td><i class="fa-solid fa-check text-green-500" /></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mx-auto -mt-12 italic sm:hidden opacity-50">
            <p>Scroll to see more &rarr;</p>
        </div>
        <p class="mx-auto mb-2">So why not invest?</p>
    </section>
    <section id="contact" class="flex flex-col md:flex-row justify-center items-center min-h-[90vh] mt-0 bg-transparent mb-2 mx-auto px-4">
        <h2 class="font-semibold mr-0 md:mr-16 text-4xl sm:text-5xl md:text-6xl text-center md:text-left">
          Get <span class="poppins text-red-400">In</span> Touch
          <br />
          <span class="poppins text-red-400">with me!</span>
        </h2>
        <div class="container max-w-lg bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-lg shadow-2xl transition duration-500 ease-in-out transform hover:scale-105 mt-6 md:mt-0">
          <h3 class="font-semibold text-3xl text-center mb-6 text-red-600 sm:text-4xl md:text-5xl">Contact Me</h3>
          <form id="contactForm" action="https://formspree.io/f/mqkvbjro" method="POST" class="space-y-6">
            <input type="text" name="name" placeholder="Name" class="w-full px-4 py-2 text-black border-2 border-red-500 bg-red-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300">
            <input type="email" name="email" placeholder="Email" class="w-full px-4 py-2 text-black border-2 border-red-500 bg-red-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300">
            <textarea name="message" placeholder="Message" class="w-full px-4 py-2 text-black border-2 border-red-500 bg-red-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300"></textarea>
            <button type="submit" class="w-full bg-red-500 text-white py-2 rounded-lg shadow-lg hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300">Send Message</button>
            <p id="my-form-status" class="text-center text-red-500"></p>
          </form>
        </div>
      </section>
      
      
</main>
