// This is a auto-generated ordered list of the subject that have the most classes
// for Sprign 2023.
// Can be used as a rough estimate of which semesters take the longest
// Ordered from most to least
const control_order: string[] = [
	"MUS",
	"ART",
	"KIN",
	"BIOL",
	"FCS",
	"CTVA",
	"HSCI",
	"ENGL",
	"MATH",
	"ECE",
	"GEOG",
	"SPED",
	"COMS",
	"EPC",
	"POLS",
	"TH",
	"CHEM",
	"PSY",
	"SOC",
	"HIST",
	"COMP",
	"CH S",
	"RTM",
	"CD",
	"M E",
	"CJS",
	"PHYS",
	"E ED",
	"AFRS",
	"JOUR",
	"MSE",
	"ANTH",
	"GEOL",
	"C E",
	"PT",
	"DEAF",
	"CADV",
	"S ED",
	"ACCT",
	"FIN",
	"AAS",
	"EOH",
	"PHIL",
	"LING",
	"ELPS",
	"R S",
	"UNIV",
	"URBS",
	"ATHL",
	"MKT",
	"ECON",
	"CIT",
	"SPAN",
	"SWRK",
	"CM",
	"MGT",
	"CAS",
	"BLAW",
	"QS",
	"GWS",
	"IS",
	"SOM",
	"BUS",
	"AT",
	"ASTR",
	"LR S",
	"FLIT",
	"MCOM",
	"AIS",
	"J S",
	"RE",
	"A M",
	"ENT",
	"NURS",
	"ARMN",
	"BANA",
	"GBUS",
	"INDS",
	"ITAL",
	"JAPN",
	"SUST",
	"A E",
	"CHIN",
	"CLAS",
	"FREN",
	"HUM",
	"KOR",
	"PERS",
	"RUSS",
	"SCM",
	"SUS",
	"A/R",
	"ARAB",
	"CCE",
	"CECS",
	"EDUC",
	"GEH",
	"HEBR",
	"HHD",
	"HUMN",
	"LIB",
	"PHSC",
	"SCI"
];

export function sortToControl(unsortedArray: string[]): string[] {
	const controlMap: { [key: string]: number } = {};

	// Count occurrences of each element in the control array
	for (let i = 0; i < control_order.length; i++) {
		const element = control_order[i];
		controlMap[element] = controlMap[element] ? controlMap[element] + 1 : 1;
	}

	// Sort the unsorted array based on the control array order and occurrence count
	unsortedArray.sort((a, b) => {
		const aCount = controlMap[a] || 0;
		const bCount = controlMap[b] || 0;

		if (aCount !== bCount) {
			return bCount - aCount; // Sort by occurrence count in descending order
		} else {
			const aIndex = control_order.indexOf(a);
			const bIndex = control_order.indexOf(b);
			return aIndex - bIndex; // Sort by index in the control array
		}
	});

	return unsortedArray;
}
