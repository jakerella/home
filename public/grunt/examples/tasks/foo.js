
module.exports = function(grunt) {
    
    grunt.registerMultiTask('troll', 'Troll people', function() {
        var name = this.data.name || this.target;
        
        if (this.data.awesome) {
            grunt.log.writeln(name + ' is AWESOME!');
        } else {
            grunt.log.writeln(name + ' is ... less than awesome.');
        }
    });
    
};
