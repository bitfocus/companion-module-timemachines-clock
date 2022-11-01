var instance_skel = require('../../../instance_skel')
const udp = require('../../../udp')

var actions = require('./actions.js')
var presets = require('./presets.js')
var feedbacks = require('./feedbacks.js')
var variables = require('./variables.js')

var debug

instance.prototype.INTERVAL = null //used to poll the clock every second
instance.prototype.CONNECTED = false //used for friendly notifying of the user that we have not received data yet

instance.prototype.DEVICEINFO = {
	connection: '(connecting)',
	model: '',
	name: '',
	firmware: '',
	timer: '00:00:00',
	displayMode: '',
	displayModeFriendly: '',
	timerState: '',
	timerStateFriendly: '',
}

instance.prototype.COLORTABLE = [
	{ id: 'red', label: 'Red', r: 255, g: 0, b: 0 },
	{ id: 'green', label: 'Green', r: 0, g: 255, b: 0 },
	{ id: 'blue', label: 'Blue', r: 0, g: 0, b: 255 },
	{ id: 'cyan', label: 'Cyan', r: 0, g: 255, b: 255 },
	{ id: 'magenta', label: 'Magenta', r: 255, g: 0, b: 255 },
	{ id: 'yellow', label: 'Yellow', r: 255, g: 255, b: 0 },
	{ id: 'white', label: 'White', r: 255, g: 255, b: 255 },
]

// ########################
// #### Instance setup ####
// ########################
function instance(system, id, config) {
	let self = this

	// super-constructor
	instance_skel.apply(this, arguments)

	return self
}

instance.GetUpgradeScripts = function () {}

// Initalize module
instance.prototype.init = function () {
	let self = this

	debug = self.debug
	log = self.log

	self.status(self.STATUS_WARNING, 'connecting')

	self.init_connection()

	self.init_actions()
	self.init_feedbacks()
	self.init_variables()
	self.init_presets()

	self.checkVariables()
	self.checkFeedbacks()
}

// Return config fields for web config
instance.prototype.config_fields = function () {
	let self = this

	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module controls Time Machines Corp Clocks, Displays, and Timers',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'IP Address',
			width: 4,
			regex: self.REGEX_IP,
		},
		{
			type: 'text',
			id: 'intervalInfo',
			width: 12,
			label: 'Update Interval',
			value:
				'Please enter the amount of time in milliseconds to request new information from the device. Set to 0 to disable.',
		},
		{
			type: 'textinput',
			id: 'interval',
			label: 'Update Interval',
			width: 3,
			default: 1000,
		},
	]
}

// Update module after a config change
instance.prototype.updateConfig = function (config) {
	let self = this
	self.config = config

	self.status(self.STATUS_WARNING, 'connecting')

	if (self.INTERVAL) {
		clearInterval(self.INTERVAL)
		self.INTERVAL = null
	}

	self.init_connection()

	self.init_actions()
	self.init_feedbacks()
	self.init_variables()
	self.init_presets()

	self.checkVariables()
	self.checkFeedbacks()
}

// When module gets deleted
instance.prototype.destroy = function () {
	let self = this

	if (self.udp !== undefined) {
		self.udp.destroy()
		delete self.udp
	}

	if (self.INTERVAL) {
		clearInterval(self.INTERVAL)
		self.INTERVAL = null
	}

	debug('destroy', self.id)
}

instance.prototype.init_connection = function () {
	let self = this

	if (self.config.host !== undefined) {
		if (self.udp !== undefined) {
			self.udp.destroy()
			delete self.udp
		}

		self.udp = new udp(self.config.host, 7372)
		setTimeout(self.checkConnection.bind(this), 10000)

		self.udp.on('error', (err) => {
			self.debug('Network error', err)
			if (self.currentStatus != 2) {
				self.status(self.STATE_ERROR, err)
				self.log('error', 'Network error: ' + err.message)
			}
		})

		self.udp.on('data', (data) => {
			if (self.currentStatus != 0) {
				this.log('info', 'Connected to a TimeMachines Clock.')
				self.status(self.STATE_OK)
			}

			self.CONNECTED = true
			self.DEVICEINFO.connection = 'Connected'
			self.setVariable('connection', 'Connected')
			let hexString = data.toString('hex')
			if (hexString.length == 80) {
				//this is the main settings information
				self.updateData(Uint8Array.from(data))
			}
			if (!self.INTERVAL && self.config.interval > 0) {
				self.setupInterval()
			}
		})

		self.getInformation()
	}
}

instance.prototype.checkConnection = function () {
	let self = this

	if (!self.CONNECTED) {
		if (self.currentStatus != 2) {
			self.status(self.STATE_ERROR)
			self.log('error', 'Failed to receive response from device. Is this the right IP address?')
		}
		self.setVariable('connection', 'Error - See Log')
	}
}

instance.prototype.setupInterval = function () {
	let self = this

	self.stopInterval()

	if (self.config.interval > 0) {
		self.INTERVAL = setInterval(self.getInformation.bind(self), self.config.interval)
		self.debug(`Starting Update Interval: Every ${self.config.interval}ms`)
	}
}

instance.prototype.stopInterval = function () {
	let self = this

	if (self.INTERVAL !== null) {
		self.debug('Stopping Update Interval.')
		clearInterval(self.INTERVAL)
		self.INTERVAL = null
	}
}

instance.prototype.getInformation = function () {
	//Get all information from Device
	let self = this

	if (self.udp) {
		self.udp.send(Buffer.from('A104B2', 'hex'))
	}
}

instance.prototype.updateData = function (bytes) {
	let self = this

	function bytesToAscii(byteArray) {
		const bytesString = String.fromCharCode(...byteArray)
		return bytesString
	}

	let type = bytes[0]

	let model = ''

	switch (type) {
		case 1:
			model = 'POE'
			break
		case 2:
			model = 'Wifi'
			break
		case 3:
			model = 'DotMatrix'
			break
		case 4:
			model = 'TM1000A'
			self.status(self.STATE_ERROR)
			self.log('error', 'This model type is not implemented in this module at this time.')
			self.stopInterval()
			break
		case 5:
			model = 'TM2000A'
			self.status(self.STATE_ERROR)
			self.log('error', 'This model type is not implemented in this module at this time.')
			self.stopInterval()
			break
	}

	self.DEVICEINFO.model = model

	if (bytes[0] <= 3) {
		//it's a POE, Wifi, or Dot Matrix model and uses the following bytes structure
		let name = bytesToAscii(bytes.slice(23)).replace(/\\x00/g, '')
		let firmware = bytes[11] + '.' + bytes[12]
		let timer =
			bytes[15].toString().padStart(2, '0') +
			':' +
			bytes[16].toString().padStart(2, '0') +
			':' +
			bytes[17].toString().padStart(2, '0')
		let timerSeconds = bytes[17].toString()

		self.DEVICEINFO.name = name
		self.DEVICEINFO.firmware = firmware
		self.DEVICEINFO.timer = timer
		self.DEVICEINFO.timerSeconds = timerSeconds

		let modeBits = bytes[19].toString(2).padStart(8, '0')

		if (modeBits === '00000000') {
			//time mode
			self.DEVICEINFO.displayMode = 'timeofday'
			self.DEVICEINFO.displayModeFriendly = 'Time Of Day'

			self.DEVICEINFO.timerState = ''
			self.DEVICEINFO.timerStateFriendly = ''
		} else {
			let displayModeBits = modeBits.substring(5)

			if (displayModeBits == '001') {
				self.DEVICEINFO.displayMode = 'countup'
				self.DEVICEINFO.displayModeFriendly = 'Count Up'
			} else if (displayModeBits == '010') {
				self.DEVICEINFO.displayMode = 'countdown'
				self.DEVICEINFO.displayModeFriendly = 'Count Down'
			} else if (displayModeBits == '011') {
				self.DEVICEINFO.displayMode = 'interval_countup'
				self.DEVICEINFO.displayModeFriendly = 'Interval Count Up'
			} else if (displayModeBits == '100') {
				self.DEVICEINFO.displayMode = 'interval_countdown'
				self.DEVICEINFO.displayModeFriendly = 'Interval Count Down'
			} else {
				self.DEVICEINFO.displayMode = 'unknown'
				self.DEVICEINFO.displayModeFriendly = 'Unknown'
			}

			let stateBits = modeBits.substring(1, 2)
			if (stateBits === '1') {
				self.DEVICEINFO.timerState = 'running'
				self.DEVICEINFO.timerStateFriendly = 'Running'
			} else {
				self.DEVICEINFO.timerState = 'stopped'
				self.DEVICEINFO.timerStateFriendly = 'Stopped'
			}
		}
	}

	self.checkFeedbacks()
	self.checkVariables()
}

// ##########################
// #### Instance Presets ####
// ##########################
instance.prototype.init_presets = function () {
	this.setPresetDefinitions(presets.setPresets.bind(this)())
}

// ############################
// #### Instance Variables ####
// ############################
instance.prototype.init_variables = function () {
	this.setVariableDefinitions(variables.setVariables.bind(this)())
}

// Setup Initial Values
instance.prototype.checkVariables = function () {
	variables.checkVariables.bind(this)()
}

// ############################
// #### Instance Feedbacks ####
// ############################
instance.prototype.init_feedbacks = function (system) {
	this.setFeedbackDefinitions(feedbacks.setFeedbacks.bind(this)())
}

// ##########################
// #### Instance Actions ####
// ##########################
instance.prototype.init_actions = function (system) {
	this.setActions(actions.setActions.bind(this)())
}

instance.prototype.setCountUpTimerMode = function (mode) {
	let self = this

	let hexstring = ''

	switch (mode) {
		case 'sec':
			hexstring = 'A20100'
			break
		case 'tsec':
			hexstring = 'A20000'
			break
	}

	if (hexstring !== '') {
		self.udp.send(Buffer.from(hexstring, 'hex'))
	}

	self.DEVICEINFO.timerMode = 'up'
}

instance.prototype.controlCountUpTimer = function (command) {
	let self = this

	let hexstring = ''

	switch (command) {
		case 'pause':
			hexstring = 'A30000'
			break
		case 'start':
			hexstring = 'A30100'
			break
	}

	if (hexstring !== '') {
		self.udp.send(Buffer.from(hexstring, 'hex'))
	}

	self.DEVICEINFO.timerState = command
}

instance.prototype.resetCountUpTimer = function (mode) {
	let self = this

	let hexstring = ''

	switch (mode) {
		case 'sec':
			hexstring = 'A40100'
			break
		case 'tsec':
			hexstring = 'A40000'
			break
	}

	if (hexstring !== '') {
		self.udp.send(Buffer.from(hexstring, 'hex'))
	}
}

instance.prototype.setCountDownTimerMode = function (
	mode,
	hours,
	minutes,
	seconds,
	tseconds,
	alarmEnable,
	alarmDuration
) {
	let self = this

	let hexstring = ''

	switch (mode) {
		case 'sec':
			hexstring = 'A501'
			break
		case 'tsec':
			hexstring = 'A500'
			break
	}

	hexstring += parseInt(hours).toString(16).padStart(2, '0')
	hexstring += parseInt(minutes).toString(16).padStart(2, '0')
	hexstring += parseInt(seconds).toString(16).padStart(2, '0')
	hexstring += parseInt(tseconds).toString(16).padStart(2, '0')

	if (alarmEnable) {
		hexstring += parseInt(1).toString(16).padStart(2, '0')
		hexstring += parseInt(alarmDuration).toString(16).padStart(2, '0')
	} else {
		hexstring += parseInt(0).toString(16).padStart(2, '0')
		hexstring += parseInt(0).toString(16).padStart(2, '0')
	}

	if (hexstring !== '') {
		self.udp.send(Buffer.from(hexstring, 'hex'))
	}

	self.DEVICEINFO.timerMode = 'down'
}

instance.prototype.controlCountDownTimer = function (command) {
	let self = this

	let hexstring = ''

	switch (command) {
		case 'pause':
			hexstring = 'A60000'
			break
		case 'start':
			hexstring = 'A60100'
			break
	}

	if (hexstring !== '') {
		self.udp.send(Buffer.from(hexstring, 'hex'))
	}

	self.DEVICEINFO.timerState = command
}

instance.prototype.resetCountDownTimer = function (
	mode,
	hours,
	minutes,
	seconds,
	tseconds,
	alarmEnable,
	alarmDuration
) {
	let self = this

	let hexstring = ''

	switch (mode) {
		case 'sec':
			hexstring = 'A701'
			hexstring += parseInt(hours).toString(16).padStart(2, '0')
			hexstring += parseInt(minutes).toString(16).padStart(2, '0')
			hexstring += parseInt(seconds).toString(16).padStart(2, '0')
			break
		case 'tsec':
			hexstring = 'A700'
			hexstring += parseInt(minutes).toString(16).padStart(2, '0')
			hexstring += parseInt(seconds).toString(16).padStart(2, '0')
			hexstring += parseInt(tseconds).toString(16).padStart(2, '0')
			break
	}

	if (alarmEnable) {
		hexstring += parseInt(1).toString(16).padStart(2, '0')
		hexstring += parseInt(alarmDuration).toString(16).padStart(2, '0')
	} else {
		hexstring += parseInt(0).toString(16).padStart(2, '0')
		hexstring += parseInt(0).toString(16).padStart(2, '0')
	}

	if (hexstring !== '') {
		self.udp.send(Buffer.from(hexstring, 'hex'))
	}
}

instance.prototype.showTimeOfDay = function () {
	let self = this

	self.udp.send(Buffer.from('A80100', 'hex'))

	self.DEVICEINFO.timerMode = 'tod'
}

instance.prototype.setUpTimerWhileRunning = function (hours, minutes, seconds, tseconds, hseconds) {
	let self = this

	let hexstring = 'AA'

	hexstring += parseInt(hours).toString(16).padStart(2, '0')
	hexstring += parseInt(minutes).toString(16).padStart(2, '0')
	hexstring += parseInt(seconds).toString(16).padStart(2, '0')
	hexstring += parseInt(tseconds).toString(16).padStart(2, '0')
	hexstring += parseInt(hseconds).toString(16).padStart(2, '0')

	if (hexstring !== '') {
		self.udp.send(Buffer.from(hexstring, 'hex'))
	}
}

instance.prototype.setDownTimerWhileRunning = function (hours, minutes, seconds, tseconds, hseconds) {
	let self = this

	let hexstring = 'AB'

	hexstring += parseInt(hours).toString(16).padStart(2, '0')
	hexstring += parseInt(minutes).toString(16).padStart(2, '0')
	hexstring += parseInt(seconds).toString(16).padStart(2, '0')
	hexstring += parseInt(tseconds).toString(16).padStart(2, '0')
	hexstring += parseInt(hseconds).toString(16).padStart(2, '0')

	if (hexstring !== '') {
		self.udp.send(Buffer.from(hexstring, 'hex'))
	}
}

instance.prototype.modifyTimerWhileRunning = function (mode, hours, minutes, seconds) {
	//used to increase/decrease a timer while it is still running
	let self = this

	if (self.DEVICEINFO.timer.indexOf(':')) {
		let currentTimerArray = self.DEVICEINFO.timer.split(':')

		let currentHours = parseInt(currentTimerArray[0])
		let currentMinutes = parseInt(currentTimerArray[1])
		let currentSeconds = parseInt(currentTimerArray[2])

		let newHours = currentHours
		let newMinutes = currentMinutes
		let newSeconds = currentSeconds

		if (mode == 'increase') {
			newHours = currentHours + parseInt(hours)
			newMinutes = currentMinutes + parseInt(minutes)
			newSeconds = currentSeconds + parseInt(seconds)

			if (newSeconds > 59) {
				newMinutes++
				newSeconds = 0
			}

			if (newMinutes > 59) {
				newHours++
				newMinutes = 0
			}
		} else if (mode == 'decrease') {
			newHours = currentHours - parseInt(hours)
			newMinutes = currentMinutes - parseInt(minutes)
			newSeconds = currentSeconds - parseInt(seconds)

			if (newSeconds < 0) {
				newMinutes--
				newSeconds = 59
			}

			if (newMinutes < 0) {
				newHours--
				newMinutes = 59
			}
		}

		if (self.DEVICEINFO.timerMode == 'up' || self.DEVICEINFO.displayMode == 'countup') {
			self.setUpTimerWhileRunning(newHours, newMinutes, newSeconds, 0, 0)
		} else if (self.DEVICEINFO.timerMode == 'down' || self.DEVICEINFO.displayMode == 'countdown') {
			self.setDownTimerWhileRunning(newHours, newMinutes, newSeconds, 0, 0)
		} else {
			self.log('warn', 'Unable to modify Timer: Clock not in Up/Down Timer mode.')
		}
	} else {
		self.log('warn', 'Unable to modify Timer: No Current Time Data Available. Is there a Timer running?')
	}
}

instance.prototype.executeStoredProgram = function (program) {
	let self = this

	let hexstring = 'B8'

	hexstring += parseInt(program).toString(16).padStart(2, '0')

	if (hexstring !== '') {
		self.udp.send(Buffer.from(hexstring, 'hex'))
	}
}

instance.prototype.controlRelay = function (seconds) {
	let self = this

	let hexstring = 'B4'

	hexstring += parseInt(seconds).toString(16).padStart(2, '0')

	self.udp.send(Buffer.from(hexstring, 'hex'))
}

instance.prototype.setDisplayBrightness = function (digit, dot) {
	let self = this

	let hexstring = ''

	dig_bright_hex = parseInt(digit).toString(16).padStart(2, '0')
	dot_bright_hex = parseInt(dot).toString(16).padStart(2, '0')

	hexstring = 'B5' + dig_bright_hex + dot_bright_hex

	self.udp.send(Buffer.from(hexstring, 'hex'))
}

instance.prototype.setDisplayColor = function (color_mmss, color_hh) {
	let self = this

	let hexstring = ''

	let mmss_r_hex = '00'
	let mmss_g_hex = '00'
	let mmss_b_hex = '00'

	let hh_r_hex = '00'
	let hh_g_hex = '00'
	let hh_b_hex = '00'

	let color_mmss_obj = self.COLORTABLE.find((CLR) => CLR.id == color_mmss)

	if (color_mmss_obj) {
		mmss_r_hex = parseInt(color_mmss_obj.r).toString(16).padStart(2, '0')
		mmss_g_hex = parseInt(color_mmss_obj.g).toString(16).padStart(2, '0')
		mmss_b_hex = parseInt(color_mmss_obj.b).toString(16).padStart(2, '0')
	}

	let color_hh_obj = self.COLORTABLE.find((CLR) => CLR.id == color_hh)

	if (color_hh_obj) {
		hh_r_hex = parseInt(color_hh_obj.r).toString(16).padStart(2, '0')
		hh_g_hex = parseInt(color_hh_obj.g).toString(16).padStart(2, '0')
		hh_b_hex = parseInt(color_hh_obj.b).toString(16).padStart(2, '0')
	}

	hexstring = 'B6' + mmss_r_hex + mmss_g_hex + mmss_b_hex + hh_r_hex + hh_g_hex + hh_b_hex

	self.udp.send(Buffer.from(hexstring, 'hex'))
}

instance_skel.extendedBy(instance)
exports = module.exports = instance
