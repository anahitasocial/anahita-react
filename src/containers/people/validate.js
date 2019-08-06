function username(value) {
  const regex = /^[A-Za-z][A-Za-z0-9_-]{5,}$/;
  return regex.test(String(value).toLowerCase());
}

function email(value) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{5,}$/;
  return regex.test(String(value).toLowerCase());
}

function password(value) {
  const regex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');
  return regex.test(String(value));
}

export {
  username,
  email,
  password,
};
