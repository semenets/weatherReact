export const actions = {
    ADD_CITY: 'ADD_CITY',
    REMOVE_CITY: 'REMOVE_CITY'
}

export const addCity = (name, country) => ({
    type: actions.ADD_CITY,
    payload: {
        city: {
            name,
            country,
        }
    }
})

export const removeCity = name => ({
    type: actions.REMOVE_CITY,
    payload: {
        name,
    }
})
