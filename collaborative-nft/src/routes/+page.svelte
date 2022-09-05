<script>
	import SVG from '$lib/SVG.svelte';
</script>

<div class="flex pt-16 p-8 flex-col lg:flex-row justify-center font-inter">
	<div class="lg:w-3/4">
		<SVG />
	</div>
	<div class="lg:w-1/4 lg:mx-4">
		<div class="text-center pt-4 lg:pt-0 text-3xl 2xl:text-5xl font-bold text-accent font-inter">
			The World's Most Collaborative NFT
		</div>
		<div class="hidden md:flex justify-center pt-6 2xl:pt-24">
			<img src="/qr.png" alt="qr code" />
		</div>
		<div class="flex justify-center pt-8 xl:pt-12 2xl:pt-24 font-sans text-2xl">
			<span class="bg-secondary hidden md:block text-accent p-6 font-inter"
				>Scan To Participate</span
			>
			<span class="bg-secondary block md:hidden text-accent p-6 font-inter">
				<a href="/claim"><button> Click To Participate</button></a>
			</span>
		</div>
	</div>
</div>
