import React from 'react';
import theme from '../lib/theme';
import Icon from '../lib/Icon';

import {
  View,
  TouchableHighlight,
  TouchableNativeFeedback,
  StyleSheet,
  Text,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';

export const CELL_MIN_HEIGHT = 48;
export const SELECT_MODE_NONE = 'none';
export const SELECT_MODE_CHECK = 'check';

const ICON_DEFAULT_SIZE = 24;
const TITLE_MIN_WIDTH = 98;
const CORNER_MIN_WIDTH = theme.padding;
const Touchable = theme.value(TouchableHighlight, TouchableNativeFeedback);
const ANDROID_BACKGROUND = TouchableNativeFeedback.SelectableBackground();

const positions = {
  auto: 'center',
  top: 'flex-start',
  bottom: 'flex-end',
  center: 'center'
};

class Cell extends React.Component {
  static defaultProps = {
    tintColor: theme.color.black,
    contentPosition: 'auto',
    contentOffset: theme.padding,
    selectMode: SELECT_MODE_NONE,
    selected: false,
    iconSelected: 'checkmark-circle',
    iconUnSelected: 'radio-button-off',
    disabled: false,
    subtitleWrap: true,
    titleWrap: true,
    valueWrap: true,
    selectable: true,
    onSelect: () => null
  }

  static propTypes = {
    title: PropTypes.any,
    titleWrap: PropTypes.bool,
    subtitle: PropTypes.any,
    subtitleWrap: PropTypes.bool,
    value: PropTypes.any,
    valueWrap: PropTypes.bool,
    icon: PropTypes.any,
    contentPosition: PropTypes.oneOf(Object.keys(positions)),
    disclosure: PropTypes.any,
    tintColor: PropTypes.string,
    contentOffset: PropTypes.number,
    selectMode: PropTypes.oneOf([ SELECT_MODE_NONE, SELECT_MODE_CHECK ]),
    selected: PropTypes.bool,
    iconSelected: PropTypes.string,
    iconUnSelected: PropTypes.string,
    onSelect: PropTypes.func,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    disabled: PropTypes.bool,
    selectable: PropTypes.bool
  }

  constructor(props) {
    super(props);
  }

  renderTitle() {
    if (!this.props.title) return;

    let value = null;
    switch (typeof this.props.title) {
      case 'object':
        value = this.props.title;
        break;
      case 'function':
        value = this.props.title();
        break;
      default:
        const numberOfLines = this.props.titleWrap ? 1 : null;
        value = (
          <Text
            style={[
              styles.title,
              { color: this.props.tintColor || theme.color.black }
            ]}
            ellipsizeMode="tail"
            numberOfLines={numberOfLines}
          >
            {this.props.title}
          </Text>
        );
    }

    return <View style={styles.titleContainer} >{value}</View>;
  }

  renderSubtitle() {
    if (!this.props.subtitle) return;

    switch (typeof this.props.subtitle) {
      case 'object':
        return this.props.subtitle;
        break;
      case 'function':
        return this.props.subtitle();
        break;
      default:
        const numberOfLines = this.props.subtitleWrap ? 1 : null;
        return <Text style={styles.subtitle} ellipsizeMode="tail" numberOfLines={numberOfLines} >{this.props.subtitle}</Text>;
        break;
    }
  }

  renderValue() {
    if (React.Children.count(this.props.children) > 0) {
      return this.props.children;
    }

    if (!this.props.value) return;

    switch (typeof this.props.value) {
      case 'object':
        return this.props.value;
        break;
      case 'function':
        return this.props.value();
        break;
      default:
        const numberOfLines = this.props.valueWrap ? 1 : null;
        return (
          <View style={styles.valueContainer} >
            <Text
              style={[
                styles.value,
                {
                  color: this.props.tintColor || theme.color.black,
                  opacity: 0.8
                }
              ]}
              numberOfLines={numberOfLines}
            >
              {this.props.value}
            </Text>
          </View>
        );
    }
  }

  renderIcon() {
    if (!this.props.icon) return;

    switch (typeof this.props.icon) {
      case 'function':
        const icon = this.props.icon();
        return (
          <View style={styles.iconContainer} >
            {icon}
          </View>
        );
        break;
      default:
        const iconProps = Object.assign(
          {},
          { size: ICON_DEFAULT_SIZE },
          typeof this.props.icon === 'string' ? { name: this.props.icon } : this.props.icon || {}
        );

        return (
          <Icon
            {...iconProps}
            style={[
              styles.iconContainer,
              styles.icon,
              {
                color: iconProps.color || (this.props.tintColor || theme.color.black),
                opacity: iconProps.opacity || 0.8
              }
            ]}
          />
        );
    }
  }

  renderDisclosure() {
    if (!this.props.disclosure || this.isSelecting()) return;

    switch (typeof this.props.disclosure) {
      case 'function':
        const disclosure = this.props.disclosure();
        return (
          <View style={[ styles.disclosureContainer, { paddingVertical: this.props.contentOffset } ]} >
            {disclosure}
          </View>
        );
        break;
      default:
        const iconProps = Object.assign(
          { size: ICON_DEFAULT_SIZE },
          typeof this.props.disclosure === 'string' ? { name: this.props.disclosure } : this.props.disclosure || {}
        );

        return (
          <Icon
            {...iconProps}
            style={[
              styles.disclosureContainer,
              {
                color: iconProps.color || theme.color.muted,
                paddingVertical: this.props.contentOffset,
                textAlign: 'center'
              }
            ]}
          />
        );
    }
  }

  renderSelect() {
    if (!this.isSelecting()) {
      return;
    }

    let iconProp = '';
    if (this.props.selected) {
      iconProp = this.props.iconSelected;
    } else {
      iconProp = this.props.iconUnSelected;
    }

    const iconProps = Object.assign({ size: ICON_DEFAULT_SIZE - 3 }, typeof iconProp === 'string' ? { name: iconProp } : iconProp);

    return (
      <View
        style={[
          styles.sectionContainer,
          {
            paddingVertical: this.props.contentOffset,
            justifyContent: positions[this.props.subtitle && this.props.contentPosition === 'auto' ? 'top' : this.props.contentPosition]
          }
        ]}
      >
        <Icon
          {...iconProps}
          style={{
            color: this.props.disabled ? theme.color.muted : iconProps.color || theme.color.primary,
            textAlign: 'center',
            paddingLeft: theme.padding
          }}
        />
      </View>
    );
  }

  isSelecting() {
    return this.props.selectMode && this.props.selectMode !== SELECT_MODE_NONE
  }

  isSelected() {
    return this.props.selected;
  }

  handleCellOnPress = () => {
    if (this.isSelecting()) {
      this.props.onSelect && this.props.onSelect();
    } else {
      this.props.onPress && this.props.onPress();
    }
  }

  renderComponents() {
    const isSelecting = this.isSelecting();

    return (
      <View
        style={[
          styles.container,
          this.props.selected && isSelecting ? styles.selectedContainer : null,
          this.props.disabled && { opacity: 0.8 },
          this.props.style
        ]}
      >
        {this.renderSelect()}
        <View
          style={[
            styles.sectionContainer,
            {
              paddingVertical: this.props.contentOffset,
              justifyContent: positions[this.props.subtitle && this.props.contentPosition === 'auto' ? 'top' : this.props.contentPosition]
            }
          ]}
        >
          {this.renderIcon()}
        </View>

        <View
          style={[
            styles.middleContainer,
            {
              paddingVertical: this.props.contentOffset,
              justifyContent: positions[this.props.contentPosition]
            }
          ]}
        >
          <View style={styles.titleValueContainer} >
            {this.renderTitle()}
            {this.renderValue()}
          </View>
          <View>
            {this.renderSubtitle()}
          </View>
        </View>
        <View
          style={[
            styles.sectionContainer,
            {
              justifyContent: positions[this.props.subtitle && this.props.contentPosition === 'auto' ? 'top' : this.props.contentPosition]
            }
          ]}
        >
          {this.renderDisclosure()}
        </View>
      </View>
    )
  }

  render() {
    const isSelecting = this.isSelecting();

    return (
        this.props.selectable ?
        <Touchable
          underlayColor={this.props.underlayColor || theme.color.black}
          background={theme.isAndroid ? ANDROID_BACKGROUND : null}
          onPress={this.props.onPress || isSelecting ? this.handleCellOnPress : null}
          disabled={this.props.disabled}
          onLongPress={this.props.onLongPress}
        >
          {this.renderComponents()}
        </Touchable> :
        this.renderComponents()
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.white,
    flexDirection: 'row',
    minHeight: CELL_MIN_HEIGHT
  },
  selectedContainer: {
    backgroundColor: theme.color.light
  },
  titleValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  valueContainer: {
    flex: 1
  },
  value: {
    fontSize: theme.font.small,
    textAlign: 'right'
  },
  titleContainer: {
    minWidth: TITLE_MIN_WIDTH
  },
  title: {
    fontSize: theme.font.medium,
    marginRight: theme.margin / 1.5
  },
  subtitle: {
    marginTop: theme.margin / 5,
    fontSize: theme.font.xsmall,
    color: theme.color.muted
  },
  iconContainer: {
    paddingLeft: theme.padding,
    minWidth: theme.padding * 4.5
  },
  disclosureContainer: {
    width: theme.iconWidth,
    marginHorizontal: theme.margin
  },
  icon: {
    textAlign: 'left',
  },
  sectionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: CORNER_MIN_WIDTH,
  },
  middleContainer: {
    flex: 1
  }
});

export default Cell;
