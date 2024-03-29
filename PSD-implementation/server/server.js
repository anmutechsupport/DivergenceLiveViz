const server = require('http').createServer();

const io = require('socket.io')(server, {
  transports: ['websocket', 'polling']
});

// const io = require("socket.io")(3000, {
//     rejectUnauthorized: false,
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"]
//     },
//     allowEIO3: true
//   });

const { Notion } = require("@neurosity/notion");
require("dotenv").config();

const deviceId = process.env.DEVICE_ID || "";
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

const history = []

const rollingMean = (emitObj) => {
    // console.log(history)
    history.push(emitObj)
    const newEmit = {}
    const keys = Object.keys(emitObj)
    if (history.length > 3) {
        history.shift();
    }

    newEmit[keys[0]] = emitObj[keys[0]]

    if (history.length === 3){
        // console.log(history)
        for (const key of keys.slice(1)) {
            const keyArr = []
            for (const epoch of history) {
                // console.log(epoch)
                keyArr.push(epoch[key])
            }
            newEmit[key] = vectorAverage(keyArr)
        }

        return newEmit
    } else {
        return emitObj
    }
    
}

console.log("connected")
verifyEnvs(email, password, deviceId)

console.log(`${email} attempting to authenticate to ${deviceId}`);
login();

notion.brainwaves("raw").subscribe(brainwaves => {
    str = JSON.stringify(brainwaves, null, 4); 
    console.log(str);
})