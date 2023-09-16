export type SavingData = {
	instance_family: string;
	instance_type: string;
	product_description: string;
	tenancy: string;
	region: string;
	offering_id: string;
	payment_option: string;
	plan_type: string;
	duration_seconds: number;
	currency: string;
	plan_description: string;
	rate: number;
	unit: string;
	product_type: string;
	service_code: string;
	usage_type: string;
	operation: string;
};

export type ParsedSavingData = {
	productTypes: string[];
	instanceFamilies: string[];
	regions: string[];
	savingsPlans: string[];
	services: string[];
	usages: string[];
};

export type Calculation = {
	rate: number;
	unit: string;
	currency: string;
	total: number;
	hours: number | null;
	quantity: number | null;
};

export type UserInput = {
	productType: string;
	instanceFamily: string;
	region: string;
	savingsPlan: string;
	service: string;
	usage: string;
	hours: number | null;
	quantity: number | null;
};
