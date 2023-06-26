import React from 'react'
import _ from 'lodash'
import {shallowEqual} from 'recompose'

const withD3Renderer = ({
  resizeOn = ['width', 'height'],
  updateOn = ['data']
}) => WrappedComponent => {
  return class WithD3Renderer extends React.Component {
    setRef = wrappedComponentInstance => {
      this.component = wrappedComponentInstance
    }

    componentDidMount() {
      this.component.renderD3('render')
    }

    componentDidUpdate(prevProps, prevState) {
      const shouldResize = props => _.pick(props, resizeOn)
      if (!shallowEqual(shouldResize(this.props), shouldResize(prevProps))) {
        return this.component.renderD3('resize')
      }
      const shouldUpdate = props => _.pick(props, updateOn)
      if (!shallowEqual(shouldUpdate(this.props), shouldUpdate(prevProps))) {
        this.component.renderD3('update')
      }
    }

    render() {
      const {...otherProps} = this.props
      return <WrappedComponent ref={this.setRef} {...otherProps} />
    }
  }
}

export default withD3Renderer
