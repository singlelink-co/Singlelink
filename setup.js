const prompt = require('prompt');
const fs = require('fs');
const log = console.log;
const package = require('./package.json');

log('Welcome to Singlelink!');
log('This utility will walk you through the Singlelink setup process.')
log('It only covers the required settings, and will guess sensible defaults when not provided input.')
log('');
log('Have questions? See `npm run help` for documentation where available.')
log('');
log('After, use `npm run start` to start your Singlelink instance.')
log('');
log('Press ^C at any time to quit.');

prompt.message = '';

let schema = {
    properties: {
        contactEmail: {
            description: 'Contact email'
        },
        host: {
            description: 'Host/domain name',
            default: '0.0.0.0'
        },
        database: {
            description: 'PostgreSQL database string',
            message: 'A PostgreSQL database is required to run Singlelink!',
            required: true
        }
    }
}

prompt.get(schema, function(err, result) {
    if(!result) {
        log('');
        log('');
        log('Singlelink setup aborted - please try again soon!');
        log('');
        return;
    }
    log('');
    log('About to write to ./api/src/config.json:');
    log('');
    log(result);
    log('');
    prompt.get(['Is this okay? (y/n)'], (err, result2) => {
        if(!result2 || result2['Is this okay? (y/n)'] == 'n') {
            log('');
            log('');
            log('Singlelink setup aborted - please try again soon!');
            log('');
            return;
        }

        result['secret'] = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

        result['port'] = 5566;

        result['settings'] = {
            "marketplaceDeleteAddonThreshold": 10
        };

        result["aws"] = {
            "senderEmailAddress": "",
            "region": "",
            "accessKey": "",
            "secretKey": ""
        };
        result["s3Bucket"] = {
            "endPoint": "",
            "bucketName": "",
            "port": 443,
            "useSSL": true,
            "accessKey": "",
            "secretKey": ""
        };
        result["analytics"] = {
            "mixpanelToken": ""
        };

        result["google"] = {
            "clientId": "",
            "clientSecret": "",
            "redirectUrl": ""
        };
        result["messages"] = {
            "passwordResetEmail": {
                "subjectCharset": "UTF-8",
                "subject": "Password Reset Request for SingleLink",
                "message": "Hello,\n\nSomebody requested a password request for your account on SingleLink.\n\nIf this was your doing, please visit the link below to reset your password.\n\n${url}\n\nThis link will be valid for 15 minutes.\nIf you cannot click the link above, copy & paste the link into your browser.\n\nIf this was not you, please ignore this email.\n\nThank you,\nSingleLink Team\n\nNote: Do not reply to this email, as there is no inbox for it.",
                "messageCharset": "UTF-8"
            }
        };

        result['apiDomain'] = result.host + ':5566';
        result['clientDomain'] = result.host + ':80';

        try {
            fs.writeFileSync('./api/src/config.json', JSON.stringify(result))
        } catch(err) {
            log(err);
            log('');
            log('');
            log('Singlelink setup aborted - please try again soon!');
            log('');
            return;
        }

        log('');
        log('Finished Singlelink setup.')
        log('Run `npm run start` to start your Singlelink instance!');

    })
});