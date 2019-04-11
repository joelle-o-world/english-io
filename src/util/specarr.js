/*
  A set of tools for using the so-called 'special array', or 'specarr'.

  Special Arrays consist of:
  [
    - null values to ignore
    - strings
    - Regexs
    - Entityena
    - substitutions
    - functions returning:
      - null values to ignore
      - strings
      - regexs
      - entityena
      - substitutions
      - special arrays for recursion
  ]

  Fully expanded special arrays consist of:
  [
    - strings,
    - regexs,
    - entityena,
    - substitutions
    - NO FUNCTIONS AND NO NULL VALUES
  ]

  Note: I in the function names in this file I am using an underscore to mean
        'to'. Eg/ specarr_regexs means "Special array to regular expressions"
*/

const {randexp} = require("randexp")

function specarr_regexs(target, specialArr, depth) { // special array to regexps
  // convert a 'special array' into an array of strings and regular expressions
  if(!target || (!target.isEntityenon && !target.isEntity))
    throw "expects target to be a Entityenon. "+target
  if(!specialArr || specialArr.constructor != Array)
    throw "expects specialArr to be an array."

  var out = [] // the output array
  for(var i in specialArr) {
    let item = specialArr[i]

    if(!item) // skip null values
      continue

    else if(item.constructor == String) // accept strings as regexs
      out.push(new RegExp(item))

    else if(item.constructor == RegExp) // accept regular expressions
      out.push(item)

    else if(item.isEntityenon)
      out.push(item.refRegex())
    else if(item.isEntity)
      out.push(item.reg(depth))

    // if substitution, interpret the substitution as a regex and add
    else if(item.isSubstitution) {
      //console.warn("Very odd, a substitution that is not returned by a function")
      let subbed = item.getRegex(depth)
      if(subbed)
        out.push(subbed)
    }

    else if(item.constructor == Function) {
      // call function on the target
      let result = item(target)

      // if result is null, skip.
      if(!result)
        continue;
      // accept result if RegExp
      else if(result.constructor == RegExp)
        out.push(result)
      // if string cast as RegExp and accept
      else if(result.constructor == String)
        out.push(new RegExp(result))
      // if substitution, interpret the substitution as a regex and add
      else if(result.isSubstitution) {
        let subbed = result.getRegex(depth)
        if(subbed)
          out.push(subbed)
      }
      // if entityenon, return its regex
      else if(result.isEntityenon)
        out.push(result.refRegex())
      else if(result.isEntity)
        out.push(result.reg(depth))
      // if array, recursively interpret and concatenate the result
      else if(result.constructor == Array)
        out = out.concat(specarr_regexs(target, result))
      else
        console.warn("Uninterpretted value from function:", result)
    } else
      console.warn("Uninterpretted value from list:", item)
  }

  // perhaps remove duplicates?
  for(var i in out) {
    if(out[i].constructor != RegExp)
      console.warn("specarr_regexs returned item which is not a regex:", out[i])
  }

  return out
}

function expand(target, specialArr) {
  /* Return the list of strings, regexs, objects and substitutions implied by
      the special array. */
  if(!target || !(target.isEntityenon || target.isEntity))
    throw "expects target to be a Entityenon."
  if(!specialArr || specialArr.constructor != Array)
    throw "expects specialArr to be an array."

  let out = []
  for(var i in specialArr) {
    let item = specialArr[i]
    if(!item) // skip null values
      continue

    else if(item.constructor == String) // accept strings
      out.push(item)

    else if(item.constructor == RegExp) // accept regular expressions
      out.push(item)

    else if(item.isSubstitution) // accept substitutions
      out.push(item)

    else if(item.isEntityenon || item.isEntity) // accept entityenon
      out.push(item)

    else if(item.isAction) // accept actions
      out.push(item)

    else if(typeof item == 'object' && item._verb) // accept rough actions
      out.push(item)

    // execute functions
    else if(item.constructor == Function) {
      let result = item(target)

      if(!result) // skip null function returns
        continue

      else if(result.constructor == RegExp) // accept regex function returns
        out.push(result)

      else if(result.constructor == String) // accept strings
        out.push(result)

      else if(result.isSubstitution) // accept substitutions
        out.push(result)

      else if(result.isEntityenon || item.isEntity) // accept entityena
        out.push(result)

      else if(result.isAction) // accept actions
        out.push(result)

      else if(typeof result == 'object' && result._verb) // accept rough actions
        out.push(result)

      else if(result.constructor == Array)
        out = out.concat(expand(target, result))
      else
        console.warn("Uninterpretted value from function:", result)
    } else
      console.warn("Uninterpretted value from list:", item)
  }

  return out
}

function cellToString(cell, descriptionCtx) { // "special array cell to string"
  // get a finalised string for an expanded special arr cell

  // if null or function, throw an error
  if(!cell || cell.constructor == Function)
    throw "illegal special cell."

  // if string, return as is
  if(cell.constructor == String)
    return cell
  // if regex, return using randexp
  if(cell.constructor == RegExp)
    return randexp(cell)
  // if entityenon, get its ref
  if(cell.isEntityenon)
    return cell.ref(descriptionCtx)
  if(cell.isEntity)
    return cell.ref()
  // if substitution, get its string
  if(cell.isSubstitution)
    return cell.getString(descriptionCtx)
}

// TODO: cellToRegex

function randomString(target, arr, ctx) {
  let expanded = expand(target, arr).sort(() => Math.random()*2-1)
  for(var i=0; i<expanded.length; i++) {
    let str = cellToString(expanded[i], ctx)
    if(str)
      return str
  }
  return null
}

function randomStrings(target, arr, ctx, n=1) {
  let expanded = expand(target, arr).sort(() => Math.random()*2-1)
  let list = []
  for(var i=0; i<expanded.length && list.length < n; i++) {
    let str = cellToString(expanded[i], ctx)
    if(str)
      list.push(str)
  }
  return list
}

function random(target, arr) {
  let expanded = expand(target, arr)
  return expanded[Math.floor(Math.random()*expanded.length)]
}


module.exports = {
  toRegexs: specarr_regexs,
  expand: expand,
  cellToString: cellToString,
  randomString: randomString,
  randomStrings: randomStrings,
  random: random,
}
