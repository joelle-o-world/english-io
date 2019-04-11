/*
  Borrowed from NULP, https://github.com/joelyjoel/Nulp/
  Seperate words, punctuation and capitalisation. Form an array which is easier
  to process.
*/


const wordCharRegex = /[\w']/;
const punctuationCharRegex = /[.,"()!?-]/;

module.exports = parseText = function(str) {
    // seperates a string into a list of words and punctuation

    str = removeFancyShit(str);

    var parts = new Array();

    var c, lastC;

    var partType = undefined;
    parts[0] = "";
    for(var i=0; i<str.length; i++) {
        //lastC = c;
        c = str.charAt(i);

        if(c == "_") {
            if(partType == undefined)
                partType = "q";
            else if(partType == "punctuation") {
                partType = "q";
                parts.push("");
            }
        }
        if(partType == "q") {
            if(c == " " || c == "\n" || c == "\t") {
                parts.push("");
                partType = undefined;
                continue;
            } else {
                parts[parts.length-1] += c;
                continue;
            }
        }

        if(c == "\n") {
            if(partType == "punctuation")
                parts[parts.length-1] += c;
            else
                parts.push(c);

            parts.push("");
            partType = undefined;
            continue;
        }

        if(c == " " && parts[parts.length-1] != "") {
            parts.push("");
            partType = undefined
            continue;
        }

        // special punctuation (hyphens and apostrophes)
        if(c == "'") {
            if(partType == "word" && (str.charAt(i+1).match(wordCharRegex) || str.charAt(i-1) == "s")) {
                parts[parts.length-1] += c;
                continue;
            }
        }

        if(c == "-") {
            if(str.charAt(i-1) == " " || str.charAt(i+1) == " ") {
                parts[parts.length-1] += "~";
                continue;
            }
        }

        // word
        if(c.match(wordCharRegex)) {
            if(partType == undefined) {
                partType = "word";
            }
            if(partType != "word") {
                parts.push("");
                partType = "word";
            }
            parts[parts.length-1] += c;
            continue;
        }

        //if(c.match(punctuationCharRegex)) {
        else {
            /*if(partType == undefined) {
                partType = "punctuation";
            }
            if(partType != "punctuation") {
                parts.push("");
                partType = "punctuation";
            }
            parts[parts.length-1] += c;*/
            parts.push(c);
            partType = "punctuation";
            continue;
        }

        console.log("Unrecognised character", c);
    }
    //console.log(parts);
    for(var i=0; i<parts.length; i++) {
        if(parts[i] == "")
            continue;
        if(parts[i][0].match(/[A-Z]/) && parts[i].slice(1).match(/[a-z]/)) {
            parts[i] = parts[i].toLowerCase();
            parts.splice(i, 0, "^");
            i++;
        }
    }

    return parts;
}

function isWord(str) {
  var c
  for(var i in str) {
    c = str[i]
    if(!c.match(wordCharRegex))
      return false
  }
  return true
}
module.exports.isWord = isWord

function removeFancyShit(str) {
    while(str.indexOf("’") != -1) {
        str = str.replace("’", "\'")
    }

    return str;
}

function recombine(bits) {
    var printedWords = []
    var upper = false
    for(var i in bits) {
        let w = bits[i]
        if(isWord(w)) {
            if(upper) {
                w = w[0].toUpperCase() + w.slice(1)
                upper = false;
            }
            printedWords.push(w)
        } else {
            if(w == "^") {
                upper = true;
                continue;
            }
            printedWords[printedWords.length-1] += w;
        }
    }
    return printedWords.join(" ")
}
module.exports.recombine = recombine
