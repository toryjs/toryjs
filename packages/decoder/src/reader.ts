export function read() {
  const config = (window as any).tory_website;
  if (!config) {
    throw new Error(
      'Tory could not find a website definition in the global space. Please make sure you have configured your server correctly to inject the tory configuration.'
    );
  }
  return config;
}
