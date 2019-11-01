/**
 * Convert english nouns between their singular and plural forms.
 * @class plural
 * @static
 */

/**
 * Convert a singular noun to a plural.
 * @method toPlural
 * @param {String} singularNoun
 * @return {String}
 */
function toPlural(singularNoun:string) {
  // if irregular return the irregular plural
  if(irregular[singularNoun])
    return irregular[singularNoun]

  // If the singular noun ends in -o, ‑s, -ss, -sh, -ch, -x, or -z, add ‑es
  if(/(o|s|ss|sh|ch|x|z)$/i.test(singularNoun))
    return singularNoun + 'es'

  // If the noun ends with ‑f or ‑fe, the f is often changed to ‑ve before
  // adding the -s to form the plural version.
  // -- FOR NOW, TREATING THESE AS IRREGULAR.

  // If a singular noun ends in ‑y and the letter before the -y is a consonant,
  // change the ending to ‑ies to make the noun plural.
  if(/[bcdfghjklmnpqrstvwxyz]y$/i.test(singularNoun))
    return singularNoun.slice(0, -1) + 'ies'

  // If the singular noun ends in ‑us, the plural ending is frequently ‑i.
  if(/us$/.test(singularNoun))
    return singularNoun.slice(0, -1) + 'i'

  // If the singular noun ends in ‑is, the plural ending is ‑es.
  // -- IGNORING BECAUSE HARD IT INTRODUCES AMBIGUITY IN INVERSION. TREATING
  //    THESE WORDS AS IRREGULAR.

  // If the singular noun ends in ‑on, the plural ending is ‑a.
  if(/on$/.test(singularNoun))
    return singularNoun.slice(0, -2) + 'a'

  // otherwise add -s on the end
  return singularNoun+'s'
}

/**
  * Convert a plural noun to a singular
  * @method toSingular
  * @param {String} pluralNoun
  * @return {String|null}
  */
function toSingular(pluralNoun:string) {
  // If irregular, replace with the singular
  if(irregularInverted[pluralNoun])
    return irregularInverted[pluralNoun]

  // If the plural noun ends -ies, replace with -y
  if(/ies$/.test(pluralNoun))
    return pluralNoun.slice(0, -3) + 'y'

  // If the plural noun ends with a consonant followed by -les, remove -s
  if(/[bcdfghjklmnpqrstvwxyz]les$/.test(pluralNoun))
    return pluralNoun.slice(0, -1)

  // If the plural noun ends with a vowell followed by a consonant followed by
  // -es, remove -s
  if(/[aeiou][bcdfghjklmnpqrstvwxyz]es$/.test(pluralNoun))
    return pluralNoun.slice(0, -1)

  // If the plural noun ends -es, remove -es
  if(/es$/.test(pluralNoun))
    return pluralNoun.slice(0, -2)

  // If the plural noun ends -s, remove -s
  if(/s$/.test(pluralNoun))
    return pluralNoun.slice(0, -1)

  // If the plural noun ends -i, replace with -us
  if(/i$/.test(pluralNoun))
    return pluralNoun.slice(0, -1) + 'us'

  // If the plural noun ends -a, replace with -on
  if(/a$/.test(pluralNoun))
    return pluralNoun.slice(0, -1) + 'on'

  // If the plural noun ends -s, remove -s
  if(/s$/.test(pluralNoun))
    return pluralNoun.slice(0, -1)

  // Otherwise return null, this is recognised as a plural noun
  return null
}

export {toPlural, toSingular}

const irregular:{[key: string]: string|undefined} = {
  // singular : plural,
  sheep: 'sheep',
  ice: 'ice',

  goose: 'geese',
  child: 'children',
  woman: 'women',
  man: 'men',
  tooth: 'teeth',
  foot: 'feet',
  mouse: 'mice',
  person: 'people',

  toe: 'toes',

  // phrasal nouns
  'pair of trousers': 'pairs of trousers',
}

const irregularInverted:{[key: string]: string|undefined} = {}
for(let singular in irregular) {
  const plural:string = irregular[singular] as string 
  irregularInverted[plural] = singular
}
