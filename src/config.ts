// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "Guille Polito";
export const SITE_DESCRIPTION =
  "Welcome to my website! I am a researcher at Inria on testing and language implementations.";
export const TWITTER_HANDLE = "@guillepolito";
export const MY_NAME = "Guille Polito";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
