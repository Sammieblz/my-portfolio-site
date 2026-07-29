<script>
	import { onMount } from 'svelte';
	import Desktop from './Desktop.svelte';
	import MobileShell from './MobileShell.svelte';
	import PortfolioIntro from './PortfolioIntro.svelte';
	import { getApplication } from '$lib/appRegistry';
	import { profile } from '$lib/profile';

	export let initialApp = 'home';
	export let canonicalPath = '/';

	let shell = 'pending';
	const application = getApplication(initialApp);
	const pageTitle =
		initialApp === 'home'
			? `${profile.name} | ${profile.role}`
			: `${application?.mobileName ?? application?.name ?? profile.role} | ${profile.name}`;
	const canonicalUrl = new URL(canonicalPath, profile.links.portfolio).toString();
	const descriptions = {
		home: `Explore ${profile.name}'s full-stack development work through an accessible, interactive OS-inspired portfolio.`,
		about: `Learn about ${profile.name}'s experience, education, skills, and award-winning work.`,
		projects: `Read case studies and explore full-stack, mobile, and AI projects built by ${profile.name}.`,
		resume: `View or download ${profile.name}'s current full-stack developer resume.`,
		contact: `Contact ${profile.name} about full-time and freelance software development opportunities.`
	};
	const description = descriptions[initialApp] ?? descriptions.home;
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: profile.name,
		jobTitle: profile.role,
		email: `mailto:${profile.email}`,
		url: profile.links.portfolio,
		image: `${profile.links.portfolio}${profile.assets.profileImage}`,
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Cleveland',
			addressRegion: 'OH',
			addressCountry: 'US'
		},
		alumniOf: {
			'@type': 'CollegeOrUniversity',
			name: 'The University of Akron'
		},
		award: profile.hackathons.flatMap((hackathon) => hackathon.awards),
		knowsAbout: Object.values(profile.skills).flat(),
		sameAs: [profile.links.github, profile.links.linkedin, profile.links.instagram]
	};

	onMount(() => {
		const mediaQuery = globalThis.matchMedia('(max-width: 767px)');
		const updateShell = () => {
			shell = mediaQuery.matches ? 'mobile' : 'desktop';
		};

		updateShell();
		mediaQuery.addEventListener('change', updateShell);
		return () => mediaQuery.removeEventListener('change', updateShell);
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={description} />
	<meta name="author" content={profile.name} />
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Samuel Ndubuisi | Developer Portfolio" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={`${profile.links.portfolio}${profile.assets.socialCard}`} />
	<meta property="og:image:alt" content={`${profile.name}, ${profile.role}`} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={`${profile.links.portfolio}${profile.assets.socialCard}`} />
	<meta name="twitter:image:alt" content={`${profile.name}, ${profile.role}`} />
	<meta name="theme-color" content="#0d1117" />
	<!-- This JSON-LD is built only from trusted local data, with tag delimiters escaped. -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</scr${'ipt'}>`}
</svelte:head>

{#if shell === 'mobile'}
	<MobileShell {initialApp} />
{:else if shell === 'desktop'}
	<Desktop {initialApp} />
{:else}
	<PortfolioIntro />
{/if}
