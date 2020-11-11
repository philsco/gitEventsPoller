const parseMap = (source, entity) => {
    let raw = [];
    source.forEach(item => {
        raw.push(item[entity]);
    });

    let tempObj = raw.reduce((prev, next) => {
        if (prev.hasOwnProperty(next)) {
            prev[next] = prev[next]  + 1;
            return prev; 
        } else {
            prev[next] = 1;
            return prev;
        }
    }, {})

    return Object.keys(tempObj).map(item => {
        return [item, tempObj[item]];
    })
}

const drawChart = (data, target) => {
    let legend = [target, "Count"];
    let elem = target.toLowerCase();
    let parsed = parseMap(data, elem);
    parsed.unshift(legend);

    var source = google.visualization.arrayToDataTable(parsed);

    var options = {title: target};

    var chart = new google.visualization.PieChart(document.getElementById(elem));

    chart.draw(source, options);
  }

  const drawTable = (data, elem) => {
      let dates = new Map();
      let source = [];
      data.forEach(item => {
            if (item.created) {
                if(dates.has(item.created)) {
                    dates.set(item.created, dates.get(item.created) + 1);
                } else {
                    dates.set(item.created, 1);
                }
            }
        });
        dates.forEach((val, key) => {
            source.push([new Date(key), val]);
        })
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: 'date', id: 'Date' });
        dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
        dataTable.addRows(source);
        let calendar = new google.visualization.Calendar(document.getElementById(elem));
        var options = {
            title: "Repo creation dates",
            height: 350,
          };
        calendar.draw(dataTable, options);
  }




