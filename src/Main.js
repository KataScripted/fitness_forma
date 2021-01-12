import React from 'react';
import { Text, View, Link, Header, Group, Card, Title, PullToRefresh,HorizontalScroll } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";

import { Offline, Online } from "react-detect-offline";

import jsonExercises from './Exercise/exercises.json'
import everyday from './Exercise/everyday.json'
import pushUpsImage from './img/push_ups_new.png'
const itemStyle = {
  flexShrink: 0,
  width: 80,
  height: 94,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontSize: 12
};

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      allData: [],
      id: null,
      levelHands: 0,
      levelBody: 0,
      levelLegs: 0,
      loading: true,
      isMounted: false,
      fetching: false,
      loadingStorageOne: true,
      loadingStorageTwo: true
    }
    this.changePanelNow = this.changePanelNow.bind(this);
    this.changePanelToAll = this.changePanelToAll.bind(this);

   

  }


  changePanelToAll() {
    this.props.changeToAll();
  }

  findRecomendation = (newJson, handsLevel, bodyLevel, legsLevel, count) => {
    // Handling received data

    var nowJson;

    if (newJson == null) {
      nowJson = jsonExercises;
    }
    else {
      if (count == null) {
        nowJson = jsonExercises.filter(item => !(item.id).toString().includes(newJson));
      }
      else {
        nowJson = jsonExercises.filter(item => !(item.id).toString().includes(newJson) && !(item.id).toString().includes(count));
      }
    }


    var countsHands = nowJson.map(item => item.level_hands_has_to_min);
    var countsBody = nowJson.map(item => item.level_body_has_to_min);
    var countsLegs = nowJson.map(item => item.level_legs_has_to_min);


    var closestHands = countsHands.reduce((prev, curr) => {
      return (Math.abs(curr - handsLevel) < Math.abs(prev - handsLevel) ? curr : prev);
    });
    var closestBody = countsBody.reduce((prev, curr) => {
      return (Math.abs(curr - bodyLevel) < Math.abs(prev - bodyLevel) ? curr : prev);
    });

    var closestLegs = countsLegs.reduce((prev, curr) => {
      return (Math.abs(curr - legsLevel) < Math.abs(prev - legsLevel) ? curr : prev);
    });



    let indexHands = nowJson.find(item => item.level_hands_has_to_min == closestHands);
    let indexBody = nowJson.find(item => item.level_body_has_to_min == closestBody);
    let indexLegs = nowJson.find(item => item.level_legs_has_to_min == closestLegs);
    const findDuplicates = (arr) => {
      let sorted_arr = arr.slice().sort();

      let results = [];
      for (let i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] == sorted_arr[i]) {
          results.push(sorted_arr[i]);
        }
      }
      return results;
    }

    var newDubl;
    if ([...new Set(findDuplicates([indexHands.id, indexBody.id, indexLegs.id]))] == '') {
      var min = Math.min.apply(Math,[this.props.level_hands, this.props.level_body, this.props.level_legs]);
      
      if (min == this.props.level_hands) {
      newDubl = indexHands.id;
      }
      else if (min == this.props.level_body) {
      newDubl = indexBody.id;
      }
      else if (min == this.props.level_legs) {
      newDubl = indexLegs.id;
      }
      }
      
    else {
      newDubl = [...new Set(findDuplicates([indexHands.id, indexBody.id, indexLegs.id]))];
    }

    window.$notTo = newDubl; //global variable

    return newDubl;

  }

  changePanelNow(panel, id, prevId) {
    this.props.chanePanel(panel, id, prevId);
  }

  returnEveryday(){
    
    // setTimeout(()=>{ 
    //    random = everyday[Math.floor(Math.random() * everyday.length)]
    //    random2 = [everyday.filter(item => item.id != random.id)][Math.floor(Math.random() * [everyday.filter(item => item.id != random.id)].length)]   
    // alert('changed')
    //  }, 3000);

  
    var dayExercise1 = JSON.parse(localStorage.getItem("dayExercise1")) || [];
    var dayExercise2 = JSON.parse(localStorage.getItem("dayExercise2")) || [];

    var random = everyday[Math.floor(Math.random() * everyday.length)]


    if (dayExercise1 == null || dayExercise1 == '') {
      localStorage.setItem("dayExercise1", JSON.stringify(random))
      this.setState({
        loadingStorageOne: false
      })
    }
    console.log(everyday.filter(item => item.id != dayExercise1.id))

    var random2 = everyday.filter(item => item.id != dayExercise1.id)[Math.floor(Math.random() * everyday.filter(item => item.id != dayExercise1.id).length)]   
    if (dayExercise2 == null || dayExercise2 == '') {
      localStorage.setItem("dayExercise2", JSON.stringify(random2))
      this.setState({
        loadingStorageOne: false
      })
    }


    var d = new Date();
    var d2 = new Date();
    var dt = new Date(d2.getYear(), d2.getMonth(), d2.getDay(), d2.getHours(), d2.getMinutes(), d2.getSeconds()); // Mon Feb 03 2014 10:30:50 

    const updateData = () => {
      alert("updated")
      var randomOne = everyday[Math.floor(Math.random() * everyday.length)]
  localStorage.setItem("dayExercise1", JSON.stringify(randomOne))

  var dayExerciseOne = JSON.parse(localStorage.getItem("dayExercise1")) || [];

  var randomTwo = everyday.filter(item => item.id != dayExerciseOne.id)[Math.floor(Math.random() * everyday.filter(item => item.id != dayExerciseOne.id).length)]   
  localStorage.setItem("dayExercise2", JSON.stringify(randomTwo))
    }
    
    var date = new Date().toLocaleDateString();
    var nowDateStorage = localStorage.getItem("day");
    if (nowDateStorage == null || nowDateStorage == '') {
       localStorage.setItem("day", date)
    }

    var nowDateStorageTwo = localStorage.getItem("day");
 
    if (date != nowDateStorageTwo) {
      var randomOne = everyday[Math.floor(Math.random() * everyday.length)]
      localStorage.setItem("dayExercise1", JSON.stringify(randomOne))
    
      var dayExerciseOne = JSON.parse(localStorage.getItem("dayExercise1")) || [];
    
      var randomTwo = everyday.filter(item => item.id != dayExerciseOne.id)[Math.floor(Math.random() * everyday.filter(item => item.id != dayExerciseOne.id).length)]   
      localStorage.setItem("dayExercise2", JSON.stringify(randomTwo))

      var newSate = new Date().toLocaleDateString();
      localStorage.setItem("day", newSate)
    }

   return (
     <div>

<HorizontalScroll>



<div style={{ display: 'flex', width: '160%' }}>

{!this.state.loadingStorageOne ? (
        
<div style={{width: "70%", marginRight: 10}}>
<img src={dayExercise1.image} style={{
maxWidth: "100%", borderRadius: 10, height: 160,
width: "100%", filter: "brightness(50%)"
}}
onClick={() => this.changePanelNow("exerciseDaily", dayExercise1.id, 0)}>

</img>

<Text style={{
position: 'relative',
top: dayExercise1.title.length > 22 ? "-70px" : "-50px",
        color: "white", width: "90%",
        fontSize: 24,marginLeft: 10,lineHeight: 1,WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none"
}}>{dayExercise1.title}</Text>

</div>

   ) : (
<div style={{width: "70%", marginRight: 10}}>
     {dayExercise1 == null || dayExercise1 == '' ? (
<div>loading...</div>
     ) : (
       <div>
<img src={dayExercise1.image} style={{
maxWidth: "100%", borderRadius: 10, height: 160,
width: "100%", filter: "brightness(50%)"
}}
onClick={() => this.changePanelNow("exerciseDaily", dayExercise1.id, 0)}>

</img>

<Text style={{
position: 'relative',
top: dayExercise1.title.length > 22 ? "-70px" : "-50px",
        color: "white", width: "90%",
        fontSize: 24,lineHeight: 1,marginLeft: 10,WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none"
}}>{dayExercise1.title}</Text>
</div>
     )}
    </div>
  )}

  

{!this.state.loadingStorageTwo ? (
  <div style={{width: "70%", marginRight: 10}}>
  <img src={dayExercise2.image} style={{
         maxWidth: "100%", borderRadius: 10, height: 160,
         width: "100%", filter: "brightness(50%)"
       }}
       onClick={() => this.changePanelNow("exerciseDaily", dayExercise2.id, 0)}>
       </img>
      
       <Text style={{
        position: 'relative',
         top: dayExercise2.title.length > 22 ? "-70px" : "-50px",
                     color: "white", width: "90%",
                     fontSize: 24,lineHeight: 1,marginLeft: 10,WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none"
       }}>{dayExercise2.title}</Text>

</div>
) : (
<div style={{width: "70%", marginRight: 10}}>
     {dayExercise2 == null || dayExercise2 == '' ? (
<div>loading...</div>
     ) : (
      <div>

      <img src={dayExercise2.image} style={{
         maxWidth: "100%", borderRadius: 10, height: 160,
         width: "100%", filter: "brightness(50%)"
       }}
       onClick={() => this.changePanelNow("exerciseDaily", dayExercise2.id, 0)}>
       </img>
      
       <Text style={{
        position: 'relative',
         top: dayExercise2.title.length > 22 ? "-70px" : "-50px",
                     color: "white", width: "90%",
                     fontSize: 24,lineHeight: 1,marginLeft: 10,WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none"
       }}>{dayExercise2.title}</Text>
      </div>
     )}
    </div>
)}





          </div>
        </HorizontalScroll>

<HorizontalScroll>
   
 
 
  </HorizontalScroll>
   </div>
  )

  }


  returnRecomend(count) {
    var dataExercise = jsonExercises.find(item => item.id == count)

    if (dataExercise) {
      return (
        <div style={{ borderRadius: 3, marginTop: 10, cursor: "pointer" }}
          onClick={() => dataExercise.multi ? this.changePanelNow("allExercise", dataExercise.id, dataExercise.id) : this.changePanelNow("exercise", dataExercise.id, 0)}>
          <img src={dataExercise.image} style={{
            maxWidth: "100%", borderRadius: 3, height: 160,
            width: "100%", filter: "brightness(50%)"
          }}></img>
          <Text style={{
            position: "absolute",
            marginTop: dataExercise.title.length > 22 ? "-70px" : "-50px",
                        color: "white", width: "90%",
                        fontSize: 24,lineHeight: 1,marginLeft: 10,WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none"
          }}>{dataExercise.title}</Text>
        </div>
      )
    }
  }

  render() {
    var firstRec = this.findRecomendation(null, this.props.level_hands, this.props.level_body, this.props.level_legs, null)
    var secondRec = this.findRecomendation(firstRec, this.props.level_hands, this.props.level_body, this.props.level_legs, null)
    var thirdRec = this.findRecomendation(firstRec, this.props.level_hands, this.props.level_body, this.props.level_legs, secondRec)

    return (
      <div>

<PullToRefresh onRefresh={this.props.onRefreshFun} isFetching={this.props.fetching}>

        <div style={{ padding: 10 }}>

        <Title level="1" weight="bold" style={{ marginBottom: 20}}>Дневные упражнения</Title>
        

      {this.returnEveryday()}


          <Title level="1" weight="bold" style={{ marginBottom: 20, marginTop: '-5px' }}>Рекомендуем</Title>
          <div>



            {this.returnRecomend(firstRec)}
            {this.returnRecomend(secondRec)}
            {this.returnRecomend(thirdRec)}





            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Title level="1" weight="bold" style={{ marginBottom: 16, marginTop: 15 }}>Другие</Title>
              <Text onClick={() => this.changePanelNow("panel_all", 0, 0)} style={{ WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none", color: this.props.theme == "space_gray" ? "rgb(63, 138, 224)" : "rgb(22, 115, 177)", cursor: "pointer" }}>Показать все</Text>
            </div>

            <div>

              <div>

                {jsonExercises.slice(0, 6).map(data => {
                  return (
                    <div style={{ borderRadius: 3, marginTop: 10, cursor: "pointer" }}
                      onClick={() => data.multi ? this.changePanelNow("allExercise", data.id, data.id) : this.changePanelNow("exercise", data.id, 0)}>
                      <img src={data.image} style={{
                        maxWidth: "100%", borderRadius: 3, height: 160,
                        width: "100%", filter: "brightness(50%)"
                      }}></img>
                      <Text style={{
                        position: "absolute",
                        marginTop: "-50px",
                        color: "white", width: "90%",
                        fontSize: 24, marginLeft: 10,WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none"
                      }}>{data.title}</Text>
                    </div>
                  )

                })}


              </div>

            </div>



          </div>

        </div>


        </PullToRefresh>


      </div>




    );


  }
}

export default Main;