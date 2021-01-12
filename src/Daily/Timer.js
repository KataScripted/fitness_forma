import React from 'react';
import { Button, Title, View, Progress, Text } from '@vkontakte/vkui';
import jsonExercises from '../Exercise/everyday.json'
import bridge from "@vkontakte/vk-bridge";

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            minutes: 0,
            seconds: 60,
            show: true,
            valueProgress: 0,
            totalTime: 60,
            notProgressCircle: 0,
            imageGif: '',
            prev_id: this.props.prevId,
        }
        this.timerStart = this.timerStart.bind(this);
        this.changePanelNowNew = this.changePanelNowNew.bind(this);
    }

    componentDidMount() {

        this.timerStart();
        let findData = jsonExercises.find(item => item.id === this.props.id)
        if (findData) {
            this.setState({
                imageGif: findData.imageGif
            })
        }

    }

    changePanelNowNew(panel) {

        this.props.changePanelToFinish(panel, this.state.seconds);
    }


    addDataToStorage() {
        if (this.state.prev_id != 0) {

            var entry = this.props.id+1;
            var stored_datas = JSON.parse(localStorage.getItem(this.state.prev_id+"_exercise")) || [];
            if(stored_datas == null) stored_datas = [];
           stored_datas.push(entry);
           localStorage.setItem(this.state.prev_id+"_exercise", JSON.stringify(stored_datas));
    
       }

    }

    getCircumference() {
        var radius = 60;
        var circumference = Math.PI * (radius * 2);
        for (var i = 0; i <= 10; i++) {
            var circle = {
                percentage: i * 10,
                circumference: circumference
            };
            return circle.circumference;
        }
    }


    timerStart() {
        this.setState({ show: false });
        this.myInterval = setInterval(() => {
            const { seconds, minutes } = this.state

            const hasToAdd = (100 / this.state.totalTime)
            const toAddCirc = this.getCircumference() / 100;

            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1,
                    valueProgress: this.state.valueProgress + hasToAdd,
                    notProgressCircle: this.state.notProgressCircle + (hasToAdd * toAddCirc)
                }))
            }


            if (this.state.seconds == 0) {
                this.props.setActiveModalPanelNowTimer("panel4", this.state.seconds);
                this.addDataToStorage()
            }

            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(this.myInterval)
                } else {
                    this.setState(({ minutes }) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }))
                }
            }
        }, 1000)
    }


    render() {
        const { minutes, seconds } = this.state;
       
        // console.log(findDataIdNow)
        return (

            <div style={{ display: "grid", justifyContent: "center" }}>
                <img src={this.state.imageGif} style={{ maxWidth: '100%', marginBottom: 50 }} />
                <div>


                    {/* {minutes === 0 && seconds === 0 */}
                    {/* ? <Title level="1" weight="bold">Сделано!</Title> */}
                    {/* : */}
                    <div>
                        {/* <Title level="1" weight="bold">Время: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Title> */}
                        <div >
                            {/* <Progress value={this.state.valueProgress} style={{marginTop:10 */}
                            {/* }}/> */}

                            <div style={{ display: "grid", justifyContent: "center" }}>

                                <svg style={{ transform: 'rotate(-90deg)', height: 130, width: 130 }} xmlns="http://www.w3.org/2000/svg">
                                    <text fill={this.props.theme == "space_gray" ? "white" : "black"} transform="rotate(90,65,65)" x="65" y="65" alignmentBaseline="middle" textAnchor="middle" fontSize="35">
                                        {this.state.seconds}
                                    </text>
                                    <circle style={{
                                        fill: 'none',         
                                        strokeWidth: 6
                                    }} cx="65" cy="65" r="60"></circle>
                                    <circle style={{
                                        fill: 'none',
                                        stroke: '#3f8ae0',
                                        strokeWidth: 6,
                                        strokeDasharray: this.state.notProgressCircle + ', 999',
                                        strokeDashoffset: 0,
                                        transition: 'strokeDasharray 0.7s linear 0s'
                                    }} cx="65" cy="65" r="60"></circle>
                                </svg>

                            </div>
                        </div>
                    </div>
                    {/* } */}

                    <div style={{ paddingTop: 15, paddingBottom: 10, display: "flex", justifyContent: "center" }}>
                        <Button size="l" style={{ backgroundColor: this.props.theme == "bright_light" ? "#3f8ae0" : "#2e2e2e", color: "white",cursor: "pointer" }} onClick={() => { this.changePanelNowNew("panel4"); this.addDataToStorage() }}>Закончить</Button>
                    </div>
                    <div style={{ paddingTop: 15, paddingBottom: 10, display: "flex", justifyContent: "center" }}>
                        <Button mode="outline" style={{color: this.props.theme == "bright_light" ? "#3f8ae0" : "white", borderColor: this.props.theme == "bright_light" ? "#3f8ae0" : "#2e2e2e",cursor: "pointer"}} onClick={() => { this.props.setActiveModalClose("panel1") }}>Отменить упражнение</Button>
                    </div>

                </div>
            </div>


        )
    }
}

export default Timer;