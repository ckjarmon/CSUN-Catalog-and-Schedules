export interface Professor {
	email: string;
	first_name: string;
	last_name: string;
	image_link: string;
	phone_number: string;
	location: string;
	website: string;
	mail_drop: string;
	subject: string;
	office: string;
}

export interface Schedule {
	class_number: number;
	enrollment_cap: number;
	enrollment_count: number;
	instructor: string;
	days: string;
	location: string;
	start_time: string;
	end_time: string;
	catalog_number: string;
	subject: string;
}