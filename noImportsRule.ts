import * as ts from "typescript";
import * as Lint from "tslint";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "import statement forbidden";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    // console.log(sourceFile);
    return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
  }
}

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


class NoImportsWalker extends Lint.RuleWalker {
  public visitPropertySignature(node: ts.PropertySignature) {
    // console.log(node.type.typeName.text);
    // create a failure at the current position
    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));

    // call the base version of this visitor to actually parse this node
    super.visitPropertySignature(node);
  }
}


