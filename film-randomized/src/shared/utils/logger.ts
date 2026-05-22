const isProd = import.meta.env?.MODE === 'production';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Emette un log
 * @param level Livello di log
 * @param scope Scope del log
 * @param payload Payload del log
 * @param extra Extra del log
 */
function emit(level: LogLevel, scope: string, payload: unknown, extra?: unknown): void {
  if (isProd && level === 'debug') return;

  const prefix = `[${scope}]`;
  if (extra !== undefined) {
    console[level](prefix, payload, extra);
  } else {
    console[level](prefix, payload);
  }
}

/**
 * Logger di debug
 * @param scope Scope del log
 * @param payload Payload del log
 * @param extra Extra del log
 */
export const logger = {
  debug(scope: string, payload: unknown, extra?: unknown): void {
    emit('debug', scope, payload, extra);
  },
  /**
   * Logger di info
   * @param scope Scope del log
   * @param payload Payload del log
   * @param extra Extra del log
   */
  info(scope: string, payload: unknown, extra?: unknown): void {
    emit('info', scope, payload, extra);
  },
  /**
   * Logger di warning
   * @param scope Scope del log
   * @param payload Payload del log
   * @param extra Extra del log
   */
  warn(scope: string, payload: unknown, extra?: unknown): void {
    emit('warn', scope, payload, extra);
  },
  /**
   * Logger di errore
   * @param scope Scope del log
   * @param payload Payload del log
   * @param extra Extra del log
   */
  error(scope: string, payload: unknown, extra?: unknown): void {
    emit('error', scope, payload, extra);
  },
};
