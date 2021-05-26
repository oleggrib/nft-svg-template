const asyncHandle = async (promise) => {
  try {
    const data = await promise;
    return [data, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

module.exports = asyncHandle;