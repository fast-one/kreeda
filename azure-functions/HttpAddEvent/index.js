const uuidv4 = require('uuid/v4');
var Ajv = require('ajv');
var ajv = new Ajv({ allErrors: true });
var eventSchema = require('./data/schema');
var validate = ajv.compile(eventSchema);

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request : ' + req.body);

    //Validate
    var valid = validate(req.body);
    if (valid) {
        //generate unique audit id 
        var auditId = uuidv4();
        // define event
        var event = req.body;
        event.auditId = auditId
        context.bindings.eventDocument = event;
        
        //define audit
        var audit = {};
        audit.type = "Create Event";
        audit.user = "User Name";
        audit.data = event
        context.bindings.auditDocument = audit;
        //set response
        context.res = {
            body: "Valid Event"
        };
    }
    else {
        context.res = {
            status: 400,
            body: validate.errors
        };
    }
    context.done();
};

