const httpRequest = require('request');

const TOKEN_VALIDATOR_URL = "https://www.domain.com/validatetoken";

module.exports.handler = (event, context, callback) => {
    console.log('event', event);
    if (!event.authorizationToken) {
        return callback('Unauthorized');
    }

    const token = event.authorizationToken;

    try {
        var options = {
            url: TOKEN_VALIDATOR_URL,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'token': token }
        };
        httpRequest.post(options, function (err, res, result) {

            if (err) {
                return callback('Unauthorized');
            }
            return callback(null, generatePolicy("TOKEN-PRINCIPAL-ID", 'Allow', event.methodArn));
        });
    }
    catch (err) {
        console.log('catch error. Invalid token', err);
        return callback('Unauthorized');
    }
};


// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = { Version: '2012-10-17', Statement: [] };
        const statementOne = { Action: 'execute-api:Invoke', Effect: effect, Resource: resource };
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};
