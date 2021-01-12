import React from "react";
import { View, PanelHeader, Text, Group, Div, Title, Button } from "@vkontakte/vkui";
import jsonExercises from '../Exercise/everyday.json'

class Exercise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePanel: 'header',
            title: '',
            description: '',
            imageGif: '',
        }
        this.changePanelNowNewExersice = this.changePanelNowNewExersice.bind(this);
    }

    componentDidMount() {
        let findData = jsonExercises.find(item => item.id === this.props.id)
        if (findData) {
            this.setState({
                title: findData.title,
                description: findData.description,
                imageGif: findData.imageGif
            })
        }
    }

    changePanelNowNewExersice() {
        this.props.changePanelNowNewStateExersice();
    }


    render() {

        return (

            <div>
                <Group>
                <img src={this.state.imageGif} alt='Image' style={{ maxWidth: '100%', paddingTop: 10, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />

                    <Div>
                        <Title level="1" weight="bold" style={{ marginBottom: 16,WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none" }}>{this.state.title}</Title>
                        <Text style={{WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none"}}>{this.state.description}</Text>
                    </Div>

                    <Div>
                        <Button size="xl" style={{ backgroundColor: this.props.theme == "bright_light" ? "#3f8ae0" : "#2e2e2e", color: "white",cursor: "pointer" }} onClick={() => this.changePanelNowNewExersice()}>Начать</Button>
                    </Div>

                </Group>


            </div>
        )
    }
}

export default Exercise;