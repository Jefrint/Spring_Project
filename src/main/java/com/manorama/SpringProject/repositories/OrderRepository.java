package com.manorama.SpringProject.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.manorama.SpringProject.Summary.DailySummary;
import com.manorama.SpringProject.Summary.MonthlySummary;
import com.manorama.SpringProject.entities.Orders;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {

	@Query("SELECT new com.manorama.SpringProject.Summary.MonthlySummary(MONTH(o.date) AS month, YEAR(o.date) AS year, SUM(oi.quantity * i.price) AS total_amount, COUNT(o.id)) FROM Orders o JOIN OrderItems oi ON o.id = oi.orders.id JOIN Items i ON oi.items.id = i.id WHERE MONTH(o.date) = MONTH(CURDATE()) AND YEAR(o.date) = YEAR(CURDATE()) AND o.user_id=:user_id GROUP BY MONTH(o.date), YEAR(o.date), o.user_id")
	MonthlySummary userSummary(@Param("user_id") long user_id);

	@Query("SELECT new com.manorama.SpringProject.Summary.DailySummary(DAY(o.date) as day, MONTH(o.date) AS month, YEAR(o.date) AS year, SUM(oi.quantity * i.price) AS total_amount, COUNT(o.id)) FROM Orders o JOIN OrderItems oi ON o.id = oi.orders.id JOIN Items i ON oi.items.id = i.id WHERE DAY(o.date) = DAY(CURDATE()) AND MONTH(o.date) = MONTH(CURDATE()) AND YEAR(o.date) = YEAR(CURDATE()) AND o.user_id=:user_id GROUP BY MONTH(o.date), YEAR(o.date), DAY(o.date), o.user_id")
	DailySummary userDailySummary(@Param("user_id") long user_id);

	@Query("SELECT new com.manorama.SpringProject.Summary.MonthlySummary(MONTH(o.date) AS month, YEAR(o.date) AS year, SUM(oi.quantity * i.price) AS total_amount, COUNT(o.id)) FROM Orders o JOIN OrderItems oi ON o.id = oi.orders.id JOIN Items i ON oi.items.id = i.id WHERE MONTH(o.date) = MONTH(CURDATE()) AND YEAR(o.date) = YEAR(CURDATE()) GROUP BY MONTH(o.date), YEAR(o.date)")
	MonthlySummary adminSummary();

	@Query("SELECT new com.manorama.SpringProject.Summary.DailySummary(DAY(o.date) as day, MONTH(o.date) AS month, YEAR(o.date) AS year, SUM(oi.quantity * i.price) AS total_amount, COUNT(o.id)) FROM Orders o JOIN OrderItems oi ON o.id = oi.orders.id JOIN Items i ON oi.items.id = i.id WHERE DAY(o.date) = DAY(CURDATE()) AND MONTH(o.date) = MONTH(CURDATE()) AND YEAR(o.date) = YEAR(CURDATE()) GROUP BY MONTH(o.date), YEAR(o.date), DAY(o.date)")
	DailySummary adminDailySummary();

	@Query("from Orders s where DATE(s.date) = :date and s.user_id= :user_id")
	public List<Orders> findAllByDateanduserId(@Param("date") Date date, @Param("user_id") long user_id);

	@Query("from Orders s where DATE(s.date) = :date and s.paymentStatus='success' order by date desc")
	public List<Orders> findAllByDate(@Param("date") Date date);

	@Query("from Orders s where DATE(s.date) >= :start_date and DATE(s.date) <= :end_date and s.user_id =:user_id and s.paymentStatus='success' order by date desc")
	public List<Orders> findAllBetweenDates(@Param("start_date") Date start_date, @Param("end_date") Date last_date,
			@Param("user_id") long user_id);

	@Query("from Orders o where o.user_id = :user_id order by o.date desc")
	public List<Orders> findAllByUserId(@Param("user_id") long user_id);
}
