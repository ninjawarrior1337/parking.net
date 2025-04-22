import { atom, getDefaultStore } from "jotai";
import { jwtDecode } from "jwt-decode";
import { LoginRequest, LoginResponse } from "../api/types";
import { getKy } from "../api";

export const tokenAtom = atom<string|null>(null)
export const decodedTokenAtom = atom(get => {
    const token = get(tokenAtom)
    return token ? jwtDecode(token) : null
})
export const isAdminAtom = atom(get => {
    const data = get(decodedTokenAtom)

    if(data && "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" in data) {
        return data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] == "Admin"
    } else {
        return false
    }
})

export const login = async (loginRequest: LoginRequest) => {
    const ky = getKy()

    const loginResponse = await ky.post("Admin/Login", {json: loginRequest}).json<LoginResponse>()

    if(loginResponse.success) {
        const store = getDefaultStore()
        store.set(tokenAtom, loginResponse.token)
    } else {
        throw new Error(loginResponse.message)
    }
}