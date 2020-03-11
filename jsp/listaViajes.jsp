<!-- Muestra una lista con los viajes disponibles segun los campos requeridos por el usuario -->
<%@page import="java.util.*"%>
<%@page import="es.unizar.sisinf.data.vo.ViajeVO"%>
<%@page language="java" contentType="text/html; charset=UTF-8"
 	pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
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
			<style>
				table#ViajesDisponibles {
					width: 150%;
					background-color: #f1f1c1;
				}
				th, td {
					text-align:center;
					padding: 15px;
				}
				.buttonlinklista {
					background: none!important;
					border: none;
					padding: 0!important;
					/*optional*/
					font-family: arial, sans-serif;
					/*input has OS specific font-family*/
					color: #069;
					text-decoration: underline;
					cursor: pointer;
				}
			</style>
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
								<ul class="nav-menu">
								  <li><a href="inicio.html">Página principal</a></li>
								  <li><a href="packages.html">Mis viajes</a></li>
								  <li><a href="ServletMostrarUsuario">Perfil</a></li>
								  <li><a href="ServletUsuariosConConversaciones">Mensajes</a></li>	
								  <li><a href="publicarViaje.html">Nuevo Viaje</a></li>
								</ul>
							  </nav>					      		  
							</div>
						</div> 
					</header> 
			
			<!-- start banner Area -->

			<section class="about-banner relative">
					<div class="overlay overlay-bg"></div>
					<div class="container">				
						<div class="row d-flex align-items-center justify-content-center">
							<div class="about-content col-lg-12">
								<h1 class="text-white">
									Viajes Disponibles				
								</h1>	
							</div>	
						</div>
					</div>
				</section>

			<!-- End banner Area -->
			<script>
				function onlyOne(checkbox) {
					var checkboxes = document.getElementsByName('check')
					checkboxes.forEach((item) => {
						if (item !== checkbox) item.checked = false
				})
				}
			</script>

			<section class="destinations-area section-gap">
				<div class="container">
						<% List<ViajeVO> viajes = (List<ViajeVO>) request.getAttribute("ListaViajes");
						ViajeVO viaje = viajes.get(0);%>
						<p><span style="border: 10px solid rgb(95, 141, 75);align:center;color:white;background:rgb(95, 141, 75);font-size:250%;">Viajes disponibles</span></p>

						<table>
							<tr>
								<td width="50%"><h2>Desde <%=viaje.getOrigen()%> <br> 
								Hasta <%=viaje.getDestino()%> </h2></td>
								<%int fecha = viaje.getDate();
								String f = Integer.toString((fecha/100)%100)+'/'+Integer.toString(fecha%100)+'/'+Integer.toString(((fecha/100)/100)%10000);%> 
								<td width="50%"><h2>El Dia: <%=f%></h2></td>
							</tr>
						</table>

						<form action="ServletViajeReservado" class="form-wrap" method="post">
							<div class="row d-flex justify-content-center">
								<table id=ViajesDisponibles>
									<tr>
										<th></th>
										<th>Hora Salida</th>
										<th>Hora Llegada</th>
										<th>Conductor</th>
										<th>Numero de Plazas</th>
									</tr>
									<c:forEach var="viaje" items="${ListaViajes}">
										<tr>
											<td><input type="checkbox" name="check" onclick="onlyOne(this)" value="${viaje.id}"/></td>
											<td><c:out value="${viaje.horaIni}"/></td>
											<td><c:out value="${viaje.horaFin}" /></td>
											<td><input type="submit" class="buttonlinklista" name="user" value="${viaje.conductor}" onclick="form.action='ServletMostrarUsuario';"/></td>
											<td><c:out value="${viaje.nPlazas}" /></td>
										</tr>
									</c:forEach>
								</table>
								<td><input type="submit" value="Reservar" class="primary-btn text-uppercase"/></td>
							</div>
						</form>
				</div>
			</section>

						<%--<form action="ServletViajeReservado" class="form-wrap" method="post">
						<%
							for(int i = 0; i < viajes.size(); i++){
								ViajeVO v = viajes.get(i);
								String u = listaUsers.get(i);
							%>
								<tr>
									<td><input type="checkbox" name="check" onclick="onlyOne(this)"/></td>
									<td><%=v.getHoraIni()%></td>
									<td><%=v.getHoraFin()%></td>
									<td><% request.setAttribute("idViaje",v.getId()); request.setAttribute("user",v.getConductor());%> <a href="jsp/otroPerfil.jsp" target="_blank"><%=u%>/></td>
									<td><%=v.getnPlazas()%></td>
								</tr>
							<%
							}%>
							<input type="submit" value="Reservar" class="primary-btn text-uppercase"/>	
						</form>
						</table>--%>



			<section class="banner-area relative">
					
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
										Si desea contactar con nosotros, <a href="enviarEmail.html" target="_blank"> haga click aqui</a>
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
