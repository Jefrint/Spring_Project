package com.manorama.SpringProject.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.manorama.SpringProject.entities.Cart;
import com.manorama.SpringProject.services.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

	private CartService cartService;

	@Autowired
	public CartController(CartService cartService) {
		this.cartService = cartService;
	}

//	@PostMapping
//	public ResponseEntity addToCart(@RequestBody Cart cart) {
//		return cartService.addToOrder(cart);
//	}

	@GetMapping
	public ResponseEntity getCartItems(@RequestParam long user_id) {
		return cartService.getCartItemsById(user_id);
	}

	@GetMapping("/admin")
	public ResponseEntity getAllCarts() {
		return cartService.getAllCarts();
	}

	@GetMapping("/checkout")
	public ResponseEntity cartCheckout(@RequestParam long user_id) {
		return cartService.createCheckout(user_id);
	}

	@PostMapping("/admin/checkout")
	public ResponseEntity adminCheckout(@RequestParam long user_id) {
		return cartService.adminCheckout(user_id);
	}

	@PostMapping
	public ResponseEntity addItemToCart(@RequestBody Cart cart) {
		return cartService.addItemToCart(cart);
	}

	@DeleteMapping
	public ResponseEntity removeFromCart(@RequestParam long user_id, @RequestParam long item_id) {
		return cartService.deleteFromCart(user_id, item_id);
	}

	@PutMapping
	public ResponseEntity updateCart(@RequestBody List<Cart> cart) {
		return cartService.updateCart(cart);
	}
}
