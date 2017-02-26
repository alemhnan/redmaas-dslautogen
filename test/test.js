var nearley = require("nearley");
console.log(nearley);
var grammar = require("./jsonToDSL.js");


var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
try {
  p.feed('{}');
  console.log(p.results);
} catch (e) {
  console.log(e);
}
