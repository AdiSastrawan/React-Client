import jwt_decode from "jwt-decode";

export default function jwtDecode(token) {
  const decoded = jwt_decode(token);
  return decoded;
}
