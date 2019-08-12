function username(u) {
  const value = String(u).toLowerCase();
  const regex = /^[A-Za-z][A-Za-z0-9_-]{5,}$/;
  return value !== '' && regex.test(value);
}

function email(e) {
  const value = String(e).toLowerCase();
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return value !== '' && regex.test(value);
}

function password(p) {
  const value = String(p);
  const regex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');
  return value !== '' && regex.test(p);
}

export {
  username,
  email,
  password,
};
