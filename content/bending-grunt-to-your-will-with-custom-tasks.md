
## Bending Grunt to Your Will with Custom Tasks


<img src='/images/grunt-logo.png' alt='Grunt logo' class='right' style='width:12em; margin-top:-2em; padding-top:0;'>
    
I've been answering a lot of [questions on Stack Overflow](http://stackoverflow.com/questions/tagged/gruntjs) lately about Grunt. I find that that tag is a little less attended to than some others given the growing popularity of the tool. I also think that I have useful knowledge and experience to share. What I've discovered is that there are a lot of people new to Grunt - but familiar with JavaScript - who aren't sure how to accomplish what they hope to. I'd like to take a few minutes to talk about [writing custom tasks](http://gruntjs.com/creating-tasks) in Grunt and how to use your existing JavaScript skills to make a better build process.


### The Nature of Grunt

This isn't an article on [how to use Grunt](http://gruntjs.com/getting-started), I'll let others take care of that for me. And as such, I'm not going to spend a lot of time on the basics of Grunt, but I do want to talk a little about what Grunt is... under the covers.

> Grunt is a series of Node modules.

This is important to know, but that doesn't mean you need to be an expert Node developer in order to use - or even build on top of - Grunt. Remember, Node is just JavaScript! Yes, there are some different structures than client-side (browser) JavaScript, but the syntax is essentially the same. Node implements a number of [ECMAScript 6 (ES6) features](http://es6rocks.com/), which is great, but you don't need to feel overwhelmed by these if you are unfamiliar. The point is: You can do this!

### How much Node do I need to learn?

Honestly, if you know JavaScript, you know quite a bit of Node already. And if you're keeping up with ES6, then you're already well ahead of the curve. The biggest thing to focus on for creating your own tasks in Grunt is how Node modules are organized, and it's dead simple:

```javascript
// my-task.js

module.exports = function(grunt) {
    
    // do some stuff with `grunt`
    
}
```

That's your basic Node module, about s easy as it gets. The important thing to understand with the code above is that we have access to a "global" variable in our file called `module` which has a property on it called `exports`. Similar to how we always have access to `window` in client-side JavaScript, you will always have access to `module` in Node. The `exports` property is just like it sounds: whatever is on that property is what will be available _outside of the module_. That is, when another bit of code `requires()` your module, the return value will be whatever is on `module.exports`.

When you include this module using Grunt's `grunt.task.loadTasks(...)` method (more on that later) Grunt will call the function returned by your module. In other words, while in Node you can place anything you want onto `module.exports`, **Node module tasks in Grunt must export a function**. Of course, what you do in that function is completely up to you.

### Why can't I just use one of the 45,729,856 existing plugins?

<span class='fine'>(Yes, that's a bit of an exaggeration.)</span>  
The short answer is: you can!

So why would you want to make your own task? Well there's the obvious: you can't find a task that does what you need. But more often I see people who need to do something a little different than what the existing plugin does. And while in most cases you could fork the plugin repository and build on top of it, in a lot of these cases that doesn't really make sense.

### Wrapping Another Task

Here's a recent example: you need to run a given task with different options for linux deployments versus osx deployments. The task itself is a common one, but doesn't have any options for doing just that. The solution is pretty easy once you understand the organization of Grunt's internal API. First of all, let's look at the config for our example task (this is the one that already exists, not our custom task):

```javascript
grunt.initConfig({
    someCommonTask: {
        options: {
            sharedoption: 'common-stuff'
        },
        linux: {
            someoption: 'linux-specific-stuff'
        },
        osx: {
            someoption: 'osx-specific-stuff'
        }
    }
});
```

In this example, we could simple run `~$ grunt someCommonTask:linux` on Linux machines, and the other target on OSX machines... but wouldn't it be nice to just be able to runa  single command from either platform? In fact, this isn't just a nicety, it could be a significant bottleneck. Consider the situation where this task is just one of many in your `build` multi-task:

```javascript
grunt.registerTask( 'build', [ 'jshint', 'sass', 'test', 'someCommonTask', 'concat', 'uglify', 'deploy', ... ] );
```

In this case, having to have two separate `build` tasks is not a good idea: you have to maintain both sets of tasks, making sure to update both. And what happens when you add Windows support? And what if a couple of the other tasks have different setups per platform?

Our simple solution creates a new task (with a new name) which does the check for us, then adds the correct task (and target) to Grunt's queue for execution (thus with the correct options)! We'll put our new task in it's own file (for portability and manageability): `tasks/osdetect.js`

```javascript
// ./tasks/osdetect.js

module.exports = function (grunt) {
    
    grunt.registerMultiTask('osdetect', 'Detect OS and run different task based on it', function() {
        if (/linux/.test(process.platform)) {
            
            grunt.task.run( ['someCommonTask:linux'] );
            
        } else if (/darwin/.test(process.platform)) { // This is what Grunt returns for OSX
            
            grunt.task.run( ['someCommonTask:osx'] );
            
        }
    });
};
```

Let's dissect this example. First, we see that the function we place on `module.exports` accepts a single argument: `grunt`. This is the Grunt API and will be provided when we load up the task in our Gruntfile.js later. Next, we have the call to [`grunt.registerMultiTask()`](http://gruntjs.com/api/grunt.task#grunt.task.registermultitask) - this is how we create a new task in Grunt. The fact that this is a "MultiTask" simply means that it can easily parse different targets. We could create a non-multi task, but we may need this later so we'll keep it in. This function accepts three arguments: the name of the new task (this is what you will use to configure it in your Gruntfile.js), a short description, and the function to call when the task is run.

The actual task function itself is pretty basic, it requires a tiny bit of Node core knowledge, but this is something you can easily find by googling: "[how to determine the OS in Node](https://www.google.com/#q=how+to+determine+the+OS+in+Node)". That leads to using `process.platform` and evaluating it using a simple regular expression (although there are other ways to do this). Finally, based on the value matched, we either "run" the `linux` or `osx` target of our common task. The word "run" is in quotes because you're not actually telling Grunt to run the task immediately. Instead, **`grunt.task.run()` [adds a new task to the queue](http://gruntjs.com/api/grunt.task#grunt.task.run)** which will be executed in turn.

To use our new task, we can add a single line to our Gruntfile.js at the bottom:

```javascript
grunt.task.loadTasks('./tasks');
```

This will [load all JavaScript files in that directory](http://gruntjs.com/api/grunt.task#grunt.task.loadtasks) as Grunt plugins. The only thing left to do is call our new task from the command line:

```bash
~/my-project$ grunt osdetect
```

### We Can Do Better

<img src='/images/not-impressed.jpg' alt='Not impressed' class='left' style='width:15em; margin-top:-0.5em; padding-top:0; padding-left:0'>

Maybe the previos example doesn't look so difficult, but that's the point! We can make custom Grunt tasks very easily. Now, what if we wanted to make our OS detection script a little more extensible? We could, for example, add some configuration to allow any number of tasks to be run and to match them against a set of os-to-task options. This will require us to use a bit more of the [Grunt API](http://gruntjs.com/api/grunt), but you won't really need to know anything else about Node specifically.





{{January 2, 2015}}

@@ javascript, grunt, build tools, node
