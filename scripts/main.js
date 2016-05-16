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
    $('#activa-evo').on('click', evoluciona);
});

/*Funcion que genera el algoritmo genetico*/
function evoluciona(){
    $('.loading').removeClass('hide');
    poblacionInicial 	= $('#poblacion').val();
    pc 					= $('#cruzamiento').val();
    pm 					= $('#mutacion').val();
    generaciones 		= $('#generaciones').val();
    iniciaPoblacion();
    evaluaPoblacion();
    datosGeneraciones 	= [];
    console.table(poblacionAlInicio);
    $('.res-ag').removeClass('toHide');
    graficaPastel('#genoma-inicio', poblacionAlInicio, 'Distribución al inicio');
    imprimeTablaInicial();
    for(var k=0;k<generaciones;k++){
        evaluaPoblacion();
        var padre = {};
        padre.A = seleccionPadres();
        padre.B = seleccionPadres();
        console.log('Padres:');
        console.log(padre);
        var hijos = cruzamiento(padre);
        var mutados = mutacion(hijos);
        sustituyePoblacion(mutados);
        evaluaPoblacion();
        datosGeneraciones.push(obtieneDatosGeneracion());
    }
    console.table(poblacion);
    imprimeTablaFinal();
    graficaGenoma(datosGeneraciones);
    graficaPastel('#genoma-final', poblacion, 'Distribución al final');
}

/*Funcion carga una población inicial para evolucionar*/
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
    poblacionAlInicio = poblacion; //Guarda la poblacion al inicio para comparar.
    console.log(poblacion);
}
/*Evalua la población asignado su calificacion(Fitness)*/
function evaluaPoblacion(){
    console.log('--- Evalua Poblacion ---');
    sumaTotal = 0;
    for(i=0;i<poblacion.length;i++){
        poblacion[i].cromosomaBin = poblacion[i].cromosomaArray.join('');
        poblacion[i].cromosomaTotal = ((parseInt(poblacion[i].cromosomaBin, 2))/2^30);
        poblacion[i].fitness = fitness(poblacion[i].cromosomaBin);
        sumaTotal+=poblacion[i].fitness;
    }
    generaProbSeleccion();
    console.log(poblacion);
}

/*F(x) Funcion que  obtiene la calificacion basado en el numero de "1's" de la cadena*/
function fitness(valor){
    // devuelve la cantidad de "1" que contiene el cromosoma
    unos = (valor.split("1").length-1)/30;
    //return ( (1-Math.pow((11/2)*unos-(7/2),2))*(cos((11/2)*unos-(7/2))+1)+2   );
    return (Math.pow(unos,7));
}

//Probabilidad de selección
function generaProbSeleccion(){
    console.log('--- Genera Probabilidad de seleccion ---');
    $.each(poblacion,function(i,item){
        var pselect = item.fitness/sumaTotal;
        poblacion[i].probabilidad = pselect;
    });
}

/*Funcion que obtiene el fitness minimo, fitness maximo y fitness promedio asi como su indice en el cromosma */
function obtieneDatosGeneracion(){
    var menor=30,mayor= 0,totPromedio= 0,imayor= 0, imenor=0;
    for(i=0;i<poblacion.length;i++){
        if(poblacion[i].fitness<=menor){
            menor=poblacion[i].fitness;
            imenor=poblacion[i].cromosomaindice;
        }
        if(poblacion[i].fitness>mayor){
            mayor=poblacion[i].fitness;
            imayor=poblacion[i].cromosomaindice;
        }
        totPromedio+=poblacion[i].fitness;
    }
    return {menor:menor,mayor:mayor,promedio:(totPromedio/poblacion.length),imayor:imayor,imenor:imenor};
}

/*Imprime la poblacion inicial*/
function imprimeTablaInicial(){
    $('#resultados-orig tbody').html('');
    $('.results').html('');
    var html = '<tr><td> </td><td>--------Tabla Inicial--------</td><td> </td><td> </td><td> </td></tr>';
    $('#resultados-orig tbody').append(html);
    fitnessAcumulado = 0;
    $.each(poblacionAlInicio,function(i,item){
        fitnessAcumulado+=item.fitness;
        var html = '<tr><td>'+i+'</td><td>'+item.cromosomaBin+'</td><td>'+item.fitness+'</td><td>'+item.probabilidad+'</td><td>'+fitnessAcumulado+'</td></tr>';
        $('#resultados-orig tbody').append(html);
    });
    var html = '<tr><td> </td><td> Suma </td><td>'+fitnessAcumulado+'</td><td> </td><td> </td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr>';
    $('#resultados-orig tbody').append(html);
}

/*Imprime la poblacion final*/
function imprimeTablaFinal(){
    $('#resultados tbody').html('');
    $('.results').html('');
    $('.loading').addClass('hide');
    var html = '<tr><td> </td><td>---------Tabla Final---------</td><td> </td><td> </td><td> </td></tr>';
    $('#resultados tbody').append(html);

    fitnessAcumulado = 0;
    $.each(poblacion,function(i,item){
        fitnessAcumulado+=item.fitness;
        var html = '<tr><td>'+i+'</td><td>'+item.cromosomaBin+'</td><td>'+item.fitness+'</td><td>'+item.probabilidad+'</td><td>'+fitnessAcumulado+'</td></tr>';
        $('#resultados tbody').append(html);
    });
    var html = '<tr><td> </td><td> Suma </td><td>'+fitnessAcumulado+'</td><td> </td><td> </td></tr>';
    $('#resultados tbody').append(html);

     console.log(datosGeneraciones[poblacionInicial-1]);
     console.log(poblacionInicial-1);
     $('.results').append('<p>Fitness Mayor (Genoma '+datosGeneraciones[generaciones-1].imayor+') = '+datosGeneraciones[generaciones-1].mayor+'</p>');
     $('.results').append('<p>Fitness Menor (Genoma '+datosGeneraciones[generaciones-1].imenor+') = '+datosGeneraciones[generaciones-1].menor+'</p>');
     $('.results').append('<p>Mejor Genoma = '+poblacion[datosGeneraciones[generaciones-1].imayor].cromosomaBin+'</p>');

}

/*Selecciona los padres para generar una nueva generacion*/
function seleccionPadres(){
    var r = Math.random();
    var c = r*sumaTotal;
    var Ca = 0;
    var statusRetorno = false;
    var seleccionado;
    $.each(poblacion,function(i,item){
        Ca+=item.fitness;
        if((Ca > c) && (statusRetorno == false)){
            seleccionado = item;
            statusRetorno = true;
        }
    });
    return seleccionado;
}

/*Funcion que determina el cruzamiento*/
function determinaCruzamiento(){
    var d = Math.random();
    if(d<pc){
        return true;
    }
    else{
        return false;
    }
}

/*Funcion que realiza el cruzamiento obteniendo los descendientes*/
function cruzamiento(padre){
    console.log('--- Genera Cruzamiento ---');
    var hijo = {};
    if(determinaCruzamiento()){
        console.log('Van a cruzarse');
        var l = genes;
        var x = Math.round(Math.random()*(4-2)+parseInt(0));
        console.log('Habrá cruze en: '+x);
        hijo.A = {cromosomaBin:padre.A.cromosomaBin.substring(0, x)+padre.B.cromosomaBin.substring(x,l), cromosomaindice:padre.A.cromosomaindice};
        hijo.B = {cromosomaBin:padre.B.cromosomaBin.substring(0, x)+padre.A.cromosomaBin.substring(x,l), cromosomaindice:padre.B.cromosomaindice};
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

/*Funcion que genera la mutacion de la cadena en base al porcentaje de mutacion dado*/
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

/*Sustiye los descendientes en la poblacion*/
function sustituyePoblacion(nuevos){
    poblacion[nuevos.A.cromosomaindice] = nuevos.A;
    poblacion[nuevos.B.cromosomaindice] = nuevos.B;
    console.log('--- Insertados en la poblacion ---');
    //console.table(poblacion);
}

//Genera un número aleatorio.
function numeroAleatorio(){
    var numero = Math.round(Math.random());
    return numero;
}