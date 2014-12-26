
function Animal(age) {
    if (age) { this.age = age; }

    // ...

}


function Animal() {
    var alive = true;
    
    this.isAlive = function() { return alive; };
    this.die = function() { alive = false; };
    
}


Animal.prototype.age = 1;
Animal.prototype.getAge = function() { return this.age; };


function Dog(name) {
    this.name = name;
    
    this.speak = function() {
        return this.name + " says woof";
    };
    
    //  ...
}


function Dog(name, age) {
    // call to parent constructor
    Animal.apply(this);
    
    Animal.apply(this, [age]);


    if (name) { this.name = name; }

    this.fur = "black";  // public!


    // notice that we don't use: this.alive
    var alive = true;

    this.isAlive = function() { return alive; }; // privileged
    this.die = function() { alive = false; };    // privileged

    // ...
}


Dog.prototype = Object.create(Animal.prototype); // the magic happens
Dog.prototype.constructor = Dog;                 // on these two lines


// With prototype members we can set a default value easily
Dog.prototype.name = "Bubbles";
Dog.prototype.speak = function() {
    return this.name + " says woof";
};


// These are just for slide demonstration
Dog.prototype.name = "Bubbles";                  // public!
Dog.prototype.speak = function() { /* ... */ };  // public!


Dog.prototype.getAge = function() {
    // call the parent method first
    var age = Animal.prototype.getAge.apply(this);
    
    return (age * 7);
};

Dog.prototype.kill = function() { this.alive = false; };  // NOT privileged


Dog.GENUS = "Canis";               // static property
Dog.mergeBreeds = function(a, b) { // static method
    return ("Breeding " + a + " and " + b);
};


Dog.getName = function() {
    return this.name;  // what is "this" pointing to?
};



// USAGE

var v = new Dog("Vincent");

// Create a blank object and set its prototype to Dog.prototype
var v = Object.create(Dog.prototype);

// call the constructor function ("Dog" in our case)
v.constructor("Vincent");
v.constructor("Vincent", 9);


v.speak();   // "Vincent says woof"


v.human = "Jordan";  // public!


v.kill();     // sets this.alive to false
v.isAlive();  // true
v.die();      // sets private "alive" var to false
v.isAlive();  // false

v.alive;  // undefined


(v instanceof Dog);     // true
(v instanceof Animal);  // true
(v instanceof Object);  // true

Dog.prototype.isPrototypeOf( v ); // true


v.getAge(); // 63


var b = new Dog("Brian");

b.speak();   // "Brian says woof"


var b = Object.create(Dog.prototype);
b.constructor();  // no name passed in!


b.speak();        // "Bubbles says woof"


v.__proto__ === Dog.prototype;  // true


console.log(Dog.GENUS); // Canis

Dog.mergeBreeds(v.breed, b.breed);

Dog.getName();       // what does the method return?

