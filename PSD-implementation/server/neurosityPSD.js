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

verifyEnvs(email, password, deviceId)

console.log(`${email} attempting to authenticate to ${deviceId}`);

const notion = new Notion({
    deviceId
});

const main = async () => {
    await notion
    .login({
        email,
        password
    })
    .catch((error) => {
        console.log(error)
        throw new Error(error);
    });
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

main();

notion.brainwaves("psd").subscribe(brainwaves => {
    // str = JSON.stringify(brainwaves.psd, null, 4); 
    // console.log(brainwaves.psd.length);
    let psd = brainwaves.psd
    console.log(vectorAverage(psd));
})