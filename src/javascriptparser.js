import fs from 'fs';
import util from 'util';
import acorn from 'acorn';
import doctrine from 'doctrine';
import markdown from 'markdown';

export default class JavascriptParser {
  constructor(data) {
    let comments = [];

    this.ast = acorn.parse(data, {
      ecmaVersion: 6,
      onComment: (block, text, start, end) => { if(block) comments.push({block, text, start, end}) }
    });

    this.comments = comments[Symbol.iterator]();
    this.currentComment = this.comments.next();

    //console.log(util.inspect(this.ast.body, false, 5));

    //console.log(util.inspect(this.transform(this.ast.body), false, 10));

    //console.log(comments);

    let transformed = this.getJavascript(this.ast.body);

    this.imports = transformed.filter((element) => element.type == 'import');
    this.classes = transformed.filter((element) => element.type == 'export').map((element) => element.variables[0]);
  }

  getJavascript(parent){
    let result = [];
    let position = 0;

    for(let node of parent){
      switch(node.type){
        case 'ImportDeclaration':
          result.push({
            type: 'import',
            name: node.specifiers[0].id.name,
            path: node.source.value
          });
          break;
        case 'ExportDeclaration':
          Object.defineProperty(node.declaration, "export", { value: true });
          Object.defineProperty(node.declaration, "default", { value: node.default });

          result.push({
            type: 'export',
            variables: this.getJavascript([
              node.declaration
            ])
          });
          break;
        case 'ClassDeclaration':
          result.push({
            type: 'class',
            name: node.id.name,
            extends: node.superClass !== null ? node.superClass.name : null,
            comments: this.getComments(position, node.start),
            methods: this.getJavascript(node.body.body),
            isPublic: node.hasOwnProperty('export') && node.export,
            isDefault: node.hasOwnProperty('default') && node.default
          });
          break;
        case 'MethodDefinition':
          result.push({
            type: 'function',
            name: node.key.name,
            params: Array.from(node.value.params, (x) => x.name),
            comments: this.getComments(position, node.start),
            isConstructor: !node.static && node.key.name == 'constructor',
            isStatic: node.static,
            isGetter: node.hasOwnProperty('kind') && node.kind == 'get',
            isSetter: node.hasOwnProperty('kind') && node.kind == 'set',
            isGenerator: node.value.generator
          });
          break;
      }

      position = node.end;
    }

    return result;
  }

  getComments(prevEnd, nextStart) {
    if(!this.currentComment.done && prevEnd <= this.currentComment.value.start && nextStart > this.currentComment.value.end){
      let comments = doctrine.parse(this.currentComment.value.text, {
        unwrap: true,
        recoverable: true
      });

      comments.parsed = markdown.markdown.toHTML(comments.description);

      this.currentComment = this.comments.next();

      return comments;
    }else{
      return null;
    }
  }
}
