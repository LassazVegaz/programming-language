const path = require("path");
const fs = require("fs");

/**
 * This interpreter in this class will behave as a real intepreter with a lexer
 */

class Magenta {
	constructor(code) {
		this.code = code;
	}

	run() {
		const { tokens, error } = this._tokenize(this.code);

		if (error) {
			console.log(error);
		} else {
			this._parse(tokens);
		}
	}

	_parse(tokens) {
		const length = tokens.length;
		let pos = 0;

		while (pos < length) {
			const token = tokens[pos];

			if (token.type !== "keyword") {
				return console.log(`invalid syntax near ${token.value}`);
			} else if (token.value !== "print") {
				return console.log(`invalid keyword: ${token.value}`);
			} else if (tokens[pos + 1].type !== "string") {
				return console.log(`unexpected token: ${token.value}`);
			}

			console.log(tokens[pos + 1].value);

			pos += 2;
		}
	}

	_tokenize(code) {
		const length = code.length;
		if (length === 0) return { tokens: [] };

		const tokens = [];
		const validChars =
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_1234567890";
		let pos = 0;

		while (pos !== length) {
			const currentChar = code[pos];

			if (currentChar === "\n" || currentChar === " ") {
				// ignore white spaces and new lines
				pos++;
			} else if (currentChar === '"') {
				// we just met the starting point of a string
				let res = "";
				pos++;

				while (
					code[pos] !== '"' &&
					code[pos] !== "\n" &&
					pos < length
				) {
					res += code[pos];
					pos++;
				}

				// if end of the line was not a " the string is not correctly terminated
				if (code[pos] !== '"') {
					return {
						error: `String is not correctly terminated: ${res}`,
					};
				}

				tokens.push({ type: "string", value: res });
				pos++;
			} else if (validChars.includes(currentChar)) {
				let res = currentChar;
				pos++;

				while (validChars.includes(code[pos]) && pos < length) {
					res += code[pos];
					pos++;
				}

				tokens.push({ type: "keyword", value: res });
			} else {
				return { error: `Unexpected character: ${currentChar}` };
			}
		}

		return {
			tokens,
		};
	}
}

const inputFile = process.argv[2];
if (!inputFile) {
	return console.log("Please provide a file to run");
}
const code = fs
	.readFileSync(inputFile, "utf-8")
	.toString()
	.replace(/\r/, "");
const intepreter = new Magenta(code);
intepreter.run();