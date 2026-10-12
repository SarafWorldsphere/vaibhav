from unittest.mock import MagicMock

import pytest

from app.schemas.restaurant import RestaurantUpdate
from app.schemas.order import OrderUpdate
from app.services.restaurant import update_restaurant
from app.services.order import update_order


def test_restaurant_update_propagates_commit_error():
    db = MagicMock()
    db.commit.side_effect = RuntimeError("Simulated database error")
    restaurant = MagicMock()
    data = RestaurantUpdate(name="Updated Name")

    with pytest.raises(RuntimeError, match="Simulated database error"):
        update_restaurant(db, restaurant, data)

    db.commit.assert_called_once()


def test_order_update_propagates_commit_error():
    db = MagicMock()
    db.commit.side_effect = RuntimeError("Simulated database error")
    order = MagicMock()
    data = OrderUpdate(order_status="DELIVERED")

    with pytest.raises(RuntimeError, match="Simulated database error"):
        update_order(db, order, data)

    db.commit.assert_called_once()
