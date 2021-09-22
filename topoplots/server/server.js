const { Notion } = require("@neurosity/notion");
require("dotenv").config();
const topogrid = require('topogrid')

const server = require('http').createServer();

const io = require('socket.io')(server, {
  transports: ['websocket', 'polling']
});

const deviceId = process.env.DEVICE_ID2 || "";
const email = process.env.EMAIL || "";
const password = process.env.PASSWORD || "";

const verifyEnvs = (email, password, deviceId) => {
    const invalidEnv = (env) => {
        return env === "" || env === 0; // returns boolean
      };

    if (invalidEnv(email) || invalidEnv(deviceId) || invalidEnv(password)) {
        console.error("Please verify deviceId, email and password are in .env file, quitting...");
        process.exit(0)
    }
};

const notion = new Notion({
    deviceId
});

const login = async () => {

    try { 
        await notion
        .login({
            email,
            password
        })
    } catch(error) {
        console.log(error)
        throw new Error(error);
    }

    console.log("Logged in")
};

const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

const reductiveMean = (arr) => {
    averageVector = []
    for (const elec of arr) {
        averageVector.push(average(elec))
    }
    // console.log(averageVector)
    return averageVector
}

function vectorAddition (first, last) { return last.map((v, i) => v+first[i]) }

function vectorAverage (psd, elec=1) {
    
    let lastVector = psd[psd.length-1]
    let firstVector = psd[0]

    // console.log(psd.length)
  
    let nextSum = vectorAddition(firstVector, lastVector)

    // console.log(nextSum.length)
    
    // console.log(nextSum)
    if (psd.length-1 > 0) {
        let newPsd = psd.slice(1, psd.length-1).concat([nextSum])
        // console.log(newPsd.length)
        return vectorAverage(newPsd, elec+1)
    } else {
        // console.log(psd)
        return psd[0].map(v => v/elec+1)

    }


}

const calcInterp = (data, size) => {
    // x coordinates of the data
    const pos_x = [1,2,3,4,5,6,7,8];

    // y coordinates of the data
    const pos_y = [1,2,3,4,5,6,7,8];

    // the data values
    // const data1 = [0.75, 0.2, 0.99, 0.1, 0.6, 0.8, 0.9, 0.8];
    // console.log(data)

    const grid_params = [0,size-1,size];

    zi = topogrid.create(pos_x,pos_y,data,grid_params);
    // console.log(data, zi)

    const calcColor = (min, max, val) => {
        let ratio = 2 * (val-min) / (max - min)
        b = Math.round(Math.max(0, 255*(1-ratio)))
        r = Math.round(Math.max(0, 255*(ratio-1)))
        g = 255-b-r
        return [r, g, b]
    }

    const merged =  [].concat.apply([], zi)
    const min = Math.min( ...merged )
    const max = Math.max( ...merged )

    rgbZi = []

    for (const point of zi) {
        pointRgb = []
        for (const val of point) {
            let rgb = calcColor(min, max, val)
            // console.log(rgb)
            pointRgb.push(rgb)
        }
        rgbZi.push(pointRgb)
    }

    return rgbZi
}


// notion.brainwaves("psd").subscribe(brainwaves => {
//     // str = JSON.stringify(brainwaves.psd, null, 4); 
//     // console.log(brainwaves.psd.length);
//     const psd = brainwaves.psd
//     const elecMean = reductiveMean(psd)
//     // const rgbVal = calcInterp(elecMean)
//     const rgbVal = [].concat(...calcInterp(elecMean));

// })

console.log("connected")
verifyEnvs(email, password, deviceId)

console.log(`${email} attempting to authenticate to ${deviceId}`);
login();

// io.on('connection', client => {

//     notion.brainwaves("psd").subscribe(brainwaves => {
//         // str = JSON.stringify(brainwaves.psd, null, 4); 
//         // console.log(brainwaves.psd.length);
//         const psd = brainwaves.psd
//         const elecMean = reductiveMean(psd)
//         // const rgbVal = calcInterp(elecMean)
//         const rgbVal = [].concat(...calcInterp(elecMean));

//         client.emit('rgb', rgbVal)
    
//     })

let dim = 20;

io.on('connection', socket => {

    socket.on('change-dim', value => {
        dim = value;
        // console.log(dim)
      })

    notion.brainwaves("powerByBand").subscribe(brainwaves => {
        // str = JSON.stringify(brainwaves.psd, null, 4); 
        // console.log(brainwaves.psd.length);
        // console.log(dim)
        const alpha = brainwaves.data.alpha
        const rgbVal = [].concat(...calcInterp(alpha, dim));

        socket.emit('rgb', rgbVal)
    
    })
    
});

server.listen(4000);