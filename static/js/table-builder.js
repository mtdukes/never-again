// do we haz localstorage?

var localStorageTest = (function() {
    try {
        var mod = new Date();
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch(e) {
        return false;
    }
})();

var $dataInput = $('#data-input');
var $processButton = $('#process-button');
var $tableOutput = $('#table-output');
var $displayArea = $('#display-area');
var $optionsToggle = $('#options-toggle');
var $dataInputType = $('#data-input-type');
var $tableType = $('#table-type');
var $tableHeader = $('#table-header');
var $tableSource = $('#table-source');
var $tableSourceUrl = $('#table-source-url');
var $previousSelect = $('#previous-select');
var $previousButton = $('#previous-button');

function getStoredTablesAsJSON() {
    if (!localStorage.getItem('tables')) {
        localStorage.setItem('tables', JSON.stringify([]));
    }

    return JSON.parse(localStorage.getItem('tables'));
}

function addToStoredTables(tableArray) {
    var tables = getStoredTablesAsJSON();
    var tablesLength = tables.length;
    if (tablesLength > 9) {
        tables.splice(0, 1);
    }
    tables.push(tableArray);
    localStorage.setItem('tables', JSON.stringify(tables));
    return false;
}

function buildPreviousDropdown(tablesArray) {
    $previousSelect.empty().append($('<option/>'));

    $.each(tablesArray.reverse(), function(i, v) {
        var header = v[0];
        var time = v.slice(-1);
        $previousSelect.append($('<option/>', {text: header + " | " + time, value: i}));
    });

    $previousSelect.find('option').eq(1).attr('selected', 'selected');

    return false;
}

$processButton.on('click', function() {
    var data = $dataInput.val();
    var rows, payload, tableOutput, tableHeader, tableSource;

    var storage = [];

    if (!data) {
        alert('You forgot to put your data in!');
        return false;
    }

    var activeType = $dataInputType.find('.active').data('type');
    var tableType = $tableType.find('.active').data('type');

    if (activeType === 'tsv') {
        rows = d3.tsv.parseRows(data);
    }

    if (activeType === 'csv') {
        rows = d3.csv.parseRows(data);
    }

    tableOutput = buildTable(rows, tableType);

    if ($tableHeader.val()) {
        tableHeader = $('<h4/>', {
            text: $tableHeader.val()
        }).css({
            'margin-top': '0px',
            'padding-top': '0px'
        });
    }

    if ($tableSource.val()) {
        if ($tableSourceUrl.val()) {
            tableSource = $('<div/>', {
                html: 'Source: ' + $('<div/>').append($('<a/>', {
                    text: $tableSource.val(),
                    href: $tableSourceUrl.val()
                }).clone()).html()
            }).css({
                'text-align': 'right',
                'font-style': 'italic',
                'font-size': '11px',
                'color': '#ABABAB'
            });
        } else {
            tableSource = $('<div/>', {
                text: 'Source: ' + $tableSource.val()
            }).css({
                'text-align': 'right',
                'font-style': 'italic',
                'font-size': '11px',
                'color': '#ABABAB'
            });
        }
    }

    if (tableType === 'sortable'){
    	payload = "<!-- Paste into custom embed --> <style type=\"text/css\"> tr.even { background-color: #EEE; }  tr > * { padding: 4px; vertical-align: top; }  .data.tablesorter thead > tr > * { background-color: #eae9e3; border: 1px solid white; vertical-align: middle; }  .tablesorter > thead > tr > th { background: url(\"http://write30.com/assets/img/bg.gif\") no-repeat scroll right center; cursor: pointer; padding-right: 16px; } .tablesorter > thead > tr > .headerSortUp {background: url(\"http://write30.com/assets/img/asc.gif\") no-repeat scroll right center; } .tablesorter > thead > tr > .headerSortDown { background: url(\"http://write30.com/assets/img/desc.gif\") no-repeat scroll right center; } </style> <script type='text/javascript' src=\"http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js\"></script> <script type='text/javascript' src=\"http://write30.com/assets/js/jquery.tablesorter.min.js\"></script> <script type='text/javascript'> $(window).load(function(){ $('.data.tablesorter').tablesorter(); }); </script> <div style=\"float: right; margin: 0px 0px 10px 10px; font-size:12px;\">"
    }
    else {
    	payload = '<!-- Paste into custom embed -->\n\n' + '<div style="float: right; margin: 0px 0px 10px 10px; font-size:12px;"><style type="text/css">tr.even { background-color: #EEE;} tr > * {padding: 4px; vertical-align: top;} </style>';
    }
    /*payload = '<!-- Paste into custom embed -->\n\n' + '<div style="float: right; margin: 0px 0px 10px 10px; font-size:12px;"><style type="text/css">tr.even { background-color: #EEE;} tr > * {padding: 4px; vertical-align: top;} </style>';*/
    
    if (tableHeader) {
        payload += $('<h4/>').append(tableHeader.clone()).html();
    }
    payload += tableOutput;
    if (tableSource) {
        payload += $('<div/>').append(tableSource.clone()).html();
    }  
    
    payload += '</div>' + '\n\n<!-- End table embed -->';

    $tableOutput.val(payload);
    $displayArea.html(payload);
    
    if (tableType === 'sortable') {
        $('table').tablesorter({
            textExtraction:'complex',
            widgets:['zebra'],
            widgetZebra:{css:['even','odd']}
        });
    }

    storage.push($tableHeader.val());
    storage.push($tableSource.val());
    storage.push($tableSourceUrl.val());
    storage.push(data);
    var runtime = moment().format('M-D-YYYY h:mm:ss a');
    storage.push(runtime);

    if(localStorageTest) {
        addToStoredTables(storage);
        buildPreviousDropdown(getStoredTablesAsJSON());
    }

    $processButton.find('i').attr('class', 'icon-thumbs-up');
    $('#added-flirt').fadeIn(400).delay(1600).fadeOut(400);
});

$previousButton.on('click', function() {
    var val = $previousSelect.val();
    if (!val) { return false; }
    var oldTable = getStoredTablesAsJSON().reverse()[val];

    $tableHeader.val(oldTable[0]);
    $tableSource.val(oldTable[1]);
    $tableSourceUrl.val(oldTable[2]);
    $dataInput.val(oldTable[3]);
});

$optionsToggle.on('click', function() {
    $optionsToggle.find('i').toggleClass('icon-chevron-down');
});

function buildTable(rows, type) {

    var table = $('<table/>').addClass('data');
    if (type === 'basic') {
        table.addClass('basic');
    }

    if (type === 'sortable') {
        table.addClass('tablesorter');
    }

    var thead = $('<thead/>').append('<tr/>');
    var tbody = $('<tbody/>');

    $.each(rows[0], function(i,cell) {
        $('<th/>', {
            text: cell
        }).appendTo(thead.find('tr'));
    });

    rows.splice(0,1); // removes the header row

    $.each(rows, function(i,row) {
        $('<tr/>').appendTo(tbody);

        
        if (type === 'basic') {
            if ((i + 1) % 2 === 0) {
                tbody.find('tr').last().addClass('even');
            } else {
                tbody.find('tr').last().addClass('odd');
            }
        }

        $.each(row, function(i,cell) {
            $('<td/>', {
                text: cell
            }).appendTo(tbody.find('tr').last());
        });
    });

    thead.appendTo(table);
    tbody.appendTo(table);

    return $('<div/>').append(table.clone()).html();
}

$(document).ready( function() {
    buildPreviousDropdown(getStoredTablesAsJSON());
});
