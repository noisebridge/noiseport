import React from 'react';
import dayjs from 'dayjs';
import { Container, Header, Image } from 'semantic-ui-react';
import { staticUrl } from './utils.js';

export function Garden(props) {
	return (
		<Container>
			<Header size='large'>Protogarden</Header>

			<Image src={staticUrl + '/garden-large.jpg?' + dayjs().unix()} />
		</Container>
	);
};
