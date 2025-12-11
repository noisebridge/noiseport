import React, { useState, useEffect, useReducer } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './light.css';
import './dark.css';
import { Container, Dropdown, Menu } from 'semantic-ui-react';
import { isAdmin, requester } from './utils.js';
import { ManageScroll } from './ManageScroll.js';
import { Home } from './Home.js';
import { Account } from './Account.js';
import { Transactions, TransactionDetail } from './Transactions.js';
import { Paymaster } from './Paymaster.js';
import { Cards } from './Cards.js';
import { Training } from './Training.js';
import { AdminTransactions } from './AdminTransactions.js';
import { Admin } from './Admin.js';
import { Paste } from './Paste.js';
import { Sign } from './Sign.js';
import { OutOfStock } from './Todo.js';
import { Courses, CourseDetail } from './Courses.js';
import { ClassFeed, Classes, ClassDetail } from './Classes.js';
import { AddNewTool } from './AddNewTool.js';
import { Members, MemberDetail } from './Members.js';
import { Charts } from './Charts.js';
import { Usage } from './Usage.js';
import { Auth, AuthOIDC } from './Auth.js';
import { Subscribe } from './PayPal.js';
import { PasswordReset, ConfirmReset } from './PasswordReset.js';
import { NotFound, PleaseLogin } from './Misc.js';
import { Debug } from './Debug.js';
import { Storage, StorageDetail, ClaimShelf } from './Storage.js';
import { Garden } from './Garden.js';
import { Footer } from './Footer.js';
import { ScannerQuiz, SawstopQuiz } from './Quiz.js';
import { LCARS1Display, LCARS2Display, LCARS3Display } from './Display.js';

const APP_VERSION = 10;  // TODO: automate this

function App() {
	const [token, setToken] = useState(localStorage.getItem('token', ''));
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('user', 'false')));
	const [refreshCount, refreshUser] = useReducer(x => x + 1, 0);
	const [yousure, setYousure] = useState(false);
	const isDark = localStorage.getItem('darkmode', null) === 'true';  // inherited from Darkmode.js
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// note: theme also gets set below in the history.location useEffect
		document.body.className = isDark ? 'dark' : '';
		console.log('theme to:', document.body.className || 'light');
	}, []);

	function setTokenCache(x) {
		setToken(x);
		localStorage.setItem('token', x);
	}

	function setUserCache(x) {
		setUser(x);
		localStorage.setItem('user', JSON.stringify(x));
	}

	useEffect(() => {
		requester('/user/', 'GET', token)
		.then(res => {
			setUserCache(res);
		})
		.catch(err => {
			console.log(err);
			setUserCache(null);
		});
	}, [token, refreshCount]);

	function logout() {
		if (yousure) {
			setTokenCache('');
			setUserCache(null);
			setYousure(false);
			navigate('/');
			window.scrollTo(0, 0);
		} else {
			setYousure(true);
		}
	}

	useEffect(() => {
		if (location.pathname === '/classes/14640') {
			// force Saturnalia class page to dark
			document.body.className = 'dark';
		} else {
			document.body.className = isDark ? 'dark' : '';
		}

		if (user) {
			const data = {
				id: user.member.id,
				username: user.username,
				path: location.pathname,
			};
			requester('/ping/', 'POST', token, data)
			.then(res => {
				if (res.app_version > APP_VERSION) {
					setUserCache(false);
					navigate('/');
					window.location.reload();
				}
			})
			.catch(err => {
				console.log(err);
				if (err.data && err.data.detail === 'Invalid token.') {
					logout(); // You Sure?
					logout();
				}
			});
		}
	}, [location]);

	if (user && user?.app_version > APP_VERSION) {
		setUserCache(false);
		window.location.reload();
	}

	return (
		<div>
			<ManageScroll />

			<div className='content-wrap'>
			<div className='content-wrap-inside'>

			<Routes>
				<Route path='/classfeed' element={<ClassFeed />} />

				<Route path='/usage/:name' element={<Usage token={token} />} />

				<Route path='/display/lcars1' element={<LCARS1Display token={token} />} />

				<Route path='/display/lcars2' element={<LCARS2Display token={token} />} />

				<Route path='/display/lcars3' element={<LCARS3Display token={token} />} />

				<Route path='*' element={
					<>
						<Container>
							<div className='hero'>
								<Link to='/'>
									<img src='/logo-long.svg' className='logo-long' />
								</Link>
							</div>

							{window.location.hostname !== 'my.protospace.ca' &&
								<p style={{ background: 'yellow' }}>~~~~~ Development site ~~~~~</p>
							}
						</Container>

						<Menu>
							<Container>
								<Menu.Item
									icon='home'
									as={Link}
									to='/'
								/>

								<Dropdown item text='Member' id='ps-menu'>
									<Dropdown.Menu>
										<Dropdown.Item
											content='Account'
											as={Link}
											to='/account'
										/>
										<Dropdown.Item
											content='Transactions'
											as={Link}
											to='/transactions'
										/>
										<Dropdown.Item
											content='Paymaster'
											as={Link}
											to='/paymaster'
										/>
										<Dropdown.Item
											content='Training'
											as={Link}
											to='/training'
										/>
										<Dropdown.Item
											content='Cards / Access'
											as={Link}
											to='/cards'
										/>
									</Dropdown.Menu>
								</Dropdown>

								<Dropdown item text='Space' id='ps-menu'>
									<Dropdown.Menu>
										<Dropdown.Item
											content='Member List'
											as={Link}
											to='/members'
										/>
										<Dropdown.Item
											content='Classes'
											as={Link}
											to='/classes'
										/>
										<Dropdown.Item
											content='Storage'
											as={Link}
											to='/storage'
										/>
										<Dropdown.Item
											content='Utilities'
											as={Link}
											to='/utils'
										/>
										<Dropdown.Item
											content='Charts'
											as={Link}
											to='/charts'
										/>

										{user && isAdmin(user) && <Dropdown.Item
											content='Admin'
											as={Link}
											to='/admin'
										/>}

										{user && isAdmin(user) && <Dropdown.Item
											content='Transactions'
											as={Link}
											to='/admintrans'
										/>}
									</Dropdown.Menu>
								</Dropdown>

								<Menu.Menu position='right'>
									{!yousure && <Menu.Item
										link
										name='guide'
										href='/guide/'
									>
										Guide
									</Menu.Item>}

									{user && <Menu.Item
										content={yousure ? 'Log out?' : ''}
										onClick={logout}
										icon='sign out'
									/>}

									<Menu.Item fitted content='' />
								</Menu.Menu>
							</Container>
						</Menu>

						<div className='topPadding'>
							<Routes>
								<Route path='/' element={<Home token={token} setTokenCache={setTokenCache} user={user} refreshUser={refreshUser} />} />

								<Route path='/debug' element={<Debug token={token} user={user} />} />

								<Route path='/password/reset/confirm/:uid/:token' element={<ConfirmReset />} />
								<Route path='/password/reset' element={<PasswordReset />} />

								<Route path='/utils' element={<Paste token={token} />} />

								<Route path='/sign' element={<Sign token={token} />} />

								<Route path='/out-of-stock' element={<OutOfStock token={token} />} />

								<Route path='/charts' element={<Charts />} />

								<Route path='/auth' element={<Auth token={token} user={user} />} />

								<Route path='/subscribe' element={<Subscribe />} />

								<Route path='/classes' element={<Classes token={token} user={user} refreshUser={refreshUser} />} />

								<Route path='/add-new-tool' element={<AddNewTool token={token} />} />

								<Route path='/garden' element={<Garden />} />

								{token ?
									<Route path='/oidc' element={<AuthOIDC token={token} />} />
								:
									<Route path='*' element={<PleaseLogin />} />
								}

								{user && user.member.set_details ?
									<>
										<Route path='/storage/:id' element={<StorageDetail token={token} user={user} refreshUser={refreshUser} />} />

										<Route path='/storage' element={<Storage token={token} user={user} />} />

										<Route path='/claimshelf/:id' element={<ClaimShelf token={token} user={user} refreshUser={refreshUser} />} />
										<Route path='/claimshelf' element={<ClaimShelf token={token} user={user} refreshUser={refreshUser} />} />

										<Route path='/account' element={<Account token={token} user={user} refreshUser={refreshUser} />} />

										<Route path='/transactions/:id' element={<TransactionDetail token={token} user={user} refreshUser={refreshUser} />} />
										<Route path='/transactions' element={<Transactions user={user} />} />

										<Route path='/paymaster' element={<Paymaster token={token} user={user} refreshUser={refreshUser} />} />

										<Route path='/cards' element={<Cards token={token} user={user} />} />

										<Route path='/training' element={<Training user={user} />} />

										<Route path='/quiz/scanner' element={<ScannerQuiz token={token} user={user} refreshUser={refreshUser} />} />

										<Route path='/quiz/sawstop' element={<SawstopQuiz token={token} user={user} refreshUser={refreshUser} />} />

										<Route path='/courses/:id' element={<CourseDetail token={token} user={user} refreshUser={refreshUser} />} />

										<Route path='/courses' element={<Courses token={token} user={user} />} />

										<Route path='/classes/:id' element={<ClassDetail token={token} user={user} refreshUser={refreshUser} />} />

										<Route path='/members/:id' element={<MemberDetail token={token} user={user} setUser={setUserCache}/>} />
										<Route path='/members' element={<Members token={token} user={user} />} />

										{user && isAdmin(user) &&
											<Route path='/admin' element={<Admin token={token} user={user} />} />
										}

										{user && isAdmin(user) &&
											<Route path='/admintrans' element={<AdminTransactions token={token} user={user} />} />
										}

										<Route path='*' element={<NotFound />} />
									</>
								:
									<Route path='*' element={<PleaseLogin />} />
								}
							</Routes>
						</div>
					</>
				} />
			</Routes>

			</div>
			</div>

			<Footer />
		</div>
	)
};

export default App;
