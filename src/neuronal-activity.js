"use strict"

var $ = require("jquery");
var d3Request = require('d3-request');

var s = require("./slider");
var req = require('./request');
var lineChart = require('./line-chart');


var paths = window.location.pathname.split('/')
var curpath = paths.slice(0, paths.length - 2).join('/')
nodes = {};
var recordables = {};
var record_from = 'V_m';
var npop = 10;

var recordLabels = {
    'V_m': 'Membrane pontential (ms)',
    'g_ex': 'Conductance',
    'g_in': 'Conductance',
    'input_currents_ex': 'Current (pA)',
    'input_currents_in': 'Current (pA)',
    'weighted_spikes_ex': 'Spikes',
    'weighted_spikes_in': 'Spikes',
}


d3Request.csv('file://' + curpath + '/settings/models.csv', function(models) {

    models.forEach(function(model) {
        if (model.recordables) {
            recordables[model.id] = model.recordables.split(';');
        }
        $("<option class='model_select' value=" + model.id + ">" + model.label + "</option>").appendTo("#id_" + model.type)
    })
})

function slider(ref, id, level, label, options) {
    $('#' + ref).find('.params').append('<span class="paramSlider level_' + level + '"><dt id="id_' + id + '">' + label + '</dt></div>')
    return s.slider(id, options);
}

slider('level', 'level', 0, 'Level of configuration', {
    value: 1,
    min: 1,
    max: 4,
    step: 1
}).on('slideStop', function(d) {
    $('.paramSlider').hide()
    for (var i = 0; i <= d.value; i++) {
        $('.level_' + i).show()
    }
})

slider('npop', 'npop', 0, 'Population size', {
    value: 10,
    min: 1,
    max: 100,
    step: 1
}).on('slideStop', function(d) {
    nodes['neuron'].npop = d.value;
    simulate(1000.)
})

slider('outdegree', 'outdegree', 0, 'Outdegree', {
    value: 10,
    min: 1,
    max: 100,
    step: 1
}).on('slideStop', function(d) {
    nodes['neuron'].outdegree = d.value;
    simulate(1500.)
})

// var times,values;

function simulate(simtime) {
    if (('neuron' in nodes) && ('input' in nodes)) {
        req.simulate('neuronal_activity', simtime, nodes)
            .done(function(res) {
                data = res
                var pop = data.pop;
                var npop = pop.length;
                times = data.events.times.filter(function(d, i) {
                    return i % npop == 0
                });
                values = pop.map(function() {
                    return []
                });
                data.events[record_from].map(function(d, i) {
                    values[i % npop].push(d)
                });

                chart.update(times, values)
                    .xlim([data.time - 1000, data.time])
                    .ylabel(recordLabels[record_from]);
            })
    }
}

var update_params = function(node, model) {
    var url = 'file://' + curpath + '/settings/sliderDefaults/' + model + '.csv';
    d3Request.csv(url, s.row, function(params) {
        params.forEach(function(p) {
            var pslider = slider(node, p.id, p.level, p.label, p.options);
            pslider.on("slideStop", function(d) {
                nodes[node]['params'][p.id] = d.value;
                simulate(1500.)
            })
            nodes[node]['params'][p.id] = pslider.slider('getValue');
            if (p.level > $('#levelInput').attr('value')) {
                $('#' + p.id).parent().attr('style', 'display: none')
            }
        })
    })
}

$('.model .model_select').on('change', function() {
    var node = $(this).parents('.model').attr('id');
    $('#' + node).find('.params').empty();
    var model = this.value;
    nodes[node] = {
        'model': model,
        'params': {}
    }
    if (node == 'neuron') {
        nodes.neuron.npop = npop
        nodes['neuron'].outdegree = 10;
        $('#id_record').empty()
        for (var recId in recordables[model]) {
            var rec = recordables[model][recId];
            $('<option val="' + rec + '">' + rec + '</option>').appendTo('#id_record')

        }
        record_from = $('#id_record option:selected').val();
        $('#record').show();
    }
    update_params(node, model)
    simulate(1500.)
})

$('#id_record').on('change', function() {
    record_from = this.value;
    var pop = data.pop;
    var npop = pop.length;

    values = pop.map(function() {
        return []
    });
    data.events[record_from].map(function(d, i) {
        values[i % npop].push(d)
    });

    chart.update(times, values)
        .xlim([data.time - 1000, data.time])
        .ylabel(recordLabels[record_from]);
})

chart = lineChart('#chart')
    .xlabel('Time (ms)');