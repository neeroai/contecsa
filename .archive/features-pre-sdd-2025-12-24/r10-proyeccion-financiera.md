# R10 - Proyección Financiera y Presupuesto

Version: 1.0 | Date: 2025-12-22 23:30 | Priority: P2 | Status: Planned

---

## Overview

Sistema de proyección financiera de gastos en materiales por proyecto con comparación presupuesto vs gasto real, alertas de sobreconsumo y forecast basado en histórico para optimizar flujo de caja y prevenir sobrecostos.

**Key Feature:** Dashboard ejecutivo con proyección de gasto mensual/trimestral, alertas si proyecto >10% sobre presupuesto, forecast ML basado en consumo histórico.

---

## Business Context

**Problem:**
- Sin visibilidad de gasto real vs presupuesto en tiempo real
- Proyectos terminan sobre presupuesto sin detección temprana
- Flujo de caja imprevisible (compras urgentes no planeadas)
- Gerencia sin herramienta para decisiones financieras (¿aprobar nueva compra?)

**Solution:**
Dashboard financiero integrado: Presupuesto inicial por proyecto → Gasto real acumulado → Proyección de gasto restante → Alertas si >10% sobre presupuesto → Forecast ML próximos 30/60/90 días.

**Impact:**
- Reducción 40% proyectos sobre presupuesto (detección temprana)
- Reducción 60% sorpresas de flujo de caja (proyección confiable)
- Mejora negociación con clientes (datos reales para cambios de alcance)

---

## User Stories

| ID | Actor | Story | Acceptance Criteria |
|----|-------|-------|---------------------|
| US10.1 | Gerencia | Ver presupuesto vs gasto real por proyecto | - Gráfica barras (presupuesto vs real)<br>- % consumido<br>- Gasto proyectado restante |
| US10.2 | Gerencia | Recibir alerta si proyecto >10% sobre presupuesto | - Email inmediato<br>- Dashboard alerta roja<br>- Desglose de sobrecosto por material |
| US10.3 | Gerencia | Consultar forecast de gasto próximo mes | - Proyección basada en consumo histórico<br>- Intervalo de confianza (min-max)<br>- Comparar vs presupuesto restante |
| US10.4 | Compras | Validar si compra cabe en presupuesto proyecto | - Input: monto compra<br>- Sistema valida vs presupuesto disponible<br>- Alerta si excede |
| US10.5 | Gerencia | Exportar reporte financiero a Sheets (mensual) | - Gasto por proyecto<br>- Gasto por material<br>- Comparación vs presupuesto |

---

## Technical Approach

### Architecture

```
Budget Setup (Gerencia/Admin)
  ├─→ Presupuesto inicial por proyecto (COP)
  └─→ Store in PostgreSQL
  ↓
Real-Time Spend Tracking
  ├─→ Each purchase → Add to project_spend
  ├─→ Compare vs budget → Calculate %
  └─→ If >110% → Trigger alert (R5)
  ↓
Forecast Engine (Python ML)
  ├─→ Historical consumption (6-12 months)
  ├─→ Linear regression or ARIMA (time series)
  ├─→ Predict next 30/60/90 days
  └─→ Return: projected_spend, confidence_interval
  ↓
Dashboard (R2)
  ├─→ Budget vs Actual chart
  ├─→ Forecast line chart
  └─→ Alert flags (red if >110%)
```

### Database Schema

```sql
CREATE TABLE project_budgets (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id) NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  total_budget_cop DECIMAL(15, 2) NOT NULL,
  budget_start_date DATE NOT NULL,
  budget_end_date DATE NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_spend (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  purchase_id UUID REFERENCES purchases(id),
  amount_cop DECIMAL(15, 2) NOT NULL,
  spend_date DATE NOT NULL,
  material_category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE VIEW project_financial_summary AS
SELECT
  pb.project_id,
  pb.project_name,
  pb.total_budget_cop,
  COALESCE(SUM(ps.amount_cop), 0) as total_spent,
  pb.total_budget_cop - COALESCE(SUM(ps.amount_cop), 0) as remaining_budget,
  (COALESCE(SUM(ps.amount_cop), 0) / pb.total_budget_cop) * 100 as pct_consumed
FROM project_budgets pb
LEFT JOIN project_spend ps ON pb.project_id = ps.project_id
GROUP BY pb.project_id, pb.project_name, pb.total_budget_cop;
```

### Forecast Function (Python)

```python
from statsmodels.tsa.arima.model import ARIMA
import numpy as np

def forecast_project_spend(project_id: str, days_ahead: int = 30) -> dict:
    """
    Forecast future spend using ARIMA time series model
    """
    # 1. Get historical spend (daily aggregation, last 180 days)
    historical = db.query("""
        SELECT
            spend_date,
            SUM(amount_cop) as daily_spend
        FROM project_spend
        WHERE project_id = %s
          AND spend_date >= CURRENT_DATE - INTERVAL '180 days'
        GROUP BY spend_date
        ORDER BY spend_date
    """, (project_id,))

    if len(historical) < 30:
        return {"error": "INSUFFICIENT_DATA", "min_required": 30}

    # 2. Prepare time series
    dates = [h['spend_date'] for h in historical]
    values = [h['daily_spend'] for h in historical]

    # 3. Fit ARIMA model (p=5, d=1, q=0)
    model = ARIMA(values, order=(5, 1, 0))
    fitted = model.fit()

    # 4. Forecast next N days
    forecast = fitted.forecast(steps=days_ahead)
    forecast_cumulative = np.cumsum(forecast)  # Daily → Cumulative

    # 5. Calculate confidence interval (95%)
    std_err = np.std(fitted.resid)
    ci_upper = forecast_cumulative + (1.96 * std_err * np.sqrt(np.arange(1, days_ahead+1)))
    ci_lower = forecast_cumulative - (1.96 * std_err * np.sqrt(np.arange(1, days_ahead+1)))

    return {
        "project_id": project_id,
        "forecast_days": days_ahead,
        "projected_spend": float(forecast_cumulative[-1]),
        "confidence_interval": {
            "lower": float(max(0, ci_lower[-1])),  # Can't be negative
            "upper": float(ci_upper[-1])
        },
        "daily_forecast": forecast.tolist()
    }
```

---

## References

- PRD Feature F10 (Proyección Financiera)
- R2 (Dashboard): docs/features/r02-dashboard.md
- R5 (Notifications): docs/features/r05-notificaciones.md
- R9 (Inventory): docs/features/r09-control-inventario.md
