#!/usr/bin/env bash
# Cursor Agent hook: после завершения цикла агента — lint:fix и type-check в apps/client.
# Читает JSON со stdin (протокол hooks), при ошибках tsc/eslint может вернуть followup_message.
set -euo pipefail

INPUT=$(cat || true)
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CLIENT="$ROOT/apps/client"

LOOP_COUNT=$(printf '%s' "$INPUT" | node -e "
  let s = '';
  process.stdin.on('data', (d) => (s += d));
  process.stdin.on('end', () => {
    try {
      const j = JSON.parse(s || '{}');
      process.stdout.write(String(j.loop_count ?? 0));
    } catch {
      process.stdout.write('0');
    }
  });
" 2>/dev/null || echo "0")

emit_json() {
  export HOOK_FOLLOWUP_MSG="$1"
  node -e "process.stdout.write(JSON.stringify({ followup_message: process.env.HOOK_FOLLOWUP_MSG || '' }))"
  unset HOOK_FOLLOWUP_MSG
}

no_followup() {
  echo '{}'
}

# Нет изменений в apps/client — выходим без работы
if ! git -C "$ROOT" status --porcelain "$CLIENT" 2>/dev/null | grep -q .; then
  if ! git -C "$ROOT" diff --name-only HEAD -- "$CLIENT" 2>/dev/null | grep -q .; then
    no_followup
    exit 0
  fi
fi

cd "$CLIENT"

set +e
LINT_LOG=$(mktemp)
TSC_LOG=$(mktemp)
npm run lint:fix >"$LINT_LOG" 2>&1
LINT_EXIT=$?
npm run type-check >"$TSC_LOG" 2>&1
TSC_EXIT=$?
set -e

if [ "$LINT_EXIT" -eq 0 ] && [ "$TSC_EXIT" -eq 0 ]; then
  no_followup
  exit 0
fi

# Не зацикливаем агента сверх лимита follow-up
if [ "$LOOP_COUNT" -ge 5 ]; then
  cat "$LINT_LOG" >&2
  cat "$TSC_LOG" >&2
  rm -f "$LINT_LOG" "$TSC_LOG"
  no_followup
  exit 0
fi

trim_log() {
  python3 -c "import sys; print(sys.stdin.read()[:12000])" 2>/dev/null || head -n 400
}

ERR_PART=""
if [ "$LINT_EXIT" -ne 0 ]; then
  ERR_PART+=$'=== npm run lint:fix ===\n'"$(trim_log <"$LINT_LOG")"$'\n\n'
fi
if [ "$TSC_EXIT" -ne 0 ]; then
  ERR_PART+=$'=== npm run type-check ===\n'"$(trim_log <"$TSC_LOG")"$'\n'
fi
rm -f "$LINT_LOG" "$TSC_LOG"

MSG=$'Исправь ошибки в apps/client (после lint:fix / type-check):\n\n'"${ERR_PART}"
emit_json "$MSG"
exit 0
