Template.footer.events({
    'keydown #wish': function(e) {
        if (e.which == 13) {
            e.preventDefault();
            var msg = $("#wish").val();
            throwError('Submitting to profile: ' + msg);
            Meteor.call("postToProfile", SessionAmplify.get('myProfileUrl'), msg, function(error, result) {
                if (result == "OK") {
                    throwError("Successfully posted " + msg + " to " + SessionAmplify.get('myProfileUrl')) ;
                } else {
                    throwError("Failed to post " + msg + " to " + SessionAmplify.get('myProfileUrl')) ;
                }
            });
        }
    }
});