import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://server.robogreenmilionario.com',
});

export const apiNot = axios.create({
  baseURL: 'https://onesignal.com/api/v1',
});
