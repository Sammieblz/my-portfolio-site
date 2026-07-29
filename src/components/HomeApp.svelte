<script>
	import { profile } from '$lib/profile';
	import ProfileImage from './ProfileImage.svelte';

	export let onOpenApp = () => {};

	const quickActions = [
		{ id: 'projects', label: 'Explore projects', icon: 'fas fa-folder-open', primary: true },
		{ id: 'resume', label: 'View resume', icon: 'fas fa-file-pdf' },
		{ id: 'contact', label: 'Contact Samuel', icon: 'fas fa-envelope' }
	];
</script>

<section
	class="h-full overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 p-5 text-white sm:p-7"
	aria-labelledby="portfolio-home-title"
>
	<div class="mx-auto max-w-5xl">
		<div class="grid items-center gap-6 md:grid-cols-[1fr_auto]">
			<div>
				<p class="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-blue-300">
					{profile.contact.availability}
				</p>
				<h2 id="portfolio-home-title" class="text-3xl font-bold sm:text-4xl">
					{profile.name}
				</h2>
				<p class="mt-2 text-xl text-gray-200">{profile.role}</p>
				<p class="mt-1 text-sm text-gray-400">
					<i class="fas fa-location-dot mr-1" aria-hidden="true"></i>
					{profile.location}
				</p>
				<p class="mt-5 max-w-2xl leading-relaxed text-gray-300">{profile.summary}</p>

				<div class="mt-6 flex flex-wrap gap-3">
					{#each quickActions as action}
						<button
							type="button"
							class={`flex items-center gap-2 rounded-lg px-4 py-3 font-medium ${
								action.primary
									? 'bg-blue-600 text-white hover:bg-blue-500'
									: 'border border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700'
							}`}
							on:click={() => onOpenApp(action.id)}
						>
							<i class={action.icon} aria-hidden="true"></i>
							{action.label}
						</button>
					{/each}
				</div>
			</div>

			<ProfileImage
				alt={`Portrait of ${profile.name}`}
				loading="eager"
				fetchpriority="high"
				className="h-full w-full rounded-2xl border border-gray-600 object-cover shadow-2xl"
				pictureClass="mx-auto block h-44 w-36 md:h-56 md:w-44"
			/>
		</div>

		<section class="mt-8 border-t border-gray-700 pt-6" aria-labelledby="home-case-studies">
			<div class="mb-4 flex flex-wrap items-center justify-between gap-2">
				<div>
					<h3 id="home-case-studies" class="text-xl font-semibold">Selected work</h3>
					<p class="mt-1 text-sm text-gray-400">Product decisions, implementation, and outcomes.</p>
				</div>
				<button
					type="button"
					class="rounded px-3 py-2 text-sm text-blue-300 hover:bg-gray-800 hover:text-blue-200"
					on:click={() => onOpenApp('projects')}
				>
					View all case studies
				</button>
			</div>

			<div class="grid gap-3 md:grid-cols-3">
				{#each profile.caseStudies.slice(0, 3) as study}
					<button
						type="button"
						class="rounded-xl border border-gray-700 bg-gray-900/80 p-4 text-left hover:border-blue-500 hover:bg-gray-800"
						on:click={() => onOpenApp('projects', { data: { project: study.slug } })}
						aria-label={`View ${study.title} case study`}
					>
						<span class="font-semibold text-white">{study.title}</span>
						<span class="mt-2 block text-sm leading-relaxed text-gray-300">{study.summary}</span>
						<span class="mt-3 block text-xs text-blue-300"
							>{study.tech.slice(0, 3).join(' · ')}</span
						>
					</button>
				{/each}
			</div>
		</section>
	</div>
</section>
