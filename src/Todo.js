import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import dateFormat from 'dateformat';
import './Todo.css';

const isSearched = (searchTerm) => (item) =>
	!searchTerm || item.task.toLowerCase().includes(searchTerm.toLowerCase());
const isDisplayed = (display) => (item) => {
	switch(display) {
		case 'in-progress':
			return (!item.isDone && !item.isPaused);
		case 'paused':
			return item.isPaused;
		case 'finished':
			return item.isDone;
		default:
			return true;
	}
}
class TodoList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			list: JSON.parse(localStorage.getItem('todos')) ? JSON.parse(localStorage.getItem('todos')) : [],
			searchContent: '',
			taskContent: '',
			display: 'all'
		}
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onCreateChange = this.onCreateChange.bind(this);
		this.delete = this.delete.bind(this);
		this.create = this.create.bind(this);
		this.orderByTask = this.orderByTask.bind(this);
		this.orderByCreation = this.orderByCreation.bind(this);
		this.orderByEdition = this.orderByEdition.bind(this);
		this.changeDisplay = this.changeDisplay.bind(this);
		this.update = this.update.bind(this);
	}

	onSearchChange(event) {
		this.setState({
			searchContent: event.target.value
		});
	}

	onCreateChange(event) {
		this.setState({
			taskContent: event.target.value
		});
	}

	orderByTask() {
		let obj = [...this.state.list];
		obj.sort((a, b) => {
			if (a.task < b.task) return -1;
			if (a.task > b.task) return 1;
			return 0;
		});
		if (obj.length === this.state.list.length && obj.every((e, i) => e === this.state.list[i])) {
			obj.sort((b, a) => {
				if (a.task < b.task) return -1;
				if (a.task > b.task) return 1;
				return 0;
			});
		}
		this.setState({
			list: obj
		}, () => localStorage.setItem('todos', JSON.stringify(this.state.list)));
	}

	orderByCreation() {
		let obj = [...this.state.list];
		obj.sort((a, b) => {
			if (a.dateCreation < b.dateCreation) return -1;
			if (a.dateCreation > b.dateCreation) return 1;
			return 0;
		});
		if (obj.length === this.state.list.length && obj.every((e, i) => e === this.state.list[i])) {
			obj.sort((b, a) => {
				if (a.dateCreation < b.dateCreation) return -1;
				if (a.dateCreation > b.dateCreation) return 1;
				return 0;
			});
		}
		this.setState({
			list: obj
		}, () => localStorage.setItem('todos', JSON.stringify(this.state.list)));
	}

	orderByEdition() {
		let obj = [...this.state.list];
		obj.sort((a, b) => {
			if (a.dateEdition < b.dateEdition) return -1;
			if (a.dateEdition > b.dateEdition) return 1;
			return 0;
		});
		if (obj.length === this.state.list.length && obj.every((e, i) => e === this.state.list[i])) {
			obj.sort((b, a) => {
				if (a.dateEdition < b.dateEdition) return -1;
				if (a.dateEdition > b.dateEdition) return 1;
				return 0;
			});
		}
		localStorage.setItem('todos', JSON.stringify(obj));
		this.setState({
			list: obj
		}, () => localStorage.setItem('todos', JSON.stringify(this.state.list)));
	}

	create(event) {
		if ((event && event.key === "Enter") && this.state.taskContent.trim()) {
			const todo = {
				task: this.state.taskContent,
				dateCreation: dateFormat(new Date()),
				dateEdition: '',
				dateValidation: '',
				datePause: '',
				isPaused: false,
				isDone: false,
				ID: new Date().valueOf()
			}

			this.setState(prevState => ({
				taskContent: '',
				list: [...prevState.list, todo]
			}), () => localStorage.setItem('todos', JSON.stringify(this.state.list)));
		}
	}
	update(updatedTodo) {
		const updatedList = [...this.state.list];
		const todoToUpdate = updatedList.findIndex((item => item.ID === updatedTodo.ID));
		updatedList[todoToUpdate] = updatedTodo;

		this.setState({
			list: updatedList
		}, () => localStorage.setItem('todos', JSON.stringify(this.state.list)));
	}
	delete(id) {
		const updatedList = [...this.state.list].filter(item => item.ID !== id);
		this.setState({
			list: updatedList
		}, () => localStorage.setItem('todos', JSON.stringify(this.state.list)));
	}
	changeDisplay(filter) {
		this.setState({
			display: filter
		});
	}

	render() {
		const {
			list,
			searchContent,
			taskContent,
			display

		} = this.state;

		return (
			<div className="main-container">
				<input
					className="add-input"
					type="text"
					onChange={this.onCreateChange}
					onKeyUp={this.create}
					value={taskContent}
					placeholder="Hey, do you have something new to do ?"
				/>
				<OrderFilter
					task={this.orderByTask}
					creation={this.orderByCreation}
					edition={this.orderByEdition}
					searchContent={searchContent}
					onSearchChange={this.onSearchChange}
				/>
				<DisplayFilter
					display={display}
					displayAll={() => this.changeDisplay('all')}
					displayProgress={() => this.changeDisplay('in-progress')}
					displayPaused={() => this.changeDisplay('paused')}
					displayFinished={() => this.changeDisplay('finished')}
				/>
				<div className="todos-container">
					{list.filter(isSearched(searchContent)).filter(isDisplayed(display)).map(item =>
						<Todo
							key={item.ID} 
							update={this.update}
							delete={this.delete}
							ID={item.ID}
							task={item.task}
							isDone={item.isDone}
							isPaused={item.isPaused}
							dateCreation={item.dateCreation}
							dateValidation={item.dateValidation}
							dateEdition={item.dateValidation}
							datePause={item.datePause}
						/>
					)}
				</div>
			</div>
		);
	}
}
class Todo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			todo : {
				ID: this.props.ID,
				task: this.props.task,
				isDone: this.props.isDone,
				isPaused: this.props.isPaused,
				datePause: this.props.datePause,
				dateEdition: this.props.dateEdition,
				dateCreation: this.props.dateCreation,
				dateValidation: this.props.dateValidation
			},
			isEdited: false,
			isHovered: false,
			editContent: this.props.task,
		}
		this.update = this.props.update;	
		this.delete = this.props.delete;
		this.edit = this.edit.bind(this);
		this.onEditChange = this.onEditChange.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.pause = this.pause.bind(this);
		this.validate = this.validate.bind(this);
		this.hover = this.hover.bind(this);
	}
	edit() {
		this.setState({
			isEdited: true
		});
	}
	onEditChange(event) {
		this.setState({
			editContent: event.target.value
		});
	}
	handleEdit(event, blur) {
		if ((event && event.key === "Enter") || blur) {
			let todo = this.state.todo;
			todo.task = this.state.editContent;
			todo.dateEdition = dateFormat(new Date());
			this.setState({
				todo: todo,
				isEdited: false,
			});
			this.update(this.state.todo);
		}
	}
	hover(isHovered) {
		this.setState({
			isHovered: isHovered
		});
	}
	pause() {
		let todo = this.state.todo;
		todo.isPaused = !this.state.todo.isPaused
		todo.datePause = todo.datePause ? '' : dateFormat(new Date());

		this.setState({
			todo: todo
		});
		this.update(this.state.todo);
	}
	validate() {
		let todo = this.state.todo;
		todo.isDone = !this.state.todo.isDone
		todo.dateValidation = todo.dateValidation ? '' : dateFormat(new Date());
		if (todo.datePause) todo.datePause = '';

		this.setState({
			todo: todo
		});
		this.update(this.state.todo);
	}
	onDelete() {
		this.delete(this.state.todo.ID);
	}

	render() {
		const {
			task,
			isDone,
			isPaused,
			datePause,
			dateEdition,
			dateCreation,
			dateValidation,
		} = this.state.todo;
		const {
			isEdited,
			isHovered,
			editContent
		} = this.state;
		return (
			<div className={isDone ? "finished table-row" : isPaused ? "paused table-row" : "progress table-row"}>
				<div className="todos-operations">
					<div className="infos-container">
						<FontAwesome onMouseOver={() => this.hover(true)} onMouseOut={() => this.hover(false)} name="info" className="info-logo" />
						<div className={isHovered ? "todo-infos" : "todos-infos hidden"}>
							<span>Created on : <b>{dateCreation}</b> </span>
							{dateEdition ? <span> - Last edited on : <b>{dateEdition}</b> </span> : null}
							{dateValidation ? <span> - Finished on : <b>{dateValidation}</b> </span> : null}
							{datePause ? <span> - Paused since : <b>{datePause}</b> </span> : null}
						</div>
					</div>
					<div className="operations">
						<div onClick={this.validate}><FontAwesome name={isDone ? "refresh" : "check"} className="margin info" /></div>
						{isDone ? null : <div onClick={this.pause}><FontAwesome name={isPaused ? "play" : "pause"} className="margin info" /></div>}
						<div onClick={this.onDelete}><FontAwesome name="trash" className="margin info" /></div>
					</div>
				</div>
				<div className="row">
					{isEdited
						?
						<input
							className="task edited input-edit"
							type="text"
							onChange={this.onEditChange}
							onBlur={() => this.handleEdit(null, true)}
							onKeyPress={(event) => this.handleEdit(event, false)}
							value={editContent}
						/>
						:
						<div
							onDoubleClick={this.edit}
							className="task editable"
						>
							{task}
						</div>
					}
				</div>
			</div>
		);
	}
}
const OrderFilter = ({ task, creation, edition, searchContent, onSearchChange }) =>
	<div className="filter-container">
		<div>
			<Button onClick={task} className="filter-button">
				Task
				<FontAwesome name='sort' className="margin" />
			</Button>
			<Button onClick={creation} className="filter-button">
				Creation
				<FontAwesome name='sort' className="margin" />
			</Button>
			<Button onClick={edition} className="filter-button">
				Edition
				<FontAwesome name='sort' className="margin" />
			</Button>
		</div>
		<input
			className="filter-input"
			type="text"
			value={searchContent}
			onChange={onSearchChange}
			placeholder="Looking for a specific thing to do ?"
		/>
	</div>
const DisplayFilter = ({ display, displayAll, displayProgress, displayPaused, displayFinished }) =>
	<div className="display-container">
		<Button onClick={displayAll}
			className={display === "all" ? "filter-button current all" : "filter-button spe blue"}
		>
			All
		</Button>
		<Button onClick={displayProgress}
			className={display === "in-progress" ? "filter-button current progress" : "filter-button spe red"}
		>
			In progress
		</Button>
		<Button onClick={displayPaused}
			className={display === "paused" ? "filter-button current paused" : "filter-button spe yellow"}
		>
			Paused
		</Button>
		<Button onClick={displayFinished}
			className={display === "finished" ? "filter-button current finished" : "filter-button spe green"}
		>
			Finished
		</Button>
	</div>
const Button = ({ onClick, className, children }) =>
	<button
		onClick={onClick}
		className={className}
		type="button">
		{children}
	</button>

export default TodoList;