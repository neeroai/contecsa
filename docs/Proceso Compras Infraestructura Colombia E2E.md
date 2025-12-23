# **Informe Integral de Consultoría: Reingeniería, Auditoría y Digitalización del Proceso de Abastecimiento (E2E) para Infraestructura en Colombia**

Preparado para: Junta Directiva y Gerencia de Proyectos (Perfil Contecsa)  
Fecha: 22 de Diciembre de 2025  
Alcance: Proceso End-to-End (E2E), Gestión de Consorcios/UT, Controles Técnicos (INVIAS/NTC) y Arquitectura Digital.

## ---

**1\. Resumen Ejecutivo y Arquitectura Estratégica**

### **1.1. Contexto del Sector de Infraestructura Colombiano**

El sector de la infraestructura en Colombia atraviesa una coyuntura crítica caracterizada por la ejecución de proyectos de alta complejidad técnica (vías 4G/5G, túneles, viaductos) bajo modelos de contratación rigurosos y esquemas de asociación colaborativa, principalmente Consorcios y Uniones Temporales (UT). En este entorno, la función de Compras y Abastecimiento ha dejado de ser una mera actividad administrativa de soporte para convertirse en el pilar fundamental de la rentabilidad y la sostenibilidad financiera del proyecto. Para una organización del perfil de Contecsa, que opera en múltiples frentes geográficos simultáneos y bajo la vigilancia estricta de entidades como el Instituto Nacional de Vías (INVIAS), la Agencia Nacional de Infraestructura (ANI) y la Dirección de Impuestos y Aduanas Nacionales (DIAN), la ineficiencia en el ciclo de compras no solo representa un sobrecosto operativo, sino un riesgo jurídico y fiscal latente.

La presente investigación forense y propuesta de reingeniería aborda el ciclo *End-to-End* (E2E) del abastecimiento, desde la detección de la necesidad en el frente de obra hasta el pago final y la certificación de costos a los socios. El análisis revela que los modelos tradicionales de gestión, basados en correos electrónicos dispersos, hojas de cálculo aisladas y validaciones manuales, son insostenibles frente a la nueva realidad normativa de la Facturación Electrónica (Anexo Técnico 1.9) y los estándares de calidad técnica exigidos por las normas NTC e INVIAS.

### **1.2. La Problemática de la Operación Descentralizada**

Uno de los hallazgos centrales de este diagnóstico es la desconexión sistémica entre la "Oficina Central" (donde se negocian los precios) y el "Frente de Obra" (donde se consume el recurso). En proyectos lineales que se extienden por cientos de kilómetros, la visibilidad sobre el inventario en tránsito y la calidad del material recibido se pierde a menudo en la "última milla". La falta de conectividad en zonas remotas agrava esta situación, propiciando escenarios de fraude, pérdida de material y recepción de insumos fuera de especificación técnica que comprometen la estabilidad de la obra a largo plazo.

### **1.3. Objetivos del Nuevo Modelo Operativo**

El modelo propuesto en este informe busca tres objetivos estratégicos:

1. **Blindaje Fiscal y Legal:** Garantizar la deducibilidad del 100% de los costos mediante un cumplimiento riguroso de la normativa tributaria para Consorcios y UTs, asegurando la correcta emisión de certificaciones de costos a los socios y la gestión impecable de los eventos electrónicos (Título Valor) en la plataforma RADIAN.1  
2. **Integridad Técnica (Calidad en la Fuente):** Subordinar el pago administrativo al cumplimiento técnico. Ninguna factura debe ser pagada si el concreto no cumple con el asentamiento (slump) de la NTC 396 o si el asfalto no llega a la temperatura mínima exigida por el Artículo 450 del INVIAS.  
3. **Trazabilidad Digital E2E:** Implementar una arquitectura de datos que vincule el presupuesto (APU) con la orden de compra, la entrada de almacén georreferenciada y la factura electrónica, eliminando los silos de información.

## ---

**2\. Marco Jurídico y Fiscal: Operando bajo Consorcios y Uniones Temporales**

La figura del contrato de colaboración empresarial es la norma en la contratación estatal colombiana. Sin embargo, su naturaleza híbrida —sujetos de impuestos indirectos (IVA) pero no de directos (Renta)— crea una complejidad única en el proceso de compras que debe ser gestionada con precisión quirúrgica.

### **2.1. Naturaleza Jurídica y Responsabilidad Solidaria**

Es imperativo que el equipo de compras y auditoría comprenda que, aunque el Consorcio posee un NIT propio para el cumplimiento de obligaciones formales, carece de personería jurídica plena distinta de sus miembros. Según el Consejo de Estado y la jurisprudencia vigente, la responsabilidad solidaria es el eje rector.2

* **En Consorcios:** La solidaridad es total. Si el área de compras falla en la gestión de un contrato de suministro de acero y se genera una deuda impaga, el proveedor puede perseguir el patrimonio de cualquiera de los consorciados, independientemente de quién haya originado el pedido.  
* **En Uniones Temporales (UT):** Aunque la sanción por incumplimiento contractual se puede limitar según la participación, frente a obligaciones tributarias y laborales con terceros proveedores, la solidaridad suele ser la regla de interpretación por parte de los entes de control para proteger el recaudo y los derechos laborales.

Implicación para el Proceso de Compras:  
El sistema de gestión de proveedores debe incluir una validación estricta de Homologación y Riesgo. No se está contratando solo para una obra aislada; se está exponiendo el patrimonio de todos los socios. Por tanto, la validación SARLAFT (Lavado de Activos y Financiación del Terrorismo) y la verificación de capacidad financiera del proveedor son requisitos bloqueantes antes de la emisión de cualquier Orden de Compra (OC).

### **2.2. Facturación Electrónica y el Ecosistema DIAN 2025**

La Resolución 000165 de 2023 y el Anexo Técnico 1.9 han transformado la recepción de facturas. Para un Consorcio, el cumplimiento de estos requisitos no es opcional, es la base de la viabilidad financiera del proyecto.3

#### **2.2.1. Recepción y Eventos RADIAN**

El Consorcio actúa como adquirente. Para que una factura sea soporte de costos deducibles para los socios (quienes finalmente declaran la renta), el Consorcio debe garantizar la emisión de los tres eventos electrónicos obligatorios:

1. **Acuse de Recibo de la Factura:** Validación técnica del XML.  
2. **Recibo del Bien o Servicio:** Este evento es crítico y debe estar vinculado a la "Entrada de Almacén" o "Acta de Obra". Sin este evento, la factura no puede ser objeto de negociación (factoring) ni de deducción fiscal.  
3. **Aceptación Expresa:** Confirmación final de conformidad. Si no se emite en 3 días hábiles tras el recibo del bien, opera la aceptación tácita, impidiendo reclamos posteriores.

**Regla de Negocio Crítica:** El software de recepción de facturas debe estar integrado con el ERP de obra. Si el Residente de Obra no ha cerrado la "Entrada de Mercancía" (MIGO) en el sistema, el evento de "Recibo del Bien" no debe dispararse ante la DIAN, evitando así la aceptación tácita de bienes no recibidos o defectuosos.

#### **2.2.2. Facturación en Ventas Conjuntas**

Aunque el foco es compras, es vital recordar que si el Consorcio vende servicios o suministros a terceros (ej. venta de material de cantera propia a otro contratista), debe hacerlo bajo las reglas del Artículo 1.6.1.4.10 del Decreto 1625 de 2016: o factura el Consorcio con su NIT propio, o facturan los miembros por separado según su participación. La mezcla de estos modelos genera caos contable.1

### **2.3. El Mecanismo de Certificación de Costos y Gastos**

Dado que el Consorcio es un vehículo de paso (Pass-Through) para efectos de Renta, el objetivo final del ciclo de compras es la emisión de la **Certificación de Costos**.

* **Periodicidad:** Bimestral o Anual (según acuerdo de socios).  
* **Contenido:** Debe discriminar el costo por concepto (Mano de Obra, Materiales, Servicios) y por tercero, permitiendo a cada socio integrar esta información en su propia contabilidad y medios magnéticos.  
* **Control de Transparencia:** La suma de los costos certificados a los socios debe cuadrar exactamente con los costos registrados en la contabilidad del Consorcio. Cualquier desviación implica un riesgo de sanción por inexactitud.5  
* **Manejo de Cuentas de Orden:** Se recomienda el uso extensivo de cuentas de orden fiscal para el control de los costos diferidos y las participaciones, facilitando la auditoría forense en caso de disolución del consorcio.7

## ---

**3\. Arquitectura del Proceso E2E: Visualización y Flujos**

Para garantizar la comprensión y estandarización del proceso, se ha diseñado un modelo visual basado en *Swimlanes* (Carriles de Responsabilidad) que delimita claramente las interacciones entre los actores. A continuación se describe la narrativa detallada de este flujo visual.

### **3.1. Mapa de Proceso General (Nivel 0\)**

El macroproceso se divide en cuatro fases secuenciales interdependientes:

1. **Planeación y Requisición (P2R \- Plan to Requisition):** Definición técnica y presupuestal.  
2. **Abastecimiento Estratégico (S2C \- Source to Contract):** Negociación y formalización.  
3. **Ejecución Logística (P2P \- Procure to Pay):** Recepción física y control de calidad.  
4. **Gestión Financiera (R2R \- Record to Report):** Pago, tesorería y certificación.

### **3.2. Detalle del Flujo por Carriles (Swimlanes)**

#### **Fase 1: Planeación y Requisición**

| Actor (Carril) | Actividad / Acción | Regla de Negocio / Control | Documento Generado |
| :---- | :---- | :---- | :---- |
| **Ingeniería / Oficina Técnica** | Analiza planos y cronograma. Realiza la explosión de insumos (BIM). Carga cantidades al presupuesto de control. | Validación vs. Presupuesto Base. No se pueden cargar cantidades superiores al APU contractual sin aprobación de Gerencia ("Control de Cambios"). | Presupuesto Operativo |
| **Director de Obra** | Genera la **Solicitud de Pedido (SolPed)** basada en la programación semanal (Lookahead). | La SolPed debe estar vinculada obligatoriamente a un Centro de Costos y un ítem APU. | Requisición (SolPed) |
| **Sistema ERP** | Verifica disponibilidad presupuestal (Cantidad y Monto). | IF (Cant\_Solicitada \+ Cant\_Ejecutada) \> Cant\_Presupuestada THEN Block. | Alerta de Presupuesto |

#### **Fase 2: Abastecimiento y Negociación**

| Actor (Carril) | Actividad / Acción | Regla de Negocio / Control | Documento Generado |
| :---- | :---- | :---- | :---- |
| **Analista de Compras** | Revisa SolPed. Agrupa requerimientos de múltiples obras para economía de escala. Selecciona proveedores del Maestro. | Proveedor debe estar "Activo" y con documentos SARLAFT vigentes (\< 1 año). | Solicitud de Cotización (RFP) |
| **Comité de Compras** | Evalúa Cuadro Comparativo. Adjudica basado en TCO (Costo Total de Propiedad: Precio \+ Flete \+ Financiación). | Para montos \> X salarios mínimos, requiere aprobación de Junta Directiva del Consorcio. | Acta de Adjudicación |
| **Gerente de Compras** | Emite y firma la **Orden de Compra (OC)** o Contrato Marco. Incluye anexos técnicos (INVIAS/NTC) como parte integral. | La OC debe reflejar las condiciones de pago pactadas en la oferta. | Orden de Compra (OC) |

#### **Fase 3: Ejecución y Recepción (El Punto Crítico)**

| Actor (Carril) | Actividad / Acción | Regla de Negocio / Control | Documento Generado |
| :---- | :---- | :---- | :---- |
| **Proveedor** | Despacha material. Emite Remisión y Factura Electrónica. | La factura debe referenciar el número de OC en el campo \<OrderReference\> del XML. | Remisión \+ Factura XML |
| **Almacenista (Obra)** | Recibe vehículo. Realiza inspección visual y conteo físico. Ingresa datos en App Móvil (Offline). | Verificación ciega (no ver cantidad en remisión antes de contar). Foto obligatoria de la placa y carga. | Pre-Entrada |
| **Auditor de Calidad** | Ejecuta ensayos técnicos (Slump, Temperatura). Acepta o Rechaza técnicamente el lote. | Si el ensayo falla (ej. Concreto Slump \> Tolerancia), se bloquea la entrada en el sistema. | Reporte de Calidad |
| **Sistema ERP** | Genera la **Entrada de Mercancía (MIGO)** definitiva solo si Calidad \= Aprobado. | Conciliación automática 3-Way Match (OC vs. Entrada vs. Factura). | Documento de Material |

#### **Fase 4: Financiera y Pagos**

| Actor (Carril) | Actividad / Acción | Regla de Negocio / Control | Documento Generado |
| :---- | :---- | :---- | :---- |
| **Cuentas por Pagar** | Recibe lote de facturas validadas. Verifica retenciones (ReteFuente, ReteIVA, ReteGarantía). | Verificación de seguridad social del contratista (Parafiscales). | Causación Contable |
| **Tesorería** | Programa el pago según flujo de caja y vencimientos. Ejecuta dispersión de fondos. | Validación de cuenta bancaria destino (debe coincidir con certificado bancario del proveedor). | Comprobante de Egreso |
| **Contabilidad** | Emite Certificados de Retención y Certificación de Costos a Socios. | Cruce de cuentas de orden y validación de sumas iguales. | Certificado de Costos |

## ---

**4\. Profundización Técnica: Catálogo de Controles y Auditoría de Materiales**

La auditoría de obra en infraestructura no se hace desde el escritorio; se hace validando que las especificaciones técnicas del INVIAS y las Normas Técnicas Colombianas (NTC) se cumplan rigurosamente. A continuación, se presenta el catálogo detallado de controles para los insumos críticos.

### **4.1. Concreto Hidráulico (Estructural y Pavimentos)**

**Normativa Base:** INVIAS Artículo 630 / NTC 396 (Asentamiento) / NTC 3318 (Premezclado).

El concreto es un material perecedero y sensible. Su aceptación o rechazo determina la durabilidad de la estructura.

**Protocolo de Recepción:**

1. **Verificación Documental:** Revisión de la remisión de la mixer.  
   * *Hora de Cargue:* El tiempo transcurrido desde la adición de agua al cemento no debe exceder **1.5 horas** o 300 revoluciones del tambor, salvo uso de retardantes certificados.9 Si la mixer llega 2 horas después, el concreto ha iniciado su fraguado y debe ser rechazado.  
2. **Ensayo de Asentamiento (Slump) \- NTC 396:** Este es el control de campo más crítico para la aceptación inmediata.10  
   * *Equipo:* Cono de Abrams estandarizado (Base mayor 203mm, menor 102mm, altura 305mm ±3mm). Varilla compactadora punta hemisférica 16mm.  
   * *Procedimiento:* Llenado en 3 capas de igual volumen. 25 golpes por capa. Levantamiento vertical en 5 ± 2 segundos. Tiempo total del ensayo no mayor a 2.5 minutos.  
   * *Tolerancias de Aceptación (según diseño):*  
     * Si el Slump de diseño es \< 51 mm (2"): Tolerancia **± 13 mm**.  
     * Si el Slump es 51 mm \- 102 mm (2" \- 4"): Tolerancia **± 25 mm**.  
     * Si el Slump es \> 102 mm (4"): Tolerancia **± 38 mm**.  
   * *Acción de Auditoría:* Si el asentamiento está fuera de tolerancia, se permite **una (1)** sola repetición inmediata con la misma muestra. Si falla de nuevo, la mixer se rechaza y se devuelve a planta.  
   * *Prohibición de Retemplado:* Está estrictamente prohibido adicionar agua en sitio para aumentar el slump, ya que altera la relación Agua/Cemento y reduce la resistencia. Solo se permite aditivo superplastificante si está contemplado en el diseño de mezcla y supervisado por el tecnólogo.

### **4.2. Mezclas Asfálticas en Caliente (MDC)**

**Normativa Base:** INVIAS Artículo 450\.

El asfalto depende enteramente de la temperatura para su correcta colocación y compactación.

**Protocolo de Recepción:**

1. **Control de Temperatura (La Variable Crítica):**  
   * *Salida de Planta:* Entre 135°C y 160°C (para asfaltos convencionales 60-70).  
   * *Llegada a Obra:* La norma establece que la temperatura de llegada no debe ser inferior a la temperatura mínima de compactación establecida en el diseño Viscosidad-Temperatura, usualmente **\> 120°C**.12  
   * *Medición:* Termómetro digital de vástago largo, insertado al menos 15 cm en la masa de la mezcla en la volqueta (no en la superficie o "costra").  
   * *Acción:* Volquetas con temperatura \< 115°C-120°C deben rechazarse. Esa mezcla no se compactará adecuadamente, resultando en una carpeta porosa que fallará prematuramente.  
2. **Inspección Visual:**  
   * *Segregación:* Separación de los agregados gruesos de los finos. Indica problemas de cargue o transporte.  
   * *Escurrimiento de Asfalto (Draindown):* Exceso de asfalto en el fondo de la volqueta.  
3. **Muestreo:** Toma de muestras para extracción de asfalto (contenido de ligante) y granulometría en laboratorio. La tolerancia en el contenido de asfalto es de **± 0.3%** respecto al diseño.12

### **4.3. Maquinaria Amarilla y Control de Combustible**

**Riesgo:** Sobrecostos por horas no trabajadas y robo de combustible (sifoneo).

**Protocolo de Control y Auditoría:**

1. **Control de Horas:**  
   * *Horómetro vs. GPS:* No pagar basado en planillas manuales ("Partes Diarios") firmados por el operador sin validación. Se debe cruzar con el reporte telemétrico del GPS.  
   * *Definición de Hora:* Diferenciar claramente en el contrato:  
     * *Hora Máquina (HM):* Motor encendido trabajando.  
     * *Stand-by:* Máquina disponible pero parada por lluvia o falta de frente (tarifa reducida, usualmente 40-60%).  
2. **Auditoría de Combustible:**  
   * *Rendimiento:* Establecer líneas base de consumo (Galones/Hora) para cada equipo (ej. Excavadora 20T: 3.5 \- 4.5 gal/h).  
   * *Detección de Fraude:* Si una máquina reporta consumo de 6 gal/h consistentemente cuando el estándar es 4, hay robo o ineficiencia mecánica severa.  
   * *Sistemas de Control:* Instalación de sensores de nivel en tanques y anillas de seguridad en las tapas de combustible para evitar extracciones no autorizadas.15

### **4.4. Aceros y Prefabricados**

* **Acero de Refuerzo:** Validar el *Mill Certificate* (Certificado de Acería) contra la colada física (etiqueta y relieve en la barra). Verificar grado de oxidación superficial.  
* **Tubería:** Inspección de campanas y espigos. Rechazo de tubería PVC expuesta al sol (UV) por periodos prolongados (decoloración/cristalización).

## ---

**5\. Arquitectura Digital y Modelo de Datos (ERD)**

Para soportar la complejidad descrita, se propone un esquema de base de datos relacional que permita la integridad referencial y la auditoría forense.

### **5.1. Diagrama Entidad-Relación (ERD) \- Entidades Core**

1. **PROYECTO**  
   * PK\_Proyecto\_ID  
   * Nombre, Ubicación  
   * Tipo\_Estructura (Consorcio/UT)  
   * NIT\_Propio  
2. **SOCIOS\_CONSORCIO**  
   * PK\_Socio\_ID  
   * FK\_Proyecto\_ID  
   * Porcentaje\_Participación (Decimal)  
   * Responsabilidad\_Tributaria  
3. **PRESUPUESTO\_APU**  
   * PK\_APU\_ID  
   * FK\_Proyecto\_ID  
   * Codigo\_Item (ej. 4.1.2 Concreto 3000\)  
   * Descripcion  
   * Unidad\_Medida  
   * Cantidad\_Total\_Aprobada  
   * Precio\_Unitario\_Base  
4. **ORDEN\_COMPRA\_CABECERA**  
   * PK\_OC\_ID  
   * FK\_Proveedor\_ID  
   * FK\_Proyecto\_ID  
   * Fecha\_Emision  
   * Estado (Borrador, Aprobada, Cerrada, Anulada)  
   * Total\_Neto, Total\_IVA  
5. **ORDEN\_COMPRA\_DETALLE**  
   * PK\_OC\_Detalle\_ID  
   * FK\_OC\_ID  
   * FK\_APU\_ID (Vinculación estricta al presupuesto)  
   * Cantidad\_Pedida  
   * Precio\_Unitario\_Pactado  
   * Norma\_Tecnica\_Ref (ej. "INVIAS 630")  
6. **RECEPCION\_OBRA (Entrada de Almacén)**  
   * PK\_Recepcion\_ID  
   * FK\_OC\_ID  
   * Fecha\_Hora\_Registro (Timestamp)  
   * Geo\_Lat, Geo\_Lon (Coordenadas GPS de la App)  
   * Numero\_Remision\_Fisica  
   * Imagen\_Evidencia\_URL  
7. **CONTROL\_CALIDAD\_TEST**  
   * PK\_Test\_ID  
   * FK\_Recepcion\_ID  
   * Tipo\_Variable (Slump, Temp, Humedad)  
   * Valor\_Medido  
   * Resultado (Pasa/Falla)  
   * Usuario\_Auditor  
8. **FACTURA\_PROVEEDOR**  
   * PK\_Factura\_ID  
   * CUFE (Clave única DIAN)  
   * FK\_OC\_ID  
   * FK\_Recepcion\_ID (Three-Way Match)  
   * Estado\_RADIAN (Acuse, Recibo, Aceptada)

### **5.2. Motor de Reglas de Negocio (Business Rules Engine)**

El software debe implementar lógica restrictiva para evitar errores humanos y fraude:

* Regla de Sobregiro Presupuestal:  
  SI (Suma(Cantidad\_OC\_Anteriores) \+ Cantidad\_Actual) \> Cantidad\_APU\_Presupuesto ENTONCES Bloquear\_OC Y Requerir\_Aprobacion\_Gerencia\_Cambios  
* Regla de Tolerancia de Recepción:  
  SI (Cantidad\_Recibida \> Cantidad\_Pedida \* 1.05) ENTONCES Alerta\_Exceso\_Entrega (Tolerancia del 5% usual en graneles).  
* Regla de Bloqueo por Calidad:  
  SI (Resultado\_Test\_Calidad \== "Falla") ENTONCES Estado\_Recepcion \= "Rechazado\_Tecnico" Y Bloquear\_Pago  
* Regla de Validación Fiscal Consorcio:  
  SI (Proveedor \== Regimen\_Comun Y Consorcio \== Agente\_Retenedor) ENTONCES Calcular\_ReteFuente Y ReteIVA

## ---

**6\. Estrategia de Digitalización: Apps Offline-First y Entorno Multi-Proyecto**

### **6.1. El Desafío de la Conectividad en Obra**

Las obras de infraestructura (carreteras, líneas de transmisión) ocurren donde no hay señal celular. Un sistema de compras basado en la nube (100% online) fracasará en el punto de recepción, obligando al uso de papel y la digitación tardía.

### **6.2. Solución: Arquitectura "Offline-First"**

Se propone el despliegue de aplicaciones móviles para Almacenistas y Residentes con arquitectura de **Datos Locales Sincronizables**.17

**Flujo Técnico:**

1. **Sincronización Previa (Campamento/Wi-Fi):** Al inicio del turno, la tablet descarga la base de datos "ligera": Órdenes de Compra abiertas, proveedores y catálogo de materiales.  
2. **Operación Desconectada (Frente de Obra):**  
   * La App permite crear la "Entrada de Mercancía" usando la base de datos local (SQLite/Room).  
   * Permite tomar fotos y capturar firmas. Los datos se almacenan en el dispositivo encriptados.  
   * Valida reglas básicas (ej. no recibir más de lo pendiente en la OC).  
3. **Sincronización Posterior (Regreso a Campamento):**  
   * Al detectar red, la App sube ("Push") las transacciones al servidor central ERP.  
   * El servidor procesa, valida consistencia y genera los asientos contables.  
   * Manejo de Conflictos: Si una OC fue cerrada centralmente mientras el almacenista estaba desconectado, el sistema genera una alerta de "Conflicto de Sincronización" para resolución manual.

Esta arquitectura garantiza que la **realidad física** (lo que llegó a la obra) quede registrada en tiempo real (timestamp real), eliminando la brecha de días o semanas típica del reporte en papel.

## ---

**7\. Gestión de Riesgos y Fraude en Compras**

En el entorno de la construcción, el fraude no es una posibilidad, es una certeza si no hay controles.

### **7.1. Matriz de Riesgos y Controles (Mapa de Calor)**

| Riesgo Identificado | Nivel | Modalidad de Fraude / Error | Control Mitigante (Preventivo/Detectivo) |
| :---- | :---- | :---- | :---- |
| **Proveedor Fantasma / Fachada** | **Crítico** | Creación de empresas de papel para facturar servicios inexistentes o lavar activos. | Validación estricta de beneficiarios finales. Visita domiciliaria al proveedor. Auditoría de direcciones IP de envío de facturas. |
| **Colusión en Licitación** | **Alto** | Comprador acuerda precios con proveedores ("Carrousel"). | Exigencia de mínimo 3 cotizaciones cerradas. Rotación de compradores por categoría. Auditoría de metadatos de archivos de cotización (autoría). |
| **Material de Baja Calidad ("Cambiazo")** | **Alto** | Facturar Concreto 4000 PSI y entregar 3000 PSI. | Cilindros de prueba tomados por laboratorio independiente (no del proveedor). Comparación estadística de resistencias. |
| **Robo de Combustible** | **Alto** | Extracción de combustible de maquinaria o facturación de galonaje no entregado por el carro tanque. | Conciliación diaria: Combustible Suministrado vs. Horas Trabajadas vs. Consumo Teórico. Sensores de tanque. |
| **Facturación Doble (Consorcio)** | **Medio** | Proveedor cobra al Consorcio y luego intenta cobrar al Socio A por el mismo servicio. | Centralización de la recepción de facturas en el NIT del Consorcio. Cruce de cuentas por pagar entre socios. |
| **Alteración de Báscula** | **Medio** | Volquetas que entran con peso adulterado (lastre, agua en tanque) o báscula descalibrada. | Calibración mensual certificada de básculas. Cubicaje topográfico aleatorio de volquetas para cruzar volumen vs. peso.20 |

### **7.2. El Fraude en la Certificación de Costos**

Un riesgo específico de los Consorcios es la manipulación de la certificación de costos para beneficiar fiscalmente a uno de los socios (ej. asignar más costos al socio que tiene mayores utilidades para bajar su base gravable).

* **Mitigación:** La distribución de costos debe estar predefinida en el Acuerdo Consorcial (ej. proporcional a la participación o por asignación funcional de gastos). El sistema ERP debe bloquear asignaciones manuales discrecionales que violen la regla predefinida.

## ---

**8\. Indicadores Clave de Desempeño (KPIs)**

Para asegurar la mejora continua, se propone un tablero de mando (Dashboard) con los siguientes indicadores:

### **8.1. KPIs de Eficiencia Operativa**

* **OTIF (On Time, In Full):** % de pedidos entregados en la fecha requerida y con la cantidad completa. Meta \> 90%.  
* **Tiempo de Ciclo de Compra (Lead Time):** Días promedio entre la aprobación de la SolPed y la generación de la OC.  
* **Envejecimiento de Requisiciones:** Número de SolPeds con \> 15 días sin gestionar.

### **8.2. KPIs Financieros y de Control**

* **Variación de Precio (Price Variance):** Diferencia entre el Precio Presupuestado (APU) y el Precio Real de Compra.  
  * Variación \= (Precio\_Real \- Precio\_APU) \* Cantidad.  
  * Este KPI alerta sobre la erosión del margen del proyecto.  
* **Ahorro Negociado (Cost Avoidance):** Diferencia entre la primera cotización y el precio final negociado.  
* **Días de Cuentas por Pagar (DPO):** Promedio de días para pagar a proveedores. Mantener equilibrio para no asfixiar al proveedor ni perder liquidez.

### **8.3. KPIs Técnicos (Calidad)**

* **Tasa de Rechazo en Sitio:** % de viajes de concreto/asfalto rechazados por incumplimiento de norma (Slump/Temp). Meta \< 2%.  
* **Desviación Estándar de Resistencia:** Medida de la homogeneidad del concreto suministrado. Una desviación alta indica un proveedor con proceso fuera de control, incluso si cumple la resistencia media.

## ---

**9\. Conclusiones y Hoja de Ruta de Implementación**

### **9.1. Conclusiones**

La investigación confirma que la gestión de compras en consorcios de infraestructura no puede tratarse como un proceso administrativo estándar. La convergencia de la responsabilidad solidaria, la facturación electrónica estricta y las exigencias técnicas del INVIAS requiere un modelo operativo robusto, digitalizado y auditable. La separación entre la gestión técnica y la administrativa es la causa raíz de la mayoría de las pérdidas financieras; por tanto, la **integración del dato técnico (calidad) como llave del pago financiero** es la recomendación central de este informe.

### **9.2. Recomendaciones Estratégicas**

1. **Centralización Normativa, Descentralización Operativa:** Establecer políticas y contratos marco desde la casa matriz, pero dotar a las obras de herramientas *offline* para la ejecución ágil.  
2. **Cultura de "Título Valor":** Capacitar a los residentes y administrativos en la importancia de los eventos RADIAN. Entender que dar "Recibido" en el sistema tiene implicaciones legales irreversibles.  
3. **Auditoría Técnica Independiente:** No depender exclusivamente de los reportes de calidad del proveedor. La constructora debe tener su propio control (o laboratorio externo) para validar lo que paga.  
4. **Gestión de RCDs:** Integrar la gestión ambiental al pago. Exigir los certificados de disposición de escombros como requisito de pago para evitar sanciones ambientales que pueden paralizar la obra.21

### **9.3. Próximos Pasos (Roadmap)**

* **Mes 1:** Diagnóstico de brechas en el ERP actual y limpieza del Maestro de Proveedores y Materiales. Definición de reglas de negocio para Consorcios.  
* **Mes 2-3:** Implementación piloto de App Móvil de recepción (Offline) en una obra controlada. Configuración de validación automática de Factura Electrónica XML.  
* **Mes 4:** Despliegue masivo y capacitación a Residentes en normas NTC/INVIAS aplicadas a la recepción.  
* **Mes 6:** Auditoría de cierre del primer ciclo de certificación de costos bajo el nuevo modelo.

Este informe proporciona la base técnica, legal y operativa para transformar el área de compras de Contecsa en un generador de valor estratégico, mitigando los riesgos inherentes a la construcción de infraestructura en Colombia.

---

**Anexo: Referencias Normativas Clave**

* **INVIAS:** Especificaciones Generales de Construcción de Carreteras (2022). Artículos 450 (Asfalto), 630 (Concreto).  
* **ICONTEC:** NTC 396 (Asentamiento), NTC 3318 (Concreto Premezclado).  
* **DIAN:** Resolución 000165 de 2023 (Facturación Electrónica), Estatuto Tributario (Consorcios).  
* **MinAmbiente:** Resolución 472 de 2017 (Gestión de RCD).

#### **Works cited**

1. Facturación Electrónica en Consorcios y Uniones Temporales: Reglas DIAN 2025 (Boletín 27\) \- Fidelis Advisories, accessed December 22, 2025, [https://fidelisadvisories.com/2025/12/01/facturacion-electronica-en-consorcios-y-uniones-temporales-reglas-dian-2025-boletin-27/](https://fidelisadvisories.com/2025/12/01/facturacion-electronica-en-consorcios-y-uniones-temporales-reglas-dian-2025-boletin-27/)  
2. CONSORCIO Y UNIONES TEMPORALES – Formas de asumir riesgos \- CONSEJO DE ESTADO, accessed December 22, 2025, [https://www.consejodeestado.gov.co/documentos/boletines/PDF/25000-23-27-000-2003-02200-01(16883).pdf](https://www.consejodeestado.gov.co/documentos/boletines/PDF/25000-23-27-000-2003-02200-01\(16883\).pdf)  
3. Concepto 12073 de 2025 DIAN \- Compilación Jurídica de la DIAN, accessed December 22, 2025, [https://normograma.dian.gov.co/dian/compilacion/docs/oficio\_dian\_12073\_2025.htm](https://normograma.dian.gov.co/dian/compilacion/docs/oficio_dian_12073_2025.htm)  
4. Anexo 1.9 \- Yéminus, accessed December 22, 2025, [https://www.yeminus.com/anexo-1-9/](https://www.yeminus.com/anexo-1-9/)  
5. MODELO DE CERTIFICACIÓN PARA ACREDITAR LA CAPACIDAD DE ORGANIZACIÓN (Co) DE, accessed December 22, 2025, [https://ccamazonas.org.co/documentos/Modelosrup/MODELO%2018.pdf](https://ccamazonas.org.co/documentos/Modelosrup/MODELO%2018.pdf)  
6. Certificación a consorciados para efecto del impuesto a la renta \- Gerencie.com, accessed December 22, 2025, [https://www.gerencie.com/certificacion-a-consorciados-para-efecto-del-impuesto-a-la-renta.html](https://www.gerencie.com/certificacion-a-consorciados-para-efecto-del-impuesto-a-la-renta.html)  
7. Contabilización de contratos de colaboración empresarial \- YouTube, accessed December 22, 2025, [https://www.youtube.com/watch?v=xnBGjxYPXE8](https://www.youtube.com/watch?v=xnBGjxYPXE8)  
8. OFICIO 115-065694 DEL 22 DE AGOSTO DE 2012 \- Superintendencia de Sociedades, accessed December 22, 2025, [https://www.supersociedades.gov.co/documents/107391/159044/Oficio+115-065694.pdf/cc9e9d25-5cc2-1118-ddc7-a673e0e6ef5c?t=1670441023587\&download=true](https://www.supersociedades.gov.co/documents/107391/159044/Oficio+115-065694.pdf/cc9e9d25-5cc2-1118-ddc7-a673e0e6ef5c?t=1670441023587&download=true)  
9. 60 minutos y listo», el modelo que optimiza la entrega de concreto en tu obra \- Cementos Argos Colombia, accessed December 22, 2025, [https://colombia.argos.co/60-minutos-y-listo-el-modelo-que-optimiza-la-entrega-de-concreto-en-tu-obra/](https://colombia.argos.co/60-minutos-y-listo-el-modelo-que-optimiza-la-entrega-de-concreto-en-tu-obra/)  
10. Ensayo de asentamiento del concreto NTC 396 \- YouTube, accessed December 22, 2025, [https://www.youtube.com/watch?v=dRYweKPV3H0](https://www.youtube.com/watch?v=dRYweKPV3H0)  
11. Recepción y aceptación del concreto \- UMNG \- Facultad de estudios a distancia, accessed December 22, 2025, [http://virtual.umng.edu.co/distancia/ecosistema/ovas/ingenieria\_civil/tecnologia\_del\_concreto\_y\_laboratorio/unidad\_3/medios/documentacion/p5h4.php](http://virtual.umng.edu.co/distancia/ecosistema/ovas/ingenieria_civil/tecnologia_del_concreto_y_laboratorio/unidad_3/medios/documentacion/p5h4.php)  
12. Mezclas Asfálticas en Caliente INVÍAS | PDF | Hormigón | Cemento \- Scribd, accessed December 22, 2025, [https://es.scribd.com/document/523221567/Articulo-450-20-Vf-Copia](https://es.scribd.com/document/523221567/Articulo-450-20-Vf-Copia)  
13. tesis completa (Ing Doris)-2 \- Sired Udenar., accessed December 22, 2025, [https://sired.udenar.edu.co/14537/1/85032.pdf](https://sired.udenar.edu.co/14537/1/85032.pdf)  
14. 450 mezclas asfalticas en caliente de gradacion continua \- NORMAS Y ESPECIFICACIONES 2012 INVIAS, accessed December 22, 2025, [https://gerconcesion.co/invias2013/450%20MEZCLAS%20ASFALTICAS%20EN%20CALIENTE%20DE%20GRADACION%20CONTINUA.pdf](https://gerconcesion.co/invias2013/450%20MEZCLAS%20ASFALTICAS%20EN%20CALIENTE%20DE%20GRADACION%20CONTINUA.pdf)  
15. Robo de Combustible en Empresas \- Cómo Ocurre y Cómo Evitarlo \- ITK Soluciones, accessed December 22, 2025, [https://itksoluciones.com/es/robo-de-combustible/](https://itksoluciones.com/es/robo-de-combustible/)  
16. Maquinaria Pesada \- Control de Combustible \- ITK Soluciones, accessed December 22, 2025, [https://itksoluciones.com/es/control-de-combustible/maquinaria-pesada/](https://itksoluciones.com/es/control-de-combustible/maquinaria-pesada/)  
17. Building Construction Apps That Work Offline: Technical Implementation Guide, accessed December 22, 2025, [https://altersquare.medium.com/building-construction-apps-that-work-offline-technical-implementation-guide-3d07d7b9f40d](https://altersquare.medium.com/building-construction-apps-that-work-offline-technical-implementation-guide-3d07d7b9f40d)  
18. Offline-First Apps: Why Enterprises Are Prioritizing Data Sync Capabilities \- Octal IT Solution, accessed December 22, 2025, [https://www.octalsoftware.com/blog/offline-first-apps](https://www.octalsoftware.com/blog/offline-first-apps)  
19. Offline-first app explained – architecture and advantages \- Locize, accessed December 22, 2025, [https://www.locize.com/blog/offline-first-apps](https://www.locize.com/blog/offline-first-apps)  
20. Nuevo modus operandi de estafa: con materiales de construcción, engañan a clientes, accessed December 22, 2025, [https://www.youtube.com/watch?v=r98tibZqvK4](https://www.youtube.com/watch?v=r98tibZqvK4)  
21. concep\_230801\_025455-SITIOS-DISPOSICION-FINAL-DE-RESIDUOS-DE-CONSTRUCCION-Y-DEMOLICION-RCD.pdf \- Ministerio de Ambiente y Desarrollo Sostenible, accessed December 22, 2025, [https://www.minambiente.gov.co/wp-content/uploads/2024/09/concep\_230801\_025455-SITIOS-DISPOSICION-FINAL-DE-RESIDUOS-DE-CONSTRUCCION-Y-DEMOLICION-RCD.pdf](https://www.minambiente.gov.co/wp-content/uploads/2024/09/concep_230801_025455-SITIOS-DISPOSICION-FINAL-DE-RESIDUOS-DE-CONSTRUCCION-Y-DEMOLICION-RCD.pdf)