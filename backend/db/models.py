# models.py
from typing import Optional
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Date, Integer, Numeric

class Base(DeclarativeBase):
    pass

# ---------- gategroup.expirationdate_mgmt ----------
class ExpirationDateMgmt(Base):
    __tablename__ = "expirationdate_mgmt"
    __table_args__ = {"schema": "gategroup"}

    # En tu captura se veía product_id y lot_number destacados;
    # defino PK compuesta en ambos (ajústalo si tu DDL es distinto).
    product_id: Mapped[str]       = mapped_column(String, primary_key=True)
    product_name: Mapped[str]     = mapped_column(String)
    weight_or_volume: Mapped[str] = mapped_column(String)
    lot_number: Mapped[str]       = mapped_column(String, primary_key=True)
    expiry_date: Mapped[Optional[Date]] = mapped_column(Date)
    quantity: Mapped[int]         = mapped_column(Integer)

# ---------- gategroup.consumption_estimation ----------
class ConsumptionEstimation(Base):
    __tablename__ = "consumption_estimation"
    __table_args__ = {"schema": "gategroup"}

    # Campos según tu screenshot (algunos inferidos como texto / int4 / numeric)
    flight_id: Mapped[str]             = mapped_column(String, primary_key=True)
    origin: Mapped[Optional[str]]      = mapped_column(String)
    date: Mapped[Optional[Date]]       = mapped_column(Date)
    flight_type: Mapped[Optional[str]] = mapped_column(String)
    service_type: Mapped[Optional[str]] = mapped_column(String)
    passenger_count: Mapped[Optional[int]] = mapped_column(Integer)

    product_id: Mapped[Optional[str]]  = mapped_column(String)  # si quieres PK compuesta, pon primary_key=True
    product_name: Mapped[Optional[str]] = mapped_column(String)

    standard_specification_qty: Mapped[Optional[int]] = mapped_column(Integer)
    quantity_returned: Mapped[Optional[int]]         = mapped_column(Integer)
    quantity_consumed: Mapped[Optional[int]]         = mapped_column(Integer)
    unit_cost: Mapped[Optional[float]]               = mapped_column(Numeric(12, 2))
    crew_feedback: Mapped[Optional[str]]             = mapped_column(String)

# ---------- gategroup.drawers_import ----------
class DrawersImport(Base):
    __tablename__ = "drawers_import"
    __table_args__ = {"schema": "gategroup"}

    drawer_id: Mapped[str]             = mapped_column(String, primary_key=True)
    flight_type: Mapped[Optional[str]] = mapped_column(String)
    drawer_category: Mapped[Optional[str]] = mapped_column(String)
    total_items: Mapped[Optional[int]] = mapped_column(Integer)
    unique_item_types: Mapped[Optional[int]] = mapped_column(Integer)
    item_list: Mapped[Optional[str]]   = mapped_column(String)
