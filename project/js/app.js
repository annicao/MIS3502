"use strict";

/* SOME CONSTANTS */
let endpoint01 = "https://misdemo.temple.edu/auth";
let endpoint02 = "https://mis3502-acao.com/8221";

/* SUPPORTING FUNCTIONS */
let BillListControl = function(){
	//make an ajax call to get the tasks
	let the_serialized_data = "userid=" + localStorage.usertoken;
	console.log(the_serialized_data); //the data I will send to the API
	$.ajax({
		"url" : endpoint02 + "/bills",
		"data" : the_serialized_data,
		"method" : "GET",
		"success" : function(result){
			console.log(result); //the data I got back
			$("#table-bill").html("<tr><th>Bill Description</th><th>Status</th><th>Amount</th></tr>");
			for(let i=0; i<result.length; i++){
				let tablerow = "<tr><td>";
				tablerow = tablerow + '<a href="#" onclick="detailController('+ result[i]["billid"] +')">'+ result[i]["description"] + '</a></td><td>';
				if(result[i]["status"] == "Income"){
					tablerow = tablerow + '<img alt="plus" src="images/plus.png" style="width:20px;"> </td><td> $' + result[i]["amount"] + "</td></tr>";
				}
				else if(result[i]["status"] == "Expense"){
					tablerow = tablerow + '<img alt="minus" src="images/minus.png" style="width:20px;"></td><td> $' + result[i]["amount"] + "</td></tr>";
				}
				$("#table-bill").append(tablerow);
			}
		},
		"error":function(data){
			console.log(data);
			$("#main").html("You don't have any bills yet. Please add your bills.");
			$("#main").addClass("alert alert-success");
			$("#div-report").html("There's no report.");
			$("#div-report").addClass("alert alert-danger");
		}
	});
};

let addbill = function(){
	let the_serialized_data = $("#form-add").serialize() + "&userid="+localStorage.usertoken;
	console.log(the_serialized_data);
	$.ajax({
		url: endpoint02 + "/bill",
		data: the_serialized_data,
		method: "POST",
	  success: function(result){
		console.log(result);
		$("#div-add").html("Bill added successfully! Please refresh your book statement.");
		$("#div-add").addClass("alert alert-success");
		},
	  error: function(data){
		console.log(data);
		$("#div-add").html("Bill added failed! Please enter valid values. Refresh the page and try again.");
		$("#div-add").addClass("alert alert-danger");
		},
	  });
};

let detailController = function(billid){
	let the_serialized_data = "billid=" + billid;
	console.log(the_serialized_data);
	//ajax go get the detail for the taskid
	$.ajax({
		url: endpoint02 + "/bill",
		data: the_serialized_data,
		method: "GET",
		success: function(result){
			console.log(result);
			//hide all divs of class content wrapper
			$(".content-wrapper").hide();
			//show div detail
			$("#div-detail").show();
			//put the detail into the div-detail portion of the html
			$("#detail-description").html(result[0]["description"]);
			$("#detail-status").html(result[0]["status"]);
			$("#detail-amount").html(result[0]["amount"]);
			$("#detail-method").html(result[0]["method"]);
			$("#detail-category").html(result[0]["category"]);
			$("#detail-date").html(result[0]["date"]);
			$("#detail-billid").val(result[0]["billid"]);
			$("#detail-billid").hide();
		},
		error: function(data){
			console.log(data);
			$("#div-detail").html("Get details failed! Please try again.");
			$("#div-detail").addClass("alert alert-danger");
		}
	});
};

let deletebill = function(){
	let the_serialized_data = $("#detail-billid").serialize();
	console.log(the_serialized_data);
	$.ajax({
		url: endpoint02 + "/bill",
		data: the_serialized_data,
		method: "DELETE",
		success: function(result){
			console.log(result);
			$("#div-detail").html("Delete successfully! Please refresh your book statement.");
			$("#div-detail").addClass("alert alert-success");
		},
		error: function(data){
			console.log(data);
			$("#div-detail").html("Delete failed! Please refresh your book statement and try again.");
			$("#div-detail").addClass("alert alert-danger");
		}
	});
};

let incomesum = function(){
	let the_serialized_data = "status=Income&userid="+localStorage.usertoken;
	console.log(the_serialized_data);
	$.ajax({
		url: endpoint02 + "/sum",
		data: the_serialized_data,
		method: "GET",
		success: function(result){
			console.log(result);
			if(result[0]["sum(amount)"] == null){
				$("#incomesum").html(0);
			}else{
				$("#incomesum").html(result[0]["sum(amount)"]);
			}
		},
		error: function(data){
			console.log(data);
			$("#incomesum").html("--");
		}
	});
};

let expensesum = function(){
	let the_serialized_data = "status=Expense&userid="+localStorage.usertoken;
	console.log(the_serialized_data);
	$.ajax({
		url: endpoint02 + "/sum",
		data: the_serialized_data,
		method: "GET",
		success: function(result){
			console.log(result);
			if(result[0]["sum(amount)"] == null){
				$("#expensesum").html(0);
			}else{
				$("#expensesum").html(result[0]["sum(amount)"]);
			}
		},
		error: function(data){
			console.log(data);
			$("#expensesum").html("--")
		}
	});
};

let incomechart = function(){
	let the_serialized_data = "status=Income&userid=" + localStorage.usertoken;
	console.log(the_serialized_data);
	$.ajax({
		url: endpoint02 + "/chart",
		data: the_serialized_data,
		method: "GET",
		success: function(result){
			console.log(result);
			let chdamount = "";
			let category = "";
			let chlamount = "";
			for (let i = 0; i < result.length; i++){
				chdamount += result[i]["sum(amount)"] + ",";
				category += result[i]["category"] + "|";
				chlamount += "$" + result[i]["sum(amount)"] + "|";
			}
			let chart_api_string = "https://image-charts.com/chart?cht=pd&chtt=Income&chd=t:" 
			+ chdamount 
			+"&chdl=" + category
			+"&chli=$" + $("#incomesum").html()
			+"&chl=" + chlamount
			+"&chs=300x400"
			$("#incomechart").attr("src",chart_api_string);
		},
		error: function(data){
			console.log(data);
			$("incomechart").html("Error for display income chart.");
		}
	});
};

let expensechart = function(){
	let the_serialized_data = "status=Expense&userid=" + localStorage.usertoken;
	console.log(the_serialized_data);
	$.ajax({
		url: endpoint02 + "/chart",
		data: the_serialized_data,
		method: "GET",
		success: function(result){
			console.log(result);
			let chdamount = "";
			let category = "";
			let chlamount = "";
			for (let i = 0; i < result.length; i++){
				chdamount += result[i]["sum(amount)"] + ",";
				category += result[i]["category"] + "|";
				chlamount += "$" + result[i]["sum(amount)"] + "|";
			}
			let chart_api_string = "https://image-charts.com/chart?cht=pd&chtt=Expense&chd=t:" 
			+ chdamount 
			+"&chdl=" + category
			+"&chli=$" + $("#expensesum").html()
			+"&chl=" + chlamount
			+"&chs=300x400"
			$("#expensechart").attr("src",chart_api_string);
		},
		error: function(data){
			console.log(data);
			$("expensechart").html("Error for display expense chart.");
		}
	});
};

let navigationControl = function(the_link){

	/* manage the content that is displayed */
	let idToShow = $(the_link).attr("href");
	localStorage.lastnavlink = idToShow;

	console.log(idToShow);

	$(".content-wrapper").hide(); 	/* hide all content-wrappers */
	$(idToShow).show(); /* show the chosen content wrapper */
	$("html, body").animate({ scrollTop: "0px" }); /* scroll to top of page */
	$(".navbar-collapse").collapse('hide'); /* explicitly collapse the navigation menu */

} /* end navigation control */

let loginController = function(){
	//clear any previous messages
	$('#login_message').html("");
	$('#login_message').removeClass();

	//first, let's do some client-side 
	//error trapping.
	let username = $("#username").val();
	let password = $("#password").val();
	if (username == "" || password == ""){
		$('#login_message').html('The user name and password are both required.');
		$('#login_message').addClass("alert alert-danger text-center");
		return; //quit the function now!  Get outta town!  Stop. 
	}
	
	//whew!  We didn't quit the function because of an obvious error
	//what luck!  Let's go make an ajax call now

	//go get the data off the login form
	let the_serialized_data = $('#form-login').serialize();
	//the data I am sending
	console.log(the_serialized_data);;
	$.ajax({
		"url" : endpoint01,
		"method" : "GET",
		"data" : the_serialized_data,
		"success" : function(result){
			if (typeof result === 'string'){
				// login failed.  Remove usertoken 
				localStorage.removeItem("usertoken");
				$('#login_message').html(result);
				$('#login_message').addClass("alert alert-danger text-center");
			} else {
				//login succeeded.  Set usertoken.
				localStorage.usertoken = result['user_id']; 
				//console log the result ... a bad idea in prodcution
				//but useful for teaching, learning and testing
				console.log(result);
				//manage the appearence of things...
				$('#login_message').html('');
				$('#login_message').removeClass();
				$('.secured').removeClass('locked');
				$('.secured').addClass('unlocked');
				$('#div-login').hide(); //hide the login page
				$('#div-main').show();   //show the default page
				BillListControl();
				incomesum();
				expensesum();
			}
		},
		"error" : function(data){
			console.log("Error!");
			console.log(data);
			},
	});
	//scroll to top of page
	$("html, body").animate({ scrollTop: "0px" });
};

//document ready section
$(document).ready(function (){

    /* ----------------- start up navigation -----------------*/	
    /* controls what gets revealed when the page is ready     */

    /* this reveals the default page */
	if (localStorage.usertoken){
		$("#div-main").show()
		BillListControl();
		incomesum();
		expensesum();
		$(".secured").removeClass("locked");		
		$(".secured").addClass("unlocked");
	}
	else {
		$("#div-login").show();
		$(".secured").removeClass("unlocked");
		$(".secured").addClass("locked");
	}

    /* ------------------  basic navigation -----------------*/	
    /* this controls navigation - show / hide pages as needed */

	/* what to do when any item of class nav-link is clicked */
	$(".nav-link").click(function(){
		navigationControl(this);
	});
		
	/* what happens if the login button is clicked? */
	$('#btnLogin').click(function(){
		loginController();
	});

	/* what happens if the logout link is clicked? */
	$('#link-logout').click(function(){
		// First ... remove usertoken from localstorage
		localStorage.removeItem("usertoken");
		// Now force the page to refresh
		window.location = "./index.html";
	});

	/* what happens if the main link is clicked? */
	$('#link-main').click(function(){
		BillListControl();
		incomesum();
		expensesum();
	});

	/* what happens if the report link is clicked? */
	$('#link-report').click(function(){
		incomechart();
		expensechart();
		let income = $("#incomesum").html();
		let expense = $("#expensesum").html();
		if(income-expense > 0){
			$("#report").addClass("alert alert-success");
			$("#report").html("Good job! You gained more money.");
		}else if(income-expense < 0){
			$("#report").addClass("alert alert-danger");
			$("#report").html("Be careful! You spent too much money.");
		}else{
			$("#report").addClass("alert alert-primary");
			$("#report").html("Your bill is breakeven.");
		};
	});

	/* what happens if the Add Bill button on main page is clicked? */
	$('#addbill').click(function(){
		$("#div-main").hide();
		$("#div-add").show();
	});

	/* what happens if the Go Back button on detail page is clicked? */
	$('#GoBack').click(function(){
		$("#div-detail").hide();
		$("#div-main").show();
	});

	/* what happens if the Delete button on detail page is clicked? */
	$('#Delete').click(function(){
		deletebill();
	});

	/* what happens if the Add Bill button on add bill page is clicked? */
	$('#btnAddBill').click(function(){
		addbill();
	});

	/* what happens if the Cancel button on add bill page is clicked? */
	$('#btnAddCancel').click(function(){
		$("#div-add").hide();
		$("#div-main").show();
	});
}); /* end the document ready event*/