const multipart = require("parse-multipart");
const fetch = require("node-fetch");
const Jimp = require("jimp");
const fillGreen = makeIteratorThatFillsWithColor(0x65E065FF); // 0x[HEXCOLOR]FF
const fillRed = makeIteratorThatFillsWithColor(0x9C002CFF);
const fillYellow = makeIteratorThatFillsWithColor(0xB5A900FF);

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var boundary = multipart.getBoundary(req.headers['content-type']);
    var body = req.body;
    var parts = multipart.Parse(body, boundary);

    context.log(parts[0].data)
    let image = await Jimp.read(parts[0].data);
    var result = await getFaceData(parts[0].data);
    context.log(result.length)
    let analysis = analyzeResults(result);

    context.log(analysis)
    let base64Str = await manipulateImage(image, result);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {base64Str, analysis}
    };
}

async function manipulateImage(image, result) {
    let response;
    
    for (var i=0; i<result.length; i++) {
        const maskStatus = result[i].faceAttributes.mask.type;
        let x = result[i].faceRectangle.left;
        let y = result[i].faceRectangle.top;
        let width = result[i].faceRectangle.width;
        let height = result[i].faceRectangle.height;

        // let textY = y + height + 10

        if (maskStatus === "noMask") {
            makeRectangle(image, x, y, width, height, fillRed);
            // await addText(image, x, textY, "no mask");
        }
        else if (maskStatus === "faceMask") {
            makeRectangle(image, x, y, width, height, fillGreen);
            // await addText(image, x, textY, "mask");
        }
        else {
            makeRectangle(image, x, y, width, height, fillYellow);
            // await addText(image, x, textY, "uncertain");
        }
    }

    image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        console.log(buffer)
        
        response = Buffer.from(buffer).toString('base64');
    });
    return response;
}

// async function addText(image, x, y, text) {
//     const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
//     await image.print(font, x, y, text);
// }

function makeRectangle(image, x, y, width, height, color ) {
    image.scan(x, y, width, 2, color); // top
    image.scan(x, y + height, width, 2, color); // bottom
    image.scan(x, y, 2, height, color); // left

    image.scan(x + width, y, 2, height, color); // right
}

function makeIteratorThatFillsWithColor(color) {
    return function (x, y, offset) {
      this.bitmap.data.writeUInt32BE(color, offset, true);
    }
  };


function analyzeResults(results) {
    let mask = 0;
    let noMask = 0;
    let unknown = 0;
    let length = results.length;

    for (var i=0; i<length; i++) {
        let maskStatus = results[i].faceAttributes.mask.type;
        if (maskStatus === "faceMask") {
            mask += 1;
        }
        else if (maskStatus === "noMask") {
            noMask += 1;
        }
        else {
            unknown += 1;
        }
    }

    return {mask, noMask, unknown, length}
}

async function getFaceData(binaryData) {
    const subKey = process.env['SUBKEY'];
    const uriBase = process.env['ENDPOINT'] + 'face/v1.0/detect'

    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'mask' ,
        'recognitionModel': 'recognition_04',
        'detectionModel': "detection_03"
    });

    const urlToUse = uriBase + '?' + params.toString()
    console.log(urlToUse);
    // making the post request
    let resp = await fetch(urlToUse,{
        method: 'POST',
        body: binaryData,
        headers: {
            'Content-Type' : 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subKey
        }
    })
    // receive the response
    let data = await resp.json();
    return data;
}

// [
//     {
//       "faceId": "546ec543-0493-406f-86ee-aa8355139dab",
//       "faceRectangle": {
//         "top": 314,
//         "left": 307,
//         "width": 376,
//         "height": 496
//       },
//       "faceAttributes": {
//         "mask": {
//           "type": "noMask",
//           "noseAndMouthCovered": false
//         }
//       }
//     }
//   ]