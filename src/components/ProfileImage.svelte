<script>
	import { profile } from '$lib/profile';

	export let alt = '';
	export let className = '';
	export let pictureClass = '';
	export let loading = 'lazy';
	export let fetchpriority = 'auto';
</script>

<picture class={pictureClass}>
	<source srcset={profile.assets.profileImageWebp} type="image/webp" />
	<img
		src={profile.assets.profileImage}
		{alt}
		width="447"
		height="559"
		{loading}
		{fetchpriority}
		decoding="async"
		class={className}
	/>
</picture>
