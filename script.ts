enum TimerMode {
	Default,
	Rest,
	LongRest
}

abstract class TimerQueryes {
	constructor(timerQueryesConst: TimerMode[] = [
		TimerMode.Default, TimerMode.Rest, TimerMode.Default,
	    TimerMode.Rest, TimerMode.Default, TimerMode.LongRest
	]) 
	{
		this.timerQueryes = timerQueryesConst;
	}

	protected timerQueryes : TimerMode[];
	
	protected currentTimerQuery : number = 0;

	protected nextQuery() : TimerMode {
		if (this.currentTimerQuery == this.timerQueryes.length) {
			this.currentTimerQuery = 0;
		}
		return this.timerQueryes[this.currentTimerQuery++];
	}
}

interface ButtonClickHandler {
	(): void;
}


class TimerHTMLElements {
	public Body : JQuery<HTMLElement> = $("body");

	public ResetButton : JQuery<HTMLElement> = $("#resetButton");
	public TimeButton : JQuery<HTMLElement> = $("#time");
	public SkipButton : JQuery<HTMLElement> = $("#skipButton");

	public AddTimeButtonClickEvent(handler: ButtonClickHandler) : JQuery<HTMLElement> {
   		return this.TimeButton.on("click", () => handler());
   	}

   	public AddResetButtonClickEvent(handler: ButtonClickHandler): JQuery<HTMLElement> {
    	return this.ResetButton.on('click', () => handler());
    }

    public AddSkipButtonClickEVent(handler: ButtonClickHandler): JQuery<HTMLElement> {
    	return this.SkipButton.on("click", () => handler());
    }
}

class Timer extends TimerQueryes {

    private _status : boolean = false;
    private _timerMode : TimerMode = TimerMode.Default;

    private _htmlElements: TimerHTMLElements = new TimerHTMLElements();

	private _defaultTime: {[name: string]: number};
    private _restTime : {[name: string]: number};
    private _restLongTime : {[name: string]: number};

    private _currentTime: {[name: string]: number};

	private _interval : number;

    constructor
    (	
    	defaultTime: {[name: string]: number} = {minutes: 25, seconds: 0}, 
		restTime: {[name: string]: number} = {minutes: 5, seconds: 0},
		restLongTime: {[name: string]: number} = {minutes: 15, seconds: 0}
	) 
    {
    	super();

    	this._defaultTime = defaultTime;
    	this._restTime = restTime;
    	this._restLongTime = restLongTime;

    	this._currentTime = {...this._defaultTime};
    	this._htmlElements.TimeButton.text(this.ConvertCurrentTimeInTimeFormat());

    	this._htmlElements.AddTimeButtonClickEvent(() => this.TimerButtonClickHandler());
    	this._htmlElements.AddResetButtonClickEvent(() => this.ResetTimerHandler());
    	this._htmlElements.AddSkipButtonClickEVent(() => this.SkipTimerHandler());

    	this.setTimerMode(this.nextQuery());
    }

    private TimerButtonClickHandler() : void {
    	//Timer start
		if (!this._status) {
			this._interval = setInterval(() => this.intervalHandler(), 1000);
			this.animateButtonOnStart();
		} 
		//Timer stop
		else {
			clearInterval(this._interval);
			this.animateButtonOnStop();
		}
		this._status = !this._status;
    }

   	private intervalHandler(): void {
   		if (this._currentTime.seconds == 0) 
   		{
   			this._currentTime.minutes -= 1;
   			this._currentTime.seconds = 60;
   		}

   		this._currentTime.seconds -= 1;

   		if (this._currentTime.minutes == 0 && this._currentTime.seconds == 0) 
   		{
   			this._status = false;
   			this.setTimerMode(this.nextQuery());
   		}

   		this._htmlElements.TimeButton.text(this.ConvertCurrentTimeInTimeFormat());
    }

    private setTimerMode(timerMode: TimerMode): void {
    	this._timerMode = timerMode;

    	console.log(this._timerMode);

    	if (this._timerMode == TimerMode.Default) {
			this._currentTime = {...this._defaultTime};
		}
		if (this._timerMode == TimerMode.Rest) {
			this._currentTime = {...this._restTime};
		}
		if (this._timerMode == TimerMode.LongRest) {
			this._currentTime = {...this._restLongTime};
		}

		this._htmlElements.TimeButton.text(this.ConvertCurrentTimeInTimeFormat());
    }

    private animateButtonOnStart() : void {
        this._htmlElements.Body.css({'background-size': "100% 500%"});

        this._htmlElements.TimeButton.css({'box-shadow':'5px 5px 5px 2px rgb(255,255,255)'});
        
        this._htmlElements.SkipButton.css({'opacity':'0%'});
        this._htmlElements.ResetButton.css({'opacity':'0%'});

        this._htmlElements.SkipButton.off();
        this._htmlElements.ResetButton.off();
    }

    private animateButtonOnStop() : void {
    	this._htmlElements.TimeButton.css({'box-shadow': ""});
            
        this._htmlElements.SkipButton.css({'opacity':'100%'});
        this._htmlElements.ResetButton.css({'opacity':'100%'});

        this._htmlElements.AddResetButtonClickEvent(() => this.ResetTimerHandler());
    	this._htmlElements.AddSkipButtonClickEVent(() => this.SkipTimerHandler());
    }

    private ResetTimerHandler() : void {
        this.currentTimerQuery = 0;
        this.setTimerMode(this.nextQuery());

        this._htmlElements.Body.css({'background-size': "100% 100%"});
    }

    private SkipTimerHandler() : void {
    	this._status = false;
    	this.setTimerMode(this.nextQuery());

    	this._htmlElements.Body.css({'background-size': "100% 100%"});
    }


    private ConvertCurrentTimeInTimeFormat(): string {
    	let minutes: string = (this._currentTime.minutes.toString().length == 1) ? "0"+this._currentTime.minutes.toString() : this._currentTime.minutes.toString();
    	let seconds: string = (this._currentTime.seconds.toString().length == 1) ? "0"+this._currentTime.seconds.toString() : this._currentTime.seconds.toString();
    	return minutes + ":" + seconds;
    }
}

const timer = new Timer();