import { atom, getDefaultStore } from "jotai";
import { jwtDecode } from "jwt-decode";
import { LoginRequest, LoginResponse } from "../api/types";
import { getKy } from "../api";
import { atomWithStorage } from "jotai/utils";

export const tokenAtom = atomWithStorage<string | null>("token", null, undefined, {getOnInit: true});
export const decodedTokenAtom = atom((get) => {
  const token = get(tokenAtom);
  return token ? jwtDecode(token) : null;
});

export const isAuthenticatedAtom = atom(get => {
  const tokenData = get(decodedTokenAtom)

  if(tokenData) {
    return tokenData.exp! > (Date.now() / 1000)
  }

  return false
})

export const isAdminAtom = atom((get) => {
  const data = get(decodedTokenAtom);

  if(!get(isAuthenticatedAtom)) {
    return false
  }

  if (
    data &&
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" in data
  ) {
    return (
      data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ==
      "Admin"
    );
  } else {
    return false;
  }
});

export const login = async (loginRequest: LoginRequest) => {
  const ky = getKy();

  const loginResponse = await ky
    .post("Admin/Login", { json: loginRequest, throwHttpErrors: true })
    .json<LoginResponse>();

  if (loginResponse.success) {
    const store = getDefaultStore();
    store.set(tokenAtom, loginResponse.token);
  } else {
    throw new Error(loginResponse.message);
  }
};
