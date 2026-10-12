from fastapi.testclient import TestClient

from app.main import app
from app.database import get_db
from app.routes import restaurant as restaurant_routes
from app.routes import order as order_routes


def override_get_db():
    yield object()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def teardown_function():
    app.dependency_overrides.clear()


def test_list_restaurants_returns_results(monkeypatch):
    expected = {
        "items": [],
        "total": 0,
        "page": 1,
        "page_size": 20,
        "total_pages": 0,
    }
    monkeypatch.setattr(
        restaurant_routes, "get_restaurants", lambda **kwargs: expected
    )

    response = client.get("/api/admin/restaurants")

    assert response.status_code == 200
    assert response.json() == expected


def test_list_restaurants_rejects_invalid_page():
    response = client.get("/api/admin/restaurants?page=0")
    assert response.status_code == 422


def test_get_missing_restaurant_returns_404(monkeypatch):
    monkeypatch.setattr(
        restaurant_routes, "get_restaurant", lambda db, restaurant_id: None
    )

    response = client.get(
        "/api/admin/restaurants/b5794cba-6b8f-4231-a93a-07f32937d82d"
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Restaurant not found"


def test_list_orders_returns_results(monkeypatch):
    expected = {
        "items": [],
        "total": 0,
        "page": 1,
        "page_size": 20,
        "total_pages": 0,
    }
    monkeypatch.setattr(
        order_routes, "get_orders", lambda **kwargs: expected
    )

    response = client.get("/api/admin/orders")

    assert response.status_code == 200
    assert response.json() == expected


def test_list_orders_rejects_invalid_page_size():
    response = client.get("/api/admin/orders?page_size=101")
    assert response.status_code == 422


def test_get_missing_order_returns_404(monkeypatch):
    monkeypatch.setattr(
        order_routes, "get_order", lambda db, order_id: None
    )

    response = client.get("/api/admin/orders/999999999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Order not found"
