# PRD - Sistema de Inteligencia de Datos Contecsa

Version: 1.0 | Date: 2025-12-22 15:45 | Owner: Neero SAS | Status: Draft

**Documentos relacionados:**
- [Análisis Control de Compras Excel](./analisis-control-compras.md) - Análisis detallado del proceso actual en Excel

## Resumen Ejecutivo

Sistema de inteligencia artificial y automatización para Contecsa que resuelve las limitaciones del sistema legacy SICOM mediante un agente conversacional, dashboards en tiempo real, y automatización de procesos críticos de compras y facturación.

**Problema**: Sistema SICOM obsoleto (años 70-80) que genera procesos manuales excesivos, datos inconsistentes, falta de visibilidad en tiempo real y pérdida de control en compras (caso real: sobrecobro no detectado en Cartagena).

**Solución**: Agente IA que extrae y analiza datos de SICOM, genera reportes conversacionales, automatiza seguimiento de compras, procesa facturas con OCR, y provee dashboards ejecutivos sin modificar el sistema legacy.

**Valor**: Reducción 70% tiempo en reportes, detección automática de anomalías en precios, eliminación de ingreso manual de facturas, visibilidad 100% de compras abiertas.

## Contexto del Cliente

### Información de la Empresa
- **Razón Social**: Contecsa
- **Industria**: Construcción / Obras Civiles
- **Estructura**: Empresa matriz + múltiples consorcios e hijos
- **Sistema Actual**: SICOM (versión 2, años 70-80)
- **Áreas Críticas**: Compras, Almacén, Contabilidad, Técnica, Mantenimiento

### Usuarios Finales
| Rol | Necesidades | Cantidad |
|-----|-------------|----------|
| Gerencia | Visibilidad financiera, proyecciones, control global | 2-3 |
| Jefe de Compras | Seguimiento órdenes, validación precios, control proveedores | 1 |
| Auxiliar Compras | Registro requisiciones, seguimiento entregas | 2 |
| Contador | Validación facturas, cierre contable, reportes financieros | 1 |
| Jefe Técnico | Consumo materiales por obra, mantenimiento maquinaria | 1 |
| Auxiliar Almacén | Control inventario, ingresos, salidas | 1 |

## Dolores del Cliente (Pain Points)

### D1. Sistema Legacy Obsoleto
**Severidad**: Crítica | **Impacto**: Toda la operación

- Sistema SICOM de los años 70-80, interfaz de pantalla negra
- Consultas requieren personal técnico especializado
- Versión 2 sin ruta de upgrade (desarrollos actuales se perderán)
- Imposibilidad de desarrollar nuevas funcionalidades
- Exportación constante a Excel para análisis básicos
- "Bodega de datos" sin capacidad de consulta ágil

**Cita textual**: *"Aquí hay una herramienta de los años 80... es una bodega de datos poderosa pero no tenemos como hacer las consultas"*

### D2. Proceso de Compras Ineficiente
**Severidad**: Alta | **Impacto**: Financiero y operativo

- Requisiciones NO se registran en sistema (flujo por correo electrónico)
- Control manual en Excel de seguimiento de compras
- Órdenes de compra abiertas sin control de cierre
- Sin alertas de compras vencidas o pendientes
- Falta de trazabilidad automatizada
- **Caso real**: Sobrecobro en Cartagena no detectado (2 meses), proveedor emitió nota de crédito por error propio

**Cita textual**: *"Se nos pasaron tres facturas en Cartagena, estaban cobrando de más el concreto. Se pagó así. Cuando yo vuelvo, el mismo proveedor nos manda la nota de crédito"*

### D3. Calidad de Datos Deficiente
**Severidad**: Alta | **Impacto**: Confiabilidad de información

- Información mal ingresada frecuentemente ("basura entra, basura sale")
- Cambios no autorizados en planillas de control
- Sin validación al momento de ingreso
- Sin historial de cambios confiable (depende de Google Sheets)
- Necesidad de "cerrar" información manualmente para asegurar integridad

**Cita textual**: *"Yo cambié el proceso... yo digo ya cerré aquí y esa información está correcta. Porque si tú necesitabas una información y está mala..."*

### D4. Procesos Manuales Excesivos
**Severidad**: Alta | **Impacto**: Productividad

- Ingreso manual de facturas una por una
- Digitación manual de datos (alta tasa de error)
- Cruce manual de información entre sistemas
- Generación manual de todos los reportes
- Seguimiento manual de compras en Excel con observaciones diarias
- **Referencia**: Cliente anterior tenía 4 personas solo para abrir Excel y PDF

**Cita textual**: *"¿Qué le toca hacer a la pelabrita? Uno a uno. La 42, 28, 22..."*

### D5. Falta de Información en Tiempo Real
**Severidad**: Media | **Impacto**: Toma de decisiones

- Sin dashboards automatizados
- Sin proyecciones financieras automáticas
- Sin alertas en tiempo real
- Sin indicadores KPI visibles
- Todo análisis requiere exportar a Excel
- Sin detección automática de anomalías (precios, consumos)

### D6. Problemas de Integración
**Severidad**: Media | **Impacto**: Eficiencia operativa

- SICOM completamente aislado (no APIs)
- Sin integración con correo electrónico
- Sistema de almacén desactualizado (cerrado hace 6 años)
- Necesidad de exportar tablas manualmente
- Sin automatización de workflows

### D7. Falta de Control de Mantenimiento
**Severidad**: Media | **Impacto**: Operativo

- Sin alertas de mantenimientos preventivos
- Sin control automatizado de repuestos
- Sin seguimiento de maquinaria por tiempo/uso
- Control manual de piezas y componentes

### D8. Dependencia de Personal Clave
**Severidad**: Media | **Impacto**: Continuidad operativa

- Personal de compras "conoce muy bien" pero no hay documentación
- Dependencia de Excel personal del jefe de compras
- Falta de capacitación en herramientas modernas
- Conocimiento tribal no sistematizado

## Requerimientos Funcionales

### RF1. Agente IA Conversacional
**Prioridad**: P0 (Must Have) | **Complejidad**: Alta

**Descripción**: Agente de IA que entiende lenguaje natural y ejecuta consultas sobre la base de datos de SICOM.

**Funcionalidades**:
- Consultas en lenguaje natural: "Muéstrame el consumo de gasolina del último trimestre"
- Generación automática de gráficas bajo demanda
- Análisis comparativo: "Compara precios de concreto M42 entre 2024 y 2025"
- Cruces de información: "Gasolina por estación de servicio"
- Generación de reportes en formato Excel/PDF
- Proyecciones financieras con IA
- Aprendizaje del contexto del negocio (materiales, obras, proveedores)

**Casos de Uso**:
- CU1.1: Gerente pide "Gráfica de comportamiento de ventas último año"
- CU1.2: Jefe Compras pregunta "¿Qué órdenes de compra están abiertas más de 30 días?"
- CU1.3: Contador solicita "Proyección de gastos Q1 2025 basado en histórico"
- CU1.4: Técnico consulta "¿Qué concreto estoy usando en obra Vía 40 y con qué producto?"

**Criterios de Aceptación**:
- [ ] Entiende consultas en español natural (sin sintaxis especial)
- [ ] Genera gráficas en <10 segundos
- [ ] Exporta resultados a Excel/Google Sheets
- [ ] Aprende preferencias de usuario (entrenamiento)
- [ ] Maneja datos de SICOM sin modificar BD origen

### RF2. Dashboard Ejecutivo
**Prioridad**: P0 (Must Have) | **Complejidad**: Media

**Descripción**: Cuadro de mando con visualizaciones en tiempo real de KPIs críticos del negocio.

**Funcionalidades**:
- Vista por rol (Gerencia, Compras, Contabilidad, Técnica)
- KPIs configurables por usuario
- Actualización automática desde SICOM
- Gráficas interactivas (drill-down)
- Exportación a Excel/PDF
- Comparativos año actual vs anterior
- Filtros por: obra, centro de costo, proveedor, fecha

**KPIs Clave**:
- **Compras**: Órdenes abiertas, tiempo promedio de cierre, monto comprometido, proveedores activos
- **Financiero**: Gastos por obra, proyección vs presupuesto, flujo de caja proyectado
- **Operativo**: Consumo de materiales por obra, inventario actual, alertas de stock
- **Mantenimiento**: Equipos en mantenimiento, próximos mantenimientos, historial de fallas

**Criterios de Aceptación**:
- [ ] Dashboard se carga en <5 segundos
- [ ] Actualización automática cada hora desde SICOM
- [ ] Acceso por rol con permisos específicos
- [ ] Exportación funcional a Excel
- [ ] Responsive (desktop + tablet)

### RF3. Automatización de Seguimiento de Compras
**Prioridad**: P0 (Must Have) | **Complejidad**: Alta

**Descripción**: Sistema automático de seguimiento de ciclo completo de compras desde requisición hasta entrega.

**Funcionalidades**:
- Registro de requisiciones (integración con correo)
- Seguimiento automático de estados: Requisición → Cotización → Orden → Entrega → Facturación
- Alertas automáticas de compras vencidas
- Resumen diario por correo de pendientes
- Control de órdenes de compra abiertas vs confirmadas
- Validación automática factura vs orden de compra
- Detección de anomalías (precios fuera de rango)
- Indicadores: tiempo promedio por etapa, compras vencidas, monto pendiente

**Workflow**:
1. Requisición llega por correo → extracción automática de datos
2. Sistema valida y registra en SICOM (si es posible) o en BD externa
3. Seguimiento automático de estados
4. Alertas en hitos: orden sin confirmar 48h, entrega vencida, factura sin validar
5. Resumen diario a stakeholders

**Criterios de Aceptación**:
- [ ] Extrae datos de correos de requisiciones automáticamente
- [ ] Alertas enviadas por correo/WhatsApp
- [ ] Detecta órdenes abiertas >30 días
- [ ] Valida factura vs orden de compra (monto, productos, cantidades)
- [ ] Genera resumen diario automático

### RF4. Procesamiento Automático de Facturas (OCR)
**Prioridad**: P1 (Should Have) | **Complejidad**: Media

**Descripción**: Sistema de procesamiento automático de facturas mediante OCR e IA.

**Funcionalidades**:
- Lectura automática de facturas PDF/imagen
- Extracción de: número factura, fecha, proveedor, monto, productos, cantidades
- Validación contra orden de compra
- Detección de inconsistencias
- Registro automático en sistema
- Alertas de facturas con errores
- Integración con buzón de correo de facturas

**Workflow**:
1. Proveedor envía factura al correo facturas@contecsa.com
2. Sistema detecta nuevo correo
3. OCR extrae datos de PDF/imagen
4. IA valida contra orden de compra en SICOM
5. Si OK → registra automáticamente
6. Si ERROR → alerta a auxiliar con detalle del problema

**Criterios de Aceptación**:
- [ ] Precisión OCR >95% en facturas estándar
- [ ] Procesa facturas en <30 segundos
- [ ] Integración con Gmail/Outlook
- [ ] Detecta: sobrecobros, productos no solicitados, cantidades incorrectas
- [ ] Interfaz para revisar facturas con errores

### RF5. Sistema de Notificaciones Inteligentes
**Prioridad**: P1 (Should Have) | **Complejidad**: Baja

**Descripción**: Motor de notificaciones configurable por usuario y rol.

**Funcionalidades**:
- Notificaciones por: correo, WhatsApp (opcional)
- Configuración de alertas por usuario
- Resumen diario personalizado
- Escalamiento automático (no atendido en X días)
- Notificaciones de: compras vencidas, mantenimientos próximos, anomalías detectadas, aprobaciones pendientes

**Tipos de Alertas**:
- **Compras**: Orden sin confirmar 48h, entrega vencida, factura pendiente
- **Mantenimiento**: Mantenimiento preventivo próximo (7 días), equipo requiere revisión
- **Financiero**: Gasto por obra supera 80% presupuesto, proyección negativa
- **Operativo**: Stock bajo, material no entregado a tiempo

**Criterios de Aceptación**:
- [ ] Usuario configura sus alertas desde interfaz
- [ ] Resumen diario se envía a hora configurada
- [ ] Escalamiento funciona correctamente
- [ ] Integración con correo corporativo

### RF6. ETL y Transformación de Datos
**Prioridad**: P0 (Must Have) | **Complejidad**: Alta

**Descripción**: Pipeline de extracción, transformación y carga de datos desde SICOM a formato optimizado para IA.

**Funcionalidades**:
- Conexión a base de datos SICOM (solo lectura)
- Extracción incremental (solo cambios)
- Transformación a formato no estructurado (para IA)
- Limpieza y validación de datos
- Creación de tablas derivadas (agregaciones, cruces)
- Actualización programada (cada hora o tiempo real si es posible)
- Logs de transformaciones

**Datos a Extraer**:
- **Compras**: Órdenes, requisiciones, proveedores, productos, precios
- **Inventario**: Ingresos, salidas, stock, movimientos
- **Contabilidad**: Facturas, pagos, centros de costo
- **Operativo**: Obras, consumos por obra, equipos, mantenimientos

**Criterios de Aceptación**:
- [ ] Conexión segura a SICOM (solo lectura)
- [ ] Transformación completa en <10 minutos
- [ ] Datos listos para consultas de IA
- [ ] Sin impacto en performance de SICOM
- [ ] Logs de errores y auditabilidad

### RF7. Control de Calidad de Datos
**Prioridad**: P1 (Should Have) | **Complejidad**: Media

**Descripción**: Mecanismos de validación y control de cambios en datos críticos.

**Funcionalidades**:
- Validación de campos al ingreso
- Reglas de negocio configurables
- Historial de cambios (quién, cuándo, qué)
- Permisos por campo (quién puede editar qué)
- Alertas de cambios en datos cerrados
- "Cierre" de períodos con hash de integridad

**Criterios de Aceptación**:
- [ ] Historial de cambios completo
- [ ] Permisos granulares por campo
- [ ] Alertas de cambios no autorizados
- [ ] Interfaz de auditoría

### RF8. Gestión de Mantenimientos
**Prioridad**: P2 (Nice to Have) | **Complejidad**: Media

**Descripción**: Módulo de control de mantenimientos preventivos y correctivos de maquinaria.

**Funcionalidades**:
- Registro de equipos y maquinaria
- Programación de mantenimientos preventivos
- Alertas automáticas de vencimientos
- Control de repuestos utilizados
- Historial de mantenimientos
- Indicadores: tiempo promedio de reparación, costo por equipo, disponibilidad

**Criterios de Aceptación**:
- [ ] Alertas 7 días antes de mantenimiento
- [ ] Registro de repuestos vinculado a mantenimiento
- [ ] Dashboard de estado de flota

## Requerimientos No Funcionales

### RNF1. Seguridad y Privacidad
- Datos sensibles de Contecsa no pueden estar en cloud compartido
- Acceso por usuario con autenticación (Google Workspace SSO)
- Permisos granulares por rol
- Auditoría completa de accesos y cambios
- Conexión a SICOM solo lectura (no modificar datos)
- Encriptación de datos en tránsito y reposo

### RNF2. Performance
- Dashboard carga en <5 segundos
- Consultas de IA responden en <10 segundos
- OCR procesa factura en <30 segundos
- ETL completo en <10 minutos
- Sin impacto en performance de SICOM

### RNF3. Escalabilidad
- Soportar crecimiento de datos (SICOM tiene años de histórico)
- Soportar hasta 20 usuarios simultáneos
- Procesamiento de hasta 500 facturas/mes

### RNF4. Disponibilidad
- SLA 99.9% uptime
- Backup automático diario
- Recuperación ante desastres <2 horas

### RNF5. Usabilidad
- Interfaz en español
- Diseño responsive (desktop + tablet)
- Navegación intuitiva (sin capacitación extensiva)
- Ayuda contextual

### RNF6. Integraciones
- Google Workspace (Gmail, Sheets)
- SICOM (base de datos, solo lectura)
- WhatsApp Business API (opcional, notificaciones)

## Stack Tecnológico Sugerido

### Backend
- **Lenguaje**: Python 3.11+ (análisis de datos, IA)
- **Framework**: FastAPI (APIs REST)
- **IA/ML**: LangChain + OpenAI GPT-4 / Claude 3.5 Sonnet (agente conversacional)
- **ETL**: Pandas, SQLAlchemy (transformación de datos)
- **OCR**: Tesseract + OpenAI Vision API
- **BD Principal**: PostgreSQL (datos transformados)
- **Cache**: Redis (consultas frecuentes)

### Frontend
- **Framework**: Next.js 15 + React 19
- **UI**: Tailwind CSS 4 + shadcn/ui
- **Gráficas**: Recharts / Chart.js
- **Estado**: Zustand / React Query

### Infraestructura
- **Cloud**: AWS / Google Cloud (según preferencia cliente)
- **Hosting**: Vercel (frontend) + AWS EC2/Lambda (backend)
- **Base de Datos**: AWS RDS PostgreSQL / Google Cloud SQL
- **Storage**: AWS S3 / Google Cloud Storage (facturas, reportes)
- **Monitoreo**: Sentry + CloudWatch/Stackdriver

### Integraciones
- **SICOM**: Conexión directa a BD (ODBC/JDBC según motor de SICOM)
- **Email**: Gmail API (Google Workspace)
- **Sheets**: Google Sheets API
- **WhatsApp**: WhatsApp Business API (Twilio/MessageBird)

## Arquitectura de Solución

### Capa 1: Extracción de Datos (ETL)
```
SICOM (Base de Datos Legacy)
    ↓ [Solo Lectura, Conexión Segura]
ETL Service (Python + Pandas)
    ↓ [Limpieza, Validación, Transformación]
PostgreSQL (Datos Estructurados) + Vector DB (Datos para IA)
```

### Capa 2: Inteligencia (IA)
```
LangChain Agent
    ├─ Acceso a PostgreSQL (datos estructurados)
    ├─ Acceso a Vector DB (contexto de negocio)
    ├─ Herramientas: generación de SQL, Python, gráficas
    └─ Modelo: GPT-4 / Claude 3.5 Sonnet
```

### Capa 3: Automatización
```
Workflow Engine
    ├─ Monitoreo de correos (facturas, requisiciones)
    ├─ Procesamiento OCR
    ├─ Validaciones automáticas
    ├─ Generación de alertas
    └─ Notificaciones (Email, WhatsApp)
```

### Capa 4: Presentación
```
Next.js App
    ├─ Dashboard (cuadros de mando)
    ├─ Chat con Agente IA
    ├─ Gestión de Compras
    ├─ Validación de Facturas
    └─ Configuración de Alertas
```

## Casos de Uso Detallados

### CU1: Detección de Sobrecobro Automático
**Actor**: Sistema (automático)
**Precondición**: Factura recibida por correo

**Flujo**:
1. Proveedor envía factura a facturas@contecsa.com
2. Sistema detecta correo nuevo con adjunto PDF
3. OCR extrae: proveedor, producto (Concreto M42), cantidad, precio unitario
4. Sistema busca orden de compra asociada
5. Compara precio factura vs precio orden de compra
6. **Detecta discrepancia**: Factura $X vs Orden $Y (diferencia >5%)
7. Genera alerta URGENTE a Jefe de Compras
8. Email: "Posible sobrecobro detectado - Factura #123 - Diferencia: $Z"
9. Jefe revisa y rechaza factura

**Resultado**: Ahorro económico + tiempo de detección reducido de semanas a minutos

### CU2: Consulta Conversacional de Gerencia
**Actor**: Gerente General
**Precondición**: Usuario autenticado

**Flujo**:
1. Gerente abre interfaz de chat con IA
2. Escribe: "Muéstrame una comparativa de costos de concreto M42 entre 2024 y 2025"
3. Agente IA:
   - Interpreta la consulta
   - Genera SQL para extraer datos de PostgreSQL
   - Calcula estadísticas (promedio, desviación)
   - Genera gráfica de líneas (precio vs tiempo)
4. Responde: "En 2024 el promedio fue $X, en 2025 es $Y (+Z%). Aquí está la gráfica [IMAGE]"
5. Gerente hace follow-up: "¿Qué proveedor tiene el precio más bajo ahora?"
6. Agente responde: "Proveedor ABC con $X por m3"
7. Gerente: "Envíame esto a Excel"
8. Agente genera archivo Excel y lo envía por correo

**Resultado**: Información en 30 segundos vs 2 horas de trabajo manual

### CU3: Seguimiento Automático de Compra
**Actor**: Sistema (automático) + Auxiliar de Compras
**Precondición**: Requisición registrada

**Flujo**:
1. Jefe de Obra envía requisición por correo: "Necesito 50 ton de acero para obra Vía 40"
2. Sistema extrae datos del correo
3. Registra requisición en sistema con estado "PENDIENTE COTIZACIÓN"
4. Día 1: Alerta a Auxiliar Compras: "Requisición #456 pendiente de cotizar"
5. Auxiliar cotiza con proveedores
6. Día 3: Auxiliar crea orden de compra en SICOM
7. Sistema detecta nueva orden, actualiza estado a "ORDEN EMITIDA"
8. Día 5: Alerta a Auxiliar: "Orden #789 sin confirmar desde hace 48h"
9. Auxiliar confirma orden
10. Día 10: Alerta: "Entrega programada para hoy - Orden #789"
11. Producto llega, se registra ingreso a almacén
12. Sistema actualiza estado a "ENTREGADO"
13. Día 12: Llega factura por correo
14. OCR valida factura vs orden de compra → OK
15. Sistema cierra compra automáticamente

**Resultado**: Trazabilidad completa + 0 compras olvidadas + reducción 50% tiempo de ciclo

### CU4: Resumen Diario Ejecutivo
**Actor**: Sistema (automático)
**Precondición**: Programación de resumen diario 7:00 AM

**Flujo**:
1. Sistema ejecuta queries programados a las 7:00 AM
2. Genera resumen personalizado por usuario:

**Para Gerente**:
- Órdenes de compra abiertas: 12 (monto total: $X)
- Compras vencidas: 3 (URGENTE)
- Proyección de gastos semana: $Y
- Alertas: Obra Vía 40 supera 85% de presupuesto

**Para Jefe de Compras**:
- Requisiciones pendientes: 5
- Órdenes sin confirmar >48h: 2
- Facturas pendientes de validar: 8
- Proveedores con retraso: Proveedor XYZ (3 entregas atrasadas)

3. Envía correo a cada usuario
4. Si hay alertas URGENTES, también envía WhatsApp

**Resultado**: Visibilidad diaria sin esfuerzo + priorización automática

## Métricas de Éxito

### Operativas
- ✅ Reducción 70% en tiempo de generación de reportes (de 2h a 20min)
- ✅ Reducción 90% en ingreso manual de facturas
- ✅ 100% de compras con seguimiento automatizado
- ✅ Reducción 50% en tiempo de ciclo de compras (de 15 días a 7 días)

### Financieras
- ✅ Detección automática de sobrecobros (0 sobrecobros no detectados)
- ✅ Ahorro estimado 5-10% en costos de compras por mejores controles
- ✅ Reducción 30% en costos operativos de área de compras

### Calidad
- ✅ Precisión >95% en OCR de facturas
- ✅ Reducción 80% en errores de digitación
- ✅ 100% de datos críticos con historial de cambios

### Adopción
- ✅ 80% de usuarios activos diarios (semana 4 post-lanzamiento)
- ✅ NPS >70 (satisfacción de usuarios)
- ✅ <2 horas capacitación por usuario

## Fases de Implementación

### Fase 1: MVP - Consultas y Dashboard (4-6 semanas)
**Objetivo**: Valor inmediato con consultas IA y visibilidad de compras

**Entregables**:
- Conexión a SICOM (solo lectura)
- ETL básico (compras, facturas, inventario)
- Agente IA conversacional (consultas básicas)
- Dashboard ejecutivo (KPIs de compras)
- Autenticación con Google Workspace

**Criterio de Éxito**: Gerente y Jefe de Compras usan sistema diariamente para consultas

### Fase 2: Automatización de Compras (4 semanas)
**Objetivo**: Eliminar seguimiento manual de compras

**Entregables**:
- Workflow de seguimiento de compras
- Alertas automáticas (correo)
- Resumen diario
- Integración con correo corporativo
- Detección de compras vencidas

**Criterio de Éxito**: 0 compras abiertas sin seguimiento

### Fase 3: OCR y Validación de Facturas (4 semanas)
**Objetivo**: Eliminar ingreso manual de facturas

**Entregables**:
- OCR de facturas
- Validación automática vs órdenes de compra
- Integración con buzón de facturas
- Detección de anomalías (precios)
- Interfaz de revisión de errores

**Criterio de Éxito**: 90% de facturas procesadas automáticamente

### Fase 4: Features Avanzados (4 semanas)
**Objetivo**: Optimización y features adicionales

**Entregables**:
- Proyecciones financieras con IA
- Gestión de mantenimientos
- Notificaciones WhatsApp
- Reportes avanzados
- Optimizaciones de performance

**Criterio de Éxito**: Sistema 100% adoptado en todas las áreas

## Riesgos y Mitigaciones

### R1: Acceso a SICOM Técnicamente Complejo
**Probabilidad**: Alta | **Impacto**: Alto
**Mitigación**:
- Realizar prueba de concepto de conexión a SICOM en primera semana
- Tener plan B: exportación automática desde SICOM si conexión directa no es viable
- Involucrar a Luis Barraza (desarrollador actual) en fase de análisis técnico

### R2: Resistencia al Cambio de Usuarios
**Probabilidad**: Media | **Impacto**: Alto
**Mitigación**:
- Involucrar usuarios clave desde diseño
- Capacitación personalizada por rol
- Demostrar valor rápido (quick wins en Fase 1)
- No forzar cambio de procesos actuales inicialmente (convivencia)

### R3: Calidad de Datos en SICOM
**Probabilidad**: Alta | **Impacto**: Medio
**Mitigación**:
- ETL robusto con limpieza de datos
- Alertas de datos inconsistentes
- No bloquear sistema por datos malos (continuar con advertencias)
- Generar reportes de calidad de datos para corrección progresiva

### R4: Dependencia de APIs de IA (OpenAI, Claude)
**Probabilidad**: Baja | **Impacto**: Alto
**Mitigación**:
- Diseño con abstracción (cambiar proveedor fácilmente)
- Considerar modelos locales (Llama) como backup
- Caché agresivo de respuestas frecuentes

### R5: Escalabilidad de Costos de IA
**Probabilidad**: Media | **Impacto**: Medio
**Mitigación**:
- Implementar caché de consultas
- Límites de uso por usuario
- Optimización de prompts para reducir tokens
- Considerar modelo híbrido (IA solo para consultas complejas)

## Supuestos

1. ✅ SICOM tiene base de datos SQL accesible (o exportable)
2. ✅ Contecsa tiene cuenta de Google Workspace
3. ✅ Existe conectividad estable a internet en oficinas
4. ✅ Personal clave disponible para levantamiento de información (2-3 semanas)
5. ✅ Presupuesto aprobado para cloud + APIs de IA
6. ✅ No hay restricciones legales para usar IA en análisis de datos

## Dependencias

1. ⚠️ Acceso a base de datos de SICOM (credenciales, documentación)
2. ⚠️ Acceso a cuenta de Google Workspace (configuración SSO)
3. ⚠️ Definición de usuarios piloto para pruebas
4. ⚠️ Muestras de facturas reales (para entrenar OCR)
5. ⚠️ Disponibilidad de Luis Barraza (desarrollador actual) para consultas técnicas

## Modelo de Negocio Sugerido

**Opción 1: Venta de Software (preferencia cliente)**
- Licencia perpetua por módulo
- Instalación en infraestructura de cliente (cloud privado)
- Soporte anual opcional (% del valor de licencia)

**Opción 2: Venta + Soporte Recurrente**
- Licencia inicial
- Soporte mensual: mantenimiento, actualizaciones, capacitación
- SLA definido

**Opción 3: Hybrid (Recomendado)**
- Venta de software base (agente IA + dashboard)
- Módulos adicionales (OCR, mantenimientos) como add-ons
- Soporte mensual con horas incluidas
- Costos de cloud + APIs de IA como pass-through

## Próximos Pasos

1. ✅ **Validación del PRD** con Gerente de Contecsa
2. ⏳ **Sesión técnica** con Luis Barraza para entender SICOM en detalle
3. ⏳ **Prueba de concepto** de conexión a SICOM (1 semana)
4. ⏳ **Propuesta comercial** con base en este PRD
5. ⏳ **Kickoff de Fase 1** (si aprobado)

---

**Documento elaborado por**: Neero SAS
**Basado en**: Reunión con Gerente Contecsa (2025-12-22)
**Próxima revisión**: Post-validación con cliente
