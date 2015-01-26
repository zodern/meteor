// XXX COMPAT WITH 0.9.1 : accept migrationData instead of dictName
ReactiveDict = function (dictName) {
  // this.keys: key -> value
  if (dictName) {
    return new SerializingReactiveDict(dictName);
  } else {
    return new BaseReactiveDict();
  }
};
