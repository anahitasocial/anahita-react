function username(value) {
  const regex = /^[A-Za-z][A-Za-z0-9_-]{5,}$/;
  return regex.test(String(value).toLowerCase());
}

function email(value) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]*$/;
  return regex.test(String(value).toLowerCase());
}

function password(value) {
  return value && value.length > 5;
}

export default {
  username,
  email,
  password,
};
