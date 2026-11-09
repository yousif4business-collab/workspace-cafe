export const onRequestPost: PagesFunction<PageEnv> = ({ request, env }) =>
  env.CHAT_API.fetch(request);
