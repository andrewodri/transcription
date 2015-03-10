/**
 * This class is the base view in TungstenJS. It provides a simple template property that can be overridden, and a render function that will chain any deferred responses.
 *
 * This view utilizes very basic template literals that are native to ECMAScript 6. This view is intended to be extended for use with other templating systems, for example `EJSView`, `MustacheView`, and `UnderscoreView` that are under development.
 *
 * @class View
 * @author Andrew Odri andrew@affirmix.com
 */
export class View {
	/**
	 * This returns a reference that whatever the top-most sub-class is, which comes in handy when managing instances in static functions on classes that are designed to be extended.
	 *
	 * @static
	 * @property {Class} classReference Reference to the current class
	 */
	static get classReference() { return eval(this.name); }

	/**
	 * This returns a reference that whatever the top-most sub-class is, which comes in handy when managing instances in static functions on classes that are designed to be extended.
	 *
	 * @property {Class} classReference Reference to the current class
	 */
	get classReference() { return eval(this.constructor.name); }

	/**
	 * This function is called by the render function, providing with the data that is returned from the resolved promise object. While the template is currently implemented as an ECMAScript 6 template literal, it could also just return a path if the render function has been implemented with a 3rd party renderer.
	 *
	 * @static
	 * @param {Object} data This is data returned from the resolved promise in the render function
	 * @returns {String} String containing the the HTML render buy the temaplte based on the data provided in the data parameter
	 */
	static template(data) {
		console.log('View.template()');

		return ``;
	}

	/**
	 * This function take care of managing the rendering of the view. The bulk of the logic should be stored in the function if it is to be overriden for a 3rd party renderer. This allows the template object to be as simple as possible, so that it be overridden with just a simple template or path for real world view implementations.
	 *
	 * @static
	 * @param {Object} request The request is a deferred object containing the data to be rendered by the view. Usually this is a deferred AJAX object returned by the model, but could be any appropriate object.
	 * @return {Object} Returns a deferred object containing the rendered view HTML after it has been applied to the template in the in the template function
	 */
	static render(request) {
		console.log('View.render()');

		let deferred = $.Deferred();

		$.when(request).done(
			(data, textStatus, jqXHR) => deferred.resolve(this.template(data))
		);

		return deferred.promise();
	}
}
