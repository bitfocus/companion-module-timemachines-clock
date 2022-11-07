exports.updateVariableDefinitions = function () {
	const variables = []

	variables.push({ name: 'connection', label: 'Connection' })

	variables.push({ name: 'model', label: 'Model' })
	variables.push({ name: 'name', label: 'Unit Name' })
	variables.push({ name: 'firmware', label: 'Firmware Version' })

	variables.push({ name: 'display', label: 'Current Display on Clock' })
	variables.push({ name: 'display_mode', label: 'Display Mode' })
	variables.push({ name: 'timer_state', label: 'Timer State' })

	this.setVariableDefinitions(variables)
}

exports.checkVariables = function () {
	try {
		this.setVariable('connection', this.DEVICEINFO.connection)

		this.setVariable('model', this.DEVICEINFO.model)
		this.setVariable('name', this.DEVICEINFO.name)
		this.setVariable('firmware', this.DEVICEINFO.firmware)

		this.setVariable('display', this.DEVICEINFO.display)
		this.setVariable('display_mode', this.DEVICEINFO.displayModeFriendly)
		this.setVariable('timer_state', this.DEVICEINFO.timerStateFriendly)
	} catch (error) {}
}
