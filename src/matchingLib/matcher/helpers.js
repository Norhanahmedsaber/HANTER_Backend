"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.argumentsIncludesGeneral = argumentsIncludesGeneral;
exports.createBlockStatement = createBlockStatement;
exports.noOfnotGeneralArgs = noOfnotGeneralArgs;
exports.statementsIncludesGeneral = statementsIncludesGeneral;
function argumentsIncludesGeneral(args) {
  var found = false;
  args.forEach(function (arg) {
    if (arg.type === "General") {
      found = true;
    }
  });
  return found;
}
function noOfnotGeneralArgs(args) {
  return args.filter(function (x) {
    return x.type !== "General";
  }).length;
}
function createBlockStatement(tree) {
  return {
    type: "BlockStatement",
    body: tree.body,
    start: tree.start,
    end: tree.end,
    range: tree.range,
    loc: tree.loc
  };
}
function statementsIncludesGeneral(statements) {
  var found = false;
  statements.forEach(function (statement) {
    if (statement.type === "General") {
      found = true;
    }
  });
  return found;
}