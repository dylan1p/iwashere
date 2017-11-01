import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-client';
import { HttpLink, InMemoryCache } from 'apollo-client-preset';
import { ApolloProvider, graphql } from 'react-apollo';
import gql from 'graphql-tag';

import HELLO_QUERY from './graphql/hello-query.graphql';

const client = new ApolloClient({
	link: new HttpLink({ uri: '/api/graphql' }),
	cache: new InMemoryCache().restore({})
});

const WithLoading = WrappedComponent => ({ data }) => (
	data.loading ? <h1> ...loading</h1> : <WrappedComponent {...data}/>
);

const HelloComponent = ({ me }) => <h1> Hello {me.name} </h1>;

const App = graphql(HELLO_QUERY)(WithLoading(HelloComponent));

const ApolloApp = (
	<ApolloProvider client={client}>
      <App />
	</ApolloProvider>
);

render(ApolloApp, document.getElementById('root'));
