"use strict";

var sec = require('sycle').security;

/*!
 * Default UserCredential properties.
 */
module.exports = function (t) {
    return {
        name: 'UserCredential',
        properties: {
            provider: {type: String, index: true}, // facebook, google, twitter, linkedin
            authScheme: {type: String}, // oAuth, oAuth 2.0, OpenID, OpenID Connect
            externalId: {type: String, index: true}, // The provider specific id
            profile: t.JSON,
            credentials: t.JSON,
            created: {type: Date, default: function () {
                return new Date;
            }},
            modified: Date,
            userId: {type: String, index: true}
        },
        relations: {
            user: {
                type: 'belongsTo',
                model: 'User',
                foreignKey: 'userId'

            }
        },
        acls: [
            {
                principalType: sec.ROLE,
                principalId: sec.EVERYONE,
                permission: sec.DENY
            },
            {
                principalType: sec.ROLE,
                principalId: sec.OWNER,
                permission: sec.ALLOW
            }
        ]
    }
};
