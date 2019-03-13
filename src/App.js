import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import { connect } from 'react-redux'

import { addCity, removeCity } from './actions'
import { API_KEY } from './contants'

class App extends Component {
	state = {
		isDataLoading: false,
		cityNotFound: false 
	}

	constructor(props) {
		super(props)

		const geoSuccess = position => {
			this.addCityByCoordinates(position.coords.latitude, position.coords.longitude)
		}

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(geoSuccess);
		}
	}

	addCityByCoordinates = async (lat, lon) => {
		const { cities, dispatch } = this.props

		const api_url = await
			fetch (`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
		const data = await api_url.json();

		if (cities.find(city => city.name.toLowerCase() === data.name.toLowerCase())) {
			return null
		}

		dispatch(addCity(data.name, data.sys.country))
	}

	addCityByName = async () => {
		const { cities, dispatch } = this.props

		const cityName = this.input.value
		if (!cityName) return null

		if (cities.find(city => cityName.toLowerCase() === city.name.toLowerCase())) {
			return null
		}

		this.setState({ isDataLoading: true })

		const result = await
			fetch (`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`)
		
		if (result.status === 404 ) {
			return this.setState({
				cityNotFound: true,
				isDataLoading: false,
			})
		} 

		const data = await result.json();

		dispatch(addCity(data.name, data.sys.country))
		
		this.setState({
			isDataLoading: false,
			cityNotFound: false,
		})
	}

	removeCity = city => {
		this.props.dispatch(removeCity(city.name))
	}

	render() {
		const { isDataLoading, cityNotFound } = this.state
		const { cities } = this.props

		return (
			<div>
				<h1 className="page-title">Погода</h1>
				<div className="city-input">
					<input type="text" name="city" placeholder="Введите город, например Warsaw или Kiev" ref={input => this.input = input} />
					<button onClick={this.addCityByName}>Добавить город</button>
					
					<div className="error">{cityNotFound && "Город не найден!"}</div>
				</div>
				<div className="cities">
					{cities.map(city => {
						return (<div className="city" key={city.name}>
							<Link to={`city/${city.name}`}>
								<div className="name">{city.name}</div>
								<div>{city.country}</div>
							</Link>
							<button onClick={() => this.removeCity(city)}>Удалить</button>
						</div>
						)
					})}
				</div>
				<div className="spinner">
					{isDataLoading && <Loader
						type="Circles"
						color="#4051d4"
						height="50"	
						width="50"
					/>}  
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	cities: state
})

export default connect(mapStateToProps)(App)

