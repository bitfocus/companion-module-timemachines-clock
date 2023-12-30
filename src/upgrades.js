export default [
	function v2_1_0(context, props) {
		let changes = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}

		for (const action of props.actions) {
			if (action.actionId === 'displayColors') {
				action.options.custom_hh_r = 255
				action.options.custom_hh_g = 255
				action.options.custom_hh_b = 255
				action.options.custom_mmss_r = 255
				action.options.custom_mmss_g = 255
				action.options.custom_mmss_b = 255
				changes.updatedActions.push(action)
			}
		}

		return changes
	},
]
