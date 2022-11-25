import React from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import ChartContext from '../../context/LineChartContext';
import 'chartjs-adapter-date-fns';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, UpdateModeEnum } from 'chart.js';
import { Doughnut, getElementAtEvent } from 'react-chartjs-2';


ChartJS.register(ArcElement, Tooltip, Legend);




function DoughnutChartOfV9() {

  let [showHidden, setShowHidden] = useState(true);
  let [getNumber, setGetNumber] = useState();




  const options = {
    responsive: true,
    plugins: {
      legend: 
      {
        position: 'top',
      },
      
     
      title: {
        display: true,
        text: 'CO2 emissions by sectors (%)',
      },
      tooltip:
      { 
        callbacks: 
        {
        label: (context) => {
          return `${context.dataset.labels[context.dataIndex]}: ${context.dataset.data[context.dataIndex]}%`
        },
        afterFooter: () => {
          return "Click to show/hide sub-sectors"
        }

        },
      },
    },

      onClick: (evt, element) => {
        setShowHidden(!showHidden);
        setGetNumber(element[0].index);
      },
};
   

  //Get and fetch data from the database

    let {allDataOfV9, fetchAllDataOfV9} = useContext(ChartContext); 
    useEffect(() => {
        fetchAllDataOfV9();
    },[]);
   
    //Get main sectors from the database
     let mainSector = allDataOfV9.map((data) => data.sector);
     //Get sub sectors from database
     let subSector = allDataOfV9.map((data) => data.sub_sector)
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
    
  // Filter to filter duplicate values off arrays
    let Filter = (arr) =>
    {
     let result = arr.filter((element, i) => arr.indexOf(element) === i)

     return result;
    };
  // Function for randomized colors
    let randomColors = () => 
    {
      let r = Math.floor(Math.random()*255)
      var g = Math.floor(Math.random()*255)
      var b = Math.floor(Math.random()*255)
    
    return "rgb("+r+","+g+","+b+")";
    
    }
     // Get Array Values of C02 by each sector 
     const getValuesOfSubSector = (id) => {

      let getSectorName = "";

      switch (id) {
        case 0:
          getSectorName = "Energy";
          break;
        case 1: 
          getSectorName = "Industry ";
          break;
        case 2:
          getSectorName = "Agriculture, Forestry & Land Use";
          break;
        case 3:
          getSectorName = "Waste"
          break;
        default:
          break;
      }

      let arrayOfEachSectorName = allDataOfV9.filter(x => x.sector === getSectorName).map(x => x.sub_sector);
      let removeDuplicate = arrayOfEachSectorName.filter((a, b) => arrayOfEachSectorName.indexOf(a) === b);

      let arrayOfValues = [];

      removeDuplicate.forEach((name) => {

          let allValuesOfEachSector = allDataOfV9.filter(x => x.sector === getSectorName).filter(x => x.sub_sector === name).map(x => x.Share_of_global_greenhouse_gas_emissions).reduce((acc, element) => acc += element, 0).toFixed(1);

          arrayOfValues.push(parseFloat(allValuesOfEachSector));

      });

     
      return arrayOfValues;
  };

  //Get Array Values of each sub-sub sector

  const getValuesOfSubSubSector = (id) => {
    let getSectorName = "";

    switch (id) {
      case 0:
        getSectorName = "Energy";
        break;
      case 1: 
        getSectorName = "Industry ";
        break;
      case 2:
        getSectorName = "Agriculture, Forestry & Land Use";
        break;
      case 3:
        getSectorName = "Waste"
        break;
      default:
        break;
    };

    let arrayValues = allDataOfV9.filter(x => x.sector === getSectorName).map(x => x.Share_of_global_greenhouse_gas_emissions);
   
    return arrayValues;
  };

  //Get Array Labels by each sub-sub sector
  const getLabelsOfSubSubSector = (id) => {
    let getSectorName = "";
    switch (id) {
      case 0:
        getSectorName = "Energy";
        break;
      case 1: 
        getSectorName = "Industry ";
        break;
      case 2:
        getSectorName = "Agriculture, Forestry & Land Use";
        break;
      case 3:
        getSectorName = "Waste"
        break;
      default:
        break;
    };

    let arrayLabels = allDataOfV9.filter(x => x.sector === getSectorName).map(x => x.sub_sub_sector);
    return arrayLabels;

  };
  

   //Get Array Labels by each sub sector

   const getLabelsOfSubSector = (id) => {

    let getSectorName = "";
    switch (id) {
      case 0:
        getSectorName = "Energy";
        break;
      case 1: 
        getSectorName = "Industry ";
        break;
      case 2:
        getSectorName = "Agriculture, Forestry & Land Use";
        break;
      case 3:
        getSectorName = "Waste"
        break;
      default:
        break;
    }

    let arrayOfEachSectorName = allDataOfV9.filter(x => x.sector === getSectorName).map(x => x.sub_sector);
    let removeDuplicate = arrayOfEachSectorName.filter((a, b) => arrayOfEachSectorName.indexOf(a) === b);

  
    return removeDuplicate;
  };
  const getColor = (id) => 
  {
    let getSectorName = "";
    let color = ""
    switch (id) {
      case 0:
        getSectorName = "Energy";
        color = "rgb(255,255,0)"
        break;
      case 1: 
        getSectorName = "Industry ";
        color ="rgb(169,169,169)"
        break;
      case 2:
        getSectorName = "Agriculture, Forestry & Land Use";
        color = "rgb(0,100,0)"
        break;
      case 3:
        getSectorName = "Waste"
        color = "rgb(139,69,19)"
        break;
      default:
        break;
    }
    return color;
  }
// Sector data values
  let sectorData = [energyTotal,industryTotal, agricultureTotal, wasteTotal];
      const data = {
         labels: Filter(mainSector),
          datasets:
              [{
                  data: sectorData,
                  borderColor: "rgb(0, 0, 0)",
                  backgroundColor: ["rgb(255,255,0)","rgb(169,169,169)","rgb(0,100,0)","rgb(139,69,19)"],
                  labels: Filter(mainSector),
              },
              {
                data: getValuesOfSubSector(getNumber),
                borderColor: [randomColors()],
                backgroundColor: getColor(getNumber),
                labels: getLabelsOfSubSector(getNumber),
                hidden: showHidden,
            },
            {
              data: getValuesOfSubSubSector(getNumber),
              borderColor: randomColors(),
              backgroundColor: getColor(getNumber),
              labels: getLabelsOfSubSubSector(getNumber),
              hidden: showHidden,
          },
          
            ]
            
      }
  return (
    <div>
        <div style={{width: '80%', margin: "auto", border: "3px solid black", borderRadius: 4, padding: 10, backgroundColor: "white", alignItems: "center", justifyContent: "center"}}>
            <Doughnut   options={options} data={data} />
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