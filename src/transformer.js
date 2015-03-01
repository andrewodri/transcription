import fs from 'fs';
import jade from 'jade';

export default class Transformer {
  constructor(data) {
    let template = jade.compileFile('./template.jade');

    fs.writeFileSync('./template.html', template({data: data[0][0]}));

    console.log(template({data: data[0][0]}));
  }
}
