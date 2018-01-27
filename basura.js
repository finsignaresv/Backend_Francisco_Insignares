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
    let busqueda = $('#checkPersonalizada');
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

setSearch();

((document, window, undefined, $)=>
  {
    (()=>
      {
        return Buscador =
          {
            io: io(),
            $clasificadoTemp: $("div[name='clasificado']").clone(),
            Init: function()
              {
                var self = this;
                self.loadCiudades()
                self.loadTipos()
                self.loadInmuebles()
                $("div[name='clasificado']").empty("");
                $("#buscar").click(()=>
                  {
                    var ciudad = $("#ciudad").val();
                    var tipo = $("#tipo").val();
                    var precio = $("#rangoPrecio").val();
                    var filter =
                      {
                        Ciudad: ciudad,
                        Tipo: tipo,
                        Precio: precio
                      }
                    self.customSearch(filter);
                  })
                $("#tipo, #ciudad, #rangoPrecio").change(()=>
                  {
                    var ciudad = $("#ciudad").val();
                    var tipo = $("#tipo").val();
                    var precio = $("#rangoPrecio").val();
                    var filter = {Ciudad: ciudad, Tipo: tipo, Precio: precio}
                    self.customSearch(filter);
                  })
              },
            ajaxRequest: function (url, type, data)
              {
                return $.ajax(
                  {
                    url : url,
                    type: type,
                    data: data
                  })
              },
            loadCiudades: function()
              {
                var self = this;
                self.ajaxRequest('/Buscador/ciudades', 'GET', {})
                  .done(data  =>
                    {
                      var $ciudades = $("#ciudad");
                      $.each(data, (i,ciudad) =>
                        {
                          $ciudades.append(`<option value="${ciudad}">${ciudad}</option>`);
                        })
                    })
                  .fail(err=>
                    {
                      console.log(err);
                    });
              },
            loadTipos: function()
              {
                var self = this;
                self.ajaxRequest('/Buscador/tipos', 'GET', {})
                  .done(data=>
                    {
                      var $tipos = $("#tipo");
                      $.each(data, (i,tipo) =>
                        {
                          $tipos.append(`<option value="${tipo}">${tipo}</option>`);
                        })
                    })
                  .fail(err=>
                    {
                      console.log(err);
                    });
              },
            loadInmuebles: function()
              {
                var self = this;
                self.ajaxRequest('/Buscador/inmuebles', 'GET', {})
                  .done(data=>
                    {
                      var $inmuebles = $("#inmuebles");
                      $.each(data, (i,inmueble)=>
                        {
                          var htmlNew = self.$clasificadoTemp.html().replace(":Direccion:",inmueble.Direccion)
                                                                    .replace(":Ciudad:",inmueble.Ciudad)
                                                                    .replace(":Telefono:",inmueble.Telefono)
                                                                    .replace(":Codigo_Postal:",inmueble.Codigo_Postal)
                                                                    .replace(":Precio:",inmueble.Precio)
                                                                    .replace(":Tipo:",inmueble.Tipo);
                          var $control = self.$clasificadoTemp.clone().html(htmlNew);
                          $inmuebles.append( $control );
                        })
                    })
                  .fail(err=>
                    {
                      console.log(err);
                    });
              },
            customSearch: function(filter)
              {
                var self = this;
                self.ajaxRequest('/Buscador/inmuebles', 'GET', {})
                  .done(data =>
                    {
                      var $inmuebles = $("#inmuebles");
                      $inmuebles.html("");
                      $.each(data, (i,inmueble) =>
                        {
                          var htmlNew = self.$clasificadoTemp.html().replace(":Direccion:",inmueble.Direccion)
                                                                    .replace(":Ciudad:",inmueble.Ciudad)
                                                                    .replace(":Telefono:",inmueble.Telefono)
                                                                    .replace(":Codigo_Postal:",inmueble.Codigo_Postal)
                                                                    .replace(":Precio:",inmueble.Precio)
                                                                    .replace(":Tipo:",inmueble.Tipo);
                          var $control = self.$clasificadoTemp.clone().html(htmlNew);
                          if(filter===undefined)
                            {
                              $inmuebles.append( $control );
                            }
                            else
                              {
                                var show = (filter.Ciudad ===undefined || filter.Ciudad =="" || filter.Ciudad == inmueble.Ciudad);
                                var show = show && (filter.Tipo ===undefined || filter.Tipo =="" || filter.Tipo == inmueble.Tipo);
                                var precio = filter.Precio.split(";");
                                var precioInmueble = inmueble.Precio.replace("$","").replace(",","");
                                var show = show && ( precioInmueble >= precio[0] && precioInmueble <= precio[1]);
                                console.log(`Ciudad:${filter.Ciudad}, Tipo: ${filter.Tipo}, Precio: ${precio}, precioInmueble: ${precioInmueble}, Show: ${show}`);
                                if(show)
                                  {
                                    $inmuebles.append( $control );
                                  }
                              }

                        })
                    })
                  .fail(err =>
                    {
                      console.log(err);
                    });
              }
          }
      })()

  Buscador.Init()
  setTimeout(() =>
    {
      $('select').material_select();
    },1000);
  })(document, window, document, jQuery);
