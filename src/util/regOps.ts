console.warn("Regops has been moved to its own npm package (`regops`), better to use that instead.")

//----------------------------------------------------------

/** Convert a list of convert regexs to their source strings. */
function sourcify(list:(RegExp | String | null)[]):string[] {
  return (list
    .filter(item => item) as (RegExp|string)[]) // remove null items
    .map(item => item instanceof RegExp ? item.source : item)
}

/** Put non-capturing brackets around a regex source string. */
function bracket(str:string) {
  return "(?:" + str + ")"
}

/** If necessary, put non-capturing brackets around a regex source string. */
function autoBracket(str:string) {
  if(/^[\w, ]*$/.test(str))
    return str
  else
    return bracket(str)
}

/** Concatenate a list a of regular expressions. */
function concat(...operands:(RegExp | string | null)[]) {
  return new RegExp(
    sourcify(operands)
      .map(autoBracket)
      .join("")
  )
}

/** Concatenate a list of regular expressions with a single-space (' ') delimiter.*/
function concatSpaced(...operands:(RegExp|string|null)[]) {
  return new RegExp(
    sourcify(operands)
      .map(autoBracket)
      .join(" ")
  )
}

/** Combine regular expressions with OR (|) operator. */
function or(...operands:(RegExp|string|null)[]) {
  return new RegExp(
    sourcify(operands)
      .map(autoBracket)
      .join("|")
  )
}

/** Apply OPTIONAL (?) operator to a regular expressions. */
function optional(operand:RegExp|string) {
  operand = new RegExp(operand).source
  operand = bracket(operand)
  return operand + "?"
}

/** Apply Kleene closure (*) operator to a regular expression. */
function kleene(operand:RegExp|string) {
  operand = new RegExp(operand).source
  operand = bracket(operand)
  return operand + "*"
}

/** Apply Kleene closure (*) operator to a regular expression, delimiting repetitions with a single-space (' ') */
function kleeneSpaced(operand:RegExp|string) {
  return kleeneJoin(operand, ' ')
}
/** Apply Kleene repetitions of a regular expression with some specified delimiter. */
function kleeneJoin(operand:RegExp|string, delimiter:string) {
  operand = new RegExp(operand).source
  delimiter = new RegExp(delimiter).source
  return concat(operand, kleene(concat(delimiter, operand)))
}

/** Create a "polite list" (form: X, X, X and X) using Kleene closure to allow any number of items. */
function kleenePoliteList(...operands:(RegExp|string)[]) {
  let operand = or(...operands)
  return concat(
    optional(concat(kleeneJoin(operand,', '), ',? and ')),
    operand
  )
}

/** Concatenate a list of regular expressions with optional (?) modifiers. */
function optionalConcatSpaced(
  stem:RegExp|string, 
  ...optionalAppendages:(RegExp|string|null)[]
) {
  stem = autoBracket(new RegExp(stem).source)
  optionalAppendages = sourcify(optionalAppendages)
    .map(a => autoBracket(a))
    .map(a => optional(" " + a))
  return concat(stem, ...optionalAppendages)
}

/** Concatenate an item with itself any number of times (using kleene closure *) using a single-space (' ') as a delimiter. */
function kleeneConcatSpaced(
  stem:RegExp|string, 
  ...optionalAppendages:(RegExp|string|null)[]
) {
  stem = autoBracket(new RegExp(stem).source)
  optionalAppendages = sourcify(optionalAppendages)

  let toConcat = kleene(concat(' ', or(...optionalAppendages).source))
  return concat(stem, toConcat)
}

/** Add ^ and $ markers either side of a regular expression so that it must match an entire string. */
function whole(operand:RegExp|string) {
  operand = autoBracket(new RegExp(operand).source)
  return new RegExp('^'+operand+'$')
}

/** Surround a regular expression with capturing parentheses, optionally specifying a group name. */
function capture(operand:RegExp|string, groupName:string) {
  if(operand instanceof RegExp)
    operand = operand.source

  let name = groupName ? '?<'+groupName+'>' : ''

  return new RegExp('(' + name + operand + ')')
}

export {
  concat, 
  concatSpaced,
  or,
  optional,
  kleene,
  kleeneJoin,
  kleeneSpaced,
  kleenePoliteList,
  kleeneConcatSpaced,
  optionalConcatSpaced,
  autoBracket,
  whole,
  capture,
}
