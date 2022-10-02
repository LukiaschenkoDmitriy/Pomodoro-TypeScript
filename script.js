var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var TimerMode;
(function (TimerMode) {
    TimerMode[TimerMode["Default"] = 0] = "Default";
    TimerMode[TimerMode["Rest"] = 1] = "Rest";
    TimerMode[TimerMode["LongRest"] = 2] = "LongRest";
})(TimerMode || (TimerMode = {}));
var TimerQueryes = /** @class */ (function () {
    function TimerQueryes(timerQueryesConst) {
        if (timerQueryesConst === void 0) { timerQueryesConst = [
            TimerMode.Default, TimerMode.Rest, TimerMode.Default,
            TimerMode.Rest, TimerMode.Default, TimerMode.LongRest
        ]; }
        this.currentTimerQuery = 0;
        this.timerQueryes = timerQueryesConst;
    }
    TimerQueryes.prototype.nextQuery = function () {
        if (this.currentTimerQuery == this.timerQueryes.length) {
            this.currentTimerQuery = 0;
        }
        return this.timerQueryes[this.currentTimerQuery++];
    };
    return TimerQueryes;
}());
var TimerHTMLElements = /** @class */ (function () {
    function TimerHTMLElements() {
        this.Body = $("body");
        this.ResetButton = $("#resetButton");
        this.TimeButton = $("#time");
        this.SkipButton = $("#skipButton");
    }
    TimerHTMLElements.prototype.AddTimeButtonClickEvent = function (handler) {
        return this.TimeButton.on("click", function () { return handler(); });
    };
    TimerHTMLElements.prototype.AddResetButtonClickEvent = function (handler) {
        return this.ResetButton.on('click', function () { return handler(); });
    };
    TimerHTMLElements.prototype.AddSkipButtonClickEVent = function (handler) {
        return this.SkipButton.on("click", function () { return handler(); });
    };
    return TimerHTMLElements;
}());
var Timer = /** @class */ (function (_super) {
    __extends(Timer, _super);
    function Timer(defaultTime, restTime, restLongTime) {
        if (defaultTime === void 0) { defaultTime = { minutes: 25, seconds: 0 }; }
        if (restTime === void 0) { restTime = { minutes: 5, seconds: 0 }; }
        if (restLongTime === void 0) { restLongTime = { minutes: 15, seconds: 0 }; }
        var _this = _super.call(this) || this;
        _this._status = false;
        _this._timerMode = TimerMode.Default;
        _this._htmlElements = new TimerHTMLElements();
        _this._defaultTime = defaultTime;
        _this._restTime = restTime;
        _this._restLongTime = restLongTime;
        _this._currentTime = __assign({}, _this._defaultTime);
        _this._htmlElements.TimeButton.text(_this.ConvertCurrentTimeInTimeFormat());
        _this._htmlElements.AddTimeButtonClickEvent(function () { return _this.TimerButtonClickHandler(); });
        _this._htmlElements.AddResetButtonClickEvent(function () { return _this.ResetTimerHandler(); });
        _this._htmlElements.AddSkipButtonClickEVent(function () { return _this.SkipTimerHandler(); });
        _this.setTimerMode(_this.nextQuery());
        return _this;
    }
    Timer.prototype.TimerButtonClickHandler = function () {
        var _this = this;
        //Timer start
        if (!this._status) {
            this._interval = setInterval(function () { return _this.intervalHandler(); }, 1000);
            this.animateButtonOnStart();
        }
        //Timer stop
        else {
            clearInterval(this._interval);
            this.animateButtonOnStop();
        }
        this._status = !this._status;
    };
    Timer.prototype.intervalHandler = function () {
        if (this._currentTime.seconds == 0) {
            this._currentTime.minutes -= 1;
            this._currentTime.seconds = 60;
        }
        this._currentTime.seconds -= 1;
        if (this._currentTime.minutes == 0 && this._currentTime.seconds == 0) {
            this._status = false;
            this.setTimerMode(this.nextQuery());
        }
        this._htmlElements.TimeButton.text(this.ConvertCurrentTimeInTimeFormat());
    };
    Timer.prototype.setTimerMode = function (timerMode) {
        this._timerMode = timerMode;
        console.log(this._timerMode);
        if (this._timerMode == TimerMode.Default) {
            this._currentTime = __assign({}, this._defaultTime);
        }
        if (this._timerMode == TimerMode.Rest) {
            this._currentTime = __assign({}, this._restTime);
        }
        if (this._timerMode == TimerMode.LongRest) {
            this._currentTime = __assign({}, this._restLongTime);
        }
        this._htmlElements.TimeButton.text(this.ConvertCurrentTimeInTimeFormat());
    };
    Timer.prototype.animateButtonOnStart = function () {
        this._htmlElements.Body.css({ 'background-size': "100% 500%" });
        this._htmlElements.TimeButton.css({ 'box-shadow': '5px 5px 5px 2px rgb(255,255,255)' });
        this._htmlElements.SkipButton.css({ 'opacity': '0%' });
        this._htmlElements.ResetButton.css({ 'opacity': '0%' });
        this._htmlElements.SkipButton.off();
        this._htmlElements.ResetButton.off();
    };
    Timer.prototype.animateButtonOnStop = function () {
        var _this = this;
        this._htmlElements.TimeButton.css({ 'box-shadow': "" });
        this._htmlElements.SkipButton.css({ 'opacity': '100%' });
        this._htmlElements.ResetButton.css({ 'opacity': '100%' });
        this._htmlElements.AddResetButtonClickEvent(function () { return _this.ResetTimerHandler(); });
        this._htmlElements.AddSkipButtonClickEVent(function () { return _this.SkipTimerHandler(); });
    };
    Timer.prototype.ResetTimerHandler = function () {
        this.currentTimerQuery = 0;
        this.setTimerMode(this.nextQuery());
        this._htmlElements.Body.css({ 'background-size': "100% 100%" });
    };
    Timer.prototype.SkipTimerHandler = function () {
        this._status = false;
        this.setTimerMode(this.nextQuery());
        this._htmlElements.Body.css({ 'background-size': "100% 100%" });
    };
    Timer.prototype.ConvertCurrentTimeInTimeFormat = function () {
        var minutes = (this._currentTime.minutes.toString().length == 1) ? "0" + this._currentTime.minutes.toString() : this._currentTime.minutes.toString();
        var seconds = (this._currentTime.seconds.toString().length == 1) ? "0" + this._currentTime.seconds.toString() : this._currentTime.seconds.toString();
        return minutes + ":" + seconds;
    };
    return Timer;
}(TimerQueryes));
var timer = new Timer();
