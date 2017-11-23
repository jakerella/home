'use strict';


// Example of a basic generator yielding two values and returning a third

function* foo() {
    console.log('Inside foo');

    yield 'a';

    console.log('Back inside foo');

    yield { 'b': 2 };

    return 'c';
}

const genObj = foo();

const one = genObj.next();
console.log( one );
// { value: 'a', done: false }

console.log('Outside foo');

const two = genObj.next();
console.log( two );
// { value: { b: 2 }, done: false }

const three = genObj.next();
console.log( three );
// { value: 'c', done: true }


// Example of using a generator as in Iterable in a for..of loop
for ( let value of foo() ) {
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

    const letter = yield* alphabet();
    yield letter;

    yield 3;
}

const result = [];

for ( let value of numbers() ) {
    result.push( value );
}

console.log( result );
// [ 1, 2, 'a', 'b', 'c', 3 ]



// Example using a generator to allow interruption of a longer mathematical calculation

function* getFibonacciSequence(count) {
    const x = 0, y = 0, next = 1;

    for ( let i=0 ; i < count; ++i ) {
        yield next;

        x = y;
        y = next;

        next = x + y;
    }
}

const fib = [];

for ( let next of getFibonacciSequence( 10 ) ) {
    fib.push( next );
}

console.log( fib );
// [ 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 ]



// Example using `yield` as an expression

function* yieldExpression(y) {
    const x = y * ( yield 'multiplier' );

    return x * x;
}

const gen = yieldExpression( 5 );

const type = gen.next();

console.log( type );
// { value: 'multiplier', done: false }

if (type.value === 'multiplier') {
    console.log( gen.next( 2 ) );
    // { value: 100, done: true }
}



// Example passing values into a generator

function* tellFortune() {
    const sign = yield 'Tell me your sign.';

    switch (sign) {
        case 'aries':
            yield 'You are awesome.';
            break;
        // ...
        case 'leo':
            yield 'You will tell a bad joke.';
            break;
        // ...
        default:
            yield 'No fortune for you.';
    }
}

const seer = tellFortune();
seer.next();

const fortune = seer.next('leo').value;
console.log( 'My fortune:', fortune );

// The other yield(s) in the switch will NOT affect the "done" property...
console.log( seer.next() );
