## Windows 8 Native JavaScript File System

I've been doing a fair amount of work on Windows 8 native applications lately, working with the `Windows` and `WinJS` JavaScript namespaces. Contrary to what a lot of people may say – including me from time to time – I have enjoyed much of that work. There are serious issues that the Microsoft team needs to work on (testing, the hamstrung webview, the structure of the syntax, etc), but it's certainly a nice direction to be headed for a core web developer like myself.

I've run into some tricky things in my work thus far, and I just wanted to put these tidbits out there for others to find, as I was not able to find suitable solutions already written myself.

### Getting a Folder From a Path

One of the issues I ran into was getting a File System object (a `StorageFolder`) from a string path. In my case, this was because I was unpacking a zip file using the [JSZip](http://stuk.github.io/jszip/) library and it returns an array of string paths for the zipped files. The problem is, if that zip has nested folders I needed to create the folder object before I could create the file. The `Windows` JavaScript namespace doesn't really have anything for doing that in one step/call... so I wrote this:

```js
/**
    * Create all subfolders in a path, returning the lowest level StorageFolder.
    * @param {String} path The path to the lowest subfolder you want a reference to (file names at the end will be removed)
    * @param {StorageFolder} rootFolder The folder to begin at for this iteration (this is a recursive function)
    * @return {Promise} Promise completes with the lowest level folder in the given path, creating subfolders along the way
    */
function getFolderFromPathRecursive (path, rootFolder) {
        // remove a possible filename from the end of the path and fix slashes
    var normalizedPath = path.replace(/\\/g, "/").replace(/\/?[^\/]+\.[^\.\/]+$/, ""),
        // get an array of the folders in the path
        folders = normalizedPath.split(/\//),
        // remove the first folder in the path as the new one to create
        subFolderName = folders.shift();
 
    return new WinJS.Promise(function (complete, error) {
        if (!subFolderName || !subFolderName.length) {
            // we're done!
            complete(rootFolder);
            return;
        }
 
        // create the next subfolder...
        rootFolder
            .createFolderAsync(subFolderName, Windows.Storage.CreationCollisionOption.openIfExists)
                .then(
                    function (folder) {
                        // now recursively call the function to create any subfolders
                        return getFolderFromPathRecursive(folders.join("/"), folder);
                    },
                    // in case something went wrong in the creation of the folder
                    error
                )
                .then(
                    function(folder) {
                        // we're done (recursively)
                        complete(folder);
                        return;
                    },
                    error
                )
    });
}
 
// An example of how to call this...
var theLowestFolder = getFolderFromPathRecursive(
    "foo/bar/bat/baz",
    Windows.Storage.ApplicationData.current.localFolder
);
console.log(theLowestFolder.name); // prints "baz"
```

### Getting File Properties

One of my other tasks was to find the oldest file in a folder and delete it. The deleting part is easy, but I also had to find the oldest file, and unfortunately, that call is a few async Promise calls deep. Also, I need to do some other processing on the set of files based on size and date modified, so I needed that info. What I ended up with was a little helper function that takes a set of files returned from the `getFilesAsync()` method (or any other way to do that) and promises a return of a simple array with the `StorageFile` objects in addition to their associated meta data (which is not readily available on the `StorageFile` object itself.

```js
function getFilesWithProperties (files) {
    var promises = [],
        filesWithProps = [];
 
    return new WinJS.Promise(function (complete, error) {
        files.forEach(function (file) {
            promises.push(
                file.getBasicPropertiesAsync().then(function (props) {
                    filesWithProps.push({
                        fileObject: file,
                        name: file.name,
                        dateModified: props.dateModified,
                        size: props.size
                    });
                })
            );
        });
 
        WinJS.Promise.join(promises).then(
            function () {
                complete(filesWithProps);
            },
            error
        );
    });
}
 
// And here's how I was getting the initial file list:
var folder = Windows.Storage.ApplicationData.current.localFolder; // (could be any StorageFolder)
var options = new Windows.Storage.Search.QueryOptions(
  Windows.Storage.Search.CommonFileQuery.orderByName,
  [".log"] // filter to only files with a ".log" extension
);
var query = folder.createFileQueryWithOptions(options);
 
query.getFilesAsync().then(function (files) {
    getFilesWithProperties(files).then(function (filesWithProps) {
        filesWithProps.forEach(function (file) {
            console.info(file.name, file.fileObject, file.dateModified, file.size);
        });
    });
});
```

Naturally, you could write a wrapper function that does some of that other busy work above, but for me, that's where the breakpoint in the work occurred so that I could reuse the functionality.

### Conclusion (of sorts)

The native Windows 8 JavaScript APIs are not terribly intuitive, and for someone coming from a strong web developer background with "vanilla" JavaScript they can be terribly annoying. That said, I have found ways to do just about everything I need to, just in a cumbersome fashion.

{{January 1, 2014}}

@@ native, windows, winjs, javascript

