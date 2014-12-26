
console.log(Dog.prototype);
 
{
    constructor: Dog(name) {
        this.name = name;
        if (name) { this.name = name; }
        this.speak = function() {
            return this.name + " says woof";
        }
    },
    name: "Bubbles",
    speak: function() {
        return this.name + " says woof";
    },
    __proto__: Object { /* ... */ }
}


var v = new Dog("Vincent");

console.log(v);

{
    name: "Vincent",
    __proto__: Dog {
        constructor: function Dog(name) { /* ... */ },
        name: "Bubbles",
        speak: function () { /* ... */ },
        __proto__: Animal {
            constructor: function Animal() { /* ... */ },
            __proto__: Object { /* ... */ }
        }
    }
}

