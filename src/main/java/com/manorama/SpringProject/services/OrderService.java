package com.manorama.SpringProject.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.manorama.SpringProject.Summary.DailySummary;
import com.manorama.SpringProject.Summary.MonthlySummary;
import com.manorama.SpringProject.Summary.Summary;
import com.manorama.SpringProject.entities.Items;
import com.manorama.SpringProject.entities.OrderItems;
import com.manorama.SpringProject.entities.Orders;
import com.manorama.SpringProject.models.ItemModel;
import com.manorama.SpringProject.models.OrderModel;
import com.manorama.SpringProject.models.TransactionModel;
import com.manorama.SpringProject.models.TxnReturnModel;
import com.manorama.SpringProject.repositories.ItemsRepository;
import com.manorama.SpringProject.repositories.OrderItemRepository;
import com.manorama.SpringProject.repositories.OrderRepository;

@Service
public class OrderService {
	private final OrderRepository orderRepository;
	private final ItemsRepository itemsRepository;
	private final OrderItemRepository orderItemRepository;
	private final PaymentService paymentService;

	Logger logger = LoggerFactory.getLogger(OrderService.class);

	@Autowired
	public OrderService(OrderRepository orderRepository, ItemsRepository itemsRepository,
			OrderItemRepository orderItemRepository, PaymentService paymentService) {
		this.orderRepository = orderRepository;
		this.itemsRepository = itemsRepository;
		this.orderItemRepository = orderItemRepository;
		this.paymentService = paymentService;
	}

	public List<Orders> getAllOrders() {
		return orderRepository.findAll();
	}

	public List<Orders> getOrdersByUser(Long id) {
		return orderRepository.findAllByUserId(id);
	}

	public void createOrder(Orders order) {
		orderRepository.save(order);
	}

	public void deleteOrder(Long id) {
		orderRepository.deleteById(id);
	}

	public void addOrders(List<Orders> orders) {
		orderRepository.saveAll(orders);
	}

	public ResponseEntity createCheckout(Long id) {
		Optional<Orders> maybeOrder = orderRepository.findById(id);
		if (maybeOrder.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		List<OrderItems> ordItems = orderItemRepository.findAllByOrders(maybeOrder.get());
		float totalAmt = 0;
		for (OrderItems ordItem : ordItems) {
			totalAmt += ordItem.getItems().getPrice() * ordItem.getQuantity();
		}
		return paymentService.getCheckout(totalAmt, ordItems.get(0).getOrders().getId());

	}

	public MonthlySummary getMonthlySummary(long user_id) {
		MonthlySummary data = orderRepository.userSummary(user_id);
		return data;
	}

	public DailySummary getDailySummary(long user_id) {
		return orderRepository.userDailySummary(user_id);
	}

	public Optional<Orders> getOrderTest(Long orderId) {
		return orderRepository.findById(orderId);
	}

	@Transactional
	public ResponseEntity<Orders> createAnOrder(OrderModel order) {
		Orders savedOrder = orderRepository.save(new Orders(order.getUser_id(), order.getCategory()));

		List<OrderItems> orderItemsToSave = new ArrayList<>();
		for (ItemModel item : order.getItems()) {
			Optional<Items> itemFromDb = itemsRepository.findById(item.getItem_id());
			itemFromDb.ifPresent(itemEntity -> {
				OrderItems orderItem = new OrderItems(savedOrder, itemEntity, item.getQuantity());
				orderItemsToSave.add(orderItem);
			});
		}
		orderItemRepository.saveAll(orderItemsToSave);
		return ResponseEntity.ok(savedOrder);
	}

	@Transactional
	public ResponseEntity createOrderFromCart(OrderModel order) {
		Orders savedOrder = orderRepository.save(new Orders(order.getUser_id(), order.getCategory()));

		List<OrderItems> orderItemsToSave = new ArrayList<>();
		for (ItemModel item : order.getItems()) {
			Optional<Items> itemFromDb = itemsRepository.findById(item.getItem_id());
			itemFromDb.ifPresent(itemEntity -> {
				OrderItems orderItem = new OrderItems(savedOrder, itemEntity, item.getQuantity());
				orderItemsToSave.add(orderItem);
			});
		}
		orderItemRepository.saveAll(orderItemsToSave);
		return createCheckout(savedOrder.getId());
//		return savedOrder;

	}

	public ResponseEntity getDailyOrders(long user_id) {
		return ResponseEntity.ok(orderRepository.findAllByDateanduserId(new Date(), user_id));
	}

	public ResponseEntity getDailyAdminOrders() {
		return ResponseEntity.ok(orderRepository.findAllByDate(new Date()));
	}

	public ResponseEntity<Orders> approveOrder(long order_id) {
		Optional<Orders> maybeOrder = orderRepository.findById(order_id);
		if (maybeOrder.isEmpty()) {
			return ResponseEntity.status(404).body(null);
		}
		Orders ord = maybeOrder.get();
		ord.setStatus("approved");
		orderRepository.save(ord);
		return ResponseEntity.ok(ord);
	}

	public ResponseEntity getSummary(long user_id) {
		MonthlySummary ms = orderRepository.userSummary(user_id);
		DailySummary ds = orderRepository.userDailySummary(user_id);
		Summary sm = new Summary(ms, ds);
		return ResponseEntity.ok(sm);
	}

	public ResponseEntity getAdminSummary() {
		MonthlySummary ms = orderRepository.adminSummary();
		DailySummary ds = orderRepository.adminDailySummary();
		Summary sm = new Summary(ms, ds);
		return ResponseEntity.ok(sm);
	}

	public ResponseEntity<Object> deleteOrderItems(Long order_id, Long item_id) {
		try {
			Optional<Orders> maybeOrder = orderRepository.findById(order_id);
			if (maybeOrder.isEmpty()) {
				return ResponseEntity.status(404).body("order not found");
			}
			List<OrderItems> ot = orderItemRepository.findAllByOrders(maybeOrder.get());
			for (OrderItems ordItem : ot) {
				if (ordItem.getItems().getId() == item_id) {
					orderItemRepository.deleteById(ordItem.getId());
				}
			}
			if (maybeOrder.get().getItems().isEmpty()) {
				orderRepository.deleteById(order_id);
				return ResponseEntity.ok("order was empty so order has been deleted");

			}
			return ResponseEntity.ok(maybeOrder.get());
		} catch (NoSuchElementException ne) {
			logger.error("failed to remove item: {}", ne.getMessage());
			return ResponseEntity.status(422).body("no such item exists");
		} catch (Exception e) {
			logger.error("some error occurred: {}", e.getMessage());
			return ResponseEntity.status(500).body("some error occurred: " + e.getMessage());
		}
	}

	public ResponseEntity updateOrderItems(long order_id, long item_id, int quantity) {

		try {
			Optional<Orders> maybeOrder = orderRepository.findById(order_id);
			if (maybeOrder.isEmpty()) {
				return ResponseEntity.status(404).body("order not found");
			}
			List<OrderItems> ot = orderItemRepository.findAllByOrders(maybeOrder.get());
			for (OrderItems ordItem : ot) {
				if (ordItem.getItems().getId() == item_id) {
					ordItem.setQuantity(quantity);
					orderItemRepository.save(ordItem);
					return ResponseEntity.ok().build();
				}
			}
		} catch (NoSuchElementException ne) {
			logger.error("failed to remove item: {}", ne.getMessage());
			return ResponseEntity.status(422).body("no such item exists");
		} catch (Exception e) {
			logger.error("some error occurred: {}", e.getMessage());
			return ResponseEntity.status(500).body("some error occurred: " + e.getMessage());
		}
		return ResponseEntity.ok().build();
	}

	public ResponseEntity<Orders> getOrderById(Long order_id) {
		Optional<Orders> order = orderRepository.findById(order_id);
		if (order.isPresent()) {
			return ResponseEntity.ok(order.get());
		} else {
			return ResponseEntity.noContent().build();
		}
	}

	public ResponseEntity updateOnPayment(long order_id) {
		Optional<Orders> order = orderRepository.findById(order_id);
		if (order.isPresent()) {
			order.get().setPaymentStatus("success");
			order.get().setStatus("fulfilled");
		}
//		orderRepository.save(order.get());
		return ResponseEntity.ok(orderRepository.save(order.get()));
//		return null;
	}

	public ResponseEntity getTransactions(TransactionModel txnModel) {

		List<Orders> orders = orderRepository.findAllBetweenDates(txnModel.getStart_date(), txnModel.getEnd_date(),
				txnModel.getUser_id());
		List<TxnReturnModel> txns = new ArrayList<TxnReturnModel>();
		for (Orders order : orders) {
			List<TxnReturnModel> txn = order.getItems().stream().map(item -> {
				return new TxnReturnModel(order.getId(), order.getDate(), order.getCategory(),
						item.getItems().getName(), item.getQuantity(), item.getQuantity() * item.getItems().getPrice());
			}).collect(Collectors.toList());
			txns.addAll(txn);
		}
		return ResponseEntity.ok(txns);
	}
}
