// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const aws = require('aws-sdk');
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    const lambda = new aws.Lambda({
      apiVersion: '2015-03-31',
      endpoint: process.env.AWS_SAM_LOCAL ? new aws.Endpoint('http://localhost:3000') : undefined,
    });

    const payload = JSON.stringify({
      body: {
        rfqDocument: {testing: 123},
        uuid: 'id1234',
      },
    });

    try {
      const result = await lambda
        .invoke({
          FunctionName: 'appInvoke',
          InvocationType: 'RequestResponse',
          Payload: payload,
        })
        .promise();

      console.log('invoke result');
      console.log(result);
      // const ret = await axios(url);
      response = {
          'statusCode': 200,
          'body': JSON.stringify({
              message: 'hello world',
              // location: ret.data.trim()
          })
      }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
