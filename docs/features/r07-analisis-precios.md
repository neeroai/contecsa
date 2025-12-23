# R7 - Análisis de Precios y Detección de Anomalías

Version: 1.0 | Date: 2025-12-22 23:00 | Priority: P1 CRITICAL | Status: Planned

---

## Overview

Sistema de detección automática de anomalías en precios de materiales de construcción para prevenir sobrecobros, fraudes y errores de facturación mediante análisis estadístico de histórico de precios, comparación con mercado y alertas en tiempo real.

**CRITICAL:** Feature nacida directamente del **Caso Cartagena** (3 facturas sobrecobro pasaron inadvertidas 2 meses). Prevención de pérdidas financieras es prioridad P1.

**Key Feature:** Alertas automáticas cuando precio >10% vs promedio histórico, validación cruzada con proveedores alternativos, notificación inmediata a Gerencia y Compras.

---

## Caso Cartagena - Análisis Crítico (Business Case)

### Qué Sucedió

**Fecha:** Primer trimestre 2025 (durante ausencia de Liced Vega)
**Material:** Concreto (cemento y agregados)
**Proveedor:** [Nombre omitido - confidencial]
**Facturas:** 3 facturas consecutivas con sobrecobro

**Detalles del Incidente:**
- Proveedor facturó concreto a precio **15-20% superior** al histórico
- Las 3 facturas fueron procesadas sin detección (proceso manual Excel)
- **Tiempo de detección:** 2 meses (60 días)
- **Monto total del sobrecobro:** ~$X millones COP (dato confidencial)
- Detección: Proveedor mismo emitió nota crédito (error contable interno de ellos)

### Por Qué Sucedió (Root Cause Analysis)

**Factores Contribuyentes:**

1. **Ausencia de Super Usuario (Liced Vega)**
   - Liced conoce precios de memoria (conocimiento tácito)
   - Sin Liced → Auxiliares procesan facturas sin validar precios
   - No hay backup con mismo nivel de conocimiento

2. **Proceso Manual Excel**
   - Sin histórico de precios digital accesible
   - Comparación manual (si se hace) toma 10-15 min por factura
   - Bajo presión → se omite validación de precios

3. **Volumen de Facturas**
   - 55 compras activas con múltiples entregas parciales
   - Contabilidad prioriza compliance DIAN sobre validación precios
   - Falta de tiempo para análisis profundo

4. **Relación con Proveedor**
   - Proveedor de confianza (relación larga)
   - Asunción: "proveedor conocido no nos cobraría de más"
   - Falta de verificación = error humano natural

5. **Variabilidad Natural de Precios**
   - Precios construcción fluctúan por:
     - Inflación (Colombia ~10-13% anual 2024-2025)
     - Precio petróleo (afecta transporte)
     - Disponibilidad de materiales (escasez → precio sube)
   - Difícil distinguir: ¿fluctuación normal o sobrecobro?

### Impacto del Incidente

**Financiero:**
- Sobrepago de ~$X millones COP (monto exacto confidencial)
- Nota crédito del proveedor (recuperado, pero 2 meses tarde)
- **Costo de oportunidad:** $X pudo usarse en otros materiales/proyectos

**Operacional:**
- Tiempo invertido en conciliación con proveedor (4-6 horas)
- Revisión manual retrospectiva de otras facturas (2 días de trabajo)
- Desconfianza temporal con proveedor (riesgo de cambiar proveedor)

**Reputacional:**
- Exposición de debilidad en controles internos
- Riesgo si hubiera sido fraude intencional (no detectado)
- Dependencia crítica de Liced Vega evidenciada

**Compliance:**
- Auditoría interna cuestionó controles de compras
- Gerencia pidió solución automatizada (origen de este proyecto)

### Lecciones Aprendidas

| Problema Identificado | Solución Implementada (R7) |
|-----------------------|----------------------------|
| Sin histórico de precios digital | Base de datos PostgreSQL con todos los precios (5 años) |
| Validación manual (lenta, omitida) | Validación automática en cada factura (OCR R4 → R7) |
| Conocimiento tácito en Liced | Sistema aprende patrones de precios (ML) |
| Sin alertas proactivas | Notificaciones inmediatas (R5) si precio >10% |
| Comparación difícil (Excel) | Dashboard visual (R2) con gráficas tendencia precios |
| Sin backup de Liced | Sistema 24/7, no depende de persona |

---

## Business Context

**Problem:**
- Precios materiales construcción varían 5-15% mensualmente (inflación, mercado)
- Sin herramienta → imposible detectar sobrecobros automáticamente
- Proceso manual Excel → validación se omite bajo presión
- Caso Cartagena demostró vulnerabilidad crítica

**Solution:**
Base de datos histórica de precios por material + proveedor + proyecto → Algoritmos estadísticos detectan outliers (precios anómalos >10% vs promedio) → Alertas automáticas a Gerencia + Compras + bloqueo de factura hasta revisión manual.

**Impact:**
- Prevención de sobrecobros (ROI: evitar 1 caso/año = $X millones)
- Reducción 95% tiempo validación precios (manual 15 min → automático 1 seg)
- Negociación informada con proveedores (datos históricos)
- Compliance auditoría interna (controles automatizados)

---

## User Stories

| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|---------------------|
| US7.1 | Compras | Recibir alerta inmediata si precio factura >10% vs histórico | - Email inmediato al procesar factura<br>- Alerta en dashboard<br>- Factura bloqueada hasta revisión |
| US7.2 | Gerencia | Ver gráfica tendencia precios por material (6 meses) | - Gráfica línea con precios mensuales<br>- Resaltar anomalías (puntos rojos)<br>- Comparar vs inflación COP |
| US7.3 | Compras | Comparar precio factura vs promedio 3 proveedores | - Sistema muestra: Proveedor A ($X), B ($Y), C ($Z)<br>- Resaltar si precio >10% vs más barato<br>- Sugerir proveedor alternativo |
| US7.4 | Contabilidad | Validar factura bloqueada por precio anómalo | - Ver razón del bloqueo<br>- Ver histórico de precios<br>- Aprobar/rechazar con justificación |
| US7.5 | Gerencia | Consultar AI agent sobre precios | - "¿Por qué subió precio cemento 15%?"<br>- Sistema explica: inflación, escasez, etc.<br>- Compara vs mercado nacional |

---

## Technical Approach

### Architecture

```
Invoice Processing (R4 OCR or manual entry)
  ↓
Extract: material, supplier, unit_price, quantity
  ↓
Price Anomaly Detection Service (R7)
  ├─→ Query historical prices (PostgreSQL)
  ├─→ Calculate baseline price (30/60/90 day windows)
  ├─→ Statistical outlier detection (Z-score, IQR)
  ├─→ Rule-based validation (>10% threshold)
  ├─→ Cross-supplier comparison (if available)
  └─→ Market data comparison (optional - external API)
  ↓
Anomaly Detection Result
  ├─→ NO ANOMALY → Process invoice normally
  └─→ ANOMALY DETECTED
        ├─→ Block invoice (status = BLOCKED_PRICE)
        ├─→ Send immediate alert (R5 Notifications)
        │   ├─→ Email: Jefe Compras, Gerencia
        │   ├─→ Dashboard: Red flag on invoice
        │   └─→ WhatsApp (future R13)
        └─→ Log event (audit trail)
  ↓
Manual Review (Compras or Contabilidad)
  ├─→ Review historical prices dashboard
  ├─→ Contact supplier (justification)
  ├─→ Decision: Approve override OR Reject invoice
  └─→ Log decision with justification
```

### Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Price Database | PostgreSQL (Vercel Postgres) | - Store 5+ years price history<br>- Fast queries (indexed)<br>- ACID compliance (audit) |
| Statistical Analysis | Python (NumPy, Pandas, SciPy) | - Z-score, IQR, moving averages<br>- Mature libraries<br>- Fast computation |
| Time Series | pandas + statsmodels | - Trend detection<br>- Seasonality analysis<br>- Forecast future prices (optional) |
| Visualization | Recharts or Tremor (frontend) | - Interactive price charts<br>- Highlight anomalies<br>- Responsive design |
| Alerts | Gmail API (R5) + Dashboard (R2) | - Immediate notification<br>- Visual dashboard flag<br>- SMS/WhatsApp (future) |
| ML (Optional) | scikit-learn (Isolation Forest) | - Unsupervised anomaly detection<br>- Learn normal price patterns<br>- Improve over time |

---

## Price History Database Schema

### Table: `price_history`

```sql
CREATE TABLE price_history (
  id UUID PRIMARY KEY,
  purchase_id UUID REFERENCES purchases(id),
  invoice_id UUID REFERENCES invoices(id),
  material_id UUID REFERENCES materials(id),
  material_name VARCHAR(255) NOT NULL,  -- "Cemento Argos 50kg", "Concreto 3000 PSI", etc.
  material_category VARCHAR(100),  -- "CEMENTO", "CONCRETO", "ACERO", etc.
  supplier_id UUID REFERENCES suppliers(id),
  supplier_name VARCHAR(255) NOT NULL,
  unit_price DECIMAL(15, 2) NOT NULL,  -- Price per unit (e.g., $/m³, $/ton, $/unit)
  currency VARCHAR(3) DEFAULT 'COP',
  quantity DECIMAL(15, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,  -- "m³", "ton", "kg", "unit"
  total_amount DECIMAL(15, 2) NOT NULL,  -- unit_price × quantity
  invoice_date DATE NOT NULL,
  project_id UUID REFERENCES projects(id),
  project_name VARCHAR(255),
  location VARCHAR(255),  -- City/region (price varies by location)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_price_entry UNIQUE (invoice_id, material_id)
);

-- Indexes for fast queries
CREATE INDEX idx_price_material ON price_history(material_id, invoice_date DESC);
CREATE INDEX idx_price_supplier ON price_history(supplier_id, invoice_date DESC);
CREATE INDEX idx_price_category ON price_history(material_category, invoice_date DESC);
CREATE INDEX idx_price_date ON price_history(invoice_date DESC);
```

### Table: `price_anomalies`

```sql
CREATE TABLE price_anomalies (
  id UUID PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id),
  price_history_id UUID REFERENCES price_history(id),
  anomaly_type VARCHAR(50) NOT NULL,  -- STATISTICAL_OUTLIER, THRESHOLD_EXCEEDED, SUPPLIER_MISMATCH
  severity VARCHAR(20) NOT NULL,  -- LOW, MEDIUM, HIGH, CRITICAL
  baseline_price DECIMAL(15, 2) NOT NULL,  -- Expected price (30-day average)
  actual_price DECIMAL(15, 2) NOT NULL,  -- Invoice price
  deviation_pct DECIMAL(5, 2) NOT NULL,  -- Percentage difference
  z_score DECIMAL(10, 4),  -- Statistical z-score (optional)
  detection_method VARCHAR(100),  -- Algorithm used (Z_SCORE, IQR, RULE_BASED)
  alert_sent BOOLEAN DEFAULT FALSE,
  alert_sent_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  resolution VARCHAR(50),  -- APPROVED_OVERRIDE, REJECTED_INVOICE, FALSE_POSITIVE
  resolution_notes TEXT,
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_anomalies_invoice ON price_anomalies(invoice_id);
CREATE INDEX idx_anomalies_severity ON price_anomalies(severity, detected_at DESC);
```

---

## Detection Algorithms

### 1. Baseline Price Calculation

**Method:** Calculate expected price using historical data

**Approaches:**

**A. Moving Average (Simple)**
```python
def calculate_baseline_price(
    material_id: str,
    supplier_id: str,
    window_days: int = 30
) -> float:
    """
    Calculate baseline price = average price last N days
    """
    query = """
        SELECT AVG(unit_price) as baseline
        FROM price_history
        WHERE material_id = %s
          AND supplier_id = %s
          AND invoice_date >= CURRENT_DATE - INTERVAL '%s days'
    """
    result = db.execute(query, (material_id, supplier_id, window_days))
    return result['baseline'] or 0.0
```

**B. Weighted Moving Average (Better)**
```python
def calculate_weighted_baseline(
    material_id: str,
    supplier_id: str,
    window_days: int = 60
) -> float:
    """
    More recent prices have higher weight
    Weight = 1 / (days_ago + 1)
    """
    prices = db.query("""
        SELECT
            unit_price,
            EXTRACT(DAY FROM CURRENT_DATE - invoice_date) as days_ago
        FROM price_history
        WHERE material_id = %s
          AND supplier_id = %s
          AND invoice_date >= CURRENT_DATE - INTERVAL '%s days'
        ORDER BY invoice_date DESC
    """, (material_id, supplier_id, window_days))

    if not prices:
        return 0.0

    weighted_sum = sum(p['unit_price'] / (p['days_ago'] + 1) for p in prices)
    weight_total = sum(1 / (p['days_ago'] + 1) for p in prices)

    return weighted_sum / weight_total if weight_total > 0 else 0.0
```

**C. Multi-Window Consensus (Best)**
```python
def calculate_consensus_baseline(
    material_id: str,
    supplier_id: str
) -> float:
    """
    Use multiple time windows and take median
    Reduces impact of recent anomalies
    """
    windows = [30, 60, 90]  # days
    baselines = []

    for window in windows:
        avg = calculate_baseline_price(material_id, supplier_id, window)
        if avg > 0:
            baselines.append(avg)

    if not baselines:
        return 0.0

    # Return median (more robust than mean)
    return sorted(baselines)[len(baselines) // 2]
```

---

### 2. Statistical Outlier Detection

**Method A: Z-Score (Standard Deviations)**

```python
from scipy import stats

def detect_outlier_zscore(
    actual_price: float,
    material_id: str,
    supplier_id: str,
    threshold: float = 2.0  # 2 std deviations = ~95% confidence
) -> dict:
    """
    Z-score = (actual_price - mean) / std_dev
    |Z| > 2.0 → Outlier (95% confidence)
    |Z| > 3.0 → Extreme outlier (99.7% confidence)
    """
    prices = db.query("""
        SELECT unit_price
        FROM price_history
        WHERE material_id = %s
          AND supplier_id = %s
          AND invoice_date >= CURRENT_DATE - INTERVAL '90 days'
    """, (material_id, supplier_id))

    if len(prices) < 10:  # Not enough data
        return {"is_outlier": False, "reason": "INSUFFICIENT_DATA"}

    price_values = [p['unit_price'] for p in prices]
    mean_price = np.mean(price_values)
    std_dev = np.std(price_values)

    if std_dev == 0:  # No variation (unusual but possible)
        return {"is_outlier": actual_price != mean_price}

    z_score = (actual_price - mean_price) / std_dev

    return {
        "is_outlier": abs(z_score) > threshold,
        "z_score": z_score,
        "mean_price": mean_price,
        "std_dev": std_dev,
        "deviation_pct": ((actual_price - mean_price) / mean_price) * 100,
        "severity": _classify_severity(abs(z_score))
    }

def _classify_severity(z_score: float) -> str:
    """Map z-score to severity level"""
    if z_score > 3.0:
        return "CRITICAL"  # >99.7% confidence
    elif z_score > 2.5:
        return "HIGH"      # >98% confidence
    elif z_score > 2.0:
        return "MEDIUM"    # >95% confidence
    else:
        return "LOW"
```

**Method B: IQR (Interquartile Range) - More Robust**

```python
def detect_outlier_iqr(
    actual_price: float,
    material_id: str,
    supplier_id: str
) -> dict:
    """
    IQR method is more robust to extreme values than Z-score
    Outlier if: price < Q1 - 1.5*IQR  OR  price > Q3 + 1.5*IQR
    """
    prices = db.query("""
        SELECT unit_price
        FROM price_history
        WHERE material_id = %s
          AND supplier_id = %s
          AND invoice_date >= CURRENT_DATE - INTERVAL '90 days'
        ORDER BY unit_price
    """, (material_id, supplier_id))

    if len(prices) < 10:
        return {"is_outlier": False, "reason": "INSUFFICIENT_DATA"}

    price_values = [p['unit_price'] for p in prices]
    q1 = np.percentile(price_values, 25)
    q3 = np.percentile(price_values, 75)
    iqr = q3 - q1

    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr

    is_outlier = actual_price < lower_bound or actual_price > upper_bound

    median_price = np.median(price_values)
    deviation_pct = ((actual_price - median_price) / median_price) * 100

    return {
        "is_outlier": is_outlier,
        "q1": q1,
        "q3": q3,
        "iqr": iqr,
        "lower_bound": lower_bound,
        "upper_bound": upper_bound,
        "median_price": median_price,
        "deviation_pct": deviation_pct,
        "severity": _classify_iqr_severity(deviation_pct)
    }

def _classify_iqr_severity(deviation_pct: float) -> str:
    """Map deviation % to severity"""
    abs_dev = abs(deviation_pct)
    if abs_dev > 30:
        return "CRITICAL"
    elif abs_dev > 20:
        return "HIGH"
    elif abs_dev > 10:
        return "MEDIUM"
    else:
        return "LOW"
```

---

### 3. Rule-Based Validation (Business Rules)

**Critical for Caso Cartagena Prevention**

```python
def validate_price_rules(
    actual_price: float,
    baseline_price: float,
    material_category: str,
    supplier_id: str
) -> dict:
    """
    Business rules defined by Contecsa (based on Caso Cartagena)
    """
    results = {
        "violations": [],
        "warnings": [],
        "severity": "NONE"
    }

    # RULE 1: Price increase >10% (Caso Cartagena threshold)
    deviation_pct = ((actual_price - baseline_price) / baseline_price) * 100

    if deviation_pct > 30:
        results["violations"].append({
            "rule": "PRICE_INCREASE_CRITICAL",
            "message": f"Precio +{deviation_pct:.1f}% vs promedio (>30% límite crítico)",
            "severity": "CRITICAL"
        })
        results["severity"] = "CRITICAL"

    elif deviation_pct > 15:
        results["violations"].append({
            "rule": "PRICE_INCREASE_HIGH",
            "message": f"Precio +{deviation_pct:.1f}% vs promedio (>15% límite alto)",
            "severity": "HIGH"
        })
        results["severity"] = "HIGH"

    elif deviation_pct > 10:
        results["warnings"].append({
            "rule": "PRICE_INCREASE_MEDIUM",
            "message": f"Precio +{deviation_pct:.1f}% vs promedio (>10% requiere revisión)",
            "severity": "MEDIUM"
        })
        if results["severity"] == "NONE":
            results["severity"] = "MEDIUM"

    # RULE 2: Price decrease >20% (possible error or quality issue)
    if deviation_pct < -20:
        results["warnings"].append({
            "rule": "PRICE_DECREASE_SUSPICIOUS",
            "message": f"Precio -{abs(deviation_pct):.1f}% vs promedio (verificar calidad material)",
            "severity": "MEDIUM"
        })

    # RULE 3: Zero or negative price (data entry error)
    if actual_price <= 0:
        results["violations"].append({
            "rule": "INVALID_PRICE",
            "message": "Precio inválido (≤0)",
            "severity": "CRITICAL"
        })
        results["severity"] = "CRITICAL"

    # RULE 4: Price outside market range (material-specific)
    market_ranges = {
        "CEMENTO": (25000, 45000),      # COP per 50kg bag
        "CONCRETO": (180000, 350000),   # COP per m³
        "ACERO": (3500000, 5500000),    # COP per ton
        "AGREGADOS": (45000, 85000),    # COP per m³
    }

    if material_category in market_ranges:
        min_price, max_price = market_ranges[material_category]
        if actual_price < min_price or actual_price > max_price:
            results["violations"].append({
                "rule": "PRICE_OUTSIDE_MARKET_RANGE",
                "message": f"Precio fuera de rango mercado (${min_price:,} - ${max_price:,})",
                "severity": "HIGH"
            })
            if results["severity"] in ["NONE", "MEDIUM"]:
                results["severity"] = "HIGH"

    # RULE 5: First purchase from new supplier (extra validation)
    purchase_count = db.scalar("""
        SELECT COUNT(*)
        FROM price_history
        WHERE supplier_id = %s
    """, (supplier_id,))

    if purchase_count == 0:
        results["warnings"].append({
            "rule": "NEW_SUPPLIER_VERIFICATION",
            "message": "Primera compra con este proveedor - verificar precio vs mercado",
            "severity": "MEDIUM"
        })

    return results
```

---

### 4. Cross-Supplier Comparison

**Detect if price is higher than alternative suppliers**

```python
def compare_supplier_prices(
    material_id: str,
    actual_supplier_id: str,
    actual_price: float,
    max_days_ago: int = 60
) -> dict:
    """
    Compare price vs other suppliers for same material
    """
    alternative_prices = db.query("""
        SELECT
            supplier_id,
            supplier_name,
            AVG(unit_price) as avg_price,
            COUNT(*) as purchase_count,
            MAX(invoice_date) as last_purchase_date
        FROM price_history
        WHERE material_id = %s
          AND supplier_id != %s
          AND invoice_date >= CURRENT_DATE - INTERVAL '%s days'
        GROUP BY supplier_id, supplier_name
        ORDER BY avg_price ASC
    """, (material_id, actual_supplier_id, max_days_ago))

    if not alternative_prices:
        return {
            "has_alternatives": False,
            "message": "No hay precios alternativos para comparar"
        }

    cheapest = alternative_prices[0]
    price_diff_pct = ((actual_price - cheapest['avg_price']) / cheapest['avg_price']) * 100

    return {
        "has_alternatives": True,
        "cheapest_supplier": cheapest['supplier_name'],
        "cheapest_price": cheapest['avg_price'],
        "actual_price": actual_price,
        "price_diff_pct": price_diff_pct,
        "is_overpriced": price_diff_pct > 10,
        "severity": "HIGH" if price_diff_pct > 20 else "MEDIUM" if price_diff_pct > 10 else "LOW",
        "alternatives": alternative_prices[:3],  # Top 3 cheapest
        "recommendation": f"Proveedor {cheapest['supplier_name']} ofrece {abs(price_diff_pct):.1f}% más barato"
            if price_diff_pct > 10 else "Precio competitivo"
    }
```

---

## Comprehensive Detection Function

**Main orchestration function combining all methods**

```python
async def detect_price_anomaly(
    invoice_id: str,
    material_id: str,
    supplier_id: str,
    unit_price: float,
    material_category: str
) -> dict:
    """
    Comprehensive price anomaly detection
    Combines: baseline, statistical, rules, cross-supplier
    """
    # 1. Calculate baseline price
    baseline = calculate_consensus_baseline(material_id, supplier_id)

    if baseline == 0:
        return {
            "anomaly_detected": False,
            "reason": "NO_BASELINE_DATA",
            "requires_manual_review": True
        }

    # 2. Statistical detection (Z-score + IQR)
    z_result = detect_outlier_zscore(unit_price, material_id, supplier_id)
    iqr_result = detect_outlier_iqr(unit_price, material_id, supplier_id)

    # 3. Rule-based validation
    rules_result = validate_price_rules(unit_price, baseline, material_category, supplier_id)

    # 4. Cross-supplier comparison
    supplier_comparison = compare_supplier_prices(material_id, supplier_id, unit_price)

    # 5. Combine results and determine final verdict
    anomaly_detected = (
        z_result.get("is_outlier", False) or
        iqr_result.get("is_outlier", False) or
        len(rules_result["violations"]) > 0 or
        supplier_comparison.get("is_overpriced", False)
    )

    # Determine overall severity (highest from all methods)
    severities = ["NONE", "LOW", "MEDIUM", "HIGH", "CRITICAL"]
    max_severity = max([
        z_result.get("severity", "NONE"),
        iqr_result.get("severity", "NONE"),
        rules_result.get("severity", "NONE"),
        supplier_comparison.get("severity", "NONE")
    ], key=lambda s: severities.index(s))

    result = {
        "anomaly_detected": anomaly_detected,
        "severity": max_severity,
        "baseline_price": baseline,
        "actual_price": unit_price,
        "deviation_pct": ((unit_price - baseline) / baseline) * 100,
        "detection_methods": {
            "z_score": z_result,
            "iqr": iqr_result,
            "rules": rules_result,
            "supplier_comparison": supplier_comparison
        },
        "requires_manual_review": max_severity in ["HIGH", "CRITICAL"],
        "recommended_action": _get_recommended_action(max_severity, rules_result)
    }

    # 6. Log anomaly if detected
    if anomaly_detected:
        await log_price_anomaly(invoice_id, result)

    # 7. Send alert if severity HIGH or CRITICAL
    if max_severity in ["HIGH", "CRITICAL"]:
        await send_price_alert(invoice_id, result)

    return result

def _get_recommended_action(severity: str, rules_result: dict) -> str:
    """Provide actionable recommendation"""
    if severity == "CRITICAL":
        return "BLOQUEAR FACTURA - Contactar proveedor inmediatamente para justificación"
    elif severity == "HIGH":
        return "RETENER FACTURA - Revisar con Jefe de Compras antes de aprobar"
    elif severity == "MEDIUM":
        return "ALERTA - Revisar histórico de precios y validar con proveedor"
    else:
        return "PROCESAR NORMALMENTE - Precio dentro de rango esperado"
```

---

## Alert System (Integration with R5)

**Immediate notification when anomaly detected**

```python
async def send_price_alert(invoice_id: str, anomaly_result: dict):
    """
    Send alerts via R5 notification system
    - Email: Jefe Compras, Gerencia
    - Dashboard: Red flag on invoice
    - SMS/WhatsApp (future)
    """
    invoice = await db.fetch_invoice(invoice_id)

    # Email template
    email_html = f"""
    <h2>ALERTA: Precio Anómalo Detectado</h2>

    <p><strong>Severidad:</strong> {anomaly_result['severity']}</p>

    <p><strong>Factura:</strong> {invoice['invoice_number']}<br>
    <strong>Proveedor:</strong> {invoice['supplier_name']}<br>
    <strong>Material:</strong> {invoice['material_name']}</p>

    <p><strong>Precio Facturado:</strong> ${anomaly_result['actual_price']:,} COP<br>
    <strong>Precio Promedio (60 días):</strong> ${anomaly_result['baseline_price']:,} COP<br>
    <strong>Desviación:</strong> {anomaly_result['deviation_pct']:+.1f}%</p>

    <h3>Detección:</h3>
    <ul>
        {''.join(f"<li>{v['message']}</li>" for v in anomaly_result['detection_methods']['rules']['violations'])}
    </ul>

    <p><strong>Acción Recomendada:</strong><br>
    {anomaly_result['recommended_action']}</p>

    <p><a href="https://app.contecsa.com/invoices/{invoice_id}">Ver Factura en Sistema</a></p>
    """

    # Send to recipients based on severity
    recipients = ["jefe.compras@contecsa.com"]
    if anomaly_result['severity'] in ["HIGH", "CRITICAL"]:
        recipients.append("gerencia@contecsa.com")

    for recipient in recipients:
        await send_email(
            to=recipient,
            subject=f"🔴 ALERTA: Precio Anómalo - {invoice['material_name']}",
            html=email_html
        )

    # Update invoice status
    await db.execute("""
        UPDATE invoices
        SET status = 'BLOCKED_PRICE_ANOMALY',
            blocked_reason = %s,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
    """, (anomaly_result['recommended_action'], invoice_id))

    # Create notification in database (for dashboard)
    await db.execute("""
        INSERT INTO notifications (user_id, type, title, message, severity, link)
        VALUES
            (%s, 'PRICE_ANOMALY', 'Precio Anómalo Detectado', %s, %s, %s)
    """, (
        invoice['created_by'],
        f"{invoice['material_name']} - Desviación {anomaly_result['deviation_pct']:+.1f}%",
        anomaly_result['severity'],
        f"/invoices/{invoice_id}"
    ))
```

---

## Dashboard Visualization (Integration with R2)

**Price Trend Chart Component**

```typescript
'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface PriceDataPoint {
  date: string;
  price: number;
  is_anomaly: boolean;
  supplier: string;
}

export function PriceTrendChart({ materialId }: { materialId: string }) {
  const [data, setData] = useState<PriceDataPoint[]>([]);
  const [baseline, setBaseline] = useState(0);

  useEffect(() => {
    fetch(`/api/prices/history?material_id=${materialId}&days=180`)
      .then(res => res.json())
      .then(result => {
        setData(result.data);
        setBaseline(result.baseline);
      });
  }, [materialId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia de Precios (6 meses)</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart width={800} height={400} data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Baseline (average price) */}
          <ReferenceLine
            y={baseline}
            stroke="#888"
            strokeDasharray="3 3"
            label="Promedio"
          />

          {/* +10% threshold (Caso Cartagena limit) */}
          <ReferenceLine
            y={baseline * 1.10}
            stroke="orange"
            strokeDasharray="3 3"
            label="+10%"
          />

          {/* +30% critical threshold */}
          <ReferenceLine
            y={baseline * 1.30}
            stroke="red"
            strokeDasharray="3 3"
            label="+30% CRÍTICO"
          />

          {/* Price line */}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={payload.is_anomaly ? 6 : 3}
                  fill={payload.is_anomaly ? 'red' : '#2563eb'}
                  stroke={payload.is_anomaly ? 'darkred' : 'none'}
                  strokeWidth={2}
                />
              );
            }}
          />
        </LineChart>

        {/* Anomalies list */}
        <div className="mt-4">
          <h4 className="font-semibold">Anomalías Detectadas:</h4>
          <ul className="text-sm space-y-1">
            {data.filter(d => d.is_anomaly).map((anomaly, i) => (
              <li key={i} className="text-red-600">
                {anomaly.date}: ${anomaly.price.toLocaleString()} (+
                {((anomaly.price - baseline) / baseline * 100).toFixed(1)}%) - {anomaly.supplier}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Manual Review Workflow

**When price anomaly detected (severity HIGH or CRITICAL):**

```
1. Invoice automatically BLOCKED (status = BLOCKED_PRICE_ANOMALY)
   ↓
2. Jefe Compras receives immediate email + dashboard alert
   ↓
3. Jefe Compras reviews:
   ├─→ Historical price chart (R2 dashboard)
   ├─→ Supplier comparison (alternative quotes)
   ├─→ Market data (if available)
   └─→ Invoice details + OCR extracted data (R4)
   ↓
4. Jefe Compras contacts supplier:
   ├─→ Email: "Factura X tiene precio +20% vs promedio. ¿Justificación?"
   └─→ Supplier responds: "Escasez material" or "Error facturación"
   ↓
5. Decision:
   ├─→ APPROVE OVERRIDE (with justification)
   │   ├─→ Log decision in audit trail
   │   ├─→ Unblock invoice (status = PENDING_APPROVAL)
   │   └─→ Notify Contabilidad (continue processing)
   │
   └─→ REJECT INVOICE
       ├─→ Return to supplier (request credit note)
       ├─→ Log rejection reason
       └─→ Notify Gerencia (financial impact avoided)
```

**Database Audit Trail:**

```sql
CREATE TABLE price_anomaly_resolutions (
  id UUID PRIMARY KEY,
  price_anomaly_id UUID REFERENCES price_anomalies(id),
  resolved_by UUID REFERENCES users(id),
  resolution VARCHAR(50) NOT NULL,  -- APPROVED_OVERRIDE, REJECTED, FALSE_POSITIVE
  justification TEXT NOT NULL,
  supplier_response TEXT,
  financial_impact DECIMAL(15, 2),  -- Amount saved if rejected
  resolved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Testing Strategy

### 1. Unit Tests

**Test baseline calculation accuracy:**
```python
def test_baseline_calculation():
    # Mock data: 30 days of prices
    mock_prices = [100, 102, 98, 101, 99, 103, 100, ...]  # 30 values

    baseline = calculate_consensus_baseline(material_id="cement", supplier_id="xyz")

    # Baseline should be close to 100 (±2%)
    assert 98 <= baseline <= 102
```

**Test anomaly detection (known cases):**
```python
def test_caso_cartagena_detection():
    """
    Simulate Caso Cartagena scenario
    Normal price: $100, Anomaly price: $120 (+20%)
    """
    # Setup: 60 days of normal prices (~$100)
    setup_price_history(material="concreto", prices=[98, 102, 99, 101, ...])

    # Test: Invoice with +20% price
    result = detect_price_anomaly(
        material_id="concreto",
        supplier_id="xyz",
        unit_price=120,
        material_category="CONCRETO"
    )

    # Assert: Anomaly detected with HIGH severity
    assert result['anomaly_detected'] == True
    assert result['severity'] in ['HIGH', 'CRITICAL']
    assert result['deviation_pct'] >= 15
```

**Test false positive prevention:**
```python
def test_seasonal_price_variation():
    """
    Ensure legitimate price increases (inflation) not flagged
    """
    # Setup: Gradual price increase (5% over 90 days)
    prices = [100 + (i * 0.05) for i in range(90)]  # 100 → 104.5
    setup_price_history(material="cement", prices=prices)

    # Test: Next purchase at $105 (consistent with trend)
    result = detect_price_anomaly(
        material_id="cement",
        supplier_id="xyz",
        unit_price=105,
        material_category="CEMENTO"
    )

    # Assert: No anomaly (within trend)
    assert result['anomaly_detected'] == False or result['severity'] == 'LOW'
```

---

### 2. Integration Tests

**Full flow: Invoice → Detection → Alert → Resolution**

```python
async def test_full_anomaly_flow():
    """
    E2E test: Upload invoice with anomalous price
    """
    # 1. Create invoice with OCR (R4)
    invoice = await create_invoice(
        invoice_number="FAC-001",
        material="Concreto 3000 PSI",
        unit_price=350000,  # 20% above normal (280000)
        supplier="Proveedor ABC"
    )

    # 2. Wait for price anomaly detection (async)
    await asyncio.sleep(2)

    # 3. Check anomaly logged
    anomaly = await db.fetch_one("""
        SELECT * FROM price_anomalies WHERE invoice_id = %s
    """, (invoice.id,))

    assert anomaly is not None
    assert anomaly['severity'] == 'HIGH'

    # 4. Check invoice blocked
    invoice = await db.fetch_invoice(invoice.id)
    assert invoice['status'] == 'BLOCKED_PRICE_ANOMALY'

    # 5. Check alert sent
    alert = await db.fetch_one("""
        SELECT * FROM notifications
        WHERE type = 'PRICE_ANOMALY'
          AND link LIKE %s
    """, (f"%{invoice.id}%",))

    assert alert is not None

    # 6. Simulate manual approval
    await resolve_price_anomaly(
        anomaly_id=anomaly['id'],
        user_id="jefe-compras-uuid",
        resolution="APPROVED_OVERRIDE",
        justification="Proveedor justificó: escasez cemento en región"
    )

    # 7. Check invoice unblocked
    invoice = await db.fetch_invoice(invoice.id)
    assert invoice['status'] != 'BLOCKED_PRICE_ANOMALY'
```

---

### 3. User Acceptance Tests (UAT)

**Test with real Contecsa users:**

1. **Compras:** Upload 10 real invoices (5 normal, 5 with anomalies)
   - Verify all 5 anomalies detected
   - Verify 0 false positives on normal invoices
   - Test manual review workflow (approve/reject)

2. **Gerencia:** Review price trend dashboard
   - Verify charts show historical data correctly
   - Verify anomalies highlighted in red
   - Test AI agent queries: "¿Por qué subió precio cemento?"

3. **Contabilidad:** Process blocked invoice
   - Verify cannot approve until price anomaly resolved
   - Verify notification received
   - Test override workflow

**Success Criteria:**
- 100% of anomalies >15% detected (no false negatives)
- <5% false positive rate (normal prices flagged)
- User satisfaction NPS >80 (Compras, Gerencia)
- Manual review time <10 min per anomaly

---

## Success Metrics (Caso Cartagena Prevention)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Anomaly Detection Rate** | 100% | % of anomalies >15% detected automatically |
| **False Positive Rate** | <5% | % normal prices flagged as anomalies |
| **Detection Time** | <1 min | From invoice upload to alert sent |
| **Resolution Time** | <24h | From alert to manual decision |
| **Financial Impact** | Prevent 1+ Caso Cartagena/year | Savings = $X million COP/year |
| **User Adoption** | 100% | % of price anomalies reviewed manually |
| **System Uptime** | 99.5% | % time detection system operational |

**ROI Calculation:**
- **Cost:** Development + maintenance ~$5M COP/year
- **Benefit:** Prevent 1 Caso Cartagena (~$X million) = ROI >500%

---

## Future Enhancements (Post-MVP)

1. **Machine Learning (Isolation Forest)**
   - Unsupervised anomaly detection (learn normal patterns)
   - Improve over time (fewer false positives)
   - Predict future price increases (early warning)

2. **External Market Data Integration**
   - DANE (Colombia national statistics) for inflation baseline
   - Competitor prices (if available via API)
   - Commodity prices (cement, steel, oil)

3. **Supplier Performance Scoring**
   - Track historical accuracy of prices
   - Flag "risky" suppliers (frequent anomalies)
   - Suggest alternative suppliers

4. **AI-Powered Justification Analysis**
   - LLM analyzes supplier's justification text
   - "Escasez regional" → Validate via news/DANE
   - "Aumento petróleo" → Cross-check oil prices

5. **Predictive Alerts**
   - "Precio cemento subirá 10% próximo mes (proyección)"
   - Suggest buying ahead if budget available

6. **WhatsApp Integration (R13)**
   - Immediate WhatsApp alert for CRITICAL anomalies
   - Approve/reject via WhatsApp (no need to open app)

---

## References

- **Caso Cartagena Analysis:** docs/meets/contecsa_meet_2025-12-22.txt (lines 45-78)
- **Business Context:** docs/business-context.md (Caso Cartagena section)
- **PRD Feature F07:** PRD.md (Price Anomaly Detection)
- **R2 Dashboard:** docs/features/r02-dashboard.md (Price trend visualization)
- **R4 OCR:** docs/features/r04-ocr-facturas.md (Invoice data extraction)
- **R5 Notifications:** docs/features/r05-notificaciones.md (Alert system)
- **R3 Purchase Tracking:** docs/features/r03-seguimiento-compras.md (Invoice validation gate)

---

**CRITICAL:** This feature is the HIGHEST PRIORITY after P0 features. Caso Cartagena demonstrated real financial risk. Implementation must be robust, tested extensively, and deployed ASAP after MVP core features.
