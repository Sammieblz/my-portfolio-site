<script>
	import { profile } from '$lib/profile';
	import ProfileImage from './ProfileImage.svelte';

	let currentTab = 'overview';

	const tabs = [
		{ id: 'overview', label: 'Overview', icon: 'fas fa-user' },
		{ id: 'education', label: 'Education', icon: 'fas fa-graduation-cap' },
		{ id: 'experience', label: 'Experience', icon: 'fas fa-briefcase' },
		{ id: 'hackathons', label: 'Hackathons', icon: 'fas fa-trophy' },
		{ id: 'skills', label: 'Skills', icon: 'fas fa-code' }
	];

	const projectAccent = [
		'border-blue-500',
		'border-green-500',
		'border-yellow-500',
		'border-purple-500',
		'border-orange-500'
	];

	function handleTabKeydown(event, index) {
		const nextIndex = {
			ArrowRight: (index + 1) % tabs.length,
			ArrowLeft: (index - 1 + tabs.length) % tabs.length,
			Home: 0,
			End: tabs.length - 1
		}[event.key];
		if (nextIndex === undefined) return;

		event.preventDefault();
		currentTab = tabs[nextIndex].id;
		document.getElementById(`about-tab-${tabs[nextIndex].id}`)?.focus();
	}
</script>

<section class="file-manager flex h-full w-full flex-col overflow-hidden" aria-label="About Samuel">
	<div class="border-b border-gray-600 px-4 py-2">
		<div class="flex gap-1 overflow-x-auto" role="tablist" aria-label="About sections">
			{#each tabs as tab, index}
				<button
					type="button"
					id={`about-tab-${tab.id}`}
					role="tab"
					aria-selected={currentTab === tab.id}
					aria-controls={`about-panel-${tab.id}`}
					tabindex={currentTab === tab.id ? 0 : -1}
					class="flex items-center gap-2 rounded px-3 py-1 text-xs"
					class:bg-gray-700={currentTab === tab.id}
					class:hover:bg-gray-600={currentTab !== tab.id}
					on:click={() => (currentTab = tab.id)}
					on:keydown={(event) => handleTabKeydown(event, index)}
				>
					<i class={tab.icon} aria-hidden="true"></i>
					{tab.label}
				</button>
			{/each}
		</div>
	</div>

	<div
		class="flex-1 overflow-y-auto p-4"
		id={`about-panel-${currentTab}`}
		role="tabpanel"
		aria-labelledby={`about-tab-${currentTab}`}
		tabindex="0"
	>
		{#if currentTab === 'overview'}
			<div class="space-y-6">
				<div class="text-center">
					<div class="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-gray-600">
						<ProfileImage
							alt={`Portrait of ${profile.name}`}
							loading="lazy"
							className="h-full w-full object-cover"
							pictureClass="block h-full w-full"
						/>
					</div>
					<h2 class="mb-2 text-2xl font-bold text-white">{profile.name}</h2>
					<p class="mb-2 text-lg text-gray-300">{profile.role}</p>
					<p class="mb-4 text-sm text-green-300">{profile.contact.availability}</p>
					<div class="mb-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-300">
						<span>
							<i class="fas fa-map-marker-alt mr-1" aria-hidden="true"></i>
							{profile.location}
						</span>
						<a class="hover:text-blue-300" href={`mailto:${profile.email}`}>
							<i class="fas fa-envelope mr-1" aria-hidden="true"></i>
							{profile.email}
						</a>
					</div>

					<nav class="flex justify-center gap-3" aria-label="Social profiles">
						<a
							href={profile.links.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700"
							aria-label="LinkedIn, opens in a new tab"
						>
							<i class="fab fa-linkedin-in text-white" aria-hidden="true"></i>
						</a>
						<a
							href={profile.links.github}
							target="_blank"
							rel="noopener noreferrer"
							class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600"
							aria-label="GitHub, opens in a new tab"
						>
							<i class="fab fa-github text-white" aria-hidden="true"></i>
						</a>
						<a
							href={profile.links.instagram}
							target="_blank"
							rel="noopener noreferrer"
							class="flex h-10 w-10 items-center justify-center rounded-full bg-pink-700 hover:bg-pink-600"
							aria-label="Instagram, opens in a new tab"
						>
							<i class="fab fa-instagram text-white" aria-hidden="true"></i>
						</a>
					</nav>
				</div>

				<div class="rounded-lg bg-gray-800 p-4">
					<h3 class="mb-3 text-lg font-semibold text-white">About me</h3>
					<p class="leading-relaxed text-gray-300">{profile.summary}</p>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div class="rounded-lg bg-gray-800 p-4">
						<h3 class="mb-3 text-lg font-semibold text-white">What I do</h3>
						<ul class="space-y-2 text-gray-300">
							{#each profile.services as service}
								<li class="flex items-center gap-2">
									<i class={`${service.icon} ${service.color}`} aria-hidden="true"></i>
									{service.name}
								</li>
							{/each}
						</ul>
					</div>

					<div class="rounded-lg bg-gray-800 p-4">
						<h3 class="mb-3 text-lg font-semibold text-white">Key strengths</h3>
						<ul class="space-y-2 text-gray-300">
							{#each profile.strengths as strength}
								<li class="flex items-center gap-2">
									<i class={`${strength.icon} ${strength.color}`} aria-hidden="true"></i>
									{strength.name}
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		{:else if currentTab === 'education'}
			<div class="space-y-6">
				{#each profile.education as education}
					<article class="rounded-lg bg-gray-800 p-6">
						<div class="flex items-start gap-4">
							<div
								class={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${education.color}`}
							>
								<i class={`${education.icon} text-white`} aria-hidden="true"></i>
							</div>
							<div class="flex-1">
								<h2 class="text-xl font-semibold text-white">{education.credential}</h2>
								<p class="mb-2 text-gray-300">{education.institution}</p>
								<p class="text-sm text-gray-400">{education.year} · {education.location}</p>
								{#if education.details.length}
									<div class="mt-4">
										<h3 class="mb-2 text-sm font-semibold text-gray-300">Relevant coursework</h3>
										<ul class="flex flex-wrap gap-2">
											{#each education.details as detail}
												<li class="rounded bg-gray-700 px-2 py-1 text-xs">{detail}</li>
											{/each}
										</ul>
									</div>
								{/if}
							</div>
						</div>
					</article>
				{/each}
			</div>
		{:else if currentTab === 'experience'}
			<div class="space-y-6">
				{#each profile.experience as experience}
					<article class="rounded-lg bg-gray-800 p-6">
						<div class="flex items-start gap-4">
							<div
								class={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${experience.color}`}
							>
								<i class={`${experience.icon} text-white`} aria-hidden="true"></i>
							</div>
							<div class="flex-1">
								<h2 class="text-xl font-semibold text-white">{experience.role}</h2>
								<p class="mb-1 text-gray-300">{experience.organization}</p>
								<p class="mb-3 text-sm text-gray-400">{experience.period}</p>
								<ul class="space-y-2 text-sm text-gray-300">
									{#each experience.highlights as highlight}
										<li class="flex items-start gap-2">
											<i class="fas fa-arrow-right mt-1 text-xs text-green-400" aria-hidden="true"
											></i>
											<span>{highlight}</span>
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</article>
				{/each}

				<section class="rounded-lg bg-gray-800 p-6" aria-labelledby="featured-projects-about">
					<h2 id="featured-projects-about" class="mb-4 text-lg font-semibold text-white">
						Featured projects
					</h2>
					<div class="space-y-4">
						{#each profile.featuredProjects as project, index}
							<article class={`border-l-4 pl-4 ${projectAccent[index % projectAccent.length]}`}>
								<a
									href={project.href}
									target="_blank"
									rel="noopener noreferrer"
									class="font-semibold text-white hover:text-blue-300"
								>
									{project.title}
									<span class="sr-only">(opens in a new tab)</span>
								</a>
								<p class="mt-1 text-sm text-gray-300">{project.description}</p>
								<p class="mt-1 text-xs text-gray-400">{project.tech}</p>
							</article>
						{/each}
					</div>
				</section>
			</div>
		{:else if currentTab === 'hackathons'}
			<div class="space-y-6">
				{#each profile.hackathons as hackathon}
					<article class="space-y-4 rounded-lg bg-gray-800 p-6">
						<p>
							<span class="rounded bg-yellow-900/50 px-2 py-1 text-xs font-medium text-yellow-200">
								{hackathon.event}
							</span>
						</p>
						<div>
							<h2>
								<a
									href={hackathon.projectUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="text-xl font-semibold text-white hover:text-blue-300"
								>
									{hackathon.project}
									<span class="sr-only">(opens in a new tab)</span>
								</a>
							</h2>
							<p class="mt-1 text-sm text-gray-400">
								<a
									href={hackathon.eventUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="hover:text-gray-200"
								>
									Event site
								</a>
								·
								<a
									href={hackathon.projectUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="hover:text-gray-200"
								>
									Devpost
								</a>
							</p>
						</div>
						<section>
							<h3 class="mb-2 text-sm font-semibold text-gray-300">Awards</h3>
							<ul class="space-y-1 text-sm text-gray-300">
								{#each hackathon.awards as award}
									<li class="flex items-start gap-2">
										<i class="fas fa-award mt-0.5 text-yellow-500" aria-hidden="true"></i>
										{award}
									</li>
								{/each}
							</ul>
						</section>
						<section>
							<h3 class="mb-1 text-sm font-semibold text-gray-300">My role</h3>
							<p class="text-sm leading-relaxed text-gray-300">{hackathon.role}</p>
						</section>
						<section>
							<h3 class="mb-2 text-sm font-semibold text-gray-300">About</h3>
							{#each hackathon.about as paragraph}
								<p class="mb-2 text-sm leading-relaxed text-gray-300 last:mb-0">{paragraph}</p>
							{/each}
						</section>
						<section>
							<h3 class="mb-2 text-sm font-semibold text-gray-300">What we learned</h3>
							<ul class="list-inside list-disc space-y-2 text-sm text-gray-300">
								{#each hackathon.learned as item}
									<li>{item}</li>
								{/each}
							</ul>
						</section>
						<p class="border-t border-gray-700 pt-2 text-xs text-gray-400">
							Built with: {hackathon.stack}
						</p>
					</article>
				{/each}
			</div>
		{:else if currentTab === 'skills'}
			<div class="space-y-6">
				{#each Object.entries(profile.skills) as [category, skills]}
					<section class="rounded-lg bg-gray-800 p-4">
						<h2 class="mb-4 text-lg font-semibold text-white">{category}</h2>
						<ul class="flex flex-wrap gap-2">
							{#each skills as skill}
								<li
									class="rounded-full border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-100"
								>
									{skill}
								</li>
							{/each}
						</ul>
					</section>
				{/each}
			</div>
		{/if}
	</div>
</section>
