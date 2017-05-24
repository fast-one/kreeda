var validator = require('validator');
var logger = require('winston');

function EventService(documentDBClient, databaseId, collectionId) {
    this.client = documentDBClient;
    this.databaseUrl = `dbs/${databaseId}`;
    this.collectionLink = `${this.databaseUrl}/colls/${collectionId}`
}
module.exports = EventService;

EventService.prototype = {

    validate: function (event, callback) {
        //Validate
        logger.info(validator.isAlphanumeric(event.name));
        logger.info(validator.isInt(event.minParticipants, { min: 1 }));
        logger.info(validator.isInt(event.maxParticipants, { min: 999 }));
    },

    updateEvent: function (event, callback) {
        var self = this;
        logger.info("Updating Event,Id :" + event.id);
        self.findEvent(event.id, function (err, doc) {
            if (err) {
                callback(err);
            } else {
                self.client.replaceDocument(doc._self, event, function (err, replaced) {
                    if (err) {
                        callback(err);

                    } else {
                        logger.info("Updated Event,Id :" + replaced.id);
                        callback(null, replaced);
                    }
                });
            }
        });
    },

    findEvent: function (eventId, callback) {
        var self = this;
        var docLink = self.collectionLink + '/docs/' + eventId;
        self.client.readDocument(docLink, function (err, doc) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, doc);
            }
        });
    },

    addEvent: function (event, callback) {
        var self = this;
        self.client.createDocument(self.collectionLink, event, function (err, doc) {
            if (err) {
                callback(err);

            } else {
                callback(null, doc);
            }
        });
    }
};