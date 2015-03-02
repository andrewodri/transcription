## What is Transcription?

Transcription is an ECMAScript 6 (ES6) documentation generator designed to provide JSON, Markdown, and template driven HTML output.

## What can I expect from Transcription as development continues?

1. *Mutliple output formats*. Flexible options should provided as each project and enviorment is unique. Transcription will out JSON structures (See Dox), Markdown (See Markdox), and template driven HTML output (See JSDoc).

2. *Dynamically linked projects and classes*. One feature missing from many JavaScript documentation generators in linking to projects and classes outside of the scope of one single file. This is a feature that Transcription will aim to provide.

3. *Gulp npm module*. After basic functionality has been implemented and tested, Transcription should be easy to integrate into your build system.

## How can I use Transcription?

You can see Transcription in action on your own system by following these steps: (Dependant on Git and Node.js)

1. `git clone https://github.com/affirmix/transcription.git`
2. `cd transcription`
3. `npm install`
4. `gulp`
5. One of the following commands: (For JSON, Markdown, and HTML respectively)
  * `node dist/app.js controller.js -f json -o output.json`
  * `node dist/app.js controller.js -f md -o output.md`
  * `node dist/app.js controller.js -f html -t template.jade -o output.html`
