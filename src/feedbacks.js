module.exports = {
	// ##########################
	// #### Define Feedbacks ####
	// ##########################
	setFeedbacks: function () {
		let self = this;
		let feedbacks = {};

		const foregroundColor = self.rgb(255, 255, 255) // White
		const backgroundColorRed = self.rgb(255, 0, 0) // Red

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
					default: 'running',
					choices: [
						{ id: 'countup', label: 'Count Up' },
						{ id: 'countdown', label: 'Count Down' }
					]
				},
				{
					type: 'dropdown',
					label: 'Indicate in X State',
					id: 'state',
					default: 'running',
					choices: [
						{ id: 'running', label: 'Running' },
						{ id: 'stopped', label: 'Stopped' }
					]
				}
			],
			callback: function (feedback, bank) {
				let opt = feedback.options;

				if ((self.DEVICEINFO.displayMode == opt.mode) && (self.DEVICEINFO.timerState == opt.state)) {
					return true;
				}

				return false
			}
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
					default: '10'
				}
			],
			callback: function (feedback, bank) {
				let opt = feedback.options;

				if (self.DEVICEINFO.displayMode === 'countdown') {
					if (parseInt(self.DEVICEINFO.timerSeconds) <= parseInt(opt.seconds)) {
						return true;
					}
				}

				return false
			}
		}

		return feedbacks
	}
}
