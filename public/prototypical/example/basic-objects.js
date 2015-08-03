
var name = "Jordan";

name.length;            /* 6 */

name.length.toFixed(1); /* 6.0 */

name.toUpperCase();     /* "JORDAN" */


/* what your write        what gets executed */
name.length          ===  (new String (name)).length;



function foo() {
    return "bar";
}

/* Get the name and content of our function */

console.log(foo.name);       /*  "foo"  */

console.log(foo.toString()); /*  "function foo() { return \"bar\" }"  */



var literalDog = {
    name: "Vincent",
    speak: function() {
        return this.name + " says woof";
    }
};


var literalDog = new Object();
literalDog.name = "Vincent";
literalDog.speak = function() {
    return this.name + " says woof";
};


literalDog.speak();  /* "Vincent says woof" */

