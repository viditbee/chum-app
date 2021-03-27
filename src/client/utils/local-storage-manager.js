export const setInLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key) => {
  const val = localStorage.getItem(key);
  if(val){
    return JSON.parse(val);
  }
  return null;
};
