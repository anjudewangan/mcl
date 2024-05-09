(function ($) {
  "use strict";
  // column chart
  var options3 = {
    chart: {
      height: 350,
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    series: [
      {
        name: "Today",
        data: [0, 8, 12, 6, 14, 30, 10, 17, 10, 14, 36, 30, 12, 8, 0, 7],
      },
      {
        name: "Total",
        data: [0, 6, 32, 12, 24, 44, 22, 37, 21, 44, 56, 30, 42, 12, 7, 22],
      },
      {
        name: "Till Yesterday",
        data: [0, 2, 20, 6, 10, 14, 12, 20, 11, 30, 20, 0, 30, 4, 7, 15],
      },
    ],
    xaxis: {
      categories: [
        "Amrapali",
        "Argada",
        "Barka",
        "Bokaro",
        "CCL",
        "CRS",
        "Dhori",
        "Giridih",
        "Hazaribagh",
        "Kathara",
        "Kuju",
        "MRS",
        "N.K.",
        "Piparwar",
        "Rajhara",
        "Rajrappa",
      ],
    },
    yaxis: {
      title: {
        // text: "$ (thousands)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return + val + " complaint closed";
        },
      },
    },
    colors: [TivoAdminConfig.primary, TivoAdminConfig.secondary, TivoAdminConfig.success],
  };
  var chart3 = new ApexCharts(
    document.querySelector("#column-chart"),
    options3
  );
  chart3.render();
  // mixed chart
  var options7 = {
    chart: {
      height: 350,
      type: "line",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: [0, 2, 5],
      curve: "smooth",
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    series: [
      {
        name: "Total",
        type: "column",
        data: [0, 0, 32, 12, 24, 44, 22, 37, 21, 44, 56, 30, 42, 12, 7, 22],
      },
      {
        name: "Till Yesterday",
        type: "area",
        data: [0, 0, 12, 6, 14, 30, 10, 17, 10, 14, 36, 30, 12, 8, 0, 7],
      },
      {
        name: "Today",
        type: "line",
        data: [0, 0, 20, 6, 10, 14, 12, 20, 11, 30, 20, 0, 30, 4, 7, 15],
      },
    ],
    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: "light",
        type: "vertical",
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100],
      },
    },
    labels: [
      "Amrapali",
      "Argada",
      "Barka",
      "Bokaro",
      "CCL",
      "CRS",
      "Dhori",
      "Giridih",
      "Hazaribagh",
      "Kathara",
      "Kuju",
      "MRS",
      "N.K.",
      "Piparwar",
      "Rajhara",
      "Rajrappa",
    ],
    markers: {
      size: 0,
    },
    xaxis: {
      type: "string",
    },
    yaxis: {
      min: 0,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " complaint received";
          }
          return y;
        },
      },
    },
    legend: {
      labels: {
        useSeriesColors: true,
      },
    },
    colors: [TivoAdminConfig.primary, TivoAdminConfig.success, TivoAdminConfig.secondary],
  };
  var chart7 = new ApexCharts(document.querySelector("#mixedchart"), options7);
  chart7.render();
})(jQuery);