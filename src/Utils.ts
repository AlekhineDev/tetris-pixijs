export var utils = {
    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}