from unittest.mock import MagicMock

from app.schemas.restaurant import RestaurantCreate, RestaurantUpdate
from app.schemas.order import OrderCreate, OrderUpdate
from app.services.restaurant import create_restaurant, update_restaurant
from app.services.order import create_order, update_order


def test_create_restaurant_commits_and_returns_record():
    db = MagicMock()
    data = RestaurantCreate(
        owner_id="owner-test",
        name="Test Restaurant",
        status="PENDING",
        is_active=True,
        address_line1="1 Test Street",
        city="Test City",
        state="Test State",
        postal_code="000001",
    )

    result = create_restaurant(db, data)

    db.add.assert_called_once()
    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(result)
    assert result.name == "Test Restaurant"
    assert result.is_deleted is False


def test_update_restaurant_changes_only_provided_fields():
    db = MagicMock()
    restaurant = MagicMock()
    restaurant.name = "Old Name"
    data = RestaurantUpdate(name="Updated Name")

    result = update_restaurant(db, restaurant, data)

    assert result.name == "Updated Name"
    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(restaurant)


def test_create_order_commits_and_returns_record():
    db = MagicMock()
    data = OrderCreate(
        customer_id=1,
        order_status="PLACED",
        subtotal=200,
        gst_amount=10,
        delivery_charge=20,
        discount_amount=0,
        total_amount=230,
    )

    result = create_order(db, data)

    db.add.assert_called_once()
    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(result)
    assert result.order_status == "PLACED"
    assert result.is_deleted is False
    assert result.is_active is True


def test_update_order_changes_only_provided_fields():
    db = MagicMock()
    order = MagicMock()
    order.order_status = "PLACED"
    data = OrderUpdate(order_status="DELIVERED")

    result = update_order(db, order, data)

    assert result.order_status == "DELIVERED"
    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(order)
