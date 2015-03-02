import fs from 'fs';
import jade from 'jade';

export default class HtmlTransformer {
  constructor(data, htmlFile, jadeFile) {
    let template = jade.compileFile(jadeFile);

    fs.writeFileSync(htmlFile, template({data: data[0][0]}));

    //console.log(template({data: data[0][0]}));
  }
}
