var documentClient = require("documentdb").DocumentClient;
var config = require("./config");
var EventService = require('./service/eventService');

var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });
var eventService = new EventService(client, config.database.id, config.collection.id);

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request : '+req.body);
    if (req.query.name || (req.body && req.body.name)) {
        //add event to db
        var event = req.body;
        eventService.addEvent(event, function (err) {
            if (err) {
                throw (err);
            }
        });

         context.res = {
                // status: 200, /* Defaults to 200 */
                body: "Saved Event :" + (event.name)
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

