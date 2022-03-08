const Waves = require("@waves/waves-transactions")
const axios = require("axios")

let accountAdress = "3Mr1sN5vhc3mZzn69gWUETaLJ64WbMxv6Lv"
let seedPhrase = "accuse omit view antenna offer citizen cube grunt act shoulder engage wheel turkey daring organ"
const nodeUrl = 'https://nodes-testnet.wavesnodes.com';

let dataToReceive = {
    lon: 0,
    lat: 0,
    weather: "",
    temp: 0,
    dt: 0
}

let dataToSend = {
    lat: -23.576475710067246,
    lon: -46.631045708966504,
    appid: '63b8e7286fb4229fac8958bf92033a19'
}

const url = "https://api.openweathermap.org/data/2.5/weather";

const getDataFromWeatherAPI = async function () {
    const response = await axios.get(url,
        {
            params: dataToSend
        });

    return {
        lon: response.data.coord.lon,
        lat: response.data.coord.lat,
        weather: response.data.weather[0].description,
        temp: response.data.main.temp,
        dt: response.data.dt
    }
}

const sendTransactionToBlockchain = async function () {
    let data = await getDataFromWeatherAPI();
    console.log(data);

    try{
        const assignedTx = Waves.data(
            { data:[
                { "key": "lon", "value": data.lon.toString(), "type": "string" },
                { "key": "lat", "value": data.lon.toString(), "type": "string" },
                { "key": "weather", "value": data.weather, "type": "string" },
                { "key": "temp", "value": data.temp.toString(), "type": "string" },
                { "key": "dt", "value": data.dt, "type": "integer" }
            ],
            chainId: 'T'}, seedPhrase
        );

        const tx = await Waves.broadcast(assignedTx, nodeUrl);
        await Waves.waitForTx(tx);
        console.log(tx);
    }catch(ex){
        console.log(ex);
    }
}

setInterval(sendTransactionToBlockchain, 1000 * 5);