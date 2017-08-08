
/^[Rr]eg(ular\s)?[Ee]x(p|pressions?)?$/

(Note: this is modified from schedule)

This talk will help demystify regular expressions: what are they and why should you care? Attendees will get a solid foundation in the core concepts involved. We'll cover character classes, grouping, escaped characters, flags, modifiers, and more!

* What are they?
  * A way to match strings to a pattern
  * Used often for validation, but can be used for much more
  * Can pull out specific groups (matching groups), or replace pieces s/foo/bar/

* Different implementations in different languages, many common elements
  * One of the oldest standards is POSIX
  * Perl is also popular, and bred PCRE (Perl-Compatible RegEx)
  * We're focusing on JavaScript (no recursion or look behind, more advanced)
  * Features and usage we're covering are common to all
* Basic regex example (Node REPL)
  * Discuss slashes (JS and others (PCRE)) versus other ways (quotes or backticks)
  * `/t/.test("Connect Tech")` --> `true`
  * `/z/.test("Connect Tech")` --> `false`
  * `"Connect Tech".match(/t/)` (only one match!) (show no matches as well)
  * Show global and case insensitive flags, mention multiline
  * "Any" character with `.`
* Character Classes
  * Simple example with hex color (`/#[0123456789abcdef][0123456789abcdef]/`)
  * Ranges
    * Use hex color example: `/#[0-9a-f]/` (problem is the repetition)
  * Repetition (`?`, `+`, `*`, `{...}`)
  * Escaping characters (`[^$.|?*+-(){}\`)
    * Character class for first part of email: `[a-z_\.\-\+]+@`
    * Issues with string regexes (double escaping: `new RegExp("[a-z\\.\\-\\+]+@")`)
    * Don't _always_ have to escape: `foo-bar` (no character class)
* Grouping and Alternation
  * `1234 Main St.`, `1234 Spring Garden Ave, apt 12`
  * Matched Groups
    * Try to match and pull out building number, street, unit
    * `/([0-9]{1,5}) ([a-z .]+)(, (unit|apt|#|suite) [0-9]+)?/i`
    * Non-matching group (`?:`)
      * `/([0-9]{1,5}) ([a-z .]+)(?:, ((?:unit|apt|#|suite) [0-9]+))?/i`
  * Replacement
    * `"I like {{fav}} the most.".replace(/{{fav}}/, "dogs")` (note: no escaping required in this case)
    * `"jordan@jordankasper.com".replace(/([a-z0-9\.\-_]+)@([a-z\-]+\.[a-z]{2,})/i, "https://$2/users/$1")`
* Shorthands & Other Escaped Characters
  * Whitespace (tabs and spaces: `\s`)
    * Lines and space: (`\t`, `\n`, `\r`) (useful for converting Windows line endings)
  * Digits (`\d`)
  * Word characters ([a-z0-9_] -> `\w`)
  * Mention negation (`\S`, `\D`, `\W`)
* Anchors
  * Line (`^` and `$`)
  * Word boundary (`\b`) CAUTION, varies with implementation (might be `\B`)

* **_If time:_** Look Arounds
  * Ahead (positive): `/(the)(?=\sfat)/i` -> The fat cat sat on the mat
  * Ahead (negative): ?<= `/(the)(?!\sfat)/i` -> The fat cat sat on the mat
  * Behind: `?<=` and `?<!` (not supported in JS)

* Warnings
  * Don't try to regex _large_, unstructured data (i.e. HTML, see StackOverflow)
  * Use anchors pretty much all the time
  * Be careful with efficiency, especially with matching groups
* Tools & Resources
  * Playground: regex101.com
  * Engine info: en.wikipedia.org/wiki/Comparison_of_regular_expression_engines
  * Reference: regular-expressions.info
  * Diagramer: regexper.com
  * Dead tree version: "Mastering Regular Expressions" (O'Reilly)
  * Fun: regexcrossword.com
