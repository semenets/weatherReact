import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import moment from 'moment'
import Loader from 'react-loader-spinner'
import { API_KEY } from './contants'
import './City.css';

class City extends PureComponent {
    state = {
        weather: {
            clouds: {},
            main: {},
            weather: [{}],
            sys: {},
        },
        list: [],
        isWeatherLoading: true,
        isForecastLoading: true,
    }

    getForecast = async () => {
        const { cityName } = this.props.match.params

        const result = await
        fetch (`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`)
        const data = await result.json();
        if(result.status === 404) {
            window.location = "/"
        } else {
            this.setState({
                list: data.list,
                isForecastLoading: false
            })
        }
    }
    
    getCurrentWeather = async () => {
        const { cityName } = this.props.match.params

        const result = await
        fetch (`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=ru`)
        const data = await result.json();

        this.setState({
            weather: data,
            isWeatherLoading: false
        })
    }
    
    componentDidMount = () => {
        this.getForecast()
        this.getCurrentWeather()
    }

    render() {
        const { weather, list, isWeatherLoading, isForecastLoading } = this.state

        const convertedData = list.map(day => {
            return {
                dt: day.dt,
                temp: day.main.temp,
                date: moment(day.dt * 1000).format("DD.MM-hh:mm")
            }
        })

        return <div>
            <div className="back">
                <Link to='/'>Назад к списку городов</Link>
            </div>
            {isWeatherLoading ?
                <div className="loader">
                    <Loader
                        type="Circles"
                        color="#00BFFF"
                        height="50"	
                        width="50"
                    />
                </div>
                : <div className="now">
                    <div className="city-name">{weather.name}</div>
                    <div className="details">
                        <div className="temperature">{weather.main.temp} °C</div>
                        <div className="description">{weather.weather[0].description}</div>
                        <div className="info">
                            <span>Влажность: {weather.main.humidity}% </span>
                            <span>Облачность: {weather.clouds.all}% </span>
                            <span>Давление: {weather.main.pressure} </span>
                        </div>
                        <div className="info">
                            <span>min: {weather.main.temp_min} °C</span>
                            <span>max: {weather.main.temp_max} °C</span>
                        </div>
                    </div>
                </div>
            }

            <div className="forecast">Прогноз погоды на 5 дней</div>

            {isForecastLoading
                ? <div className="loader">
                    <Loader
                        type="Circles"
                        color="#00BFFF"
                        height="50"	
                        width="50"
                    />
                </div>
                : <div className="chart">
                    <LineChart
                        width={1000}
                        height={300}
                        data={convertedData}
                    >
                        <XAxis dataKey="date"/>
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend />
                        <Line type="monotone" dataKey="temp" stroke="#8884d8" activeDot={{r: 8}}/>
                    </LineChart>
                </div>
            }
        </div>
    }
}

export default City

