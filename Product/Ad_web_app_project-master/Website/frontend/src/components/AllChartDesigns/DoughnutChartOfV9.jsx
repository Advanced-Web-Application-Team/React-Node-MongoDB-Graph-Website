import React from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useRef } from 'react';
import ChartContext from '../../context/LineChartContext';
import 'chartjs-adapter-date-fns';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, UpdateModeEnum } from 'chart.js';
import { Doughnut, getElementAtEvent } from 'react-chartjs-2';


ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChartOfV9() {
  const options = {
    responsive: true,
    onClick: ()=> {delete data.datasets[1].hidden; console.log(data.datasets[1]); },
    plugins: {
      legend: 
      {
        position: 'top',
        

        }
      },
     
      title: {
        display: true,
        text: 'CO2 emissions by sectors (%)',
      },
      tooltip:
      { 
        callbacks: 
        {
         
         afterFooter: (context) => 
         {
          // return Filter(sub_sub_categoryArray)
         
          return subSectorTextReturn(context[0].label);
         }
        }
      },
      
};
   

  

    let {allDataOfV9, fetchAllDataOfV9} = useContext(ChartContext); 
    useEffect(() => {
        fetchAllDataOfV9();
    },[]);
    //Get main sectors  from the database
     let mainSector = allDataOfV9.map((data) => data.sector);

     const chartRef = useRef();
     const onClick = (event,element) => {
       let pressedSector = getElementAtEvent(chartRef.current, event);
       console.log(pressedSector);
       data.datasets[2].hidden = false
     }

    //Energy total greenhouse gas submissions
    let energyTotal = allDataOfV9.filter(x => x.sector === "Energy").map(x => x.Share_of_global_greenhouse_gas_emissions).reduce((acc, element) => acc += element, 0);
    // Industry total greenhouse gas submissions
    let industryTotal = allDataOfV9.filter(x => x.sector === "Industry ").map(x => x.Share_of_global_greenhouse_gas_emissions).reduce((acc, element) => acc += element, 0);
    //Agriculture, Forestry & Land Use total greenhouse gas submissions
    let agricultureTotal = parseFloat(allDataOfV9.filter(x => x.sector === "Agriculture, Forestry & Land Use").map(x => x.Share_of_global_greenhouse_gas_emissions).reduce((acc, element) => acc += element, 0).toFixed(1));
    //Waste total greenhouse gas submissions
    let wasteTotal = allDataOfV9.filter(x => x.sector === "Waste").map(x => x.Share_of_global_greenhouse_gas_emissions).reduce((acc, element) => acc += element, 0);
    

     // Function to return text for afterBody of each sector in a graph
     const subSectorTextReturn = (label) => {
      
      let energyNames = allDataOfV9.filter(x => x.sector === label).map((value) => ({
        sub_sector: value.sub_sector,
        sub_sub_sector: value.sub_sub_sector,
        gas_emission_value: value.Share_of_global_greenhouse_gas_emissions 
      }));
  
      let totalForEachSector = energyNames.map(x => x.sub_sector);
  
      let removeDuplicates = totalForEachSector.filter((a, b) => totalForEachSector.indexOf(a) === b);
  
  
      let arrayOfNewObjects = [];
      removeDuplicates.forEach((data) => {
  
        let newObj = {};
  
  
        let filterEachSubSector = allDataOfV9.filter((value) => value.sub_sector === data);
  
    
  
        let mappedDataForSubSector = filterEachSubSector.map((data) => ({
            sub_sub_sector: data.sub_sub_sector,
            gas_emission_value: data.Share_of_global_greenhouse_gas_emissions
        }));
  
        newObj[data] = mappedDataForSubSector
  
        arrayOfNewObjects.push(newObj);
  
      
      });
  
      let text = "";
  
      arrayOfNewObjects.forEach((item) => {
        
        let getKeys = Object.keys(item);
  
        let getName = getKeys[0];
  
        let totalSummation = 0;
  
        item[getName].forEach((value) => {
          totalSummation += value.gas_emission_value;
        });
  
        text += `${getName}: ${totalSummation.toFixed(1)}` + "% (the main sub-sector) " + "\n";
  
        item[getName].forEach((value) => {
          text += `${value.sub_sub_sector}` + ": " + `${value.gas_emission_value}` +"%"+ "\n";
        });
  
        text += `\n`;
  
      });

      return text;
    };
    
    let testDataArray = [energyTotal,industryTotal, agricultureTotal, wasteTotal];
    let testArray =  [2,3,4,5,6,4]
  
    let Filter = (arr) =>
    {
     let result = arr.filter((element, i) => arr.indexOf(element) === i)

     return result;
    };

  
  
      const data = {
         labels: Filter(mainSector),
          datasets:
              [{
                  data: testDataArray,
                  borderColor: "rgb(0, 0, 0)",
                  backgroundColor: ["rgb(255,255,0)","rgb(169,169,169)","rgb(0,100,0)","rgb(139,69,19)"],
                  labels: Filter(mainSector),
              },
              {
                data: testArray,
                borderColor: "rgb(0, 0, 0)",
                backgroundColor: ["rgb(255,255,0)","rgb(169,169,169)","rgb(0,100,0)","rgb(139,69,19)"],
                labels: ["test","test","test","test","test","test"],
                hidden:true,
            },
            {
              label: "SubSubSector",
              data: testArray,
              borderColor: "rgb(0, 0, 0)",
              backgroundColor: ["rgb(255,255,0)","rgb(169,169,169)","rgb(0,100,0)","rgb(139,69,19)"],
              labels:["test","test","test","test","test","test"],
              hidden:true,
          },

            
           
            ]
            
      }

  
  



  return (
    <div>
        <div style={{width: '80%', margin: "auto", border: "3px solid black", borderRadius: 4, padding: 10, backgroundColor: "white", alignItems: "center", justifyContent: "center"}}>
            <Doughnut  ref={chartRef} options={options} data={data} onClick={onClick}/>
            <h3 className='text-black font-bold text-2xl my-5 text-center'> Description </h3>
            <p style={{textAlign: "left", color: 'black', marginBottom: 5}}> 
            This chart shows methane emissions by sector, measured in tonnes of carbon dioxide equivalents.

We see that, globally, agriculture is the largest contributor to methane emissions. Most of this methane comes from livestock (they produce methane through their digestive processes, in a process known as ‘enteric fermentation’). Rice production is also a large contributor to methane emissions.
            
            </p>
            <span></span>

            <p style={{textAlign: "left", paddingTop: "20px",}}> <span style={{fontWeight: "bold"}}> Link to data source:</span> https://ourworldindata.org/uploads/2020/09/Global-GHG-Emissions-by-sector-based-on-WRI-2020.xlsx </p>

        </div>
    </div>
  )
}

export default DoughnutChartOfV9