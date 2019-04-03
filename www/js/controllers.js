angular.module('app.controllers', [])
  
.controller('loginCtrl', function($scope, usuarioService, $state, $ionicPopup, sharedConn) {
  console.log("Bienvenido a la Plataforma");
  $scope.usuarioLogin={};


  var XMPP_DOMAIN  = 'ajustadoati.com';     // Domain we are going to be connected to.
  var xmpp_user    = 'admin';     // xmpp user name
  var xmpp_pass    = 'admin';
  
 
//sharedConn.login(xmpp_user,XMPP_DOMAIN,xmpp_pass);  //Debuggin purpose

  $scope.loginUsuario = function (newUsuarioForm) {
     console.log("saving user");
         //uuu
          sharedConn.login($scope.usuarioLogin.user,XMPP_DOMAIN,$scope.usuarioLogin.password);
           
      /*usuarioService.getUserByUserAndLogin($scope.usuarioLogin)
        .success(function (data) {

            console.log('Saved User '+data.status);
            $scope.usuarioLogin={};
            if(!(data.status != null && data.status != undefined)){
             console.log('User exist '+data.user);
               //Calling the login function in sharedConn  
            
              //$state.go("tabsController.solicitudes");
              
            }else{
              var alertPopup = $ionicPopup.alert({
                title: 'Usuario o password incorrectos',
                template: 'Por favor intenta de nuevo!'
              });
            }
            
            

        }).
        error(function(error) {
            $scope.status = 'Unable to get user: ' + error.message;
        });*/
  }
 


})
   
.controller('registroCtrl', function($scope) {

})
   
.controller('registroVendedorCtrl', function($scope, $state, categoriaService, proveedorService, $cordovaGeolocation, MapService) {
	console.log("registroVendedorCtrl");
	$scope.proveedor={};
  $scope.categorias=[];
  $scope.categoriasSelected=[];
  $scope.proveedor.usuario={};
  $scope.proveedor.categorias=[];

 
      //cargando mapa desde el service
      MapService.createByCurrentLocation(function (marker) {
                console.log("Llamando al service");
                marker.options.labelContent = 'Usted esta aqu&iacute;';
                $scope.proveedor.usuario.latitud=marker.latitude;
                $scope.proveedor.usuario.longitud=marker.longitude;
                //$scope.map.markers.push(marker);
                //refresh(marker
                var latLng = new google.maps.LatLng($scope.proveedor.usuario.latitud, $scope.proveedor.usuario.longitud);
 
          var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
       
          $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
          google.maps.event.addListenerOnce($scope.map, 'idle', function(){
       
                var marker = new google.maps.Marker({
                  map: $scope.map,
                  animation: google.maps.Animation.DROP,
                  position: latLng
              });      
             
              var infoWindow = new google.maps.InfoWindow({
                  content: "Here I am!"
              });
             
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
            });
          });
     });
  //$scope.data = [{id: 1, value: "Item 1"}, {id: 2, value: "Item 2"}, {id: 3, value: "Item 3"}];

  $scope.onValueChanged = function(value){
    console.log(value);
    var cats=value.split("-");  
    if(cats.length>0){
      
      for(var i=0;i<cats.length;i++){
        console.log("categoria:"+cats[i]);
        for(var j=0; j<$scope.categorias.length;j++){
                    var categoria=[];
                    
                    //categoria.selected=false;
                    categoria.id=j;
                    categoria.nombre=$scope.categorias[j].nombre;
                    categoria.descripcion=$scope.categorias[j].descripcion;
                    
                    if(categoria.nombre===cats[i]){
                      console.log("Se agrega la categoria:"+categoria.nombre);
                      $scope.categoriasSelected.push(categoria);
                    }
               }
      }
    }

  }

  getCategorias();

   function getCategorias() {
    console.log("Ctrl. getting categorias")
        categoriaService.getCategorias()
            .success(function (categorias) {
                for(var i=0; i<categorias.length;i++){
                    var categoria=[];
                    
                    categoria.selected=false;
                    categoria.id=i;
                    categoria.nombre=categorias[i].nombre;
                    categoria.descripcion=categorias[i].descripcion;
                    $scope.categorias.push(categoria);
                
               }
                $scope.data = categorias;
            })
            .error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }


	$scope.crearVendedor = function (newVendedorForm) {
                console.log("guardando proveedor !!"+ $scope.proveedor);
                console.log("nombre: "+$scope.proveedor.usuario.nombre);
                console.log("email: "+$scope.proveedor.usuario.email);
               // console.log("lat: "+$scope.usuario.latitud);
                //console.log("long: "+$scope.usuario.longitud);
                console.log("user: "+$scope.proveedor.usuario.user);
                console.log("pass: "+$scope.proveedor.usuario.password);
                console.log("twitter:"+$scope.proveedor.usuario.twitter);
                console.log("twitter:"+$scope.proveedor.usuario.telefono);


               //$scope.proveedor.usuario.latitud=2.992929;
               //$scope.proveedor.usuario.longitud=55.992929;

               for(var i=0; i<$scope.categoriasSelected.length;i++){
                console.log("categorias:"+$scope.categoriasSelected[i].nombre);
                var categoria={};
                //categoria.id=$scope.selection[i];
                categoria.nombre=$scope.categoriasSelected[i].nombre;
                categoria.descripcion=$scope.categoriasSelected[i].descripcion;
                $scope.proveedor.categorias.push(categoria);
              }
              for(var i=0; i<$scope.proveedor.categorias.length;i++){
                console.log("categoriasrazon:"+$scope.proveedor.categorias[i].nombre);
                
              }
               
        		proveedorService.saveProveedor($scope.proveedor)
	            .success(function () {
	                console.log('Saved Proveedor.');
	                $scope.proveedor={};
                  $scope.categoriasSelected=[];
	                $state.go("login");
	                //$scope.customers.push(cust);

	            }).
	            error(function(error) {
	                $scope.status = 'Unable to insert proveedor: ' + error.message;
	            });
      }
})

   
.controller('registroUsuarioCtrl', function($scope, usuarioService, $state, MapService, categoriaService, proveedorService, $ionicPlatform) {
	console.log("registroUsuarioCtrl");
	$scope.usuario={};
  $scope.proveedor={};
  $scope.categorias=[];
  $scope.categoriasSelected=[];
  $scope.proveedor.usuario={};
  $scope.proveedor.categorias=[];

  $scope.onValueChanged = function(value){
    console.log(value);
    var cats=value.split("-");  
    if(cats.length>0){
      
      for(var i=0;i<cats.length;i++){
        console.log("categoria:"+cats[i]);
          for(var j=0; j<$scope.categorias.length;j++){
                    var categoria=[];
                    
                    //categoria.selected=false;
                    categoria.id=j;
                    categoria.nombre=$scope.categorias[j].nombre;
                    categoria.descripcion=$scope.categorias[j].descripcion;
                    
                    if(categoria.nombre===cats[i]){
                      console.log("Se agrega la categoria:"+categoria.nombre);
                      $scope.categoriasSelected.push(categoria);
                    }
               }
      }
    }

  }

  getCategorias();

   function getCategorias() {
    console.log("Ctrl. getting categorias nuevas")
        categoriaService.getCategorias()
            .success(function (categorias) {
                for(var i=0; i<categorias.length;i++){
                    var categoria=[];
                    
                    categoria.selected=false;
                    categoria.id=i;
                    categoria.nombre=categorias[i].nombre;
                    categoria.descripcion=categorias[i].descripcion;
                    $scope.categorias.push(categoria);
                
               }
                $scope.data = categorias;
            })
            .error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }
 
    //cargando mapa desde el service
  
    MapService.createByCurrentLocation(function (marker) {
              console.log("Llamando al service");
              marker.options.labelContent = 'Usted esta aqu&iacute;';
              $scope.usuario.latitud=marker.latitude;
              $scope.usuario.longitud=marker.longitude;
              //$scope.map.markers.push(marker);
              //refresh(marker
              var latLng = new google.maps.LatLng($scope.usuario.latitud, $scope.usuario.longitud);

        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
     
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){
     
              var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });      
           
            var infoWindow = new google.maps.InfoWindow({
                content: "Here I am!"
            });
           
          google.maps.event.addListener(marker, 'click', function () {
              infoWindow.open($scope.map, marker);
          });
        });
   });
              


	     $scope.crearUsuario = function (newUsuarioForm) {
                console.log("guardando usuario !!"+ $scope.usuario);
                console.log("nombre: "+$scope.usuario.nombre);
                console.log("email: "+$scope.usuario.email);
                console.log("lat: "+$scope.usuario.latitud);
                console.log("long: "+$scope.usuario.longitud);
                console.log("user: "+$scope.usuario.user);
                console.log("pass: "+$scope.usuario.password);
                console.log("twitter:"+$scope.usuario.telefono);
                if($scope.categoriasSelected.length > 0){
                 for(var i=0; i<$scope.categoriasSelected.length;i++){
                    console.log("categorias:"+$scope.categoriasSelected[i].nombre);
                    var categoria={};
                    //categoria.id=$scope.selection[i];
                    categoria.nombre=$scope.categoriasSelected[i].nombre;
                    categoria.descripcion=$scope.categoriasSelected[i].descripcion;
                    $scope.proveedor.categorias.push(categoria);
                  }
                  $scope.proveedor.usuario=$scope.usuario;
                  proveedorService.saveProveedor($scope.proveedor)
                    .success(function () {
                        console.log('Saved Proveedor.');
                        $scope.proveedor={};
                        $scope.categoriasSelected=[];
                        $state.go("login");
                        //$scope.customers.push(cust);

                    }).
                    error(function(error) {
                        $scope.status = 'Unable to insert proveedor: ' + error.message;
                    });
                  }else{
               
                		usuarioService.saveUsuario($scope.usuario)
        	            .success(function () {
        	                console.log('Saved Usuario.');
        	                $scope.usuario={};
        	                $state.go("login");
        	                //$scope.customers.push(cust);

        	            }).
        	            error(function(error) {
        	                $scope.status = 'Unable to insert usuario: ' + error.message;
        	            });
                  }
      }

})
   
.controller('busquedaCtrl', function($scope, categoriaService, consultaService, $cordovaGeolocation, MapService, sharedConn, $stateParams, ChatDetails, $ionicPopup) {
  console.log("busquedaCtrl")
  $scope.categorias=[];
  $scope.categoriasSelected=[];
  $scope.latitud="";
  $scope.longitud="";
  $scope.consulta={};
  $scope.consulta.producto={};
  $scope.consulta.usuario={};
  $scope.consulta.categoria={};
  $scope.proveedores=[];
  $scope.map={};
  $scope.markers=[];
  $scope.mensaje=$stateParams.mensaje;
  


  $scope.userActual="";

  if(sharedConn.getConnectObj()!=null)
    $scope.userActual=sharedConn.getConnectObj().jid.split("@")[0];

  $scope.borrar = function(){
    console.log("resetting searching");
    $scope.consulta.producto.nombre="";
    $scope.consulta.producto.descripcion="";
    if($scope.markers.length > 0){
      for (var i=0;i<$scope.markers.length;i++) {
       
            $scope.markers[i].setMap(null);
           
      }
     $scope.markers=[];
   }

  };

  var ws = new WebSocket('wss://ajustadoati.com:8443/ajustadoatiWS/openfire');

    ws.onopen = function () {
        console.log('open');
        
        //this.send('hello');         // transmit "hello" after connecting
    };

    ws.onmessage = function (event) {
        console.log(event.data);   
        console.log("receiving"+event.data);
        var obj = JSON.parse(event.data);

        console.log("receiving from: "+obj.user);
        console.log("message: "+obj.message);
        //var user=$scope.getUser(obj.user);
        
        //console.log("obteniendo usuario: "+user.nombre);
        //$scope.addLocation(obj.latitud, obj.longitud); // will be "hello"
        $scope.setMensajeProveedor(obj, obj.message);
        //this.close();
    };

    ws.onerror = function () {
        console.log('error occurred!');
    };

    ws.onclose = function (event) {
        console.log('close code=' + event.code);
    };
    //se debe borrar el elemento cuando lo consigue
     //metodo que agrega el mensaje en el objeto proveedor cuando responde
    $scope.setMensajeProveedor=function(usuario, mensaje){
        var resultado = [];
        console.log("size markers: "+$scope.markers.length);
        for (var i=0;i<$scope.markers.length;i++) {
          console.log("agregando mensaje a proveedor: "+usuario.user);
          console.log("proveedor: "+$scope.markers[i].usuario);
          if (usuario.user == $scope.markers[i].usuario) {
              console.log("proveedor encontrado: "+$scope.markers[i].usuario);
              resultado = $scope.markers[i];
              resultado.mensaje=mensaje;
              //almacena su id para borrar;
              console.log("proveedor con mensaje nuevo: "+resultado.mensaje);
              $scope.markers[i].mensaje=mensaje;
              $scope.markers[i].setMap(null);
              $scope.addLocationResponder(usuario.latitud, usuario.longitud, resultado);
              return;

          }
        }
        
        return resultado;
    }

     $scope.addLocation= function(latitud, longitud, data){
          var resultado;
          console.log("****************** agregando egistro:*************"+data.usuario);
          MapService.createByCoords(latitud, longitud, data, function (marker) {
           
             var contentString = '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<center><h3 id="firstHeading">' +data.nombre+'</h3></center>'+
              '<div id="bodyContent">'+
              '<br><b>Tel&eacute;fono:</b> '+marker.telefono+
              '<br><b>Usuario:</b>  '+ marker.usuario+
              '<br><b>Mensaje:</b> '+marker.mensaje+
              '</a></div>'+
              '</div>';
            var latLng = new google.maps.LatLng(marker.latitude, marker.longitude);

           
            
               console.log("listeners");
                  var mark = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng,
                     mensaje:marker.mensaje,
                    nombre:marker.nombre,
                    telefono:marker.telefono,
                    usuario:marker.usuario,
                });      
               
               $scope.markers.push(mark);
               console.log("size: "+$scope.markers.length);
                var infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });
               
                google.maps.event.addListener(mark, 'click', function () {

                    infoWindow.open($scope.map, mark);
                });
                resultado = mark;
            
          });
          
           // $scope.map.markers.push(marker);
            //refresh(marker);
          return resultado;
        }

        $scope.addLocationResponder= function(latitud, longitud, data){
          var resultado;
          var image = {
            url: 'img/location_resp.png',
            size: new google.maps.Size(20, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 32)
          };
        
          var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
          };
          console.log("****************** agregando egistro:*************"+data.usuario);
          MapService.createByCoords(latitud, longitud, data, function (marker) {
           
             var contentString = '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<center><h3 id="firstHeading">' +data.nombre+'</h3></center>'+
              '<div id="bodyContent">'+
              '<br><b>Tel&eacute;fono:</b> '+marker.telefono+
              '<br><b>Usuario:</b>  '+ marker.usuario+
              '<br><b>Mensaje:</b> <a href="#/homeVendedor/requests/'+marker.usuario+'">  '+marker.mensaje+
              '</a></div>'+
              '</div>';
            if($scope.userActual==""){
              contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">Proveedor</h1>'+
                '<div id="bodyContent">'+
                '<p><b>Nombre:</b> ' +marker.nombre+
                '<br><b>Tel&eacute;fono:</b> '+marker.telefono+
                '<br><b>Usuario:</b>  '+ marker.usuario+
                '<br><b>Mensaje:</b>  '+marker.mensaje+
                '</div>'+
                '</div>';

            }
            var latLng = new google.maps.LatLng(marker.latitude, marker.longitude);

           
            
               console.log("listeners");
                  var mark = new google.maps.Marker({
                    map: $scope.map,
                    icon: image,
                    shape: shape,
                    animation: google.maps.Animation.DROP,
                    position: latLng,
                     mensaje:marker.mensaje,
                    nombre:marker.nombre,
                    telefono:marker.telefono,
                    usuario:marker.usuario,
                });      
               
               $scope.markers.push(mark);
               console.log("size: "+$scope.markers.length);
                var infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });
               
                google.maps.event.addListener(mark, 'click', function () {

                    infoWindow.open($scope.map, mark);
                });
                resultado = mark;
            
          });
          
           // $scope.map.markers.push(marker);
            //refresh(marker);
          return resultado;
        }

        $scope.addLocationRequest= function(latitud, longitud, data){
          var resultado;
          var image = {
            url: 'img/location_resp.png',
            size: new google.maps.Size(20, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 32)
          };
        
          var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
          };
          console.log("****************** agregando registro:*************"+data.usuario);
          MapService.createByCoords(latitud, longitud, data, function (marker) {
           
             var contentString = '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h3 id="firstHeading">' +data.nombre+'</h3>'+
              '<div id="bodyContent">'+
              '<br><b>Tel&eacute;fono:</b> '+marker.telefono+
              '<br><b>Usuario:</b>  '+ marker.usuario+
              '<br><b>Mensaje:</b> <a href="#/homeVendedor/detalleChat">  '+marker.mensaje+
              '</a></div>'+
              '</div>';
            var latLng = new google.maps.LatLng(marker.latitude, marker.longitude);

           
            
               console.log("listeners");
                  var mark = new google.maps.Marker({
                    map: $scope.map,
                    icon: image,
                    shape: shape,
                    animation: google.maps.Animation.DROP,
                    position: latLng,
                     mensaje:marker.mensaje,
                    nombre:marker.nombre,
                    telefono:marker.telefono,
                    usuario:marker.usuario,
                });      
               
               $scope.markers.push(mark);
               console.log("size: "+$scope.markers.length);
                var infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });
               
                google.maps.event.addListener(mark, 'click', function () {

                    infoWindow.open($scope.map, mark);
                });
                resultado = mark;
            
          });
          
           // $scope.map.markers.push(marker);
            //refresh(marker);
            $scope.mensaje = "";
          return resultado;
        }

     

      MapService.createByCurrentLocation(function (marker) {
                console.log("Llamando al service test");
                marker.options.labelContent = 'Usted esta aqu&iacute;';
                $scope.consulta.usuario.latitud=marker.latitude;
                $scope.consulta.usuario.longitud=marker.longitude;

                
                //refresh(marker
                var latLng = new google.maps.LatLng($scope.consulta.usuario.latitud, $scope.consulta.usuario.longitud);
 
              var mapOptions = {
                center: latLng,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
              };
           
              $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
              google.maps.event.addListenerOnce($scope.map, 'idle', function(){
           
                var mark = new google.maps.Marker({
                  map: $scope.map,
                  animation: google.maps.Animation.DROP,
                  position: latLng,
                  mensaje:"mensaje",
                  nombre:"usuario-ajustado",
                  telefono:"555-555",
                  usuario:"usuario-ajustado",
                });      
                $scope.markers.push(mark);
             console.log("size: "+$scope.markers.length);
             var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h3 id="firstHeading">Proveedor</h3>'+
                '<div id="bodyContent">'+
                '<p><b>Nombre:</b> ' +mark.nombre+
                '<br><b>Tel&eacute;fono:</b> '+mark.telefono+
                '<br><b>Usuario:</b>  '+ mark.usuario+
                '<br><b>Mensaje:</b>  '+mark.mensaje+
                '</div>'+
                '</div>';
              var infoWindow = new google.maps.InfoWindow({
                  content:"Usted esta aqu&iacute; !"
              });
             
            google.maps.event.addListener(mark, 'click', function () {
                infoWindow.open($scope.map, mark);
            });
          });
          if($scope.mensaje != "" && $scope.mensaje != null){
            var data = {
              nombre: "Cliente",
              telefono:"5555",
              mensaje:$scope.mensaje.text,
              usuario:$scope.mensaje.user
            };
            ChatDetailsObj.setTo($scope.mensaje.user+"@ajustadoati.com");
            //$scope.addLocationRequest($scope.mensaje.latitud, $scope.mensaje.longitud, data);
          }
     });

  $scope.onValueChanged = function(value){
    console.log(value); 
    var cats=value.split("-");  
    if(cats.length>0){
      if(cats.length>1){
          var alertPopup = $ionicPopup.alert({
                title: 'Excede la cantidad de categor&iacute;as',
                template: 'Por favor seleccione solo 1 categor&iacute;a!'
              });
      }else{
        for(var i=0;i<cats.length;i++){
          console.log("categoria:"+cats[i]);
          for(var j=0; j<$scope.categorias.length;j++){
                      var categoria=[];
                      
                      //categoria.selected=false;
                      categoria.id=j;
                      categoria.nombre=$scope.categorias[j].nombre;
                      categoria.descripcion=$scope.categorias[j].descripcion;
                      
                      if(categoria.nombre===cats[i]){
                        console.log("Se agrega la categoria:"+categoria.nombre);
                        $scope.categoriasSelected.push(categoria);
                      }
                 }
        }
      }
    }

  }

  getCategorias();

 

   function getCategorias() {
    console.log("Ctrl. getting categorias")
        categoriaService.getCategorias()
            .success(function (categorias) {
                for(var i=0; i<categorias.length;i++){
                    var categoria=[];
                    
                    categoria.selected=false;
                    categoria.id=i;
                    categoria.nombre=categorias[i].nombre;
                    categoria.descripcion=categorias[i].descripcion;
                    $scope.categorias.push(categoria);
                
               }
                $scope.data = categorias;
            })
            .error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }

    $scope.buscar = function (newSearchForm) {
      console.log("realizando busqueda");
                
               var x = new Date();
                $scope.consulta.usuario.nombre="anonimo"+x.getTime();;
                $scope.consulta.usuario.email="anonimo@anonimo";
                $scope.consulta.usuario.user="anonimo";
                $scope.consulta.usuario.password="anonimo";
                $scope.consulta.usuario.telefono="04838383";
                $scope.consulta.producto.descripcion=$scope.consulta.producto.nombre;
                $scope.consulta.producto.id=0;
               //$scope.usuario.latitud=2.992929;
               //$scope.usuario.longitud=55.992929;

               for(var i=0; i<$scope.categoriasSelected.length;i++){
                  console.log("categorias:"+$scope.categoriasSelected[i].nombre);
                  var categoria={};
                  categoria.id=i;
                  categoria.nombre=$scope.categoriasSelected[i].nombre;
                  categoria.descripcion=$scope.categoriasSelected[i].descripcion;
                  $scope.consulta.categoria=categoria;
              }
              /*for(var i=0; i<$scope.categorias.length;i++){
                console.log("categoriasrazon:"+$scope.categorias[i].nombre);
                
              }*/
               var resp="";
               var men="";
               men=$scope.consulta.producto.nombre;
            consultaService.saveConsulta($scope.consulta)
              .success(function (data) {
                  console.log('Saved Consulta.');
                  console.log('response:'+data[0].usuario.user);
                  $scope.proveedores=data;
                  $scope.latitud = $scope.consulta.usuario.latitud;
                  $scope.longitud = $scope.consulta.usuario.longitud;
                  //$scope.consulta={};
                  $scope.categoriasSelected=[];
                  
                  //$state.go("/login");
                  //$scope.customers.push(cust);

              }).
              error(function(error) {
                  $scope.status = 'Unable to insert consulta: ' + error.message;
              }).finally(function(data){
                
                  console.log("size"+$scope.proveedores.length);
                      for(var i=0; i<$scope.proveedores.length; i++){
                          console.log("proveedor: "+$scope.proveedores[i].usuario.user);
                          
                          var usuario = {
                              mensaje:"Sin mensaje",
                              nombre:$scope.proveedores[i].usuario.nombre,
                              telefono:$scope.proveedores[i].usuario.telefono,
                              usuario:$scope.proveedores[i].usuario.user,
                              id: 0         
                          };

                          $scope.addLocation($scope.proveedores[i].usuario.latitud, $scope.proveedores[i].usuario.longitud, usuario)
                          if($scope.userActual != $scope.proveedores[i].usuario.user){
                            if($scope.proveedores.length==(i+1)){
                              console.log("fin de ciclo");
                                resp=resp+$scope.proveedores[i].usuario.user;
                            }else{
                              console.log("sigue el ciclo");
                                resp=resp+$scope.proveedores[i].usuario.user+"&&";
                            }
                          }else {
                            console.log("usuario que envia la consulta");
                          }
                          
                        }
                        console.log("resp"+resp);
                        console.log("data a proveedores");
                        //$scope.sendData();

                        var msg = '{"mensaje":"' + men + '", "users":"'+resp+'","latitud":"'+$scope.latitud+'","longitud":"'+$scope.longitud+'"}';
                        console.log("msj:"+msg);
                        ws.send(msg);

                        
                    });
      }

    
})

.controller('peticionDetalleCtrl', function($scope, categoriaService, consultaService, $cordovaGeolocation, MapService, $stateParams, sharedConn, $ionicScrollDelegate, $ionicPopup, $state) {
  console.log("peticionCtrl"+$stateParams.peticion.latitud);
  $scope.categorias=[];
  $scope.categoriasSelected=[];
  $scope.latitud="";
  $scope.longitud="";
  $scope.consulta={};
  $scope.consulta.producto={};
  $scope.consulta.usuario={};
  $scope.consulta.categoria={};
  $scope.proveedores=[];
  $scope.map={};
  $scope.markers=[];
  $scope.peticion=$stateParams.peticion;
  $scope.response="";

  var latLng = new google.maps.LatLng($scope.peticion.latitud,  $scope.peticion.longitud);
 
  var mapOptions = {
    center: latLng,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  $scope.map = new google.maps.Map(document.getElementById("mapRequest"), mapOptions);


     $scope.addLocation= function(latitud, longitud){
          var resultado;

            var image = {
            url: 'img/location_resp.png',
            size: new google.maps.Size(20, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 32)
          };
        
          var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
          };
          var data = {
             nombre: "Cliente",
            telefono:"5555",
            mensaje:$scope.peticion.text,
            usuario:$scope.peticion.user
          };
          console.log("****************** agregando registro:*************"+data.usuario);
          MapService.createByCoords(latitud, longitud, data, function (marker) {
            console.log("PeticionCtrl-- en el createcoords"+marker.latitude);
             var contentString = '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h1 id="firstHeading" class="firstHeading">' +data.nombre+'</h1>'+
              '<div id="bodyContent">'+
              '<br><b>Tel&eacute;fono:</b> '+marker.telefono+
              '<br><b>Usuario:</b>  '+ marker.usuario+
              '<br><b>Mensaje:</b> '+marker.mensaje+
              '</a></div>'+
              '</div>';
              var latLng = new google.maps.LatLng(marker.latitude, marker.longitude);
 
              var mapOptions = {
                center: latLng,
                zoom: 13,
                mapTypeId: google.maps.MapTypeId.ROADMAP
              };
              //$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            //var latLng = new google.maps.LatLng(marker.latitude, marker.longitude);

           
            
               console.log("listeners");
                 var mark = new google.maps.Marker({
                    map: $scope.map,
                    icon: image,
                    shape: shape,
                    animation: google.maps.Animation.DROP,
                    position: latLng,
                     mensaje:marker.mensaje,
                    nombre:marker.nombre,
                    telefono:marker.telefono,
                    usuario:marker.usuario,
                }); 
                    
               
               $scope.markers.push(mark);
               console.log("size: "+$scope.markers.length);
                var infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });
               
                google.maps.event.addListener(mark, 'click', function () {

                    infoWindow.open($scope.map, mark);
                });
                resultado = mark;
            
          });
          
           // $scope.map.markers.push(marker);
            //refresh(marker);
          return resultado;
        }

        
        $scope.addLocation($scope.peticion.latitud, $scope.peticion.longitud);

        $scope.addLocationResponder= function(latitud, longitud, data){
          var resultado;
          var image = {
            url: 'img/location_resp.png',
            size: new google.maps.Size(20, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 32)
          };
        
          var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
          };
          console.log("****************** agregando egistro:*************"+data.usuario);
          MapService.createByCoords(latitud, longitud, data, function (marker) {
           
             var contentString = '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h1 id="firstHeading" class="firstHeading">' +data.nombre+'</h1>'+
              '<div id="bodyContent">'+
              '<br><b>Tel&eacute;fono:</b> '+marker.telefono+
              '<br><b>Usuario:</b>  '+ marker.usuario+
              '<br><b>Mensaje:</b> <a href="#/homeVendedor/requests/'+marker.usuario+'">  '+marker.mensaje+
              '</a></div>'+
              '</div>';
            var latLng = new google.maps.LatLng(marker.latitude, marker.longitude);

           
            
               console.log("listeners");
                  var mark = new google.maps.Marker({
                    map: $scope.map,
                    icon: image,
                    shape: shape,
                    animation: google.maps.Animation.DROP,
                    position: latLng,
                     mensaje:marker.mensaje,
                    nombre:marker.nombre,
                    telefono:marker.telefono,
                    usuario:marker.usuario,
                });      
               
               $scope.markers.push(mark);
               console.log("size: "+$scope.markers.length);
                var infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });
               
                google.maps.event.addListener(mark, 'click', function () {

                    infoWindow.open($scope.map, mark);
                });
                resultado = mark;
            
          });
          
           // $scope.map.markers.push(marker);
            //refresh(marker);
          return resultado;
        }

     
     //metodo para responder a las petciones
    $scope.sendMsg=function(to,body){
      var to_jid  = Strophe.getBareJidFromJid(to);
      console.log("sending message"+to_jid);
      var timestamp = new Date().getTime();
      var reqChannelsItems = $msg({id:timestamp, to:to_jid , type: 'chat' })
                     .c("body").t(body);
      $scope.response="";
      console.log(reqChannelsItems);
      sharedConn.getConnectObj().send(reqChannelsItems.tree());
      /*var alertPopup = $ionicPopup.alert({
          title: 'Mensaje Enviado',
          template: 'Se ha enviado mensaje a Usuario. Gracias por responder!'
      });*/
      //$state.go('tabsController.favoritos');
    };
  
  

    $scope.showSendMessage = function() {
      
      $scope.sendMsg($scope.peticion.user+"@ajustadoati.com",$scope.peticion.code+"---"+$scope.response);  

        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

        /*$scope.messages.push({
          userId: $scope.myId,
          text: $scope.response,
          time: d
        });

        delete $scope.data.message;*/
        $ionicScrollDelegate.scrollBottom(true);

    };
    
})
   
.controller('resultadoBusquedaCtrl', function($scope) {

})
   
.controller('solicitudesCtrl', function($scope) {

})
   
.controller('favoritosCtrl', function($scope, Chats, ChatDetails, $state, usuarioService, $ionicPopup, $rootScope) {
  console.log('Favoritos ');
   $scope.add_jid = "";
  $scope.chats = Chats.allRoster();
  $scope.add = function(add_jid){
    //Chats.addNewRosterContact(add_jid);
    console.log('Buscando usuario '+add_jid);
    usuarioService.getUserByUser(add_jid)
        .success(function (data) {
            if(!(data.status != null && data.status != undefined)){
             console.log('User exist '+data.telefono);
               $scope.add_jid = "";
               $state.go('tabsController.detalleFavoritos', {user:data});
              
            }else{
              $scope.add_jid = "";
              var alertPopup = $ionicPopup.alert({
                title: 'Usuario no existe !',
                template: 'Por favor intenta de nuevo!'
              });
            }
        }).
        error(function(error) {
            $scope.status = 'Unable to get user: ' + error.message;
        });
  };



  $scope.favoriteDetails=function(to_id){ 
    usuarioService.getUserByUser(to_id)
        .success(function (data) {
            if(!(data.status != null && data.status != undefined)){
             console.log('User exist '+data.telefono);
               $scope.add_jid = "";
               $state.go('tabsController.infoFavorito', {user:data});
              
            }else{
              $scope.add_jid = "";
              var alertPopup = $ionicPopup.alert({
                title: 'No existe informaci&oacute;n !',
                template: 'Por favor intenta de nuevo!'
              });
            }
        }).
        error(function(error) {
            $scope.status = 'Unable to get user: ' + error.message;
        });
    };




  


})

.controller('peticionCtrl', function($scope, $state, usuarioService, $ionicPopup, $rootScope, Peticiones) {
  console.log('Peticion Ctrl');

  $scope.peticiones = Peticiones.getAll();

  $scope.peticionDetalle=function(id){
    var peticion = Peticiones.getPeticion(id);
    $state.go('tabsController.peticionDetalle', {peticion}, {location: "replace", reload: true});
  }
  
  $scope.add = function(add_jid){
    //Chats.addNewRosterContact(add_jid);
    console.log('Buscando usuario '+add_jid);
    usuarioService.getUserByUser(add_jid)
        .success(function (data) {
            if(!(data.status != null && data.status != undefined)){
             console.log('User exist '+data.telefono);
               $scope.add_jid = "";
               $state.go('tabsController.detalleFavoritos', {user:data});
              
            }else{
              $scope.add_jid = "";
              var alertPopup = $ionicPopup.alert({
                title: 'Usuario no existe !',
                template: 'Por favor intenta de nuevo!'
              });
            }
        }).
        error(function(error) {
            $scope.status = 'Unable to get user: ' + error.message;
        });
  };


  $scope.removePeticion=function(peticion){
    console.log("removing request");
    PeticionObj.removePeticion(peticion);
  }

  $scope.chatDetails=function(to_id){ 

    ChatDetailsObj.setTo(to_id+"@ajustadoati.com");
    $state.go('tabsController.favoritosChat', {}, {location: "replace", reload: true});
    };

  


})
.controller('detalleFavoritosCtrl', function($scope, $stateParams, Chats, usuarioService, sharedConn) {
  console.log("cargando detalle favoritos"+$stateParams.user.user);
  $scope.usuario=$stateParams.user;
  $scope.user = sharedConn.getConnectObj().jid.split("@")[0];
  $scope.addContact = function(){
    console.log("agregando usuario"+$scope.usuario.user);
    usuarioService.addContactToUser($scope.usuario.user, $scope.user)
        .success(function (data) {
            if(data.status != null && data.status != undefined && data.status == "OK"){
             Chats.addNewRosterContact($scope.usuario.user);
              
            }else{
              var alertPopup = $ionicPopup.alert({
                title: 'No se puede agregar contacto !',
                template: 'Por favor intenta de nuevo!'
              });
            }
        })
    
  };
  
})
   
.controller('mensajesCtrl', function($scope, $state, $ionicPopup, $timeout) {


  $scope.createMessage= function(){

    $state.go('tabsController.mensajeNuevo', {}, {location: "replace", reload: true});
  }
  $scope.addMessage = function() {
 
     $ionicPopup.show({
       title: 'Need to get something off your chest?',
       template: '<input type="password" ng-model="data.wifi"><br/><input type="password" ng-model="data.wifi2">'
     }).then(function(res) {
        $scope.messages.$add({
          "message": res
        });
     });
  };
})

.controller('mensajeNuevoCtrl', function($scope, $state, $ionicPopup, $timeout, categoriaService, Chats, sharedConn, $ionicScrollDelegate) {

  $scope.contactos=[];
  $scope.contactosSelected=[];
  $scope.data = Chats.getAllRoster();
  $scope.messages = [];
  $scope.myId = sharedConn.getConnectObj().jid;
  var isIOS = ionic.Platform.isIOS(); 


  $scope.onValueChanged = function(value){
    console.log(value); 
    var cats=value.split("-");  
    if(cats.length>0){
      
      for(var i=0;i<cats.length;i++){
        console.log("contacto:"+cats[i]);
        $scope.contactosSelected.push(cats[i]);
        
      }
    }

  }

  //getContactos();

  function getContactos() {
    console.log("getting contacts"+$scope.roster);
    for(var i=0; i<$scope.roster.length;i++){
        var contacto=[];
        
        contacto.selected=false;
        contacto.id=i;
        contacto.name=$scope.roster[i].name;
        contacto.descripcion=$scope.roster[i].jid;
        $scope.contactos.push(contacto);
    
    }
    $scope.data = $scope.contactos;

  }
  $scope.sendMsg=function(to,body){
    var to_jid  = Strophe.getBareJidFromJid(to);
    console.log("sending message"+to_jid);
    var timestamp = new Date().getTime();
    var reqChannelsItems = $msg({id:timestamp, to:to_jid , type: 'chat' })
                   .c("body").t(body);
    console.log(reqChannelsItems);
    sharedConn.getConnectObj().send(reqChannelsItems.tree()); 
  };
 
  $scope.showSendMessage = function() {

    console.log("sending message"+$scope.contactosSelected.length);

    for(var i=0; i<$scope.contactosSelected.length;i++){
        var contacto=$scope.contactosSelected[i]+"@ajustadoati.com";
        console.log("contact to send: "+contacto);
         $scope.sendMsg(contacto,$scope.data.message);  
    }
    
   

      var d = new Date();
      d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

      $scope.messages.push({
        userId: $scope.myId,
        text: $scope.data.message,
        time: d
      });
      $scope.contactosSelected=[];
      delete $scope.data.message;
      //$ionicScrollDelegate.scrollBottom(true);

  };
   

  $scope.addMessage = function() {
 
     $ionicPopup.show({
       title: 'Need to get something off your chest?',
       template: '<input type="password" ng-model="data.wifi"><br/><input type="password" ng-model="data.wifi2">'
     }).then(function(res) {
        $scope.messages.$add({
          "message": res
        });
     });
  };

  $scope.messageRecieve=function(msg){  
  
    //  var to = msg.getAttribute('to');
    var from = msg.getAttribute('from').split;
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    
    var d = new Date();
      d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

    if (type == "chat" && elems.length > 0) {
      
      var body = elems[0];
      var textMsg = Strophe.getText(body);
      
      
      $scope.messages.push({
        userId: from,
        text: textMsg,
        time: d
      });
      
      $ionicScrollDelegate.scrollBottom(true);
      $scope.$apply();
      
      console.log($scope.messages);
      console.log('Message recieved from ' + from + ': ' + textMsg);
    }
    
  }
  
  
   $scope.$on('msgRecievedBroadcast2', function(event, data) {
    console.log("recibiendo mensaje broadcast");
    $scope.messageRecieve(data);
    })


  $scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);

  };

  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
  };
})

.controller('productosCtrl', function($scope) {

})
      
.controller('perfilCtrl', function($scope) {

})
   
.controller('solicitudCtrl', function($scope) {

})
   
.controller('solicitudes2Ctrl', function($scope) {

})
   
.controller('ubicacionUsuarioCtrl', function($scope) {

})
      
.controller('perfilUsuarioCtrl', function($scope) {

})
   
.controller('detalleResultadoCtrl', function($scope) {

})

.controller('tabsCtrl', function($scope, $ionicScrollDelegate, $rootScope, Chats, ChatDetails, $state, Peticiones) {
  console.log("iniciando tabsCtrl");
  $scope.messages=[];
  $scope.messageRecieve=function(msg){  
    //  var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    
    var d = new Date();
      d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

    if (type == "chat" && elems.length > 0) {
      
      var body = elems[0];
      var textMsg = Strophe.getText(body);
      
      var message={
          userId: from,
          text: textMsg,
          time: d
        };
      $scope.messages.push(message);
      Chats.addMessage(message);
      $ionicScrollDelegate.scrollBottom(true);
      $scope.$apply();
      
      console.log($scope.messages);
      console.log('Message recieved from ' + from + ': ' + textMsg);
      var to_id = from.split("@")[0];
      ChatDetailsObj.setTo(to_id+"@ajustadoati.com");
      $state.go('tabsController.detalleChat', {}, {location: "replace", reload: true});
    }
    
  }

   $scope.messageRecieveFromAdmin=function(msg){  
      //  var to = msg.getAttribute('to');
      var from = msg.getAttribute('from');
      var type = msg.getAttribute('type');
      var elems = msg.getElementsByTagName('body');
      var textMessage = Strophe.getText(elems[0]);
      console.log("admin received:"+msg);
      console.log("type received:"+type);
      var all = textMessage.split("---");
      var text = all[0];
      var latitud = all[1];
      var longitud = all[2];
      console.log("msg received:"+textMessage);
      var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

      //if (type == "chat" && elems.length > 0) {
        
        var body = elems[0];
        var textMsg = Strophe.getText(body);
        
        var message={
            userId: from,
            text: textMsg,
            time: d
          };

        var peticion={
            user:from.split("@")[0],
            text: text,
            latitud:latitud,
            longitud:longitud,
            time: d
          };
        //$scope.messages.push(message);
        //Chats.addMessage(message);
        $ionicScrollDelegate.scrollBottom(true);
        //$scope.$apply();
        
        console.log($scope.messages);
        console.log('Message recieved from ' + from + ': ' + textMsg);
        var to_id = from.split("@")[0];
        ChatDetailsObj.setTo(to_id+"@ajustadoati.com");
        //Peticiones.add(peticion);
        $state.go('tabsController.peticion', {}, {reload: true,inherit: false, notify: true});
    //}
    
  }
  
  
   $rootScope.$on('msgRecievedBroadcast', function(event, data) {
    console.log('Message recieved from ');
    $scope.messageRecieve(data);
    })

   $rootScope.$on('msgRecievedBroadcastAdmin', function(event, data) {
    console.log('Message recieved from admin');
    $scope.messageRecieveFromAdmin(data);
    })

})

.controller('comercianteCtrl', function($scope, $state, usuarioService, $stateParams, ChatDetails) {
  console.log("Comerciante Ctrl");

  $scope.usuario={};

  usuarioService.getUserByUser($stateParams.user)
                      .success(function (data) {
        console.log("nombre:"+data.nombre);
        $scope.usuario = data;
  });

  $scope.chatDetails=function(to_id){ 
    ChatDetailsObj.setTo(to_id+"@ajustadoati.com");
    $state.go('tabsController.detalleChat', {}, {location: "replace", reload: true});
    };


})
.controller('detalleChatCtrl', function($scope, $timeout, $ionicScrollDelegate,sharedConn,ChatDetails, $rootScope) {

  $scope.hideTime = true;
  $scope.data = {};
  $scope.myId = sharedConn.getConnectObj().jid;
  $scope.messages = [];
  $scope.to_id=ChatDetails.getTo();

  var isIOS = ionic.Platform.isIOS(); 
  
    $scope.sendMsg=function(to,body){
    var to_jid  = Strophe.getBareJidFromJid(to);
    console.log("sending message"+to_jid);
    var timestamp = new Date().getTime();
    var reqChannelsItems = $msg({id:timestamp, to:to_jid , type: 'chat' })
                   .c("body").t(body);
    console.log(reqChannelsItems);
    sharedConn.getConnectObj().send(reqChannelsItems.tree()); 
  };
  
  

  $scope.showSendMessage = function() {
    
  $scope.sendMsg($scope.to_id,$scope.data.message);  

    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

    $scope.messages.push({
      userId: $scope.myId,
      text: $scope.data.message,
      time: d
    });

    delete $scope.data.message;
    $ionicScrollDelegate.scrollBottom(true);

  };
  
  
  $scope.messageRecieve=function(msg){  
  
  //  var to = msg.getAttribute('to');
  var from = msg.getAttribute('from');
  var type = msg.getAttribute('type');
  var elems = msg.getElementsByTagName('body');
  
  var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

  if (type == "chat" && elems.length > 0) {
    
    var body = elems[0];
    var textMsg = Strophe.getText(body);
    
    
    $scope.messages.push({
      userId: from,
      text: textMsg,
      time: d
    });
    
    $ionicScrollDelegate.scrollBottom(true);
    $scope.$apply();
    
    console.log($scope.messages);
    console.log('Message recieved from ' + from + ': ' + textMsg);
  }
    
  }
  
  
   $rootScope.$on('msgRecievedBroadcast2', function(event, data) {
    console.log('Message recieved from ');
    $scope.messageRecieve(data);
    })


  $scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);

  };

  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
  };




})
.controller('infoFavoritoCtrl', function($scope, $stateParams, Chats, usuarioService, sharedConn, $state) {
  console.log("cargando info favorito"+$stateParams.user.user);
  $scope.usuario=$stateParams.user;
  $scope.user = sharedConn.getConnectObj().jid.split("@")[0];
  $scope.logout=function(){
    console.log("T");
    sharedConn.logout();
    $state.go('login', {}, {location: "replace", reload: true});
  };

   $scope.chatDetails=function(to_id){ 
    console.log("user: "+to_id);
    ChatDetailsObj.setTo(to_id+"@ajustadoati.com");
    $state.go('tabsController.favoritosChat', {}, {location: "replace", reload: true});
  };
})
.controller('settingsCtrl', function($scope,$state,sharedConn, usuarioService, $window, $ionicHistory) {
  $scope.user=sharedConn.getConnectObj().jid.split("@")[0];
  $scope.usuario={};

   usuarioService.getUserByUser($scope.user)
                      .success(function (data) {
        console.log("nombre:"+data.nombre);
        $scope.usuario = data;
  });
  $scope.logout=function(){
    console.log("T");
    sharedConn.logout();
    //$window.localStorage.clear();
    //$ionicHistory.clearCache();
    //$ionicHistory.clearHistory();
    $state.go('login', {}, {location: "replace", reload: true});
  };


});
 