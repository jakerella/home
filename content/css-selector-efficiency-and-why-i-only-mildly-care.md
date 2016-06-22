
## CSS Selector Efficiency and Why I Only Mildly Care

CSS selector efficiency just isn't that important to me.

That's not to say that _efficiency_ generally isn't... it is. And I take great pride in my ability to determine the most efficient route from my home to work and the most efficient use of my time while preparing meals. However, my computer has eight gigabytes of random access memory and a quad core 2.7 gigahertz processor... As such, the load time of web pages I view is rarely affected by the speed of CSS rendering. It is much more impacted by my Internet connection and the inefficient JavaScript that most sites use (more on that in a future post).

I want to talk to you today about about CSS selectors, how specificity is determined, how to write efficient selectors, and why I only mildly care about that efficiency. Sure, we all want to write efficient code, but I'd much rather have **_mildly_ efficient code that is more maintainable** than _highly_ efficient code that takes ages to write and that I can never touch for fear of breaking everything.

### wut

Not sure what the heck I'm talking about? Your cascading stylesheets depend on specificity to determine which competing styles should apply to any given element. For example, you might have a rule like: `img { display: block; }` which changes all images to be block elements. However, you might have _one_ image which has a class on it and a style just for that class: `<p class='bermuda-triangle'>` and `.bermuda-triangle { display: none; }`. How does the browser decide which style to apply at runtime?

The browser determines which rules to apply by first determining which CSS selector is more specific for any given HTML element. For any HTML element the browser determines which rules apply to it, and assigns a numeric value to indicate the specificity. If two rules have the same specificity, the browser will use whichever rule is later in the CSS file(s). Because of this, we often see developers create CSS far down in a file that attempts to override an earlier rule by simply adding stuff to the selector to make it more specific.

The problem here is that we tend to either write horrible CSS that ends up using ten different selector pieces just to override some stuff which is terribly inefficient; or we over optimize our CSS for efficiency which ultimately bloats our page weight and is a pain to maintain.

### CSS Selector Types

Let's first look at various types of selectors. If you're not familiar, you can find many [great introductions](https://www.codecademy.com/courses/web-beginner-en-XUclI/0/1) to [CSS selectors](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_started/Selectors) [online](https://www.sitepoint.com/web-foundations/introduction-css-selectors/). There are generally four categories of CSS selector - at least when it comes to specificity, and thus efficiency. I don't want to dwell on how each one _should_ be used, or any specific declarations since we're focusing on efficiency in this post. Let's take a look at each:

#### 1. IDs - you know 'em, you love 'em (or hate 'em):

```html
<section id='main'> <!-- srsly? -->
  ...
</section>
```

```css
#main { display: flex; } /* awesome-sauce */
```

Ignoring the obvious fact that this developer should be using the `<main>` tag instead of an id of "main", this is fine. The ID selector (`#main`) is the most specific and most efficient in all of CSS-land. Basically, **the most efficient CSS would be entirely composed of ID selectors**. Of course, that would be horrible and we all know it. Not only for developer sanity, but also in terms of byte-size and thus download time.

#### 2. Classes, Pseudo-Classes, and Attributes

```html
<input type='text' class='titanic'>
```

```css
.titanic { color: puce; } /* NO */
input:focus { transform: rotate(90deg); }
[type="text"] { float: none; }
```

Classes are cool, but the attribute selector is awesome. Big fan. 10/10, would code again. Especially with the various operators you can use: starts with (`^=`), ends with (`$=`), contains (`*=`), and [more](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors). Pseudo-classes have really grown as well, which is great in my opinion. This category is less specific than IDs... by an order of magnitude. No joke, where as a single ID is worth 100 in specificity, a single class is only worth 10. These are real numbers that are calculated by the browser when deciding which CSS rules to apply to your HTML.

In other words, to override a rule using an ID, a rule using only this category would need _10 classes_ (or some combination of class, pseudo-class, or attribute selectors). For example, let's imagine you have some styles for an element with an ID and you want to override those styles later in your CSS based on some classes. To do so, you would need 10 classes (or pseudo-classes or attribute selectors):

```html
<section id='bruce-banner' class='hulk'></section>
```

```css
#bruce-banner {
  color: pink;
}
.hulk {
  color: green; /* this will NOT override the pink color above */
}
```

In order to override the `#bruce-banner` style rule we would need _10_ classes:

```html
<section id='bruce-banner' class='hulk hulkster hulkitude hulkmeister hulkinator hulkana hulksy hulko hulkenheimer hulkorama'></section>
```

```css
.hulk.hulkster.hulkitude.hulkmeister.hulkinator.hulkana.hulksy.hulko.hulkenheimer.hulkorama {
  color: green; /* whew... there we go */
}
```

#### 3. Tags and Pseudo-Elements

```html
<time>0<time>
```

```css
time { width: 1px; height: 1px; }
time::before { content: "woah" }
```

Selecting elements by tag is fine, it's just not terribly specific. This is because we all expect numerous instances of each tag name to appear on a page. As such, the browser assigns a low specificity to this category - another order of magnitude less, in fact. Each tag name or pseudo-element only registers one-tenth that of a class name. Imagine trying to override an ID selector with these alone: `html body main section article aside ol li ul li p span a screwit use !important`. (Pro-tip: be judicious when using [`!important`](https://css-tricks.com/when-using-important-is-the-right-choice/).)

#### 4. Universal Selector

You may not have heard of this category before, but it is just the `*` - which selects _anything_. It is **horribly** inefficient and I swear to [Jibbers Crabst](http://theoatmeal.com/blog/jibbers_crabst), if I catch you using the universal selector I _will_ find you... I will find you and I will not be pleased. I will give you the most disapproving look you've ever seen. ಠ_ಠ

#### What about the space, `>`, or `~`?

Things like the descendant selector (a space), direct child combinator (`>`), and the sibling combinator (`~`) are not actually selectors, they are [combinators](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors#Combinators) which combine selectors. As such, they do not affect specificity, but they _can_ significantly affect the efficiency of your CSS rendering. In fact, the descendant combinator happens to be the [_least performant of literally any other aspect of your selector_](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Writing_efficient_CSS#Avoid_the_descendant_selector.21) (see more on that below).

### How is Specificity Calculated?

Good question! Gold star for you. This is actually pretty straightforward - of course, you wouldn't know that from [reading the W3C specification](https://www.w3.org/TR/css3-selectors/#specificity). Let's make it a little more simple: you add up the number of things from each category, assigning 100 points to each item from category 1, 10 points to each item from category 2, and 1 point to each item from category 3. (Sorry category 4, no one loves you.)

Here are some example calculations:

```css
code { ... } /* specificity: 1 */
code:first { ... } /* specificity: 11 */
code:first #google { ... } /* specificity: 111 */
code:first #google::after { ... } /* specificity: 111 */
```

(Dear lord... do **not** use these selectors, they're basically the worst.)

And why does specificity matter? Because when two CSS rules conflict, the more specific selector wins, regardless of the order in which they appear in your CSS files. (Of course, this is subject to the [cascading order](https://www.w3.org/TR/CSS21/cascade.html#cascading-order) which may or may not completely wreck your Friday evening.) You may be asking how this affects efficiency: if we have two rules that essentially are the same except for specificity we're imposing extra work on the browser. Try to combine those rules if possible!

### And why do you care?

So here's why you care, or at least, why people say you should care... Increased specificity is great, but also leads to decreased efficiency (generally). For this you need to understand how the browser reads your CSS selector, which is: [from right to left](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Writing_efficient_CSS#How_the_Style_System_Matches_Rules) (mostly). The CSS rendering engines all read selectors from the most specific piece and then progress left. Let's look at an example:

```css
aside tr td.excessive > a { ... }
```

1. The CSS parser will first tokenize this selector into its constituent components;
1. then start on the right and find all anchor tags on the page (yes, really);
1. it then filters this list of elements by working its way left:  
  a. throw out any anchor tags that are not direct children of things with a class of `excessive`;  
  b. throw out any of those elements that are not also `td` elements;  
  c. have a `td` that's not inside a `tr`? Throw 'em out.  
  d. Finally, anything left that is not somehow a descendant of an `aside` is eliminated.  

Imagine doing this yourself with an HTML document you wrote. I think you'll see pretty quickly how ridiculous the processing time is. **In fact, the descendant combinator itself is the [single most expensive](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Writing_efficient_CSS#Avoid_the_descendant_selector.21)** thing you can do in a CSS selector. As such, looking at the selector above, we can increase efficiency very easily by simply reducing the number of pieces:

```css
.excessive > a { ... }
```

(The direct child combinator (`>`) is _slightly_ more efficient than the descendant combinator (a space in between pieces of a selector).)

There will always be times where you can't do this sort of simple change, but if possible, go ahead! But let me remind you of the title of this post... I only mildly care about efficiency. As I mentioned above, this selector would be made even more efficient by simply adding an `id` attribute to the anchor tag. In fact, your entire HTML and CSS setup would be more efficient if you _literally add an id to every element_ you want to to style. **Do not do that**. The fact is, that level of efficiency simply is not required.

#### But I need to make my CSS uber-efficient!

You might argue that a really intricate page that has a large number of elements, complex structure, piles of CSS rules, tons of vendor-specific _blah blah blah_... **no**. Sorry, but no. See paragraph 2 above. Your "large" page with lots of CSS is not the problem with initial render time (generally), it's your ridonkulous [sic] JavaScript.

Perhaps your argument is that you need to support emerging economies and you have people on old smart phones and laptops without much memory. Seems like a reasonable excuse, right? Consider this: in order to fully optimize the CSS rendering for best CPU and memory performance you're going to increase the page weight _**significantly**_ with all those IDs and selectors. Consider all of those ID attributes and the duplication of CSS rules within the myriad selectors you now have to add. How many of those emerging economy users are on 2G data connections... or worse? Yeah, thought so. CPU power and memory still aren't the limiting factor. I'm not saying you shouldn't consider their needs, just saying that you may want to look at other things first.

### &lt;/rant>

The bottom line here is that we as web developers compromise _constantly_. This compromise is not restricted to our JavaScript development, our CSS is necessarily included in that calculation. I highly encourage you to write more efficient CSS selectors, but I would prefer that you do so without sacrificing code readability and maintainability... at least to the extent you can.

If you're curious about the actual performance metrics, you can read this slightly older [CSS profiling blog post](http://perfectionkills.com/profiling-css-for-fun-and-profit-optimization-notes/). Slightly more recently Ben Frain ([@befrain](http://twitter/benfrain)) looked at this efficiency issue and has [some interesting metrics](https://benfrain.com/css-performance-revisited-selectors-bloat-expensive-styles/) - in particular, the _largest_ efficiency gain in his tests was, on average, 35 milliseconds across browsers. In other words, the difference between more and less efficient CSS selectors was only 35 milliseconds of rendering time on average (for desktop browsers anyway).

#### Looking for More?

Take a look at an approach called [inverted triangle CSS](https://speakerdeck.com/dafed/managing-css-projects-with-itcss). It's an interesting idea for organizing your CSS for efficiency as well as readability and maintainability. There's also a nice tool online for generating a "[specificity graph](https://jonassebastianohlsson.com/specificity-graph/)" of your CSS to see how one thing might be overriding another.

{{June 22, 2016}}

@@ development, css, efficiency
