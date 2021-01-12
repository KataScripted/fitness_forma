import React from 'react';
import { List, Text, Title, Button, Spinner, PromoBanner } from '@vkontakte/vkui';
import jsonExercises from '../Exercise/everyday.json'
import bridge from "@vkontakte/vk-bridge";
import img from '../img/image.jpg';


class Finish extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            handsLevel: '',
            gotHands: 0,
            gotBody: 0,
            gotLegs: 0,
            nowLevelHands: 0,
            nowLevelBody: 0,
            nowLevelLegs: 0,
            loading: true,
            levelHands: 0,
            levelBody: 0,
            levelLegs: 0,
            loading: true,
            promoBannerProps: { }

        }
        this.changePanelNow = this.changePanelNow.bind(this);
    }

    componentDidMount() {

        bridge.send('VKWebAppGetAds')
        .then((promoBannerProps) => {
            this.setState({ promoBannerProps }); 
        }) 

        let findData = jsonExercises.find(item => item.id === this.props.id)
        if (findData) {
            this.setState({
                title: findData.title,
            })

            // var nowLevelHands = 2;
            // var nowLevelBody;
            // var nowLevelLegs;



            // var newDataHands = (Number(nowLevelHands) + findData.ads_level_to_hands).toFixed(1);
            // var newDataBody = (Number(nowLevelBody) + findData.ads_level_to_body).toFixed(1);
            // var newDataLegs = (Number(nowLevelLegs) + findData.ads_level_to_legs).toFixed(1)

            // localStorage.setItem("hands_level",newDataHands);
            // localStorage.setItem("body_level", newDataBody);
            // localStorage.setItem("legs_level", newDataLegs);
        }

        var hands_level_cur;

        var findDataLevel;
        if (this.props.prevId != 0) {
            findDataLevel = jsonExercises.find(item => item.id === this.props.prevId)
        }
        else {
            findDataLevel = jsonExercises.find(item => item.id === this.props.id)
        }

        this.setState({
            gotHands: findDataLevel.ads_level_to_hands,
            gotBody: findDataLevel.ads_level_to_body,
            gotLegs: findDataLevel.ads_level_to_legs,
            loading: false
        })


        bridge.send("VKWebAppStorageGet", { "keys": ["hands_level", "body_level", "legs_level"] }).then(event => {

            const hands_level_vk = event.keys.find(item => item.key == "hands_level");
            const body_level_vk = event.keys.find(item => item.key == "body_level");
            const legs_level_vk = event.keys.find(item => item.key == "legs_level");



            if (findDataLevel) {
                var adsLevelHands = findDataLevel.ads_level_to_hands;
                var adsLevelBody = findDataLevel.ads_level_to_body;
                var adsLevelLegs = findDataLevel.ads_level_to_legs;

                var nowLevelHandsNow = ((Number(hands_level_vk.value) + adsLevelHands).toFixed(1)).toString();
                var nowLevelBodyNow = ((Number(body_level_vk.value) + adsLevelBody).toFixed(1)).toString();
                var nowLevelLegsNow = ((Number(legs_level_vk.value) + adsLevelLegs).toFixed(1)).toString();

                window.$nowLevelHandsNow = nowLevelHandsNow;

                bridge.send("VKWebAppStorageSet", { "key": "hands_level", "value": nowLevelHandsNow });
                bridge.send("VKWebAppStorageSet", { "key": "body_level", "value": nowLevelBodyNow });
                bridge.send("VKWebAppStorageSet", { "key": "legs_level", "value": nowLevelLegsNow });




                this.setState({
                    nowLevelHands: nowLevelHandsNow,
                    nowLevelBody: nowLevelBodyNow,
                    nowLevelLegs: nowLevelLegsNow,
                })
            }



        })
            .catch(error => {
                alert(error)
            });


    }


    getTimeDone() {
        var time = (60 - this.props.sec);

        if (time == 1) {
            return time+"-у "+"секунду"
        }
        else if (time == 2 || time == 3 || time == 4) {
            return time+" "+"секунды"
        }
        else {
            return time+" "+"секунд"
        }
    }


    changePanelNow() {
        this.props.changePanel();
    }


    changePanelNowNew(panel, id, prevId) {
        this.props.changePanelNew(panel, id, prevId);
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
            var min = Math.min.apply(Math, [this.props.level_hands, this.props.level_body, this.props.level_legs]);

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

    returnRecomend(count) {
        var dataExercise = jsonExercises.find(item => item.id == count)
        if (dataExercise) {
            return (
                <div style={{
                    borderRadius: 3, marginTop: 10, width: "48%",
                    display: "inline-table", backgroundColor: this.props.theme == "space_gray" ? "#2e2e2e" : "#efefef", cursor: "pointer"
                }}
                    onClick={() => dataExercise.multi ? this.changePanelNowNew("allExercise", dataExercise.id, dataExercise.id) : this.changePanelNowNew("exercise", dataExercise.id, 0)}>
                    <img src={dataExercise.image} style={{ width: "100%", height: 100 }}></img>
                    <Text style={{ padding: 8, fontSize: 18 }}>{dataExercise.title}</Text>
                </div>

            )
        }
    }

    render() {
        var firstRec = this.findRecomendation(this.props.prevId == 0 ? this.props.id : this.props.prevId, this.props.level_hands, this.props.level_body, this.props.level_legs, null)
        var secondRec = this.findRecomendation(firstRec, this.props.level_hands, this.props.level_body, this.props.level_legs, this.props.prevId == 0 ? this.props.id : this.props.prevId)
        return (
            <div>
                {this.props.prevId != 0 ? (
                    <div style={{ position: "relative" }}>
                        <img src={img} alt='Image' style={{ left: 0, top: 0, maxWidth: '100%', filter: "brightness(30%)", }} />
                        <div style={{ display: "flex", justifyContent: "center" }}><div style={{ position: "absolute", top: "20%", zIndex: 9, marginTop: "40px", color: "white", fontSize: "24px", width: "70%", textAlign: "center" }}>
                            Вы закончили модуль!</div></div>

                    </div>
                ) : (
                        <div style={{ position: "relative" }}>
                            <img src={img} alt='Image' style={{ left: 0, top: 0, maxWidth: '100%', filter: "brightness(30%)" }} />
                            <div style={{ display: "flex", justifyContent: "center" }}><div style={{ position: "absolute", top: "20%", zIndex: 9, marginTop: "40px", color: "white", fontSize: "24px", width: "70%", textAlign: "center" }}>
                                Вы выпонили упражнение за <h style={{ color: "green" }}>{this.getTimeDone()}</h></div></div>
                        </div>
                    )}


                <div style={{ paddingTop: 15, marginLeft: 10, marginRight: 10 }}>

                    <Title level="2" weight="bold" style={{ marginBottom: 20 }}>Полученные уровни:</Title>
                    {this.state.loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Spinner size="medium" style={{ marginTop: 20, marginBottom: 20 }} />
                        </div>
                    ) : (
                            <List>
                                <Text style={{ fontSize: 18, marginBottom: 20 }}>У рук: {this.state.gotHands}</Text>
                                <Text style={{ fontSize: 18, marginBottom: 20 }}>У тела: {this.state.gotBody}</Text>
                                <Text style={{ fontSize: 18, marginBottom: 20 }}>У ног: {this.state.gotLegs}</Text>
                            </List>
                        )}

                    <div style={{ paddingTop: 5 }}>
                        
                    {this.state.promoBannerProps.title === undefined ? (
                      <div></div>
                    ) : (
                        <div>
                        { this.state.promoBannerProps && <PromoBanner style={{border: "1px solid white",
                        borderRadius: 4
                        }} bannerData={ this.state.promoBannerProps } /> }
                        </div>
                    )}
                     
                    </div>
                </div>
                <Button size="xl" style={{ backgroundColor: this.props.theme == "bright_light" ? "#3f8ae0" : "#2e2e2e", color: "white", marginTop: 30, marginBottom: 20, width: "80%", marginLeft: "10%", cursor: "pointer" }} onClick={() => this.changePanelNow()}>На главную</Button>
            </div>

        )
    }
}

export default Finish;