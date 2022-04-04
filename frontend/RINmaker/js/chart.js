import { res_count, bond_count,avg_e_bond,avg_dist_bond} from "./Parsing.js";

var res_list = ["ARG","LYS","ASN","GLN","HIS","CYS","ILE","LEU","MET","PHE","PRO","TRP","TYR","VAL","ALA","GLY","SER","THR","ASP","GLU"];
var res_cols = ["#0000ff","#0000ff","#ff00ff","#ff00ff","#ff00ff","#008000","#008000","#008000","#008000","#008000","#008000","#008000","#008000","#008000","#ffa500","#ffa500","#ffa500","#ffa500","#ff0000","#ff0000"];
var bond_list = ['IONIC','HBOND',"VDW","SSBOND","PIPISTACK","PICATION","IAC"];
var bond_cols = ["#0000ff","#87cefa","#ffd700","#9C31F9","#ff0000","#9acd32","#dcdcdc"];



// Bar chart
var ctx = document.getElementById("bar-chart");

var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: res_list,
        datasets: [
            {
                label: "Total",
                backgroundColor: res_cols,
                data: res_count
            }
        ]
    },
    options: {
    legend: { display: false },
    title: {
        display: true,
        text: 'Residue count'
    },
    responsive: true,
    maintainAspectRatio: true
    }
});


var ctx2 = document.getElementById("doughnut-chart");
var myChart2 = new Chart(ctx2, {
    type: 'doughnut',
    data: {
        labels: bond_list,
        datasets: [
            {
                label: "Total",
                backgroundColor: bond_cols,
                data: bond_count
            }
        ]
    },
    options: {
    title: {
        display: true,
        text: 'Bonds count'
    },
    responsive: true,
    maintainAspectRatio: true
    }
});

/*setTimeout(function() { myChart2.update(); },3000);*/


var ctx3 = document.getElementById("h1-chart");
var myChart3 = new Chart(ctx3, {
    type: 'horizontalBar',
    data: {
        labels: bond_list,
        datasets: [
            {
                label: "AVG kj/mol: ",
                backgroundColor: bond_cols,
                data: avg_e_bond
            }
        ]
    },
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
    legend: { display: false },
    title: {
        display: true,
        text: 'Average energy per type of bond (kj/mol)'
    },
    responsive: true,
    maintainAspectRatio: true
    }
});
/*setTimeout(function() { myChart3.update(); },3000);*/


var ctx4 = document.getElementById("h2-chart");
var myChart4 = new Chart(ctx4, {
    type: 'horizontalBar',
    data: {
    labels: bond_list,
    datasets: [
        {
        label: "AVG: ",
        backgroundColor: bond_cols,
        data: avg_dist_bond
        }
    ]
    },
    options: {
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
    legend: { display: false },
    title: {
        display: true,
        text: 'Average distance per type of bond'
    },
    responsive: true,
    maintainAspectRatio: true
    }
});
/*setTimeout(function() { myChart4.update(); },3000);*/

export {myChart, myChart2, myChart3, myChart4};