var gulp       = require('gulp');
var seajsCombo = require('gulp-seajs-combo'); 
var aliasCombo = require('gulp-alias-combo');
var replace    = require('gulp-replace');
var concatCss  = require('gulp-concat-css'); 
var imagemin   = require('gulp-imagemin'); 
var cleanCSS   = require('gulp-clean-css');
var uglify     = require('gulp-uglify'); 
var rev        = require('gulp-rev');
var del        = require('del');

var bracketStr = 'require(\'';
var P_modules  = '/modules';
var P_libs     = '/libs';
var P_behavior = P_modules + '/behavior';
var P_core     = P_modules + '/core';
var P_plugin   = P_modules + '/plugin';
var P_config   = P_modules + '/config';
var P_template = P_modules + '/template';
var P_build    = '/tpl';

var aliasSettings = {
    "jquery"      : P_libs   + '/js/jquery-2.1.1.min.js',
    "bootstrap_js": P_libs   + '/js/bootstrap.min.js',
    "judge"       : P_libs   + '/js/judge.min.js',
    "Database"    : P_core   + '/Database',
    "Dispatcher"  : P_core   + '/Dispatcher',
    "Eval"        : P_core   + '/Eval',
    "Serialize"   : P_core   + '/Serialize',
    "Translate"   : P_core   + '/Translate',
    "Functions"   : P_core   + '/Functions',
    "Async"       : P_core   + 'Async',
    "Attm"        : P_plugin + '/Attm',
    "Grid"        : P_plugin + '/Grid',
    "TableHeader" : P_plugin + '/TableHeader',
    "Ztree"       : P_plugin + '/Ztree',
    "BtnGroup"    : P_plugin + '/BtnGroup',
    "InputGroup"  : P_plugin + '/InputGroup',
    "Modal"       : P_plugin + '/Modal',
    "Path"        : P_plugin + '/Path',
    "Table"       : P_plugin + '/Table',
    "Tabs"        : P_plugin + '/Tabs',
    "Tips"        : P_plugin + '/Tips'
};
var pathsSettings = {
    "P_libs"      : 'libs',
    "P_modules"   : 'modules',
    "P_static"    : 'static',
    "P_behavior"  : 'behavior',
    "P_core"      : 'modules/core',
    "P_plugin"    : 'modules/plugin',
    "P_config"    : 'modules/config',
    "P_template"  : 'modules/template',
    "P_build"     : 'tpl'
};
var excludeSettings = [
    'P_libs/js/highlight',
    'P_libs/js/director.min.js',
    'P_libs/js/jquery.ztree.all.min.js',
    'jquery',
    'bootstrap_js', 
    '../template', 
    '../../template',
    'P_config/config',
    'P_config/urlConfig',
    'P_static/js/action',
    'datepick',
    'Eval',
    'P_config/config',
    'P_plugin/DemoFunction',
    'CheckFuncs'
];
var behaviorExcludeSettings = Object.keys(aliasSettings);
var coreExcludeSettings     = Object.keys(aliasSettings);
var configExcludeSettings = [
    './config', 
    './urls', 
];
var pluginExcludeSettings = [
    'Database',
    'Translate',
    'CheckFuncs',
    'Dispatcher',
    'BtnGroup',
    'InputGroup',
    'Modal',
    'Table',
    'Tips'
];
gulp.task('behavior', function() {
    return gulp.src('./modules/behavior/router/*.js')
        .pipe(aliasCombo({
            baseUrl : __dirname,
            supportRelative : true,
            alias   : aliasSettings,
            paths   : pathsSettings,
            exclude : excludeSettings.concat(behaviorExcludeSettings)
        }))
        .pipe(replace('../../template', 'template'))
        .pipe(replace('../template', 'template'))
        .pipe(uglify({
            mangle : {except :['require', 'exports', 'module', '$']},
            compress : true
        }))
        .pipe(gulp.dest('./dist/modules/behavior/router/'));
});
gulp.task('config', function(){
    return gulp.src('./modules/config/*.js')
        .pipe(aliasCombo({
            baseUrl : __dirname,
            supportRelative : true,
            alias   : aliasSettings,
            paths   : pathsSettings,
            exclude : excludeSettings.concat(configExcludeSettings)
        }))
        .pipe(replace('../../template', 'template'))
        .pipe(replace('../template', 'template'))
        .pipe(uglify({
            mangle : {except :['require', 'exports', 'module', '$']},
            compress : true
        }))
        .pipe(gulp.dest('./dist/modules/config/'));
});
gulp.task('core', function(){
    return gulp.src('./modules/core/!(Tips).js')
        .pipe(aliasCombo({
            baseUrl : __dirname,
            supportRelative : true,
            alias   : aliasSettings,
            paths   : pathsSettings,
            exclude : excludeSettings.concat(coreExcludeSettings)
        }))
        .pipe(replace('../../template', 'template'))
        .pipe(replace('../template', 'template'))
        .pipe(uglify({
            mangle : {except :['require', 'exports', 'module', '$']},
            compress : true
        }))
        .pipe(gulp.dest('./dist/modules/core/'));
});
gulp.task('entry', function(){
    return gulp.src('./modules/entry/*.js')
        .pipe(aliasCombo({
            baseUrl : __dirname,
            supportRelative : true,
            alias   : aliasSettings,
            paths   : pathsSettings,
            exclude : excludeSettings.concat(coreExcludeSettings)
        }))
        .pipe(replace('../../template', 'template'))
        .pipe(replace('../template', 'template'))
        .pipe(uglify({
            mangle : {except :['require', 'exports', 'module', '$']},
            compress : true
        }))
        .pipe(gulp.dest('./dist/modules/entry/'));
});
gulp.task('static_js', function(){
    return gulp.src('./static/js/*.js')
        .pipe(aliasCombo({
            baseUrl : __dirname,
            supportRelative : true,
            alias   : aliasSettings,
            paths   : pathsSettings,
            exclude : excludeSettings
        }))
        .pipe(replace('../../template', 'template'))
        .pipe(replace('../template', 'template'))
        .pipe(uglify({
            mangle : {except :['require', 'exports', 'module', '$']},
            compress : true
        }))
        .pipe(gulp.dest('./dist/static/js/'));
});
gulp.task('plugin', function(){
    return gulp.src('./modules/plugin/*.js')
        .pipe(aliasCombo({
            baseUrl : __dirname,
            supportRelative : true,
            alias   : aliasSettings,
            paths   : pathsSettings,
            exclude : excludeSettings.concat(pluginExcludeSettings)
        }))
        .pipe(replace('../../template', 'template'))
        .pipe(replace('../template', 'template'))
        .pipe(uglify({
            mangle : {except :['require', 'exports', 'module', '$']},
            compress : true
        }))
        .pipe(gulp.dest('./dist/modules/plugin/'));
});
gulp.task('concat_minify_js', ['behavior', 'config', 'core', 'plugin', 'entry', 'static_js'],   function(){
    console.log('js code concat and minify ok')
})
gulp.task('minify_css', function() {
    return gulp.src('static/css/*.css')
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(gulp.dest('dist/static/css/'));
});
gulp.task('minify_img', function(){
    gulp.src('static/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/static/img'))
});
gulp.task('minify_static_source', ['minify_img', 'minify_css'], function(){
    console.log('css and img minify ok')
})
gulp.task('all', ['move', 'minify_static_source', 'concat_minify_js'], function(){
    console.log('ok')
})
gulp.task('move_template', function(){
    return gulp.src('./tpl/template.js')
        .pipe(gulp.dest('./dist/tpl/'));
});
gulp.task('move_html', function(){
    return gulp.src('./*.html')
        .pipe(gulp.dest('./dist/'));
});
gulp.task('move_lang', function(){
    return gulp.src('./lang/**/*')
        .pipe(gulp.dest('./dist/lang/'));
});
gulp.task('move_libs', function(){
    return gulp.src('./libs/**/*')
        .pipe(gulp.dest('./dist/libs/'));
});
gulp.task('move_static', function(){
    return gulp.src('./static/fonts/**/*')
        .pipe(gulp.dest('./dist/static/fonts'));
});
gulp.task('move_asp', function(){
    return gulp.src('./*.asp')
        .pipe(gulp.dest('./dist/'));
});
gulp.task('move',['move_asp', 'move_static', 'move_libs', 'move_lang', 'move_html', 'move_template'], function(){
});

gulp.task('uglify_flow_js', function(){
    return gulp.src('../web_org/flow/**/*.js')
           .pipe(uglify({
                mangle : {except :['require', 'exports', 'module', '$']},
                compress : true
            }))
            .pipe(gulp.dest('./dist/flow'));
});
gulp.task('uglify_libs_js', function(){
    return gulp.src('../web_org/libs/**/*.js')
           .pipe(uglify({
                mangle : {except :['require', 'exports', 'module', '$']},
                compress : true
            }))
            .pipe(gulp.dest('./dist/libs'));
});
gulp.task('uglify_lang_js', function(){
    return gulp.src('../web_org/lang/**/*.js')
           .pipe(uglify({
                mangle : {except :['require', 'exports', 'module', '$']},
                compress : true
            }))
            .pipe(gulp.dest('./dist/lang'));
});
gulp.task('uglify_modules_js', function(){
    return gulp.src('../web_org/modules/**/*.js')
           .pipe(uglify({
                mangle : {except :['require', 'exports', 'module', '$']},
                compress : true
            }))
            .pipe(gulp.dest('./dist/modules'));
});
gulp.task('uglify_static_js', function(){
    return gulp.src('../web_org/static/**/*.js')
           .pipe(uglify({
                mangle : {except :['require', 'exports', 'module', '$']},
                compress : true
            }))
            .pipe(gulp.dest('./dist/static'));
});
gulp.task('uglify_tpl_js', function(){
    return gulp.src('../web_org/tpl/**/*.js')
           .pipe(uglify({
                mangle : {except :['require', 'exports', 'module', '$']},
                compress : true
            }))
            .pipe(gulp.dest('./dist/tpl'));
});
gulp.task('uglify_notice_js', function(){
    return gulp.src('../web_org/notice/**/*.js')
           .pipe(uglify({
                mangle : {except :['require', 'exports', 'module', '$']},
                compress : true
            }))
            .pipe(gulp.dest('./dist/notice'));
});
gulp.task(
    'uglify_js', 
    ['uglify_flow_js', 
    'uglify_libs_js', 
    'uglify_lang_js',
    'uglify_modules_js',
    'uglify_static_js',
    'uglify_tpl_js',
    'uglify_notice_js'], 
    function(){
         console.log('js uglify')
});
gulp.task('html', function(){
    return gulp.src('../web_org/**/*.html')
           .pipe(gulp.dest('./dist/'))
});
gulp.task('flow_css', function(){
    return gulp.src('../web_org/flow/**/*.css')
           .pipe(cleanCSS({debug: true}, function(details) {
            }))
           .pipe(gulp.dest('./dist/flow'))
});
gulp.task('notice_css', function(){
    return gulp.src('../web_org/notice/**/*.css')
           .pipe(cleanCSS({debug: true}, function(details) {
            }))
           .pipe(gulp.dest('./dist/notice'))
});
gulp.task('static_css', function(){
    return gulp.src('../web_org/static/**/*.css')
           .pipe(cleanCSS({debug: true}, function(details) {
            }))
           .pipe(gulp.dest('./dist/static'))
});
gulp.task('libs_css', function(){
    return gulp.src('../web_org/libs/**/*.css')
           .pipe(cleanCSS({debug: true}, function(details) {
            }))
           .pipe(gulp.dest('./dist/libs'))
});
gulp.task(
    'css',
    ['flow_css',
    'notice_css',
    'static_css',
    'libs_css'],
    function(){
        console.log('css')
    }
);
gulp.task('minify_img', function(){
    gulp.src('../web_org/static/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/static/img'))
});
gulp.task('svg', function(){
    gulp.src('../web_org/**/*.svg')
        .pipe(gulp.dest('./dist/'))
})
gulp.task('fonts', function(){
    gulp.src(['../web_org/**/*.eot', '../web_org/**/*.ttf', '../web_org/**/*.woff'])
        .pipe(gulp.dest('./dist/'))
});
gulp.task(
    'prod',
    ['uglify_js',
    'html',
    'css',
    'minify_img',
    'svg',
    'fonts'],
    function(cb){
        del([
            'dist/docs',
            'dist/node_modules',
            'dist/src'
        ], cb);
    }
);





