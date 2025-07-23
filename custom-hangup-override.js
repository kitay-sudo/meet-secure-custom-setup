APP.UI.emitEvent = (function(original) {
    return function(event, data) {
        if (event === 'hangup') {
            APP.conference.hangup();
            return;
        }
        return original.apply(this, arguments);
    };
})(APP.UI.emitEvent);