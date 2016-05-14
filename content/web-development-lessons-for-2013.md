## Web Development Lessons for 2013

Whether you are a [new](http://nashvillesoftwareschool.com/ "Nasvhille Software School") [developer](http://www.gschool.it/ "gSchool") or an experienced guru, we all need to stay up to date on our industry and it's advances. This seems to be more true every year, and with that in mind, here are some great presentations from 2012 to stir your interest (but you can find a lot more!):

**[Web Components and the Future of Web Development](http://html5-demos.appspot.com/static/webcomponents/index.html)**  
_Eric Bidelman_

Eric provides some fantastic information on a variety of topics related to web components coming up soon in HTML (although I only have the slides to go off of). Specifically he cover the HTML `<template>` tag and how existing methods of HTML templating are inefficient and fragile, and the concept of shadow DOM which essentially allows for an encapsulated node tree to be inserted at a "host" node in the actual DOM. This shadow tree can have styles scoped just to its elements (encapsulation) and web component (widget) authors can even use variable placeholders in their shadow styles to provide for themes!

The last big topic he covers are "mutation observers" which will help web component authors to properly (and efficiently) add functionality to their widgets. The difference here is that an observer is firing when the DOM changes versus when there is user interaction. This provides for much better efficiency and allows for tracking many different types of hooks.

**[The CSS of Tomorrow](https://speakerdeck.com/stopsatgreen/the-css-of-tomorrow-revised)**  
_Peter Gasston_

Peter's slides are a bit tricky to follow without the audio, but he highlights a number of very cool things coming up soon in CSS (well, relatively soon ;) ). For example, he has some examples of relative sizes ("rem" versus "em" for multi-level embedded font sizes) and widths ("vw" for "view width", as in "65vw" would be 65% of the viewport width). There are also some very exciting selectors coming in for CSS4 (some you may know if you are familiar with  [jQuery](http://api.jquery.com/category/selectors/)); I personally am excited for the parent selector (`E! > F`). You may already be familiar with media queries, but these helpful rules are getting much more useful with targeting to specific resolutions ( `@media screen and (min-width: 960px)` ) and device adaptation ( `@viewport { maximum-scale: 2; }` ).

We've also heard about grid layouts for ages, but now it seems that it may really happen in the next couple years (some browsers already support the "grid" value for "display"). Peter covers a few other gems like CSS variable pre-processing, multiple background images, the "flex" display value, and image filters. (You can see another great presentation on grid and flex layouts, CSS filters, and some other stuff in another one of Eric Bidelman's presentations: "[The Web Can Do That?](http://www.htmlfivecan.com)")

**[Re-imagining the Browser with AngularJS](https://docs.google.com/presentation/pub?id=1kDvp3O2xZ6ZSXF4F1YTbg_jy_ei2sFl38f3c6VkBfSo&amp;start=false&amp;loop=false&amp;delayms=3000)**  
_Igor Minar_

AngularJS provides some very cool features that will eventually make their way into HTML; but until then you can use this library to get some great time saving and code organizational features. In particular, Igor covers the idea of templating via data model binding through JavaScript. Imagine having a JavaScript array and whenever you add an object to it your html is updated!

```js
function PeopleController($scope) {
  $scope.people = [{name; "Jordan", title: "Minister of Awesome"}, ...] ;
}
```

```html
<ul>
  <li ng-repeat="person in people"><h3>{{name}}</h3><h4>{{title}}</h4></li>
</ul></pre>
```

Using AngularJS any time our model is updated, our HTML willbe as well! I've simplified this example (and not shown you everything), but really can be quite simple. The [AngularJS web site](http://docs.angularjs.org/) has a lot of great documentation if you want explore more!

**[Writing Testable JavaScript](https://speakerdeck.com/rmurphey/writing-testable-javascript-mocha-version)**  
_Rebecca Murphy_

Last - and possibly the most important to read since you can implement this now - is a great in-depth talk (slides) on writing your JavaScript code such that it can be tested easily (and automatically). We all do it: we write really long functions that handle _way_ too much functionality (and usually disparate types of functionality). Rebecca shows us how to take a moderately complex AJAX call with DOM updates and split it into an object oriented collection of code that can be unit and integration tested - including using fake XMLHttpRequest calls and return data. If you are serious about testing your app code, then you need to be testing your JavaScript as well. This talk will get you started down that path.

Other notable talks that I came across (seriously, you should read each one):

* **[The Mobile Web Developers Tool Belt](http://petelepage.com/presentations/2012/qcon/)** by _Pete LePage_
* **[Entschuldigen You, Parlez Vouz JavaScript?](http://i18n.asciidisco.com/)** by _Sebastian Golasch_ <span class='fine'>(Talk on internationalization, don't worry, it's in English)</span>
* **[CSS Pre-processors: Sass | Less | Styles](https://speakerdeck.com/bermonpainter/css-pre-processors-stylus-less-and-sass)** by _Bermon Painter_
* **[Responsive Web Design: Clever Tips and Techniques](https://speakerdeck.com/smashingmag/responsive-web-design-clever-tips-and-techniques)** by _Vitaly Friedman_

Of course, I'd be remiss if I were to leave out my own talk from BarCamp Nasvhille 2012 titled "[**Everything You Always Wanted to Know About the Internet, But Were Afraid to Ask.**](http://jordankasper.com/internet)" Of course, I covered all of these slides in 20 minutes, but you may want to take a bit more time to go over some of the concepts.

Have a great 2013!

{{January 7, 2013}}

@@ learning, javascript, testing, development
