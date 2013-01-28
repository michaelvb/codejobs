!function($) {
	var application, table, total, loading_more, records, order_by, search_by, field;

	application  = APP;
	table 		 = ".results";
	total 		 = parseInt($("#total").val());
	records 	 = parseInt($("#count").val());
	requesting 	 = false;
	loading_more = false;
	order_by 	 = false;
	search_by 	 = false;

	$(table + " thead th a").mouseenter(refreshTitle);

	$(table + " tbody tr").click(columnClick);
	$(table + " tbody .tiny-delete").click(deleteClick);
	$(table + " thead th a").click(anchorClick);

	$("#records").click(function (event) {
		if ($(this).is(":checked")) {
			$(table + " tbody input[name='records[]']").attr("checked", true);
		} else {
			$(table + " tbody input[name='records[]']").attr("checked", false);
		}
	});

	$("#delete").click(function (event) {
		event.stopPropagation();
		event.preventDefault();

		var $elems, elems, total;

		$elems = $(table + " tbody input[name='records[]']:checked");
		total  = $elems.length;

		if (total > 0) {
			if (confirm($("#delete-question").val() + " (" + total + ")")) {
				elems = [];

				$elems.each(function (key, obj) {
					elems.push($(obj).val());
				});

				if (!requesting) {
					shadow(true);

					$.ajax({
						"type" 	  : "json",
						"url"  	  : PATH + "/blog/users/delete/?start=" + records + "&records[]=" + elems.join("&records[]="),
						"success" : deleted
					});
				}
			}
		} else {
			alert($("#delete-empty-question").val());
		}

		return false;
	});

	$("#more").appear(function () {
		if (!loading_more && !requesting) {
			var uri = "?start=" + records;

			if (order_by) {
				uri += "&field=" + order_by[0] + "&order=" + order_by[1];
			}

			if (search_by) {
				uri += "&query=" + search_by;
			}

			$.ajax({
				"type" 	 : "json",
				"url" 	 : PATH + "/blog/users/data/" + uri,
				"success": loaded
			});

			loading_more = true;
		}
	});

	$("#search-input").keydown(function (event) {
		if (event.key === 13) {
			event.stopPropagation();
			event.preventDefault();

			search($(this).val());

			return false;
		}
	});

	$("#search-button").click(function (event) {
		event.stopPropagation();
		event.preventDefault();

		search($("#search-input").val());

		return false;
	});

	function deleteClick(event) {
		event.stopPropagation();
		event.preventDefault();

		if (confirm($('#deleting-question').val())) {
			var obj = this, id = $(obj).parent().parent().find("input[name='records[]']").val();

			if (!requesting) {
				shadow(true);

				$.ajax({
					"type" 	  : "json",
					"url"  	  : PATH + "/blog/users/delete/?start=" + records + "&records[]=" + id,
					"success" : function (data) {
						!$.proxy(deleted, obj)(data, id);
					}
				});
			}
		}

		return false;
	};

	function processData(data) {
		var values = eval(data);

		if (values.length > 0) {
			$.each(values, function (key, value) {
				addColumn(value);
			});

			records = $(table + " tbody tr").length;
		} else {
			total = records;
		}

		if (records >= total) {
			$("#more").hide();
		} else {
			$("#more").show();
		}
	}

	function loaded(data) {
		processData(data);

		loading_more = false;
	}

	function deleted(data, record) {
		if (record === undefined) {
			var $elems = $(table + " tbody input[name='records[]']:checked");

			total -= $elems.length;
			$elems.parent().parent().remove();
		} else {
			total--;
			$(this).parent().parent().remove();
		}

		processData(data);

		$("#my_" + application).text(total);

		shadow(false);
	}

	function ordered(data) {
		$(table + " tbody").empty();

		processData(data);

		shadow(false);
	}

	function found(data) {
		$(table + " tbody").empty();

		processData(data);

		shadow(false);
	}

	function addColumn(data) {
		var column = $('<tr></tr>'), actions = $('<td data-center></td>');

		column.append('<td data-center><input name="records[]" value="' + data.ID_Post + '" type="checkbox" /></td>');
		column.append('<td><a href="' + PATH + '/blog/' + data.Year + '/' + data.Month + '/' + data.Day + '/' + data.Slug + '" target="_blank">' + data.Title + '</a></td>');
		column.append('<td data-center>' + data.Views + '</td>');
		column.append('<td data-center>' + data.Language + '</td>');
		column.append('<td data-center>' + data.Situation + '</td>');
		column.append('<td data-center title="' + data.Start_Date + '">' + data.Start_Date + '</td>');
		
		actions.append('<a href="#" title="' + $(".tiny-edit").attr("title") + '" class="tiny-image tiny-edit no-decoration">&nbsp;&nbsp;&nbsp;</a>');
		actions.append($('<a href="#" title="' + $(".tiny-delete").attr("title") + '" class="tiny-image tiny-delete no-decoration">&nbsp;&nbsp;&nbsp;</a>').click(deleteClick));

		column.append(actions);

		column.click(columnClick);

		$(table + " tbody").append(column);
	}

	function columnClick(event) {
		if (event.target.tagName !== "A" && event.target.name !== "records[]") {
			if ($(this).find("input[name='records[]']").is(":checked")) {
				$(this).find("input[name='records[]']").attr("checked", false);
			} else {
				$(this).find("input[name='records[]']").attr("checked", true);
			}
		}
	}

	function shadow(wait) {
		requesting = wait;

		if (wait) {
			var offset = $(".results").offset();

			$("#table-shadow").css({
				"display": "block",
				"left": offset.left + "px",
				"top": offset.top + "px",
				"width": $(".results").width(),
				"height": $(".results").height()
			});
		} else {
			$("#table-shadow").css("display", "none");
		}
	}

	function anchorClick(event) {
		event.stopPropagation();
		event.preventDefault();

		if (!requesting) {
			shadow(true);

			var field = $(this).parent().data("field"),
				order = $(this).parent().attr("data-order");

			$(table + " thead th[data-order]").attr("data-order", "");

			if (!order || order === "ASC") {
				$(this).parent().attr("data-order", order = "DESC");
			} else {
				$(this).parent().attr("data-order", order = "ASC");
			}

			+$.proxy(refreshTitle, this)();

			var uri = "?start=0&field=" + field + "&order=" + order;

			if (search_by) {
				uri += "&query=" + search_by;
			}

			$.ajax({
				"type" 	  : "json",
				"url"  	  : PATH + "/blog/users/data/" + uri,
				"success" : ordered
			});

			order_by = [field, order];
		}

		return false;
	}

	function search(query) {
		if (query) {
			if (!requesting) {
				shadow(true);

				$.ajax({
					"type" 	  : "json",
					"url"  	  : PATH + "/blog/users/data/?start=0&query=" + query,
					"success" : found
				});

				search_by = query;
			}
		}
	}

	function refreshTitle() {
		var order = $(this).parent().attr("data-order");

		if (order === "DESC") {
			$(this).attr("title", $("#order-asc").val());
		} else {
			$(this).attr("title", $("#order-desc").val());
		}
	}

}(jQuery);