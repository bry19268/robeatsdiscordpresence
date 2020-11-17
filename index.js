// Thank you for using RoBeats RPC! Please fill out the below values. 

const leftX = 472, leftY = 1453;
const rightX = 1097, rightY = 1566;

const tempFileName = 'capture.png';
const croppedTempName = 'crop.png';

// Please do not touch anything below! Thanks :)

const axios = require("axios");
const RPC = require("discord-rpc");
const pixelmatch = require('pixelmatch');
const screenshot = require('screenshot-desktop');
const sharp = require('sharp');
const textract = require('textract');
//var FuzzySearch = require('fuzzy-search');

const clientId = '777751081521381407';
 
const client = new RPC.Client({ transport: 'ipc' });

async function setActivity(details, state, largeKey, largeText, smallKey, smallText, instance) {
    if (!client) {
      return;
    }
  
    client.setActivity({
      details: details,
      state: state,
      startTimestamp: new Date(),
      largeImageKey: largeKey,
      largeImageText: largeText,
      smallImageKey: smallKey,
      smallImageText: smallText,
      instance: instance,
    }).then(() => {
        console.log("Set activity!");
    })
  }

async function checkSong() {
  screenshot({filename: tempFileName}).then(async (img) => {
    sharp(tempFileName).extract({ width: rightX-leftX, height: rightY-leftY, left: leftX, top: leftY }).toFile(croppedTempName)
    .then(function(new_file_info) {
        console.log("Image cropped and saved");
        textract.fromFileWithPath(croppedTempName, function( error, text ) {
            if (error) console.log(error); else {
              console.log(text);
              setActivity("testing with a bad OCR", `Playing ${text}`, "robeats", "RoBeats is fun!", undefined, undefined, true);
            }
        });
    })
    .catch(function(err) {
        console.log(err);
    });
  });
}
 
client.on('ready', () => {
    console.log('Authed for user', client.user.username);
    //checkSong();
    //update();
});
  
client.login({ clientId }).catch(console.error);

const ioHook = require('iohook');
ioHook.on("keypress", event => {
  if (event.ctrlKey == true && event.rawcode == 75) checkSong();
});
ioHook.start();