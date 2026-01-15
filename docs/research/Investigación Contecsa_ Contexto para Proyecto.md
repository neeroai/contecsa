---
title: "Contecsa Strategic and Operational Analysis - Research"
summary: "Comprehensive research including corporate profile, verified project inventory (9 consortiums), supply chain mapping, and compliance risk analysis. Identifies Cartagena case lessons and data integrity requirements for system design."
description: "Research: Contecsa corporate profile, project inventory, supply chain, compliance risks"
date: "2025-12-22"
updated: "2026-01-15 14:30"
scope: "project"
---

# **Project Context Pack: Análisis Estratégico y Operativo de Contecsa S.A.S.**

## **Resumen Ejecutivo**

Este documento constituye el **Project Context Pack** definitivo para el diseño y desarrollo de una capa moderna de autoservicio de información, trazabilidad de compras y validación de facturas destinada a **Conglomerado Técnico Colombiano S.A.S. (Contecsa)**. En mi rol integrado de Research Lead, Business Analyst y Data/AI Strategist, he llevado a cabo una investigación forense y estratégica sobre las operaciones de la compañía en el territorio colombiano, con el objetivo de traducir realidades físicas y contractuales en especificaciones técnicas inequívocas para el Documento de Requisitos del Producto (PRD).

La investigación confirma que Contecsa es un actor maduro y de gran escala en el sector de infraestructura civil del Caribe colombiano, con casi tres décadas de trayectoria operativa. Actualmente, la firma gestiona una cartera de proyectos de alto valor e impacto social, concentrados principalmente en los departamentos de **Bolívar** y **Atlántico**, ejecutados mayoritariamente bajo la figura jurídica de **Consorcios**. Esta realidad operativa impone el primer gran requisito funcional para el sistema: la capacidad de gestionar relaciones "muchos a muchos" entre entidades legales, centros de costos y facturación, dado que la ejecución de obras como el mejoramiento vial en Mompox o Magangué se realiza a través de vehículos como el *Consorcio Vipar 2024*, donde Contecsa posee una participación mayoritaria pero no exclusiva.

Sin embargo, el hallazgo más crítico desde una perspectiva de estrategia de datos y riesgos no es operativo, sino reputacional. La investigación ha detectado señales de alerta temprana relacionadas con presuntos vínculos entre estructuras consorciales en las que participa Contecsa y actores vinculados a escándalos históricos de contratación (Grupo Nule), específicamente en el marco del programa "Más Vías" en el Atlántico. Este hallazgo transforma la naturaleza del producto digital: no puede ser meramente una herramienta de eficiencia administrativa; debe ser un **Escudo de Cumplimiento (Compliance Shield)**. El sistema debe incorporar motores de validación de contrapartes y trazabilidad financiera que excedan los estándares convencionales, protegiendo a la organización de riesgos de contagio reputacional y asegurando la integridad de cada peso invertido.

A continuación, se presenta el desglose exhaustivo de la identidad corporativa, el inventario verificado de proyectos, el mapa operativo de la cadena de suministro y la traducción técnica de estos insumos en reglas de negocio, datasets y algoritmos de riesgo para el PRD.

## ---

**Sección 1: Perfil Corporativo y Verificación de Identidad**

Para construir una arquitectura de datos robusta, el primer paso es la resolución inequívoca de la entidad. El sistema de información debe ser capaz de distinguir a nuestro sujeto de estudio de homónimos internacionales y perfilar correctamente su naturaleza jurídica para la configuración de la facturación electrónica y las obligaciones tributarias.

### **1.1 Resolución de Entidad y Datos Maestros**

La investigación ha identificado una colisión de nombres (homonimia) que representa un riesgo para la ingesta automática de datos (web scraping o APIs públicas). Existe una empresa denominada "Contecsa Latam", dedicada a servicios de tecnología y nube (Microsoft Partners), con operaciones en El Salvador y Guatemala.1 Es imperativo que los algoritmos de ingesta de datos del PRD incluyan filtros de geolocalización estrictos (Country \== Colombia) y de actividad económica (Sector \== Construcción/Infraestructura) para evitar la contaminación del "Data Lake" con información irrelevante del sector IT centroamericano.

La entidad objetivo para este proyecto se define con los siguientes atributos verificados, que deben constituir el "Master Data" del cliente en la plataforma:

| Atributo | Dato Verificado | Fuente | Implicación para el PRD |
| :---- | :---- | :---- | :---- |
| **Razón Social** | CONGLOMERADO TECNICO COLOMBIANO S.A.S. | 2 | Nombre legal para facturación y contratos. |
| **Sigla Comercial** | CONTECSA S.A.S. | 3 | Etiqueta para UI y búsquedas rápidas. |
| **NIT (Tax ID)** | **802.005.436-1** | 2 | Llave primaria (Primary Key) para integración con DIAN y SECOP. |
| **Naturaleza Jurídica** | Sociedad por Acciones Simplificada (S.A.S.) | 2 | Define obligaciones de reporte y estructura accionaria flexible. |
| **Sede Principal** | Km 98 \+ 600 Vía Al Mar, Entrada Antorcha, Puerto Colombia, Atlántico | 4 | Ubicación fiscal. Diferente de los centros de costos operativos. |
| **Tamaño Empresa** | Grande | 3 | Implica volúmenes altos de facturación y regímenes tributarios complejos. |
| **Actividad CIIU** | 4210 (Construcción de carreteras y vías de ferrocarril) | 3 | Clasificación para analítica sectorial. |
| **Fecha Constitución** | 27 de junio de 1997 | 3 | Antigüedad \> 25 años indica estabilidad y datos históricos disponibles. |

### **1.2 Posicionamiento Estratégico y Certificaciones**

Contecsa se posiciona no como un contratista generalista, sino como una firma de ingeniería especializada en obras civiles de alta complejidad técnica. Su narrativa corporativa enfatiza la "Excelencia Operativa" y el cumplimiento de estándares internacionales, respaldado por la certificación **ISO 9001:2015**.7 Este detalle no es decorativo; implica que la empresa ya posee procesos documentados de gestión de calidad.

El sistema a desarrollar no debe reinventar la rueda, sino digitalizar estos procesos preexistentes. El flujo de aprobación de facturas en el PRD debe reflejar los pasos de control de calidad que exige la norma ISO (ej. validación de ensayos de materiales antes del pago). La empresa opera bajo una filosofía de "Mejoramiento Continuo" y "Prevención de Riesgos" 8, lo que sugiere que el cliente interno será receptivo a módulos de alertas preventivas y dashboards de KPIs de desempeño.

## ---

**Sección 2: Inventario Verificado de Proyectos (La "Verdad del Terreno")**

El núcleo del sistema de trazabilidad de compras es la correcta imputación de costos a los proyectos activos. Una factura de cemento no es un gasto genérico; es un insumo específico para un centro de costos geolocalizado. A través del análisis cruzado de bases de datos de contratación pública (SECOP), prensa regional y reportes corporativos, se ha construido el siguiente inventario verificado, que debe precargarse en la base de datos del sistema.

### **2.1 Proyectos Activos de Alto Impacto (Cartera 2024-2025)**

La investigación revela una concentración masiva de operaciones en el **Departamento de Bolívar**, bajo la administración del actual gobernador Yamil Arana, y una actividad prospectiva controversial en el **Atlántico**.

#### **Proyecto A: Mejoramiento Vial y Urbano de Mompox (Bolívar)**

* **Estado:** Activo / Adjudicado (Diciembre 2023 \- Enero 2024).  
* **Cliente:** Gobernación de Bolívar.  
* **Valor del Contrato:** Aproximadamente **$33.502.636.774 COP**.9  
* **Vehículo de Ejecución:** **Consorcio Vipar 2024**.  
* **Estructura del Consorcio (Ownership Split):**  
  * **Contecsa S.A.S.:** 50% de participación.10  
  * **JMD Ingeniería de Proyectos S.A.S.:** 40%.  
  * **Cotraing S.A.S. (Compañía de Trabajos de Ingeniería):** 10%.  
* **Alcance:** Intervención de vías urbanas y parques en el Distrito de Mompox.  
* **Análisis de Contexto para el PRD:**  
  * **Logística Extrema:** Santa Cruz de Mompox es un distrito en una isla fluvial (Isla Margarita), con acceso limitado. Los materiales pétreos y asfálticos deben transportarse largas distancias o cruzar en ferry/puente. Esto implica que los costos unitarios de materiales serán significativamente más altos que el promedio nacional debido a los fletes. **Regla de Validación:** El sistema no puede aplicar topes de precios estándar de Barranquilla a las facturas de Mompox; debe existir una "Lista de Precios Diferencial por Zona Geográfica".  
  * **Patrimonio Histórico:** Al ser Patrimonio de la Humanidad, las obras requieren materiales específicos (ej. adoquines, concretos estampados) y aprobaciones del Ministerio de Cultura. El catálogo de productos ("Item Master") debe incluir estos materiales especializados.

#### **Proyecto B: Mejoramiento de la Malla Vial de Magangué (Bolívar)**

* **Estado:** Activo / Adjudicado 2024\.  
* **Cliente:** Gobernación de Bolívar.  
* **Valor del Contrato:** Aproximadamente **$20.737.434.969 COP**.9  
* **Vehículo de Ejecución:** **Consorcio Vipar 2024** (Misma estructura legal que Mompox).  
* **Alcance:** Rehabilitación de la red vial en Magangué, el segundo municipio más importante de Bolívar.  
* **Análisis de Contexto para el PRD:**  
  * **Economías de Escala:** Al utilizar el mismo consorcio (Vipar 2024\) para Mompox y Magangué, es probable que Contecsa centralice compras. El sistema debe permitir "Compras Consolidadas" donde una sola Orden de Compra (PO) se divide contablemente entre dos centros de costos distintos (Proyecto A y Proyecto B) al momento de la recepción de la factura.

#### **Proyecto C: Programa "Más Vías" / Vía Caracolí (Atlántico) – *Alerta de Riesgo***

* **Estado:** En proceso / Controversial (Finales 2024).  
* **Cliente:** Gobernación del Atlántico (Eduardo Verano).  
* **Contexto:** Parte de un macro-programa de inversión de $1 billón de pesos para rehabilitar 150 km de vías secundarias.  
* **Participación:** Contecsa aparece como integrante del **Consorcio CMX Atlántico**.11  
* **Señal de Riesgo Crítico:** Investigaciones periodísticas (Infobae) han señalado que este proceso licitatorio ha favorecido a consorcios con presuntos vínculos con **Guido Nule** y **Emilio Tapia**, figuras centrales del escándalo del "Carrusel de la Contratación". Las fuentes sugieren que Contecsa podría estar actuando en consorcio con intereses vinculados a estas figuras.11  
* **Implicación para el PRD:** Este proyecto debe ser etiquetado en el sistema como **"High Compliance Risk"**.  
  * **Auditoría Reforzada:** Cualquier pago a subcontratistas en este proyecto debe requerir un nivel adicional de aprobación (flujo de trabajo de 3 pasos en lugar de 2).  
  * **Trazabilidad de Beneficiarios Finales:** El sistema debe exigir la identificación de los representantes legales de todos los proveedores asociados a este centro de costos.

### **2.2 Cartera Histórica y de Referencia (Base de Conocimiento)**

Estos proyectos, aunque en su mayoría finalizados, son vitales para alimentar la "Memoria de Precios" del sistema y gestionar garantías post-contractuales.

* **Segunda Calzada Cartagena – Barranquilla (Vía al Mar):** Proyecto insignia. Contecsa ejecutó la construcción de muros de tierra armada con geotextil y ampliación de calzadas (PR 6+500 al 16+000).12 Demuestra capacidad en geotecnia compleja.  
* **Control de Inundaciones en Higueretal (Canal del Dique):** Contrato con el Fondo Adaptación/Invías por valor de $14.290 millones COP.14 Obra hidráulica crítica para mitigación de cambio climático.  
* **Dique Carreteable en Puerto Velero (Tubará):** Contrato con la C.R.A. (Corporación Autónoma Regional del Atlántico) para protección costera.15  
* **Normalización Urbana (Soledad, Galapa, Malambo):** Proyectos de urbanismo y pavimentación barrial financiados por Edubar o Gobernaciones.7

## ---

**Sección 3: Mapa Operativo y Cadena de Suministro**

Para que el módulo de trazabilidad de compras sea efectivo, debe modelar fielmente cómo opera Contecsa en el mundo físico. La investigación revela una estructura operativa descentralizada y altamente dependiente de alianzas estratégicas.

### **3.1 El Modelo de Consorcios: El "Cerebro Operativo"**

Contecsa raramente actúa en solitario en los megaproyectos actuales. Su modus operandi estándar es la formación de **Consorcios**.9 Esto tiene implicaciones profundas para la arquitectura del software:

* **Entidad Legal vs. Entidad Operativa:** El "Consorcio Vipar 2024" tiene su propio NIT temporal, pero carece de personería jurídica permanente. Fiscalmente, los ingresos y costos se atribuyen a los socios según su porcentaje de participación (50% Contecsa, 40% JMD, 10% Cotraing).  
* **Requerimiento del Sistema:** El PRD debe soportar **"Facturación por Mandato"** o **"Cuentas en Participación"**. Cuando un proveedor factura 100 millones de pesos de asfalto al Consorcio, el sistema ERP de Contecsa debe ser capaz de ingerir esa factura y reconocer automáticamente que solo el 50% ($50M) impacta su P\&L (Estado de Resultados), mientras que el resto es una cuenta por cobrar/pagar a los socios.  
* **Socio Recurrente:** La investigación destaca a **JMD Ingeniería de Proyectos S.A.S.** como un socio estratégico repetitivo (presente tanto en Mompox como en Magangué). El sistema debe tratar a JMD no como un proveedor externo, sino como una "Entidad Vinculada" con privilegios de datos compartidos si es necesario.

### **3.2 Categorías Críticas de Insumos (Input para el "Item Master")**

Basado en la tipología de proyectos (vías, diques, urbanismo), se ha reconstruido la cadena de suministro crítica. El PRD debe incluir validaciones específicas para cada categoría:

| Categoría de Compra | Insumos Típicos | Unidad | Lógica de Validación (Regla de Negocio) |
| :---- | :---- | :---- | :---- |
| **Materiales Granulares** | Sub-base, Base, Arena, Piedra Rajón | $m^3$ / Ton | **Validación de Volumetría:** La factura debe cruzarse obligatoriamente con el "Tiquete de Báscula" y el "Recibo de Almacén". *Alerta:* Si (Volumen Facturado \> Volumen Topográfico Teórico \* 1.05), bloquear pago por posible desperdicio o fraude. |
| **Mezclas Asfálticas** | Asfalto MDC-19, MDC-25, Emulsiones | Ton / Gal | **Control de Calidad:** Requiere adjuntar el registro de temperatura de llegada. El asfalto frío no sirve. El sistema debe tener un campo obligatorio para "Temperatura de Colocación". |
| **Concretos Hidráulicos** | Concreto premezclado (3000, 4000 PSI) | $m^3$ | **Validación de Tiempos:** Cruce entre hora de salida de planta y hora de llegada a obra (Slump retention). |
| **Maquinaria Amarilla** | Alquiler de Motoniveladoras, Vibrocompactadores | Horas-Máquina (HM) | **Telemetría:** La factura se paga contra el reporte de "Horómetro". Idealmente, el sistema debería integrar datos GPS para validar si la máquina realmente se movió durante esas horas. |
| **Servicios Profesionales** | Topografía, Laboratorio de Suelos | Global / Informe | **Entregable Digital:** Pago contra carga de informe PDF en el repositorio documental del proyecto. |
| **Gestión Ambiental** | Disposición de escombros (RCD), Aceites usados | Ton / Gal | **Certificado Legal:** Pago bloqueado hasta que el proveedor suba el certificado de disposición final en sitio autorizado (ej. pago a la CRA).17 |

### **3.3 Logística y Geografía**

La operación en Bolívar (Mompox/Magangué) presenta un desafío de **latencia de datos**. Las zonas rurales a menudo tienen conectividad celular intermitente.

* **Requerimiento No Funcional:** La aplicación móvil para los residentes de obra (quienes validan la recepción de materiales) debe operar bajo un paradigma **Offline-First**. Deben poder escanear remisiones y capturar fotos sin internet, y sincronizar cuando recuperen conexión. Si el sistema depende de la nube en tiempo real, fracasará en Mompox.

## ---

**Sección 4: Análisis de Riesgos y Cumplimiento (El Factor Estratégico)**

La investigación de contexto ha arrojado una dimensión de riesgo que el software debe abordar proactivamente. No se trata solo de construir vías, sino de navegar un entorno de contratación pública altamente escrutado.

### **4.1 El "Fantasma" del Riesgo Reputacional**

La mención de Contecsa en reportes de prensa asociados a licitaciones cuestionadas ("Más Vías") y a figuras como los Nule 11 activa una alerta roja. En el entorno bancario y asegurador colombiano, estas asociaciones pueden llevar a la pérdida de cupos de crédito o pólizas de cumplimiento.

* **Estrategia de Producto:** El sistema debe servir como evidencia de transparencia. Cada transacción debe tener una trazabilidad inmutable (Audit Log) que demuestre que los fondos del anticipo se usaron estrictamente para materiales y mano de obra, y no fueron desviados a terceros no relacionados.

### **4.2 Cumplimiento Ambiental y Regulatorio**

Contecsa figura en los listados de la Corporación Autónoma Regional del Atlántico (C.R.A.) como generador de residuos peligrosos (RESPEL) y sujeto de cobros por seguimiento ambiental.17 También interactúa con Corpocesar.18

* **Riesgo Operativo:** El no pago de estas tasas menores puede bloquear licencias ambientales mayores, deteniendo la obra.  
* **Solución en PRD:** Un módulo de "Calendario Tributario Ambiental" que alerte sobre los vencimientos de pagos a las corporaciones autónomas (CRA, Corpocesar, CSB) basándose en las resoluciones publicadas.

## ---

**Sección 5: Context Pack para el PRD (Insumos Accionables)**

Esta sección traduce la narrativa anterior en especificaciones técnicas directas para el equipo de ingeniería y producto.

### **5.1 Inventario de Datasets (Fuentes de Verdad)**

Para habilitar el "Autoservicio de Información", la plataforma debe ingestar y normalizar datos de las siguientes fuentes:

| Dataset | Fuente de Datos | Frecuencia | Uso en el Sistema |
| :---- | :---- | :---- | :---- |
| **Contratos Públicos** | API Datos.gov.co (SECOP II) | Diaria | Validar valor total del contrato, fechas de inicio/fin, y miembros oficiales del consorcio. Detectar "Otrosíes" (adiciones). |
| **Estado Corporativo** | RUES (Registro Único) / Scraper | Mensual | Verificar renovación de Matrícula Mercantil de Contecsa y de todos sus proveedores activos. |
| **Listas Restrictivas** | Procuraduría / Contraloría / OFAC | Tiempo Real | **Risk Engine:** Validar antecedentes de nuevos proveedores antes de crear la orden de compra. |
| **Obligaciones Ambientales** | Boletines CRA / Corpocesar 17 | Trimestral | Rastrear obligaciones pendientes (ej. Resolución 0000847). Evitar pasivos ocultos. |
| **ERP Interno** | (Siesa / SAP / WorldOffice \- *A confirmar*) | Tiempo Real | Fuente de la verdad contable (Facturas, Pagos, Retenciones). |

### **5.2 Modelo de Datos: Entidades y Relaciones**

El esquema de base de datos debe reflejar la complejidad de los consorcios. Un modelo simple de "Empresa \-\> Proyecto" fallará. Se propone un modelo relacional o de grafo:

* **Entidad Legal (Legal Entity):** Contecsa, JMD, Cotraing.  
* **Vehículo Contractual (Contract Vehicle):** Consorcio Vipar 2024 (Relación N:N con Entidades Legales, con atributo %\_Participación).  
* **Proyecto (Project/Cost Center):** Mejoramiento Mompox (Relación 1:1 con Vehículo Contractual).  
* **Proveedor (Vendor):** Cementos del Caribe (Relación 1:N con Vehículo Contractual).  
* **Transacción (Transaction):** Factura \#123. Atributo crítico: Paying\_Entity\_ID (¿Quién paga? ¿El Consorcio o Contecsa directamente?).

### **5.3 Reglas de Negocio y Motor de Riesgo (Risk Engine)**

El sistema debe implementar un motor de reglas ("Business Rules Engine") configurado con la siguiente lógica derivada de la investigación:

1. **Regla de "Bandera Roja" de Beneficiario Final (Beneficial Ownership Flag):**  
   * *Trigger:* Si el sistema detecta un proveedor o socio con coincidencia de nombre, dirección o representante legal vinculado a listas de riesgo (Nule, Tapia, Carrusel).  
   * *Acción:* Bloqueo preventivo inmediato de cualquier pago y alerta al Oficial de Cumplimiento.  
2. **Regla de Consistencia de Consorcio:**  
   * *Trigger:* Si se recibe una factura de un socio del consorcio (ej. JMD Ingeniería) por concepto de "Asesoría" o "Gestión" sin un entregable tangible adjunto.  
   * *Acción:* Alerta de "Operación Intercompany". Requiere validación manual para evitar el trasvasado de utilidades sin justificación operativa.  
3. **Regla de Desviación de Precios Geográfica:**  
   * *Trigger:* Comparar el precio unitario del concreto en Magangué vs. Mompox.  
   * *Lógica:* Si Precio\_Mompox \< Precio\_Magangué, generar alerta (es sospechoso, ya que Mompox debería ser más caro por fletes). Si Precio\_Mompox \> Precio\_Magangué \* 1.5, generar alerta de sobrecosto excesivo.

### **5.4 Métricas Clave (KPIs) para el Dashboard**

* **% Ejecución vs. Facturación:** (Valor Acumulado Facturado / Valor Total Contrato SECOP). *Insight:* Si la facturación avanza más rápido que la obra física, hay riesgo de desfinanciamiento futuro.  
* **DSO de Consorcios:** (Días de Cartera promedio de la participación del 50% en Vipar). *Insight:* ¿Los socios están poniendo su parte del capital de trabajo o Contecsa está financiando toda la operación?  
* **Índice de Conciliación de Materiales:** (Volumen Teórico Diseño vs. Volumen Comprado Facturas). *Insight:* Control de pérdidas negras (robo) o desperdicio técnico.

## ---

**Sección 6: Preguntas Abiertas y Próximos Pasos**

Para cerrar las brechas identificadas en la investigación y finalizar el diseño técnico del PRD, se requiere que el equipo de Contecsa responda las siguientes interrogantes estratégicas:

1. **Arquitectura ERP:** ¿Cuál es el sistema ERP específico que utiliza Contecsa actualmente (Siesa Enterprise, SAP Business One, WorldOffice)? La respuesta determinará la complejidad de los conectores API para la "Capa de Información".  
2. **Estrategia de Defensa Reputacional:** Ante las menciones de prensa sobre los Nule, ¿posee Contecsa una composición accionaria certificada y transparente que podamos cargar en el sistema como "Documento Maestro" para rebatir automáticamente las alertas de cumplimiento de los bancos?  
3. **Flujo de Caja del Consorcio:** En el *Consorcio Vipar 2024*, ¿el Consorcio tiene una cuenta bancaria propia centralizada desde donde se paga a los proveedores, o cada socio (Contecsa/JMD) paga sus propias facturas y luego hacen cruce de cuentas? Esta definición es crítica para diseñar el módulo de Tesorería.  
4. **Digitalización de Maquinaria:** ¿La flota de maquinaria amarilla propia o alquilada cuenta con dispositivos GPS/IoT instalados? De ser así, ¿cuál es el proveedor de telemetría? Integrar esta data automatizaría la validación de facturas de alquiler, una de las fuentes más comunes de fuga de dinero en obras civiles.

### ---

**Conclusión del Context Pack**

Contecsa es una organización con la "piel dura" de casi 30 años en el sector, capaz de ejecutar obras logísticamente complejas en la Colombia profunda. Sin embargo, opera en un entorno de alto riesgo donde la eficiencia operativa (controlar costos en una isla como Mompox) es tan vital como la integridad corporativa (demostrar transparencia ante acusaciones mediáticas).

La herramienta digital que resulte de este PRD no puede ser un simple repositorio de facturas. Debe ser una **plataforma de inteligencia operativa y blindaje corporativo**. Al implementar las reglas de validación geográfica, los filtros de riesgo de contraparte y el modelo de datos consorcial aquí propuesto, Contecsa transformará sus datos dispersos en un activo estratégico que asegura su sostenibilidad y reputación a largo plazo.

#### **Fuentes citadas**

1. CONTECSA LATAM, acceso: diciembre 22, 2025, [https://wwwcontecsalatam.azurewebsites.net/](https://wwwcontecsalatam.azurewebsites.net/)  
2. Política de Tratamiento de Datos \- Contecsa S.A.S. | Servicios de Ingeniería y construcción de obras civiles, acceso: diciembre 22, 2025, [https://www.contecsa-sas.com/politica-de-tratamiento-de-datos/](https://www.contecsa-sas.com/politica-de-tratamiento-de-datos/)  
3. CONGLOMERADO TECNICO COLOMBIANO S.A.S. SIGLA CONTECSA S.A.S. \- Datos de empresas, acceso: diciembre 22, 2025, [https://www.datacreditoempresas.com.co/directorio/conglomerado-tecnico-colombiano-sas-sigla-contecsa-sas.html](https://www.datacreditoempresas.com.co/directorio/conglomerado-tecnico-colombiano-sas-sigla-contecsa-sas.html)  
4. CONGLOMERADO TECNICO COLOMBIANO S.A.S. SIGLA CONTECSA S.A.S. \- Registro Único Empresarial y Social Datos de contacto e información comercial, acceso: diciembre 22, 2025, [https://empresas.larepublica.co/colombia/atlantico/puerto-colombia/conglomerado-tecnico-colombiano-s-a-s-sigla-contecsa-s-a-s-802005436](https://empresas.larepublica.co/colombia/atlantico/puerto-colombia/conglomerado-tecnico-colombiano-s-a-s-sigla-contecsa-s-a-s-802005436)  
5. Aviso de Privacidad \- Contecsa S.A.S. | Servicios de Ingeniería y construcción de obras civiles, acceso: diciembre 22, 2025, [https://www.contecsa-sas.com/aviso-de-privacidad/](https://www.contecsa-sas.com/aviso-de-privacidad/)  
6. Contacto \- Contecsa S.A.S. | Servicios de Ingeniería y construcción de obras civiles, acceso: diciembre 22, 2025, [https://www.contecsa-sas.com/contacto/](https://www.contecsa-sas.com/contacto/)  
7. CONGLOMERADO TÉCNICO COLOMBIANO \- Contecsa S.A.S., acceso: diciembre 22, 2025, [https://www.contecsa-sas.com/wp-content/uploads/2019/12/Brochure-Contecsa.pdf](https://www.contecsa-sas.com/wp-content/uploads/2019/12/Brochure-Contecsa.pdf)  
8. Contecsa S.A.S. | Servicios de Ingeniería y construcción de obras civiles, acceso: diciembre 22, 2025, [https://www.contecsa-sas.com/](https://www.contecsa-sas.com/)  
9. Primer año de Arana en Bolívar: obras heredadas, pocos megaproyectos propios y foco en Cartagena | La Contratopedia Caribe, acceso: diciembre 22, 2025, [https://lacontratopediacaribe.com/primer-ano-de-arana-en-bolivar-obras-heredadas-pocos-megaproyectos-propios-y-foco-en-cartagena/](https://lacontratopediacaribe.com/primer-ano-de-arana-en-bolivar-obras-heredadas-pocos-megaproyectos-propios-y-foco-en-cartagena/)  
10. acceso: diciembre 22, 2025, [https://www.bolivar.gov.co/web/archivos/gobbol\_json\_archivo/getarchivosdata.php?p=Normatividad/Resoluciones/2024](https://www.bolivar.gov.co/web/archivos/gobbol_json_archivo/getarchivosdata.php?p=Normatividad/Resoluciones/2024)  
11. Gobernación del Atlántico está bajo la lupa por un megaproyecto: el ..., acceso: diciembre 22, 2025, [https://www.infobae.com/colombia/2024/10/31/gobernacion-del-atlantico-esta-bajo-la-lupa-por-un-megaproyecto-el-retorno-de-emilio-tapia-y-los-primos-nule/](https://www.infobae.com/colombia/2024/10/31/gobernacion-del-atlantico-esta-bajo-la-lupa-por-un-megaproyecto-el-retorno-de-emilio-tapia-y-los-primos-nule/)  
12. Servicios de Ingeniería y construcción de obras ... \- Contecsa S.A.S., acceso: diciembre 22, 2025, [https://www.contecsa-sas.com/proyectos/](https://www.contecsa-sas.com/proyectos/)  
13. Conglomerado Técnico Colombiano S.A.S. \- Contecsa S.A.S., acceso: diciembre 22, 2025, [https://www.contecsa-sas.com/proyectos-subcontratados/](https://www.contecsa-sas.com/proyectos-subcontratados/)  
14. acceso: diciembre 22, 2025, [https://www.datos.gov.co/api/views/79ga-5jck/rows.rdf?accessType=DOWNLOAD](https://www.datos.gov.co/api/views/79ga-5jck/rows.rdf?accessType=DOWNLOAD)  
15. Construcción de Dique Carreteable en Puerto Velero, Municipio de Tubará \- Contecsa S.A.S., acceso: diciembre 22, 2025, [https://www.contecsa-sas.com/construccion-de-dique-carreteable-en-puerto-velero-municipio-de-tubara/](https://www.contecsa-sas.com/construccion-de-dique-carreteable-en-puerto-velero-municipio-de-tubara/)  
16. Las obras con las que Arana busca dejar su impronta en Bolívar | La ..., acceso: diciembre 22, 2025, [https://lacontratopediacaribe.com/las-obras-con-las-que-arana-busca-dejar-su-impronta-en-bolivar/](https://lacontratopediacaribe.com/las-obras-con-las-que-arana-busca-dejar-su-impronta-en-bolivar/)  
17. Ambiente, acceso: diciembre 22, 2025, [https://www.crautonoma.gov.co/documentos/peticiones/aviso/066-2025.pdf](https://www.crautonoma.gov.co/documentos/peticiones/aviso/066-2025.pdf)  
18. Boletin Oficial Octubre de 2022 \- Corporación Autónoma Regional del Cesar, acceso: diciembre 22, 2025, [https://www.corpocesar.gov.co/boletin-octubre-2022.html](https://www.corpocesar.gov.co/boletin-octubre-2022.html)