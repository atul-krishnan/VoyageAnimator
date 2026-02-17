const valueOrEmpty = (value: string | undefined): string => value?.trim() ?? "";

export const runtimeEnv = {
  mapboxToken: valueOrEmpty(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN),
  supabaseUrl: valueOrEmpty(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: valueOrEmpty(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  supabaseServiceRoleKey: valueOrEmpty(process.env.SUPABASE_SERVICE_ROLE_KEY),
  posthogKey: valueOrEmpty(process.env.NEXT_PUBLIC_POSTHOG_KEY),
  posthogHost: valueOrEmpty(process.env.NEXT_PUBLIC_POSTHOG_HOST),
  siteUrl: valueOrEmpty(process.env.NEXT_PUBLIC_SITE_URL),
};

export const hasMapboxToken = (): boolean => Boolean(runtimeEnv.mapboxToken);

export const hasSupabaseEnv = (): boolean =>
  Boolean(runtimeEnv.supabaseUrl && runtimeEnv.supabaseAnonKey);

export const hasSupabaseServiceRole = (): boolean =>
  Boolean(runtimeEnv.supabaseServiceRoleKey);
