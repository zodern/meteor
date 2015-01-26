Package.describe({
  summary: "Reactive dictionary",
  version: '1.0.5'
});

Package.onUse(function (api) {
  api.use(['underscore', 'tracker', 'ejson']);
  api.export('ReactiveDict');

  api.addFiles("base-reactive-dict.js");
  api.addFiles("serializing-reactive-dict.js");

  api.addFiles('reactive-dict.js');
  api.addFiles('migration.js');
});

Package.onTest(function (api) {
  api.use(['tinytest', 'reactive-dict']);
  api.addFiles("reactive-dict-tests.js");
});
