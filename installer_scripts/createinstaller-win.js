const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');
const package = require('../package.json');

getInstallerConfig()
    .then(createWindowsInstaller)
    .catch((error) => {
        console.error(error.message || error)
        process.exit(1)
    });

function getInstallerConfig() {
    console.log('creating windows installer');
    const rootPath = path.join('./');
    const outPath = path.join(rootPath, 'releases');

    return Promise.resolve({
        appDirectory: path.join(outPath, `${package.name}-win32-ia32`),
        authors: `${package.author}`,
        noMsi: true,
        outputDirectory: path.join(outPath, 'windows-installer'),
        exe: `${package.name}.exe`,
        setupExe: `${package.name.charAt(0).toUpperCase()}${package.name.substr(1)}Installer.exe`,
        setupIcon: path.join(rootPath, 'src', 'assets', 'app-icon.ico')
    });
}
