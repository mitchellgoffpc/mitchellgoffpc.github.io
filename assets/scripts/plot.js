const plasma = ['#0d0887', '#46039f', '#7201a8', '#9c179e', '#bd3786', '#d8576b', '#ed7953', '#fb9f3a', '#fdca26', '#f0f921'];
const viridis = ['#440154', '#482878', '#3e4989', '#31688e', '#26828e', '#1f9e89', '#35b779', '#6ece58', '#b5de2b', '#fde725'];

function hex_to_rgb(hex) {
    const num = parseInt(hex.replace(/^#/, ''), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return [r, g, b];
}

function scatter3d(x, y, z, colorscale) {
    const line = {colorscale, color: z, width: 1, cmin: -1, cmax: 1};
    return {x, y, z, type: 'scatter3d', showlegend: false, mode: 'lines', line};
}

function surfaceplot({x, y, z, title, colorscale = plasma}, id) {
    const X = x.map(xi => y.map(_ => xi));
    const Y = x.map(_ => y);
    const Z = x.map(xi => y.map(yj => z(xi, yj)));
    const colorscale_data = colorscale.map((c, i) => [i / (colorscale.length - 1), c]);
    const line_colorscale_data = colorscale.map((c, i) => {
        let [r, g, b] = hex_to_rgb(c);
        return [i / (plasma.length - 1), `rgb(${Math.floor(r + 30)}, ${Math.floor(g + 30)}, ${Math.floor(b + 30)}`];
    });

    const data = [{x: X, y: Y, z: Z, type: 'surface', showscale: false, colorscale: colorscale_data}];
    for (let i = 0; i < x.length; i += 2) {
        data.push(scatter3d(x.map(_ => x[i]), y, Z[i], line_colorscale_data));
    }
    for (let j = 0; j < y.length; j += 2) {
        data.push(scatter3d(x, y.map(_ => y[j]), Z.map(zk => zk[j]), line_colorscale_data));
    };

    let layout = {
        title: {text: title},
        autosize: false,
        width: 500,
        height: 500,
        margin: {l: 0, r: 0, b: 40, t: 40},
        hovermode: false,
        hovertemplate: null,
        scene: {
            xaxis: {showspikes: false}, // autorange: "reversed",
            yaxis: {showspikes: false},
            zaxis: {showspikes: false},
            camera: {eye: {x: -1, y: 1.5, z: 1.0}},
        },
    };
    Plotly.newPlot(id, data, layout);
}