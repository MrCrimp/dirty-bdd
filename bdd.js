var should = chai.should(),
    ourJsEnv,
    head = document.getElementsByTagName("head")[0],
    givenDir = 'given';

function dependencyIsLoaded(contextName) {
    return window.hasOwnProperty(contextName) && typeof window[contextName] == "function";
}

function createScriptReference(contextName) {
    var script = document.createElement("script");
    var baseUri = document.getElementsByTagName("script")[document.getElementsByTagName("script").length - 1].src;
    baseUri = baseUri.substring(0, baseUri.lastIndexOf("/"));
    script.type = "text/javascript";
    script.src = baseUri + '/' + givenDir + '/' + contextName + '.js?t=' + new Date().getTime();
    return script;
}

beforeEach(function () {
    should = chai.should();
});

scenario = function (t, fn) {
    ourJsEnv = jasmine.getEnv().describe('scenario => ' + t, fn);
};

feature = function (t, fn) {
    ourJsEnv = jasmine.getEnv().describe('feature ' + t, fn);
};

given = function (contextName, content) {
    var self = this;
    contextName = contextName.split(" ").join("_");
    if (dependencyIsLoaded(contextName)) return;
    
    var script = createScriptReference(contextName);
    script.onload = function () {
        if (dependencyIsLoaded(contextName)) {
            var context = new window[contextName]();
            content.apply(context);
        } else {
            throw Error('bdd.js - unable to dynamically load script');
        }
    };
    head.appendChild(script);
};

when = function (t, fn) {
    jasmine.getEnv().describe('when ' + t, fn);
    ourJsEnv = jasmine.getEnv();
};

then = function (t, fn) {
    jasmine.getEnv().currentSuite.env.it(t, fn);
};
