import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  if (url.hostname === 'plomerossaor.com') {
    return Response.redirect(
      `https://www.plomerossaor.com${url.pathname}${url.search}`,
      301
    );
  }
  return next();
});
