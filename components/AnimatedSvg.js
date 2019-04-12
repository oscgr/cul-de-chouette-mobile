import React, { PureComponent } from 'react'
import { createAnimatableComponent } from 'react-native-animatable'

class AnimatedSvg extends PureComponent {
    setNativeProps = props => {
        const { component } = this.refs;
        // Need to convert these props into string to animate
        if (props.style && props.style.opacity) {
            const opacityString = props.style.opacity.toString();
            props.fillOpacity = opacityString;
            props.strokeOpacity = opacityString
        }
        component && component.root && component.root.setNativeProps(props)
    };

    render() {
        const { component: Component } = this.props;
        return <Component ref="component" {...this.props} />
    }
}

export default createAnimatableComponent(AnimatedSvg)