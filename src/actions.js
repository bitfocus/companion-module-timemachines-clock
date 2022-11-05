module.exports = {
	getActions() {
		let actions = {
			showTimeOfDay: {
				label: 'Show Time Of Day',
				callback: (action) => {
					this.showTimeOfDay()
				},
			},

			countUpTimerMode: {
				label: 'Show Count-Up Timer',
				options: [
					{
						type: 'dropdown',
						label: 'Display Mode',
						id: 'mode',
						default: 'sec',
						choices: [
							{ id: 'sec', label: 'Hours, Minutes, & Seconds' },
							{ id: 'tsec', label: 'Minutes, Seconds, & Tenths of Seconds' },
						],
					},
				],
				callback: (action) => {
					this.setCountUpTimerMode(action.options.mode)
				},
			},

			startCountUpTimer: {
				label: 'Start Count-Up Timer',
				callback: (action) => {
					this.controlCountUpTimer('start')
				},
			},

			pauseCountUpTimer: {
				label: 'Pause Count-Up Timer',
				callback: (action) => {
					this.controlCountUpTimer('pause')
				},
			},

			resetCountUpTimer: {
				label: 'Reset Count-Up Timer',
				options: [
					{
						type: 'dropdown',
						label: 'Display Mode',
						id: 'mode',
						default: 'sec',
						choices: [
							{ id: 'sec', label: 'Hours, Minutes, & Seconds' },
							{ id: 'tsec', label: 'Minutes, Seconds, & Tenths of Seconds' },
						],
					},
				],
				callback: (action) => {
					this.resetCountUpTimer(action.options.mode)
				},
			},

			setUpTimerWhileRunning: {
				label: 'Set Count-Up Timer While Running',
				options: [
					{
						type: 'number',
						label: 'Hours',
						id: 'hours',
						default: 0,
						min: 0,
					},
					{
						type: 'number',
						label: 'Minutes',
						id: 'minutes',
						default: 30,
						min: 0,
						max: 59,
					},
					{
						type: 'number',
						label: 'Seconds',
						id: 'seconds',
						default: 0,
						min: 0,
						max: 59,
					},
					{
						type: 'number',
						label: 'Tenths Of Seconds',
						id: 'tseconds',
						default: 0,
						min: 0,
					},
					{
						type: 'number',
						label: 'Hundredths Of Seconds',
						id: 'hseconds',
						default: 0,
						min: 0,
					},
				],
				callback: (action) => {
					let opt = action.options
					this.setUpTimerWhileRunning(opt.hours, opt.minutes, opt.seconds, opt.tseconds, opt.hseconds)
				},
			},

			countDownTimerMode: {
				label: 'Show Countdown Timer',
				options: [
					{
						type: 'dropdown',
						label: 'Display Mode',
						id: 'mode',
						default: 'sec',
						choices: [
							{ id: 'sec', label: 'Hours, Minutes, & Seconds' },
							{ id: 'tsec', label: 'Minutes, Seconds, & Tenths of Seconds' },
						],
					},
					{
						type: 'number',
						label: 'Hours',
						id: 'hours',
						default: 0,
						min: 0,
						isVisible: (action) => action.options.mode == 'sec',
					},
					{
						type: 'number',
						label: 'Minutes',
						id: 'minutes',
						default: 30,
						min: 0,
						max: 59,
					},
					{
						type: 'number',
						label: 'Seconds',
						id: 'seconds',
						default: 0,
						min: 0,
						max: 59,
					},
					{
						type: 'number',
						label: 'Tenths Of Seconds',
						id: 'tseconds',
						default: 0,
						min: 0,
						isVisible: (action) => action.options.mode == 'tsec',
					},
					{
						type: 'checkbox',
						label: 'Enable Alarm',
						id: 'alarmEnable',
						default: false,
					},
					{
						type: 'number',
						label: 'Alarm Duration (in seconds)',
						id: 'alarmDuration',
						default: 3,
						min: 1,
						isVisible: (action) => action.options.alarmEnable == true,
					},
				],
				callback: (action) => {
					let opt = action.options
					this.setCountDownTimerMode(
						opt.mode,
						opt.hours,
						opt.minutes,
						opt.seconds,
						opt.tseconds,
						opt.alarmEnable,
						opt.alarmDuration
					)
				},
			},

			startCountDownTimer: {
				label: 'Start Countdown Timer',
				callback: (action) => {
					this.controlCountDownTimer('start')
				},
			},

			pauseCountDownTimer: {
				label: 'Pause Countdown Timer',
				callback: (action) => {
					this.controlCountDownTimer('pause')
				},
			},

			resetCountDownTimer: {
				label: 'Reset Countdown Timer',
				options: [
					{
						type: 'dropdown',
						label: 'Display Mode',
						id: 'mode',
						default: 'sec',
						choices: [
							{ id: 'sec', label: 'Hours, Minutes, & Seconds' },
							{ id: 'tsec', label: 'Minutes, Seconds, & Tenths of Seconds' },
						],
					},
					{
						type: 'number',
						label: 'Hours',
						id: 'hours',
						default: 0,
						min: 0,
						isVisible: (action) => action.options.mode == 'sec',
					},
					{
						type: 'number',
						label: 'Minutes',
						id: 'minutes',
						default: 30,
						min: 0,
						max: 59,
					},
					{
						type: 'number',
						label: 'Seconds',
						id: 'seconds',
						default: 0,
						min: 0,
						max: 59,
					},
					{
						type: 'number',
						label: 'Tenths Of Seconds',
						id: 'tseconds',
						default: 0,
						min: 0,
						isVisible: (action) => action.options.mode == 'tsec',
					},
					{
						type: 'checkbox',
						label: 'Enable Alarm',
						id: 'alarmEnable',
						default: false,
					},
					{
						type: 'number',
						label: 'Alarm Duration (in seconds)',
						id: 'alarmDuration',
						default: 3,
						min: 1,
						isVisible: (action) => action.options.alarmEnable == true,
					},
				],
				callback: (action) => {
					let opt = action.options
					this.resetCountDownTimer(
						opt.mode,
						opt.hours,
						opt.minutes,
						opt.seconds,
						opt.tseconds,
						opt.alarmEnable,
						opt.alarmDuration
					)
				},
			},

			setDownTimerWhileRunning: {
				label: 'Set Countdown Timer While Running',
				options: [
					{
						type: 'number',
						label: 'Hours',
						id: 'hours',
						default: 0,
						min: 0,
					},
					{
						type: 'number',
						label: 'Minutes',
						id: 'minutes',
						default: 30,
						min: 0,
						max: 59,
					},
					{
						type: 'number',
						label: 'Seconds',
						id: 'seconds',
						default: 0,
						min: 0,
						max: 59,
					},
					{
						type: 'number',
						label: 'Tenths Of Seconds',
						id: 'tseconds',
						default: 0,
						min: 0,
					},
					{
						type: 'number',
						label: 'Hundredths Of Seconds',
						id: 'hseconds',
						default: 0,
						min: 0,
					},
				],
				callback: (action) => {
					let opt = action.options
					this.setDownTimerWhileRunning(opt.hours, opt.minutes, opt.seconds, opt.tseconds, opt.hseconds)
				},
			},

			increaseTimerWhileRunning: {
				label: 'Increase Timer While Running',
				options: [
					{
						type: 'number',
						label: 'Hours',
						id: 'hours',
						default: 0,
						min: 0,
					},
					{
						type: 'number',
						label: 'Minutes',
						id: 'minutes',
						default: 30,
						min: 0,
						max: 59,
					},
					{
						type: 'number',
						label: 'Seconds',
						id: 'seconds',
						default: 0,
						min: 0,
						max: 59,
					},
				],
				callback: (action) => {
					let opt = action.options
					this.modifyTimerWhileRunning('increase', opt.hours, opt.minutes, opt.seconds)
				},
			},

			decreaseTimerWhileRunning: {
				label: 'Decrease Timer While Running',
				options: [
					{
						type: 'number',
						label: 'Hours',
						id: 'hours',
						default: 0,
						min: 0,
					},
					{
						type: 'number',
						label: 'Minutes',
						id: 'minutes',
						default: 30,
						min: 0,
						max: 59,
					},
					{
						type: 'number',
						label: 'Seconds',
						id: 'seconds',
						default: 0,
						min: 0,
						max: 59,
					},
				],
				callback: (action) => {
					let opt = action.options
					this.modifyTimerWhileRunning('decrease', opt.hours, opt.minutes, opt.seconds)
				},
			},

			executeStoredProgram: {
				label: 'Execute Stored Program',
				options: [
					{
						type: 'number',
						label: 'Program Number (0 to 9)',
						id: 'program',
						default: 0,
						min: 0,
						max: 9,
					},
				],
				callback: (action) => {
					this.executeStoredProgram(action.options.program)
				},
			},

			relayControl: {
				label: 'Close Relay',
				options: [
					{
						type: 'number',
						label: 'Seconds to stay Closed',
						id: 'seconds',
						default: 1,
						min: 1,
					},
				],
				callback: (action) => {
					let opt = action.options
					this.controlRelay(opt.seconds)
				},
			},

			displayBrightness: {
				label: 'Set Display Brightness',
				options: [
					{
						type: 'number',
						label: 'Digit Brightness (0 - 100)',
						id: 'digit',
						range: true,
						min: 0,
						max: 100,
						default: 100,
					},
					{
						type: 'number',
						label: 'Dot/Colon Brightness (0 - 100)',
						id: 'dot',
						range: true,
						min: 0,
						max: 100,
						default: 100,
					},
				],
				callback: (action) => {
					let opt = action.options
					this.setDisplayBrightness(opt.digit, opt.dot)
				},
			},

			displayColors: {
				label: 'Set Display Colors',
				options: [
					{
						type: 'dropdown',
						label: 'HH Digit Color',
						id: 'color_hh',
						default: this.COLORTABLE[0].id,
						choices: this.COLORTABLE,
					},
					{
						type: 'dropdown',
						label: 'MM:SS Digit Color',
						id: 'color_mmss',
						default: this.COLORTABLE[0].id,
						choices: this.COLORTABLE,
					},
				],
				callback: (action) => {
					let opt = action.options
					this.setDisplayColor(opt.color_mmss, opt.color_hh)
				},
			},
		}
		return actions
	},
}
