
module.exports = function(grunt) {
    
    grunt.registerMultiTask('troll', 'Troll people', function() {
        
        var name = this.data.name || this.target;
        
        grunt.verbose.writeln('Determining awesomeness...');
        
        if (this.data.awesome) {
            grunt.log.ok(name + ' is AWESOME!');
        } else {
            if (!grunt.option('force')) {
                grunt.fail.warn(name + ' is ... less than awesome.');
            } else {
                grunt.log.ok('Fine, ' + name + ' is sorta awesome.');
            }
        }
        
    });
    
};
