<script lang="ts">
	import Autocomplete from '$lib/components/Autocomplete.svelte';
	import ProductTypes from '$lib/components/ProductTypes.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const savingsData = data.savingsData;

	console.log(savingsData);

	// Product types
	const productTypes: string[] = Array.from(
		new Set(savingsData.map((savings) => savings.product_type))
	);
	let productType: string = productTypes[0];

	const instanceFamilies = savingsData.map((savings) => savings.instance_family);
	const regions = Array.from(new Set(savingsData.map((savings) => savings.region))).sort();
</script>

<div class="space-y-10 p-10">
	<ProductTypes {productTypes} />

	<Autocomplete options={regions} />
</div>
