module.exports = {
	setPresets: function () {
		let self = this;

		let presets = [];

		const foregroundColor = self.rgb(255, 255, 255) // White
		const foregroundColorBlack = self.rgb(0, 0, 0) // Black
		const backgroundColorRed = self.rgb(255, 0, 0) // Red
		const backgroundColorGreen = self.rgb(0, 255, 0) // Red

		// ########################
		// #### Presets ###########
		// ########################

		presets.push({
			category: 'Clock Display',
			label: 'Show Timer Value',
			bank: {
				style: 'text',
				text: '$(timemachines-clock:timer)',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
			}
		})

		presets.push({
			category: 'Count Up Timer',
			label: 'Control Count Up Timer',
			bank: {
				style: 'text',
				text: '$(timemachines-clock:timer)',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
				latch: true
			},
			actions: [
				{
					action: 'startCountUpTimer'
				}
			],
			release_actions: [
				{
					action: 'pauseCountUpTimer'
				}
			],
			feedbacks: [
				{
					type: 'timerState',
					options: {
						mode: 'countup',
						state: 'running'
					},
					style: {
						color: foregroundColor,
						bgcolor: backgroundColorGreen
					}
				},
				{
					type: 'timerState',
					options: {
						mode: 'countup',
						state: 'stopped'
					},
					style: {
						color: foregroundColor,
						bgcolor: backgroundColorRed
					}
				}
			]
		})

		presets.push({
			category: 'Count Down Timer',
			label: 'Control Count Down Timer',
			bank: {
				style: 'text',
				text: '$(timemachines-clock:timer)',
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0),
				latch: true
			},
			actions: [
				{
					action: 'startCountDownTimer'
				}
			],
			release_actions: [
				{
					action: 'pauseCountDownTimer'
				}
			],
			feedbacks: [
				{
					type: 'timerState',
					options: {
						mode: 'countdown',
						state: 'running'
					},
					style: {
						color: foregroundColor,
						bgcolor: backgroundColorGreen
					}
				},
				{
					type: 'timerState',
					options: {
						mode: 'countdown',
						state: 'stopped'
					},
					style: {
						color: foregroundColor,
						bgcolor: backgroundColorRed
					}
				}
			]
		});

		for (let i = 0; i <= 9; i++) {
			presets.push({
				category: 'Stored Programs',
				label: `Execute Program ${[i]}`,
				bank: {
					style: 'text',
					text: `EXEC PROG\\n${i}`,
					size: '14',
					color: '16777215',
					bgcolor: self.rgb(0, 0, 0)
				},
				actions: [
					{
						action: 'executeStoredProgram',
						options: {
							program: i.toString()
						}
					}
				]
			})
		}

		presets.push({
			category: 'Relay Control',
			label: `Close Relay for 1 second`,
			bank: {
				style: 'text',
				text: `Close Relay\\n1 sec`,
				size: '14',
				color: '16777215',
				bgcolor: self.rgb(0, 0, 0)
			},
			actions: [
				{
					action: 'relayControl',
					options: {
						seconds: '1'
					}
				}
			]
		})

		for (let i = 0; i <= 100; i = i + 10) {
			presets.push({
				category: 'Display Brightness',
				label: `Set Display Brightness to ${i}%`,
				bank: {
					style: 'text',
					text: `${i}%`,
					size: '14',
					color: '16777215',
					bgcolor: self.rgb(0, 0, 0)
				},
				actions: [
					{
						action: 'displayBrightness',
						options: {
							digit: i.toString(),
							dot: i.toString()
						}
					}
				]
			})
		}

		for (let i = 0; i < self.COLORTABLE.length; i++) {
			presets.push({
				category: 'Display Colors',
				label: `Set Display Color to ${self.COLORTABLE[i].label}`,
				bank: {
					style: 'text',
					text: `${self.COLORTABLE[i].label}`,
					size: '14',
					color: self.foregroundColorBlack,
					bgcolor: self.rgb(self.COLORTABLE[i].r, self.COLORTABLE[i].g, self.COLORTABLE[i].b),
				},
				actions: [
					{
						action: 'displayColors',
						options: {
							color_mmss: self.COLORTABLE[i].id,
							color_hh: self.COLORTABLE[i].id
						}
					}
				]
			})
		}
		
		return presets;
	}
}
