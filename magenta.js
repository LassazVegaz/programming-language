class Magenta {
	constructor(code) {
		this.code = code;
	}

	run() {
		console.log(code);
	}
}

const code = `
print "hello world"
print "I love ☀️"
`;
const intepreter = new Magenta(code);
intepreter.run();
