package servlet;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.servlet.*;
import javax.servlet.http.*;

import net.minidev.json.*;

@SuppressWarnings("serial")
public class SaveData extends HttpServlet {
	
	static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
	static final String DB_URL = "jdbc:mysql://localhost:3306/";
	static final String DB_NAME = "fb_search";

	static final String USER = "root";
	static final String PASS = "root";
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		doPost(request, response);
		
	}
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		response.setContentType("text/html; charset=utf-8");
		PrintWriter out = response.getWriter();
		String userId = request.getParameter("userId");
		String groupId = request.getParameter("groupId");
		String feedId = request.getParameter("feedId");
		String task = request.getParameter("task");
		String tags = request.getParameter("tags")==null? "" : request.getParameter("tags");
		String orderTime = request.getParameter("orderTime");
		String deadline = request.getParameter("deadline");
		
		
		Connection conn = null;
		PreparedStatement stmt = null;
		try {
			Class.forName(JDBC_DRIVER);
			conn = DriverManager.getConnection(DB_URL + DB_NAME, USER, PASS);
			String sql = "INSERT INTO fb_ver1 (userId, groupId, feedId, task, tags, orderTime, deadline) VALUES(?,?,?,?,?,?,?)";
			stmt = conn.prepareStatement(sql);
			stmt.setString(1, userId);
			stmt.setString(2, groupId);
			stmt.setString(3, feedId);
			stmt.setNString(4, task);
			stmt.setNString(5, tags);
			stmt.setString(6, orderTime);
			stmt.setNString(7, deadline);
			
			stmt.executeUpdate();
			JSONObject record = new JSONObject();
			record.put("userId", userId);
			record.put("groupId", groupId);
			record.put("feedId", feedId);
			record.put("task", task);
			record.put("tags", tags);
			record.put("orderTime", orderTime);
			record.put("deadline",deadline);
			out.println(record);
			stmt.close();
			conn.close();
		} catch (SQLException se) {
			se.printStackTrace();
			out.println(se.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			out.println(e.getMessage());
		}
	}

}
