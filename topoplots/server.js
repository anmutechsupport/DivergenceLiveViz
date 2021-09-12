const { Notion } = require("@neurosity/notion");
require("dotenv").config();

const topogrid = require('topogrid')

// x coordinates of the data
const pos_x = [1,2,3,4,5,6,7,8];

// y coordinates of the data
const pos_y = [1,2,3,4,5,6,7,8];

// the data values
const data = [1,10,1,4,5,6,7,8];

// the data values
// var data = getRandomInts(0, 10, 8)

// function getRandomInts(min, max, num) {
//   var data = []
//     for(i=0; i<num+1; i++){
//       data.push(Math.floor(Math.random() * (max - min)) + min)
//     }
//   return data
// };

// the parameters for the grid [x,y,z] where x is the min of the grid, y is the
// max of the grid and z is the number of points
const grid_params = [0,10,11];

zi = topogrid.create(pos_x,pos_y,data,grid_params);
// console.log(zi)

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
    for (const val  of point) {
        let rgb = calcColor(min, max, val)
        // console.log(rgb)
        pointRgb.push(rgb)
    }
    rgbZi.push(pointRgb)

}

console.log(rgbZi)

