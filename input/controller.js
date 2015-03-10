/**
 * This class is the base controller in TungstenJS. A defaults property is provided to be overridden and merged allowing you to define common selectors, classes, and strings that will be referenced throughout your controller.
 *
 * You can also bind element events to controller functions by defining a new entry in the listeners property. See the demo application for an example implementation.
 *
 * The event binding system and other elements of functionality are inspired by [JavascriptMVC's](http://javascriptmvc.com/) [implementation of the controller](http://javascriptmvc.com/docs/can.Control.html).

 * @class Controller
 * @author Andrew Odri andrew@affirmix.com
 */
export class Controller {
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
	 * Defines default properties that will be merged into each controller instance by default.
	 *
	 * Due to the lack of support for class properties in ECMAScript 6, properties have been defined in getters, which are then merged with thier super functions by the constructor.
	 *
	 * Below is an example of a standard override of defaults that merges with it's sub class:
	 *
	 * ```
	 *	get defaults() {
	 *		return {
	 *			selectors : {
	 *				displayElement : '.display'
	 *				,searchField : '.search-field'
	 *				,searchButton : '.search-button'
	 *			}
	 *			,classes : {
	 *				active : 'active'
	 *				,selected : 'selected'
	 *				,loading : 'loading'
	 *			}
	 *		};
	 *	}
	 * ```
	 *
	 * These properties can be accessed straight from controller instance itself. For example, to access selectors.displayElement defined in the above example, you would reference it with `controllerInstance.selectors.displayElement`. See the demo application for an example implementation.
	 *
	 * @property {Object} defaults The properties of this object will be merged into the controller itself, providing default values for the controller
	 */
	get defaults() { return {}; }

	/**
	 * Defines the listener object which will be parsed through and then bound during construction. See the demo application for an example implementation.
	 *
	 * Due to the lack of support for class properties in ECMAScript 6, properties have been defined in getters, which are then merged with thier super functions by the constructor.
	 *
	 * Below is an example of a standard override of defaults that merges with it's sub class:
	 *
	 * ```
	 *	get listeners() {
	 *		return [
	 *			{ selector : '{selectors.searchButton} click', handler : this.example }
	 *			,{ selector : 'div#identification.classification click', handler : this.example }
	 *			,{ selector : 'click', handler : this.example }
	 *		];
	 *	}
	 * ```
	 *
	 * @todo In each listener object, separate the event from the selector and give it it's own event property
	 * @property {Array} listeners An array of objects that represent DOM query selectors, events, and callback functions for DOM event binding on the controller
	 */
	get listeners() { return []; }

	/**
	 * The first thing the contructor does is merge this.defaults and this.listeners with the values defined in each super class. "Private" variables are created for acess within the constructor.
	 *
	 * Then, the element property of the controller is set to a jQuery object of the context. This will provide access to the jQuery function easily, and allow for easy referencing through the controller.
	 *
	 * Next, the properties in default are also merged into the controller instance.
	 *
	 * The listeners property is then parsed, binding all events to the defined functions, and passing them the correct context.
	 *
	 * In non-native ECMAScript 6 browsers, the code is often processed after document ready and load events are fired, so if these have been missed, they are triggered again.
	 *
	 * After all the processing is complete, the initialize function is called. This allows sub classes to perform thier own initialization after the core controller initialization has taken place in the constructor without having to explicitly call the constructor's. See the demo application for an example implementation.
	 *
	 * @todo Investigate whether re-triggering ready and load events will cause issues
	 * @param {DOMElement} context Element that the controller will be bound to and use as it's scope
	 * @returns {Controller} Instance of the controller object
	 */
	constructor(context) {
		console.log('controller.constructor()');

		this.__defaults__ = this.defaults;
		this.__listeners__ = this.listeners;

		// What is this black magic? Ghetto introspection baby... We are basically taking the ugly out of each getter and putting into one lump of super-ugly
		var classIterator = this.constructor.__proto__;

		// Check if the prototype is defined; if it is empty then super class is now Object and we can't go further
		while(classIterator.hasOwnProperty('prototype')){
		//while(Reflect.has(classIterator, 'name') && Reflect.get(classIterator, 'name') !== 'Empty'){
			if(classIterator.hasOwnProperty('defaults')){
			//if(Reflect.has(classIterator, 'defaults')){
				this.__defaults__ = Object.assign(classIterator.prototype.defaults, this.__defaults__);
			}

			if(classIterator.hasOwnProperty('listeners')){
			//if(Reflect.has(classIterator, 'listeners')){
					this.__listeners__ = classIterator.prototype.listeners.concat(this.__listeners__);
			}

			// We are going down the rabbit hole now... Try and access the current classIterator's super class...
			classIterator = classIterator.__proto__;
		}

		// Rename context to element, and element to targetElement...
		this.element = $(context);

		// Merge defaults into the instance of this class... (I don't know if this is a good idea yet)
		Object.assign(this, this.__defaults__);

		for(let listener of this.__listeners__){
			// Set all the main variables through destructured assignment...
			let [, objectString, selectorElement, event] = /(?:\{([^\{\}\s]*)\})*(\S+)*?\s*?(\S+)/.exec(listener.selector);

			// Break apart the object string and retrieve the reference...
			if(objectString){
				let objectProperties = objectString.split('.');
				selectorElement = this.defaults;

				while(objectProperties.length >= 1){
					selectorElement = selectorElement[objectProperties.shift()];
				}
			}

			// If no element was set, then assume it is the parent element...
			if(!selectorElement){
				selectorElement = context
			}

			// Try and make this jQuery independant at some point...
			if($(selectorElement).is(context)){
				$(selectorElement).on(event, $.proxy(listener.handler, this));
			}else{
				$(selectorElement, $(context)).on(event, $.proxy(listener.handler, this));
			}

			// Non-native ES6 implementations only parse code after document ready and load events, so we need to re-trigger them...
			if($(selectorElement).is(document) && event == 'ready' && /interactive|complete/.test(document.readyState)){
				$(selectorElement).trigger('ready');
			}
			if($(selectorElement).is(document) && event == 'load' && /complete/.test(document.readyState)){
				$(selectorElement).trigger('load');
			}

			//console.log(selectorElement, event, listener.handler, document.readyState);
		}

		this.initialize(context);
	}

	/**
	 * This function is designed to be overriden, allowing sub classes to perform thier own initialization after the core controller initialization has taken place in the constructor without having to explicitly call the constructor.
	 *
	* @param {DOMElement} element Element that the constructor object uses for scoping
	* @param {Object} source Element that the constructor object uses for scoping
	*/
	initialize(element, source) {
		console.log('controller.initialize()');
	}

	/**
	 * This function destroys the instance of the controller, as well as the DOM element if defined.
	 *
	 * @param {Boolean} isIncludeElement Defines whether the DOM element that the controller is attached to should also be destroyed.
	 */
	destroy(isIncludeElement = false) {
		console.log('controller.destroy()');

		if(isIncludeElement){
			this.element.remove();
		}

		delete this;
	}
}
