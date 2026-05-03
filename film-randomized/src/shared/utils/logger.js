/**
 * Centralised logger. The goal is not to replace an observability stack but
 * to give us a single choke-point: every `console.error` scattered around
 * the codebase funnels through `logger.error(scope, err, extra?)` so we can
 * later swap the sink (Sentry, Datadog, server endpoint) without grepping
 * the whole frontend.
 *
 * `scope` is a short string identifying where the error originated
 * ("useMediaFetcher", "CollectionContent.remove", ...). It is intentionally
 * free-form: pick whatever you would write at a breakpoint.
 */

const isProd = import.meta.env?.MODE === 'production';

function emit(level, scope, payload, extra) {
  if (isProd && level === 'debug') return;

  const prefix = `[${scope}]`;
  if (extra !== undefined) {
    console[level](prefix, payload, extra);
  } else {
    console[level](prefix, payload);
  }
}

export const logger = {
  debug(scope, payload, extra) {
    emit('debug', scope, payload, extra);
  },
  info(scope, payload, extra) {
    emit('info', scope, payload, extra);
  },
  warn(scope, payload, extra) {
    emit('warn', scope, payload, extra);
  },
  error(scope, payload, extra) {
    emit('error', scope, payload, extra);
  },
};
