# Unique View Time Analyzer

This is a library that receives a CSV-style text input and analyzes the contained time stamps to find the total
"unique view time" (UVT) of user engagement.  

# Setup

This project requires Node and NPM...

Node can be downloaded from the project's homepage: 
https://nodejs.org/ (the site was built against Node 11.13.0).

Using a command prompt, navigate to the folder where you forked the project and run:

```
npm install
```

This should add all needed dependencies, but pay attention for 
any global peer dependencies that may require manual intervention.

Once finished (it may take a few moments), run `npm test` to verify the install.


# Scripts

In the project directory, you can run:

### `npm test`

Runs the Jest (https://jestjs.io/) tests for the project.

### `npm start`

An alias for: `node ./interactive.js`

Starts a very basic CLI that accepts CSV-style lines of text containing fragment data. Lines should be in the following
format:

`VIDEOID,FRAGMENT_START,FRAGMENT_END[,USERID]`

Where:
  - `VIDEOID` is an arbitrary string identifying a particular video. (_Note: character escaping is not supported so commas
  and newlines will cause unexpected behavior._)
  - `FRAGMENT_START` and `FRAGMENT_END` are timestamps in the format: `[hh:]mm:ss.s`. Hours (`hh:`) are optional.
    - _Experimental: Raw millisecond integers (e.g. '1365350' instead of '00:22:45.350') are also accepted._
  - `USERID` is an optional arbitrary string identifying a user.
  
 Calculations are organized by `USERID` > `VIDEOID` and UVT will be reported independently for each combination encountered.
 
 ##### CLI Commands
 
The CLI exposes the following basic commands:
  - `help`: shows the help text
  - `reset`: clears the fragment buffer
  - `exit`: quits the CLI
  - `run`: analyzes the contents of the fragment buffer and prints a textual report of the findings.

# Example Usage

#### Analyze input and write the report to the console

```javascript
const Analyzer = require('./index');
const input = `
    video1,11:04.264,21:02.101,test
    video1,12:00.847,18:01.270,test
    video1,13:57.719,22:20.350,test
`; /* expected UVT = 676086 */

Analyzer.analyze(input).generateReport(true);

/* 
Outputs:
user: test
    video: video1
        UVT: 676086
 */
```

This is equivalent to:

```javascript
let analyzer = new Analyzer(input);
analyzer.generateReport(true);
```

# API
(Such as it is)

The main class `UniqueViewTimeAnalyzer` exposes a few functions that may be useful, but this is basically a single-purpose 
implementation:

### `parseInput(input)`
  - `@param input`: accepts a string containing CSV-style fragment information.
  - `@returns`: an array of parsed `UserInteraction`s.
  
### `generateReport(echo = false)`
  - `@param echo = false`: if `true` will automatically write the results of the report to the console.
  - `@returns`: an array containing the textual report values. Normal usage would be to `.join('\n')` for logging.
  
### `runAnalysis()`
  - `@returns`: processes the parsed fragment information and returns the current class instance. This is automatically 
  called by `UniqueViewTimeAnalyzer.analyze(input)`.

### `analysis`
  - `@returns`: property that returns the last analysis object. If an analysis has not yet been run it will execute 
  `runAnalysis()`.
  
### `interactions`
  - `@returns`: property that returns the interactions array. Of limited use unless you need to investigate 
  individual findings.


# Copyright and Licensing

Copyright (c) 2019, Jacob Anderson (dowhilebreak) - free to use under the MIT license. 