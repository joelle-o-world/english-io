# english-io

## The PredicateSyntax class
A PredicateSyntax object is used to define a set of related english sentences, to identify these sentences, extract information from them and encode information into sentences of the same form. Specifically, a PredicateSyntax object defines a set of sentences which all share the same verb, the same prepositions, the same number of arguments and, optionally, the same *constant arguments*. It provides a layer of abstraction between these properties and the tense, verb conjugation and the choice of arguments. (An argument can be either the subject, the object or a prepositional object of a sentence. A PredicateSyntax can define an argument as a constant - the same across all sentences in the set - or as a variable.)

For example, the following sentences all belong to the same PredicateSyntax: `{verb:”play”, params:[“object”, “subject”]}`.
	▪	John played the tuba.
	▪	The tuba played John.
	▪	John is playing blackjack.
	▪	ABC EFG plays 12345
	▪	Play the violin. (subject is omitted in the imperative tense.)

The following are not simple sentences, but can also be parsed/composed by the PredicateSyntax: `{verb:”play”, params:[“object”, “subject”]}`.
	•	The game that the penguins play.	      (Noun-phrase referring to an argument.)
	•	The penguins that play the game.	      (			   “     			 )
	•	Did the penguins play the game?		(Question form.)
	•	The penguins did not play the game.	(Negative form.)

Note that the following sentences do not belong to the same PredicateSyntax as those above:
	⁃	John plays. 					(No object.)
	⁃	John plays the tuba in the Albert Hall.	(Extra argument/preposition: ‘in’.)
	⁃	John washes the tuba.			(Different verb.)
	⁃	The Queen plays darts impeccably.	(Adverbs are not supported.)

### Usage
So much for the set of sentences and phrases that a PredicateSyntax object defines. How do we define a PredicateSyntax object itself? And how can we use it to compose sentences in english and to extract information from them.

To define a new PredicateSyntax we need three pieces of information. (Or, in object-oriented-programming speak, the class constructor takes 3 arguments.) :
1. `verb`: 			A verb in its infinitive form. Eg/ `"be"`
2. `params`:		An ordered list of argument names determining the variable arguments. Eg/ `["object", "in"]`
3. `constants`:	A set of argument names with associated values, determining the constant arguments. Eg/ `{subject:"there"}`

The convention used for naming arguments is to call them by the preposition which precedes them. There are two exceptions called 'subject' and 'object', which have on preposition and go before and after the verb respectively.

A PredicateSyntax definition in javascript looks like:
 `let P = new PredicateSyntax({
		verb: "be",
		params: ["object", "in"],
		constants: {subject: "there"}
	})`

Once we have defined a PredicateSyntax object we can easily generate an english sentence using its `.str()` method. Just pass this method a list of arguments and the name of the desired tense.

For example, using the predicate syntax, `P`, from the previous example.
	`P.str(["a moose", "this hoose"], "present_perfect")
	 // returns "there has been a moose in this hoose."`

Note that the order of the arguments in `.str()` always corresponds to the order of `params` in the PredicateSyntax definition. (Here `["object", "in"]` becomes `["moose", "hoose"]`).

To extract information back out of an english sentence we can pass it to the `.parse()` method. Optionally we can specify a list of suspected tenses to limit the search, otherwise all supported tenses will be checked.

Again using `P` from before:

`let sentence = P.parse("there is a pug in my mug")`
Returns,
`{
	args: ["a pug", "my mug"],
	tense: "simple_present",
	predicate: <Reference to P>
}`

### How it works
The algorithm for generating an english sentence begins by cross referencing the given tense against a table of tense-functions. For each tense there is a function which takes the verb and the subject-argument as input and returns a conjugated verb-phrase according to the tense and *person.* (see *src/util/verbPhrase.js*) Determining the person - I, you, it, we, they - is the least reliable part of this process as in many cases it is not clear without referring to a dictionary whether a noun or proper noun is plural or singular. Conjugating individual verbs (see _src/util/conjugate.js_) is done by following the rules of regular verb conjugation (add -s for third person, etc). Common irregular verb conjugations are stored in a small local database.

After computing the appropriate verb phrase for the verb, tense and person, the finished sentence is arrived at by concatenating this verb-phrase with the subject, object and prepositional phrases. For simple sentences this concatenation will be of the form:

	Subject + verb-phrase + object + preposition + preposition's argument + preposition + preposition's argument ... etc

Eg/ "the cat" + "will pat" + "the rat" + "on" + "the mat"
		(subject)		(verb-phr.)		(obj.)		(prep.)		(prep-arg)

Note that subtle variations on this algorithm are used for some special tenses and forms.

To parse - extract information from - an english sentence, the program begins by using a similar process to the algorithm above to generate a table of _regular expressions_, one for each tense. A regular expression is a means of representing a large set of possible strings using a concise notation, and of performing operations on these strings.

For example, here is the tense/regular-expression table for the PredicateSyntax `{verb:"play", params:["subject", "object"]}`

simple_present:
`/^(?<_subject>.+) (?:plays|play) (?<_object>.+)$/`

present_continuous:
`/^(?<_subject>.+) (?:am|are|is) playing (?<_object>.+)$/`

simple_past:
`/^(?<_subject>.+) played (?<_object>.+)$/`

past_continuous:
`/^(?<_subject>.+) (?:was|were) playing (?<_object>.+)$/`

present_perfect:
`/^(?<_subject>.+) (?:has|have) played (?<_object>.+)$/`

present_perfect_continuous:
`/^(?<_subject>.+) (?:has|have) been playing (?<_object>.+)$/`

past_perfect:
`/^(?<_subject>.+) (?:has|have) played (?<_object>.+)$/`

past_perfect_continuous:
`/^(?<_subject>.+) had been playing (?<_object>.+)$/`

future_perfect:
`/^(?<_subject>.+) will have played (?<_object>.+)$/`

future_perfect_continuous:
`/^(?<_subject>.+) will have been playing (?<_object>.+)$/`

simple_future:
`/^(?<_subject>.+) will play (?<_object>.+)$/`

future_continuous:
`/^(?<_subject>.+) will be playing (?<_object>.+)$/`

imperative:
`/^play (?<_object>.+)$/`

negative_possible_present:
`/^(?<_subject>.+) cannot play (?<_object>.+)$/`

negative_possible_past:
`/^(?<_subject>.+) could not play (?<_object>.+)$/`

The algorithm for generating regular expressions (from here on _regexp_) is essentially the same as for composing sentences, with two key differences. Firstly, each of the variable arguments is assigned a *capturing-group*, a regexp structure which works something like a blank space on a form. Secondly, rather than conjugate the verb into a fixed form, it generates a regexp which matches the verb in any conjugation. The verb's regexp, the capturing groups, the constant arguments and the prepositions are then concatenated into a larger regexp which matches sentences as a whole. The table of regular expressions is fixed for each PredicateSyntax, so this part of the process only needs to be carried out once when the syntax is first defined.

The english sentence under examination is then tried against each regular expression from the table in turn. If it finds a match then the sentence belongs to the predicate syntax and the tense is noted. The regular expressions library takes care of extracting the arguments from their capturing groups.

Note that the order of the regular expressions table had to be carefully chosen otherwise the program would make mistakes. For example, suppose a simple predicate syntax, `Q`, which describes sentences of the form "A eats B". And suppose we are trying to use `Q` to parse the english sentence "I will have been eating this spaghetti". This sentence is in the `future_perfect_continuous` tense, clearly the subject is "I" and the object is "this spaghetti". However, if the regular expression for the `present_perfect_continuous` tense (`/^(?<_subject>.+) (?:have|has) been eating (?<_object>.+)$/`) were higher up the list than that of the `future_perfect_continuous` (`/^(?<_subject>.+) will have been eating (?<_object>.+)$/`), the algorithm would come to the false conclusion that "I will have been eating this spaghetti" is a sentence in the `present_perfect_continuous` tense with the subject "I will". This would suggest that an entity who's name was "I will" had been eating spaghetti already. Of course, this would be a disastrous misunderstanding. Thankfully, the PredicateSyntax class takes care to order its regular expressions in a way which eliminates these confusions.

Given an english sentence for which we do not know the predicate already, we can repeat the process above, testing the sentence against every predicate in our dictionary until we find a match.

## Entity Class
Using the PredicateSyntax, we can convert an English sentence into a list of arguments, and vice versa. The Entity class enables us to learn more about the arguments themselves. The most common type of argument has the grammatical structure of a noun-phrase. According to the Oxford English Dictionary, a noun-phrase is "A word or group of words containing a noun and functioning in a sentence as subject, object or prepositional object." For example, the following are all noun-phrases: "Bob", "a lamp", "my many woes", "an apple as big as the moon", "me".

It is these arguments which the Entity class is concerned with. An Entity object defines a set of English noun-phrases which all refer (or, strictly speaking, *could* refer) to the same thing. It can produce random examples from this set, and it can determine whether a given noun-phrase is a member of the set or not.

(It might have been been more accurate to name this class 'Object' rather than 'Entity', but this would have introduced confusion due to the object-oriented programming language it is written in.)

Multiple layers of information can be combined to define a single Entity object.
	- A list of nouns which describe the entity.
	- A list of adjectives which are attributed to the entity.
	- A list of prepositional phrases which describe the entity.
	- A list of proper nouns which refer to the entity.
	- A list of *Sentence* objects which involve the entity. (*Sentence* objects consist of a predicate and a list of arguments.)
	- The entity's preferred pronoun.
