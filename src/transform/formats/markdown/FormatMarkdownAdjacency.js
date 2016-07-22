import FormatTextAdjacency from '../text/FormatTextAdjacency';

/**
 * Provides a format transform for ModuleReport / ProjectResult instances converting a matrix list into plain text.
 */
export default class FormatMarkdownAdjacency extends FormatTextAdjacency
{
   constructor(headers = {}, keys = {})
   {
      super(Object.assign(Object.assign({}, s_DEFAULT_HEADERS), headers), keys);
   }

   /**
    * Gets the file extension.
    *
    * @returns {string}
    */
   get extension()
   {
      return 'md';
   }

   /**
    * Gets the format name.
    *
    * @returns {string}
    */
   get name()
   {
      return 'markdown-adjacency';
   }
}

// Module private ---------------------------------------------------------------------------------------------------

/**
 * Defines the default headers added to any output strings..
 * @type {{entryPrepend: string, textHeader: string}}
 * @ignore
 */
const s_DEFAULT_HEADERS =
{
   entryPrepend: '* ',
   entryWrapper: '`',
   textHeader: '* Adjacency (dependencies / numerical indices correspond to ProjectResult modules / reports):\n'
};