import React from 'react';
import PropTypes from 'prop-types';

import Cell from './Cell';
import theme from '../lib/theme';

import {
  View,
  StyleSheet,
  TextInput
} from 'react-native';

const BASE_HEIGHT = 20;
const OFFSET = theme.value(10, 4);

class CellInput extends React.Component {
  static defaultProps = {
    rows: 1
  }

  static propTypes = {
    ...TextInput.propTypes,
    rows: PropTypes.number
  }

  constructor(props) {
    super(props);

    let height = BASE_HEIGHT;

    // autorize is not yet supported in android (?)
    if (this.props.multiline) {
      height = Math.max(BASE_HEIGHT * this.props.rows, BASE_HEIGHT);
    }

    this.state = {
      height
    }
  }

  setNativeProps(props) {
    this._textInput.setNativeProps(props);
  }

  focus() {
    this._textInput.focus();
  }

  blur() {
    this._textInput.blur();
  }

  renderTextInput() {
    return (
      <TextInput
        ref={component => this._textInput = component}
        clearButtonMode="while-editing"
        selectionColor={theme.color.info}
        placeholderTextColor={this.props.placeholderTextColor || theme.color.muted}
        autoCapitalize="sentences"
        {...this.props}
        style={[ styles.textInput, { height: this.state.height + OFFSET } ]}
        onContentSizeChange={this.handleOnContentSizeChange}
        placeholder={this.props.multiline === true ? this.props.title || this.props.placeholder : this.props.placeholder}
        underlineColorAndroid="transparent"
      />
    );
  }

  render() {
    return (
      <Cell
        icon={this.props.icon}
        tintColor={this.props.tintColor}
        selectable={false}
        disclosure={this.props.disclosure}
        contentPosition="top"
        title={!this.props.multiline && this.props.title}
        style={[ this.props.editable === false && styles.inputDisabled, this.props.style ]}
      >
        {this.renderTextInput()}
      </Cell>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: theme.font.medium,
    textAlign: 'left',
    textAlignVertical: 'top',
    flex: 1,
    height: BASE_HEIGHT,
    padding: 0
  },
  inputDisabled: {
    backgroundColor: theme.color.lightest
  }
});

export default CellInput;
