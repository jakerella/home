
## Understanding `super` in JavaScript

With the adoption of ES6/2015 by nearly all browsers (with [one notable exception](http://caniuse.com/#feat=es6-class)), developers have access to the new `class` keyword and its construct for creating objects. If you are familiar with [prototypical inheritance in JavaScript](https://jordankasper.com/object-oriented-javascript-part-the-first/), don't worry, that knowledge is still useful. Why? Because JavaScript "classes" are just syntactic sugar over the top of prototypes. In this post, I'll shed a little bit of light on the ability to access a parent class (prototype) from within a subclass in ES6 code using `super`.

Let's start with a refresher on what ES6 classes look like. This is not a deep dive, or even an introduction. You can find [those articles elsewhere](https://developer.ibm.com/node/2015/08/12/an-introduction-to-javascript-es6-classes/)! But I want to make sure we all understand the basic constructs. It all starts with a class definition and a basic `constructor` method:

```javascript
class Widget {
    constructor(type) {
        this.type = type;
    }
}

let foo = new Widget("foo");
```

### It's all about the constructor

In the code above we create a (nearly) empty `class` named "Widget" with a simple constructor method (named "constructor", which is the only thing it can be called). You've probably seen this basic example before, so I won't dwell on it. Now we want to abstract some functionality up to a parent class so that we can reuse it in two subclasses. First, we need to create the parent class:

```javascript
class Resource {
    constructor() { }
}
```

There's really only one interesting bit here, if you have a `constructor` in the subclass, _you must have a `constructor` method_ in the parent class, even if it is a no-op function (and you have to call it). Why? The JS engine only attaches an object instance to the context variable (`this`) once you get to the highest prototype in the chain - which is `Object`. If you create a constructor, and then you _don't_ call the parent constructor, you're essentially short circuiting the chain!

In the code below, we have a constructor in the subclass which uses the ES6 `super` variable to call the parent constructor:

```javascript
class Widget extends Resource {
    constructor() {
        super();
    }
}
```

We could have passed any number of arguments into the parent constructor function. More to the point, if you try to access `this` in the subclass _before_ calling `super()` you'll get an error!

```javascript
class Widget extends Resource {
    constructor() {
        console.log(this);   // ReferenceError
        super();
    }
}
```

### Chain Gang

So you might ask, why do I only have to create a parent `constructor` if I create a child `constructor`? Wouldn't I need to do it _all the time_? Well, yes, it does need to exist _all the time_, but if you don't explicitly create the lowest level `constructor` (in  subclass), then JavaScript will create it for you. In other words, if you have no "constructor" defined, JS creates a no-op one for you: `constructor() { }` And if you are in a subclass, the default `constructor` created for you is actually:

```javascript
constructor(...args) {
    super(...args);
}
```

> Again, the important note here is _if you create a `constructor` in a subclass_, then you **must** create one in the parent class.

### Well, sort of...

As always, rules are made to be broken, I said above that you **must** create the `constructor` in the parent class, but really that's not true. The only reason you have to do it is because the default return value from a constructor method call is the value of `this`. So if you _don't_ create that parent `constructor`, then you will have no `this` value, and thus you'd be returning `undefined`, which is not ok in JavaScript constructors.

So, to break the rule here you just need to **return a different value**, then you don't need to create a parent constructor:

```javascript
class Resource { }

class Widget extends Resource {
    constructor() {
        return { foo: "bar" };
    }
}
```

That said, this gets you into a really weird state. I would not recommend this unless you know what you're doing!

### Get on with it!

Right, right... sorry, back to what `super` actually is. Well, I think you may have guessed it already, but the key to understanding what `super` is lies in the way we've been using it. We call `super()` inside of a subclass' `constructor` method in order to call the parent `constructor`... and that's pretty much what `super` is in JavaScript: a reference to the parent `prototype`:

```javascript
class Resource { constructor() { } }

class Widget extends Resource {
    constructor() {
        super();
        if (super.constructor === Resource.prototype.constructor) {
            console.log("It's true!");
        }
    }
}
```

Take a close look at that `if` conditional above... `super.constructor === Resource.prototype.constructor` - the `super` variable points to the parent `prototype`. What does that mean? It means you still need to know about prototypes for one. But it also means that inside of subclass methods, you have immediate access to the parent prototype (and the full chain) without having to necessarily know the _name_ of the parent class.

Not having to know the name of the parent class is cool I guess, but there is more magic going on behind the scenes here... The JS engine is actually doing you another favor: it's attaching the current context for you in class methods:

```javascript
class Resource {
    constructor() { }
    whoami() {
        console.log(this);  // will print out the current SUBCLASS object
    }
}

class Widget extends Resource {
    constructor() { super(); }
    whoami() {
        console.log(this);  // will print out the current Widget object
        super.whoami();
    }
}

let w = new Widget();
w.whoami();
```

What you see above is really important, we no longer need to call the parent methods using `apply` or `call` and switch the context. If you're confused, don't worry, a lot of people are (and have been for a long time). Essentially, this is what we used to have to do:

```javascript
Widget.prototype.whoami = function() {
    console.log(this);
    Resource.prototype.whomai.apply(this);  // execute the PARENT method, switching the context
};
```

In the olden days (ES5), if we tried to just call `Resource.prototype.whoami()` (or `this.__proto__.whoami()`) then the value of `this` inside the parent method would just be the `Resource` prototype... _not_ the `Widget` object we're operating on.

### Is `super` a function or an object?

You'll notice above that we use `super()` in the subclass constructor, but `super.whoami()` in the subclass method of the same name. So is `super` a function or an object? The answer is both, and neither. More specifically, functions are objects in JavaScript, so the answer would always be "both". But even more specifically, in JavaScript "super" is now a keyword, which means JavaScript is doing special things with it internally. In fact, inside of our `whoami` method you can't do `console.log( typeof(super) )`, you just get a SyntaxError, kind of like if you just tried to do: `let x = new;` ("new" is a keyword, and must be used appropriately).

### Wrapping things up

I hope that you have a better understanding of what `super` is now in ES6, and why **you still need to know about prototypes**. There is a lot more to classes in ES6/2015, and I would encourage you to read through [Axel Rauschmayer's article](http://2ality.com/2015/02/es6-classes-final.html) on the topic. It is thorough, but digestible. Feel free to drop me any questions in the comments!


{{November 4, 2017}}

@@ development, javascript
