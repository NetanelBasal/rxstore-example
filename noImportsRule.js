"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Lint = require("tslint");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        // console.log(sourceFile);
        return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.FAILURE_STRING = "import statement forbidden";
exports.Rule = Rule;
// class NoImportsWalker extends Lint.RuleWalker {
//   public visitPropertyDeclaration(node: ts.PropertyDeclaration) {
//     console.log(node.type);
//     // console.log(node.type.typeName.text);
//     // create a failure at the current position
//     this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
//
//     // call the base version of this visitor to actually parse this node
//     super.visitPropertyDeclaration(node);
//   }
// }
var NoImportsWalker = (function (_super) {
    __extends(NoImportsWalker, _super);
    function NoImportsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoImportsWalker.prototype.visitPropertySignature = function (node) {
        // console.log(node.type.typeName.text);
        // create a failure at the current position
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        // call the base version of this visitor to actually parse this node
        _super.prototype.visitPropertySignature.call(this, node);
    };
    return NoImportsWalker;
}(Lint.RuleWalker));
