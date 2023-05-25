import { clearLine, cursorTo } from "node:readline";

export class ProgressBar {
	constructor(private total: number, private line: number, private name: string) {
		this.update(0);
	}

	async update(current: number): Promise<void> {
		const percentage = (current / this.total) * 100;
		let progress: number;
		if (current >= this.total) {
			progress = Math.round(30);
		} else {
			progress = Math.round((current / this.total) * 30);
		}
		const bar = "█".repeat(progress).padEnd(30);
		const text = `${this.name} ${bar} ${percentage.toFixed(2)}%`;

		cursorTo(process.stdout, 0, this.line);
		clearLine(process.stdout, 0);
		process.stdout.write(text);
	}
}

export function move_cursor(line: number) {
	cursorTo(process.stdout, 0, line);
}
