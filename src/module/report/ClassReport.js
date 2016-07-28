import AbstractReport   from './AbstractReport';
import AnalyzeError     from '../../analyze/AnalyzeError';
import AggregateReport  from './AggregateReport';
import MethodAverage    from './averages/MethodAverage';
import MethodReport     from './MethodReport';

/**
 * Provides the class report object which stores data pertaining to a single ES6 class.
 *
 * Methods that are stored as MethodReports in the `methods` member variable.
 */
export default class ClassReport extends AbstractReport
{
   /**
    * Initializes class report.
    *
    * @param {string}   name - Name of the class.
    * @param {number}   lineStart - Start line of class.
    * @param {number}   lineEnd - End line of class.
    */
   constructor(name = '', lineStart = 0, lineEnd = 0)
   {
      super(new AggregateReport(lineStart, lineEnd));

      /**
       * Stores any analysis errors.
       * @type {Array}
       */
      this.errors = [];

      /**
       * Stores the end line for the class.
       * @type {number}
       */
      this.lineEnd = lineEnd;

      /**
       * Stores the start line for the class.
       * @type {number}
       */
      this.lineStart = lineStart;

      /**
       * Stores all method data.
       * @type {Array<MethodReport>}
       */
      this.methods = [];

      /**
       * Stores the average method metric data.
       * @type {HalsteadAverage}
       */
      this.methodAverage = new MethodAverage();

      /**
       * The name of the class.
       * @type {string}
       */
      this.name = name;
   }

   /**
    * Clears all errors stored in the class report and by default any class methods.
    *
    * @param {boolean}  clearChildren - (Optional) If false then class method errors are not cleared; default (true).
    */
   clearErrors(clearChildren = true)
   {
      this.errors = [];

      if (clearChildren)
      {
         this.methods.forEach((report) => { report.clearErrors(); });
      }
   }

   /**
    * Gets all errors stored in the class report and by default any class methods.
    *
    * @param {boolean}  includeChildren - (Optional) If false then class method errors are not included; default (true).
    *
    * @returns {Array<AnalyzeError>}
    */
   getErrors(includeChildren = true)
   {
      const errors = [].concat(...this.errors);

      if (includeChildren)
      {
         this.methods.forEach((report) => { errors.push(...report.getErrors()); });
      }

      return errors;
   }

   /**
    * Deserializes a JSON object representing a ClassReport.
    *
    * @param {object}   object - A JSON object of a ClassReport that was previously serialized.
    *
    * @returns {ClassReport}
    */
   static parse(object)
   {
      /* istanbul ignore if */
      if (typeof object !== 'object') { throw new TypeError(`parse error: 'object' is not an 'object'.`); }

      const classReport = Object.assign(new ClassReport(), object);

      if (classReport.errors.length > 0)
      {
         classReport.errors = classReport.errors.map((error) => { return Object.assign(new AnalyzeError(), error); });
      }

      if (classReport.methods.length > 0)
      {
         classReport.methods = classReport.methods.map((methodReport) => { return MethodReport.parse(methodReport); });
      }

      return classReport;
   }
}
