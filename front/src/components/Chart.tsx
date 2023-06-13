import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import '../css/panel.css';
import { Card } from 'primereact/card';



class Iprops{
    data!: any[];
    // options?: any[];
    title!: string;
    label!: any[];
       
}




export default function ChartLine(props : Iprops) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});   
    const [labels, setLabels] = React.useState<any[]>([]);
    const [label, setLabel] = React.useState<[]>([]);
    const [data, setData] = React.useState<[]>([]);
   
        console.log("data props", props.data, "title", props.title,)
    




    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--surface-600');
        const textColorSecondary = documentStyle.getPropertyValue('--surface-800');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-900');
     
        console.log("props.data", props.data);


            console.log("Object", Object.values(props.data));
            
            Object.values(props.data).map((value) => 
            {
            let date = value.labels.split('T'); 
            let date1 = [date[0]];
            setLabels(date1)
            console.log("date", date[0])
            })
               
          console.log("labels", labels);
          console.log("label", label);
          console.log("data", data);
          console.log("props.label", props.label)

         
          
          setChartData({
            labels: Object.values(props.data).map((value) => 
            value.label ),
           
            datasets: Object.values(props.data).map((value) => ({
              label: (value.labels.split('T').shift()),
              data: [value.data],
              fill: false,
              borderColor: documentStyle.getPropertyValue('--surface-700'),
              tension: 0.4
            }))
          });

        console.log("chartData",chartData, "labels", labels, "label", label, "data", data)

            
         
        
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        
        setChartOptions(options);
    }, [props.data]);

    return (
        <Card className="col-5 card-panel chart" title={props.title}>
            <Chart  type="bar" data={chartData} options={chartOptions} />
        </Card>
    )
}
        