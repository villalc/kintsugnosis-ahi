# Configuración de Pagos y Autenticación (Guía de Acción Rápida)

Esta guía detalla cómo habilitar cobros (Stripe) y login (Google) sin escribir código complejo de backend, ideal para la fase de validación B2B.

---

## 1. Autenticación con Google (Firebase)

El código ya está listo en `AuthContext.tsx`. Solo necesitas activarlo en la nube.

1.  Ve a la [Consola de Firebase](https://console.firebase.google.com/).
2.  Selecciona tu proyecto.
3.  Ve a **Authentication** > **Sign-in method** (Método de inicio de sesión).
4.  Haz clic en **Add new provider** (Agregar nuevo proveedor) y selecciona **Google**.
5.  Habilítalo (Enable).
6.  Configura el nombre público del proyecto y el email de soporte.
7.  **Importante:** Copia tu `Client ID` y `Client Secret` si te lo pide (aunque Firebase suele manejar esto automático).
8.  Guarda.

**Resultado:** El botón de "Login with Google" en `/login` funcionará inmediatamente.

---

## 2. Cobros B2B con Stripe (Sin Código)

Para auditorías de alto valor ($20k - $50k MXN), no necesitas una integración compleja de API. Usa **Stripe Payment Links**.

1.  Ve al [Dashboard de Stripe](https://dashboard.stripe.com/).
2.  Ve a **Productos** > **Agregar producto**.
    *   Nombre: `AI Risk Technical Audit - Standard`
    *   Precio: `50,000.00 MXN` (Pago único).
3.  Guarda el producto.
4.  En la página del producto, busca el botón **"Crear enlace de pago"** (Create payment link).
5.  Configura la página de pago (puedes añadir campos personalizados como "Nombre de la Empresa").
6.  Copia la URL generada (ej. `https://buy.stripe.com/test_...`).
7.  Pega esta URL en tu archivo `.env.local` como `NEXT_PUBLIC_STRIPE_AUDIT_LINK`.

**Resultado:** Tienes una pasarela de pagos profesional lista en 5 minutos.

---

## 3. Flujo Operativo (Manual vs Automático)

### Fase Actual (Manual - Recomendado para < 10 clientes)
1.  El cliente hace clic en "Purchase Audit" en el Dashboard.
2.  Paga en Stripe.
3.  Tú recibes un email de confirmación de Stripe.
4.  Contactas al cliente para agendar la extracción de logs.
5.  Ejecutas el script `packages/audit-cli` y generas el PDF.
6.  Envías el PDF por email.

### Fase Futura (Automática - "Fase 5")
1.  Stripe envía un Webhook a una Cloud Function (`/stripe-webhook`).
2.  La función verifica el pago.
3.  La función actualiza el rol del usuario en Firestore a `AUDIT_PAID`.
4.  El Dashboard desbloquea automáticamente la sección de subida de logs.

**Consejo:** No construyas la Fase Futura hasta que te duela hacer la Fase Actual manualmente.
