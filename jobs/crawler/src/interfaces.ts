export interface DatabaseScheduleBody {
	class_number: string;
	catalog_number: string;
	enrollment_cap: number;
	enrollment_count: number;
	waitlist_cap: number;
	waitlist_count: number;
	instructor: string;
	days: string;
	location: string;
	start_time: string;
	end_time: string;
}

export interface Schedule {
	[class_number: string]: {
		class_number: string;
		enrollment_cap: number;
		enrollment_count: number;
		waitlist_cap: number;
		waitlist_count: number;
		instructor: string;
		days: string;
		location: string;
		start_time: string;
		end_time: string;
	};
}

export interface CatalogNumberSchedule {
	[catalog_number: string]: Schedule;
}

export interface SubjectSchedule {
	[catalog_number: string]: CatalogNumberSchedule;
}
