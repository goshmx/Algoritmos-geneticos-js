var poblacion = [];
var poblacionAlInicio = [];
var i,j;
var sumaTotal = 0;
var fitnessAcumulado = 0;
var datosGeneraciones = [];


//Variables iniciales
var pc = 0.70;
var genes = 30;
var pm = 0.0555;
var poblacionInicial = 50;
var generaciones = 30;

$(document).ready(function(){
  $('form').submit(function(){
    return false;
  });
  $('.form-validate').parsley();
  //iniciaPoblacion();
  $('#activa-evo').on('click', evoluciona);
});


function iniciaPoblacion(){
  console.log('--- Poblacion Inicial ---');
  poblacion = [];
  for(i=0;i<poblacionInicial;i++){
    var objetoInicial = {
      cromosomaArray:[]
    };
    objetoInicial.cromosomaindice = i;
    for(j=0;j<genes;j++){
      var aleatorio = numeroAleatorio();
      objetoInicial.cromosomaArray.push(aleatorio);
    }
    poblacion.push(objetoInicial);
  }
  poblacionAlInicio.push(poblacion); //Guarda la poblacion al inicio para comparar.
  console.log(poblacion);
}


function evaluaPoblacion(){
  console.log('--- Evalua Poblacion ---');
  sumaTotal = 0;
  for(i=0;i<poblacion.length;i++){
    poblacion[i].cromosomaBin = poblacion[i].cromosomaArray.join('');
    poblacion[i].cromosomaTotal = ((parseInt(poblacion[i].cromosomaBin, 2))/(Math.pow(2, 30)));
    sumaTotal+=poblacion[i].cromosomaTotal;
  }
  generaFitness();
  console.log(poblacion);
}

//Probabilidad de selección
function generaFitness(){
  console.log('--- Genera Fitness ---');
  $.each(poblacion,function(i,item){
    var fitness = item.cromosomaTotal/sumaTotal;
    poblacion[i].fitness = fitness;
  });
}

function obtieneDatosGeneracion(){
  var menor=0,mayor= 0,totPromedio=0;
  for(i=0;i<poblacion.length;i++){
    if(poblacion[i].fitness<=99999999999999999999999999){menor=poblacion[i].fitness}
    if(poblacion[i].fitness>mayor){mayor=poblacion[i].fitness}
    totPromedio+=poblacion[i].fitness;
  }
  return {menor:menor,mayor:mayor,promedio:(totPromedio/poblacion.length)};
}

function imprimeTabla(){
  $('#resultados tbody').html('');
  fitnessAcumulado = 0;
  $.each(poblacion,function(i,item){
    fitnessAcumulado+=item.fitness;
    var html = '<tr><td>'+i+'</td><td>'+item.cromosomaBin+'</td><td>'+item.cromosomaTotal+'</td><td>'+item.fitness+'</td><td>'+fitnessAcumulado+'</td></tr>';
    $('#resultados tbody').append(html);
  });
}

function evoluciona(){
  var form = $('#formulario').parsley().validate();
  if(form){
    iniciaPoblacion();
    poblacionInicial = $('#poblacion').val();
    pc = $('#cruzamiento').val();
    pm = $('#mutacion').val();
    generaciones = $('#generaciones').val();
    datosGeneraciones = [];
    for(var k=0;k<generaciones;k++){
      evaluaPoblacion();

      var padre = {};
      padre.A = seleccionPadres();
      padre.B = seleccionPadres();
      console.log(padre);

      var hijos = cruzamiento(padre);
      var mutados = mutacion(hijos);
      sustituyePoblacion(mutados);

      evaluaPoblacion();
      datosGeneraciones.push(obtieneDatosGeneracion());

    }
    imprimeTabla();
    graficaGenoma(datosGeneraciones);
  }
}

function seleccionPadres(){
  var r = Math.random();
  var c = r*sumaTotal;
  var Ca = 0;
  var statusRetorno = false;
  var seleccionado;
  $.each(poblacion,function(i,item){
    Ca+=item.cromosomaTotal;
    if((Ca > c) && (statusRetorno == false)){
      seleccionado = item;
      statusRetorno = true;
    }
  });
  return seleccionado;
}

function determinaCruzamiento(){
  var d = Math.random();
  if(d<pc){
    return true;
  }
  else{
    return false;
  }
}

function cruzamiento(padre){
  console.log('--- Genera Cruzamiento ---');
  var hijo = {};
  if(determinaCruzamiento()){
    console.log('Van a cruzarse');
    var l = genes;
    var x = Math.round(Math.random()*(4-2)+parseInt(0));
    hijo.A = {cromosomaBin:padre.A.cromosomaBin.substring(0, x)+padre.B.cromosomaBin.substring(x,l), cromosomaindice:padre.A.cromosomaindice};
    hijo.B = {cromosomaBin:padre.B.cromosomaBin.substring(0, x)+padre.A.cromosomaBin.substring(x,l),cromosomaindice:padre.B.cromosomaindice};
    hijo.A.cromosomaTotal = parseInt(hijo.A.cromosomaBin, 2);
    hijo.B.cromosomaTotal = parseInt(hijo.B.cromosomaBin, 2);
  }else{
    console.log('No van a cruzarse');
    hijo.A = padre.A;
    hijo.B = padre.B;
  }
  console.log(hijo);
  return hijo;
}

function mutacion(hijo){
  var q;
  var hijoA = [];
  var hijoB = [];

  for(i=0;i<genes;i++){
    q = Math.random();
    if(q<pm){
      console.log('Habrá mutacion en: '+i);
      if(hijo.A.cromosomaBin[i] == '0'){hijoA.push(1);}else{hijoA.push(0);}
      if(hijo.B.cromosomaBin[i] == '0'){hijoB.push(1);}else{hijoB.push(0);}
    }
    else{
      hijoA.push(hijo.A.cromosomaBin[i]);
      hijoB.push(hijo.B.cromosomaBin[i]);
    }
  }
  var nuevoHijo = {
    A:{
      cromosomaindice:hijo.A.cromosomaindice,
      cromosomaArray:hijoA,
      cromosomaBin: hijoA.join(''),
      cromosomaTotal:parseInt(hijoA.join(''), 2)
    },
    B:{
      cromosomaindice:hijo.B.cromosomaindice,
      cromosomaArray:hijoB,
      cromosomaBin: hijoB.join(''),
      cromosomaTotal:parseInt(hijoB.join(''), 2)
    }
  };
  console.log(nuevoHijo);
  return nuevoHijo;
}

function sustituyePoblacion(nuevos){
  poblacion[nuevos.A.cromosomaindice] = nuevos.A;
  poblacion[nuevos.B.cromosomaindice] = nuevos.B;
  console.log('--- Insertados en la poblacion ---');
}

//Genera un número aleatorio.
function numeroAleatorio(){
  var numero = Math.round(Math.random());
  return numero;
}
