module.exports = {
	// ##########################
	// #### Define Variables ####
	// ##########################
	setVariables: function () {
		let self = this;

		let variables = [];

		variables.push({ name: 'connection', label: 'Connection' });

		variables.push({ name: 'model', label: 'Model' });
		variables.push({ name: 'name', label: 'Unit Name' });
		variables.push({ name: 'firmware', label: 'Firmware Version' });

		variables.push({ name: 'timer', label: 'Time on Clock' });
		variables.push({ name: 'display_mode', label: 'Display Mode' });
		variables.push({ name: 'timer_state', label: 'Timer State' });

		return variables
	},

	// #########################
	// #### Check Variables ####
	// #########################
	checkVariables: function () {
		let self = this;

		try {
			self.setVariable('connection', self.DEVICEINFO.connection);

			self.setVariable('model', self.DEVICEINFO.model);
			self.setVariable('name', self.DEVICEINFO.name);
			self.setVariable('firmware', self.DEVICEINFO.firmware);

			self.setVariable('timer', self.DEVICEINFO.timer);
			self.setVariable('display_mode', self.DEVICEINFO.displayModeFriendly);
			self.setVariable('timer_state', self.DEVICEINFO.timerStateFriendly);
		}
		catch(error) {
		}
	}
}
