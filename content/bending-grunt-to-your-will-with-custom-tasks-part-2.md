
## Bending Grunt to Your Will with Custom Tasks, Part 2


<img src='/images/grunt-logo.png' alt='Grunt logo' class='right' style='width:12em; margin-top:-2em; padding-top:0;'>
    
This is Part Two of a series on custom Grunt tasks. Have you [read Part One](/bending-grunt-to-your-will-with-custom-tasks-part-1)?

As I mentioned last time, I've been answering a lot of [questions on Stack Overflow](http://stackoverflow.com/questions/tagged/gruntjs) about Grunt lately. What I've discovered is that there are a lot of people new to Grunt - but familiar with JavaScript - who aren't sure how to accomplish what they hope to. In Part Two of this series I'm going to take our custom tasks further and show you some of the other aspects of [Grunt API](http://gruntjs.com/api/grunt) and some tips for writing better tasks.

### What We Have So Far

Last time we created a simple Node module to detect the operating system and run a different task (and target) depending on that value:

```javascript
// ./tasks/osdetect.js
    
module.exports = function (grunt) {

    grunt.registerMultiTask('osdetect', 'Detect OS and run different task based on it', function() {
        if (/linux/.test(process.platform)) {
            grunt.task.run( ['someCommonTask:linux'] );

        } else if (/darwin/.test(process.platform)) { // This is what Node returns for OSX
            grunt.task.run( ['someCommonTask:osx'] );

        }
    });
};
```

Then we loaded that Node module as a task in our Gruntfile.js:

```javascript
grunt.task.loadTasks('./tasks');
```

### We can make it better, stronger. We have the technology.

The example above looks pretty simple, but that's the point! We can make custom Grunt tasks very easily. Let's expand on that solution to make our OS detection script a little more extensible. We'll first allow for some configuration to specify any number of tasks to be run and to match them against an os-to-task mapping option. This will require us to use a bit more of the [Grunt API](http://gruntjs.com/api/grunt).

Accessing the configuration data from within our task is extremely easy, we simply use the `grunt.config()` method and specify our task name:

```javascript
grunt.registerMultiTask('osdetect', 'Detect OS and run different task based on it', function() {
    // This will get our new "task map"
    var tasks = grunt.config('osdetect').taskMap;
    
    // Now let's use it:
    if (/linux/.test(process.platform) && tasks.linux) {
        grunt.task.run( tasks.linux );
        
    } else if (/darwin/.test(process.platform) && tasks.osx) {
        grunt.task.run( tasks.linux );
    }
});
```

Now in our Gruntfile.js we simply add the config block:

```javascript
grunt.initConfig({
    osdetect: {
        taskMap: {
            'linux': ['someCommonTask:linux'],
            'osx': ['someCommonTask:osx', 'someOtherTask:osx']
        }
    }
});
```

Notice that we're simply getting the configuration object from Grunt's config API, then digging down to the `taskMap` member. Then it's simply a matter of matching the OS name in that object and passing the task array into Grunt's `run()` method. We may also want to add some audits in there to make sure the tasks are either strings or arrays (nothing else is allowed in the `run()` method):

```javascript
grunt.registerMultiTask('osdetect', 'Detect OS and run different task based on it', function() {
    // This will get our new "task map"
    var tasks = grunt.config('osdetect').taskMap;
    
    // Now let's use it:
    if (/linux/.test(process.platform) && tasks.linux) {
        if (!tasks.linux) {
            grunt.fail.warn('Uh oh, there were no tasks specified for this OS!');
        } else if (typeof tasks.linux !== 'string' || !(tasks.linux instanceof Array)) {
            grunt.fail.fatal('Tasks for an OS must either be a string or Array of strings.');
        }
        
        grunt.task.run( tasks.linux );
        
    } // ...
});
```

You can see that we've accessed another piece of the Grunt API: `grunt.fail`. This API allows us to force the task to fail with a given message. Note that in our first case we use `grunt.fail.warn()` which will print the given message (in yellow) and inform the user that they can force the task to keep going with `--force`. The second failure, however, uses the `fatal()` method which will force a complete stop and not allow the user to "force" their way past it.

In addition to these failures, we can also add simple log messages anywhere we like:

```javascript
grunt.log.writeln('Starting up the osdetect task!');

grunt.verbose.writeln('This message will only print when using --verbose');

grunt.log.ok('The osdetect task completed successfully!');
```

### Stay on Target

<img src='/images/stay-on-target.jpg' alt='Stay on target' class='right' style='width:20em; margin-top:-0.5em; padding-top:0;'>

We talked about being able to use multiple targets with Grunt's `registerMultiTask()` method versus the simple `registerTask()` method, but in our example above we just grabbed the `taskMap` option straight off of the task configuration object, not a target. Since we're using the `registerMultiTask()` method we can actually access all of the target-specific config data using `this.data`:

```javascript
grunt.registerMultiTask('osdetect', 'Detect OS and run different task based on it', function() {
    // This will get our new "task map"
    var tasks = this.data.taskMap;
    
    // ...
});
```

Notice how we use `this` within the task function. In the example above we get access to the `target` via the `this` object. We can access a number of other pieces of information from that context, but first we need to change the task configuration in our Gruntfile.js:

```javascript
grunt.initConfig({
    osdetect: {
        common: {
            taskMap: {
                'linux': ['someCommonTask:linux'],
                'osx': ['someCommonTask:osx', 'someOtherTask:osx']
            }
        }
    }
});
```

In the config block above we've added `common` as the target, and we could add other targets as well. Our task function (the one we use when we call `grunt.registerMultiTask(...)`) _will be called for each of our targets separately_ using a different context object (`this` inside the method). That object will include more than just the name of the current target, for example, any command line options.

```bash
~/my-rpoject$ grunt osdetect:common --foobar=batbaz
```

```javascript
grunt.registerMultiTask('osdetect', 'Detect OS and run different task based on it', function() {
    
    // Get the value of the "foobar" command line option or use a default:
    
    var foobar = grunt.option('foobar'); // foobar here will equal "batbaz"
    
    // ...
});
```

### Working with Files

The last topic I want to cover in this article is working with the filesystem in a Grunt task. For most things you may want to do in your custom task you will need to include some other [Node modules](https://github.com/rogerwang/node-webkit/wiki/Using-Node-modules), but this isn't an article on using Node, so I'm going to leave that for another day. Instead, I want to talk about reading and writing and generally working with files in Grunt because there is an easy to use [file API built into it](http://gruntjs.com/api/grunt.file) for just this purpose.

To start, let's read a simple JSON file. Let's assume that your task needs to read a simple JSON file with some extra config data in it. This is actually what happens with some tasks like JSHint, which reads in the `.jshintrc` file:

```javascript
grunt.registerMultiTask('filereader', 'Example task', function() {
    
    var data = grunt.file.readJSON('./config/data.json');
    
});
```

That's it! Note that this is a synchronous function, so there is no need for a callback function. Also, it's important to know where the file needs to be located! Since the current working directory (cwd) is the project root (where Gruntfile.js lives) you must specify any path beyond that. In our example we're expected that file to be in the `/config/` directory. Of course, you could ask the user to tell you exactly where that file is located in a task option.

Lastly, if you need to read a non-JSON formatted file, simply leave off the `JSON` bit at the end!

```javascript
grunt.registerMultiTask('filereader', 'Example task', function() {
    
    var sourceFile = grunt.file.read('./src/js/app.js');
    
    // do whatever you need to with the `sourceFile` string!
    
});
```

Writing a new file is just as easy! Many tasks that perform actions like concatentation, compilation, or string replacement need to do this. We simply use the `write()` method instead of read:

```javascript
grunt.registerMultiTask('filereader', 'Example task', function() {
    
    var wasWritten = grunt.file.write('./build/output.js', 'foobar() {}');
    
    if (wasWritten) {
        grunt.log.ok('Output successful!');
    }
    
});
```

### Expanding File Patterns

Our last topic will be getting a list of files from the user's configuration. This is a pretty common necessity: the user wants to specify a globbing pattern to match multiple files in their configuration. Let's take a look at a simple example configuration:

```javascript
grunt.initConfig({
    foobar: {
        basic:
            files: {
                src: 'js/**/*.js',
                cwd: './src'
            }
        }
    }
});
```

In the config object above, it's clear that the user wants the task to look inside the `/src` directory, then find all `*.js` files from the `/js` directory or any subdirectory therein. The Grunt file API makes it very easy to get an array of all matching files:

```javascript
grunt.registerMultiTask('filereader', 'Example task', function() {
    
    var fileList = grunt.file.expand(this.data.files, this.data.files.src);
    
    fileList.forEach(function(file) {
        // do something with `file`
    });
    
});
```

The `grunt.file.expand()` method let's us take a source directory (including [globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns)) and find all matching files. The first argument is actually the options for the search, and the second argument is the source path. Hopefully you can see that we can use this method in many different ways to find any files we need to, read them, and then perform any actions necessary!

### Go Forth!

Hopefully you've been able to show you that creating a custom Grunt task can be quite easy, and yet very extensible and powerful. You should never feel constrained by a pre-made task, nor should you feel that you need to restrict yourself to what that task can do. And let's not reinvent the wheel here, make use of [what is already out there](http://gruntjs.com/plugins), and build on top of it... or better yet, contribute to it!

I hope you've gotten a lot out of these [two posts](/bending-grunt-to-your-will-with-custom-tasks-part-1)! Now go forth and create! And let's keep the conversation going in the comments below.

### Have you read [Part One](/bending-grunt-to-your-will-with-custom-tasks-part-1)?

{{January 5, 2015}}

@@ javascript, grunt, build tools, node

