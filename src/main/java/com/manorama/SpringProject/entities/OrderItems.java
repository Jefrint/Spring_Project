package com.manorama.SpringProject.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class OrderItems {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonIgnore
	private long id;

	@JsonIgnore
	@ManyToOne(optional = false)
	@JoinColumn(name = "order_id")
	private Orders orders;

	@ManyToOne(optional = false)
	@JoinColumn(name = "item_id")
	private Items items;

	@Column
	private int quantity;

	public OrderItems(Orders orders, Items items, int quantity) {
		this.orders = orders;
		this.items = items;
		this.quantity = quantity;
	}

	public OrderItems() {
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Orders getOrders() {
		return orders;
	}

	public void setOrders(Orders orders) {
		this.orders = orders;
	}

	public Items getItems() {
		return items;
	}

	public void setItems(Items items) {
		this.items = items;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

}
