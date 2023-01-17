
//This method will fetch the data from the API and return the data
const getWeatherData=(cityname)=>{
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'a302d85386msh7d2672867d523ecp1b333ajsn7c98766041cc',
		'X-RapidAPI-Host': 'air-quality-by-api-ninjas.p.rapidapi.com'
	}
};

return fetch(`https://air-quality-by-api-ninjas.p.rapidapi.com/v1/airquality?city=${cityname}`, options)
	.then(response => response.json())
	.then(response => response)
	.catch(err => console.error(err));
}


/* 
1)We created cache object inorder to cache the city data it will store cityname as key and data as value
2)cache will store the repeated data for the particular duration based on your need we can change the duration 
  period cacheTime will take cafe of duration
3)If the user enter the particular city name it will check  the cache whether the data is available or not
 if the data is available it will return the data else it will update the cache with the new data and time stamp

*/
const cacheTime=100000;
const cache={}
let cacheTimer=0

const getCacheTimer=time=>{
    const now=new Date().getTime()
    if(cacheTimer < now + time)
    {
        cacheTimer=now + time
    }
    return cacheTimer
}

//This function will check for data inside the cache if available it will return else update the cache object
const fetchWithCache= async (cityName,time)=>{

    const now=new Date().getTime()
    if(!cache[cityName] || cache[cityName].cacheTimer<now)
    {
        cache[cityName]=await getWeatherData(cityName)
        cache[cityName].cacheTimer=getCacheTimer(time)
    }
    
    return cache[cityName]
    
}

    

//Allow user to search the city name and show the result in DOM
const searchCity=async ()=>{

    const city=document.getElementById('city-input').value;
    if(isNaN(city))
    {
        const data=await fetchWithCache(city)
    //const data=await fetchWithCache(city)
    showWeatherData(data)
    }
    else
    {
        alert("Enter valid city");
    }
    
}

//This function will show the result in DOM
const showWeatherData=(weatherData)=>{

     let level=Number(weatherData.overall_aqi);
     
     
     if(level<=50)
     {
        document.getElementById("polution-level").innerText="FRESH AIR"
     }
     else if(level>50 && level<=100)
     {
        document.getElementById("polution-level").innerText="MODERATE AIR"
     }
     else if(level>100 && level<=200)
     {
        document.getElementById("polution-level").innerText="UNHEALTHY AIR"
     }
     else if(level>200 && level<=300)
     {
        document.getElementById("polution-level").innerText="VERY UNHEALTHY"
     }
     else if(level>300)
     {
        document.getElementById("polution level").innerText="HAZARDOUS"
     }

    document.getElementById("city-name").innerText=document.getElementById('city-input').value
    document.getElementById("co").innerHTML=weatherData.CO.concentration
    document.getElementById("no2").innerHTML=weatherData.NO2.concentration
    document.getElementById("o3").innerHTML=weatherData.O3.concentration
    document.getElementById("so2").innerHTML=weatherData.SO2.concentration
    document.getElementById("overall").innerHTML=weatherData.overall_aqi
}