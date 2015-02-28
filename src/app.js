import polyfill from 'babel/polyfill';

import Parser from './parser';
import Transformer from './transformer';

let code = new Parser('./controller.js');
let html = new Transformer(code);
