<script lang="ts">
	export let productTypes: string[] = [];
	export let selectedType: string = productTypes[0];

	function selectType(productType: string) {
		selectedType = productType;
	}
</script>

<div class="space-y-2">
	<p>Select your product type</p>

	<div class="flex items-center gap-2">
		{#each productTypes as productType}
			<button
				class="shadow-xl aspect-square flex flex-col justify-center items-center gap-2 p-6 rounded-2xl h-32 transition duration-300"
				class:bg-primary={selectedType === productType}
				class:bg-white={selectedType !== productType}
				on:click={() => selectType(productType)}
			>
				{productType}
			</button>
		{/each}
	</div>
</div>
