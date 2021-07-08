import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import axios from "axios";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Button, Form, FormGroup, Input } from "reactstrap";
import { BsFillTrashFill } from "react-icons/bs";
import Pagination from "react-js-pagination";
// pagination component:  https://www.npmjs.com/package/react-js-pagination
class UserForm extends React.Component {
	// edit & add user form
	constructor(props) {
		super(props);
		this.state = {};
		this.state.name = "";
		this.state.surname = "";
		this.state.desc = "";
		this.state.id = this.props.id;
	}
	isSubmitEnable() {
		return this.state.name.length > 0 &&
			this.state.surname.length > 0 &&
			this.state.desc.length > 0
			? true
			: false;
	}
	componentDidMount() {
		if (this.props.mode === "edit") {
			axios
				.get("http://77.120.241.80:8811/api/users")
				.then((resp) => {
					const item = resp.data.filter((i) => {
						return +i.id === +this.state.id;
					});
					console.log(resp.data, this.state.id);
					if (item) {
						this.setState({ name: item[0].name });
						this.setState({ surname: item[0].surname });
						this.setState({ desc: item[0].desc });
					}
				})
				.catch((err) => console.log(err));
		}
	}
	render() {
		return (
			<Form className="form">
				<FormGroup>
					<h2>{this.props.title}</h2>
				</FormGroup>
				<FormGroup>
					<Input
						type="text"
						placeholder="Name"
						value={this.state.name}
						onChange={(e) => {
							this.setState({ name: e.target.value });
						}}
					/>
				</FormGroup>
				<FormGroup>
					<Input
						type="text"
						placeholder="Surname"
						value={this.state.surname}
						onChange={(e) => {
							this.setState({ surname: e.target.value });
						}}
					/>
				</FormGroup>
				<FormGroup>
					<Input
						type="textarea"
						placeholder="Description"
						value={this.state.desc}
						onChange={(e) => {
							this.setState({ desc: e.target.value });
						}}
					></Input>
				</FormGroup>
				<FormGroup>
					<Button
						type="button"
						color="primary"
						style={{
							opacity: this.isSubmitEnable() ? 1 : 0.5,
							cursor: this.isSubmitEnable()
								? "pointer"
								: "default",
						}}
						onClick={() => {
							if (!this.isSubmitEnable()) {
								alert("Enter the values of all fields!");
								return;
							}
							this.props.submit(
								this.state.name,
								this.state.surname,
								this.state.desc
							);
						}}
					>
						Save
					</Button>
					<a href="/">
						<Button type="button" color="secondary">
							Cancel
						</Button>
					</a>
				</FormGroup>
			</Form>
		);
	}
}
const Add = () => {
	// user add form
	const submit = (name, surname, desc) => {
		axios
			.post("http://77.120.241.80:8811/api/users", {
				name: name,
				surname: surname,
				desc: desc,
			})
			.then((resp) => {
				console.log(resp.data.id);
				setTimeout(() => {
					window.location.assign("/");
				}, 2000);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	return (
		<div>
			<UserForm
				title={"Add new user"}
				submit={submit}
				mode={"add"}
				id={null}
			/>
		</div>
	);
};
const Edit = (props) => {
	// user edit form
	const submit = (name, surname, desc) => {
		axios
			.put(
				`http://77.120.241.80:8811/api/user/${props.match.params.number}`,
				{ name: name, surname: surname, desc: desc }
			)
			.then((resp) => {
				console.log(resp.data);
			})
			.catch((err) => {
				console.log(err);
			});
		setTimeout(() => {
			window.location.assign("/");
		}, 2000);
	};
	return (
		<UserForm
			title={"Edit user"}
			submit={submit}
			mode={"edit"}
			id={props.match.params.number}
		/>
	);
};
const Delete = (props) => {
	// delete user button
	return (
		<span
			className="delete-button"
			value={props.value}
			onClick={(e) => {
				axios
					.delete(`http://77.120.241.80:8811/api/user/${props.value}`)
					.then((resp) => {
						console.log(resp.data);
						setTimeout(() => {
							window.location.assign("/");
						}, 2000);
					})
					.catch((err) => {
						console.log(err);
					});
			}}
		>
			<BsFillTrashFill />
		</span>
	);
};
const UserItem = (props) => {
	// userlist item component
	return (
		<span className="user-item click" value={props.user.id}>
			<span className="user-id">{props.user.id}</span>
			<span className="user-name">{props.user.name}</span>
			<span className="user-surname">{props.user.surname}</span>
		</span>
	);
};
const UserTitle = () => {
	return (
		<span className="user-item">
			<span className="user-id">ID</span>
			<span className="user-name">Name</span>
			<span className="user-surname">Surname</span>
		</span>
	);
};
//==============================================================
class Main extends React.Component {
	constructor() {
		super();
		this.state = { userList: [] };
		this.state.activePage = localStorage.getItem("activePage")
			? +localStorage.getItem("activePage")
			: 1;
		this.state.totalItemsCount = 0;
		this.itemsOnPage = 5;
	}
	//-----------------------------------------------------
	handlePageChange = (pageNumber) => {
		// pagination
		this.setState({ activePage: pageNumber });
		localStorage.setItem("activePage", pageNumber);
	};
	// --------------------------------------------------------
	Users = () => {
		let userHtml = [
			<li key={0} className="title">
				<UserTitle />
			</li>,
		];
		// pagination indexes:
		let firstItem = (this.state.activePage - 1) * this.itemsOnPage;
		let lastItem = firstItem + this.itemsOnPage;
		if (lastItem > this.state.userList.length - 1)
			lastItem = this.state.userList.length;
		// users list html create:
		for (let n = firstItem; n < lastItem; n++) {
			let i = this.state.userList[n];
			userHtml.push(
				<li key={i.id}>
					<a href={`edit/${i.id}`}>
						<UserItem user={i} />
					</a>
					<Delete value={i.id} />
				</li>
			);
		}
		return (
			<div>
				<ul className="user-list">{userHtml}</ul>
			</div>
		);
	};
	componentDidMount() {
		axios
			.get("http://77.120.241.80:8811/api/users")
			.then((resp) => {
				this.setState({ userList: resp.data });
				this.setState({ totalItemsCount: resp.data.length });
			})
			.catch((err) => console.log(err));
	}
	render() {
		return (
			<div>
				<h2 className="user-header">
					<a href="/add">
						<Button color="primary">New user</Button>
					</a>
				</h2>
				<div className="user-list">
					<this.Users />
				</div>
				<div className="pagination-bar">
					<Pagination
						activePage={this.state.activePage}
						itemsCountPerPage={this.itemsOnPage}
						totalItemsCount={this.state.totalItemsCount}
						pageRangeDisplayed={5}
						onChange={this.handlePageChange}
						itemClass="page-item"
						linkClass="page-link"
					/>
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
				<Route path="/add/" component={Add} />
				<Route path="/edit/:number" component={Edit} />
			</div>
		</Router>
	);
}

export default App;
