import { actions } from './actions'

const initialState = []

export default function rootReducer(state = initialState, action) {
	switch(action.type) {
		case actions.ADD_CITY: {
			return [...state, action.payload.city]
		}
		
		case actions.REMOVE_CITY: {
			return state.filter(city => city.name !== action.payload.name)
		}

		default: return state
	}
}


