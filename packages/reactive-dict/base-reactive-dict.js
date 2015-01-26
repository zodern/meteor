// Helper function to call changed on a key that might not exist
changed = function (v) {
  if (v) {
    v.changed();
  }
};

BaseReactiveDict = function () {
  // Actual data storage
  this.keys = {};

  // Used for .get to fire a change when the value changes
  this.keyDeps = {};

  // Save the result of converting an undefined
  this._identity = this._convert(undefined);
};

_.extend(BaseReactiveDict.prototype, {
  /**
   * Convert incoming values to a desired representation for internal storage
   * @param  {Object} value Anything the user puts in
   * @return {Object}       The object that will be stored in the internal
   * data structure of the ReactiveDict
   */
  _convert: function (value) {
    // No-op in the base class, override this to modify incoming values, for
    // example to serialize them
    return value;
  },

  // The opposite of _convert
  _unConvert: function (convertedValue) {
    return convertedValue;
  },

  /**
   * Compare two internally stored values
   * @param  {Object} l A value of the form returned by _convert
   * @param  {Object} r A value of the form returned by _convert
   * @return {Boolean} True if the items should be considered equal 
   */
  _equals: function (l, r) {
    return _.isEqual(l, r);
  },

  /**
   * Set a value
   * @param {String} key   The key
   * @param {Object} value Any value
   */
  set: function (key, value) {
    var self = this;

    value = self._convert(value);

    var oldValue = self._identity;
    if (_.has(self.keys, key)) {
      oldValue = self.keys[key];
    }

    if (self._equals(value, oldValue)) {
      // Do nothing, the set has no effect
      return;
    }

    self.keys[key] = value;

    changed(self.keyDeps[key]);
  },

  setDefault: function (key, value) {
    var self = this;

    // for now, explicitly check for undefined, since there is no
    // ReactiveDict.clear().  Later we might have a ReactiveDict.clear(), in which case
    // we should check if it has the key.
    if (self.keys[key] === undefined) {
      self.set(key, value);
    }
  },

  get: function (key) {
    var self = this;
    self._ensureKey(key);
    self.keyDeps[key].depend();
    return self._unConvert(self.keys[key]);
  },

  equals: function (key, value) {
    // In the base class, there is no efficient way to do .equals, so we only do
    // it in the serializing variants
    throw new Error(".equals is not implemented on this object.");
  },

  _ensureKey: function (key) {
    var self = this;
    if (!(key in self.keyDeps)) {
      self.keyDeps[key] = new Tracker.Dependency();
    }
  }
});