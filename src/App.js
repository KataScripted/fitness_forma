import React from 'react';
import { Tabbar, TabbarItem, Panel, PanelHeader, View, ModalRoot, ModalCard, PanelHeaderBack, Epic, Button } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon24Newsfeed from '@vkontakte/icons/dist/24/newsfeed';
import Icon28PictureOutline from '@vkontakte/icons/dist/28/picture_outline';
import Main from './Main'
import Profile from './Profile'
import Exercise from './Exercise/Exercise'
import AllExercise from './AllExercise'
import bridge from "@vkontakte/vk-bridge";
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';
import Icon24User from '@vkontakte/icons/dist/24/user';

import Abs from './img/UJAnRhJ.gif'
import pushUpsImage from './img/push_ups_new.png'

import Timer from './Exercise/Timer'
import Finish from './Exercise/Finish'
import All from './Exercise/All'

import ExerciseDaily from './Daily/Exercise'
import TimerDaily from './Daily/Timer'
import FinishDaily from './Daily/Finish'

import jsonExercises from './Exercise/exercises.json'

const MODAL_CARD_MONEY_SEND = 'money-send';
const TIME_IS_OVER = 'time';
const MODAL_CARD_APP_TO_MENU = 'app-to-menu';
const EXERCISE_MODAL = "exercise_modal";


class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activePanel: 'panel1',
			activeStory: 'panel1',
			activeId: 0,
			prevActiveId: 0,
			returnedDataHands: '',
			recomendFirst: '',
			recomendSec: '',
			recomendThird: '',
			excutionTime: 0,
			activeModal: null,
			modalHistory: [],
			isLastElement: false,
			levelHands: 0,
			levelBody: 0,
			levelLegs: 0,
			theme: "",
			fetching: false,
			history: ["panel1"],
			isAllPanel: 0,
			prevPanelState: [],
			errorNow: "",
			anotherlevelHands: 0,
			anotherlevelBody: 0,
			anotherlevelLegs: 0,
			allowTochangeData: false,
			allowToGoBack: true,
			name: "",
			avatar: "",
			saveActivePanel: "",
			internet: true,
			isAllEnding: false,
			addHistory: ["panel1"],
			adHasShown: false
		};
		this.onStoryChange = this.onStoryChange.bind(this);

		this.modalBack = () => {
			this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
		};

		this.onRefresh = () => {
			this.setState({ fetching: true });

			setTimeout(() => {
				bridge.send("VKWebAppStorageGet", { "keys": ["hands_level", "body_level", "legs_level"] }).then(event => {

					const hands_level_vk = event.keys.find(item => item.key == "hands_level");
					const body_level_vk = event.keys.find(item => item.key == "body_level");
					const legs_level_vk = event.keys.find(item => item.key == "legs_level");

					this.setState({
						levelHands: hands_level_vk.value,
						levelBody: body_level_vk.value,
						levelLegs: legs_level_vk.value,
						fetching: false
					})
				});
			}, 2000);

		}

	}



	onStoryChange(e) {
		this.handleConnectionChange();
		this.setState({
			addHistory: [...this.state.addHistory, e.currentTarget.dataset.story]
		})
		if (e.currentTarget.dataset.story == "panel1") {
			this.setState({
				activePanel: "panel1",
				allowTochangeData: false
			})
		}
		else if (e.currentTarget.dataset.story == "PanelNew") {
			this.setState({
				allowTochangeData: true
			})
		}
		this.setState({ activeStory: e.currentTarget.dataset.story, })
	}




	componentDidMount() {

		this.handleConnectionChange();


		bridge.send("VKWebAppGetUserInfo", {}).then(event => {
			this.setState({
				name: event.first_name + " " + event.last_name,
				avatar: event.photo_100
			})
		})
		if (this.props.allowTochangeData) {
			this.changeDataBridge();
		}
		// Sending method

		window.addEventListener('popstate', () => this.goBack());


		// 		bridge.send("VKWebAppStorageSet", {"key": "hands_level", "value": ""});

		// 	bridge.send("VKWebAppStorageSet", {"key": "body_level", "value": ""});

		// bridge.send("VKWebAppStorageSet", {"key": "legs_level", "value": ""});

		bridge.send("VKWebAppStorageGet", { "keys": ["hands_level", "body_level", "legs_level"] }).then(event => {
			var returnedData = event.keys.map(item => item.value);


			const hands_level_vk = event.keys.find(item => item.key == "hands_level");
			const body_level_vk = event.keys.find(item => item.key == "body_level");
			const legs_level_vk = event.keys.find(item => item.key == "legs_level");

			this.setState({
				levelHands: hands_level_vk.value,
				levelBody: body_level_vk.value,
				levelLegs: legs_level_vk.value,
				anotherlevelHands: hands_level_vk.value,
				anotherlevelBody: body_level_vk.value,
				anotherlevelLegs: legs_level_vk.value,
			})


			if (hands_level_vk.value == false) {
				bridge.send("VKWebAppStorageSet", { "key": "hands_level", "value": "0.0" });
				this.setState({
					levelHands: "0.0",
					anotherlevelHands: "0.0",
				})
			}
			if (body_level_vk.value == false) {
				bridge.send("VKWebAppStorageSet", { "key": "body_level", "value": "0.0" });
				this.setState({
					levelBody: "0.0",
					anotherlevelBody: "0.0",
				})
			}
			if (legs_level_vk.value == false) {
				bridge.send("VKWebAppStorageSet", { "key": "legs_level", "value": "0.0" });
				this.setState({
					levelLegs: "0.0",
					anotherlevelLegs: "0.0",
				})
			}

			console.log([hands_level_vk.value, body_level_vk.value, legs_level_vk.value])


			var firstRec = this.findRecomendation(null, hands_level_vk.value, body_level_vk.value, legs_level_vk.value, null)
			var secondRec = this.findRecomendation(firstRec, hands_level_vk.value, body_level_vk.value, legs_level_vk.value, null)
			var thirdRec = this.findRecomendation(firstRec, hands_level_vk.value, body_level_vk.value, legs_level_vk.value, secondRec)

			this.setState({
				recomendFirst: firstRec,
				recomendSec: secondRec,
				recomendThird: thirdRec
			})

		})
			.catch(error => {
				console.log(error)
				this.setState({
					errorNow: error
				})
			});



		bridge.subscribe(e => {
			if (e.detail.type === "VKWebAppUpdateConfig") {
				if (e.detail.data.scheme) {
					console.log(e.detail.data.scheme)
					this.setState({
						theme: e.detail.data.scheme
					})
				}
			}
		})



		this.handleConnectionChange();

		// Sending method

	}


	goBack = () => {
		if (this.state.allowToGoBack) {
			var history = this.state.history;

			if (history.length === 1) {  // Если в массиве одно значение:
				bridge.send("VKWebAppClose", { "status": "success" }); // Отправляем bridge на закрытие сервиса.
			} else if (history.length > 1) {  // Если в массиве больше одного значения:

				history.pop();

				this.setState({
					activePanel: history[history.length - 1] == undefined ? "panel1" : history[history.length - 1], activeId: history[history.length - 1] == "exercise" ? this.state.activeId : this.state.prevActiveId,
					addHistory: [...this.state.addHistory, history[history.length - 1]]
				}) // Изменяем массив с иторией и меняем активную панель.
			}
		}
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
			newDubl = [indexHands.id, indexBody.id, indexLegs.id][Math.floor(Math.random() * [indexHands.id, indexBody.id, indexLegs.id].length)];
		}
		else {
			newDubl = [...new Set(findDuplicates([indexHands.id, indexBody.id, indexLegs.id]))];
		}

		window.$notTo = newDubl; //global variable

		return newDubl;

	}

	setActiveModal(activeModal, allow, panel, seconds) {
		this.handleConnectionChange();

		activeModal = activeModal || null;
		let modalHistory = this.state.modalHistory ? [...this.state.modalHistory] : [];
		if (activeModal === null) {
			modalHistory = [];
		} else if (modalHistory.indexOf(activeModal) !== -1) {
			modalHistory = modalHistory.splice(0, modalHistory.indexOf(activeModal) + 1);
		} else {
			modalHistory.push(activeModal);
		}

		this.setState({
			activeModal,
			modalHistory
		});



		if (allow == 0) {
			this.setState({
				saveActivePanel: panel,
				excutionTime: seconds,
			})


		}
		else if (allow == 2) {

			if (this.state.prevActiveId == 0) {
				this.setState({
					activePanel: this.state.saveActivePanel,
					activeId: this.state.activeId
				})
			}
			else {
				this.setState({
					activePanel: this.state.saveActivePanel,
					activeId: this.state.prevActiveId
				})
			}
		}

		else if (allow == 4) {
			if (this.state.prevActiveId == 0 || this.state.isLastElement) {
				this.setState({
					activePanel: "panel1"
				})
			}
			else {
				this.setState({
					activePanel: 'allExercise', activeId: this.state.prevActiveId
				})
			}
		}

	};


	handleConnectionChange = () => {
		if (window.navigator.onLine) {
			this.setState({
				internet: true
			})
		}
		else {
			this.setState({
				internet: false
			})
		}
	}



	changeDataBridge = () => {
		this.handleConnectionChange();


		bridge.send("VKWebAppStorageGet", { "keys": ["hands_level", "body_level", "legs_level"] }).then(event => {
			var returnedData = event.keys.map(item => item.value);


			const hands_level_vk = event.keys.find(item => item.key == "hands_level");
			const body_level_vk = event.keys.find(item => item.key == "body_level");
			const legs_level_vk = event.keys.find(item => item.key == "legs_level");

			this.setState({
				levelHands: hands_level_vk.value,
				levelBody: body_level_vk.value,
				levelLegs: legs_level_vk.value
			})

		})

	}

	render() {
		if (!this.state.adHasShown) {
			if (this.state.addHistory.length === 2) {
				bridge
					.send("VKWebAppShowNativeAds", { ad_format: "interstitial" })
					.then(data => console.log(JSON.stringify(data.result)))
					.catch(error => console.log(error));
				this.setState({
					adHasShown: true
				})
			}
		}
		const modal = (
			<ModalRoot
				activeModal={this.state.activeModal}
				onClose={this.modalBack}
			>


				<ModalCard
					id={MODAL_CARD_MONEY_SEND}
					onClose={() => {
						this.setActiveModal(null);
						this.setState({
							allowToGoBack: true
						})
					}}
					icon={<Icon56ErrorOutline />}
					header="Доступ закрыт"
					caption="Для открытия данного упражнения, сначала выполните предыдущее"
					actions={[{
						title: 'Хорошо',
						mode: 'primary',
						action: () => {
							this.setActiveModal(null);
							this.setState({
								allowToGoBack: true
							})
						}
					}]}
				>

				</ModalCard>


				<ModalCard
					id={TIME_IS_OVER}
					onClose={() => {
						this.setActiveModal(null, 2);
						this.setState({
							allowToGoBack: true
						})
					}}
					icon={<Icon56ErrorOutline />}
					header="Время закончилось!"
					caption="Время закончилось, но вы можете продолжить выполгнять упраженение. В 
				конце мы выведим ваше время."
					actions={[{
						title: 'Хорошо',
						mode: 'primary',
						action: () => {
							this.setActiveModal(null, 2);
							this.setState({
								allowToGoBack: true
							})
						}
					}]}
				>
				</ModalCard>

				<ModalCard
					id={EXERCISE_MODAL}
					onClose={() => {
						this.setActiveModal(null);
						this.setState({
							allowToGoBack: true
						})
					}}
					icon={<Icon56ErrorOutline />}
					header="Вы уверены, что хотите выйти из упражнения?"
					actions={[{
						title: 'Да',
						mode: 'primary',
						action: () => {
							this.setActiveModal(null, 4);
							this.setState({
								allowToGoBack: true
							})
						}
					}]}
				>
				</ModalCard>

			</ModalRoot>

		);

		//   console.log(this.state.prevPanelState)
		console.log(this.state.adHasShown)
		return (
			<View>
				{this.state.internet ? (


					<Epic activeStory={this.state.activeStory} tabbar={
						<Tabbar>
							<TabbarItem
								onClick={this.onStoryChange}
								selected={this.state.activeStory === 'panel1'}
								data-story="panel1"
								text="Главная"
							><Icon24Newsfeed /></TabbarItem>
							<TabbarItem
								onClick={this.onStoryChange}
								selected={this.state.activeStory === 'PanelNew'}
								data-story="PanelNew"
								text="Профиль"
							><Icon24User /></TabbarItem>
						</Tabbar>

					}>

						<View
							onSwipeBack={this.goBack}
							id="panel1" activePanel={this.state.activePanel} modal={modal}
						//style={{WebkitTouchCallout: "none", WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none" }}
						>
							<Panel id="panel1" onClick={this.handleConnectionChange}>
								<PanelHeader>Главная!</PanelHeader>
								<Main
									error={this.state.errorNow}
									level_hands={this.state.levelHands} level_body={this.state.levelBody}
									level_legs={this.state.levelLegs}
									fetching={this.state.fetching}
									onRefreshFun={this.onRefresh}
									chanePanel={(panel, id, prevId) => {
										this.setState({
											activePanel: panel, activeId: id, prevActiveId: prevId,
											isAllPanel: 0,
											prevPanelState: [...this.state.prevPanelState, "panel1"],
											history: [...this.state.history, panel],
											addHistory: [...this.state.addHistory, panel]
										})
										window.history.pushState({ panel: panel }, panel)
									}
									}
									handsLevel={this.state.returnedDataHands} recomendFirst={this.state.recomendFirst}
									recomendSec={this.state.recomendSec} recomendThird={this.state.recomendThird}
									theme={this.state.theme}
								/>
							</Panel>

							<Panel id="panel_all" onClick={this.handleConnectionChange}>
								<PanelHeader separator={false} left={<PanelHeaderBack style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
									Все
			  </PanelHeader>

								<All theme={this.state.theme}
									changePanel={(panel, id, prevId, isAll) => {
										this.setState({
											activePanel: panel, activeId: id, prevActiveId: prevId, isAllPanel: isAll,
											history: [...this.state.history, panel],
											addHistory: [...this.state.addHistory, panel]
										})
										window.history.pushState({ panel: panel }, panel)
									}}></All>

							</Panel>

							<Panel id="allExercise" onClick={this.handleConnectionChange}>
								<PanelHeader separator={false} left={<PanelHeaderBack style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
									Список упражнений
			  </PanelHeader>


								<AllExercise setActiveModalPanelNow={() => {
									this.setActiveModal(MODAL_CARD_MONEY_SEND);
									this.setState({
										allowToGoBack: false
									})
								}}
									changePanelNowNewStateExersice={(panel, id, lastId) => {
										this.setState({
											activePanel: panel, activeId: id, isLastElement: lastId,
											prevPanelState: [...this.state.prevPanelState, "allExercise"],
											history: [...this.state.history, panel],
											addHistory: [...this.state.addHistory, panel]
										})
										window.history.pushState({ panel: panel }, panel)

									}}
									id={this.state.activeId}
									image={pushUpsImage}></AllExercise>

							</Panel>



							<Panel id="exercise" onClick={this.handleConnectionChange}>

								<PanelHeader separator={false} left={<PanelHeaderBack style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
									Упражнение
			  </PanelHeader>

								<Exercise
									changePanelNowNewStateExersice={() => {
										this.setState({
											activePanel: 'panel3',
											prevPanelState: [...this.state.prevPanelState, "exercise"],
											addHistory: [...this.state.addHistory, 'panel3']
										})

									}
									}
									theme={this.state.theme}
									id={this.state.activeId} image={Abs}></Exercise>

							</Panel>

							<Panel id="exerciseDaily" onClick={this.handleConnectionChange}>

								<PanelHeader separator={false} left={<PanelHeaderBack style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
									Упражнение
</PanelHeader>

								<ExerciseDaily
									changePanelNowNewStateExersice={() => {
										this.setState({
											activePanel: 'panelTimerDaily',
											prevPanelState: [...this.state.prevPanelState, "exerciseDaily"],
											addHistory: [...this.state.addHistory, 'panelTimerDaily']
										})

									}
									}
									theme={this.state.theme}
									id={this.state.activeId} image={Abs}></ExerciseDaily>

							</Panel>


							<Panel id="panel3" onClick={this.handleConnectionChange}>
								<PanelHeader separator={false} left={<PanelHeaderBack style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
									Таймер
			  </PanelHeader>
								{this.state.prevActiveId == 0 || this.state.isLastElement ? (
									<Timer id={this.state.activeId} prevId={this.state.prevActiveId}
										setActiveModalPanelNowTimer={(panel, seconds) => { this.setActiveModal(TIME_IS_OVER, 0, panel, seconds); this.setState({ allowToGoBack: false }); }}
										theme={this.state.theme}
										setActiveModalClose={(panel) => { this.setActiveModal(EXERCISE_MODAL); this.setState({ allowToGoBack: false }) }}
										changePanelToFinish={(panel, seconds) => {
											this.setState({
												activePanel: panel, excutionTime: seconds, isAllEnding: false,
												addHistory: [...this.state.addHistory, panel]
											})
										}} />
								) : (
										<Timer id={this.state.activeId} prevId={this.state.prevActiveId}
											setActiveModalPanelNowTimer={(panel) => { this.setActiveModal(TIME_IS_OVER, 0, "allExercise"); this.setState({ allowToGoBack: false }) }}
											setActiveModalClose={(panel) => { this.setActiveModal(EXERCISE_MODAL); this.setState({ allowToGoBack: false }) }}
											theme={this.state.theme}
											changePanelToFinish={(seconds) => {
												this.state.history.pop()
												this.setState({
													activePanel: 'allExercise', activeId: this.state.prevActiveId, excutionTime: seconds, isAllEnding: true,
													addHistory: [...this.state.addHistory, 'allExercise']
												})
											}} />
									)}
							</Panel>

							<Panel id="panelTimerDaily" onClick={this.handleConnectionChange}>
								<PanelHeader separator={false} left={<PanelHeaderBack style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
									Таймер
			  </PanelHeader>

								<TimerDaily id={this.state.activeId} prevId={this.state.prevActiveId}
									setActiveModalPanelNowTimer={(panel, seconds) => { this.setActiveModal(TIME_IS_OVER, 0, panel, seconds); this.setState({ allowToGoBack: false }) }}
									theme={this.state.theme}
									setActiveModalClose={(panel) => { this.setActiveModal(EXERCISE_MODAL); this.setState({ allowToGoBack: false }) }}
									changePanelToFinish={(panel, seconds) => {
										this.setState({
											activePanel: 'panelFinishDaily', excutionTime: seconds, isAllEnding: false,
											addHistory: [...this.state.addHistory, 'panelFinishDaily']
										})
									}} />

							</Panel>


							<Panel id="panel4" onClick={this.handleConnectionChange}>
								<PanelHeader separator={false} left={<PanelHeaderBack style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
									Конец
</PanelHeader>
								<Finish theme={this.state.theme}
									recomendFirst={this.state.recomendFirst}
									theme={this.state.theme}
									level_hands={this.state.levelHands} level_body={this.state.levelBody}
									level_legs={this.state.levelLegs}
									recomendSec={this.state.recomendSec}
									changePanelNew={(panel, id, prevId) => {
										this.state.history.pop()
										this.setState({
											activePanel: panel, activeId: id, prevActiveId: prevId,
											addHistory: [...this.state.addHistory, panel]
										})

									}
									}
									sec={this.state.excutionTime} prevId={this.state.prevActiveId} id={this.state.activeId} changePanel={() => this.setState({ activePanel: 'panel1' })} />
							</Panel>



							<Panel id="panelFinishDaily" onClick={this.handleConnectionChange}>
								<PanelHeader separator={false} left={<PanelHeaderBack style={{ cursor: "pointer" }} onClick={() => this.goBack()} />}>
									Конец
</PanelHeader>
								<FinishDaily theme={this.state.theme}
									theme={this.state.theme}
									level_hands={this.state.levelHands} level_body={this.state.levelBody}
									level_legs={this.state.levelLegs}
									changePanelNew={(panel, id, prevId) => {
										this.state.history.pop()
										this.setState({
											activePanel: panel, activeId: id, prevActiveId: prevId,
											addHistory: [...this.state.addHistory, panel]
										})

									}
									}
									sec={this.state.excutionTime} prevId={this.state.prevActiveId} id={this.state.activeId} changePanel={() => this.setState({ activePanel: 'panel1' })} />
							</Panel>


						</View>




						<View id="PanelNew" activePanel="PanelNew"
						//   onClick={this.changeDataBridge()}
						// onClick={this.setState({ allowTochangeData: true })}
						>
							<Panel id="PanelNew">
								<PanelHeader>Профиль</PanelHeader>
								<Profile level_hands={this.state.levelHands} level_body={this.state.levelBody}
									level_legs={this.state.levelLegs}
									theme={this.state.theme}
									fetching={this.state.fetching}
									allowTochangeData={this.state.allowTochangeData}
									avatar={this.state.avatar}
									name={this.state.name} />
							</Panel>
						</View>
					</Epic>
				) : (
						<div>
							<div style={{ fontSize: 22, padding: 20, marginTop: 50, textAlign: "center" }}>Отсутствует соединение с интернетом</div>
							<Button size="xl" style={{ backgroundColor: this.state.theme == "bright_light" ? "#3f8ae0" : "#2e2e2e", color: "white", marginTop: 30, marginBottom: 20, width: "80%", marginLeft: "10%", cursor: "pointer" }} onClick={() => this.handleConnectionChange()}>Повторить попытку</Button>
						</div>
					)}
			</View>

		)
	}
}

export default App;