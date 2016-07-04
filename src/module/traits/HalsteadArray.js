import TraitHalstead from './TraitHalstead';

/**
 * Provides a wrapper around an array of Halstead properties object hashes which should contain an
 * `identifier` field and potentially a `filter` field.
 */
export default class HalsteadArray
{
   /**
    * Initializes HalsteadArray by normalizing any Halstead properties converting them into TraitHalstead instances.
    *
    * @param {string}               metric - The name of Halstead metric being stored.
    * @param {Array<object|string>} data - An array of Halstead properties.
    */
   constructor(metric, data)
   {
      /* istanbul ignore if */
      if (typeof metric !== 'string') { throw new TypeError('ctor error: metric is not a `string`.'); }

      /* istanbul ignore if */
      if (!Array.isArray(data)) { throw new TypeError('ctor error: data is not an `Array`.'); }

      /**
       * Stores an array of normalized Halstead property data to an object hash that has an `identifier` entry.
       * @type {Array<TraitHalstead>}
       * @private
       */
      this._data = data.map((property) =>
      {
         return property && typeof property.identifier !== 'undefined' ? new TraitHalstead(metric, property) :
          new TraitHalstead(metric, { identifier: property });
      });

      /**
       * Stores the Halstead metric type.
       * @type {string}
       * @private
       */
      this._metric = metric;
   }

   /**
    * Allows custom processing of TraitHalstead data.
    *
    * @param {function} method - A custom method to process each TraitHalstead data.
    */
   forEach(method)
   {
      this._data.forEach(method);
   }

   /**
    * Returns a TraitHalstead entry at the given index.
    *
    * @param {number}   index - Index to access.
    *
    * @returns {TraitHalstead}
    */
   get(index)
   {
      return this._data[index];
   }

   /**
    * Returns the length of wrapped TraitHalstead data.
    *
    * @returns {number}
    */
   get length() { return this._data.length; }

   /**
    * Returns the associated metric type.
    *
    * @returns {string}
    */
   get metric() { return this._metric; }

   /**
    * Returns an array of evaluated TraitHalstead data as the value of the `identifier` field of the wrapped data.
    * Additionally the TraitHalstead filter function is invoked with the given parameters removing any values that
    * fail the filter test.
    *
    * @param {*}  params - Provides parameters which are forwarded onto any data stored as a function. Normally
    *                      `params` should be the `current AST node, parent AST node, ... optional data`.
    *
    * @returns {Array<string>}
    */
   valueOf(...params)
   {
      const filtered = this._data.filter((traitHalstead) =>
      {
         return typeof traitHalstead.valueOf(...params) !== 'undefined' && traitHalstead.filter(...params);
      });

      // Map all TraitHalstead data and flatten any array of identifiers returned from `valueOf`.
      return [].concat(...filtered.map((traitHalstead) => { return traitHalstead.valueOf(...params); }));
   }
}
