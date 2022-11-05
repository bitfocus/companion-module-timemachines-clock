exports.initFeedbacks = function () {
	const feedbacks = {}

	const foregroundColor = this.rgb(255, 255, 255) // White
	const backgroundColorRed = this.rgb(255, 0, 0) // Red

	feedbacks.displayMode = {
		type: 'boolean',
		label: 'Display Mode',
		description: 'Indicate current display mode',
		style: {
			color: foregroundColor,
			bgcolor: backgroundColorRed,
		},
		options: [
			{
				type: 'dropdown',
				label: 'Display Mode',
				id: 'mode',
				default: 'countup',
				choices: [
					{ id: 'timeofday', label: 'Time of Day' },
					{ id: 'countup', label: 'Count Up' },
					{ id: 'countdown', label: 'Count Down' },
				],
			},
		],
		callback: (feedback) => {
			let opt = feedback.options

			if (this.DEVICEINFO?.displayMode == opt.mode) {
				return true
			}
		},
	}

	feedbacks.timerState = {
		type: 'boolean',
		label: 'Timer State',
		description: 'Indicate if Timer is Running or Stopped',
		style: {
			color: foregroundColor,
			bgcolor: backgroundColorRed,
		},
		options: [
			{
				type: 'dropdown',
				label: 'Timer Mode',
				id: 'mode',
				default: 'countup',
				choices: [
					{ id: 'countup', label: 'Count Up' },
					{ id: 'countdown', label: 'Count Down' },
				],
			},
			{
				type: 'dropdown',
				label: 'Indicate in X State',
				id: 'state',
				default: 'running',
				choices: [
					{ id: 'running', label: 'Running' },
					{ id: 'stopped', label: 'Stopped' },
				],
			},
		],
		callback: (feedback) => {
			let opt = feedback.options

			if (this.DEVICEINFO?.displayMode == opt.mode && this.DEVICEINFO?.timerState == opt.state) {
				return true
			}
		},
	}

	feedbacks.timerLeft = {
		type: 'boolean',
		label: 'Timer Time Left',
		description: 'Indicate if Timer has X seconds left',
		style: {
			color: foregroundColor,
			bgcolor: backgroundColorRed,
		},
		options: [
			{
				type: 'textinput',
				label: 'Number of Seconds Remaining',
				id: 'seconds',
				default: '10',
			},
		],
		callback: (feedback) => {
			let opt = feedback.options

			if (this.DEVICEINFO.displayMode === 'countdown') {
				if (parseInt(this.DEVICEINFO.timerSeconds) <= parseInt(opt.seconds)) {
					return true
				}
			}

			return false
		},
	}

	this.setFeedbackDefinitions(feedbacks)
	return feedbacks
}
