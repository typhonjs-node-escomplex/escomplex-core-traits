import { assert }       from 'chai';

import ModuleReport     from '../../../src/module/report/ModuleReport';
import ProjectResult    from '../../../src/project/result/ProjectResult';

import * as testconfig  from '../testconfig';

if (testconfig.modules['projectResult'])
{
   suite('result:', () =>
   {
      suite('ProjectResult:', () =>
      {
         suite('instantiation:', () =>
         {
            let result;

            setup(() =>
            {
               const report = new ModuleReport(10, 100);
               const report2 = new ModuleReport(10, 100);
               const report3 = new ModuleReport(10, 100);

               report.srcPath = './c.js';
               report2.srcPath = './a.js';
               report3.srcPath = './b.js';

               report.createScope('method', 100, 200);
               report.popScope('method');
               report.createScope('class', 100, 200);
               report.createScope('method', 100, 200);
               report.popScope('method');
               report.popScope('class');

               result = new ProjectResult([report, report2, report3]);

               // Fake the adjacency / visibility lists; a depends on b / b depends on a / c depends on a & b
               result.adjacencyList = [{ row: 0, cols: [1] }, { row: 1, cols: [0] }, { row: 2, cols: [0, 1] }];
               result.visibilityList = [{ row: 0, cols: [2] }, { row: 1, cols: [0] }, { row: 2, cols: [0, 1, 2] }];
            });

            teardown(() => { result = undefined; });

            test('result has correct number of reports', () =>
            {
               assert.lengthOf(result.reports, 3);
            });

            test('result has correct report `srcPath` order', () =>
            {
               assert.strictEqual(result.reports[0].srcPath, './a.js');
               assert.strictEqual(result.reports[1].srcPath, './b.js');
               assert.strictEqual(result.reports[2].srcPath, './c.js');
            });

            test('finalize removes private data', () =>
            {
               assert.isArray(result.reports[2]._scopeStackClass);
               assert.isArray(result.reports[2]._scopeStackMethod);

               result.finalize();

               assert.isUndefined(result.reports[2]._scopeStackClass);
               assert.isUndefined(result.reports[2]._scopeStackMethod);
            });

            test('finalize w/ serializeReports === false is correct', () =>
            {
               const report = new ModuleReport(10, 100);
               report.srcPath = './a.js';
               result = new ProjectResult([report], { serializeReports: false });

               assert.isNotArray(result.reports[0]._scopeStackClass);
               assert.isNotArray(result.reports[0]._scopeStackMethod);

               result.finalize();

               assert.isObject(result.reports[0]);

               const reportKeys = Object.keys(result.reports[0]);

               assert.lengthOf(reportKeys, 3);
               assert.strictEqual(reportKeys[0], 'filePath');
               assert.strictEqual(reportKeys[1], 'srcPath');
               assert.strictEqual(reportKeys[2], 'srcPathAlias');

               assert.isUndefined(result.reports[0].filePath);
               assert.strictEqual(result.reports[0].srcPath, './a.js');
               assert.isUndefined(result.reports[0].srcPathAlias);
            });
         });

         suite('large project parsing performance', () =>
         {
            const largeProjectJSON = require('typhonjs-escomplex-test-data/files/large-project/json/project');

            test('deserialize JSON object should be sufficiently fast', function()
            {
               this.timeout(75);
               ProjectResult.parse(largeProjectJSON);
            });
         });
      });
   });
}