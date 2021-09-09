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

const vectorAddition = (psd) => {
    nextSum = psd[0].map((v, i) => v+psd[1][i]);
}

main();

notion.brainwaves("psd").subscribe(brainwaves => {
    str = JSON.stringify(brainwaves.psd, null, 4); // (Optional) beautiful indented output.
    console.log(brainwaves.psd.length);
    // console.log(psd);
})