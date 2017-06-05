var nearley = require("nearley");
var grammar = require("./jsonToDSL.js");
var fs = require('fs');
var input = fs.readFileSync('test/test1.json').toString();

var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
try {
  p.feed(input);
  console.log(p.results);
} catch (e) {
  console.log(e);
}
