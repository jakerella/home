
## Goodbye `var` - JS Variable Declarations in ES6

> This entry was [originally posted](https://strongloop.com/strongblog/es6-variable-declarations/) on the StrongBlog (by me). Nothing changed, just adding it to my personal site. :) That said, you should [check out StrongLoop](http://strongloop.com/get-started/) if you're interested in building APIs in Node!

Everyone in the JavaScript world is talking about ECMAScript 6 (ES6, a.k.a. ES 2015) and the big changes coming to objects (`class`, `super()`, etc), functions (default params, etc), and modules (import/export), but [less attention](http://www.google.com/trends/explore#q=es6%20modules%2C%20es6%20classes%2C%20es6%20let%2C%20es6%20const%2C%20es6%20variables&amp;date=today%2012-m&amp;cmpt=q&amp;tz=) is being given to variables and how they are declared. In fact, some attention is being given, but perhaps without the right focus. I recently attended the jQuery UK conference where [Dave Methvin](https://twitter.com/davemethvin) gave a nice [overview of ES6](https://docs.google.com/presentation/d/1PvAHvODY_L3AiumgyjNFl4IPr82dq74vJxmMPOeU8uE/edit#slide=id.g6979fade7_016), with some great attention on `let` and `const`.

In this article I wanted to cover these two new keywords for declaring variables and differentiate them from `var`. And possibly more importantly, I want to identify what some folks are considering the new standard for declaring variables in ES6. The basic idea here is that `let` should, in time, replace `var` as the default declaration keyword. In fact, according to some, `var` should simply not be used at all in new code. The `const` keyword should be used for any variable where the reference should never be changed, and `let` for anything else.

### Replacing `var` with `let`

This workflow shift may seem dramatic at first, but not as much when we think about the differences between `let` and `var`. While `var` creates a variable scoped within its nearest parent function, `let` scopes the variable to the nearest block, this includes `for` loops, `if` statements, and others.

```js
function foo() {
  console.log( x );
  console.log( y );

  var x = 1;
  if (x === 1) {
    let y = 2;
  }
  console.log( y );
}

foo();
console.log( x );
```

In the example above we create a new function (and var scope) with `foo` and then call the function. As expected, the last `console.log()` statement will produce a `ReferenceError` because `x` is only defined (scoped) inside the `foo()` function. The first console statement will execute just fine due to variable hoisting. In this case, `x` will evaluate to `undefined`. The second console statement, however, is more interesting. In fact, both of the `log(y)` calls will fail because the `let` keyword allows much tighter scoping than `var`. The `y` variable _only exists_ inside of that `if` block, and no where else! Dave Methvin calls that are before the `let` declaration the "[Temporal Dead Zone](https://docs.google.com/presentation/d/1PvAHvODY_L3AiumgyjNFl4IPr82dq74vJxmMPOeU8uE/present?slide=id.g6979fade7_016)."

Hopefully this example illustrates the specificity of `let`, but you may be saying that sometimes you actually _want_ a function-scoped variable. No problem, simply create the variable at the top of your function!

```js
function foo( x ) {
  let y;

  if (x === 1) {
    y = 2;
  }
  console.log( y );
}

foo( 1 );
console.log( y );
```

The function above declares the `y` variable at the top of the function, thus giving it a larger scope than our first example. We can see that `y` is accessible anywhere inside this function, but not outside of it, that last `console.log(y)` statement will produce a `ReferenceError`. Before we move on to `const`, let's reiterate our thesis: `let` should completely replace `var` in ES6. The examples above should show you that `let` is more powerful, while still allowing almost all of the flexibility of `var`. I'm [not the first one to say it](https://twitter.com/raganwald/status/564792624934961152), but I'm a believer now.

### Constant Reference, Not Value

The other new keyword for variable declaration in ES6 is `const`, but it is often misinterpreted as being a "constant value". Instead, in ES6 a `const` represents a _constant reference_ to a value (the same is true in most languages, in fact). In other words, the pointer that the variable name is using cannot change in memory, but the thing the variable points to _might_ change.

Here's a simple example. In the code below we create a new variable with a constant reference to an Array. We can then add values onto the array and since this does not change the reference, everything works:

```js
const names = [];
names.push( "Jordan" );
console.log( names );
```

However, if we try to change the variable reference to a new array - even to one with the same contents - we will get a SyntaxError ("Assignment to constant variable"):

```js
const names = [];
names = [];  // Error!
```

Of course, if you have a `const` that points to a primitive such as a string or number, then there really isn't anything to change about that value. All methods on String and Number return _new_ values (objects).

The last note about using `const` is that it follows the same new scoping rules as `let`! This means that between `let` and `const` we should be able to complete replace `var` in our code. In fact, there are many folks supporting the idea of only "allowing" `var` to be used in legacy code that hasn't been touched. When a developer jumps into a file to update some code, they could (and possibly should) be updating all `var` statements to `let` or `const` as appropriate, with proper scoping.

### But that's just for ES6...

It's true. The new `let` and `const` keywords are not available in ES5, and thus in most execution environments. However, with good transpilers such as [Babel](https://babeljs.io/) we can compile our ES6 JavaScript into runnable ES5 code for deployment to a browser environment.

Luckily for us Node.js (and io.js) developers we don't have to worry about what browser someone is executing our JavaScript code in! If you're using [Node v0.12](https://strongloop.com/strongblog/whats-new-node-v0-12-features/) (you are, right?), you can have access to these features with two small changes to your execution command:

```bash
~$ node --harmony --use-strict /path/to/script
```

Why two options? The first enables ES6 features generally (it was originally codenamed "Harmony"), and the second enforces "strict mode" within your code. Enabling this second option will make your code better by pointing out potential issues that a more relaxed interpreter might not catch.

In io.js you don't need the `--harmony` flag because all of those features are being rolled right into the code. However, you do still need to make your code strict. This can be done in io.js by simply placing a `"use strict";` statement at the top of your module files.

**Now go forth, and create a better variable declaration workflow!**

{{March 17, 2015}}

@@ javascript, es6
