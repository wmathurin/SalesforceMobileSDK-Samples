(function(SFDC) {

    "use strict";

    // Fetches the record type id for the required layout.
    // Returns a promise which is resolved when the record type id is fetched from the server.
    var fetchRecordTypeId = function(view) {
        var fetchStatus = $.Deferred();

        var resolveStatus = function(recordTypeId) {
            fetchStatus.resolve(view.sobject, recordTypeId);
        }

        // If record types are not present, then use the default recordtypeid
        if (!view.hasrecordtypes) resolveStatus('012000000000000AAA');
        // If record types are present, then get the recordtypeid
        else {
            var model = view.$.force_sobject.model;
            // If record type id is provided then use that.
            if (view.recordtypeid) resolveStatus(view.recordtypeid);
            // If not but the recordid is available, then get the recordtype info from sfdc
            else if (model.id && model.id.length) {
                // Fetch the record's recordtypeid
                model.fetch({
                    success: function() {
                        // Once we get the recordtypeid, fetch the layout
                        resolveStatus(this.get('recordTypeId'));
                    },
                    error: function() {
                        fetchStatus.reject(view);
                    }
                });
            }
        }

        return fetchStatus.promise();
    }

    var getLayoutInfo = function(sobject, recordtypeid) {
        return SFDC.getSObjectType(sobject)
            .describeLayout(recordtypeid);
    }

    Polymer('force-sobject-layout', {
        sobject: null,
        hasrecordtypes: false,
        recordtypeid: null,
        recordid: null,
        idfield: 'Id',
        //applyAuthorStyles: true,
        //resetStyleInheritance: true,
        whenDetailSections: function() {
            return fetchRecordTypeId(this)
                .then(getLayoutInfo)
                .then(function(layout) {
                    return layout.detailLayoutSections;
                });
        },
        whenEditSections: function() {
            return fetchRecordTypeId(this)
                .then(getLayoutInfo)
                .then(function(layout) {
                    return layout.editLayoutSections;
                });
        },
        whenRelatedLists: function() {
            return fetchRecordTypeId(this)
                .then(getLayoutInfo)
                .then(function(layout) {
                    return layout.relatedLists;
                });
        }
    });

}).call(this, SFDC);