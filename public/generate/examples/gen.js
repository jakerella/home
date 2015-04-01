'use strict';

    
// Example of a basic generator yielding two values and returning a third

function* foo() {
    yield 'a';
    
    yield { 'b': 2 };
    
    return 'c';
}

var gen = foo();

var one = gen.next();
console.log( one );    // { value: 'a', done: false }

var two = gen.next();
console.log( two );    // { value: { b: 2 }, done: false }

var three = gen.next();
console.log( three );  // { value: 'c', done: true }


// Example of using a generator as in Iterable in a for..of loop
for ( var value of foo() ) {
    console.log( value );
    
    // a
    // { b: 2 }
}



// Example of generators calling generators (delegation)

function* alphabet() {
    yield 'a';
    yield 'b';
    
    return 'c';
}

function* numbers() {
    yield 1;
    yield 2;
    
    var letter = yield* alphabet();
    yield letter;
    
    yield 3;
}

var result = [];

for ( var value of numbers() ) {
    result.push( value );
}

console.log( result ); // [ 1, 2, 'a', 'b', 'c', 3 ]



// Example using a generator to allow interruption of a longer mathematical calculation

function* getFibonacciSequence(count) {
    var x = 0, y = 0, next = 1;
    
    for ( var i=0 ; i < count; ++i ) {
        yield next;
        
        x = y;
        y = next;
        
        next = x + y;
    }
}

var fib = [];

for ( var next of getFibonacciSequence( 10 ) ) {
    fib.push( next );
}

console.log( fib );  // [ 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 ]



// Example using `yield` as an expression

function* yieldExpression(y) {
    var x = y * ( yield 'multiplier' );
    
    return x * x;
}

var gen = yieldExpression( 5 );

var type = gen.next();

console.log( type );  // { value: 'multiplier', done: false }

if (type.value === 'multiplier') {
    console.log( gen.next( 2 ) );  // { value: 100, done: true }
}



// Example of using error handling with generators

function* handleErrors() {
    
    try {
        
        var x = yield 13;
        console.log('The value of x is', x);
        
    } catch( err ) {
        console.log('Caught inside generator:', err.message);
    }
    
    throw new Error('barbat');
}

var gen = handleErrors();

try {

    var y = gen.next();
    gen.throw( new Error('foobar') );
    
} catch(err) {
    // We'll never get here because the error is caught inside the generator
    console.log('Caught outside genertor:', err.message);
}


var gen = handleErrors();

try {
    
    gen.throw( new Error('batbaz') );
    
} catch(err) {
    // Because we haven't called next() yet, the Error above is caught here, NOT inside the generator
    console.log('Caught outside genertor:', err.message);
}

try {
    
    var gen = handleErrors();
    gen.next();
    throw new Error('bazfoo');
    
} catch(err) {
    // Errors thrown without using the generators .throw() method will never make it into the generator
    console.log('Caught outside genertor:', err.message);
}


try {
    
    var gen = handleErrors();
    gen.next();
    gen.next(42);
    
} catch(err) {
    // Errors thrown inside the generator can be caught outside of it
    console.log('Caught outside genertor:', err.message);
}


