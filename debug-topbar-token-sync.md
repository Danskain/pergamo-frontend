# Debug Session: topbar-token-sync
- **Status**: [OPEN]
- **Issue**: El top bar no muestra nombre y rol al abrir el front nuevo desde el Pérgamo antiguo; solo aparecen después de recargar la página.
- **Debug Server**: http://127.0.0.1:7777/event
- **Log File**: .dbg/trae-debug-log-topbar-token-sync.ndjson

## Reproduction Steps
1. Abrir el Pérgamo antiguo.
2. Dar clic al botón que abre el front nuevo.
3. Esperar a que cargue el dashboard del front nuevo.
4. Verificar que el top bar muestre fallback.
5. Recargar la página y verificar que ahora sí muestra nombre y rol.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | El `postMessage` llega, pero el guardado de sesión ocurre después del primer render del top bar y el componente no se repinta. | High | Low | Pending |
| B | El `postMessage` llega más de una vez y una carrera entre handshake, bootstrap y restauración termina dejando un estado de perfil inicial en memoria hasta F5. | High | Medium | Pending |
| C | En Railway el `postMessage` aceptado trae token correcto, pero el `userProfile` calculado no se resuelve antes de la primera lectura del top bar. | Medium | Low | Pending |
| D | El top bar se crea con fallback y Nebular/Angular no reactualiza alguna parte del árbol hasta una navegación completa o refresh. | Medium | Medium | Pending |
| E | El token sí se persiste al abrir, pero el problema real está en el orden temporal `bridge -> saveFromMessage -> APP_INITIALIZER -> topbar render`. | High | Medium | Pending |

## Log Evidence
[Pending]

## Verification Conclusion
[Pending]
