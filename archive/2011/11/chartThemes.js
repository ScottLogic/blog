/* Ext Chart Themes */

Ext.define('Ext.chart.theme.DailyStockChart', {
    extend: 'Ext.chart.theme.Base',
    
    constructor: function(config) {
        this.callParent([{
            axisLabelLeft: {
                font: '10px Arial'
            },
            axisLabelBottom: {
                font: '10px Arial'
            }
        }]);
    }
});
