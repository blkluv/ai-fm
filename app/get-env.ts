function isBrowser() {
  return typeof window !== 'undefined';
}

function getEnv() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return isBrowser() ? (window as any).ENV : process.env;
}

export default getEnv;
