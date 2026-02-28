# Post-Mortem: Bugs de Flujo de Unión (Join Requests) y Fallos Silenciosos de RLS

Este documento detalla una serie de bugs interconectados que causaron comportamientos inesperados (incluyendo errores 409 Conflict y estados inconsistentes) durante el flujo de unirse a un plan. Sirve como referencia para evitar problemas similares relacionados con las Políticas de Seguridad de Filas (RLS) de Supabase y el cliente SSR.

## 1. El Bug del Error 409 Conflict

**Síntoma:**
Un usuario (ej. `test2`) no creador del plan hace clic en "Request to Join". La accion hace que el estado se ponga en pending en base de datos, si el creador acepta la solicitud, la bd se pone a accepted pero despues de eso el boton del `test2` vuelve a aparecer como "Request to Join".
Si el usuario vuelve a hacer clic, la consola arroja un error `409 Conflict`.

**Causa Raíz:**

1. **Éxito Inicial Invisible:** Al primer clic, el backend insertaba correctamente la solicitud en la tabla `join_requests` con estado `pending`.
2. **El Fallo de Lectura (Select):** Inmediatamente después, el frontend volvía a consultar el plan mediante `plans.byId`. El backend intentaba leer la tabla `join_requests` para ver si el usuario tenía una solicitud pendiente.
3. **Bloqueo Silencioso por RLS:** La base de datos denegaba la lectura. Aunque la fila existía, la política RLS de `join_requests` exigía que `auth.uid() = user_id`.
4. **Contexto de Autenticación Roto en SSR:** El servidor tRPC (`server/context.ts`) creaba el cliente de Supabase pasando el token JWT en `global.headers: { Authorization }`. Sin embargo, en versiones recientes de `@supabase/supabase-js`, esto **no siempre establece correctamente la sesión activa** para que PostgreSQL evalúe `auth.uid()` durante el renderizado del lado del servidor (SSR) o llamadas a la API. Como la base de datos no sabía con certeza quién hacía la consulta, la política RLS evaluaba a `false` y devolvía 0 filas ("silenciosamente").
5. **El Conflicto:** Al devolver 0 filas, el backend asumía que no había solicitud y enviaba al frontend el estado `userJoinStatus: 'none'`. El frontend seguía mostrando el botón. Al hacer clic por segunda vez, la base de datos (que sí tiene restricciones `UNIQUE` fuertes) bloqueaba la inserción duplicada devolviendo un real `409 Conflict`.

**Solución:**
Se reescribió la instanciación del cliente Supabase en `server/context.ts`. En lugar de solo pasar cabeceras globales, se obliga al cliente a establecer la sesión usando el token recibido antes de ejecutar cualquier query.

```typescript
// MAL: El token en headers no siempre establece la sesión RLS en el backend
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
});

// BIEN: Establecer la sesión explícitamente fuerza el auth.uid()
const { data, error } = await supabase.auth.getUser(token);
if (data.user) {
    await supabase.auth.setSession({ access_token: token, refresh_token: '' });
}
```

> [!CAUTION]
> Cuando la base de datos rechaza una lectura (`SELECT`) por falta de permisos RLS, **no lanza un error**. Simplemente actúa como si la fila no existiera (devuelve un array vacío o `null` si usas `.single()`). Esto hace que los bugs de RLS en lecturas sean extremadamente difíciles de rastrear. Utiliza `.maybeSingle()` para evitar excepciones de PostgREST y revisa siempre el Auth Context.

---

## 2. El Bug del "Aceptado pero no Asistente" (El Limbo)

**Síntoma:**
El usuario (`test2`) solicita unirse y su botón cambia correctamente a "Pending". El creador del plan hace clic en "Aceptar" y la solicitud pasa a estado `accepted` en la base de datos. Sin embargo, cuando `test2` recarga el plan, **no aparece en la lista de asistentes (`plan_attendees`)**. Peor aún, su botón **vuelve a cambiar al color rosa inicial de "Request to Join"**, a pesar de haber sido aceptado por el creador.

**Causa Raíz:**

1. **Actualización Exitosa:** El backend (`respondToJoinRequest`) actualizaba correctamente el estado de la solicitud en `join_requests` a `accepted` (el creador tiene permisos RLS para hacer este `UPDATE`).
2. **Fallo de Inserción (Insert) Bloqueado por RLS:** A continuación, el backend intentaba insertar un registro en `plan_attendees` vinculando el `plan_id` y el `user_id` de `test2`. El problema es que **quien ejecuta esta acción es el Creador (Host)**. La política RLS de `plan_attendees` para operaciones `INSERT` decía textualmente: `auth.uid() = user_id`. Es decir, "Solo tú puedes añadirte a ti mismo". Como el Host intentaba insertar el ID de `test2`, la base de datos bloqueó la inserción.
3. **Manejo de Errores Inexistente:** El código original de `plans.ts` ejecutaba el `insert` pero no comprobaba si había devuelto un `error`. Como la función no lanzaba ninguna excepción, el backend devolvía `{ success: true }` de forma engañosa.
4. **Estado Inconsistente:** La solicitud quedó marcada como 'Aceptada', pero el usuario nunca entró en la tabla de asistentes.
5. **Regresión Visual:** Cuando el frontend volvía a consultar el plan mediante `plans.byId`, primero verificaba si el usuario estaba en `plan_attendees` (No estaba). Luego, buscaba en `join_requests` buscando específicamente el estado `pending` (No lo encontraba porque ahora era `accepted`). Al no cumplir ninguna de las dos condiciones, el backend resolvía que el estado era `userJoinStatus: 'none'`, provocando que el frontend volviera a renderizar el botón rosa original.

**Solución:**

1. **Corregir la Política RLS:** Se modificó la política de inserción en la tabla `plan_attendees` en PostgreSQL para permitir que los anfitriones del plan inserten a otros usuarios:
    ```sql
    -- Nueva Política: "Host puede aniadir asistentes"
    CREATE POLICY "Host puede aniadir asistentes" ON plan_attendees
    FOR INSERT
    WITH CHECK (auth.uid() = (SELECT host_id FROM plans WHERE plans.id = plan_id));
    ```
2. **Programación Defensiva en el Backend:** Se añadió un bloque de verificación de errores en la operación de inserción. Si la base de datos rechaza un comando (por RLS, restricciones UNIQUE, o tipos de datos), el backend ahora lo captura y aborta la transacción, arrojando un error `500 INTERNAL_SERVER_ERROR` explícito para que no vuelva a fallar en silencio.

```typescript
// BIEN: Capturar errores de base de datos siempre tras una mutación
const { error: insertError } = await ctx.supabase
    .from('plan_attendees')
    .insert({ plan_id: input.planId, user_id: input.userId });

if (insertError) {
    console.error('Fallo SQL al insertar:', insertError);
    throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: insertError.message,
    });
}
```

## Lecciones Aprendidas (Checklist para Prevención)

Siempre que diseñes lógicas que involucren a múltiples usuarios (ej. invitaciones, chats, aprobaciones):

- [ ] **Auth Context:** Verifica que `context.ts` inicie la sesión de Supabase explícitamente (`setSession`) para que `auth.uid()` exista.
- [ ] **Pensamiento RLS:** Pregúntate: _"El usuario A está modificando datos que involucran al usuario B. ¿Tienen mis políticas RLS excepciones para permitir que A haga The Operation en nombre de B?"_
- [ ] **Captura de Errores Crítica:** **NUNCA** realices un `INSERT`, `UPDATE` o `DELETE` sin almacenar su constante `error` y lanzar un `TRPCError` si dicho error existe. Un fallo silencioso corrompe el estado de tu aplicación.
- [ ] **Uso de `.maybeSingle()`:** Al consultar datos específicos de relaciones frágiles, prefiere `.maybeSingle()` sobre `.single()` para que PostgREST no haga "crash" con error 406 Not Acceptable cuando una política RLS oculta la única fila esperada.
