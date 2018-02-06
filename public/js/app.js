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

(function()
  { /* ... */
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
                  matrizJSON = data;
                  iniciarlizarMatrices();
                  //AQUI
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

$j(document).ready(function()
  {
    filtrarCiudad = function(matriz)
      {
        $j.each(matriz, (i,ciudad) =>
          {
            if (matriz[i].Ciudad == ciudadSeleccionada)
              {
                matrizFiltroCiudades.push(matriz[i]);
              }
          })
        return matrizFiltroCiudades;
      }

    filtrarTipo = function(matriz)
      {
        tipoSeleccionado = $j('#tipo').val();
        $j.each(matriz, (i,tipo) =>
          {
            if (matriz[i].Tipo == tipoSeleccionado)
              {
                matrizFiltroTipos.push(matriz[i]);
              }
            })
          return matrizFiltroTipos;
        }
    });


//Inicializador del elemento Slider
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

$j(function()
  {
    $j("#buscar").on("click", function()
      {
        //Se preciona el boton Iniciar
        if (customSearch == false)
          {
            activarPanel();
            mostrarElementos(matrizJSON);
          }
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
                  matrizMostrar = matrizFiltroPrecios;
                  ciudadSeleccionada = $j('#ciudad').val();
                  tipoSeleccionado = $j('#tipo').val();
                  if (ciudadSeleccionada != "")
                    {
                      $j.each(matrizFiltroPrecios, (i,ciudad) =>
                        {
                          if (matrizFiltroPrecios[i].Ciudad = ciudadSeleccionada)
                            {
                              matrizResultante.push(matrizFiltroPrecios[i]);
                            }
                            if (matrizFiltroPrecios[i].Tipo = tipoSeleccionado)
                              {
                                matrizMostrar.push(matrizFiltroPrecios[i]);
                              }
                        })
                      console.log(matrizMostrar);
                    }
                    else if ((ciudadSeleccionada = "") && (tipoSeleccionado != ""))
                      {
                        $j.each(matrizFiltroPrecios, (i,tipo) =>
                          {
                            if (matrizFiltroPrecios[i].Tipo = tipoSeleccionado)
                              {
                                matrizMostrar.push(matrizFiltroPrecios[i]);
                              }
                          })
                      }
                    activarPanel();
                    mostrarElementos(matrizMostrar);
            }
      })
  })

activarPanel = function()
  {
    $j('.lista').show();
    $j('#card').hide();
  }

mostrarElementos = function(json)
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

iniciarlizarMatrices = function()
  {
    matrizFiltroPrecios.length  = 0;
    matrizFiltroCiudades.length = 0;
    matrizFiltroTipos.length    = 0;
    matrizMostrar.length        = 0;
  }

removerElementos = function()
  {
    $j(".card[id='card']").empty();
  }

//  var sighting = "<div><span class=\"feed_name\"></span></div>",
    //  $elem = $(sighting).find("span.feed_name").text("hello world").parent();
  //$("#sightings").append($elem);

setSearch()
