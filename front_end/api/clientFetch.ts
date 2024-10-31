'use client';

import { APP_TOKEN } from '@/constants/localStorage';

/**
 * Fetch data from the server
 * @param url URL to fetch
 * @param requestInit Optional request config
 * @returns Response object
 */
const clientFetch = async (url: string, requestInit?: RequestInit) => {
  const newOptions = { ...requestInit };
  const contentType = 'application/json';
  const headers = {
    'Content-Type': contentType,
    Authorization: `Bearer ${localStorage.getItem(APP_TOKEN)}`,
    ...requestInit?.headers,
  };
  newOptions.headers = headers;

  const response = await fetch(url, newOptions);

  if (response.ok) {
    return response;
  }

  const bodyText = await response.text();

  try {
    return Promise.reject(JSON.parse(bodyText));
  } catch (_err) {
    throw Error(bodyText);
  }
};

export { clientFetch };
