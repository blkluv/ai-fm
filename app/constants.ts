import getEnv from "~/get-env";

export const constants = {
  baseApiUrl: getEnv().API_URL,
  baseApiWsUrl: getEnv().WS_API_URL,
}