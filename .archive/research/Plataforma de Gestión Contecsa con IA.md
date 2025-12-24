# **Transformación Digital Estratégica para Contecsa: Arquitectura de Plataforma E2E, Inteligencia Artificial y Gobierno de Datos (Visión 2025\)**

## **1\. Diagnóstico Estratégico y la Oportunidad del "Greenfield" Tecnológico**

### **1.1. El Dilema de la Construcción en Colombia: Informalidad vs. Regulación**

El sector de la construcción en Colombia atraviesa una encrucijada crítica en 2025\. Por un lado, la operación en campo sigue caracterizada por una profunda informalidad operativa, dependencia de la "memoria" de los residentes de obra, y una gestión documental basada en papel físico, correos electrónicos dispersos y hojas de cálculo desconectadas (Excel). Por otro lado, la presión regulatoria impuesta por la Dirección de Impuestos y Aduanas Nacionales (DIAN) ha transformado el entorno fiscal en uno de los más digitalizados de la región, exigiendo validaciones en tiempo real para la deducibilidad de costos.1

Para Contecsa, una constructora sin un sistema ERP heredado (Legacy), esta situación paradójica representa una ventaja competitiva latente. A diferencia de sus competidores, que luchan por modernizar monolitos rígidos (como SAP S/4HANA u Oracle) implementados hace décadas, Contecsa tiene la oportunidad de adoptar una arquitectura "Composable" (componible) desde cero. Esto implica construir una solución modular, centrada en datos y potenciada por Inteligencia Artificial (IA) moderna, evitando la deuda técnica y los costos de licenciamiento prohibitivos de los sistemas tradicionales.

La ausencia de un ERP no debe verse como una carencia, sino como un lienzo en blanco para implementar una estrategia "AI-First". En lugar de digitalizar procesos ineficientes (como escanear una factura para que un humano la transcriba), la nueva plataforma puede rediseñar el flujo de trabajo para que la IA actúe como el primer nivel de validación y conciliación, dejando a los humanos la toma de decisiones estratégicas y el manejo de excepciones complejas.

### **1.2. Análisis de Riesgos Operativos Actuales**

La gestión actual basada en Excel y correo electrónico expone a Contecsa a riesgos financieros y legales significativos que la nueva plataforma debe mitigar:

1. **Pérdida de Escudos Fiscales (Deducibilidad):** La normativa colombiana actual (Resolución 000085 de 2022 y posteriores) establece que para que una factura electrónica de venta a crédito sea deducible en el impuesto de renta, el adquiriente (Contecsa) debe generar eventos electrónicos en la plataforma RADIAN (Acuse de Recibo y Recibo del Bien).3 La gestión manual hace casi imposible cumplir con estos eventos en los tiempos requeridos, resultando en un aumento efectivo de la tasa de tributación del 35% sobre los costos no legalizados.  
2. **Fugas en la Cadena de Suministro (3-Way Match Fallido):** Sin una conciliación sistemática entre la Orden de Compra (OC), la Entrada de Almacén (Remisión) y la Factura del Proveedor, es común el pago de materiales no entregados, entregas parciales facturadas como totales, o sobrecostos en precios unitarios no detectados.5  
3. **Opacidad en Costos de Proyecto:** La falta de integración en tiempo real impide saber si un proyecto está consumiendo más recursos de lo presupuestado (APU) hasta que es demasiado tarde para corregir, afectando la rentabilidad neta de los consorcios y uniones temporales.7

### **1.3. Visión de la Solución: Contecsa Core 2025**

La propuesta es desarrollar "Contecsa Core", una plataforma interna de gestión de recursos que no busca ser un ERP genérico, sino un sistema operativo especializado en la realidad de la obra civil colombiana.

**Pilares de la Estrategia:**

* **Arquitectura Desacoplada:** Backend robusto en la nube (Supabase) separado de un Frontend ágil (React), permitiendo actualizaciones independientes.  
* **Inteligencia Artificial Agéntica:** Uso de modelos LLM (Large Language Models) y VLM (Vision Language Models) para la lectura, interpretación y validación semántica de documentos complejos (remisiones manuscritas, contratos, pólizas).  
* **Interfaz "Excel-Killer":** Reconocimiento de que Excel es la herramienta preferida del usuario. La interfaz web replicará las funcionalidades de Excel (copiar, pegar, filtrar) para reducir la fricción de adopción, pero con gobierno de datos centralizado.

## ---

**2\. Marco Regulatorio y Fiscal como Eje Arquitectónico**

El diseño de software para una empresa colombiana en 2025 no puede ignorar la normativa tributaria; debe embeberla en su código. La plataforma actuará como un "Middleware Fiscal" que garantiza el cumplimiento normativo de forma transparente para el usuario operativo.

### **2.1. El Ecosistema de Facturación Electrónica y RADIAN**

La plataforma debe integrarse nativamente con los servicios de la DIAN para gestionar el ciclo de vida de los documentos tributarios. No se trata solo de recibir un PDF; el sistema debe procesar el XML estándar UBL 2.1 y validar su autenticidad criptográfica.8

#### **2.1.1. Validación Previa y Recepción**

Según el Anexo Técnico 1.9 (y sus evoluciones a 2025), cada factura recibida debe ser validada contra la DIAN. La plataforma de Contecsa implementará un "Gatekeeper" automático:

* **Mecanismo:** Al recibir un correo en facturacion@contecsa.com o una carga manual, el sistema extrae el AttachedDocument (XML).  
* **Validación:** Consulta vía API (o mediante proveedor tecnológico) el estado de la factura en la DIAN. Si la factura no existe o tiene notas crédito asociadas que la anulan, el sistema la rechaza automáticamente antes de iniciar cualquier flujo de aprobación interno.1

#### **2.1.2. Gestión de Eventos RADIAN (Título Valor)**

Para las compras a crédito (la mayoría en construcción), Contecsa debe emitir eventos XML firmados digitalmente para convertir la factura en título valor. Este proceso, conocido como RADIAN, es obligatorio para la deducibilidad del gasto.9

| Evento RADIAN | Trigger en Plataforma Contecsa | Implicación Legal |
| :---- | :---- | :---- |
| **030\. Acuse de Recibo** | Automático al pasar validación de sintaxis XML y NIT. | Confirma recepción del documento, no de la mercancía. Detiene el reloj de aceptación tácita. |
| **032\. Recibo del Bien/Servicio** | Disparado por el **Módulo de Almacén** cuando el residente/almacenista confirma la entrada física en la Bitácora Digital. | **Punto de No Retorno.** A partir de aquí, Contecsa certifica que recibió el material a satisfacción. Es el requisito clave para el costo fiscal. |
| **033\. Aceptación Expresa** | Disparado por Tesorería al programar el pago. | Convierte la factura en título ejecutivo complejo, habilitando su negociación (Factoring) por parte del proveedor. |

**Insight Arquitectónico:** La plataforma debe manejar una "Máquina de Estados" (State Machine) rigurosa para cada factura. No se puede permitir pasar al estado "Pagado" si no se ha generado el evento "032. Recibo del Bien" en la DIAN. Esta restricción debe estar a nivel de base de datos para evitar errores humanos.3

### **2.2. Documento Soporte en Adquisiciones a No Obligados**

La construcción depende de mano de obra local y proveedores menores (régimen simple o personas naturales) que no emiten factura electrónica. Para descontar estos costos, Contecsa debe actuar como emisor del "Documento Soporte Electrónico".9

**Flujo en la Plataforma:**

1. El residente carga la "Cuenta de Cobro" o "Recibo de Caja" del contratista en la app móvil.  
2. El sistema detecta que el proveedor no es facturador electrónico (cruce contra base de datos RUT).  
3. La plataforma genera automáticamente el XML del Documento Soporte (DS), lo firma con el certificado digital de Contecsa y lo transmite a la DIAN para su validación.11  
4. Solo tras la validación exitosa ("ApplicationResponse" de la DIAN), se autoriza el desembolso de la caja menor o transferencia.

### **2.3. Gobierno de Datos en Consorcios y Uniones Temporales**

Contecsa frecuentemente operará bajo figuras asociativas (Consorcios). Legalmente, aunque el consorcio tiene su propio NIT, la responsabilidad fiscal puede recaer en los consorciados o en el consorcio según si es contribuyente o no.

* **Requerimiento de Datos:** El sistema debe soportar una arquitectura "Multi-Tenant" a nivel de Organización. Un mismo usuario (Ingeniero Director) debe poder ver múltiples proyectos, cada uno asociado a un NIT y razón social distinta (Contecsa S.A.S., Consorcio Vías 2025, Unión Temporal Puentes del Norte).7  
* **Seguridad:** Los datos de costos y proveedores de un consorcio no deben ser accesibles para auditores de otro consorcio diferente. Esto requiere políticas de seguridad a nivel de fila (Row Level Security \- RLS) estrictas.13

## ---

**3\. Arquitectura de Solución: El Núcleo Tecnológico Moderno**

Para soportar los requerimientos de flexibilidad y control, se propone una arquitectura basada en servicios, centrada en una base de datos potente y orquestada por flujos de trabajo inteligentes.

### **3.1. Diagrama Conceptual de la Arquitectura**

La solución se estructura en cuatro capas horizontales y dos verticales transversales.

| Capa | Componente Tecnológico | Función Principal | Justificación "Deep Tech" 2025 |
| :---- | :---- | :---- | :---- |
| **1\. Experiencia (Frontend)** | **React.js \+ AG Grid Enterprise** | Interfaz de Usuario Web/Móvil | React ofrece la reactividad necesaria para aplicaciones complejas. AG Grid es el estándar industrial para manejo de grandes volúmenes de datos tabulares con performance nativo, permitiendo virtualización de filas y edición tipo Excel.14 |
| **2\. API & Lógica (Middleware)** | **Python (FastAPI) \+ Instructor** | Orquestación y Reglas de Negocio | Python es el lenguaje nativo de la IA. FastAPI ofrece alto rendimiento asíncrono. La librería instructor garantiza que las salidas de los LLMs sean estructuras de datos válidas (Pydantic), puenteando la brecha entre texto generativo y datos estructurados.16 |
| **3\. Datos & Identidad (Backend)** | **Supabase (PostgreSQL)** | Persistencia y Auth | Supabase entrega un PostgreSQL "supervitaminado" con autenticación, APIs automáticas y, crucialmente, Row Level Security (RLS) para el gobierno de datos multi-tenant.18 |
| **4\. Infraestructura Cognitiva** | **Azure Document Intelligence \+ OpenAI GPT-4o** | Extracción y Razonamiento | Enfoque híbrido: Azure para la estructura visual (tablas de remisiones) y GPT-4o para el razonamiento semántico y validación de reglas complejas.20 |
| **Transversal A** | **n8n / LangChain** | Integración y Workflows | Automatización "Low-Code" para conectar con APIs bancarias, correos electrónicos y sistemas legados si existieran. |
| **Transversal B** | **Power BI / Metabase** | Analítica y Reportes | Conexión directa a réplicas de lectura de PostgreSQL para dashboards gerenciales sin afectar el rendimiento transaccional. |

### **3.2. Estrategia de Base de Datos: Supabase y RLS**

La elección de Supabase (una alternativa Open Source a Firebase basada en PostgreSQL) es estratégica para una empresa como Contecsa que busca agilidad sin sacrificar robustez empresarial.

#### **3.2.1. Modelo de Datos Multi-Proyecto**

El esquema de base de datos debe diseñarse para aislar lógicamente los datos.

* **Tabla organizations:** Representa las entidades legales (Contecsa, Consorcios).  
* **Tabla projects:** Obras específicas vinculadas a una organización.  
* **Tabla documents:** Tabla polimórfica o particionada para almacenar facturas, remisiones, OCs, etc.

#### **3.2.2. Row Level Security (RLS) como Firewall de Datos**

En lugar de confiar en que el desarrollador frontend filtre los datos (WHERE project\_id \= X), se implementan políticas de seguridad directamente en el motor de base de datos.

* **Política Ejemplo:** "Un usuario con rol 'Residente' solo puede ver filas en la tabla invoices donde el project\_id coincida con su asignación en la tabla user\_projects".  
* **Impacto:** Si un hacker logra autenticarse o un bug en la UI expone una consulta abierta, el motor de base de datos retornará cero filas si el usuario no tiene permiso explícito sobre esos datos.18 Esto es vital para manejar información sensible de costos en licitaciones públicas.

### **3.3. Integración de Servicios de IA (Pipeline de Extracción)**

La arquitectura de IA no es una "caja negra", sino un pipeline auditable.

1. **Ingesta:** Los documentos (PDF, JPG, XML) llegan a un Bucket S3 (Supabase Storage).  
2. **Pre-procesamiento:** Un webhook dispara una función Python.  
3. **Extracción Híbrida:**  
   * Si es XML (Factura Electrónica): Se usa un parser estándar (biblioteca lxml o xmltodict) para extraer datos 100% precisos.  
   * Si es PDF/Imagen (Remisión, Cuenta de Cobro): Se envía a **Azure Document Intelligence**. Los benchmarks de 2024/2025 muestran que Azure supera a Google y AWS en la extracción de tablas anidadas y documentos densos típicos de construcción.20  
4. **Validación Semántica (Guardrails):** La salida cruda de Azure se pasa a un modelo GPT-4o encapsulado con **Guardrails AI**. Este paso verifica la lógica: "¿La fecha de vencimiento es posterior a la fecha de emisión?", "¿El subtotal \+ IVA coincide con el total?". Si hay incoherencias, se marca para revisión humana.23

## ---

**4\. Módulos Funcionales: Detalle de Implementación**

La plataforma "Contecsa Core" se compone de cuatro módulos integrados que cubren el ciclo de vida del gasto.

### **4.1. Módulo 1: Control de Compras Inteligente (Smart Procurement)**

El objetivo es transformar la "compra reactiva" (urgencias de obra) en "compra planificada".

#### **4.1.1. Requisiciones Conectadas al Presupuesto (APU)**

* **Problemática:** Los ingenieros piden "Sika" (marca) en lugar de "Impermeabilizante" (especificación), y a menudo piden más de lo presupuestado.  
* **Solución:** El módulo de requisiciones carga el presupuesto oficial del proyecto (importado desde Excel).  
  * El ingeniero selecciona ítems del presupuesto disponible (saldo vivo).  
  * Si el ingeniero intenta pedir 1,000 ladrillos pero el saldo presupuestal es 500, el sistema bloquea la requisición o exige un flujo de aprobación de "Control de Cambios" o "Mayor Cantidad de Obra".25  
* **Normalización con IA:** Un modelo de *embeddings* sugiere materiales estandarizados. Si el usuario escribe "cemento gris", el sistema lo vincula al código interno "MAT-CEM-001 \- Cemento Portland Tipo 1", facilitando la agrupación de compras entre proyectos.26

#### **4.1.2. Gestión de Órdenes de Compra (PO)**

* Generación automática de PDFs de órdenes de compra con firma digital.  
* Envío automático al proveedor vía correo electrónico con un "Magic Link" para que el proveedor cargue posteriormente su factura y remisión, trasladando la carga operativa de digitación al proveedor (Portal de Proveedores Ligero).28

### **4.2. Módulo 2: Logística y Almacén (La Verdad del Terreno)**

La entrada de almacén es el punto crítico de control. Si entra basura, se paga basura.

#### **4.2.1. Bitácora Digital y Recepción Móvil**

* **App PWA (Progressive Web App):** Diseñada para tablets y celulares, con capacidad *offline-first* para sótanos o zonas rurales sin señal.  
* **Captura de Remisiones:** El almacenista toma una foto de la remisión física entregada por el conductor.  
* **IA en el Borde:** La imagen se procesa para identificar:  
  * Número de Remisión.  
  * Ítems entregados.  
  * Cantidades.  
* **Cruce contra OC:** La app muestra la Orden de Compra abierta y sugiere el cruce. "¿Recibiste los 50 bultos de la OC \#1234?".  
* **Conversión de Unidades:** Implementación de una librería de conversión (ej. pint en Python) para manejar la discrepancia típica: se compró en "Toneladas" pero la remisión llega en "Viajes" o "Metros Cúbicos". El sistema solicita el factor de conversión si no está definido (ej. densidad del concreto).6

### **4.3. Módulo 3: Motor de Facturación y Validación (3-Way Matching con IA)**

Este módulo automatiza la conciliación contable, reduciendo el trabajo manual en un 80%.5

#### **4.3.1. Flujo de Trabajo Agéntico (Agentic Workflow)**

Se propone un sistema de agentes autónomos coordinados:

1. **Agente Auditor (The Matcher):**  
   * Lee la Factura (XML/PDF).  
   * Busca la(s) Orden(es) de Compra referenciadas.  
   * Busca las Entradas de Almacén (Remisiones) vinculadas a esas OCs.  
   * Ejecuta la lógica de **3-Way Match**:  
     * ¿Precio Factura \== Precio OC?  
     * ¿Cantidad Factura \<= Cantidad Recibida (Remisiones)?  
     * ¿Calidad/Aceptación marcada en Almacén \== OK?  
2. **Manejo de Excepciones:**  
   * Si hay coincidencia perfecta ("Perfect Match"), la factura pasa a estado "Lista para Pago" y se disparan los eventos RADIAN 030 y 032 automáticamente.  
   * Si hay discrepancia (ej. cobro de más, o material no recibido), el Agente genera una "Disputa". Envía una alerta al Comprador y al Almacenista vía Teams/Slack/Correo con el detalle: *"Factura F-999 cobra 10 unidades, pero Almacén solo reporta 8 entradas válidas. Diferencia: $200.000 COP"*.

#### **4.3.2. Integración RADIAN Bidireccional**

La plataforma no solo emite eventos, sino que escucha. Si un proveedor emite una Nota Crédito en la DIAN, el sistema debe detectarlo y ajustar el saldo por pagar automáticamente, evitando que Tesorería pague una factura que ya fue anulada o descontada.3

### **4.4. Módulo 4: Tesorería y Reportes (Business Intelligence)**

* **Programación de Pagos:** Un tablero Kanban que muestra las facturas vencidas y por vencer, permitiendo al Tesorero arrastrar y soltar para armar el "Lote de Pago Semanal".  
* **Generación de Archivos Bancarios:** Exportación de archivos planos en formatos estándar (PAB de Bancolombia, Cash Management de Davivienda) para carga masiva en portales bancarios, eliminando la digitación manual de cuentas y valores.  
* **Analítica de Costos:** Dashboards en Power BI embebidos en la aplicación.  
  * *Curva S de Costos:* Planificado vs. Ejecutado acumulado.  
  * *Inflación de Materiales:* Variación del precio unitario del acero/concreto en el tiempo vs. índices DANE (ICCV).30

## ---

**5\. Estrategia de IA y Prevención de Alucinaciones**

La implementación de IA en procesos financieros requiere "Cero Tolerancia" a la invención de datos.

### **5.1. Validación Determinística con Instructor**

Para mitigar el riesgo de que un LLM "invente" un número de factura o un valor, se utiliza la librería instructor en Python. Esta herramienta permite definir esquemas de datos estrictos usando Pydantic.

Python

\# Ejemplo conceptual de esquema Pydantic para validación  
class LineItem(BaseModel):  
    description: str  
    quantity: float  
    unit\_price: float  
    total: float \= Field(..., description="Must be quantity \* unit\_price")

    @field\_validator('total')  
    def check\_math(cls, v, values):  
        \# Validación matemática determinística  
        if abs(v \- (values\['quantity'\] \* values\['unit\_price'\])) \> 0.01:  
            raise ValueError("Math mismatch in invoice line")  
        return v

Si el modelo de IA genera una línea donde la matemática no cuadra, el validador check\_math lanza un error, y el sistema puede reintentar la consulta al LLM ("Tu cálculo fue incorrecto, corrígelo") o marcar el documento para revisión humana. Esto combina la flexibilidad del LLM con la rigurosidad del código tradicional.16

### **5.2. Comparativa de Modelos de Extracción**

| Característica | Azure Document Intelligence | Google Document AI | GPT-4o Vision (Directo) | Recomendación para Contecsa |
| :---- | :---- | :---- | :---- | :---- |
| **Extracción de Tablas** | Excelente (Mantiene estructura de filas/cols) | Bueno, pero a veces mezcla celdas | Variable (pierde alineación en tablas largas) | **Azure** para Remisiones complejas. |
| **Razonamiento** | Nulo (Solo OCR estructural) | Limitado | Excelente (Entiende contexto) | **GPT-4o** para validación semántica. |
| **Costo** | Medio (\~$10/1k págs) | Alto | Alto (por tokens) | **Híbrido**: Azure primero, GPT solo para razonar. |
| **Privacidad** | Enterprise Compliance | Enterprise Compliance | Configurable (Zero retention) | Azure \+ OpenAI (vía Azure) para seguridad empresarial.20 |

## ---

**6\. Plan de Adopción y Gestión del Cambio (Excel a Web)**

El éxito técnico no garantiza el éxito operativo. La resistencia al cambio en el sector construcción es alta.

### **6.1. La Estrategia "Caballo de Troya" (UX/UI)**

No intente reemplazar a Excel, absórbalo.

* **AG Grid:** La grilla principal de la aplicación debe comportarse como Excel. Debe permitir copiar un rango de celdas de un Excel local y pegarlo directamente en la web (Ctrl+C, Ctrl+V). Debe permitir arrastrar fórmulas simples y filtros por columna. Esto reduce el choque cultural.14  
* **Import Wizards:** Implementar asistentes de importación robustos (usando librerías como react-spreadsheet-import) que permitan a los usuarios cargar sus presupuestos y listados de proveedores en formatos desordenados, ayudándoles a mapear las columnas interactivamente ("¿La columna 'Vr. Unit' es 'Precio Unitario'?").35

### **6.2. Modelo ADKAR para Construcción**

Aplicación del modelo de gestión del cambio ADKAR 37:

1. **Awareness (Conciencia):** Comunicar claramente que la no adopción implica multas de la DIAN y pérdida de dinero (argumento de miedo/urgencia).  
2. **Desire (Deseo):** Mostrar a los residentes que la app les ahorra el trabajo del sábado por la tarde (llenar reportes). "Captura en tiempo real, descansa el fin de semana".  
3. **Knowledge (Conocimiento):** Capacitaciones cortas y prácticas en obra (micro-learning en video enviados por WhatsApp).  
4. **Ability (Habilidad):** Acompañamiento en sitio durante las primeras 2 semanas de uso de la app móvil.  
5. **Reinforcement (Refuerzo):** Bonificaciones o reconocimientos a las obras con mejor indicador de uso de la plataforma (Gamificación).

## ---

**7\. Roadmap de Implementación (12 Meses)**

Una implementación escalonada mitiga riesgos.

### **Fase 1: Cimientos y Cumplimiento (Mes 1-3)**

* **Objetivo:** Centralizar la recepción de facturas y asegurar cumplimiento DIAN/RADIAN.  
* **Tecnología:** Despliegue de Supabase, Integración API DIAN, Buzón de correo inteligente.  
* **Funcionalidad:** Recepción de XMLs, validación básica, generación manual de eventos RADIAN desde la plataforma.  
* **Quick Win:** Repositorio centralizado de facturas (adiós a buscar en correos de Outlook).

### **Fase 2: Compras y Almacén Digital (Mes 4-7)**

* **Objetivo:** Digitalizar la entrada de datos en obra.  
* **Tecnología:** App Móvil (PWA) para Almacén, Módulo de Requisiciones, Azure Doc Intelligence para remisiones.  
* **Funcionalidad:** Bitácora digital, carga de fotos de remisiones, creación de OCs simples.  
* **Reto:** Despliegue de tablets y conectividad en obras.

### **Fase 3: Automatización Inteligente (Mes 8-10)**

* **Objetivo:** Activar el 3-Way Match y reducir carga operativa.  
* **Tecnología:** Agentes de IA, Instructor, Algoritmos de conciliación.  
* **Funcionalidad:** Cruce automático OC-Remisión-Factura. Disparo automático de eventos RADIAN tras conciliación exitosa.

### **Fase 4: Inteligencia y Optimización (Mes 11-12)**

* **Objetivo:** Explotación de datos para toma de decisiones.  
* **Tecnología:** Power BI / Metabase, Dashboards avanzados.  
* **Funcionalidad:** Reportes de variación de precios, evaluación de proveedores, proyección de flujo de caja.

## ---

**8\. Análisis Financiero y Retorno de Inversión (ROI)**

### **8.1. Estimación de Costos (TCO)**

Desarrollar internamente tiene un perfil de costos diferente a comprar SAP.

* **Infraestructura (OpEx Mensual):**  
  * Supabase (Plan Pro \+ Compute Add-ons): \~$50 \- $100 USD.  
  * Azure Document Intelligence: \~$20 USD (estimado 2,000 páginas/mes).  
  * OpenAI API: \~$50 USD (dependiendo del volumen de facturas).  
  * Hosting Frontend (Vercel): \~$20 USD.  
  * **Total Nube:** \< $300 USD/mes (extremadamente bajo comparado con licencias por usuario).  
* **Desarrollo (CapEx):** Equipo interno o agencia de desarrollo (4-6 meses de desarrollo intensivo).

### **8.2. Fuentes de Retorno (ROI)**

1. **Ahorro Fiscal (Directo):** Recuperación del 35% del valor de costos que antes se perdían por no hacer eventos RADIAN a tiempo. En una constructora que factura miles de millones, esto paga el sistema en meses.  
2. **Reducción de Pagos Indebidos:** Se estima que el 3-way matching automatizado evita entre el 1% y 3% del gasto total en sobrepagos o duplicados.5  
3. **Eficiencia de Staff:** Reducción del 70% en el tiempo dedicado a digitación de facturas y conciliación manual, permitiendo que el equipo contable se enfoque en análisis y auditoría.5

## ---

**9\. Conclusión y Recomendación Final**

Para Contecsa, la construcción de una plataforma propia no es un lujo, sino una necesidad estratégica para sobrevivir y escalar en el mercado colombiano de 2025\. La combinación de **Supabase** como base de datos segura y escalable, **Python/IA** para la inteligencia de procesos, y una **UX tipo Excel** para la adopción, crea una solución robusta, económica y adaptada a la realidad local.

Se recomienda proceder inmediatamente con la **Fase 1**, enfocándose en la integración con la DIAN y RADIAN. Esto generará un retorno de inversión inmediato al asegurar la deducibilidad de los costos, financiando así las fases subsiguientes del proyecto. La clave del éxito no estará solo en el código, sino en liderar el cambio cultural: transformar al ingeniero residente de un "llenador de papeles" a un "gestor digital de recursos".

#### **Works cited**

1. Validación Previa \- DIAN, accessed December 22, 2025, [https://www.dian.gov.co/impuestos/factura-electronica/factura-electronica/Paginas/validacion-previa.aspx](https://www.dian.gov.co/impuestos/factura-electronica/factura-electronica/Paginas/validacion-previa.aspx)  
2. Cambios en facturación electrónica: novedades que los contribuyentes deben conocer, accessed December 22, 2025, [https://actualicese.com/conferencia-cambios-en-facturacion-electronica-novedades-que-los-contribuyentes-deben-conocer/](https://actualicese.com/conferencia-cambios-en-facturacion-electronica-novedades-que-los-contribuyentes-deben-conocer/)  
3. Como-asociar-los-eventos-acuse-de-recibo-Factura-Electronica.pdf \- DIAN, accessed December 22, 2025, [https://www.dian.gov.co/impuestos/factura-electronica/Documents/Como-asociar-los-eventos-acuse-de-recibo-Factura-Electronica.pdf](https://www.dian.gov.co/impuestos/factura-electronica/Documents/Como-asociar-los-eventos-acuse-de-recibo-Factura-Electronica.pdf)  
4. sistema de factura \- DIAN, accessed December 22, 2025, [https://www.dian.gov.co/impuestos/factura-electronica/Documents/Como-asociar-los-eventos-acuse-de-recibo-de-la-FE.pdf](https://www.dian.gov.co/impuestos/factura-electronica/Documents/Como-asociar-los-eventos-acuse-de-recibo-de-la-FE.pdf)  
5. Invoice Processing Automation: 2025 ROI Formula Guide \- Artsyl, accessed December 22, 2025, [https://www.artsyltech.com/blog/invoice-processing-automation-guide](https://www.artsyltech.com/blog/invoice-processing-automation-guide)  
6. 3-Way Matching Automation with AI Agents \- Digital ClerX, accessed December 22, 2025, [https://digitalclerx.ai/blog/3-way-matching-automation-with-ai-agents/](https://digitalclerx.ai/blog/3-way-matching-automation-with-ai-agents/)  
7. Consorcios, Uniones temporales y Cuentas en participación | Webinar \- YouTube, accessed December 22, 2025, [https://www.youtube.com/watch?v=NAergHVuY5c](https://www.youtube.com/watch?v=NAergHVuY5c)  
8. Documentación Técnica \- DIAN, accessed December 22, 2025, [https://www.dian.gov.co/impuestos/factura-electronica/documentacion/Paginas/documentacion-tecnica.aspx](https://www.dian.gov.co/impuestos/factura-electronica/documentacion/Paginas/documentacion-tecnica.aspx)  
9. Documento Soporte con Sujetos No Obligados a Expedir Factura de Venta y/o Documento Equivalente \- DIAN, accessed December 22, 2025, [https://www.dian.gov.co/impuestos/Paginas/Sistema-de-Factura-Electronica/Documento-Soporte-Adquisiciones-No-Obligados.aspx](https://www.dian.gov.co/impuestos/Paginas/Sistema-de-Factura-Electronica/Documento-Soporte-Adquisiciones-No-Obligados.aspx)  
10. CONSULTA EVENTOS RADIAN, accessed December 22, 2025, [https://www.dian.gov.co/impuestos/factura-electronica/Documents/Consulta-Eventos-RADIAN-FE.pdf](https://www.dian.gov.co/impuestos/factura-electronica/Documents/Consulta-Eventos-RADIAN-FE.pdf)  
11. Documento soporte en adquisiciones efectuadas a sujetos no obligados a expedir factura de venta o \- DIAN, accessed December 22, 2025, [https://www.dian.gov.co/impuestos/Documents/Documento\_soporte\_en\_adquisiciones\_efectuadas.pdf](https://www.dian.gov.co/impuestos/Documents/Documento_soporte_en_adquisiciones_efectuadas.pdf)  
12. circular externa \- Superintendencia de Sociedades, accessed December 22, 2025, [https://supersociedades.gov.co/documents/107391/161224/Circular+externa+115-000006.pdf/0a1675c8-fd80-72aa-4192-468ea377b59b?version=1.4\&t=1670335090812](https://supersociedades.gov.co/documents/107391/161224/Circular+externa+115-000006.pdf/0a1675c8-fd80-72aa-4192-468ea377b59b?version=1.4&t=1670335090812)  
13. Role-Based Access Control (RBAC) | Supabase Features, accessed December 22, 2025, [https://supabase.com/features/role-based-access-control](https://supabase.com/features/role-based-access-control)  
14. The best JavaScript data grids in 2025 \- Bryntum, accessed December 22, 2025, [https://bryntum.com/blog/the-best-javascript-data-grids-in-2025/](https://bryntum.com/blog/the-best-javascript-data-grids-in-2025/)  
15. AG Grid Alternatives: 7 Best Free React Data Grids (2025) \- Simple Table, accessed December 22, 2025, [https://www.simple-table.com/blog/ag-grid-alternatives-free-react-data-grids](https://www.simple-table.com/blog/ag-grid-alternatives-free-react-data-grids)  
16. Instructor \- Structure LLM Outputs with Ease, accessed December 22, 2025, [https://useinstructor.com/](https://useinstructor.com/)  
17. Instructor LLM Tutorial: Complete Guide to Structured Outputs, accessed December 22, 2025, [https://python.useinstructor.com/learning/](https://python.useinstructor.com/learning/)  
18. Authorization via Row Level Security | Supabase Features, accessed December 22, 2025, [https://supabase.com/features/row-level-security](https://supabase.com/features/row-level-security)  
19. Self-Hosting | Supabase Docs, accessed December 22, 2025, [https://supabase.com/docs/guides/self-hosting](https://supabase.com/docs/guides/self-hosting)  
20. Invoice OCR Benchmark: Extraction Accuracy of LLMs vs OCRs \- Research AIMultiple, accessed December 22, 2025, [https://research.aimultiple.com/invoice-ocr/](https://research.aimultiple.com/invoice-ocr/)  
21. AWS Textract vs Google, Azure, and GPT-4o: Invoice Extraction Benchmark, accessed December 22, 2025, [https://www.businesswaretech.com/blog/research-best-ai-services-for-automatic-invoice-processing](https://www.businesswaretech.com/blog/research-best-ai-services-for-automatic-invoice-processing)  
22. Row Level Security | Supabase Docs, accessed December 22, 2025, [https://supabase.com/docs/guides/database/postgres/row-level-security](https://supabase.com/docs/guides/database/postgres/row-level-security)  
23. Host Remote Validator Models | Your Enterprise AI needs Guardrails, accessed December 22, 2025, [https://www.guardrailsai.com/docs/how\_to\_guides/hosting\_validator\_models](https://www.guardrailsai.com/docs/how_to_guides/hosting_validator_models)  
24. Structured Data Extraction using LLMs and Guardrails AI \- Learn by Building.ai, accessed December 22, 2025, [https://learnbybuilding.ai/tutorial/structured-data-extraction-with-guardrails-and-llms/](https://learnbybuilding.ai/tutorial/structured-data-extraction-with-guardrails-and-llms/)  
25. Change Management in Construction: Strategies for Success \- Pinnacle Infotech, accessed December 22, 2025, [https://pinnacleinfotech.com/change-management-in-construction/](https://pinnacleinfotech.com/change-management-in-construction/)  
26. procurement · GitHub Topics, accessed December 22, 2025, [https://github.com/topics/procurement?l=python\&o=desc\&s=updated](https://github.com/topics/procurement?l=python&o=desc&s=updated)  
27. Formatos \- GESTIÓN DE ALMACÉN E INVENTARIOS \- IDEAM, accessed December 22, 2025, [http://sgi.ideam.gov.co/gestion-de-almacen-e-inventarios/-/document\_library\_display/sJttfH79uM0q/view/86645793](http://sgi.ideam.gov.co/gestion-de-almacen-e-inventarios/-/document_library_display/sJttfH79uM0q/view/86645793)  
28. Purchase Order and Invoice Matching Software Solution \- Tipalti, accessed December 22, 2025, [https://tipalti.com/ap-automation/po-matching/](https://tipalti.com/ap-automation/po-matching/)  
29. OxfordRSE/oxrse\_unit\_conv: Python unit conversion library for teaching collaborative GitHub techniques., accessed December 22, 2025, [https://github.com/OxfordRSE/oxrse\_unit\_conv](https://github.com/OxfordRSE/oxrse_unit_conv)  
30. Índice de Costos de la Construcción de Vivienda (ICCV) \- DANE, accessed December 22, 2025, [https://www.dane.gov.co/index.php/estadisticas-por-tema/precios-y-costos/indice-de-costos-de-la-construccion-de-vivienda-iccv](https://www.dane.gov.co/index.php/estadisticas-por-tema/precios-y-costos/indice-de-costos-de-la-construccion-de-vivienda-iccv)  
31. Índice de Costos de la Construcción de Edificaciones (ICOCED) \- DANE, accessed December 22, 2025, [https://www.dane.gov.co/index.php/estadisticas-por-tema/precios-y-costos/indice-de-costos-de-la-construccion-de-edificaciones-icoced](https://www.dane.gov.co/index.php/estadisticas-por-tema/precios-y-costos/indice-de-costos-de-la-construccion-de-edificaciones-icoced)  
32. Structured output with Instructor \- Writer AI Studio, accessed December 22, 2025, [https://dev.writer.com/home/integrations/instructor](https://dev.writer.com/home/integrations/instructor)  
33. AI Document Extraction on Azure \- Options, Comparison & Recommendations for Invoice/Contract Processing \- Reddit, accessed December 22, 2025, [https://www.reddit.com/r/AZURE/comments/1pq490v/ai\_document\_extraction\_on\_azure\_options/](https://www.reddit.com/r/AZURE/comments/1pq490v/ai_document_extraction_on_azure_options/)  
34. Build a React Excel-like Grid with SmartClient \- The Isomorphic Software Blog \-, accessed December 22, 2025, [https://blog.smartclient.com/build-react-excel-like-grid-in-smartclient/](https://blog.smartclient.com/build-react-excel-like-grid-in-smartclient/)  
35. How to import CSV Files with React \- importOK, accessed December 22, 2025, [https://importok.io/blog/import-csv-react](https://importok.io/blog/import-csv-react)  
36. UgnisSoftware/react-spreadsheet-import: Import flow for Excel (.xlsx) and CSV file with automated column matching and validation. \- GitHub, accessed December 22, 2025, [https://github.com/UgnisSoftware/react-spreadsheet-import](https://github.com/UgnisSoftware/react-spreadsheet-import)  
37. Effective Strategies for Change Management in Software Development \- Tres Astronautas, accessed December 22, 2025, [https://www.tresastronautas.com/en/blog/comprehensive-guide-to-change-management-in-custom-software-projects-guide](https://www.tresastronautas.com/en/blog/comprehensive-guide-to-change-management-in-custom-software-projects-guide)