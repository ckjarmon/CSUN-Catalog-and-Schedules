export const convert_time = (time: string): { start_time: string; end_time: string } => {
	if (time === "TBA" || !time.includes("-")) {
		return { start_time: "0000h", end_time: "0000h" };
	}

	const start_regex: RegExp = /^\d{2}:\d{2}(?:am|pm|AM|PM)(?=[- ])/;
	const end_regex: RegExp = /(?<=[- ])\d{2}:\d{2}(?:am|pm|AM|PM)$/;

	let start: string = time.match(start_regex)![0];
	let end: string = time.match(end_regex)![0];

	let startHour: number = parseInt(start.slice(0, 2));
	let endHour: number = parseInt(end.slice(0, 2));
	let startIsPM: boolean = !!start.slice(5, 7).match(/p|P/) && startHour < 12;
	let endIsPM: boolean = !!end.slice(5, 7).match(/p|P/) && endHour < 12;

	if (startIsPM) {
		startHour += 12;
	}
	if (endIsPM) {
		endHour += 12;
	}

	let startString: string = startHour < 10 ? "0" + startHour : String(startHour);
	let endString: string = endHour < 10 ? "0" + endHour : String(endHour);

	return {
		start_time: startString + start.slice(3, 5) + "h",
		end_time: endString + end.slice(3, 5) + "h"
	};
};

export const convert_days = (daysStr: string): string => {
	if (daysStr === "TBA") {
		return daysStr;
	}
	const dayMap: { [key: string]: string } = {
		Mo: "M",
		Tu: "T",
		We: "W",
		Th: "R",
		Fr: "F",
		Sa: "S"
	};

	for (let day in dayMap) {
		daysStr = daysStr.replace(day, dayMap[day]);
	}

	return daysStr;
};

export const is_numeric = (str: string): boolean => /^[0-9]+$/.test(str);

export const get_letters_only = (str: string) => str.replace(/[^A-Z]/g, "");

/*
// Test convert_time function
console.log(convert_time("02:00PM - 03:35PM"));
// Expected output: { start_time: '1530h', end_time: '1645h' }

console.log(convert_time('09:30am - 11:45am'));
// Expected output: { start_time: '0930h', end_time: '1145h' }

console.log(convert_time('TBA'));
// Expected output: { start_time: '0000h', end_time: '0000h' }

console.log(convert_time('02:00am - 03:15pm'));
// Expected output: { start_time: '0200h', end_time: '1515h' }

// Test convertDays function
console.log(convertDays('MoTuWeThFr'));
// Expected output: 'MTWRF'

console.log(convertDays('TBA'));
// Expected output: 'TBA'

console.log(convertDays('MoWeFr'));
// Expected output: 'MWF'

// Test isNumeric function
console.log(isNumeric('12345'));
// Expected output: true

console.log(isNumeric('abc123'));
// Expected output: false

console.log(isNumeric('0'));
// Expected output: true

console.log(isNumeric('1.23'));
// Expected output: false

console.log(getLettersOnly('Abc123Def'));
// Expected output: 'AD'

console.log(getLettersOnly('Hello World'));
// Expected output: 'HW'
*/
