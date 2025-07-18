#backend/app/core/metrics.py
from prometheus_client import make_asgi_app, Counter, Histogram
from fastapi import Request, Response

REQUEST_COUNT = Counter(
    "api_request_count",
    "Número de peticiones recibidas",
    ["method", "endpoint", "http_status"],
)
REQUEST_LATENCY = Histogram(
    "api_request_latency_seconds",
    "Latencia de petición",
    ["method", "endpoint"],
)

def get_metrics_app():
    return make_asgi_app()

async def metrics_middleware(request: Request, call_next):
    method = request.method
    endpoint = request.url.path
    with REQUEST_LATENCY.labels(method, endpoint).time():
        response: Response = await call_next(request)
    REQUEST_COUNT.labels(method, endpoint, response.status_code).inc()
    return response
