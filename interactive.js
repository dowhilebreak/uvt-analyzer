const readline = require('readline');
const UvtAnalyzer = require('./index');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'uvt> '
});

function printHelp() {
    console.log('Fragment entries should be in the');
    console.log('following format:');
    console.log('    VIDEOID,FRAGMENT_START,FRAGMENT_END');
    console.log('Where FRAGMENT_START and FRAGMENT_END');
    console.log('should be in the format:');
    console.log('    hh:mm:ss.s');
    console.log('    (hours `hh:` are optional)');
    console.log('');
    console.log('Commands:');
    console.log('    help - shows this message');
    console.log('    reset - clears the input fragment buffer');
    console.log('    exit - exit this script');
    console.log('    run [start end] - analyzes the fragments entered');
    console.log('          and prints the report');
}

let content = [];

console.log('=========================================');
console.log('WELCOME TO THE UNIQUE VIEW TIME ANALYZER!');
console.log('');
printHelp();
console.log('=========================================');

console.log('Enter or paste the list of fragments to analyze:');

rl.prompt();

rl.on('line', (line) => {
    let pieces = line.split(/\s+/);
    switch (pieces[0].trim()) {
        case 'run':
            try {
                console.log('-----------------------------------------');
                UvtAnalyzer.analyze(content.join('\n'), pieces[1], pieces[2]).generateReport(true);
                console.log('-----------------------------------------');
            } catch(err) {
                console.error(err);
            }
            break;
        case 'reset':
            content = [];
            console.log('Fragment buffer emptied.');
            break;
        case 'help':
            console.log('=========================================');
            console.log('UNIQUE VIEW TIME ANALYZER - HELP');
            console.log('');
            printHelp();
            console.log('=========================================');
            break;
        case 'exit':
            rl.close();
            break;
        default:
            content.push(line.trim());
            break;
    }
    rl.prompt();
}).on('close', () => {
    console.log('Live long and prosper!');
    process.exit(0);
});