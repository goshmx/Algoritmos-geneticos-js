var parametrosVector = {
  chart: {
    type: 'spline'
  },
  title: {
    text:'',
    x: -20
  },
  xAxis: {
    categories: []
  },
  yAxis: {
    title: {
      text: 'Calificacion'
    },
    plotLines: [{
      value: 0,
      width: 1,
      color: '#808080'
    }]
  },
  tooltip: {
    valueSuffix: ''
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
    borderWidth: 0
  },
  plotOptions: {
    spline: {
      lineWidth: 2,
      states: {
        hover: {
          lineWidth: 3
        }
      },
      marker: {
        enabled: false
      }
    }
  },
  series: [],
  credits: {
    enabled: false
  }
};

var parametrosPie = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie'
  },
  title: {
    text: ''
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: false
      },
      showInLegend: false
    }
  },
  series: [{
    name: 'Cromosomas',
    colorByPoint: true,
    data: []
  }],
  credits: {
    enabled: false
  }
};



function graficaGenoma(datos,inicio, final){
  console.log(datos);
  var dataGrafica ={categories:[],menor:[],mayor:[],promedio:[]};
  $.each(datos, function(i, item){
    dataGrafica.categories.push((i+1).toString());
    dataGrafica.menor.push(item.menor);
    dataGrafica.mayor.push(item.mayor);
    dataGrafica.promedio.push(item.promedio);
  });
  var tplMenor = parametrosVector;
  tplMenor.series = [];
  tplMenor.title.text = 'Distribución Genoma';
  tplMenor.xAxis.categories = dataGrafica.categories;
  tplMenor.series.push({name:'Menor',data:dataGrafica.menor});
  tplMenor.series.push({name:'Mayor.',data:dataGrafica.mayor});
  tplMenor.series.push({name:'Promedio.',data:dataGrafica.promedio});
  console.log(tplMenor);
  $('#genoma-menor').highcharts(tplMenor);

}


function graficaPastel(div, datos, title){
    var dataInicio =[];
    for(i=0;i<datos.length;i++){
        dataInicio.push({name: datos[i].cromosomaindice, y:datos[i].cromosomaTotal});
    }
    var tplInicio = jQuery.extend(true, {}, parametrosPie);
    tplInicio.title.text = title;
    tplInicio.series[0].data =dataInicio;
    $(div).highcharts(tplInicio);
}

