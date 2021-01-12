import React from "react";
import { Div, Button, Text } from "@vkontakte/vkui";
import jsonExercises from './Exercise/exercises.json'
import bridge from "@vkontakte/vk-bridge";

const MODAL_CARD_MONEY_SEND = 'money-send';
const MODAL_CARD_APP_TO_MENU = 'app-to-menu';


class AllExercise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePanel: 'header',
            id: this.props.id,
            allExerciseArray: [],
            activeModal: null,
            modalHistory: []
        }
        this.changePanelNowNewExersice = this.changePanelNowNewExersice.bind(this);

    }

    componentDidMount() {
        // bridge.send("VKWebAppStorageSet", {"key": this.state.id.toString(), "value": ""});
        // localStorage.setItem(this.state.id, "")

        var localId = JSON.parse(localStorage.getItem(this.state.id + "_exercise")) || [];
        if (localId == null) {
            localStorage.setItem(this.state.id + "_exercise", "")
        }
        else {
            this.setState({
                allExerciseArray: localId
            })

        }

        // alert(localStorage.getItem(this.state.id) || "[]")



    }

    changePanelNowNewExersice(panel, id) {
        let findDataNow = jsonExercises.find(item => item.id === this.state.id)
        var last_element = findDataNow.exercise[findDataNow.exercise.length - 1];

        this.props.changePanelNowNewStateExersice(panel, id, last_element.id == id);
    }

    setActiveModalPanel(modal) {
        this.props.setActiveModalPanelNow(modal);
    }

    render() {

        let findData = jsonExercises.find(item => item.id === this.state.id)
        return (
            <div style={{ padding: 10, WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none"  }}>

                <div style={{ borderRadius: 3, marginTop: 10,}} >
                    <img src={findData.exercise[0].image} style={{
                        maxWidth: "100%", borderRadius: 3, height: 160,
                        width: "100%", filter: "brightness(50%)"
                    }}></img>

                    <Div style={{ position: "absolute", marginTop: findData.exercise[0].title.length > 22 ? "-120px" : "-100px", width: "85%", marginLeft: 10, }}>
                        <Text style={{
                            color: "white",
                            fontSize: findData.exercise[0].title.length > 22 ? 20 : 24,
                            WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none"
                        }}>{findData.exercise[0].title}</Text>
                        <Button style={{
                            color: "white", marginTop: 15,
                            borderColor: "white",
                            cursor: "pointer" 
                        }} mode="outline" size="l" onClick={() => this.changePanelNowNewExersice("exercise", findData.exercise[0].id)}>Начать</Button>
                    </Div>
                </div>



                {findData.exercise.slice(1).map(item => (
                    <div>

                        {this.state.allExerciseArray.includes(item.id) ? (
                            // <div
                            // style={{marginTop: 10,display: "flex", border: "1px solid silver",
                            // borderRadius: 5,
                            // justifyContent: "space-between",}}>
                            // <div style={{justifyContent: "space-between",
                            // flexDirection: "column",
                            // display: "flex",  padding: 10, }}>
                            // <Text style={{fontSize: 20,color: "black", marginBottom: 10}}>{item.title}</Text>


                            //     <Button style={{color: "black",
                            // borderColor: "black"}} mode="outline" onClick={() => this.changePanelNowNewExersice("exercise", item.id)}>Начать</Button>

                            // </div>
                            // <img src={item.image} alt='Abs' style={{width: 200}} />
                            // </div>

                            <div style={{ borderRadius: 3, marginTop: 10,  }} >
                                <img src={item.image} style={{
                                    maxWidth: "100%", borderRadius: 3, height: 160,
                                    width: "100%", filter: "brightness(50%)"
                                }}></img>

                                <Div style={{ position: "absolute",  marginTop: item.title.length > 22 ? "-120px" : "-100px", width: "85%", marginLeft: 10, }}>
                                    <Text style={{
                                        color: "white",
                                        fontSize: item.title.length > 18 ? 20 : 24,
                                        WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none"
                                    }}>{item.title}</Text>
                                    <Button style={{
                                        color: "white", marginTop: 15,
                                        borderColor: "white",
                                        cursor: "pointer"
                                    }} mode="outline" size="l" onClick={() => this.changePanelNowNewExersice("exercise", item.id)}>Начать</Button>
                                </Div>
                            </div>

                        ) : (

                                <div style={{ borderRadius: 3, marginTop: 10,WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none"}} >
                                    <img src={item.image} style={{
                                        maxWidth: "100%", borderRadius: 3, height: 160,
                                        width: "100%", filter: "brightness(10%)"
                                    }}></img>

                                    <Div style={{ position: "absolute", marginTop: item.title.length > 22 ? "-120px" : "-100px", width: "85%", marginLeft: 10,  }}>
                                        <Text style={{
                                            color: "#b5b5b5",
                                            fontSize: item.title.length > 18 ? 20 : 24,
                                            WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none"
                                        }}>{item.title}</Text>
                                        <Button style={{
                                            color: "#b5b5b5", marginTop: 15,
                                            borderColor: "#b5b5b5",
                                            cursor: "pointer"
                                        }} mode="outline" size="l" onClick={() => this.setActiveModalPanel(MODAL_CARD_MONEY_SEND)}>Начать</Button>
                                    </Div>
                                </div>
                            )}

                    </div>


                ))
                }
            </div>
        )
    }
}

export default AllExercise;