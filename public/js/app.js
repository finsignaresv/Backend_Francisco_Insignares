//Definicion de variables y Matrices
matrizJSON = new Array;

//Inicializador del elemento Slider
$("#rangoPrecio").ionRangeSlider(
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
    let busqueda = $('#checkPersonalizada')
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
        $('#personalizada').toggleClass('invisible')
      })
  }

$(function()
  {
    $("#buscar").on("click", function()
      {
        //Se preciona el boton Iniciar
        if ($('#ciudad').is(':hidden'))
          {
            ajaxAsync();
          }
      })
  })



ajaxAsync = function()
  {
    var URL = 'http://localhost:8082/data.json';
    $.ajax(
      {
        url: URL,
        type:'GET',
        async:true,
        success: function(response)
          {
            var data = response
            if (data.message && data.message == "Not found")
              {
                alert('No se encontro la informacion');
              }
              else
                {
                  $('.lista').show();
                  $('#card').hide();
                  matrizJSON = data;
                  $(".Direccion span").text(matrizJSON[0].Direccion);
                  $.each(data, (i,inmueble) =>
                    {
                      $("#card" ).after(  "<div class='card horizontal' id='card'>" +
                                          "<div class='card-image'>" +
                                          "<img src='img/home.jpg'>" +
                                          "</div>" +
                                          "<div class='card-stacked'>"+
                                          "<div class='card-content'>" +
                                          "<div id='direccion' class='direccion'>" +
                                          "<b>Direccion: </b><span>"+ matrizJSON[i].Direccion +"</span>" +
                                          "</div>" +
                                          "<div id='ciudad' class='ciudad'>" +
                                          "<b>Ciudad: </b><span>" + matrizJSON[i].Ciudad + "</span>" +
                                          "</div>" +
                                          "<div id='telefono' class='telefono'>" +
                                          "<b>Telefono: </b><span>" + matrizJSON[i].Telefono + "</span>" +
                                          "</div>" +
                                          "<div id='codigo_postal' class='codigo_postal'>" +
                                          "<b>Código postal: </b><span>" + matrizJSON[i].Codigo_Postal + "</span>" +
                                          "</div>" +
                                          "<div id='precio' class='precio'>" +
                                          "<b>Precio: </b><span>" + matrizJSON[i].Precio + "</span>" +
                                          "</div>" +
                                          "<div id='tipo' class='tipo'>" +
                                          "<b>Tipo: </b><span>" + matrizJSON[i].Tipo + "</span>" +
                                          "</div>" +
                                          "</div>" +
                                          "<div class='card-action right-align'>" +
                                          "<a href='#'>Ver más</a>" +
                                          "</div>" +
                                          "</div>" +
                                          "</div>");
                    })
                }
          }
      }
    )
  }



//  var sighting = "<div><span class=\"feed_name\"></span></div>",
    //  $elem = $(sighting).find("span.feed_name").text("hello world").parent();
  //$("#sightings").append($elem);

setSearch()
