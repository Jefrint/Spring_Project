package com.manorama.SpringProject.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.manorama.SpringProject.entities.Orders;
import com.manorama.SpringProject.models.OrderModel;
import com.manorama.SpringProject.models.TransactionModel;
import com.manorama.SpringProject.models.UpdateOrder;
import com.manorama.SpringProject.services.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
	private final OrderService orderService;

	@Autowired
	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}

	@GetMapping
	public List<Orders> getAllOrders() {
		return orderService.getAllOrders();
	}

	@GetMapping("/{order_id}")
	public ResponseEntity<Orders> getOrderById(@PathVariable Long order_id) {
		return orderService.getOrderById(order_id);
	}
	
	@PutMapping("/order/delete-items")
	public ResponseEntity deleteOrderItems(@RequestParam long order_id, long item_id) {
		return orderService.deleteOrderItems(order_id, item_id);
	}
	
	@PutMapping("/order/update-items")
	public ResponseEntity updateOrderItems(@RequestBody UpdateOrder order) {
		return orderService.updateOrderItems(order.getOrder_id(), order.getItem_id(), order.getQuantity());
	}

	@GetMapping("/user/{id}")
	public List<Orders> getOrdersByUser(@PathVariable Long id) {
		return orderService.getOrdersByUser(id);
	}

	@DeleteMapping("/{id}")
	public void deleteOrder(@PathVariable Long id) {
		orderService.deleteOrder(id);
	}

	@PostMapping("/add")
	public ResponseEntity<Orders> createOrder(@RequestBody OrderModel order) {
		return orderService.createAnOrder(order);
	}

	@PostMapping("/checkout")
	public ResponseEntity createCheckout(@RequestParam String order_id) {
		System.out.println(order_id);
		return orderService.createCheckout(Long.parseLong(order_id));
	}

	@GetMapping("/today")
	public ResponseEntity getDailyOrders(@RequestParam long user_id) {
		return orderService.getDailyOrders(user_id);
	}
	
	@GetMapping("/admin/today")
	public ResponseEntity getDailyAdminOrders() {
		return orderService.getDailyAdminOrders();
	}

	@PostMapping("/admin/approve")
	public ResponseEntity<Orders> approveOrder(@RequestParam long order_id) {
		return orderService.approveOrder(order_id);
	}

	@GetMapping("/summary")
	public ResponseEntity getSummary(@RequestParam long user_id) {
		return orderService.getSummary(user_id);
	}
	
	@GetMapping("/admin/summary")
	public ResponseEntity getSummary() {
		return orderService.getAdminSummary();
	}
	
	@PostMapping("/paid")
	public ResponseEntity updateAfterPayment(@RequestParam long order_id) {
		return orderService.updateOnPayment(order_id);
	}

	
	@PostMapping("/transactions")
	public ResponseEntity getTransactions(@RequestBody TransactionModel txnModel) {
		return orderService.getTransactions(txnModel);
	}
}
