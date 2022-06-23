var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MyLanguageServiceHost = (function () {
    function MyLanguageServiceHost() {
        var _this = this;
        this.files = {};
        this.log = function (_) {
        };
        this.trace = function (_) {
        };
        this.error = function (_) {
        };
        this.getCompilationSettings = ts.getDefaultCompilerOptions;
        this.getScriptIsOpen = function (_) { return true; };
        this.getCurrentDirectory = function () { return ""; };
        this.getDefaultLibFilename = function (_) { return "lib"; };
        this.getScriptVersion = function (fileName) { return _this.files[fileName].ver.toString(); };
        this.getScriptSnapshot = function (fileName) { return _this.files[fileName].file; };
    }
    MyLanguageServiceHost.prototype.getScriptFileNames = function () {
        var names = [];
        for (var name in this.files) {
            if (this.files.hasOwnProperty(name)) {
                names.push(name);
            }
        }
        return names;
    };
    MyLanguageServiceHost.prototype.addFile = function (fileName, body) {
        var snap = ts.ScriptSnapshot.fromString(body);
        snap.getChangeRange = function (_) { return undefined; };
        var existing = this.files[fileName];
        if (existing) {
            this.files[fileName].ver++;
            this.files[fileName].file = snap;
        }
        else {
            this.files[fileName] = { ver: 1, file: snap };
        }
    };
    return MyLanguageServiceHost;
})();
var MyCompilerHost = (function (_super) {
    __extends(MyCompilerHost, _super);
    function MyCompilerHost() {
        _super.apply(this, arguments);
        this.getCanonicalFileName = function (fileName) { return fileName; };
        this.useCaseSensitiveFileNames = function () { return true; };
        this.getNewLine = function () { return "\n"; };
    }
    MyCompilerHost.prototype.getSourceFile = function (filename, languageVersion, onError) {
        var f = this.files[filename];
        if (!f)
            return null;
        return ts.createSourceFile(filename, f.file.getText(0, f.file.getLength()), 1 /* ES5 */, f.ver.toString(), true);
    };
    MyCompilerHost.prototype.writeFile = function (filename, data, writeByteOrderMark, onError) {
    };
    return MyCompilerHost;
})(MyLanguageServiceHost);
var host = new MyCompilerHost();
var languageService = ts.createLanguageService(host, ts.createDocumentRegistry());
var dummyScriptName = "script.ts";
function init() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function (ev) {
        host.addFile("lib.d.ts", xhr.responseText);
    };
    xhr.open("GET", "/blog/nwolverson/assets/tsc/lib.d.ts.evil.txt");
    xhr.send();
}
function getCompilerOutput(text) {
    host.addFile(dummyScriptName, text);
    var output = languageService.getEmitOutput(dummyScriptName).outputFiles;
    return output && output.length > 0 ? output[0].text : "";
}
function getMatchingBracePosition(text, pos) {
    host.addFile(dummyScriptName, text);
    var braces = languageService.getBraceMatchingAtPosition(dummyScriptName, pos);
    return braces.map(function (b) { return b.start(); });
}
function getQuickInfo(text, pos) {
    host.addFile(dummyScriptName, text);
    var info = languageService.getQuickInfoAtPosition(dummyScriptName, pos);
    var text = info.displayParts.map(function (x) { return x.text; }).join("");
    return text;
}
function typeDecls(text) {
    host.addFile(dummyScriptName, text);
    var program = ts.createProgram([dummyScriptName], host.getCompilationSettings(), host);
    var typeChecker = program.getTypeChecker(true);
    var sf = program.getSourceFile(dummyScriptName);
    var decls = sf.getNamedDeclarations().map(function (nd) { return nd.symbol.name + ": " + typeChecker.typeToString(typeChecker.getTypeAtLocation(nd)); });
    return decls.join("\n");
}
function getNodes(sf) {
    var nodes = [];
    function allNodes(n) {
        ts.forEachChild(n, function (n) {
            nodes.push(n);
            allNodes(n);
            return false;
        });
    }
    ;
    allNodes(sf);
    return nodes;
}
function typeIdentifiers(text) {
    host.addFile(dummyScriptName, text);
    var program = ts.createProgram([dummyScriptName], host.getCompilationSettings(), host);
    var typeChecker = program.getTypeChecker(true);
    var sf = program.getSourceFile(dummyScriptName);
    var idNodes = getNodes(sf).filter(function (n) { return n.kind === 63 /* Identifier */; });
    var typed = idNodes.map(function (n) { return n.text + ": " + typeChecker.typeToString(typeChecker.getTypeAtLocation(n)); });
    return typed.join("\n");
}
$(function () {
    init();
    $("#ex1 button").click(function () {
        var input = $("#ex1 textarea").val();
        $("#ex1 pre").text(getCompilerOutput(input));
    });
    function highlightTextArea() {
        var input = $("#ex2 textarea").text();
        var cursorPos = this.selectionStart;
        var pos = getMatchingBracePosition(input, cursorPos);
        if (pos && pos.length == 2) {
            var sections = [input.substring(0, pos[0]), input.substring(pos[0], pos[0] + 1), input.substring(pos[0] + 1, pos[1]), input.substring(pos[1], pos[1] + 1), input.substring(pos[1] + 1)].map(function (t) { return $("<span>").text(t); });
            sections[1].addClass("bracket");
            sections[3].addClass("bracket");
            $("#highlightDiv").html("").append(sections);
        }
        else {
            $("#highlightDiv").html(input);
        }
        $("#highlightDiv").width($("#ex2 textarea").width());
        $("#highlightDiv").height($("#ex2 textarea").height());
    }
    $("#ex2 textarea").keyup(highlightTextArea);
    $("#ex2 textarea").click(highlightTextArea);
    highlightTextArea();
    $("#ex3 button").click(function () {
        var input = $("#ex3 textarea").val();
        var varName = $("#ex3 input").val();
        $("#ex3 pre").text(getQuickInfo(input, input.indexOf(varName)));
    });
    $("#ex4 button").click(function () {
        var input = $("#ex4 textarea").val();
        $("#ex4 pre").text(typeDecls(input));
    });
    $("#ex5 button").click(function () {
        var input = $("#ex5 textarea").val();
        $("#ex5 pre").text(typeIdentifiers(input));
    });
});
//# sourceMappingURL=blog.js.map
