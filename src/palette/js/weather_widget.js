import {languageConfig} from './constans'
import { setMap } from "./map";
let language = 'en';
const options = { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
let date = new Date();

export function weatherWidget(data, lang, tempConfig, event) {
    const wrapper = document.querySelector('.wrapper');
    if (data) {
        switch (event) {
            case 'unit': {
                wrapper.append(drawTuneUp(data, lang));
                wrapper.append(drawMap(data, lang, true));
                wrapper.append(drawData(data, lang, tempConfig));
                setMap(data.city.coord.lat,data.city.coord.lon);
                break;
            }
            case 'settings': {
                const weatherData = document.querySelector('.data');
                data.then(localData => {
                    weatherData.replaceWith(drawData(localData, lang,tempConfig));
                    drawMap(localData, lang, false);

                });
                break;
            }
            case 'search': {
                const weatherData = document.querySelector('.data');
                const weatherMap = document.querySelector('.map');
                weatherMap.replaceWith(drawMap(data, lang, true));
                weatherData.replaceWith(drawData(data, lang, tempConfig));
                setMap(data.city.coord.lat,data.city.coord.lon);
                break;
            }
        }
        setInterval(timer,1000);
    }

}

function timer() {
    let date = new Date();
    document.querySelector('.data__date').textContent = `${languageConfig[language].weekday.shot[date.getDay()]} ${date.toLocaleString(language, options)}`;
}

function drawTuneUp() {
    const tuneUp = document.createElement('div');
    tuneUp.className = 'tune-up';
    tuneUp.innerHTML = `
        <div class="settings">
            <div class="settings__btn-refresh button-hover" id="refresh">⅁</div>
            <div class="settings__btn-language-area">
                <button type="button" class="settings__btn-language button-hover">en</button>
                <div class="settings__btn-language-content">
                    <p class="button-hover">en</p>
                    <p class="button-hover">ru</p>
                    <p class="button-hover">be</p>
                </div>
            </div>
            
            <div class="settings__btn-temperature button-hover selected-unit" id="c">C</div>
            <div class="settings__btn-temperature button-hover" id="f">F</div>
            </div>
            <div class="search">
            <input class="search__input" type="text" placeholder="Search city or ZIP"  x-webkit-speech >
            <div class="search__voice button-hover"> <div> </div> </div>
            <div class="search__submit button-hover">Search</div>
        </div>
    `;
    return tuneUp;
}

function drawData(data, lang, tempConfig) {
    language = lang;
    const showWeather = document.createElement('div');
    showWeather.className = 'data';
    showWeather.innerHTML = `
            <div class="data__city">${data.city.name}, ${data.city.country}</div>
            <div class="data__date">${languageConfig[lang].weekday.shot[date.getDay()]} ${date.toLocaleString(lang, options)}</div>
            <div class="data__weather">
                <div class="data__weather_temperature">${correctUnits(tempConfig, data.list[0].main.temp)}</div>
                <div class="data__weather_icon">
                    <span>°</span>
                    <img src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${data.list[0].weather[0].icon}.png" alt="weather" width="200px" height="200px">
                </div>
                <div class="data__weather_other-data">
                    <div>${data.list[0].weather[0].description.toUpperCase()}</div>
                    <div>${languageConfig[lang].humidity} ${data.list[0].main.humidity}</div>
                    <div>${languageConfig[lang].pressure} ${data.list[0].main.pressure}</div>
                    <div>${languageConfig[lang].windSpeed} ${data.list[0].wind.speed} ${languageConfig[lang].wind}</div> 
                </div>
            </div>
            <div class="data__three-days">
                <div class="data__three-days_day">
                    <div>${languageConfig[lang].weekday.full[date.getDay()%7+1]}</div>
                    ${correctUnits(tempConfig, data.list[7].main.temp)}°
                    <img src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${data.list[7].weather[0].icon}.png" alt="weather" width="40px" height="40px">
                </div>
                <div class="data__three-days_day">
                    <div>${languageConfig[lang].weekday.full[date.getDay()%7+2]}</div>
                    ${correctUnits(tempConfig, data.list[14].main.temp)}°
                    <img src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${data.list[14].weather[0].icon}.png" alt="weather" width="40px" height="40px">
                </div>
                <div class="data__three-days_day">
                    <div>${languageConfig[lang].weekday.full[date.getDay()%7+3]}</div>
                    ${correctUnits(tempConfig, data.list[21].main.temp)}°
                    <img src="https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${data.list[21].weather[0].icon}.png" alt="weather" width="40px" height="40px">
                </div>
            </div>
    `;
    return showWeather;
}

function drawMap(data, lang, draw) {
    const showMap = document.createElement('div');
    if (draw) {
        showMap.className = 'map';
        showMap.innerHTML = `
        <div id='map'></div>
        <div class="map__cord">${languageConfig[lang].cord[0]}${data.city.coord.lat} </div>
        <div class="map__cord">${languageConfig[lang].cord[1]}${data.city.coord.lon}</div>
    `;
        return showMap;
    } else {
        const coords = document.querySelectorAll('.map__cord');
        coords[0].textContent = `${languageConfig[lang].cord[0]}${data.city.coord.lat}`;
        coords[1].textContent = `${languageConfig[lang].cord[1]}${data.city.coord.lon}`;
        return;
    }


}

function correctUnits(config, temperature) {
    return config === 'c'? Math.floor(temperature) : Math.floor(temperature *9 / 5 + 32);
}

