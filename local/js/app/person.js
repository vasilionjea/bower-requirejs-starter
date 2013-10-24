// Define a new module, and set jquery as a dependency
define(['jquery'], function ($) {
	// Da body yo!
	var $body = $(document.body);

	// Person constructor
	function Person(name, lastname) {
		this.name = name;
		this.lastname = lastname;
	}

	// Person methods
	$.extend(Person.prototype, {
		sayHello: function () {
			var str = '<p>Hello <b>' + this.name + ' ' + this.lastname + '</b>!</p>';
			$body.append(str);

			return this;
		},

		sayHolla: function () {
			var str = '<p><b>Holla</b> Amigos!</p>';
			$body.append(str);

			return this;
		}
	});

	// Return so required statements can have access
	return Person;
});