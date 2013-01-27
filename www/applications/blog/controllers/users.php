<?php
/**
 * Access from index.php:
 */
if(!defined("_access")) {
	die("Error: You don't have permission to access here...");
}

class Users_Controller extends ZP_Load {

	public function __construct() {
		$this->app(whichApplication());

		$this->config($this->application);

		$this->Users_Model = $this->model("Users_Model");

		$this->Templates = $this->core("Templates");
		
		$this->Templates->theme();
		
		$this->Model = ucfirst($this->application) ."_Model";
		
		$this->{$this->Model} = $this->model($this->Model);
	}

	public function index() {
		isConnected();

		redirect($this->application);
	}

	public function results() {
		isConnected($this->application);

		$this->helper("time");

		$this->CSS("user_results", "cpanel");
		$this->CSS("admin", "blog");
		$this->CSS(_corePath ."/vendors/css/frameworks/bootstrap/bootstrap-codejobs.css", NULL, FALSE, TRUE);

		$this->js("jquery.appear.js");
		$this->js("user_results", "cpanel");

		$this->vars["records"] = $this->Users_Model->records();
		$this->vars["view"]    = $this->view("user_results", TRUE, $this->application, $this->application);
		$this->vars["caption"] = __("My posts");
		$this->vars["total"]   = SESSION("ZanUserPosts");

		$this->title($this->vars["caption"]);
		
		$this->render("content", $this->vars);
	}

	public function data() {
		$this->isMember();
		
		$start = (int) GET("start");
		$field = GET("field") ? GET("field") : "ID_Post";
		$order = GET("order") ? GET("order") : "DESC";
		$query = GET("query");

		$data = $this->Users_Model->records(TRUE, $start, "$field $order", $query);

		if($data) {
			echo json($data);
		} else {
			echo '[]';
		}
	}

	public function delete() {
		$this->isMember();

		$records = GET("records");
		$start   = GET("start");

		if(is_array($records) and is_integer($start)) {
			$data = $this->Users_Model->delete($records, $start);

			if($data) {
				echo json($data);
			} else {
				echo '[]';
			}
		}
	}

	private function isMember() {
		if(!SESSION("ZanUser")) {
			exit('[]');
		}
	}

}