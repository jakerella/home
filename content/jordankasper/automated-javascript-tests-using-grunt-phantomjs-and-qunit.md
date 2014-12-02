## Automated JavaScript Tests Using Grunt, Phantomjs, and QUnit

Many developers and development shops have embraced testing in their server side code - either using a <acronym title='Test Driven Development'>TDD</acronym> model, or sometimes just with unit or functional tests created on the fly - but very few developers I talk to test their front end code beyond eyeballing it in a few browsers (or if they're lucky, with a service like [BrowserStack](http://www.browserstack.com)). And even fewer of those use any kind of automation. In this post I'm going to try and help out that majority of you who aren't testing - or maybe just aren't automating.

Lately I've been converting a number of [my jQuery plugins](http://jordankasper.com/jquery) over to Github - something the new [jQuery plugin site is requiring](http://plugins.jquery.com/docs/publish/) - and while doing so I'm refactoring and adding tests with [QUnit](http://qunitjs.com) (created by the same folks that write the jQuery core). I realized pretty quickly that having to go to the browser, hard refresh, and then run the tests again after every change was a time killer, but I didn't want to write a whole bunch of tests and then go check the results, otherwise I could be tracking down bugs (in my code and the tests) for days. Instead I set up some automated testing using Grunt, PhantomJS, and a couple Grunt plugins. Here's how.

### The Setup

First things first, you'll need to install the [Node](http://nodejs.org) (we'll be using the [Node Package Manager](https://npmjs.org), a.k.a. "npm", specifically) and [Grunt](http://gruntjs.com). These examples are from my Ubuntu Linux machine, but the code is pretty similar for Windows or Mac (but consult the links above for details).

```bash
~$ sudo apt-get install nodejs
 
~$ sudo npm install -g grunt-cli
```

<em>Two Notes: (1) The "-g" makes Grunt install globally versus just within this project, and (2) I had some issues with having an older version of Nodejs, so I installed a [Node version manager](https://github.com/visionmedia/n) through `npm` after this and switched to a more current version of Nodejs.</em>

We'll also need QUnit, which is a simple JavaScript library you can drop into your testing directory in your project. Below is what my project structure looks like for a jQuery plugin. Of course, yours will be different, but there are a few things that will be required to be in specific places (I'll let you know where).

```text
└ project
  ├ src   // plugin source, project files, etc (could be diff for you)
  ├ tests // we'll be working in here mostly
  │ ├ lib
  │ │ ├ jquery-1.x.x.min.js // if you need it (QUnit doesn't)
  │ │ ├ qunit-1.10.0.js
  │ │ └ qunit-1.10.0.css
  │ ├ index.html  // our QUnit test specification
  │ └ tests.js    // your tests (could be split into multiple files)
  ├ Gruntfile.js  // you'll create this, we'll get to it shortly
  ├ package.json  // to specify our project dependencies
  └ ...
```

Okay, so this first thing you need to create is the "package.json" file in your root directory. This is a standard for Node.js projects, but npm uses it to see what dependencies exist and what to install. If you're not creating a Node.js project, then this file can be very minimal. Here's mine for a jQuery plugin project:

```json
{
  "name": "projectName",
  "version": "1.0.0",
  "devDependencies": {
    "grunt": "~0.4.1",
    "grunt-contrib-qunit": ">=0.2.1",
    "grunt-contrib-watch": ">=0.3.1"
  }
}
```

What's important here are the "devDependencies", which specify what npm needs to install for this project. I've included two [Grunt plugins](http://gruntjs.com/plugins) which I found useful. The "[qunit](https://github.com/gruntjs/grunt-contrib-qunit)" one is obvious, but the "[watch](https://npmjs.org/package/grunt-contrib-watch)" plugin allows our tests to run any time a specified file is changed, without us having to manually re-run the tests! Now head back to your command line, navigate to the root directory of the project and run this:

```bash
~$ npm install
```

Node will go find the correct packages and put them into a "node_modules" directory. So why not just download the packages manually and put them in your project? For one, if you have multiple developers, then this method will allow any new developer to get up and running quickly, without you having to have the test libraries in your source control. On that note, you might want to add "node_modules/" to your .gitignore file!

### Grunt Runner

In order to get Grunt ready to run we need to create (and fill in) our Gruntfile, which tells Grunt many things about the tasks we want to execute. The basic structure is simple:

```js
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), // the package file to use
 
    taskName: { // internal task or name of a plugin (like "qunit")
      // options, etc (see the task/plugin for details)
    },
    ...
  });
  // load up your plugins
  grunt.loadNpmTasks('grunt-contrib-pluginName');
  // register one or more task lists (you should ALWAYS have a "default" task list)
  grunt.registerTask('default', ['taskToRun']);
  grunt.registerTask('taskName', ['taskToRun', 'anotherTask']);
};
```

Of course, we need to fill this in, we'll start with the ["qunit" task](https://github.com/gruntjs/grunt-contrib-qunit), which is pretty easy: simple replace the "taskName" in our initConfig call with this:

```js
// ...

    qunit: {
      all: ['tests/*.html']
    }

// ...
```

This defines the "qunit" task in Grunt and tells the qunit plugin to execute all tests found in any .html file in the "tests" folder. But we also need to load the plugin and we should go ahead and make it the lone default task:

```js
// ...

grunt.loadNpmTasks('grunt-contrib-qunit');
// ...

grunt.registerTask('default', ['qunit']);
```

### Creating Your Tests

At this point Grunt is ready (although we haven't done the "watch" task yet, we'll get to it later); now it's time to create some QUnit tests. I won't get into too much detail on actually writing your tests, instead I'll point you to the [QUnit Cookbook](http://qunitjs.com/cookbook/) which has some good examples. So let's talk about setting up QUnit in the first place. Hopefully you have already downloaded the library and put it in the "tests/lib/" folder (like the folder structure above). Now create an "index.html" file in your "tests/" folder and make it look like this:

```html
<!doctype html>
<html>
  <head>
      <meta charset='UTF-8' />
      <meta http-equiv='content-type' content='text/html; charset=utf-8' />
 
      <title>jQuery.simpleFAQ QUnit Test Runner</title>
 
      <link rel='stylesheet' href='lib/qunit-1.10.0.css'>
 
      <!-- add any external libraries your code needs -->
      <script src='lib/jquery-1.7.2.min.js'></script>
 
      <script src='../src/your.project.code.js'></script>
      <!-- add any JS files under test (or put them in different .html files) -->
 
      <script src='lib/qunit-1.10.0.js'></script>
 
      <!-- your tests, any and all to run with the given fixtures below -->
      <script src='tests.js'></script>
 
  </head>
  <body>
    <div id="qunit"></div> <!-- QUnit fills this with results, etc -->
    <div id='qunit-fixture'>
 
      <!-- any HTML you want to be present in each test (will be reset for each test) -->
 
    </div>
  </body>
</html>
```

Great, now we need to write some tests. Create a "test.js" file, also in your "tests/" folder. QUnit tests are pretty easy to write, first we'll create a test "module" - which is just an organizational structure, and has no bearing on your tests running - and one simple test:

```js
module("Basic Tests");
 
test("truthy", function() {
  ok(true, "true is truthy");
  equal(1, true, "1 is truthy");
  notEqual(0, true, "0 is NOT truthy");
});
```

Of course, you'll want to put your actual tests in here. You can reference any elements you put in your "qunit-fixture" div (see the html above) and it will be [reset for each test](http://qunitjs.com/cookbook/#keeping-tests-atomic). To run the tests you *could* go to http://localhost/path/to/project/tests/index.html and see the results... but we want to run these automatically - and that means without having to open a browser. This can be accomplished with [PhantomJS](http://phantomjs.org).

### Headless ~~Horseman~~ Browser

To set up PhantomJS I used npm, it was quite easy:

```bash
~$ npm install -g phantomjs
```

PhantomJS has a lot of options, but I can' get into them now... mostly because I don't know a tenth of them. :) I recommend checking out their [Wiki on Github](https://github.com/ariya/phantomjs/wiki) which is quite flushed out. For our purposes, we'll just use all of the defaults.

We should be ready to run our tests now, so navigate to your project directory and run Grunt!

```bash
~$ cd /path/to/project/root/
 
~$ grunt
Running "qunit:all" (qunit) task
Testing tests/index.html..............OK
>> 3 assertions passed (10ms)
 
Done, without errors.
```

Hopefully you see the output above. So what happened? You told grunt to run, but didn't specify a task, so Grunt ran the "default" task, which if you recall, runs the "qunit" task. The QUnit plugin for Grunt runs a headless browser through PhantomJS, loading your test html file and executing the JavaScript therein, then the plugin reports back to Grunt with the output of the QUnit test runner.

As an aside, you could have also run: "grunt qunit" which specifies to grunt that you only want to run the "qunit" task by itself (and nothing else).

### Who Watches the Watchers?

I told you earlier that you wouldn't have to reload a browser every time you wanted to run your tests, and that those tests would run any time you change something... let's make that happen.

The first step is to alter your Gruntfile. We're going to add a new task. Remember how our "package.json" specified a second "grunt-contrib" file? Yep, that one.

```js
grunt.initConfig({
  // ...

  watch: {
    files: ['tests/*.js', 'tests/*.html', 'src/*.js'],
    tasks: ['qunit']
  }
});

// ...

grunt.loadNpmTasks('grunt-contrib-watch');
```

So we added options for another task: "watch" - it states that we want to watch certain files (our tests, our test fixtures in the html files, and our source javascript) and that when any of those change (or when new files are added or existing files deleted) run certain tasks - in our case "qunit".

That's pretty much it! Head back to your command line and instead of running the "qunit" task directly, run the "watch" task and then go change your test file (just tweak it, or add a test) and watch all of the tests run in your command line console!

```bash
~$ grunt watch
Running "watch" task
Waiting...OK
>> File "tests/index.html" changed.
Running "qunit:all" (qunit) task
Testing tests/index.html..............OK
>> 3 assertions passed (10ms)
 
Done, without errors.
 
Completed in 0.771s at Sun Apr 21 2013 11:44:29 GMT-0500 (CDT) - Waiting...
```

Notice that Grunt waits for something to change, sees the change and runs the "qunit" task, which runs our tests and reports the results, then Grunt returns to a "Watiing..." state! You can leave this window up and running, work on your code or tests, and almost instantly see the results without having to pause and go refresh (or start up) a browser.

Hope you enjoyed the tutorial, let me know if you have questions, corrections, or improvements!

{{April 21, 2013}}

@@ javascript, testing, qunit, phantomjs, grunt, automation
