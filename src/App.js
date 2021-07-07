import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Button } from "reactstrap";
import { BsFillTrashFill } from "react-icons/bs";

const UserForm = (props) => {
	return (
		<form>
			<h2>{props.title}</h2>
			<input type="text" />
			<h2>
				<button type="button" onClick={props.submit}>
					Save
				</button>
				<a href="/">
					<button type="button">Cancel</button>
				</a>
			</h2>
		</form>
	);
};
const Add = () => {
	const submit = (e) => {
		console.log("Add");
	};
	return (
		<div>
			<UserForm title={"Add new user"} submit={submit} />
		</div>
	);
};
const Edit = () => {
	const submit = (e) => {
		console.log("Edit");
	};
	return <UserForm title={"Edit user"} submit={submit} />;
};
const Delete = () => {
	return <div></div>;
};
class Main extends React.Component {
	constructor() {
		super();
		this.state = { userList: [] };
	}
	Users = () => {
		let userHtml = [
			<li key={0} className="title">
				<span className="user-item">
					<span className="user-id">ID</span>
					<span className="user-name">Name</span>
					<span className="user-surname">Surname</span>
				</span>
			</li>,
		];
		this.state.userList.forEach((i) => {
			userHtml.push(
				<li key={i.id}>
					<span className="user-item">
						<span className="user-id">{i.id}</span>
						<span className="user-name">{i.name}</span>
						<span className="user-surname">{i.surname}</span>
					</span>
					<span className="delete-button">
						<BsFillTrashFill />
					</span>
				</li>
			);
		});
		return <ul>{userHtml}</ul>;
	};
	componentDidMount() {
		axios
			.get("http://77.120.241.80:8811/api/users")
			.then((resp) => {
				this.setState({ userList: resp.data.users });
			})
			.catch((err) => console.log(err));
	}
	render() {
		return (
			<div>
				<h2>
					<a href="/add">
						<button>New user</button>
					</a>
				</h2>
				<div className="user-list">
					<this.Users />
				</div>
			</div>
		);
	}
}

function App() {
	return (
		<Router>
			<div>
				<Route exact path="/" component={Main} />
				<Route path="/add" component={Add} />
				<Route path="/delete" component={Delete} />
				<Route path="/edit" component={Edit} />
			</div>
		</Router>
	);
}

export default App;
