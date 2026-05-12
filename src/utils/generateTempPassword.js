export function generateTempPassword(length = 12) {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";

  const all = upper + lower + numbers + symbols;

  const getRandomChar = (chars) =>
    chars[Math.floor(Math.random() * chars.length)];

  // Garantiza reglas mínimas
  const password = [
    getRandomChar(upper),
    getRandomChar(lower),
    getRandomChar(numbers),
    getRandomChar(symbols),
  ];

  // Completa longitud
  for (let i = password.length; i < length; i++) {
    password.push(getRandomChar(all));
  }

  // Mezcla caracteres
  return password.sort(() => Math.random() - 0.5).join("");
}