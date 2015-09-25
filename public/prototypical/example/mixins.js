

// jQuery ($), Underscore (_), or Angular (ng)
$.extend(target, obj1, obj2, /* ... */ );

// Prototype.js
Object.extend(target, obj);

// Backbone
Model.extend({ /* ... */ });

// Dojo
lang.mixin(target, obj);
// or use extend, which adds to the prototype automatically
lang.extend(Class, obj);



function Animal(age) { /* ... */ }

function Dog(name, age) { /* ... */ }



// our interface/mixin
var Domesticated = {
    
    happiness: 1,
    
    lickFace: function(count) {
        this.happiness += count;
    }
    
};


$.extend(Dog.prototype, Domesticated);

var v = new Dog("Vincent", 10);
var v = Object.create(Dog.prototype);
v.constructor("Vincent", 10);


console.log( v.happiness );  // 1

v.lickFace( 5 );

console.log( v.happiness );  // 6


