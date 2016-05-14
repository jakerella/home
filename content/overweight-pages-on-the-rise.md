## Overweight Pages on the Rise

Web developers, I mean this with the utmost seriousness, we have a weight problem.

No, no... not YOU personally (well, maybe... we sit on our butts quite a bit) - I'm talking about our web sites. They're getting heavier, a LOT heavier. Year over year the top 1,000 web sites (according to Alexa ranking) have increased their page-weight about 24% * . This is according to the [HTTP Archive statistics site](http://httparchive.org/trends.php?s=Top1000&minlabel=Apr+1+2012&maxlabel=Apr+1+2013) which keeps such statistics for top 1000 and 100 web sites globally. And it's not just the number of bytes transferred, it's the number of HTTP requests made per page that has increased as well.

A lot of you may have already guessed one of the leading causes of this increase: single-page web applications.

We as developers are creating a lot of very responsive user interfaces (both in the display-size-shifting sense and the simple UI feedback times) utilizing this single-page pattern; and to a point I think this is a good thing. The problem that I see is that many of these applications are being built for mobile - an environment which traditionally (and still currently) has very limited bandwidth. In other words, we're putting our heaviest, longest-time-to-load applications on devices that typically have our lowest bandwidth capabilities.

### Caching is not a solution.

Hopefully the browser (mobile or not) is caching the immense amounts of JavaScript code that is being downloaded from the server, but how often do you change your code? As more and more shops move to agile methodologies - or even just more iterative development in general - we're going to see more and more frequent code changes. This is great in terms of our ability to respond to new feature requests, bugs, and a changing landscape; but keep in mind that your users will need to download all of that JavaScript again - even for the smallest change, regardless of caching.

### Not-so Lazy

Some folks implement a lazy-loading approach to their JavaScript files (in addition to images and HTML content). The idea is to only load the code for functionality the user will actually interact with; when they move their mouse near something with extra functionality, go get the code (and HTML, images, etc) to do that piece. Keep in mind though, that users (especially on mobile devices) are not willing to wait very long for anything.

In my opinion, the single-page application is not the best approach. I think multi-page sections are a much better alternative, allowing applications to segment code, HTML, images, and even CSS such that it can be loaded when a page in that section is needed. Sure, there will always be core functionality and styles that are needed throughout the application, but we can do better than what we have now.

&lt;/rant&gt;

<p class='footnote'>* Although the chart may suggest a larger increase, this is due to a change in testing by the HTTP Archive. You can read about the change on their site, although I found out about it via Steve Souders' blog post (and research): http://www.stevesouders.com/blog/2013/04/05/page-weight-grows-24-year-over-year-not-44/</p>

{{April 12, 2013}}

@@ development, efficiency, http
