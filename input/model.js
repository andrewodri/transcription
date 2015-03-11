import {Utility} from './utility';

/**
 * This class is designed to be an abstract model class. RESTful JSON services are also natively supported with full functionality easily enabled by overriding the services getter.
 *
 * Custom models can be defined by extending this class and overriding any appropriate properties and functions that you wish to customize. See the demo application for an example implementation.
 *
 * In the case of most RESTful APIs, you will only need to override the `services` property and the `filter` function.
 *
 * The naming conventions and structure for the majority of the functions and methods provided are inspired by [Laravel's](http://laravel.com/) [Eloquent ORM Model](http://laravel.com/api/4.2/Illuminate/Database/Eloquent/Model.html).
 *
 * @class Model
 * @author Andrew Odri andrew@affirmix.com
 */
export class Model {
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
	 * Templated URLs are supported using ECMAScript 6 quasi-literal tenplate syntax. See the MDN documentation for more information. See the demo application for an example implementation.
	 *
	 * Due to the lack of support for class properties in ECMAScript 6, properties have been defined in getters that merge with thier super functions.
	 *
	 * Below is an example of a standard override of services that merges with it's sub class:
	 *
	 * ```
	 *	static get services() {
	 *		return super.services.merge({
	 *			create : { method : 'POST', uri : 'https://itunes.apple.com/search?term=${term}', format : 'jsonp' }
	 *			,find : { method : 'GET', uri : 'https://itunes.apple.com/search?term=${term}', format : 'jsonp' }
	 *			,update : { method : 'PUT', uri : 'https://itunes.apple.com/search?term=${term}', format : 'jsonp' }
	 *			,delete : { method : 'DELETE', uri : 'https://itunes.apple.com/search?term=${term}', format : 'jsonp' }
	 *		});
	 *	}
	 * ```
	 *
	 * @static
	 * @property {Object} services Object containing create, find, update, and delete properties that define RESTful service endpoints
	 */
	static get services() {
		return {
			create : { method : 'POST', uri : '', format : 'jsonp' }
			,find : { method : 'GET', uri : '', format : 'jsonp' }
			,update : { method : 'PUT', uri : '', format : 'jsonp' }
			,delete : { method : 'DELETE', uri : '', format : 'jsonp' }
		}
	}

	/**
	 * Creates a new instance of the model, and performs a save operation.
	 *
	 * @static
	 * @param {Object} attributes Attributes that will be used to hydrate a new model instance. See `hydrate` for more information
	 * @returns {Model} Deferred instance of the newly created model
	 */
	static create(attributes){
		console.log('Model.create()');

		return this.hydrate(attributes).save();
	}

	/**
	 * Finds and returns any available instances of the model.
	 *
	 * @static
	 * @param {Object} attributes An object containing properties that correspond to the attributes in the templated RESTful URL, if not overriden by custom functionality
	 * @returns {Array|Model} Deferred instance of the Models that are found
	 */
	static find(attributes) {
		console.log('Model.find()');

		return this.__find__(attributes);
	}

	/**
	 * Finds and returns once or more instances of the model or throws and error if none are found.
	 *
	 * @static
	 * @param {Object} attributes An object containing properties that correspond to the attributes in the templated RESTful URL, if not overriden by custom functionality
	 * @returns {Array|Model} Deferred instance of the models that are found
	 */
	static findOrFail(attributes) {
		console.log('Model.findOrFail()');

		$.when(
			this.__find__(attributes)
		).done(function(data){
			if((data instanceof Object && data != {}) || (data instanceof Array && data != [])){
				return data;
			}else{
				throw new Error('Could not find instance of Model in class Model');
			}
		});
	}

	/**
	 * Finds and returns once or more instances of the model or creates a new instance if none are found.
	 *
	 * @static
	 * @param {Object} attributes An object containing properties that correspond to the attributes in the templated RESTful URL, if not overriden by custom functionality
	 * @returns {Array|Model} Deferred instance of the Models that are found
	 */
	static findOrNew(attributes) {
		console.log('Model.findOrNew()');

		$.when(
			this.__find__(attributes)
		).done(function(data){
			if((data instanceof Object && data != {}) || (data instanceof Array && data != [])){
				return data;
			}else{
				return this.hydrate(attributes);
			}
		});
	}

	/**
	 * Finds and returns the first instance of the model or creates a new instance and saves it if none are found.
	 *
	 * @static
	 * @param {Object} attributes An object containing properties that correspond to the attributes in the templated RESTful URL, if not overriden by custom functionality
	 * @returns {Array|Model} Deferred instance of the Models that are found
	 */
	static firstOrCreate(attributes) {
		console.log('Model.firstOrCreate()');

		$.when(
			this.__find__(attributes, true)
		).done(function(data){
			if(data instanceof Object && data != {}){
				return data;
			}else if(data instanceof Array && data != []){
				return data[0];
			}else{
				return this.hydrate(attributes).save();
			}
		});
	}

	/**
	 * Finds and returns the first instance of the model or creates a new instance if none are found.
	 *
	 * @static
	 * @param {Object} attributes An object containing properties that correspond to the attributes in the templated RESTful URL, if not overriden by custom functionality
	 * @returns {Array|Model} Deferred instance of the Models that are found
	 */
	static firstOrNew(attributes) {
		console.log('Model.firstOrNew()');

		$.when(
			this.__find__(attributes, true)
		).done(function(data){
			if(data instanceof Object && data != {}){
				return data;
			}else if(data instanceof Array && data != []){
				return data[0];
			}else{
				return this.hydrate(attributes);
			}
		});
	}

	/**
	 * Create or update a model matching the attributes, and fill it with values.
	 *
	 * @static
	 * @param {Object} attributes Attributes used to return the models that need to be updated
	 * @param {Object} properties Properties that model instances will be updated with
	 * @returns {Array} Deferred instance of the updated or created model(s)
	 */
	static updateOrCreate(attributes, properties){
		console.log('Model.updateOrCreate()');

		$.when(
			this.__find__(attributes, false, properties)
		).done(function(data){
			if((data instanceof Object && data != {} || data instanceof Array && data != [])){
				return data;
			}else{
				return this.hydrate(Object.assign(attributes, properties)).save();
			}
		});
	}

	/**
	 * Destroys the model instances provided, and performs a delete operation.
	 *
	 * @static
	 * @param {Array} items Model instances to be deleted
	 * @returns {Boolean} Boolean expressing whether the operation was successful
	 */
	static destroy(items){
		console.log('Model.destroy()');

		var deferred = $.Deferred();

		// Handle the parameteres and construct uri based on destructured assignment

		$.when(
			$.ajax({
				type : this.services.delete.method
				,url : Utility.stringFormat(this.services.delete.uri, attributes)
				,dataType : this.services.delete.format
			})
		).done(
			(data, textStatus, jqXHR) => deferred.resolve(
				this.hydrate(
					this.filter(data)
				)
			)
		);

		return deferred.promise();
	}

	/**
	 * Designed to be overridden, this allows raw data returned from a RESTful `find` method to be be processed before being sent `hydrate` for instantiation. See the demo application for an example implementation.
	 *
	 * @static
	 * @param {*} data Data returned by the find function
	 * @returns {Array|Object} Processed data from the find function
	 */
	static filter(data) {
		console.log('Model.filter()');

		return data;
	}

	/**
	 * Instantiates a model/models based on the data provided. This is called immediately after `filter`.
	 *
	 * @static
	 * @param {Array|Object} data Data needed to instantiate new model instances
	 * @returns {Array|Model} Newly instantiated model/models
	 */
	static hydrate(data) {
		console.log('Model.hydrate()');

		let result;

		if(data instanceof Array){
			result = [];

			for(let item of data){
				if(item instanceof Object){
					result.push(new this.classReference(item));
				}
			}
		}else if(data instanceof Object){
			result = new this.classReference(data);
		}else{
			throw new Error('Cannot hydrate model from a non-object in class Model');
		}

		return result;
	}

	/**
	 * Internal function that finds and returns any available instances of the model.
	 *
	 * @static
	 * @param {Object} attributes An object containing properties that correspond to the attributes in the templated RESTful URL, if not overriden by custom functionality
	 * @param {Boolean} isSingle An optional boolean that defines whether one or many models are returned. Defaults to false.
	 * @param {Object} properties An optional object containing properties that need to be be updated in the model(s) returned. Defaults to {}.
	 * @returns {Array|Model} Deferred instance of the Models that are found
	 */
	static __find__(attributes, isSingle = false, properties = {}) {
		console.log('Model.__find__()');

		var deferred = $.Deferred();

		$.when(
			$.ajax({
				type : this.services.find.method
				,url : Utility.stringFormat(this.services.find.uri, attributes)
				,dataType : this.services.find.format
			})
		).done(
			(data, textStatus, jqXHR) => {
				let filtered = this.filter(data);
				let whittled = ((isSingle || filtered.length == 1) && filtered instanceof Array) ? filtered[0] : filtered;
				let merged = Object.assign(whittled, properties);

				deferred.resolve(
					this.hydrate(merged)
				);
			}
		);

		return deferred.promise();
	}

	/**
	 * Constructs the model instance by merging the attributes with the new model instance.
	 *
	 * @constructor
	 * @param {Object} attributes Attributes needed to instantiate new model instances
	 * @returns {Model} Instance of the model
	 */
	constructor(attributes) {
		console.log('model.constructor()');

		Object.assign(this, attributes);
	}

	/**
	 * Updates the model, and performs an update operation.
	 *
	 * @param {Object} attributes Attributes that will be used to hydrate a new model instance. See `hydrate` for more information.
	 * @returns {Model} Deferred instance of the newly created model
	 */
	update(attributes){
		console.log('model.update()');

		Object.assign(this, attributes).save();
	}

	/**
	 * Performs a save operation.
	 *
	 * @returns {Model} Instance of the saved model
	 */
	save() {
		console.log('model.save()');

		var deferred = $.Deferred();

		// May need to implement a check to see whether create or save would be better...

		$.when(
			$.ajax({
				type : this.services.update.method
				,url : Utility.stringFormat(this.services.update.uri, attributes)
				,dataType : this.services.update.format
			})
		).done(
			(data, textStatus, jqXHR) => deferred.resolve(
				this
			)
		);

		return deferred.promise();
	}

	/**
	 * Deletes the instance of the model.
	 *
	 * @returns {Boolean} Returns a deferred boolean indiciation whether the model was delete sucessfully
	 */
	delete() {
		console.log('model.delete()');

		var deferred = $.Deferred();

		$.when(
			$.ajax({
				type : this.services.delete.method
				,url : Utility.stringFormat(this.services.delete.uri, attributes)
				,dataType : this.services.delete.format
			})
		).done(
			(data, textStatus, jqXHR) => deferred.resolve(
				true
			)
		);

		return deferred.promise();
	}
}
