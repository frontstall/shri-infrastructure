let id = 0;

const getId = () => {
  const result = id;

  id += 1;

  return result;
};

export default getId;
