module.exports = {
	// ##########################
	// #### Instance Actions ####
	// ##########################
	setActions: function () {
		let self = this;
		let actions = {};

		// ########################
		// ####    Actions     ####
		// ########################

		actions.countUpTimerMode = {
			label: 'Set CountUp Timer Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Display Mode',
					id: 'mode',
					default: 'sec',
					choices: [
						{ id: 'sec', label: 'Hours, Minutes, & Seconds'},
						{ id: 'tsec', label: 'Minutes, Seconds, & Tenths of Seconds'}
					]
				}
			],
			callback: function (action, bank) {
				self.setCountUpTimerMode(action.options.mode);
			}
		}

		actions.startCountUpTimer = {
			label: 'Start CountUp Timer',
			callback: function (action, bank) {
				self.controlCountUpTimer('start');
			}
		}

		actions.pauseCountUpTimer = {
			label: 'Pause CountUp Timer',
			callback: function (action, bank) {
				self.controlCountUpTimer('pause');
			}
		}

		actions.resetCountUpTimer = {
			label: 'Reset CountUp Timer',
			options: [
				{
					type: 'dropdown',
					label: 'Display Mode',
					id: 'mode',
					default: 'sec',
					choices: [
						{ id: 'sec', label: 'Hours, Minutes, & Seconds'},
						{ id: 'tsec', label: 'Minutes, Seconds, & Tenths of Seconds'}
					]
				}
			],
			callback: function (action, bank) {
				self.resetCountUpTimer(action.options.mode);
			}
		}

		actions.countDownTimerMode = {
			label: 'Set CountDown Timer Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Display Mode',
					id: 'mode',
					default: 'sec',
					choices: [
						{ id: 'sec', label: 'Hours, Minutes, & Seconds'},
						{ id: 'tsec', label: 'Minutes, Seconds, & Tenths of Seconds'}
					]
				},
				{
					type: 'textinput',
					label: 'Hours',
					id: 'hours',
					default: '0',
					isVisible: (action) => action.options.mode == 'sec'
				},
				{
					type: 'textinput',
					label: 'Minutes',
					id: 'minutes',
					default: '30'
				},
				{
					type: 'textinput',
					label: 'Seconds',
					id: 'seconds',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Tenths Of Seconds',
					id: 'tseconds',
					default: '0',
					isVisible: (action) => action.options.mode == 'tsec'
				},
				{
					type: 'checkbox',
					label: 'Enable Alarm',
					id: 'alarmEnable',
					default: false
				},
				{
					type: 'textinput',
					label: 'Alarm Duration (in seconds)',
					id: 'alarmDuration',
					default: '3',
					isVisible: (action) => action.options.alarmEnable == true
				}
			],
			callback: function (action, bank) {
				let opt = action.options;
				self.setCountDownTimerMode(opt.mode, opt.hours, opt.minutes, opt.seconds, opt.tseconds, opt.alarmEnable, opt.alarmDuration);
			}
		}

		actions.startCountDownTimer = {
			label: 'Start CountDown Timer',
			callback: function (action, bank) {
				self.controlCountDownTimer('start');
			}
		}

		actions.pauseCountDownTimer = {
			label: 'Pause CountDown Timer',
			callback: function (action, bank) {
				self.controlCountDownTimer('pause');
			}
		}

		actions.resetCountDownTimer = {
			label: 'Reset Count Down Timer',
			options: [
				{
					type: 'dropdown',
					label: 'Display Mode',
					id: 'mode',
					default: 'sec',
					choices: [
						{ id: 'sec', label: 'Hours, Minutes, & Seconds'},
						{ id: 'tsec', label: 'Minutes, Seconds, & Tenths of Seconds'}
					]
				},
				{
					type: 'textinput',
					label: 'Hours',
					id: 'hours',
					default: '0',
					isVisible: (action) => action.options.mode == 'sec'
				},
				{
					type: 'textinput',
					label: 'Minutes',
					id: 'minutes',
					default: '30'
				},
				{
					type: 'textinput',
					label: 'Seconds',
					id: 'seconds',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Tenths Of Seconds',
					id: 'tseconds',
					default: '0',
					isVisible: (action) => action.options.mode == 'tsec'
				},
				{
					type: 'checkbox',
					label: 'Enable Alarm',
					id: 'alarmEnable',
					default: false
				},
				{
					type: 'textinput',
					label: 'Alarm Duration (in seconds)',
					id: 'alarmDuration',
					default: '3',
					isVisible: (action) => action.options.alarmEnable == true
				}
			],
			callback: function (action, bank) {
				let opt = action.options;
				self.resetCountDownTimer(opt.mode, opt.hours, opt.minutes, opt.seconds, opt.tseconds, opt.alarmEnable, opt.alarmDuration);
			}
		}

		actions.showTimeOfDay = {
			label: 'Show Time Of Day on Clock',
			callback: function (action, bank) {
				self.showTimeOfDay();
			}
		}

		actions.setUpTimerWhileRunning = {
			label: 'Set Up Timer While Running',
			options: [
				{
					type: 'textinput',
					label: 'Hours',
					id: 'hours',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Minutes',
					id: 'minutes',
					default: '30'
				},
				{
					type: 'textinput',
					label: 'Seconds',
					id: 'seconds',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Tenths Of Seconds',
					id: 'tseconds',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Hundredths Of Seconds',
					id: 'hseconds',
					default: '0'
				}
			],
			callback: function (action, bank) {
				let opt = action.options;
				self.setUpTimerWhileRunning(opt.hours, opt.minutes, opt.seconds, opt.tseconds, opt.hseconds);
			}
		}

		actions.setDownTimerWhileRunning = {
			label: 'Set Down Timer While Running',
			options: [
				{
					type: 'textinput',
					label: 'Hours',
					id: 'hours',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Minutes',
					id: 'minutes',
					default: '30'
				},
				{
					type: 'textinput',
					label: 'Seconds',
					id: 'seconds',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Tenths Of Seconds',
					id: 'tseconds',
					default: '0'
				},
				{
					type: 'textinput',
					label: 'Hundredths Of Seconds',
					id: 'hseconds',
					default: '0'
				}
			],
			callback: function (action, bank) {
				let opt = action.options;
				self.setDownTimerWhileRunning(opt.hours, opt.minutes, opt.seconds, opt.tseconds, opt.hseconds);
			}
		}

		actions.executeStoredProgram = {
			label: 'Execute Stored Program',
			options: [
				{
					type: 'dropdown',
					label: 'Program Number',
					id: 'program',
					default: '0',
					choices: [
						{ id: '0', label: '0'},
						{ id: '1', label: '1'},
						{ id: '2', label: '2'},
						{ id: '3', label: '3'},
						{ id: '4', label: '4'},
						{ id: '5', label: '5'},
						{ id: '6', label: '6'},
						{ id: '7', label: '7'},
						{ id: '8', label: '8'},
						{ id: '9', label: '9'}
					]
				}
			],
			callback: function (action, bank) {
				self.executeStoredProgram(action.options.program);
			}
		}

		actions.relayControl = {
			label: 'Close Relay',
			options: [
				{
					type: 'textinput',
					label: 'Seconds to stay Closed',
					id: 'seconds',
					default: '1'
				}
			],
			callback: function (action, bank) {
				let opt = action.options;
				self.controlRelay(opt.seconds);
			}
		}

		actions.displayBrightness = {
			label: 'Set Display Brightness',
			options: [
				{
					type: 'textinput',
					label: 'Digit Brightness (0 - 100)',
					id: 'digit',
					default: '100'
				},
				{
					type: 'textinput',
					label: 'Dot/Colon Brightness (0 - 100)',
					id: 'dot',
					default: '100'
				}
			],
			callback: function (action, bank) {
				let opt = action.options;
				self.setDisplayBrightness(opt.digit, opt.dot);
			}
		}

		actions.displayColors = {
			label: 'Set Display Colors',
			options: [
				{
					type: 'dropdown',
					label: 'HH Digit Color',
					id: 'color_hh',
					default: self.COLORTABLE[0].id,
					choices: self.COLORTABLE
				},
				{
					type: 'dropdown',
					label: 'MM:SS Digit Color',
					id: 'color_mmss',
					default: self.COLORTABLE[0].id,
					choices: self.COLORTABLE
				}
			],
			callback: function (action, bank) {
				let opt = action.options;
				self.setDisplayColor(opt.color_mmss, opt.color_hh);
			}
		}

		return actions
	}
}