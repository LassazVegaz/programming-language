/**
 * This is the compiler as a class as the very first steps. `run` method will run line by line.
 * So, technically this is an interpreter. This will catch some syntax errors. Parsed code should be
 * in the following format
 * ```
 * print "Hello World"
 * print "I am Lasindu"
 * ```
 */
class Magenta {
	constructor(code) {
		this.code = code;
	}

	run() {
		const lines = this._getLines(this.code);

		if (lines.length === 0) return;

		for (const line of lines) {
			let printStr = this._getPrintString(line);
			printStr = this._removeInvertedCommas(printStr);
			console.log(printStr);
		}
	}

	_removeInvertedCommas(str) {
		if (str.length < 2) throw new Error("Invalid print text");
		return str.substr(1, str.length - 2);
	}

	_getPrintString(str) {
		const splits = str.split("print ");
		if (splits.length != 2) throw new Error("Invalid print statement");
		return splits[1];
	}

	_getLines(code) {
		const str = code.trim();
		const lines = str.split(/\n/);
		return lines;
	}
}

const code = `
print "hello world"
print "I love ☀️"
`;
const intepreter = new Magenta(code);
intepreter.run();
