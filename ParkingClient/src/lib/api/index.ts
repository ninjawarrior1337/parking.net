import { getDefaultStore } from "jotai";
import ky from "ky";
import { tokenAtom } from "../auth/tokenStore";

export const getKy = () => {
  const token = getDefaultStore().get(tokenAtom);
  return ky.create({
    prefixUrl: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `${token}`,
    },
  });
};
