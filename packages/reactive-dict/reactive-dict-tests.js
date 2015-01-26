var reactiveDict = new ReactiveDict();

Tinytest.add('reactive-dict - setDefault', function (test) {
  reactiveDict.setDefault('def', "argyle");
  test.equal(reactiveDict.get('def'), "argyle");
  reactiveDict.set('def', "noodle");
  test.equal(reactiveDict.get('def'), "noodle");
  reactiveDict.set('nondef', "potato");
  test.equal(reactiveDict.get('nondef'), "potato");
  reactiveDict.setDefault('nondef', "eggs");
  test.equal(reactiveDict.get('nondef'), "potato");
  // This is so the test passes the next time, after hot code push.  I know it
  // doesn't return it to the completely untouched state, but we don't have
  // reactiveDict.clear() yet.  When we do, this should be that.
  delete reactiveDict.keys['def'];
  delete reactiveDict.keys['nondef'];
});

Tinytest.add('reactive-dict - get/set/equals types', function (test) {
  test.equal(reactiveDict.get('u'), undefined);

  reactiveDict.set('u', undefined);
  test.equal(reactiveDict.get('u'), undefined);

  reactiveDict.set('n', null);
  test.equal(reactiveDict.get('n'), null);

  reactiveDict.set('t', true);
  test.equal(reactiveDict.get('t'), true);

  reactiveDict.set('f', false);
  test.equal(reactiveDict.get('f'), false);

  reactiveDict.set('num', 0);
  test.equal(reactiveDict.get('num'), 0);

  reactiveDict.set('str', 'true');
  test.equal(reactiveDict.get('str'), 'true');

  reactiveDict.set('arr', [1, 2, {a: 1, b: [5, 6]}]);
  test.equal(reactiveDict.get('arr'), [1, 2, {b: [5, 6], a: 1}]);

  reactiveDict.set('obj', {a: 1, b: [5, 6]});
  test.equal(reactiveDict.get('obj'), {b: [5, 6], a: 1});

  reactiveDict.set('date', new Date(1234));
  test.equal(reactiveDict.get('date'), new Date(1234));

  reactiveDict.set('oid', new Mongo.ObjectID('ffffffffffffffffffffffff'));
  test.equal(reactiveDict.get('oid'),  new Mongo.ObjectID('ffffffffffffffffffffffff'));
});

Tinytest.add('reactive-dict - context invalidation for get', function (test) {
  var xGetExecutions = 0;
  Tracker.autorun(function () {
    ++xGetExecutions;
    reactiveDict.get('x');
  });
  test.equal(xGetExecutions, 1);
  reactiveDict.set('x', 1);
  // Invalidation shouldn't happen until flush time.
  test.equal(xGetExecutions, 1);
  Tracker.flush();
  test.equal(xGetExecutions, 2);
  // Setting to the same value doesn't re-run.
  reactiveDict.set('x', 1);
  Tracker.flush();
  test.equal(xGetExecutions, 2);
  reactiveDict.set('x', '1');
  Tracker.flush();
  test.equal(xGetExecutions, 3);
});
