# PRD — Contecsa

> Documento: PRD.md
>
> Proyecto: Plataforma de Control de Compras E2E + Facturas + Analítica (sin ERP actual)

## 0) Resumen ejecutivo

Contecsa necesita una solución para **controlar compras de principio a fin**, reducir operación manual (correo/Excel), mejorar trazabilidad y auditoría, y habilitar **autoservicio de información** (tableros y consultas) sin depender de un perfil técnico. La solución debe operar **sin ERP existente**, apoyándose en un **flujo propio de compras**, con integración a correo y repositorio de documentos, exportabilidad a Excel/Sheets y gobierno de datos (cierres/lock).

## 1) Contexto

* Operación actual: compras gestionadas por **correo + cuadros en Excel/Sheets**; el “sistema”/bodega de datos existente no resuelve el proceso ni el autoservicio.
* Dolor: falta de control del ciclo de compra, cierres incompletos por soportes faltantes, exceso de digitación y errores en facturas, dificultad para reportar y detectar sobreprecios a tiempo.
* Restricción: **no hay ERP**; la solución debe ser una plataforma propia (MVP usable) que puede evolucionar por fases.

## 2) Objetivo

Construir una plataforma que permita:

1. **Flujo de compras E2E** (requisición → aprobación → orden → confirmación → seguimiento → recepción → documentos → cierre).
2. **Recepción y validación de facturas** (buzón email + PDF/foto), minimizando digitación.
3. **Cargas masivas** (asociación de factura/atributos a múltiples registros).
4. **Tableros e informes** (KPIs y control de precios) y **consultas ad-hoc** sin depender de técnico.
5. **Auditoría y gobierno**: trazabilidad completa, control de permisos, cierre mensual y bloqueo de registros revisados.

## 3) Alcance

### 3.1 Incluye

* Módulo de Compras (E2E) con estados, responsables, bitácora y documentos.
* Módulo de Facturas (inbox + extracción + validaciones + relación con compras).
* Módulo de Notificaciones (resúmenes, alertas, vencimientos).
* Módulo de Reportes/Dashboards + exportación.
* Modelo multi-proyecto/centro de costo y capacidad para consorcios/UT (cuando aplique).

### 3.2 No incluye (por ahora)

* Contabilidad completa/ERP (plan de cuentas, nómina, etc.).
* Pagos automáticos bancarios (solo workflow y control/estado).
* Automatizaciones irreversibles sin aprobación humana y sin log.

## 4) Usuarios y roles

* **Gerencia**: KPIs, control de precios, alertas, exportables.
* **Compras**: creación/gestión de requisiciones, órdenes, seguimiento, cierres.
* **Almacén/Recepción**: recepción física, entradas, soportes.
* **Calidad/Operación**: certificados, fichas técnicas, garantías.
* **Contabilidad/Finanzas**: facturas, validaciones, estados para pago, cierres.
* **Admin**: catálogos, permisos, auditoría, cierres/lock, integraciones.

## 5) Principios de diseño

* **Trazabilidad por defecto**: todo evento queda en audit log (quién, cuándo, qué cambió, antes/después).
* **Cierre con evidencia**: no se cierra compra si faltan soportes requeridos (o debe quedar excepción justificada).
* **Menos correo, sin romper operación**: el sistema debe convivir con email y absorberlo (inbox + registros).
* **Excel-friendly**: exportación limpia siempre disponible según permisos.
* **Gobierno del dato**: cierres mensuales y bloqueo de edición con control de excepciones.

## 6) Flujos (alto nivel)

### 6.1 Flujo As-Is (actual)

Necesidad en obra → correo a compras → aprobación por correo → compra/orden informal → seguimiento en Excel → recepción → soportes dispersos → cierre manual mensual → reportes a mano.

### 6.2 Flujo To-Be (objetivo)

Requisición en plataforma → aprobaciones → OC/OS → confirmación → seguimiento con bitácora → recepción + soportes → factura (inbox) → validación contra OC/recepción/soportes → estado listo para pago → cierre mensual con lock → dashboards + exportación.

## 7) Requerimientos funcionales (RF)

### Epic A — Compras E2E

#### RF-A1 — Requisiciones (RQ)

* Crear requisición con: proyecto/centro de costo, solicitante, prioridad, tipo, material/servicio, observaciones.
* Adjuntar evidencias (cotizaciones, especificaciones, etc.).
* Estados: Borrador → En aprobación → Aprobada → Rechazada.

**Criterios de aceptación**

* Una RQ debe quedar trazada con fecha/autor y cambios.
* La RQ debe poder convertirse en OC/OS.

#### RF-A2 — Aprobaciones

* Configurar flujo por monto, categoría y/o proyecto.
* Aprobación multi-nivel (p. ej. jefe obra → gerencia → finanzas) según parametrización.
* Delegación y reemplazos.

**Criterios de aceptación**

* Toda aprobación/rechazo registra motivo y evidencia.

#### RF-A3 — Órdenes (OC/OS)

* Crear OC (compra) u OS (servicio) desde RQ.
* Campos: proveedor, forma de pago, valor, fecha OC/OS, ítems/alcance, condiciones.
* Control de versiones (cambios generan nueva versión, no sobreescritura).

#### RF-A4 — Confirmación de OC/OS

* Registrar confirmación (fecha, medio, evidencia).
* Regla: si no confirmada, la factura debe quedar en estado “bloqueada/pendiente” (ver RF-B).

#### RF-A5 — Seguimiento (bitácora)

* Bitácora por compra/orden con registros tipo: llamada, mensaje, promesa proveedor, novedad logística.
* Responsable de seguimiento.

**Criterios de aceptación**

* El seguimiento debe permitir consultar historial por estado/fecha/responsable.

#### RF-A6 — Recepción / Entrega / Entradas

* Marcar recepción total/parcial.
* Registrar “No Entrada” (cuando exista) y evidencia (remisión/acta).
* Campos: entregado (sí/no/parcial), fecha, observaciones.

#### RF-A7 — Documentos de cierre

* Gestión de documentos requeridos por compra:

  * Certificado de calidad (cuando aplique)
  * Ficha técnica
  * Garantía
  * Anexos
* Parametrización por categoría de compra (qué documentos son obligatorios).

**Criterios de aceptación**

* No permitir cierre si falta documento obligatorio (o forzar excepción con aprobación y motivo).

#### RF-A8 — Cierre mensual y justificación de compras “vivas”

* Cierre por periodo (mes) con reporte de compras abiertas.
* Requisito: toda compra que quede abierta debe tener **motivo** (p. ej. “no facturó”, “pendiente certificado”).
* Al cerrar el periodo, aplicar lock (ver gobierno de datos).

---

### Epic B — Facturas (Inbox + extracción + validación)

#### RF-B1 — Inbox de facturas (email)

* Conectar un buzón de facturación.
* Ingestar adjuntos (PDF/imagen) y crear “Factura recibida” con metadatos (fecha recepción, remitente, asunto).
* Dedupe básico (número factura + proveedor + total, si existe).

#### RF-B2 — Captura manual (PDF/foto)

* Carga manual de documento.
* Creación de registro de factura con estado “por extraer/validar”.

#### RF-B3 — Extracción de datos (asistida)

* Extraer (OCR/parsing): proveedor, NIT, número factura, fecha, subtotal/IVA/total, referencia a OC/OS si aparece.
* UI de verificación: humano confirma/ajusta antes de continuar.

#### RF-B4 — Validaciones de factura

Reglas mínimas:

* Bloquear si OC/OS no confirmada.
* Bloquear si proveedor no coincide con OC/OS.
* Alertar si valor supera tolerancia vs OC/OS (parametrizable).
* Bloquear cierre si faltan soportes obligatorios y la categoría lo exige.

Estados sugeridos:

* Recibida → Extraída → Por validar → Bloqueada → Aprobada para pago → Pagada → Archivada.

#### RF-B5 — Asociación factura ↔ compras/entradas

* Vincular factura a una o varias OC/OS (N:N).
* Vincular a entradas/recepciones cuando exista.

---

### Epic C — Cargas masivas

#### RF-C1 — Carga masiva de número de factura

* Subir Excel/CSV para asociar número de factura a múltiples registros (por llave: OC/OS, No Entrada, identificador interno, etc.).
* Previsualización y validación antes de aplicar.

#### RF-C2 — Otras cargas masivas

* Actualizar campos: fecha de pago, estado, responsable de seguimiento, etc., con control de permisos.

---

### Epic D — Reportes, dashboards y consultas

#### RF-D1 — Dashboards operativos

* Compras abiertas (aging) y por estado.
* Lead time por etapa (RQ→OC, OC→confirmación, confirmación→recepción, recepción→cierre).
* Cumplimiento documental (% cerradas con soportes completos).

#### RF-D2 — Control de precios / sobreprecios

* Reporte comparativo por producto/servicio y proveedor en el tiempo.
* Alertas por desviación vs histórico (o tabla de referencia si existe).

#### RF-D3 — Consultas ad-hoc guiadas

* Constructor de consultas básico (filtros + agrupaciones) para usuarios no técnicos.
* Plantillas de reportes recurrentes.

#### RF-D4 — Exportación

* Exportación a Excel/CSV y/o sincronización a Google Sheets (si el entorno lo permite) con control por rol.

---

### Epic E — Notificaciones y alertas (sin spam)

#### RF-E1 — Resumen diario/semana

* Enviar un resumen consolidado por rol:

  * compras abiertas
  * pendientes de confirmación
  * pendientes de documentos
  * facturas bloqueadas

#### RF-E2 — Alertas por umbral

* Compra abierta > N días.
* Factura recibida sin OC confirmada.
* Documentos obligatorios faltantes.
* Desviación de precio.

**Criterios de aceptación**

* Configurable por rol y frecuencia.

---

### Epic F — Multi-proyecto / centros de costo / consorcios

#### RF-F1 — Catálogo de proyectos / centros de costo

* Gestión de proyectos/centros de costo, frentes y responsables.

#### RF-F2 — Consorcios/UT (cuando aplique)

* Modelo de “vehículo consorcial” con % de participación.
* Capacidad de imputación y prorrateo en reportes.

---

### Epic G — Gobierno del dato y auditoría

#### RF-G1 — Audit log

* Registro inmutable de eventos: creación, edición, cambio de estado, adjuntos, aprobaciones.

#### RF-G2 — Lock por cierre

* Al cierre mensual, bloquear edición de campos críticos (valor, proveedor, fechas) salvo excepción aprobada.
* Bitácora de excepciones.

#### RF-G3 — Catálogos controlados

* Listas cerradas: estado, forma de pago, entregado, prioridad, tipos de compra.
* Normalización de fechas y formatos.

## 8) Reglas de calidad de datos (DQ)

Validaciones automáticas:

* Coherencia de fechas: fecha OC/OS >= fecha RQ; fecha recepción >= fecha confirmación; fecha cierre >= fecha recepción.
* Reglas por estado: campos obligatorios por etapa (p. ej. no pasar a “OC emitida” sin proveedor/valor/forma de pago).
* Cierre condicionado por documentos según categoría.
* Dedupe: evitar facturas duplicadas.

## 9) Requerimientos no funcionales (RNF)

* Seguridad: RBAC (roles/permisos), MFA opcional, segregación por proyecto.
* Auditoría: logs exportables, retención configurable.
* Disponibilidad: objetivo 99.5% (ajustable).
* Rendimiento: dashboards < 10s, vistas operativas < 3–5s con filtros comunes.
* Escalabilidad: cientos/miles de compras y facturas por año.
* Usabilidad: UX simple para personal operativo.
* Exportabilidad: salida a Excel siempre disponible según rol.

## 10) Integraciones

* Email (IMAP/Google Workspace/Microsoft 365): ingesta de facturas.
* Almacenamiento de documentos: Drive/S3/SharePoint (según decisión del cliente).
* Directorio/SSO (opcional): Google/Microsoft.

## 11) Modelo de datos (mínimo viable)

### Entidades

* Proyecto / CentroCosto / Frente
* Usuario / Rol
* Proveedor
* Requisicion (RQ)
* Aprobacion (events)
* Orden (OC/OS)
* Seguimiento (bitácora)
* Recepcion / Entrada
* Documento (tipo, url, metadatos)
* Factura
* Pago (estado, fecha pago, evidencia)
* CierrePeriodo (mes) + Locks + Excepciones
* ConsorcioUT (opcional) + Participacion

### Relaciones clave

* RQ 1..N → OC/OS
* OC/OS 1..N → Recepciones/Entradas
* OC/OS N..N ↔ Facturas
* Factura 0..1 → Pago
* Compra/Factura 0..N → Documentos

## 12) KPIs (definiciones)

* Lead time RQ→OC
* Lead time OC→Confirmación
* Lead time Confirmación→Recepción
* Lead time Recepción→Cierre
* % compras cerradas en el mes
* % compras cerradas con soportes completos
* # facturas bloqueadas por regla (y causa)
* Variación de precios por material/proveedor (desviación vs histórico)

## 13) MVP (fases)

### MVP-1 (Control de compras)

* RQ + aprobaciones básicas
* OC/OS + confirmación
* Seguimiento + recepción
* Documentos + cierre mensual + lock
* Dashboard de compras abiertas + lead times
* Exportación a Excel

### MVP-2 (Facturas)

* Inbox email + carga manual
* Extracción asistida
* Validaciones + estados
* Asociación factura↔OC/entrada
* Resumen diario de facturas bloqueadas

### MVP-3 (Precio y automatizaciones)

* Control comparativo de precios + alertas
* Cargas masivas (número de factura / fechas)
* Plantillas de reportes

## 14) Riesgos y mitigaciones

* Adopción: usuarios acostumbrados a correo/Excel → migración gradual + capacitación.
* Datos incompletos: campos no diligenciados → reglas por estado + UX guiada + obligatorios.
* Documentos dispersos: sin repositorio → centralizar adjuntos + tipificación.
* Conectividad en obra: evaluar modo offline (fase posterior) o captura mínima con sincronización.

## 15) Preguntas abiertas (discovery)

* ¿Qué canales de email usan (Google/Microsoft/IMAP)? ¿Hay buzón único de facturas?
* ¿Qué taxonomía de categorías de compra usarán (para documentos obligatorios)?
* ¿Qué proyectos/centros de costo existen hoy y cómo se codifican?
* ¿Qué tolerancias de validación aplican (valor vs OC, recepción parcial, etc.)?
* ¿Requieren SSO y/o segmentación por proyecto/consorcio?
* ¿Dónde se almacenarán documentos (Drive/S3/SharePoint)?
* ¿Se necesita integración con algún sistema legado o solo se reemplaza el proceso?

---

## Anexo A — Campos observados en el Excel (referencia para diseño)

* Estado, tipo requerimiento, prioridad
* Fecha RQ, No RQ, quien realiza la RQ
* Centro de costos/proyecto, quien compra
* Material solicitado, observación del proceso
* Proveedor, ODC/ODS, forma de pago, valor compra
* Fecha ODC/ODS, fecha pago
* Encargado seguimiento, observaciones
* Entregado, No entrada, No factura
* Fecha cierre
* Certificado calidad, ficha técnica, garantía, anexos
