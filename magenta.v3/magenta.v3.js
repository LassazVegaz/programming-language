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
    const reservedKeywords = ["print", "var"];
    const variables = {};
    const length = tokens.length;
    let pos = 0;

    while (pos < length) {
      const token = tokens[pos];

      if (token.type === "keyword") {
        const keyword = token.value;
        if (keyword === "print") {
          const printToken = tokens[++pos];
          let printableValue = printToken.value;

          if (printToken.type === "keyword") {
            if (Object.keys(variables).includes(printableValue)) {
              printableValue = variables[printableValue];
            } else {
              console.error(`Variable not defined: ${printableValue}`);
              return;
            }
          }

          console.log(printableValue);
          pos++;
        } else if (keyword === "var") {
          const variableName = tokens[++pos].value;
          if (reservedKeywords.includes(variableName)) {
            console.error(`Keyword is reserved: ${variableName}`);
            return;
          }

          if (tokens[++pos].value !== "=") {
            console.error(`Invalid operator: ${tokens[pos].value}`);
            return;
          }

          variables[variableName] = tokens[++pos].value;
          pos++;
        } else {
          console.error(`Invalid keyword: ${token.value}`);
          return;
        }
      } else {
        console.error(`Invalid token: ${token.value}`);
        return;
      }
    }
  }

  _tokenize(code) {
    const length = code.length;
    if (length === 0) return { tokens: [] };

    const tokens = [];
    const validChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_1234567890";
    const validOperators = "=";
    let pos = 0;

    while (pos !== length) {
      const currentChar = code[pos];

      if (currentChar === "\n" || currentChar === "\r" || currentChar === " ") {
        // ignore white spaces and new lines
        pos++;
      } else if (currentChar === '"') {
        // we just met the starting point of a string
        let res = "";
        pos++;

        while (code[pos] !== '"' && code[pos] !== "\n" && pos < length) {
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
      } else if (validOperators.includes(currentChar)) {
        tokens.push({ type: "operator", value: currentChar });
        pos++;
      } else {
        return { error: `Unexpected character: ${currentChar}` };
      }
    }

    return {
      tokens,
    };
  }
}

let inputFile = process.argv[2] || path.join(__dirname, "code.ma");
if (!inputFile) {
  return console.log("Please provide a file to run");
}
const code = fs.readFileSync(inputFile, "utf-8").toString().replace(/\r/, "");
const intepreter = new Magenta(code);
intepreter.run();
