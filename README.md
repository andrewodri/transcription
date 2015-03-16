[![Build Status](https://travis-ci.org/affirmix/transcription.svg)](https://travis-ci.org/affirmix/transcription) [![Coverage Status](https://coveralls.io/repos/affirmix/transcription/badge.svg)](https://coveralls.io/r/affirmix/transcription) [![Dependency Status](https://david-dm.org/affirmix/transcription.svg)](https://david-dm.org/affirmix/transcription) [![devDependency Status](https://david-dm.org/affirmix/transcription/dev-status.svg)](https://david-dm.org/affirmix/transcription#info=devDependencies) [![Gitter](https://img.shields.io/badge/gitter-join%20chat%E2%86%92-brightgreen.svg)](https://gitter.im/affirmix/transcription?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

## What is Transcription?

Transcription is an ECMAScript 6 (ES6) documentation generator designed to provide JSON, Markdown, and template driven HTML output.

## What can I expect from Transcription as development continues?

1. *Mutliple output formats*. Flexible options should provided as each project and enviorment is unique. Transcription will out JSON structures (See Dox), Markdown (See Markdox), and template driven HTML output (See JSDoc).

2. *Dynamically linked projects and classes*. One feature missing from many JavaScript documentation generators in linking to projects and classes outside of the scope of one single file. This is a feature that Transcription will aim to provide.

3. *Verify AST structures against JSDoc params*. Becuase we have a proper AST object to compare with JSDoc doclets, an analysis will be peformed to verfiy that your comments matches the elements they are describing. This will developers track down any comments that become out of date, and inconsistencies that develop.

4. *Gulp npm module*. After basic functionality has been implemented and tested, Transcription should be easy to integrate into your build system.

## How can I use Transcription?

You can see Transcription in action on your own system by following these steps: (Dependant on Git and Node.js)

1. `npm install transcription`
2. One of the following commands: (For JSON, Markdown, and HTML respectively)
  * `transcription --help`
  * `transcription -f html -i ./input -o ./output`
  * `transcription -f html -o ./output.html < ./input/controller.js`
  * `transcription -f html -o < ./input/controller.js > ./output/controller.html`
  * `transcription -f html -i ./input.html > ./output/controller.js`
