exports.getPresets = function () {
	let presets = []

	const ColorWhite = this.rgb(255, 255, 255)
	const ColorBlack = this.rgb(0, 0, 0)
	const ColorRed = this.rgb(200, 0, 0)
	const ColorGreen = this.rgb(0, 200, 0)

	presets.push({
		category: 'Clock Display',
		label: 'Show Dispaly Value',
		bank: {
			style: 'text',
			text: '$(tm-clock:display)',
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
	})

	presets.push({
		category: 'Clock Mode',
		label: 'Show Time of Day',
		bank: {
			style: 'text',
			text: 'Show Time of Day',
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		actions: [
			{
				action: 'showTimeOfDay',
			},
		],
		feedbacks: [
			{
				type: 'displayMode',
				options: {
					mode: 'timeofday',
				},
				style: {
					color: ColorWhite,
					bgcolor: ColorGreen,
				},
			},
		],
	})

	presets.push({
		category: 'Clock Mode',
		label: 'Show Count-Up Timer',
		bank: {
			style: 'text',
			text: 'Show Count-Up',
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		actions: [
			{
				action: 'countUpTimerMode',
				options: {
					mode: 'sec',
				},
			},
		],
		feedbacks: [
			{
				type: 'displayMode',
				options: {
					mode: 'countup',
				},
				style: {
					color: ColorWhite,
					bgcolor: ColorGreen,
				},
			},
		],
	})

	presets.push({
		category: 'Clock Mode',
		label: 'Show Countdown Timer',
		bank: {
			style: 'text',
			text: 'Show Count Down',
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		actions: [
			{
				action: 'countDownTimerMode',
				options: {
					mode: 'sec',
					hours: 0,
					minutes: 30,
					seconds: 0,
					tseconds: 0,
					alarmEnable: false,
				},
			},
		],
		feedbacks: [
			{
				type: 'displayMode',
				options: {
					mode: 'countdown',
				},
				style: {
					color: ColorWhite,
					bgcolor: ColorGreen,
				},
			},
		],
	})

	presets.push({
		category: 'Count-Up Timer',
		label: 'Control Count-Up Timer',
		bank: {
			style: 'text',
			text: '$(tm-clock:display)\\n$(tm-clock:timer_state)',
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
			latch: true,
		},
		actions: [
			{
				action: 'startCountUpTimer',
			},
		],
		release_actions: [
			{
				action: 'pauseCountUpTimer',
			},
		],
		feedbacks: [
			{
				type: 'timerState',
				options: {
					mode: 'countup',
					state: 'running',
				},
				style: {
					color: ColorWhite,
					bgcolor: ColorGreen,
				},
			},
			{
				type: 'timerState',
				options: {
					mode: 'countup',
					state: 'stopped',
				},
				style: {
					color: ColorWhite,
					bgcolor: ColorRed,
				},
			},
		],
	})

	presets.push({
		category: 'Count-Up Timer',
		label: 'Start Count-Up Timer',
		bank: {
			style: 'text',
			text: 'Start Count-Up Timer',
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		actions: [
			{
				action: 'startCountUpTimer',
			},
		],
	})

	presets.push({
		category: 'Count-Up Timer',
		label: 'Pause Count-Up Timer',
		bank: {
			style: 'text',
			text: 'Pause Count-Up Timer',
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		actions: [
			{
				action: 'pauseCountUpTimer',
			},
		],
	})

	presets.push({
		category: 'Count-Up Timer',
		label: 'Reset Count-Up Timer',
		bank: {
			style: 'text',
			text: 'Reset Count-Up Timer',
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		actions: [
			{
				action: 'resetCountUpTimer',
				options: {
					mode: 'sec',
				},
			},
		],
	})

	presets.push({
		category: 'Countdown Timer',
		label: 'Control Countdown Timer',
		bank: {
			style: 'text',
			text: '$(tm-clock:display)\\n$(tm-clock:timer_state)',
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
			latch: true,
		},
		actions: [
			{
				action: 'startCountDownTimer',
			},
		],
		release_actions: [
			{
				action: 'pauseCountDownTimer',
			},
		],
		feedbacks: [
			{
				type: 'timerState',
				options: {
					mode: 'countdown',
					state: 'running',
				},
				style: {
					color: ColorWhite,
					bgcolor: ColorGreen,
				},
			},
			{
				type: 'timerState',
				options: {
					mode: 'countdown',
					state: 'stopped',
				},
				style: {
					color: ColorWhite,
					bgcolor: ColorRed,
				},
			},
		],
	})

	presets.push({
		category: 'Countdown Timer',
		label: 'Start Countdown Timer',
		bank: {
			style: 'text',
			text: 'Start Count Down',
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		actions: [
			{
				action: 'startCountDownTimer',
			},
		],
	})

	presets.push({
		category: 'Countdown Timer',
		label: 'Pause Countdown Timer',
		bank: {
			style: 'text',
			text: 'Pause Count Down',
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		actions: [
			{
				action: 'pauseCountDownTimer',
			},
		],
	})

	presets.push({
		category: 'Countdown Timer',
		label: `Start 1m Countdown`,
		bank: {
			style: 'text',
			text: `Start 1m Count Down`,
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		actions: [
			{
				action: 'countDownTimerMode',
				options: {
					mode: 'sec',
					hours: 0,
					minutes: 1,
					seconds: 0,
					tseconds: 0,
					alarmEnable: false,
				},
			},
			{
				action: 'startCountDownTimer',
			},
		],
	})

	for (let i = 5; i <= 30; i = i + 5) {
		presets.push({
			category: 'Countdown Timer',
			label: `Start ${[i]}m Countdown`,
			bank: {
				style: 'text',
				text: `Start ${[i]}m Count Down`,
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			actions: [
				{
					action: 'countDownTimerMode',
					options: {
						mode: 'sec',
						hours: 0,
						minutes: i,
						seconds: 0,
						tseconds: 0,
						alarmEnable: false,
					},
				},
				{
					action: 'startCountDownTimer',
				},
			],
		})
	}

	presets.push({
		category: 'Countdown Timer',
		label: `Start 1m Countdown`,
		bank: {
			style: 'text',
			text: `Start 1h Count Down`,
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		actions: [
			{
				action: 'countDownTimerMode',
				options: {
					mode: 'sec',
					hours: 1,
					minutes: 0,
					seconds: 0,
					tseconds: 0,
					alarmEnable: false,
				},
			},
			{
				action: 'startCountDownTimer',
			},
		],
	})

	presets.push({
		category: 'Countdown Timer',
		label: `Add 30s to Timer`,
		bank: {
			style: 'text',
			text: `Add 30s to Timer`,
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		actions: [
			{
				action: 'increaseTimerWhileRunning',
				options: {
					hours: 0,
					minutes: 0,
					seconds: 30,
				},
			},
		],
	})

	presets.push({
		category: 'Countdown Timer',
		label: `Add 1m to Timer`,
		bank: {
			style: 'text',
			text: `Add 1m to Timer`,
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		actions: [
			{
				action: 'increaseTimerWhileRunning',
				options: {
					hours: 0,
					minutes: 1,
					seconds: 0,
				},
			},
		],
	})

	presets.push({
		category: 'Countdown Timer',
		label: `Add 5m to Timer`,
		bank: {
			style: 'text',
			text: `Add 5m to Timer`,
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		actions: [
			{
				action: 'increaseTimerWhileRunning',
				options: {
					hours: 0,
					minutes: 5,
					seconds: 0,
				},
			},
		],
	})

	for (let i = 0; i <= 9; i++) {
		presets.push({
			category: 'Stored Programs',
			label: `Execute Program ${[i]}`,
			bank: {
				style: 'text',
				text: `EXEC PROG\\n${i}`,
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			actions: [
				{
					action: 'executeStoredProgram',
					options: {
						program: i,
					},
				},
			],
		})
	}

	presets.push({
		category: 'Relay Control',
		label: `Close Relay for 1 second`,
		bank: {
			style: 'text',
			text: `Close Relay\\n1 sec`,
			size: '14',
			color: ColorWhite,
			bgcolor: ColorBlack,
		},
		actions: [
			{
				action: 'relayControl',
				options: {
					seconds: '1',
				},
			},
		],
	})

	for (let i = 0; i <= 100; i = i + 10) {
		presets.push({
			category: 'Display Brightness',
			label: `Set Display Brightness to ${i}%`,
			bank: {
				style: 'text',
				text: `${i}%`,
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			actions: [
				{
					action: 'displayBrightness',
					options: {
						digit: i,
						dot: i,
					},
				},
			],
		})
	}

	for (let i = 0; i < this.COLORTABLE.length; i++) {
		presets.push({
			category: 'Display Colors',
			label: `Set Display Color to ${this.COLORTABLE[i].label}`,
			bank: {
				style: 'text',
				text: `${this.COLORTABLE[i].label}`,
				size: '14',
				color: this.ColorBlack,
				bgcolor: this.rgb(this.COLORTABLE[i].r, this.COLORTABLE[i].g, this.COLORTABLE[i].b),
			},
			actions: [
				{
					action: 'displayColors',
					options: {
						color_mmss: this.COLORTABLE[i].id,
						color_hh: this.COLORTABLE[i].id,
					},
				},
			],
		})
	}

	return presets
}
