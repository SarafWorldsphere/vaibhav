from unittest.mock import MagicMock

from fastapi.testclient import TestClient

from app.main import app
from app.database import get_db
from app.routes import restaurant as restaurant_routes
from app.routes import order as order_routes
from app.schemas.restaurant import RestaurantUpdate
from app.schemas.order import OrderUpdate
from app.services.restaurant import update_restaurant
from app.services.order import update_order


def override_get_db():
    yield object()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def teardown_function():
    app.dependency_overrides.clear()


def test_restaurant_page_size_maximum_is_accepted(monkeypatch):
    expected = {
        "items": [],
        "total": 0,
        "page": 1,
        "page_size": 100,
        "total_pages": 0,
    }
    monkeypatch.setattr(
        restaurant_routes, "get_restaurants", lambda **kwargs: expected
    )

    response = client.get("/api/admin/restaurants?page_size=100")

    assert response.status_code == 200
    assert response.json()["page_size"] == 100


def test_order_page_zero_is_rejected():
    response = client.get("/api/admin/orders?page=0")
    assert response.status_code == 422


def test_order_id_must_be_integer():
    response = client.get("/api/admin/orders/not-an-integer")
    assert response.status_code == 422


def test_restaurant_update_preserves_unspecified_fields():
    db = MagicMock()
    restaurant = MagicMock()
    restaurant.name = "Original Name"
    restaurant.city = "Original City"

    result = update_restaurant(
        db, restaurant, RestaurantUpdate(name="New Name")
    )

    assert result.name == "New Name"
    assert result.city == "Original City"
    db.commit.assert_called_once()


def test_order_update_preserves_unspecified_fields():
    db = MagicMock()
    order = MagicMock()
    order.order_status = "PLACED"
    order.rider_id = 12

    result = update_order(
        db, order, OrderUpdate(order_status="DELIVERED")
    )

    assert result.order_status == "DELIVERED"
    assert result.rider_id == 12
    db.commit.assert_called_once()
