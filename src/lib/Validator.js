const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
export function nameValidator(name) {
  return name.length > 3 && name.length < 20;
}
export function emailValidator(email) {
  return email.match(emailRegex);
}
export function passwordValidator(password) {
  return password.match(passwordRegex);
}
