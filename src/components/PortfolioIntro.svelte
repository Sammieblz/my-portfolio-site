<script>
	import { profile } from '$lib/profile';
</script>

<main class="min-h-screen bg-gray-950 px-6 py-16 text-white">
	<div class="mx-auto max-w-4xl">
		<p class="mono mb-3 text-sm text-green-400">samuel@portfolio:~$ whoami</p>
		<h1 class="text-4xl font-bold sm:text-6xl">{profile.name}</h1>
		<p class="mt-4 max-w-2xl text-xl text-gray-300">
			{profile.role} building thoughtful web and mobile products from {profile.location}.
		</p>
		<p class="mt-6 text-sm text-gray-400">
			Enable JavaScript for the interactive desktop or mobile experience, or use the links below.
		</p>

		<section class="mt-12" aria-labelledby="featured-projects">
			<h2 id="featured-projects" class="text-2xl font-semibold">Featured projects</h2>
			<ul class="mt-5 grid gap-4 sm:grid-cols-2">
				{#each profile.featuredProjects as project}
					<li class="rounded-lg border border-gray-700 bg-gray-900 p-5">
						<a href={project.href} class="text-lg font-semibold text-blue-300 hover:text-blue-200">
							{project.title}
						</a>
						<p class="mt-2 text-sm text-gray-300">{project.description}</p>
					</li>
				{/each}
			</ul>
		</section>

		<nav class="mt-10 flex flex-wrap gap-4" aria-label="Professional links">
			<a class="text-blue-300 hover:text-blue-200" href={profile.links.github}>GitHub</a>
			<a class="text-blue-300 hover:text-blue-200" href={profile.links.linkedin}>LinkedIn</a>
			<a class="text-blue-300 hover:text-blue-200" href={profile.assets.resumePdf}>Résumé</a>
			<a class="text-blue-300 hover:text-blue-200" href={`mailto:${profile.email}`}>Email</a>
		</nav>
	</div>
</main>
