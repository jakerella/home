
class Dog extends Animal {
    constructor(name) {
    
        super(); // Call parent method of same name
    
        if (name) { this.name = name; }
    
    }

    get name() { return this._name; }

    set name(value) { this._name = value; }

    speak() { return this.name + " says woof"; }
}


// for data members, we still have to do this...
Dog.prototype._name = "Bubbles";

