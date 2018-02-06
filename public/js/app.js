//Definicion de variables y Matrices
matrizJSON              = new Array;
ciudades                = new Array;
tipos                   = new Array;
matrizFiltroPrecios     = new Array;
matrizFiltroCiudades    = new Array;
matrizFiltroTipos       = new Array;
matrizMostrar           = new Array;
matrizResultante        = new Array;
var rangoPrecio         = "";
var precioMin           = "";
var precioMax           = "";
var precioJSON          = "";
var ciudadSeleccionada  = "";
var tipoSeleccionado    = "";
var customSearch        = false;
var hayCiudad           = 0;
var hayTipo             = 0;

//Codigo para eliminar conflictos entre jquery y prototype
var $j = jQuery.noConflict();
$j(document).ready(function()
  {
//    alert("Si salgo es que no hay conflicto!!!");
  });

//Declaracion de funcion para cargar la funcion unique de Prototype
Array.prototype.unique=function(a)
  {
    return function()
      {
        return this.filter(a)
      }
  }

  (function(a,b,c)
    {
      return c.indexOf(a,b+1)<0
    });

//Inicializacion de elementos Select de Materialize
  $j(document).ready(function()
    {
      $j('select').material_select();
    });


//Funcion autoejecutable que establece la comunciacion con el servidor
// y genera la matrices de inmuebles, ciudades y tipos de inmuebles
(function()
  {
    var URL = 'http://localhost:8082/data.json';
    $j.ajax(
      {
        url: URL,
        type:'GET',
        async:true,
        success: function(response)
          {
            var data = response;
            if (data.message && data.message == "Not found")
              {
                alert('No se encontro la informacion');
              }
              else
                {
                  //La matrizJSON contendra todos los inmuebles registrados en el archivo JSON que esta en el servidor
                  matrizJSON = data;
                  iniciarlizarMatrices();

                  // Listar ciudades en la casilla Select
                  $j.each(matrizJSON, (i,ciudad) =>
                    {
                      ciudades.push(matrizJSON[i].Ciudad);
                    })
                  ciudades = (ciudades.unique());
                  $j.each(ciudades, (i,inmueble) =>
                    {
                      $j('select').material_select();
                      $j('#ciudad').append(`<option value="${ciudades[i]}">${ciudades[i]}</option>`);
                    });

                  // Listar tipos en la casilla Select
                  $j.each(matrizJSON, (j,tipo) =>
                    {
                      tipos.push(matrizJSON[j].Tipo);
                    })
                  tipos = (tipos.unique());
                  $j.each(tipos, (j,parametro) =>
                    {
                      $j('select').material_select();
                      $j('#tipo').append(`<option value="${tipos[j]}">${tipos[j]}</option>`);
                      $j('select').material_select();
                    });
                }
          }
      })
  })();

//Inicializador del elemento ionRangeSlider
$j("#rangoPrecio").ionRangeSlider(
  {
    type: "double",
    grid: false,
    min: 0,
    max: 100000,
    from: 1000,
    to: 20000,
    prefix: "$"
  })

//Funcion para mostrar y ocultrar los elementos select de los filtros
function setSearch()
  {
    let busqueda = $j('#checkPersonalizada')
    busqueda.on('change', (e) =>
      {
        if (this.customSearch == false)
          {
            this.customSearch = true
          }
          else
            {
              this.customSearch = false
            }
        $j('#personalizada').toggleClass('invisible')
      })
  }

//Funcion anonima que busca y muestra los inmuebles de acuerdo a los filtros colocados por el usuario
$j( () =>
  {
    //Se preciona el boton Iniciar para aplicar los filtros y mostrar los resultados
    $j("#buscar").on("click", () =>
      {
        hayCiudad = 0;
        hayTipo = 0;
        ciudadSeleccionada = $j('#ciudad').val();
        tipoSeleccionado = $j('#tipo').val();
        $j.each(ciudades, (i,ciudad) =>
          {
            if (ciudadSeleccionada == ciudades[i])
              {
                hayCiudad = 1;
              }
          })

        $j.each(tipos, (i,ciudad) =>
          {
            if (tipoSeleccionado == tipos[i])
              {
                hayTipo = 1;
              }
          })
        //En caso de que no se halla activado el switch para mostrar los filtros select se muestran todos los inmuebles
        if (customSearch == false)
          {
            iniciarlizarMatrices();
            removerElementos();
            activarPanel();
            mostrarElementos(matrizJSON);
          }
          //En caso de que se haya activado el switch y se muestren los filtros select
          else if (customSearch == true)
            {
              iniciarlizarMatrices();
              removerElementos();
              rangoPrecio = $j("#rangoPrecio").data("ionRangeSlider");
              precioMin  = rangoPrecio.result.from;
              precioMax   = rangoPrecio.result.to;
              $j.each(matrizJSON, (i,inmueble) =>
                {
                  precioJSON = (matrizJSON[i].Precio).replace(",","");
                  precioJSON = precioJSON.replace("$","");
                  precioJSON = parseInt(precioJSON);
                  if ((precioJSON >= precioMin) && (precioJSON <= precioMax))
                    {
                      matrizFiltroPrecios.push(matrizJSON[i]);
                    }
                })

              //Caso1: Solo se tiene el rango de precios, no se seleccionada nada en ciudad y tipo
              if ((hayCiudad == 0) && (hayTipo == 0))
                {
                  if (matrizFiltroPrecios.length > 0)
                    {
                      activarPanel();
                      mostrarElementos(matrizFiltroPrecios);
                    }
                    else
                      {
                        removerElementos();
                        alert("No hay inmuebles disponibles bajo los parametros solicitados")
                      }
                }

              //Caso2: Se tiene el rango de precios y se selecciona una ciudad
              if ((hayCiudad == 1) && (hayTipo == 0))
                {
                  $j.each(matrizFiltroPrecios, (i,ciudad) =>
                    {
                      if (matrizFiltroPrecios[i].Ciudad == ciudadSeleccionada)
                        {
                          matrizMostrar.push(matrizFiltroPrecios[i]);
                        }
                    })
                    if (matrizMostrar.length > 0)
                      {
                        activarPanel();
                        mostrarElementos(matrizMostrar);
                      }
                      else
                        {
                          removerElementos();
                          alert("No hay inmuebles disponibles bajo los parametros solicitados")
                        }
                }

                //Caso3: Se tiene el rango de precios y se selecciona un tipo de inmueble
                if ((hayCiudad == 0) && (hayTipo == 1))
                  {
                    $j.each(matrizFiltroPrecios, (i,tipo) =>
                      {
                        if (matrizFiltroPrecios[i].Tipo == tipoSeleccionado)
                          {
                            matrizMostrar.push(matrizFiltroPrecios[i]);
                          }
                      })
                    if (matrizMostrar.length > 0)
                      {
                        activarPanel();
                        mostrarElementos(matrizMostrar);
                      }
                      else
                        {
                          removerElementos();
                          alert("No hay inmuebles disponibles bajo los parametros solicitados")
                        }
                  }

                  //Caso4: Se tiene el rango de precios, se selecciona una ciudad y tambien un tipo de inmueble
                  if ((hayCiudad == 1) && (hayTipo == 1))
                    {
                      $j.each(matrizFiltroPrecios, (i,ciudad) =>
                        {
                          if ((matrizFiltroPrecios[i].Ciudad == ciudadSeleccionada) && (matrizFiltroPrecios[i].Tipo == tipoSeleccionado))
                            {
                              matrizMostrar.push(matrizFiltroPrecios[i]);
                            }
                        })
                      if (matrizMostrar.length > 0)
                        {
                          activarPanel();
                          mostrarElementos(matrizMostrar);
                        }
                        else
                          {
                            removerElementos();
                            alert("No hay inmuebles disponibles bajo los parametros solicitados")
                          }
                    }
            }
      })
  })

//Funcion que activa el panel para pder mostrar los resultados de la busqueda
activarPanel = () =>
  {
    $j('.lista').show();
    $j('#card').hide();
  }

//Funcion que imprime los resultados en pantalla a traves de un append de elementos html
mostrarElementos = (json) =>
  {
    $j.each(json, (i,inmueble) =>
      {
        $j("#card").after(  "<div class='card horizontal' id='card'>" +
                            "<div class='card-image'>" +
                            "<img src='img/home.jpg'>" +
                            "</div>" +
                            "<div class='card-stacked'>"+
                            "<div class='card-content'>" +
                            "<div id='direccion' class='direccion'>" +
                            "<b>Direccion: </b><span>"+ json[i].Direccion +"</span>" +
                            "</div>" +
                            "<div id='ciudad' class='ciudad'>" +
                            "<b>Ciudad: </b><span>" + json[i].Ciudad + "</span>" +
                            "</div>" +
                            "<div id='telefono' class='telefono'>" +
                            "<b>Telefono: </b><span>" + json[i].Telefono + "</span>" +
                            "</div>" +
                            "<div id='codigo_postal' class='codigo_postal'>" +
                            "<b>Código postal: </b><span>" + json[i].Codigo_Postal + "</span>" +
                            "</div>" +
                            "<div id='precio' class='precio'>" +
                            "<b>Precio: </b><span>" + json[i].Precio + "</span>" +
                            "</div>" +
                            "<div id='tipo' class='tipo'>" +
                            "<b>Tipo: </b><span>" + json[i].Tipo + "</span>" +
                            "</div>" +
                            "</div>" +
                            "<div class='card-action right-align'>" +
                            "<a href='#'>Ver más</a>" +
                            "</div>" +
                            "</div>" +
                            "</div>");
      })
  }

//Funcion que inicializa las matrices de una busqueda a otra
iniciarlizarMatrices = () =>
  {
    matrizFiltroPrecios.length  = 0;
    matrizFiltroCiudades.length = 0;
    matrizFiltroTipos.length    = 0;
    matrizMostrar.length        = 0;
    matrizResultante.length     = 0;
  }

//Funcion que remueve todos los elementos de una busqueda impresos en pantalla
removerElementos = () =>
  {
    $j(".card[id='card']").empty();
  }

setSearch()
