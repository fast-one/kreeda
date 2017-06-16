var msRestAzure = require('ms-rest-azure');
var graphRbacManagementClient = require('azure-graph');

var tenantId = '4fb5411a-ab81-4551-8e42-030e488b399f';

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request : ' + req.body);
    if (req.query.name || (req.body && req.body.name)) {
        //add event to db
       msRestAzure.loginWithServicePrincipalSecret('da06bcfc-6495-467b-a593-c70f43c15f00', 'zfNnf4zH5Ytv+bj08Pud3bA1MU8mlsuTZKOeWDAQj0s=', tenantId, { tokenAudience: 'graph' }, function (err, credentials, subscriptions) {
           if (err) context.log(err);
            var client = new graphRbacManagementClient(credentials, tenantId);
            var userParams = {
                accountEnabled: true,
                userPrincipalName: "8018679164@rksample.onmicrosoft.com",
                "signInNames": [
                    {
                    "type": "userName",
                    "value": "AlexW"
                    },
                    {
                    "type": "emailAddress",
                    "value": "AlexW@example.com"
                    }],
                displayName: 'AlexW Kasturi',
                mailNickname: 'AlexW',
                passwordProfile: {
                    password: 'Honeybee@19!',
                    forceChangePasswordNextLogin: false
                }
            };
            client.users.create(userParams, function (err, user, request, response) {
                if (err) return context.log(err);
                context.log(user);
                var userObjectId = user.objectId;
                client.users.list(function (err, result, request, response) {
                    if (err) return context.log(err);
                    context.log(result);
                });
            });
        });

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Saved User :" 
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    context.done();
};

