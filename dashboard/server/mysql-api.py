"""
Product Engine — MySQL Performance API
FastAPI service that queries the remote MySQL database and returns JSON.
Run: uvicorn mysql-api:app --host 0.0.0.0 --port 8001
"""

import os
import sys

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pymysql
import pymysql.cursors
from contextlib import contextmanager
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

app = FastAPI(title="PE MySQL Performance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check required environment variables at startup
_REQUIRED_ENV = ["MYSQL_HOST", "MYSQL_USER", "MYSQL_PASSWORD"]
_missing = [v for v in _REQUIRED_ENV if not os.environ.get(v)]
if _missing:
    print(
        f"WARNING: Required environment variables not set: {', '.join(_missing)}. "
        "Database connections will fail. Set these variables before starting the server.",
        file=sys.stderr,
    )

DB_CONFIG = {
    "host": os.environ.get("MYSQL_HOST"),
    "port": int(os.environ.get("MYSQL_PORT", "3306")),
    "user": os.environ.get("MYSQL_USER"),
    "password": os.environ.get("MYSQL_PASSWORD"),
    "connect_timeout": 10,
    "ssl_disabled": os.environ.get("MYSQL_SSL", "false").lower() != "true",
    "database": os.environ.get("MYSQL_DATABASE", "system_travelapp"),
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor,
}

_REF: datetime | None = None


@contextmanager
def get_db():
    conn = pymysql.connect(**DB_CONFIG)
    try:
        yield conn
    finally:
        conn.close()


def get_ref(conn) -> datetime:
    """Get the most recent data date to use as reference instead of NOW()."""
    global _REF
    if _REF is not None:
        return _REF
    cur = conn.cursor()
    cur.execute("SELECT MAX(created) as max_date FROM requests")
    row = cur.fetchone()
    _REF = row["max_date"] if row and row["max_date"] else datetime.now()
    return _REF


def month_start(dt: datetime) -> str:
    return dt.replace(day=1, hour=0, minute=0, second=0).strftime("%Y-%m-%d %H:%M:%S")


def safe_float(val, default=0.0):
    if val is None:
        return default
    return round(float(val), 2)


def safe_int(val, default=0):
    if val is None:
        return default
    return int(val)


def calc_change(current, previous):
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return round((current - previous) / previous * 100, 2)


# ─── KPIs ────────────────────────────────────────────────────────────────────

@app.get("/mysql/kpis")
def get_kpis():
    with get_db() as conn:
        ref = get_ref(conn)
        cur = conn.cursor()

        this_month_start = month_start(ref)
        last_month_start = month_start(ref - relativedelta(months=1))
        two_months_ago_start = month_start(ref - relativedelta(months=2))

        # Total requests this month vs last month
        cur.execute(
            """SELECT
              COUNT(CASE WHEN created >= %s THEN 1 END) as this_month,
              COUNT(CASE WHEN created >= %s AND created < %s THEN 1 END) as last_month
            FROM requests WHERE created >= %s""",
            (this_month_start, last_month_start, this_month_start, two_months_ago_start),
        )
        totals = cur.fetchone()

        # Confirmed (status 1) this month vs last month
        cur.execute(
            """SELECT
              COUNT(CASE WHEN created >= %s AND request_status_id = 1 THEN 1 END) as this_month,
              COUNT(CASE WHEN created >= %s AND created < %s AND request_status_id = 1 THEN 1 END) as last_month
            FROM requests WHERE created >= %s""",
            (this_month_start, last_month_start, this_month_start, two_months_ago_start),
        )
        confirmed = cur.fetchone()

        # Average price this month vs last
        cur.execute(
            "SELECT AVG(price) as avg_price FROM requests WHERE request_status_id = 1 AND price > 0 AND created >= %s",
            (this_month_start,),
        )
        avg_this = cur.fetchone()

        cur.execute(
            "SELECT AVG(price) as avg_price FROM requests WHERE request_status_id = 1 AND price > 0 AND created >= %s AND created < %s",
            (last_month_start, this_month_start),
        )
        avg_last = cur.fetchone()

        total_this = safe_int(totals["this_month"])
        total_last = safe_int(totals["last_month"])
        conf_this = safe_int(confirmed["this_month"])
        conf_last = safe_int(confirmed["last_month"])

        conv_this = round((conf_this / total_this * 100), 2) if total_this > 0 else 0
        conv_last = round((conf_last / total_last * 100), 2) if total_last > 0 else 0

        # Cancellation rate
        ninety_days_ago = (ref - timedelta(days=90)).strftime("%Y-%m-%d %H:%M:%S")
        cur.execute(
            """SELECT
              COUNT(CASE WHEN request_status_id = 9 THEN 1 END) as cancelled,
              COUNT(CASE WHEN request_status_id = 1 THEN 1 END) as confirmed_count
            FROM requests WHERE created >= %s""",
            (ninety_days_ago,),
        )
        cancel_row = cur.fetchone()
        cancel_confirmed = safe_int(cancel_row["confirmed_count"])
        cancellation_rate = round(
            safe_int(cancel_row["cancelled"]) / cancel_confirmed * 100, 2
        ) if cancel_confirmed > 0 else 0

        avg_this_val = safe_float(avg_this["avg_price"])
        avg_last_val = safe_float(avg_last["avg_price"])

        return {
            "totalRequests": {
                "current": total_this,
                "previous": total_last,
                "change": calc_change(total_this, total_last),
            },
            "confirmedBookings": {
                "current": conf_this,
                "previous": conf_last,
                "change": calc_change(conf_this, conf_last),
            },
            "avgBookingValue": {
                "current": avg_this_val,
                "previous": avg_last_val,
                "change": calc_change(avg_this_val, avg_last_val),
            },
            "conversionRate": {
                "current": conv_this,
                "previous": conv_last,
                "change": calc_change(conv_this, conv_last),
            },
            "cancellationRate": cancellation_rate,
        }


# ─── Booking Velocity ────────────────────────────────────────────────────────

@app.get("/mysql/booking-velocity")
def get_booking_velocity(period: int = Query(30)):
    with get_db() as conn:
        ref = get_ref(conn)
        start = (ref - timedelta(days=int(period))).strftime("%Y-%m-%d %H:%M:%S")
        cur = conn.cursor()
        cur.execute(
            """SELECT DATE(created) as date, COUNT(*) as total,
              COUNT(CASE WHEN request_status_id = 1 THEN 1 END) as confirmed
            FROM requests WHERE created >= %s
            GROUP BY DATE(created) ORDER BY date""",
            (start,),
        )
        rows = cur.fetchall()
        return [
            {
                "date": row["date"].isoformat() if hasattr(row["date"], "isoformat") else str(row["date"]),
                "total": safe_int(row["total"]),
                "confirmed": safe_int(row["confirmed"]),
            }
            for row in rows
        ]


# ─── Market Breakdown ────────────────────────────────────────────────────────

@app.get("/mysql/market-breakdown")
def get_market_breakdown():
    with get_db() as conn:
        ref = get_ref(conn)
        start = (ref - timedelta(days=90)).strftime("%Y-%m-%d %H:%M:%S")
        cur = conn.cursor()
        cur.execute(
            """SELECT c.name as country, c.iso_alpha2, COUNT(*) as total,
              COUNT(CASE WHEN r.request_status_id = 1 THEN 1 END) as confirmed,
              AVG(CASE WHEN r.request_status_id = 1 AND r.price > 0 THEN r.price END) as avg_value
            FROM requests r
            JOIN clients cl ON r.client_id = cl.id
            JOIN countries c ON cl.country_id = c.id
            WHERE r.created >= %s
            GROUP BY c.id, c.name, c.iso_alpha2
            ORDER BY total DESC LIMIT 20""",
            (start,),
        )
        rows = cur.fetchall()
        return [
            {
                "country": row["country"],
                "iso": row["iso_alpha2"] or "",
                "total": safe_int(row["total"]),
                "confirmed": safe_int(row["confirmed"]),
                "avgValue": safe_float(row["avg_value"]),
                "conversionRate": round(
                    safe_int(row["confirmed"]) / safe_int(row["total"]) * 100, 1
                ) if safe_int(row["total"]) > 0 else 0,
            }
            for row in rows
        ]


# ─── Product Mix ─────────────────────────────────────────────────────────────

@app.get("/mysql/product-mix")
def get_product_mix():
    with get_db() as conn:
        ref = get_ref(conn)
        start = (ref - timedelta(days=90)).strftime("%Y-%m-%d %H:%M:%S")
        cur = conn.cursor()
        cur.execute(
            """SELECT rt.title as product_type, COUNT(*) as total,
              COUNT(CASE WHEN r.request_status_id = 1 THEN 1 END) as confirmed,
              AVG(CASE WHEN r.request_status_id = 1 AND r.price > 0 THEN r.price END) as avg_value
            FROM requests r
            JOIN request_types rt ON r.request_type_id = rt.id
            WHERE r.created >= %s
            GROUP BY rt.id, rt.title
            ORDER BY total DESC LIMIT 15""",
            (start,),
        )
        rows = cur.fetchall()
        return [
            {
                "productType": row["product_type"],
                "total": safe_int(row["total"]),
                "confirmed": safe_int(row["confirmed"]),
                "avgValue": safe_float(row["avg_value"]),
            }
            for row in rows
        ]


# ─── Destination Mix ─────────────────────────────────────────────────────────

@app.get("/mysql/destination-mix")
def get_destination_mix():
    with get_db() as conn:
        ref = get_ref(conn)
        start = (ref - timedelta(days=90)).strftime("%Y-%m-%d %H:%M:%S")
        cur = conn.cursor()
        cur.execute(
            """SELECT c.name as destination, COUNT(*) as total,
              COUNT(CASE WHEN r.request_status_id = 1 THEN 1 END) as confirmed
            FROM requests r
            JOIN tr_requests_destinations rd ON r.id = rd.request_id
            JOIN countries c ON rd.country_id = c.id
            WHERE r.created >= %s
            GROUP BY c.id, c.name
            ORDER BY total DESC LIMIT 25""",
            (start,),
        )
        rows = cur.fetchall()
        return [
            {
                "destination": row["destination"],
                "total": safe_int(row["total"]),
                "confirmed": safe_int(row["confirmed"]),
            }
            for row in rows
        ]


# ─── Booking Funnel ──────────────────────────────────────────────────────────

@app.get("/mysql/booking-funnel")
def get_booking_funnel():
    with get_db() as conn:
        ref = get_ref(conn)
        start = (ref - timedelta(days=30)).strftime("%Y-%m-%d %H:%M:%S")
        cur = conn.cursor()
        cur.execute(
            """SELECT rs.title as status, COUNT(*) as count
            FROM requests r
            JOIN request_statuses rs ON r.request_status_id = rs.id
            WHERE r.created >= %s
            GROUP BY rs.id, rs.title
            ORDER BY count DESC""",
            (start,),
        )
        rows = cur.fetchall()
        total = sum(safe_int(r["count"]) for r in rows)
        return [
            {
                "status": row["status"],
                "count": safe_int(row["count"]),
                "percentage": round(safe_int(row["count"]) / total * 100, 1) if total > 0 else 0,
            }
            for row in rows
        ]


# ─── Monthly Trends ──────────────────────────────────────────────────────────

@app.get("/mysql/monthly-trends")
def get_monthly_trends(months: int = Query(12)):
    with get_db() as conn:
        ref = get_ref(conn)
        start = (ref - relativedelta(months=int(months))).strftime("%Y-%m-%d %H:%M:%S")
        cur = conn.cursor()
        cur.execute(
            """SELECT DATE_FORMAT(created, '%%Y-%%m') as month,
              COUNT(*) as total_requests,
              COUNT(CASE WHEN request_status_id = 1 THEN 1 END) as confirmed,
              SUM(CASE WHEN request_status_id = 1 AND price > 0 THEN price ELSE 0 END) as revenue
            FROM requests WHERE created >= %s
            GROUP BY DATE_FORMAT(created, '%%Y-%%m')
            ORDER BY month""",
            (start,),
        )
        rows = cur.fetchall()
        return [
            {
                "month": row["month"],
                "totalRequests": safe_int(row["total_requests"]),
                "confirmed": safe_int(row["confirmed"]),
                "revenue": safe_float(row["revenue"]),
            }
            for row in rows
        ]


# ─── Website Sources ─────────────────────────────────────────────────────────

@app.get("/mysql/website-sources")
def get_website_sources():
    with get_db() as conn:
        ref = get_ref(conn)
        start = (ref - timedelta(days=90)).strftime("%Y-%m-%d %H:%M:%S")
        cur = conn.cursor()
        cur.execute(
            """SELECT domain_title as brand, COUNT(*) as total,
              COUNT(CASE WHEN request_status_id = 1 THEN 1 END) as confirmed
            FROM requests
            WHERE created >= %s AND domain_title IS NOT NULL AND domain_title != ''
            GROUP BY domain_title
            ORDER BY total DESC LIMIT 10""",
            (start,),
        )
        rows = cur.fetchall()
        return [
            {
                "brand": row["brand"],
                "total": safe_int(row["total"]),
                "confirmed": safe_int(row["confirmed"]),
                "conversionRate": round(
                    safe_int(row["confirmed"]) / safe_int(row["total"]) * 100, 1
                ) if safe_int(row["total"]) > 0 else 0,
            }
            for row in rows
        ]


# ─── Ratings Summary ─────────────────────────────────────────────────────────

@app.get("/mysql/ratings-summary")
def get_ratings_summary():
    with get_db() as conn:
        cur = conn.cursor()
        cur.execute("SELECT MAX(created) as max_date FROM clients_ratings")
        rating_ref_row = cur.fetchone()
        rating_ref = rating_ref_row["max_date"] if rating_ref_row and rating_ref_row["max_date"] else get_ref(conn)
        start = (rating_ref - timedelta(days=90)).strftime("%Y-%m-%d %H:%M:%S")

        cur.execute(
            """SELECT AVG(rate) as avg_rating, COUNT(*) as total_ratings,
              COUNT(CASE WHEN rate >= 4 THEN 1 END) as positive,
              COUNT(CASE WHEN rate <= 2 THEN 1 END) as negative
            FROM clients_ratings WHERE created >= %s""",
            (start,),
        )
        row = cur.fetchone()
        return {
            "avgRating": safe_float(row["avg_rating"]),
            "totalRatings": safe_int(row["total_ratings"]),
            "positive": safe_int(row["positive"]),
            "negative": safe_int(row["negative"]),
            "satisfactionRate": round(
                safe_int(row["positive"]) / safe_int(row["total_ratings"]) * 100, 1
            ) if safe_int(row["total_ratings"]) > 0 else 0,
        }


# ─── Health check ────────────────────────────────────────────────────────────

@app.get("/mysql/health")
def health():
    try:
        with get_db() as conn:
            cur = conn.cursor()
            cur.execute("SELECT 1")
            return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
