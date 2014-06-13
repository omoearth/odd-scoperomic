
/*
 * @todo: the save on blur feature for property values is problematic
 * 		  in conjunction with the autocompletion.
 * 		  Everytime the box looses focus because one clicks
 * 		  on the autocomplete-entry, an incomplete version will be saved
 * 		  because the input loses focus.
 */


var submitValues = function(obj) {

	var key = jQuery("#key").val().trim();
	var val = jQuery("#value").val().trim();

	addOrChangeProperty(obj.id + "#" + obj.rev, key, val);

	jQuery("#key").val("");
	jQuery("#value").val("");

	Router.go("overview", {
		id: obj.id,
		rev: obj.rev + 1
	});

}

Template.overview.rendered = function() {

		if (lastActiveInput == "#key")
			jQuery("#value").focus();
		else
			jQuery(lastActiveInput).focus();

		var oidParts = parseOid(selectedEntryOid);
		var obj = loadObject(oidParts.id, oidParts.rev)

		jQuery(lastActiveInput).val(obj.name);

		Session.set("use-autocomplete-entry", undefined);

};


Template.overview.events(
{
	'click #add-attribute-to-object' : function(e)
	{
		e.preventDefault();

		submitValues(this.obj);
	},

	'keyup #key': function (e) {
		Session.set("overview_autoComplete", jQuery(e.target).val());
		Session.set("lastActiveInput", "#key");
	},

	'focus #key' : function(e) {
		Session.set("lastActiveInput", "#key");
	},


	'keyup #value' : function(e) {
		if (e.which == 13) {
			submitValues(this.obj);
		} else {
			Session.set("overview_autoComplete", jQuery(e.target).val());
			Session.set("lastActiveInput", "#value");
		}
	},

	'focus #value' : function(e) {
		Session.set("lastActiveInput", "#value");
	},

	'focus .value-editor' : function(e) {
		Session.set("lastActiveInput", "#" + e.target.id);
	},

	'keyup .value-editor' : function(e) {
		Session.set("overview_autoComplete", jQuery(e.target).val());
		Session.set("lastActiveInput", "#" + e.target.id);
	},

	'blur .value-editor': function (e) {

		var newVal = jQuery(e.target).val();
		if (newVal == this.val)
			return;

		var id = jQuery("#id").val();
		var rev = jQuery("#rev").val();

		addOrChangeProperty(id + "#" + rev, this.key, newVal);

		Router.go("overview", {
			id: id,
			rev: parseInt(rev) + 1
		});
	}
});

Template.overview.helpers({

	type: function () {
		var displayObject = createDisplayObject(this.obj);
		return displayObject.type;
	},


	/**
	 * Supplies the autocomplete list with data.
	 */
	objects: function () {
		var lookup = Session.get("overview_autoComplete");

		if (typeof lookup != "undefined")
			return autoComplete(lookup, this);

		return [];
	},

	/**
	 * Takes a object and returns a view representation of it.
	 *
	 * @param obj
	 *            {object}
	 * @returns {object} where obj:object is the original object fixed:array are
	 *          the fixed values of the object variable:array are the user
	 *          changeable values
	 */
	detail : function()
	{
		var displayObject = createDisplayObject(this);

		var fixed = [];
		var variable = [];

		for(var propertyName in displayObject) {

			var propertyValue = displayObject[propertyName];

			isSystemField(propertyName)
			? fixed.push({ key : propertyName, value : propertyValue })
			: variable.push({ key: propertyName, value: propertyValue })
		}

		return ({
			obj: this,
			fixed: fixed,
			variable: variable
		});
	}
});