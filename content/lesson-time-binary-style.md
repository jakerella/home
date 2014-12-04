## Lesson Time: Binary Style

I often get asked computer questions by friends and family... whether or not the question is actual in my field of discipline makes no difference to these people's expectations. As such, I try to find the answer even if I don't know it right away. One question that I do know the answer to (and have been asked many times) is: "What is binary?"

To answer the question, lets first look at the name: "binary." As the prefix of the word suggests it basically means "two pieces" (or parts, or units, or whatever other word you want to throw in there). Think of a [uni-cycle](http://www.etymonline.com/index.php?term=unicycle) versus a [bi-cycle](http://www.etymonline.com/index.php?term=bicycle) (yes, I threw in some hyphens for emphasis) and how one means "one-revolution" and the other "two-revolutions." When it comes to computers we usually see binary represented as 1′s and 0′s, but really, the term "binary" has nothing to do with computers.

### The Count (Not Dracula)

<img src='/uploads/ticks.png' alt='tick marks' class='right'> Consider when you play a game and you want to tally how many times you've won versus your opponent, how do you make those marks? Well, you might use a simple tick mark like in the following image - look familiar?

This method of counting is a unary system, it contains just one symbol: the tick mark; and that symbol simply repeats for each number. In other words, if I want to display the number 67 I will need 67 tick marks. This is the simplest method of counting. Let's contrast this with the system that has been adopted by just about every society: decimal. The prefix here ("dec") indicates that we count by tens. Notice that for me to display the number sixty-seven I only used two symbols: 67.

With a non-unary system, we use different symbols to represent groups of numbers; so the symbol "7″ actually indicates not one thing, but multiple - seven things to be exact. (Where as our tick marks from above always means one, regardless of how long or crooked they may appear.) Additionally, as soon as we pass a symbol that means nine things (9), we then add a new symbol and revert our previous symbol to zero thus making 10 (or 20, or 30, etc). You may also notice that as we increase the number we add another position each time we hit a power of ten (10, 100, 1000, 10000, etc).

It is when we add a new symbol that defines the base of our counting system; the system we most often use is 10, but as you might expect, binary is a base-2 system. In other words, in a binary system, we add a new position after incrementing our symbol 2 times.

So lets see what counting in binary looks like:

<table class='data-pad'>
    <tbody>
        <tr>
            <td>0</td>
            <td>1</td>
            <td>10</td>
            <td>11</td>
            <td>100</td>
            <td>101</td>
            <td>110</td>
            <td>111</td>
            <td>1000</td>
        </tr>
        <tr>
            <td>zero</td>
            <td>one</td>
            <td>two</td>
            <td>three</td>
            <td>four</td>
            <td>five</td>
            <td>six</td>
            <td>seven</td>
            <td>eight</td>
        </tr>
    </tbody>
</table>

Remember, each time we use up our two symbols (0 and 1), we add a position in front and revert the previous symbol to the start (0).

### Its All in the Timing

Of course, unary, binary and decimal are not the only systems out there. In fact, you almost certainly know of at least one other system: base-60. No, I'm not crazy; the [Babylonians](http://en.wikipedia.org/wiki/Babylon) used a base-60 counting system for everything, and in a base-60 system numbers like 6, 12, 60, and 360 are considered "round" - just like we think of 5 and 10 as being "round." The [Babylonians](http://en.wikipedia.org/wiki/Babylon) applied their number system to time, and that's where we get 60 minutes in an hour and 24 hours in a day (2 x 12). We also have the 12 signs of the [Zodiac](http://en.wikipedia.org/wiki/Zodiac) thanks to them.

<img src='/uploads/hieroglyphs.png' alt='Numeric Hieroglyphs' class='right'> We most likely get our decimal system from the [Egyptians](http://en.wikipedia.org/wiki/Ancient_Egypt) who used hieroglyphs for numerals and had symbols for 1, 10, 100, etc. and would combine them to build larger numbers.

So why do computers use a binary system? To answer that, we need to know some basics of electrical engineering, and how computer circuits work.

### The Machines are On (and Off)

When the term "binary" is applied to computers it typically refers to the set of instructions to the computer called "machine code." This machine code - if viewed by a human - appears to be a sequence of 1s and 0s, but the computer does not read those as numbers, it uses them to determine whether or not to send a signal through the processor. A computer's processor is its brain, and it operates on electricity (fyi, [so does your brain](http://www2.allblues.org/news/brain_series.html)!). Specifically, the computer's brain operates on a switch mechanism: there is either electricity passing through it, or there isn't. It is this simple on/off switching that allows a computer to know what to do.

A lot of people think programmer's write a bunch of 1s and 0s (known as [machine code](http://simple.wikipedia.org/wiki/Machine_code)) as the product of their work. Well we don't. People used to, and some do now as a learning exercise, but really there is no need to. These days we have [high-level](http://en.wikipedia.org/wiki/High-level_programming_language) languages which allow us to use (slightly) more natural terms. At some point prior to execution this code is then translated ([compiled](http://xkcd.com/303/)) into machine code (the 1s and 0s).

{{September 29, 2010}}

@@ learning, binary, math
