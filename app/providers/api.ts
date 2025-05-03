import _axios, {AxiosInstance} from 'axios';
import {constants} from '~/constants';

const API_BASE_URL = constants.baseApiUrl;
const API_TIMEOUT = 30000; // 30 seconds

const axiosClient: AxiosInstance = _axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const api = axiosClient;
