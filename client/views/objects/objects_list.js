Template.objectsList.helpers({
    objects: function() {
        return Objects.find({},
        		{
    		"timestamp" : "asc"
    	});
    }
});

Meteor.subscribe("objects");