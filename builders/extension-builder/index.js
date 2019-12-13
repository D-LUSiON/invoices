"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const build_angular_1 = require("@angular-devkit/build-angular");
const architect_1 = require("@angular-devkit/architect");
const fs = require("fs");
const operators_1 = require("rxjs/operators");
let entryPointPath;
function buildExtension(options, context, transforms = {}) {
    options.deleteOutputPath = false;
    validateOptions(options);
    const originalWebpackConfigurationFn = transforms.webpackConfiguration;
    transforms.webpackConfiguration = (config) => {
        patchWebpackConfig(config, options);
        return originalWebpackConfigurationFn ? originalWebpackConfigurationFn(config) : config;
    };
    const result = build_angular_1.executeBrowserBuilder(options, context, transforms);
    return result.pipe(operators_1.tap(() => {
        patchEntryPoint('');
    }));
}
function patchEntryPoint(contents) {
    fs.writeFileSync(entryPointPath, contents);
}
function validateOptions(options) {
    const { extensionName, modulePath } = options;
    if (!modulePath) {
        throw Error('Please define modulePath!');
    }
    if (!extensionName) {
        throw Error('Please provide extensionName!');
    }
}
function patchWebpackConfig(config, options) {
    const { extensionName, sharedLibs } = options;
    // Make sure we are producing a single bundle
    delete config.entry.polyfills;
    delete config.entry['polyfills-es5'];
    delete config.optimization.runtimeChunk;
    delete config.optimization.splitChunks;
    delete config.entry.styles;
    // config.externals = {
    //     '@angular/core': 'ng.core',
    //     '@angular/common': 'ng.common',
    //     '@angular/forms': 'ng.forms',
    //     '@angular/router': 'ng.router',
    //     rxjs: 'rxjs',
    //     tslib: 'tslib'
    //     // put here other common dependencies
    // };
    config.externals = require('../../externals.config.json');
    if (sharedLibs) {
        config.externals = [config.externals];
        const sharedLibsArr = sharedLibs.split(',');
        sharedLibsArr.forEach(sharedLibName => {
            const factoryRegexp = new RegExp(`${sharedLibName}.ngfactory$`);
            config.externals[0][sharedLibName] = sharedLibName; // define external for code
            config.externals.push((context, request, callback) => {
                if (factoryRegexp.test(request)) {
                    return callback(null, sharedLibName); // define external for factory
                }
                callback();
            });
        });
    }
    const ngCompilerExtensionInstance = config.plugins.find(x => x.constructor && x.constructor.name === 'AngularCompilerExtension');
    if (ngCompilerExtensionInstance) {
        ngCompilerExtensionInstance._entryModule = options.modulePath;
    }
    // preserve path to entry point
    // so that we can clear use it within `run` method to clear that file
    entryPointPath = config.entry.main[0];
    const [modulePath, moduleName] = options.modulePath.split('#');
    const factoryPath = `${modulePath.replace('app/', '').includes('.') ? modulePath : `${modulePath}/${modulePath}`}.ngfactory`;
    const entryPointContents = `
       export * from '${modulePath}';
       export * from '${factoryPath}';
       import { ${moduleName}NgFactory } from '${factoryPath}';
       export default ${moduleName}NgFactory;
    `;
    patchEntryPoint(entryPointContents);
    config.output.filename = `${extensionName}.js`;
    config.output.library = extensionName;
    config.output.libraryTarget = 'umd';
    // workaround to support bundle on nodejs
    config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;
}
exports.default = architect_1.createBuilder(buildExtension);