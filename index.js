"use strict";

const express = require("express");
const bodyParser = require("body-parser");
// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
var cors = require('cors');

const restService = express();
restService.use(cors());

restService.use(
    bodyParser.urlencoded({
        extended: true
    })
);

restService.use(bodyParser.json());

const projectId = '91974094a9a45908770d6b99471c125b2dfb5401';

//https://dialogflow.com/docs/agents#settings
// generate session id (currently hard coded)
const sessionId = '2eccb33b-8494-40dd-ac92-212972b9dbea';
const languageCode = 'en-US';


let privateKey = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC72oxV8uZmhDm2\n8cTwSJskfHeXtmLQzTmP6Hkf8+XmOjlyq6ch+fsendhl2WPI/qxg9TaX1yYx/R2y\nC8cnZcdyV90YGeE6yZBnI/liP34Lbk/TAgSePiuToBI6AEQYSWuYXY7kaD+rpKcd\nDt2H6RPxPTn5MscAVCjdneHorhSJ8rHKPQtC7pEYXgnBkNsMgeZgPzbfFSzkJEQc\n13b9fYTY2nLalxxJT1sMPGSnd2x5+K/PdEKFUb2tsXcZS4TPrrNAaPE1IOOo1T0S\nQTRGTBg6R+jwVrlJwJNTgYDAVSLKE6oGw2ALO+rFQ9z/orJ4pz1CYkFT7e6HbLeW\nf1JyhedBAgMBAAECggEAJieCf2aBc2sBye2bIW6tzCBXrgHGWkCEo30FNP81v6gt\nyOOiY51BavuGW1FnGgjX/C1x9C8nu9l8MZCA17itZMUBzAZdn7IW2UwON+1LbYjv\nP51WUMmx0h8d9JffPMuUxfKitjOSUwtzQcymJBesDEBySPIORzvQvQp3Ouo4k7fV\nWHIs/jEOaEm3fbO13YZkKSSQLwVXnEZr/0XnxJ5gFzf0MWxPatMyzkZIB5WZ/whS\nVyyJX3545slQ2UjRZLgx+RQ48GCjRbl2K8k/FaQGam5OYanqaCWKqnV1FSD0fM+0\nQlMCqeK7vW5goj2h9SMxVkLiTAWHuyfm6zBgFa8DrQKBgQDf+SIAlKMlmCLLHdnp\nIqVQ5eD+bHpf2iPOuFYhrR20R5m+SkvE6gvq6vw/BAQTS5lj2im53M76MG4QJUuX\nk2JD9iYozMse7S60Ix4qmTFTlrLcyia+71gHD2ufuqVFjc5+WJiKKDc0gudEDg6A\n5VhGjyBcd2xqUgme9gC5bXaQOwKBgQDWtzWEGyD2gTW6ss7b41syE12ZSjT5NB6l\n3RfTFSLkhN3JQBEqu0cZZxmtP1WzSoWoZdwSnD5dw+E6jbqtfVmOmEg+k/Y6xfu8\nUV3y1Jr8+wlUO2oAC3EhC94Jl0Yr3HiJ3CV4Tgm9HzjhyI0rinpclXF2uGQiZkhN\n5f58l+pKswKBgQDB10ymU/4fO1xhjqRaMbICIfJoQFppOtJixwdEfh+HN7DIEGUj\nN6y41EccAs3EJVnMIbSbN4+q2N9o+d5CgTw6tX6xMQ1a5svU+8/P7mXSgkqq7Ao8\nlckJ0z7CLzd6yxA8KVFbwRKGUAT30XKb++I6rwTDAljCa94HxcE6upIyoQKBgQC/\nomzFJ2FYISJPK1+sqVKvctFLCwwUjwv7hUTKREcMJfm8sM2hkdx3M6mbErfueUip\nb5/njEOtdDIFDJHcXdAckJWKJIzTD/kJrqVnIZHi0DsXTp/gwlWJ5QmbDcS3SOLc\nR/u5UA0pGkCuY0x72/Axyb+m8hONEDTgMbHcicm2OQKBgFU7Gho+kK+a6rDfzzHx\nk32X/PUMKXbt8rW4JXVn41sIfCn75hps+KbHFZOMswnFomNFoU3nhjBER5yr2hZA\nsLOsV8CgzwNwX7/fEz/WuK0b8U6B3UuasTlfHCEElrtDqjD0uuqAMNaucyr/nVvc\ncSmUZp86swhsQdzumBY2Iqjp\n-----END PRIVATE KEY-----\n';

// as per goolgle json
let clientEmail = "dialogflow-hjdasg@small-talk-1-59506.iam.gserviceaccount.com";
let config = {
    credentials: {
        private_key: privateKey,
        client_email: clientEmail
    }
}
const sessionClient = new dialogflow.SessionsClient(config);

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);



restService.post("/message", async function (req, res) {

    if(!req.body) return res.sendStatus(400);
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: req.body.messageText,
                languageCode: languageCode,
            },
        },
    };

    // Send request and log result
    sessionClient
        .detectIntent(request)
        .then(responses => {
            const result = responses[0].queryResult;
            console.log(`  Response: ${result.fulfillmentText}`);

            return res.json({ messageResponse: result.fulfillmentText });
        })
        .catch(err => {
            return res.json({ messageResponse: "Intente nuevamente" });
        });

});

restService.listen(process.env.PORT || 8000, function () {
    console.log("Server up and listening");
});
