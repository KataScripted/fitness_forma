import React from 'react';
import { Text, Group, Header, List, Cell, Link, Spinner, Button,PromoBanner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import bridge from "@vkontakte/vk-bridge";


class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            avatar: '',
            levelHands: 0,
            levelBody: 0,
            levelLegs: 0,
            loading: true,
            promoBannerProps: {}
        }
    }

    componentDidMount() {

        bridge.send('VKWebAppGetAds')
        .then((promoBannerProps) => {
            this.setState({ promoBannerProps }); 
        }) 

        if (this.props.allowTochangeData) {
            this.changeDataBridge();
        }
        // Sending method

    }


    changeDataBridge = () => {
        bridge.send("VKWebAppStorageGet", { "keys": ["hands_level", "body_level", "legs_level"] }).then(event => {
            var returnedData = event.keys.map(item => item.value);


            const hands_level_vk = event.keys.find(item => item.key == "hands_level");
            const body_level_vk = event.keys.find(item => item.key == "body_level");
            const legs_level_vk = event.keys.find(item => item.key == "legs_level");

            this.setState({
                levelHands: hands_level_vk.value,
                levelBody: body_level_vk.value,
                levelLegs: legs_level_vk.value,
                loading: false
            })

        })

    }

    newLevels() {
        		bridge.send("VKWebAppStorageSet", {"key": "hands_level", "value": "0.0"});

			bridge.send("VKWebAppStorageSet", {"key": "body_level", "value": "0.0"});

        bridge.send("VKWebAppStorageSet", {"key": "legs_level", "value": "0.0"});
        
        this.setState({
            levelHands: 0.0,
            levelBody: 0.0,
            levelLegs: 0.0,
        })
    }

    sendStory = () => {
        bridge.send("VKWebAppShowStoryBox", { "background_type" : "image", "url" : "https://i.ibb.co/84mhVzj/banner-vk.jpg",
    "attachment": [{
        'link_text': 'open',
        'link_url': 'https://vk.com/app7529049_-196911520'
    }]})
        .then(event => {
          console.log(event)
        }).catch(function(e) {
           
            console.log(e); // "oh, no!"
          })
    }
    

    render() {
        return (
            <div style={{ padding: 10, marginTop: 10 }}>

                <div style={{ display: "grid", justifyContent: "center" }}>
                    <img style={{ borderRadius: 50, margin: "auto" }} src={this.props.avatar}></img>
                    <Text style={{ display: "flex", justifyContent: "center", marginTop: 10, fontSize: 18, WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none" }}>{this.props.name}</Text>
                </div>
                <div style={{ paddingTop: 20 }}>
                </div>
                {this.state.loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Spinner size="medium" style={{ marginTop: 20, marginBottom: 20 }} />
                    </div>
                ) : (
                        <Group header={<Header mode="secondary"><Text style={{WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none" }}>Ваши уровни:</Text></Header>}>
                            <List>
                                <Cell>Уровень рук: {this.state.levelHands}</Cell>
                                <Cell>Уровень тела: {this.state.levelBody}</Cell>
                                <Cell>Уровень ног: {this.state.levelLegs}</Cell>
                            </List>
                        </Group>
                    )}

                <Group>
                <Button size="xl" mode="secondary" onClick={() => this.newLevels()} style={{marginBottom: 10, cursor: "pointer"}}>Обнулить уровни</Button>

                    <div style={{borderWidth: 1, width: "100%", border: '1px solid ',borderColor: this.props.theme == "bright_light" ? "#3f8ae0" : "#454647", borderRadius: 10}}>
                    <Link href="https://vk.com/fitnes_forma_app" target="_blank" style={{
                        color: this.props.theme == "bright_light" ? "#3f8ae0" : "white", 
                        display: "block", textAlign: "center", cursor: "pointer"
                    }}><Text style={{ padding: 12, fontSize: 17, fontWeight: 500, WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none" }}>Группа ВК</Text></Link>
                </div>
                </Group>
                
                
            </div>
           
        );
    }
}

export default Profile;