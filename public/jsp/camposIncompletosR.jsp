@@ -1,133 +0,0 @@
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>
<!DOCTYPE html>
	<html lang="zxx" class="no-js">
	<head>
		<!-- Mobile Specific Meta -->
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<!-- Favicon-->
		<link rel="shortcut icon" href="img/fav.png">
		<!-- Author Meta -->
		<meta name="author" content="colorlib">
		<!-- Meta Description -->
		<meta name="description" content="">
		<!-- Meta Keyword -->
		<meta name="keywords" content="">
		<!-- meta character set -->
		<meta charset="UTF-8">
		<!-- Site Title -->
		<title>Travel</title>

		<link href="https://fonts.googleapis.com/css?family=Poppins:100,200,400,300,500,600,700" rel="stylesheet"> 
			<!--
			CSS
			============================================= -->
			<link rel="stylesheet" href="css/linearicons.css">
			<link rel="stylesheet" href="css/font-awesome.min.css">
			<link rel="stylesheet" href="css/bootstrap.css">
			<link rel="stylesheet" href="css/magnific-popup.css">
			<link rel="stylesheet" href="css/jquery-ui.css">				
			<link rel="stylesheet" href="css/nice-select.css">							
			<link rel="stylesheet" href="css/animate.min.css">
			<link rel="stylesheet" href="css/owl.carousel.css">				
			<link rel="stylesheet" href="css/main.css">
		</head>
		<body>	
		<p class="poEnsima">Falta algún campo</p>
		<META HTTP-EQUIV="REFRESH" CONTENT="2;URL=nuevoUsuario.html">
				<header id="header">
						<div class="header-top">
							<div class="container">
							  <div class="row align-items-center">
								  <div class="col-lg-12 col-sm-12 col-12 header-top-right">
								  </div>
							  </div>			  					
							</div>
						</div>
						<div class="container main-menu">
							<div class="row align-items-center justify-content-between d-flex">
							  <div id="logo">
								<a href="inicio.html"><img src="img/logo.png" alt="" title="" width="110px" height="55px" /></a>
							  </div>
							  <nav id="nav-menu-container">
							  </nav>					      		  
							</div>
						</div> 
					</header>
			<section class="banner-area relative">
				<div class="container">
					<div class="row d-flex align-items-center">
						<div class="about-content col-lg-2"></div>
						<form name="registro" action="ServletUsuarios" method="get">
							<div style="color: white;font-size:200%;">
							<div class="row">
							<div class="col-6">
								Nombre*:<br><br>
								<input type="text" name="nom"/><br><br>
								Apellidos*:<br><br>
								<input type="text" name="apell"/><br><br>
								Dirección de Correo*:<br><br>
								<input type="text" name="email"/><br><br>
								Telefono*:<br><br>
								<input type="number" name="tlf"/><br><br>
							</div>
							<div class="col-6">
								Modelo de coche:<br><br>
								<input type="text" name="coche"/><br><br>
								Dirección*:<br><br>
								<input type="text" name="dir"/><br><br>
								Edad:<br><br>
								<input type="number" name="edad"/><br><br>
								Clave:<br><br>
								<input type="password" name="psswd"/><br><br>
								<input type="submit" value="Registrar" style="border: 10px solid rgb(255, 233, 0);color:white;background:rgb(255, 233, 0);font-size:80%"/>
							</div>
						</div>
					</div>
					</form>	
					</div>
				</div>
			</section>		 

						<!-- start footer Area -->		
						<footer class="footer-area section-gap">
								<div class="container">
									<div class="row">
											<div class="single-footer-widget">
												<h6>Recuerda</h6>
												<p>
													Los niños sueñan con su futuro. Comparte coche contribuyendo a la no contaminación y no se lo arrebates. 
												</p>
												<h6>Contacto</h6>
												<p>
													Si desea contactar con nosotros, <a href="../enviarEmail.html" target="_blank"> haga click aqui</a>
												</p>
											</div>
									</div>
									<div class="row footer-bottom d-flex justify-content-between align-items-center">
										<p class="col-lg-8 col-sm-12 footer-text m-0"><!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. -->
				Copyright &copy;<script>document.write(new Date().getFullYear());</script> All rights reserved | This template is made with <i class="fa fa-heart-o" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
				<!-- Link back to Colorlib can't be removed. Template is licensed under CC BY 3.0. --></p>
									</div>
								</div>
							</footer>
							<!-- End footer Area -->

			<script src="js/vendor/jquery-2.2.4.min.js"></script>
			<script src="js/popper.min.js"></script>
			<script src="js/vendor/bootstrap.min.js"></script>			
			<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBhOdIF3Y9382fqJYt5I_sswSrEw5eihAA"></script>		
 			<script src="js/jquery-ui.js"></script>					
  			<script src="js/easing.min.js"></script>			
			<script src="js/hoverIntent.js"></script>
			<script src="js/superfish.min.js"></script>	
			<script src="js/jquery.ajaxchimp.min.js"></script>
			<script src="js/jquery.magnific-popup.min.js"></script>						
			<script src="js/jquery.nice-select.min.js"></script>					
			<script src="js/owl.carousel.min.js"></script>							
			<script src="js/mail-script.js"></script>	
			<script src="js/main.js"></script>	
		</body>
	</html>

		