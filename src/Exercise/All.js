import React from 'react'
import { Text } from "@vkontakte/vkui";
import jsonExercises from './exercises.json'

class All extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            allData: [],
            id: null
        }
        this.changePanelNow = this.changePanelNow.bind(this);
    }



    changePanelNow(panel, id, prevId, isAll) {
        this.props.changePanel(panel, id, prevId, isAll);
    }

    render() {
        return (
            <div style={{ display: "flex", justifyContent: 'space-between', flexWrap: "wrap", padding:10 }}>

                {jsonExercises.map(data => {
                    return (
                        <div style={{borderRadius: 3, marginTop: 10, width: "48%", backgroundColor: this.props.theme == "space_gray" ? "#2e2e2e" : "#efefef", cursor: "pointer"}} 
                      onClick={() => data.multi ? this.changePanelNow("allExercise", data.id, data.id, 1) : this.changePanelNow("exercise", data.id, 0, 1)}>
                      <img src={data.image} style={{width: "100%", height: 100}}></img>
                 <Text style={{padding: 8, fontSize: 18}}>{data.title}</Text>
                      </div>
                    )
                })}


            </div>
        )
    }
}
export default All;