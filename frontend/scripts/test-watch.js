const { spawn } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');

// Configuration
const watchPaths = [
    'src/**/*.{ts,tsx,js,jsx}',
    'src/**/*.test.{ts,tsx,js,jsx}',
    'jest.config.js',
    'tsconfig.json'
];

const ignorePaths = [
    '**/node_modules/**',
    '**/coverage/**',
    '**/dist/**',
    '**/build/**'
];

let testProcess = null;
let debounceTimer = null;

function runTests(changedPath = '') {
    // Kill existing test process if it exists
    if (testProcess) {
        testProcess.kill();
    }

    console.log('\n🔄 Running tests...');
    if (changedPath) {
        console.log(`Changed file: ${changedPath}\n`);
    }

    const isTestFile = changedPath.includes('.test.');
    const relatedTestFile = changedPath.replace(/\.(ts|tsx|js|jsx)$/, '.test.$1');
    
    // Determine which tests to run
    const args = ['test'];
    if (changedPath && !isTestFile) {
        // If a source file changed, try to run its corresponding test file
        args.push(relatedTestFile);
    } else if (isTestFile) {
        // If a test file changed, run just that test
        args.push(changedPath);
    }

    // Add watch mode and other options
    args.push('--watchAll=false', '--colors');

    testProcess = spawn('npm', args, {
        stdio: 'inherit',
        shell: true
    });

    testProcess.on('error', (error) => {
        console.error('Error running tests:', error);
    });

    testProcess.on('exit', (code) => {
        if (code !== 0) {
            console.log('\n❌ Tests failed');
        } else {
            console.log('\n✅ Tests passed');
        }
    });
}

// Debounced version of runTests
function debouncedRunTests(path) {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => runTests(path), 500);
}

// Initialize watcher
const watcher = chokidar.watch(watchPaths, {
    ignored: ignorePaths,
    persistent: true,
    ignoreInitial: true
});

// Watch events
watcher
    .on('ready', () => {
        console.log('👀 Watching for file changes...');
        runTests(); // Run tests initially
    })
    .on('add', path => {
        console.log(`File ${path} has been added`);
        debouncedRunTests(path);
    })
    .on('change', path => {
        console.log(`File ${path} has been changed`);
        debouncedRunTests(path);
    })
    .on('unlink', path => {
        console.log(`File ${path} has been removed`);
        debouncedRunTests(path);
    });

// Handle process termination
process.on('SIGINT', () => {
    if (testProcess) {
        testProcess.kill();
    }
    watcher.close();
    process.exit(0);
});
