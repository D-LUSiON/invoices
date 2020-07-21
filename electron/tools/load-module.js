let loadModule;

try {
    // Export `__non_webpack_require__` in Webpack environments to make sure it doesn't bundle modules loaded via this method
    loadModule = typeof global.__non_webpack_require__ === 'function'
        ? global.__non_webpack_require__
        : eval('require');
} catch {
    // Use a noop in case both `__non_webpack_require__` and `require` does not exist
    loadModule = () => { }; // tslint:disable-line:no-empty
}

module.exports = loadModule;
