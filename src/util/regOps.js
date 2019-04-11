function sourcify(list) {
  return list
    .filter(item => item)
    .map(item => item.constructor == RegExp ? item.source : item)
}

function bracket(str) {
  return "(?:" + str + ")"
}
function autoBracket(str) {
  if(/^[\w, ]*$/.test(str))
    return str
  else
    return bracket(str)
}

function concat(...operands) {
  return new RegExp(
    sourcify(operands)
      .map(autoBracket)
      .join("")
  )
}
function concatSpaced(...operands) {
  return new RegExp(
    sourcify(operands)
      .map(autoBracket)
      .join(" ")
  )
}
function or(...operands) {
  return new RegExp(
    sourcify(operands)
      .map(autoBracket)
      .join("|")
  )
}
function optional(operand) {
  operand = new RegExp(operand).source
  operand = bracket(operand)
  return operand + "?"
}
function kleene(operand) {
  operand = new RegExp(operand).source
  operand = bracket(operand)
  return operand + "*"
}

function kleeneSpaced(operand) {
  return kleeneJoin(operand, ' ')
}

function kleeneJoin(operand, seperator) {
  operand = new RegExp(operand).source
  seperator = new RegExp(seperator).source
  return concat(operand, kleene(concat(seperator, operand)))
}

function kleenePoliteList(...operands) {
  operand = or(...operands)
  return concat(
    optional(concat(kleeneJoin(operand,', '), ',? and ')),
    operand
  )
}

function optionalConcatSpaced(stem, ...optionalAppendages) {
  stem = autoBracket(new RegExp(stem).source)
  optionalAppendages = sourcify(optionalAppendages)
    .map(a => autoBracket(a))
    .map(a => optional(" " + a))
  return concat(stem, ...optionalAppendages)
}

function kleeneConcatSpaced(stem, ...optionalAppendages) {
  stem = autoBracket(new RegExp(stem).source)
  optionalAppendages = sourcify(optionalAppendages)

  let toConcat = kleene(concat(' ', or(...optionalAppendages).source))
  return concat(stem, toConcat)
}

function whole(operand) {
  operand = autoBracket(new RegExp(operand).source)
  return new RegExp('^'+operand+'$')
}

module.exports = {
  concat: concat,
  concatSpaced: concatSpaced,
  or: or,
  optional: optional,
  kleene: kleene,
  kleeneJoin: kleeneJoin,
  kleeneSpaced: kleeneSpaced,
  kleenePoliteList: kleenePoliteList,
  kleeneConcatSpaced: kleeneConcatSpaced,
  optionalConcatSpaced: optionalConcatSpaced,
  autoBracket: autoBracket,
  whole: whole,
}
