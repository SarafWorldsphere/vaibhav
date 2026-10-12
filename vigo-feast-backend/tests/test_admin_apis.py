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

def test_create_restaurant_returns_201(monkeypatch):
    from datetime import datetime, timezone

    restaurant = {
        "id": "rest-test-001",
        "owner_id": "owner-test-001",
        "name": "Test Restaurant",
        "description": None,
        "latitude": None,
        "longitude": None,
        "phone": None,
        "email": None,
        "logo_url": None,
        "cover_image_url": None,
        "status": "ACTIVE",
        "is_active": True,
        "address_line1": "1 Test Street",
        "address_line2": None,
        "city": "Vizianagaram",
        "state": "Andhra Pradesh",
        "postal_code": "535001",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "is_deleted": False,
    }
    monkeypatch.setattr(
        restaurant_routes, "create_restaurant", lambda db, data: restaurant
    )

    response = client.post(
        "/api/admin/restaurants",
        json={
            "owner_id": "owner-test-001",
            "name": "Test Restaurant",
            "status": "ACTIVE",
            "is_active": True,
            "address_line1": "1 Test Street",
            "city": "Vizianagaram",
            "state": "Andhra Pradesh",
            "postal_code": "535001",
        },
    )

    assert response.status_code == 201
    assert response.json()["name"] == "Test Restaurant"


def test_update_restaurant_returns_200(monkeypatch):
    from datetime import datetime, timezone

    restaurant = {
        "id": "rest-test-001",
        "owner_id": "owner-test-001",
        "name": "Updated Restaurant",
        "description": None,
        "latitude": None,
        "longitude": None,
        "phone": None,
        "email": None,
        "logo_url": None,
        "cover_image_url": None,
        "status": "ACTIVE",
        "is_active": True,
        "address_line1": "1 Test Street",
        "address_line2": None,
        "city": "Vizianagaram",
        "state": "Andhra Pradesh",
        "postal_code": "535001",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "is_deleted": False,
    }
    monkeypatch.setattr(
        restaurant_routes, "get_restaurant", lambda db, restaurant_id: object()
    )
    monkeypatch.setattr(
        restaurant_routes, "update_restaurant", lambda db, current, data: restaurant
    )

    response = client.put(
        "/api/admin/restaurants/rest-test-001",
        json={"name": "Updated Restaurant"},
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Updated Restaurant"


def test_create_order_returns_201(monkeypatch):
    from datetime import datetime, timezone

    order = {
        "order_id": 101,
        "customer_id": 1,
        "rider_id": None,
        "restaurant_id": "rest-test-001",
        "order_status": "PLACED",
        "subtotal": 100.0,
        "gst_amount": 5.0,
        "delivery_charge": 10.0,
        "discount_amount": 0.0,
        "total_amount": 115.0,
        "cancellation_status": None,
        "delivery_eta": None,
        "offer_id": None,
        "franchisee_id": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "is_active": True,
        "is_deleted": False,
    }
    monkeypatch.setattr(
        order_routes, "create_order", lambda db, data: order
    )

    response = client.post(
        "/api/admin/orders",
        json={
            "customer_id": 1,
            "restaurant_id": "rest-test-001",
            "order_status": "PLACED",
            "subtotal": 100.0,
            "gst_amount": 5.0,
            "delivery_charge": 10.0,
            "discount_amount": 0.0,
            "total_amount": 115.0,
        },
    )

    assert response.status_code == 201
    assert response.json()["order_id"] == 101


def test_update_order_returns_200(monkeypatch):
    from datetime import datetime, timezone

    order = {
        "order_id": 101,
        "customer_id": 1,
        "rider_id": None,
        "restaurant_id": "rest-test-001",
        "order_status": "DELIVERED",
        "subtotal": 100.0,
        "gst_amount": 5.0,
        "delivery_charge": 10.0,
        "discount_amount": 0.0,
        "total_amount": 115.0,
        "cancellation_status": None,
        "delivery_eta": None,
        "offer_id": None,
        "franchisee_id": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "is_active": True,
        "is_deleted": False,
    }
    monkeypatch.setattr(
        order_routes, "get_order", lambda db, order_id: object()
    )
    monkeypatch.setattr(
        order_routes, "update_order", lambda db, current, data: order
    )

    response = client.put(
        "/api/admin/orders/101",
        json={"order_status": "DELIVERED"},
    )

    assert response.status_code == 200
    assert response.json()["order_status"] == "DELIVERED"
