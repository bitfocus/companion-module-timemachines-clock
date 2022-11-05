module.exports = {
	getActions() {
		let actions = {
			countUpTimerMode: {
				label: 'Set CountUp Timer Mode',
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
				label: 'Start CountUp Timer',
				callback: (action) => {
					this.controlCountUpTimer('start')
				},
			},

			pauseCountUpTimer: {
				label: 'Pause CountUp Timer',
				callback: (action) => {
					this.controlCountUpTimer('pause')
				},
			},

			resetCountUpTimer: {
				label: 'Reset CountUp Timer',
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

			countDownTimerMode: {
				label: 'Set CountDown Timer Mode',
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
						type: 'textinput',
						label: 'Hours',
						id: 'hours',
						default: '0',
						isVisible: (action) => action.options.mode == 'sec',
					},
					{
						type: 'textinput',
						label: 'Minutes',
						id: 'minutes',
						default: '30',
					},
					{
						type: 'textinput',
						label: 'Seconds',
						id: 'seconds',
						default: '0',
					},
					{
						type: 'textinput',
						label: 'Tenths Of Seconds',
						id: 'tseconds',
						default: '0',
						isVisible: (action) => action.options.mode == 'tsec',
					},
					{
						type: 'checkbox',
						label: 'Enable Alarm',
						id: 'alarmEnable',
						default: false,
					},
					{
						type: 'textinput',
						label: 'Alarm Duration (in seconds)',
						id: 'alarmDuration',
						default: '3',
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
				label: 'Start CountDown Timer',
				callback: (action) => {
					this.controlCountDownTimer('start')
				},
			},

			pauseCountDownTimer: {
				label: 'Pause CountDown Timer',
				callback: (action) => {
					this.controlCountDownTimer('pause')
				},
			},

			resetCountDownTimer: {
				label: 'Reset Count Down Timer',
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
						type: 'textinput',
						label: 'Hours',
						id: 'hours',
						default: '0',
						isVisible: (action) => action.options.mode == 'sec',
					},
					{
						type: 'textinput',
						label: 'Minutes',
						id: 'minutes',
						default: '30',
					},
					{
						type: 'textinput',
						label: 'Seconds',
						id: 'seconds',
						default: '0',
					},
					{
						type: 'textinput',
						label: 'Tenths Of Seconds',
						id: 'tseconds',
						default: '0',
						isVisible: (action) => action.options.mode == 'tsec',
					},
					{
						type: 'checkbox',
						label: 'Enable Alarm',
						id: 'alarmEnable',
						default: false,
					},
					{
						type: 'textinput',
						label: 'Alarm Duration (in seconds)',
						id: 'alarmDuration',
						default: '3',
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

			showTimeOfDay: {
				label: 'Show Time Of Day on Clock',
				callback: (action) => {
					this.showTimeOfDay()
				},
			},

			setUpTimerWhileRunning: {
				label: 'Set Up Timer While Running',
				options: [
					{
						type: 'textinput',
						label: 'Hours',
						id: 'hours',
						default: '0',
					},
					{
						type: 'textinput',
						label: 'Minutes',
						id: 'minutes',
						default: '30',
					},
					{
						type: 'textinput',
						label: 'Seconds',
						id: 'seconds',
						default: '0',
					},
					{
						type: 'textinput',
						label: 'Tenths Of Seconds',
						id: 'tseconds',
						default: '0',
					},
					{
						type: 'textinput',
						label: 'Hundredths Of Seconds',
						id: 'hseconds',
						default: '0',
					},
				],
				callback: (action) => {
					let opt = action.options
					this.setUpTimerWhileRunning(opt.hours, opt.minutes, opt.seconds, opt.tseconds, opt.hseconds)
				},
			},

			setDownTimerWhileRunning: {
				label: 'Set Down Timer While Running',
				options: [
					{
						type: 'textinput',
						label: 'Hours',
						id: 'hours',
						default: '0',
					},
					{
						type: 'textinput',
						label: 'Minutes',
						id: 'minutes',
						default: '30',
					},
					{
						type: 'textinput',
						label: 'Seconds',
						id: 'seconds',
						default: '0',
					},
					{
						type: 'textinput',
						label: 'Tenths Of Seconds',
						id: 'tseconds',
						default: '0',
					},
					{
						type: 'textinput',
						label: 'Hundredths Of Seconds',
						id: 'hseconds',
						default: '0',
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
						type: 'textinput',
						label: 'Hours',
						id: 'hours',
						default: '0',
					},
					{
						type: 'textinput',
						label: 'Minutes',
						id: 'minutes',
						default: '1',
					},
					{
						type: 'textinput',
						label: 'Seconds',
						id: 'seconds',
						default: '0',
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
						type: 'textinput',
						label: 'Hours',
						id: 'hours',
						default: '0',
					},
					{
						type: 'textinput',
						label: 'Minutes',
						id: 'minutes',
						default: '1',
					},
					{
						type: 'textinput',
						label: 'Seconds',
						id: 'seconds',
						default: '0',
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
						type: 'dropdown',
						label: 'Program Number',
						id: 'program',
						default: '0',
						choices: [
							{ id: '0', label: '0' },
							{ id: '1', label: '1' },
							{ id: '2', label: '2' },
							{ id: '3', label: '3' },
							{ id: '4', label: '4' },
							{ id: '5', label: '5' },
							{ id: '6', label: '6' },
							{ id: '7', label: '7' },
							{ id: '8', label: '8' },
							{ id: '9', label: '9' },
						],
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
						type: 'textinput',
						label: 'Seconds to stay Closed',
						id: 'seconds',
						default: '1',
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
