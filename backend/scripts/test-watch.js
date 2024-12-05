const { spawn } = require('child_process');
const chokidar = require('chokidar');

// Configuration
const watchPaths = [
    'src/**/*.js',
    'tests/**/*.js',
    'jest.config.js',
    'jest.integration.config.js'
];

const ignorePaths = [
    '**/node_modules/**',
    '**/coverage/**',
    '**/dist/**'
];

let testProcess = null;

function runTests() {
    // Kill existing test process if it exists
    if (testProcess) {
        testProcess.kill();
    }

    console.log('\n🔄 Running tests...\n');

    // Run both unit and integration tests
    testProcess = spawn('npm', ['run', 'test:all'], {
        stdio: 'inherit',
        shell: true
    });

    testProcess.on('error', (error) => {
        console.error('Error running tests:', error);
    });
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
        runTests();
    })
    .on('change', path => {
        console.log(`File ${path} has been changed`);
        runTests();
    })
    .on('unlink', path => {
        console.log(`File ${path} has been removed`);
        runTests();
    });

// Handle process termination
process.on('SIGINT', () => {
    if (testProcess) {
        testProcess.kill();
    }
    watcher.close();
    process.exit(0);
});
