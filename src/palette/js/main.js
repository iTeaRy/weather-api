import '../css/style.css';
import '../css/style.scss';
import  {weatherWidget} from './weather_widget';
import { API_KEY_WEATHER, API_KEY_IP, API_KEY_IMAGE, languageConfig } from './constans';
let weatherData = {};
let language = 'en';
let unitsTemp = 'c';
let recognition = {};
let localCity = '';
document.addEventListener("DOMContentLoaded", initApp);


function getCityByIP() {
    return fetch(`https://ipinfo.io/json?token=${API_KEY_IP}`)
        .then(response => response.json())
        .then(data => data.city)
        .then(city => getWeatherByCityName(city));

}


function getWeatherByCityName (city) {
    localCity = city;
    return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=${language}&units=metric&APPID=${API_KEY_WEATHER}`)
        .then(response => weatherData = response.json())
        .catch(error => alert(`${error.message} '\n Number of requests exceeded`));
}




function initApp() {
    getCityByIP()
        .then(data => {
                weatherWidget(data, language,unitsTemp, 'unit');
            }
        )
        .then(refreshClick)
        .then (voiceInit)
        .then(setHandler)


}

function refreshClick() {
    return fetch(`https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=town,${localCity}&client_id=${API_KEY_IMAGE}`)
        .then(response => response.json())
        .then(image => {
            if (image) {
                document.querySelector('body').style.background = `url(${image.urls.regular}) no-repeat`;
                document.querySelector('body').style.backgroundSize = 'cover';
            }


        })


}

function changeLangClick(event) {
    let target = event.target;
    if (target.tagName != 'P') return;
    language = target.textContent;
    document.querySelector('.settings__btn-language').textContent = target.textContent;
    weatherWidget(weatherData, language, unitsTemp, 'settings');

}

function changeLangHover() {
    const content = document.querySelector('.settings__btn-language-content');
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }

}
function searchClick() {
    getWeatherByCityName(document.querySelector('.search__input').value)
        .then(data => {
            weatherWidget(data,language,unitsTemp,'search');
            refreshClick();
        })
        .then(setHandler)
        .catch(error => {
            alert('Wrong request, try to change language or check name or city');
            initApp();
        });
}


function unitsTempClick(event) {
    document.querySelector(`#${unitsTemp}`).classList.remove('selected-unit');
    unitsTemp = event.target.id;
    weatherWidget(weatherData, language, unitsTemp, 'settings');
    event.target.classList.add('selected-unit');

}

function voiceInit() {

    try {
         recognition = new webkitSpeechRecognition();
    } catch (e) {
         recognition = Object;
    }
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = function (event) {
        let txtRec = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            txtRec += event.results[i][0].transcript;
        }
        document.querySelector('.search__input').focus();
        document.querySelector('.search__input').value =txtRec;

    };
}

function voiceClick() {
    document.querySelector('.search__input').placeholder = 'Удерживайте кнопку';
    recognition.lang = languageConfig[language].voice;
    recognition.start();
}

function endVoice() {
    recognition.stop();
}
function isEnter(e) {
     if (e.key === 'Enter') {
         searchClick()
     }
}
function setHandler() {
    document.querySelector('.settings__btn-refresh').onclick = refreshClick;
    document.querySelector('.search__submit').onclick = searchClick;
    document.querySelector('.settings__btn-language-area').onmouseover = document.querySelector('.settings__btn-language-area').onmouseout =  changeLangHover;
    document.querySelector('.settings__btn-language-content').onclick = changeLangClick;
    document.querySelector('.search__voice').onmousedown = voiceClick;
    document.querySelector('.search__voice').onmouseup = document.querySelector('.search__voice').onmouseout = endVoice;
    document.querySelectorAll ('.settings__btn-temperature').forEach(( element )=>element.onclick = unitsTempClick);
    document.onkeypress = isEnter;
}
