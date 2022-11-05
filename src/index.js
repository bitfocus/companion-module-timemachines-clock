const instance_skel = require('../../../instance_skel')
const udp = require('../../../udp')

const actions = require('./actions')
const presets = require('./presets')
const { updateVariableDefinitions, checkVariables } = require('./variables')
const { initFeedbacks } = require('./feedbacks')

let debug
let log

class instance extends instance_skel {
	constructor(system, id, config) {
		super(system, id, config)

		Object.assign(this, {
			...actions,
			...presets,
		})

		this.updateVariableDefinitions = updateVariableDefinitions
		this.checkVariables = checkVariables
	}

	config_fields() {
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
				regex: this.REGEX_IP,
			},
			{
				type: 'checkbox',
				id: 'polling',
				label: 'Polling (Required for Variables/Feedback)',
				default: true,
			},
		]
	}

	updateConfig(config) {
		this.config = config

		this.status(this.STATUS_WARNING, 'connecting')

		if (this.INTERVAL) {
			clearInterval(this.INTERVAL)
			this.INTERVAL = null
		}

		this.initConnection()

		this.actions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.checkVariables()
		this.checkFeedbacks()
	}

	destroy() {
		if (this.udp !== undefined) {
			this.udp.destroy()
			delete this.udp
		}

		if (this.INTERVAL) {
			clearInterval(this.INTERVAL)
			this.INTERVAL = null
		}

		debug('destroy', this.id)
	}

	init() {
		debug = this.debug
		log = this.log

		this.status(this.STATUS_WARNING, 'Connecting')

		this.INTERVAL = null //used to poll the clock every second
		this.CONNECTED = false //used for friendly notifying of the user that we have not received data yet

		this.DEVICEINFO = {
			connection: '(Connecting)',
			model: '',
			name: '',
			firmware: '',
			display: '00:00:00',
			displayMode: '',
			displayModeFriendly: '',
			timerState: '',
			timerStateFriendly: '',
		}

		this.COLORTABLE = [
			{ id: 'red', label: 'Red', r: 255, g: 0, b: 0 },
			{ id: 'green', label: 'Green', r: 0, g: 255, b: 0 },
			{ id: 'blue', label: 'Blue', r: 0, g: 0, b: 255 },
			{ id: 'cyan', label: 'Cyan', r: 0, g: 255, b: 255 },
			{ id: 'magenta', label: 'Magenta', r: 255, g: 0, b: 255 },
			{ id: 'yellow', label: 'Yellow', r: 255, g: 255, b: 0 },
			{ id: 'white', label: 'White', r: 255, g: 255, b: 255 },
		]

		this.initConnection()

		this.actions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.checkVariables()
		this.checkFeedbacks()
	}

	initVariables() {
		this.updateVariableDefinitions()
	}

	initFeedbacks() {
		const feedbacks = initFeedbacks.bind(this)()
		this.setFeedbackDefinitions(feedbacks)
	}

	initPresets() {
		this.setPresetDefinitions(this.getPresets())
	}

	actions() {
		this.setActions(this.getActions())
	}

	initConnection() {
		if (this.config.host !== undefined) {
			if (this.udp !== undefined) {
				this.udp.destroy()
				delete this.udp
			}

			this.udp = new udp(this.config.host, 7372)
			setTimeout(this.checkConnection.bind(this), 10000)

			this.udp.on('error', (err) => {
				this.debug('Network error', err)
				if (this.currentStatus != 2) {
					this.status(this.STATE_ERROR, err)
					this.log('error', 'Network error: ' + err.message)
				}
			})

			this.udp.on('data', (data) => {
				if (this.currentStatus != 0) {
					this.log('info', 'Connected to a TimeMachines Clock.')
					this.status(this.STATE_OK)
				}

				this.CONNECTED = true
				this.DEVICEINFO.connection = 'Connected'
				this.setVariable('connection', 'Connected')
				let hexString = data.toString('hex')
				if (hexString.length == 80) {
					//this is the main settings information
					this.updateData(Uint8Array.from(data))
				}
				if (!this.INTERVAL && this.config.polling) {
					this.setupInterval()
				}
			})

			this.getInformation()
		}
	}

	checkConnection() {
		if (!this.CONNECTED) {
			if (this.currentStatus != 2) {
				this.status(this.STATE_ERROR)
				this.log('error', 'Failed to receive response from device. Is this the right IP address?')
			}
			this.setVariable('connection', 'Error - See Log')
		}
	}
	setupInterval() {
		this.stopInterval()

		if (this.config.polling) {
			this.INTERVAL = setInterval(this.getInformation.bind(this), 1000)
			this.debug(`Starting Update Interval: Every 1000ms`)
		}
	}

	stopInterval() {
		if (this.INTERVAL !== null) {
			this.debug('Stopping Update Interval.')
			clearInterval(this.INTERVAL)
			this.INTERVAL = null
		}
	}

	getInformation() {
		//Get all information from Device

		if (this.udp) {
			this.udp.send(Buffer.from('A104B2', 'hex'))
		}
	}

	updateData(bytes) {
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
				this.status(this.STATE_ERROR)
				this.log('error', 'This model type is not implemented in this module at this time.')
				this.stopInterval()
				break
			case 5:
				model = 'TM2000A'
				this.status(this.STATE_ERROR)
				this.log('error', 'This model type is not implemented in this module at this time.')
				this.stopInterval()
				break
		}

		this.DEVICEINFO.model = model

		if (bytes[0] <= 3) {
			//it's a POE, Wifi, or Dot Matrix model and uses the following bytes structure
			let name = bytesToAscii(bytes.slice(23)).replace(/\\x00/g, '')
			let firmware = bytes[11] + '.' + bytes[12]
			let display =
				bytes[15].toString().padStart(2, '0') +
				':' +
				bytes[16].toString().padStart(2, '0') +
				':' +
				bytes[17].toString().padStart(2, '0')
			let timerHours = parseInt(bytes[15])
			let timerMinutes = parseInt(bytes[16])
			let timerSeconds = parseInt(bytes[17])
			let totalSeconds = timerHours * 120 + timerMinutes * 60 + timerSeconds

			this.DEVICEINFO.name = name
			this.DEVICEINFO.firmware = firmware
			this.DEVICEINFO.display = display
			this.DEVICEINFO.timerSeconds = totalSeconds

			let modeBits = bytes[19].toString(2).padStart(8, '0')

			if (modeBits === '00000000') {
				//time mode
				this.DEVICEINFO.displayMode = 'timeofday'
				this.DEVICEINFO.displayModeFriendly = 'Time Of Day'

				this.DEVICEINFO.timerState = 'none'
				this.DEVICEINFO.timerStateFriendly = 'None'
			} else {
				let displayModeBits = modeBits.substring(5)

				if (displayModeBits == '001') {
					this.DEVICEINFO.displayMode = 'countup'
					this.DEVICEINFO.displayModeFriendly = 'Count Up'
				} else if (displayModeBits == '010') {
					this.DEVICEINFO.displayMode = 'countdown'
					this.DEVICEINFO.displayModeFriendly = 'Count Down'
				} else if (displayModeBits == '011') {
					this.DEVICEINFO.displayMode = 'interval_countup'
					this.DEVICEINFO.displayModeFriendly = 'Interval Count Up'
				} else if (displayModeBits == '100') {
					this.DEVICEINFO.displayMode = 'interval_countdown'
					this.DEVICEINFO.displayModeFriendly = 'Interval Count Down'
				} else {
					this.DEVICEINFO.displayMode = 'unknown'
					this.DEVICEINFO.displayModeFriendly = 'Unknown'
				}

				let stateBits = modeBits.substring(1, 2)
				if (stateBits === '1') {
					this.DEVICEINFO.timerState = 'running'
					this.DEVICEINFO.timerStateFriendly = 'Running'
				} else {
					this.DEVICEINFO.timerState = 'stopped'
					this.DEVICEINFO.timerStateFriendly = 'Stopped'
				}
			}
		}

		this.checkFeedbacks()
		this.checkVariables()
	}
	setCountUpTimerMode(mode) {
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
			this.udp.send(Buffer.from(hexstring, 'hex'))
		}

		this.DEVICEINFO.timerMode = 'up'
	}

	controlCountUpTimer(command) {
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
			this.udp.send(Buffer.from(hexstring, 'hex'))
		}

		this.DEVICEINFO.timerState = command
	}

	resetCountUpTimer(mode) {
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
			this.udp.send(Buffer.from(hexstring, 'hex'))
		}
	}

	setCountDownTimerMode(mode, hours, minutes, seconds, tseconds, alarmEnable, alarmDuration) {
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
			this.udp.send(Buffer.from(hexstring, 'hex'))
		}

		this.DEVICEINFO.timerMode = 'down'
	}

	controlCountDownTimer(command) {
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
			this.udp.send(Buffer.from(hexstring, 'hex'))
		}

		this.DEVICEINFO.timerState = command
	}

	resetCountDownTimer(mode, hours, minutes, seconds, tseconds, alarmEnable, alarmDuration) {
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
			this.udp.send(Buffer.from(hexstring, 'hex'))
		}
	}

	showTimeOfDay() {
		this.udp.send(Buffer.from('A80100', 'hex'))

		this.DEVICEINFO.timerMode = 'tod'
	}

	setUpTimerWhileRunning(hours, minutes, seconds, tseconds, hseconds) {
		let hexstring = 'AA'

		hexstring += parseInt(hours).toString(16).padStart(2, '0')
		hexstring += parseInt(minutes).toString(16).padStart(2, '0')
		hexstring += parseInt(seconds).toString(16).padStart(2, '0')
		hexstring += parseInt(tseconds).toString(16).padStart(2, '0')
		hexstring += parseInt(hseconds).toString(16).padStart(2, '0')

		if (hexstring !== '') {
			this.udp.send(Buffer.from(hexstring, 'hex'))
		}
	}

	setDownTimerWhileRunning(hours, minutes, seconds, tseconds, hseconds) {
		let hexstring = 'AB'

		hexstring += parseInt(hours).toString(16).padStart(2, '0')
		hexstring += parseInt(minutes).toString(16).padStart(2, '0')
		hexstring += parseInt(seconds).toString(16).padStart(2, '0')
		hexstring += parseInt(tseconds).toString(16).padStart(2, '0')
		hexstring += parseInt(hseconds).toString(16).padStart(2, '0')

		if (hexstring !== '') {
			this.udp.send(Buffer.from(hexstring, 'hex'))
		}
	}

	modifyTimerWhileRunning(mode, hours, minutes, seconds) {
		//used to increase/decrease a timer while it is still running

		if (this.DEVICEINFO.display?.indexOf(':')) {
			let currentTimerArray = this.DEVICEINFO.display.split(':')

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

			if (this.DEVICEINFO.timerMode == 'up' || this.DEVICEINFO.displayMode == 'countup') {
				this.setUpTimerWhileRunning(newHours, newMinutes, newSeconds, 0, 0)
			} else if (this.DEVICEINFO.timerMode == 'down' || this.DEVICEINFO.displayMode == 'countdown') {
				this.setDownTimerWhileRunning(newHours, newMinutes, newSeconds, 0, 0)
			} else {
				this.log('warn', 'Unable to modify Timer: Clock not in Up/Down Timer mode.')
			}
		} else {
			this.log('warn', 'Unable to modify Timer: No Current Time Data Available. Is there a Timer running?')
		}
	}

	executeStoredProgram(program) {
		let hexstring = 'B8'

		hexstring += parseInt(program).toString(16).padStart(2, '0')

		if (hexstring !== '') {
			this.udp.send(Buffer.from(hexstring, 'hex'))
		}
	}
	controlRelay(seconds) {
		let hexstring = 'B4'

		hexstring += parseInt(seconds).toString(16).padStart(2, '0')

		this.udp.send(Buffer.from(hexstring, 'hex'))
	}

	setDisplayBrightness(digit, dot) {
		let hexstring = ''

		let dig_bright_hex = parseInt(digit).toString(16).padStart(2, '0')
		let dot_bright_hex = parseInt(dot).toString(16).padStart(2, '0')

		hexstring = 'B5' + dig_bright_hex + dot_bright_hex

		this.udp.send(Buffer.from(hexstring, 'hex'))
	}
	setDisplayColor(color_mmss, color_hh) {
		let hexstring = ''

		let mmss_r_hex = '00'
		let mmss_g_hex = '00'
		let mmss_b_hex = '00'

		let hh_r_hex = '00'
		let hh_g_hex = '00'
		let hh_b_hex = '00'

		let color_mmss_obj = this.COLORTABLE.find((CLR) => CLR.id == color_mmss)

		if (color_mmss_obj) {
			mmss_r_hex = parseInt(color_mmss_obj.r).toString(16).padStart(2, '0')
			mmss_g_hex = parseInt(color_mmss_obj.g).toString(16).padStart(2, '0')
			mmss_b_hex = parseInt(color_mmss_obj.b).toString(16).padStart(2, '0')
		}

		let color_hh_obj = this.COLORTABLE.find((CLR) => CLR.id == color_hh)

		if (color_hh_obj) {
			hh_r_hex = parseInt(color_hh_obj.r).toString(16).padStart(2, '0')
			hh_g_hex = parseInt(color_hh_obj.g).toString(16).padStart(2, '0')
			hh_b_hex = parseInt(color_hh_obj.b).toString(16).padStart(2, '0')
		}

		hexstring = 'B6' + mmss_r_hex + mmss_g_hex + mmss_b_hex + hh_r_hex + hh_g_hex + hh_b_hex

		this.udp.send(Buffer.from(hexstring, 'hex'))
	}
}
exports = module.exports = instance
