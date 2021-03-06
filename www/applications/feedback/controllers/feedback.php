<?php
if (!defined("ACCESS")) {
	die("Error: You don't have permission to access here...");
}

class Feedback_Controller extends ZP_Load
{
	public function __construct()
	{
		$this->Feedback_Model = $this->model("Feedback_Model");
		$this->Templates = $this->core("Templates");
		$this->application = "feedback";
		$this->Templates->theme();
		setURL();
	}

	public function index()
	{
		$this->feedback();
	}

	private function feedback()
	{
		$this->CSS("new", "users");
		$this->title("Feedback");
		$this->helper(array("forms", "html"));

		$vars["inserted"] = false;
		$vars["view"] = $this->view("send", true);

		if (POST("send")) {
			$vars["alert"] = $this->Feedback_Model->send();
		}

		$this->render("content", $vars);
	}
}
