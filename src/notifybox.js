var instance;
function Notifybox() {
    if (instance !== undefined)
        return instance;
    instance = this;

    this._defaultDuration = 2000; // [ms]
    this._interval = 25; //[ms]
    this._queue = [];
    this._body = document.body;
    this._mainFixedDiv = document.createElement("div");
    this._mainFixedDiv.className = "notifybox-fixed-div";
    this._body.appendChild(this._mainFixedDiv);
}

Notifybox.prototype.showSuccess = function (title, message, timeDuration) {
    if (timeDuration === undefined) {
        timeDuration = this._defaultDuration;
    }

    this._show('success', title, message, timeDuration);
};

Notifybox.prototype.showInfo = function (title, message, timeDuration) {
    if (timeDuration == undefined) {
        timeDuration = this._defaultDuration;
    }

    this._show('info', title, message, timeDuration);
};

Notifybox.prototype.showWarning = function (title, message, timeDuration) {
    if (timeDuration === undefined) {
        timeDuration = this._defaultDuration;
    }

    this._show('warning', title, message, timeDuration);
};

Notifybox.prototype.showError = function (title, message, timeDuration) {
    if (timeDuration === undefined) {
        timeDuration = this._defaultDuration;
    }

    this._show('error', title, message, timeDuration);
};

Notifybox.prototype._show = function (modificator, title, message, timeDuration) {
    if (message === undefined || message === '' || message === null) {
        message = modificator + ' message.';
    }
    var generatedKey = this.generateKey();

    var notificationBox = document.createElement("div");
    notificationBox.className = 'notifybox-box ' + modificator;

    var icoClose = document.createElement("div");
    icoClose.className = "notifybox-ico ico-" + modificator;
    icoClose.onclick = this._removeNotification.bind(this, generatedKey);

    var notificationBody = document.createElement("div");
    notificationBody.className = 'notifybox-body';

    var notificationTitle = document.createElement("h5");
    notificationTitle.className = "notifybox-title";
    notificationTitle.innerHTML = title;

    var notificationMessage = document.createElement("p");
    notificationMessage.innerHTML = '' + message;
    notificationMessage.className = "notifybox-message";

    notificationBox.setAttribute("id", generatedKey);
    notificationBox.appendChild(icoClose);
    notificationBody.appendChild(notificationTitle);
    notificationBody.appendChild(notificationMessage);
    notificationBox.appendChild(notificationBody);

    this._addNotificationToDocumentBody(generatedKey, notificationBox);

    setTimeout(this._removeNotification.bind(this, generatedKey), timeDuration);
};

Notifybox.prototype.generateKey = function () {
    return Date.now();
};

Notifybox.prototype._addNotificationToDocumentBody = function (key, div) {
    var slideDiv = document.createElement('div');
    slideDiv.className = 'notifybox-slide';
    slideDiv.appendChild(div);

    this._queue.push({key: key, value: slideDiv});
    this._mainFixedDiv.appendChild(slideDiv);

    var pos = -405;
    function frame() {
        if (pos >= 120) {
            clearInterval(intervalPromise);
        } else {
            pos = pos + 30;
            div.style.right = pos + '%';
        }
    }

    var intervalPromise = setInterval(frame, this._interval);
};

Notifybox.prototype._removeNotification = function (keyToRemove) {
    var toRemove = undefined;
    var queueLength = this._queue.length;

    for (var i = 0; i < queueLength; i++) {
        if (this._queue[i].key === keyToRemove) {
            toRemove = this._queue[i].value;
            this._mainFixedDiv.removeChild(toRemove);
            this._queue.splice(i, 1);
            return;
        }
    }
};
