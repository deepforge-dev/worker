const {Command} = require('commander');
const program = new Command();
const {version} = require('./package.json');
const startWorker = require('webgme-executor-worker');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {promisify} = require('util');
const unlink = promisify(fs.unlink);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const childProcess = require('child_process');
const exec = promisify(childProcess.exec);

program
    .version(version)
    .option('-t, --accessToken <token>', 'Access token for an authorized user')
    .option('-c, --cache <path>', 'Path to worker cache directory', 'worker-cache')
    .option('-H, --host <url>', 'URL of DeepForge instance', 'https://editor.deepforge.org')
    .action(async cmd => {
        const {accessToken, cache, host} = cmd;
        process.env.DEEPFORGE_WORKER_CACHE = cache;

        await installWorkerDeps();
        const config = {};
        config[host] = {apiToken: accessToken};

        const configFile = path.join(os.tmpdir(), `config-${Date.now()}.json`);
        await writeFile(configFile, JSON.stringify(config));

        process.on('SIGINT', cleanUp.bind(null, configFile));
        process.on('uncaughtException', cleanUp.bind(null, configFile));

        process.argv.splice(2, process.argv.length - 2);
        process.argv.push(configFile);
        startWorker();
    });

program.parse(process.argv);

async function cleanUp(configFile) {
    try {
        await unlink(configFile);
        process.exit();
    } catch (err) {
        console.log('Unable to remove config file:', err);
        process.exit(1);
    }
}

async function installWorkerDeps() {
    const deps = await readFile(path.join(__dirname, 'worker-dependencies.txt'), 'utf8');
    const installCmd = `npm install ${deps}`;
    await exec(installCmd);
}
