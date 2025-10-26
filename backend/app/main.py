# main.py
from __future__ import annotations

import os
import json
import re
from typing import Any, Dict, List

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError
from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession

# ── DB deps ───────────────────────────────────────────────────────────────
from db.db import get_session
from db.models import ExpirationDateMgmt, ConsumptionEstimation, DrawersImport  # noqa: F401

# ── Gemini (FREE TIER via Google AI Studio) ───────────────────────────────
import google.generativeai as genai

# ── CONFIG ────────────────────────────────────────────────────────────────
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")  # free-tier

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="Hackaton DB + Gemini API", version="1.0")

# ── CORS (ajusta si usas otro puerto/origen) ─────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────────────────────────────────
#                               ENDPOINTS BASE
# ──────────────────────────────────────────────────────────────────────────

@app.get("/health")
async def health(session: AsyncSession = Depends(get_session)):
    db_now = (await session.execute(select(func.now()))).scalar_one()
    return {
        "ok": True,
        "db_time": str(db_now),
        "gemini_model": GEMINI_MODEL,
        "gemini_key_loaded": bool(GEMINI_API_KEY),
    }

# =============== GEMINI: /ask (respuesta libre) ===========================
class AskBody(BaseModel):
    question: str

@app.post("/ask")
def ask_gemini(body: AskBody):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=400, detail="Falta GEMINI_API_KEY en .env")
    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        resp = model.generate_content(body.question)
        return {"answer": getattr(resp, "text", "")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini error: {e}")

# =============== DB: ExpirationDateMgmt ===================================
class ExpItem(BaseModel):
    product_id: str
    product_name: str
    weight_or_volume: str
    lot_number: str
    expiry_date: str | None
    quantity: int

@app.get("/expiration", response_model=list[ExpItem])
async def list_expiration(limit: int = 50, session: AsyncSession = Depends(get_session)):
    q = await session.execute(select(ExpirationDateMgmt).limit(limit))
    rows = q.scalars().all()
    return [
        ExpItem(
            product_id=r.product_id,
            product_name=r.product_name,
            weight_or_volume=r.weight_or_volume,
            lot_number=r.lot_number,
            expiry_date=r.expiry_date.isoformat() if r.expiry_date else None,
            quantity=r.quantity,
        )
        for r in rows
    ]

@app.get("/expiration/expiring-soon", response_model=list[ExpItem])
async def expiring_soon(days: int = 30, session: AsyncSession = Depends(get_session)):
    q = await session.execute(
        select(ExpirationDateMgmt)
        .where(text("expiry_date <= CURRENT_DATE + (:d || ' days')::interval")).params(d=days)
        .order_by(ExpirationDateMgmt.expiry_date.asc())
    )
    rows = q.scalars().all()
    return [
        ExpItem(
            product_id=r.product_id,
            product_name=r.product_name,
            weight_or_volume=r.weight_or_volume,
            lot_number=r.lot_number,
            expiry_date=r.expiry_date.isoformat() if r.expiry_date else None,
            quantity=r.quantity,
        )
        for r in rows
    ]

# =============== DB: DrawersImport (ejemplo) ==============================
@app.get("/drawers/count")
async def drawers_count(session: AsyncSession = Depends(get_session)):
    q = await session.execute(select(func.count()).select_from(DrawersImport))
    return {"count": q.scalar_one()}

# ──────────────────────────────────────────────────────────────────────────
#                           CHAT → WIDGETS (GEMINI)
# ──────────────────────────────────────────────────────────────────────────
# El ChatPanel envía el input aquí. Gemini genera números y el backend
# devuelve el arreglo `widgets` exactamente como espera el DashboardDynamic.

# ---------- util para limpiar JSON del LLM ----------
JSON_OBJECT_RE = re.compile(r"\{.*\}", re.DOTALL)

def _extract_json(text: str) -> Dict[str, Any]:
    """
    Intenta parsear JSON directo; si viene con fences ```json ...``` o texto extra,
    recorta entre el primer '{' y el último '}'.
    """
    text = (text or "").strip()
    # 1) si ya es JSON válido
    try:
        return json.loads(text)
    except Exception:
        pass
    # 2) elimina fences
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.IGNORECASE | re.MULTILINE).strip()
    # 3) bloque { ... }
    m = JSON_OBJECT_RE.search(text)
    if not m:
        raise ValueError("No se pudo extraer un objeto JSON del output de Gemini.")
    return json.loads(m.group(0))

# ---------- esquema intermedio que generará Gemini ----------
class LineSeries(BaseModel):
    labels: List[str]
    optimo: List[float]
    real: List[float]

class CobranzaSeries(BaseModel):
    labels: List[str]
    values: List[float]

class RawMetrics(BaseModel):
    potentialGain: float = Field(..., description="Monto de ganancia potencial")
    line: LineSeries
    cobranza: CobranzaSeries
    # opcional: tabla de sustento
    tableRows: List[Dict[str, Any]] | None = None  # filas libres

class ChatRequest(BaseModel):
    message: str

# ---------- salida FINAL (lo que espera DashboardDynamic) ----------
class WidgetInput(BaseModel):
    id: str
    type: str
    title: str
    value: float | None = None
    data: List[Dict[str, Any]] | None = None
    xKey: str | None = None
    series: List[Dict[str, str]] | None = None
    columns: List[Dict[str, str]] | None = None

class WidgetsResponse(BaseModel):
    reply: str
    widgets: List[WidgetInput]

@app.post("/chat", response_model=WidgetsResponse, response_model_exclude_none=True)
def chat_endpoint(body: ChatRequest):
    """
    Recibe el input del ChatPanel (body.message),
    pide a Gemini que GENERE datos plausibles,
    y devuelve `widgets` en el shape exacto de DashboardDynamic.
    """
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=400, detail="Falta GEMINI_API_KEY en .env")

    system_prompt = """
Eres un asistente de analítica. Responde SOLO con JSON válido.
Genera datos plausibles para un dashboard financiero en MXN con este ESQUEMA EXACTO:

{
  "reply": string,
  "metrics": {
    "potentialGain": number,
    "line": {
      "labels": ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
      "optimo": number[12],
      "real": number[12]
    },
    "cobranza": {
      "labels": string[4..8],
      "values": number[=labels]
    },
    "tableRows": [
      { "concepto": string, "monto": number, "mes": string }
    ]
  }
}

Reglas:
- Responde EXCLUSIVAMENTE el JSON (sin markdown ni texto adicional).
- Montos no negativos y realistas.
- Los arrays deben tener longitudes coherentes (12 meses; regiones=valores).
"""

    try:
        model = genai.GenerativeModel(
            GEMINI_MODEL,
            generation_config={
                # si tu SDK lo soporta, fuerza JSON
                "response_mime_type": "application/json"
            },
        )
        # El mensaje del usuario viene de ChatPanel (input)
        user_msg = body.message.strip()
        resp = model.generate_content([system_prompt, f"Usuario: {user_msg}"])
        raw_text = getattr(resp, "text", "") or ""
        data = _extract_json(raw_text)

        # validamos el shape intermedio
        if "metrics" not in data:
            raise HTTPException(status_code=500, detail="Gemini no devolvió el campo 'metrics'.")
        raw_metrics = RawMetrics.model_validate(data["metrics"])
        reply = str(data.get("reply") or "OK")

        # ---- mapeo a widgets que exige tu DashboardDynamic ----

        # KPI
        kpi = WidgetInput(
            id="k1", type="kpi", title="Ganancia Potencial",
            value=float(raw_metrics.potentialGain)
        )

        # LINE: construir data = [{x, real, opt}, ...]
        line_data: List[Dict[str, Any]] = []
        labels = raw_metrics.line.labels
        for i, label in enumerate(labels):
            real_val = float(raw_metrics.line.real[i]) if i < len(raw_metrics.line.real) else 0.0
            opt_val  = float(raw_metrics.line.optimo[i]) if i < len(raw_metrics.line.optimo) else 0.0
            line_data.append({"x": label, "real": real_val, "opt": opt_val})

        line = WidgetInput(
            id="l1", type="line", title="Óptimo vs Real",
            data=line_data, xKey="x", series=[{"key": "real"}, {"key": "opt"}]
        )

        # BAR: construir data = [{x, p}, ...]
        bar_data: List[Dict[str, Any]] = []
        for i, label in enumerate(raw_metrics.cobranza.labels):
            val = float(raw_metrics.cobranza.values[i]) if i < len(raw_metrics.cobranza.values) else 0.0
            bar_data.append({"x": label, "p": val})

        bar = WidgetInput(
            id="b1", type="bar", title="Cobranza",
            data=bar_data, xKey="x", series=[{"key": "p"}]
        )

        # TABLE (opcional)
        table_widget: WidgetInput | None = None
        if raw_metrics.tableRows:
            table_widget = WidgetInput(
                id="t1", type="table", title="Sustento",
                data=raw_metrics.tableRows,
                columns=[
                    {"key": "concepto", "label": "Concepto"},
                    {"key": "monto", "label": "Monto"},
                    {"key": "mes", "label": "Mes"},
                ],
            )

        widgets: List[WidgetInput] = [kpi, line, bar] + ([table_widget] if table_widget else [])

        return WidgetsResponse(reply=reply, widgets=widgets)

    except ValidationError as ve:
        raise HTTPException(status_code=500, detail=f"JSON inválido de Gemini: {ve}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini error: {e}")
