import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'

export default class Root extends React.Component {
    render() {
        const { store, routes } = this.props
        return (
            <div>
                <Provider store={store}>
                    {routes}
                </Provider>
            </div>
        )
    }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
};
