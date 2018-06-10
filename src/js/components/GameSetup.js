import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Segment, Label, Icon, Dropdown, Header, Divider, Button } from 'semantic-ui-react';

import * as actions from '../actions/players';
import MainHeader from './MainHeader';

const styles = {
	mainContent: {
		margin: '48px',
		padding: '48px'
	},
	flexBox: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
};

class GameSetup extends Component {
	constructor(props) {
		super(props);

		this._moveUp = this._moveUp.bind(this);
		this._moveDown = this._moveDown.bind(this);
		this._toggleSidebar = this._toggleSidebar.bind(this);
		this._unassignRole = this._unassignRole.bind(this);
	}

	_moveUp(index, players) {
		const { updatePlayers } = this.props;
		let temp = '';
		const updatedPlayers = [...players];
		temp = updatedPlayers[index];
		updatedPlayers[index] = updatedPlayers[index - 1];
		updatedPlayers[index - 1] = temp;
		updatePlayers(updatedPlayers);
	}

	_moveDown(index, players) {
		const { updatePlayers } = this.props;
		let temp = '';
		const updatedPlayers = [...players];
		temp = updatedPlayers[index];
		updatedPlayers[index] = updatedPlayers[index + 1];
		updatedPlayers[index + 1] = temp;
		updatePlayers(updatedPlayers);
	}

	_unassignRole(index, players) {
		const { updatePlayers } = this.props;
		const updatedPlayers = [...players];
		updatedPlayers[index].role = null;
		updatePlayers(updatedPlayers);
	}

	_toggleSidebar() {
		this.setState({ sidebar: !this.state.sidebar });
	}

	render() {
		let { players } = this.props;
		players = players || [];
		const icon = <Icon name='ellipsis vertical' size='large' />;
		const renderPlayers = () => {
			return players.map((player, i, players) => {
				let labelColor = '';
				if (player.role) {
					switch (player.role.team) {
						case 'Werewolves':
							labelColor = 'red';
							break;
						case 'Villagers':
							labelColor = 'brown';
							break;
						case 'Other':
							labelColor = 'purple';
							break;
						default:
							labelColor = '';
							break;
					}
				}
				const label = player.role ?
					<Label style={{ marginRight: '12px' }} color={labelColor} image >
						{<img src={player.role.image} alt='Player' />}
						{player.role.name}
						{<Icon onClick={() => this._unassignRole(i, players) } name='delete' />}
					</Label>
					:
					<Label style={{ marginRight: '12px' }} >
						Unassigned
					</Label>;
				const moveUp = i !== 0 ?
					<Dropdown.Item onClick={() => this._moveUp(i, players)} >Move Up</Dropdown.Item> : '';
				const moveDown = i !== players.length - 1 ?
					<Dropdown.Item onClick={() => this._moveDown(i, players)} >Move Down</Dropdown.Item> : '';
				return (
					<Segment key={i} >
						<div style={styles.flexBox} >
							{player.name}
							<div style={styles.flexBox} >
								{label}
								<Dropdown icon={icon} >
									<Dropdown.Menu>
										<Dropdown.Item as={Link} to={`/roleList/${i}`} >Assign Role</Dropdown.Item>
										<Divider />
										{moveUp}
										{moveDown}
									</Dropdown.Menu>
								</Dropdown>
							</div>
						</div>
					</Segment>
				);
			});
		};
		return (
			<div>
				<MainHeader />
				<div style={styles.mainContent} >
					<div>
						<Header as='h1' >
							Select Roles
						</Header>
						<Button primary >
							Confirm
						</Button>
						<Button as={Link} to={'/addPlayer'} >
							Add Player
						</Button>
						<Button>
							Randomize
						</Button>
						<Divider />
					</div>
					{renderPlayers()}
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	players: state.players.players
});

export default connect(mapStateToProps, actions)(GameSetup);
