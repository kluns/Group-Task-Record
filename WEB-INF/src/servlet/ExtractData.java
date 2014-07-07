package servlet;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.*;
import javax.servlet.http.*;

import net.minidev.json.*;

@SuppressWarnings("serial")
public class ExtractData extends HttpServlet {
	
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
		Connection conn = null;
		Statement stmt = null;
		try {
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection(DB_URL + DB_NAME, USER, PASS);
			stmt = conn.createStatement();
			String groupId=request.getParameter("groupId");
			String sql = "Select * from fb_ver1 Where groupId='"+ groupId +"' Group by feedId ";
			ResultSet rs = stmt.executeQuery(sql);
			JSONObject record = new JSONObject();
			int index = 1;
			while (rs.next()) {
				JSONObject temp = new JSONObject();
				temp.put("userId", rs.getString("userId"));
				temp.put("groupId", rs.getString("groupId"));
				temp.put("feedId", rs.getString("feedId"));
				temp.put("task", rs.getString("task"));
				temp.put("tags", rs.getString("tags"));
				temp.put("orderTime", rs.getString("orderTime"));
				temp.put("deadline", rs.getString("deadline"));
				record.put("" + index, temp);
				index++;
			}
			if (! (record.isEmpty()))
				out.println(record);
			else 
				throw new Exception("No record.");
			rs.close();
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
