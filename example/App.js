import React, { Component } from 'react';
import Moment from 'moment';
import {
  Cell,
  CellGroup,
  CellInput,
  CellTags,
  SelectList,
  CellSheet,
  ActionItem,
  CellDatePicker,
  CellListProvider,
  CellListItem,
  CellSlider,
  CellSwitch
} from '@logvinme/react-native-cell-components';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  StatusBar
} from 'react-native';

class App extends Component {
  constructor(props) {
    super(props);

    this._usersData = require('./names.json');

    this.state = {
      users: this._usersData,
      user: null,
      version: '0.0.0',
      selectingUsers: false,
      selectedUsers: [],
      switch: false,
      date: new Date()
    };
  }

  searchUser(q) {
    if (q !== '' || this.state.selectedUsers.length === 0) {
      this.setState({
        selectingUsers: true,
        users: this._usersData.filter((user) => {
          return user.name.includes(q) || user.email.includes(q);
        })
      });
    } else {
      this.setState({
        selectingUsers: false
      });
    }
  }

  removeSelectedUser(user) {
    this.setState({
      selectedUsers: this.state.selectedUsers.filter(u => u.id !== user.id)
    });
  }

  addSelectedUser(user) {
    this.setState({
      selectedUsers: [
        ...this.state.selectedUsers,
        user
      ]
    })
  }

  handleUsersOnChangeText = (q) => {
    this.searchUser(q);
  }

  handleUsersOnRemoveTag = (index) => {
    this.removeSelectedUser(this.state.selectedUsers[index]);
  }

  handleUserItemOnPress = (user, selected) => {
    if (selected) this.addSelectedUser(user);
    else this.removeSelectedUser(user);

    this.setState({
      selectingUsers: false
    });
  }

  handleSelectedVersionOnPress = (version) => {
    this.setState({
      version
    })
  }

  renderActionSheetItems() {
    const versions = [
      '0.6.0',
      '0.5.0',
      '0.0.3',
      '0.0.2',
      '0.0.1',
      '0.0.0'
    ];

    return versions.map((version, i) => {
      return <ActionItem key={'version-' + i} icon="code" title={version} onPress={() => this.handleSelectedVersionOnPress(version)} />
    })
  }

  handleOnDateSelected = (date) => {
    this.setState({
      date
    })
  }

  handleUserSelectOnPress = (user) => {
    this.setState({
      user
    });
  }

  renderTag = (user, selected) => {
    return (
      <Text
        style={ [styles.tag, selected ? styles.tagSelected : null ]} >
        {user.name},
      </Text>
    );
  }

  handleSwitchOnValueChange = (value) => {
    this.setState({
      switch: value
    });
  }

  render() {
    return (
      <View style={styles.container} >
        <StatusBar
          barStyle="light-content"
        />
        <View style={styles.header} />
        <CellTags
          ref={component => this._tagsInput = component}
          icon="people"
          tags={this.state.selectedUsers}
          renderTag={this.renderTag}
          onChangeText={this.handleUsersOnChangeText}
          onRemoveTag={this.handleUsersOnRemoveTag}
        />
        <View style={{ flex: 1, borderTopWidth: 1, borderTopColor: '#eee' }} >
          <ScrollView>
            <CellGroup>
              <Cell title="Package" icon="information-circle-outline" value="react-native-cell-components" />
              <CellSheet title="Version" icon="code" value={this.state.version} cancelText="Close" >
                {this.renderActionSheetItems()}
              </CellSheet>
            </CellGroup>
            <CellGroup header="User info" >
              <CellInput title="Username" icon="person" placeholder="Enter username" />
              <CellDatePicker
                tintColor="#3498db"
                icon="calendar"
                title="Date"
                mode="date"
                date={this.state.date}
                value={Moment(this.state.date).format('L')}
                onDateSelected={this.handleOnDateSelected}
              />
              <CellDatePicker
                tintColor="#3498db"
                icon="time"
                title="Time"
                mode="time"
                date={this.state.date}
                value={Moment(this.state.date).format('LT')}
                onDateSelected={this.handleOnDateSelected}
              />
              <CellInput title="About" multiline autoResize rows={5} />
            </CellGroup>

            <CellGroup
              header="Slider Stuff"
              footer="Use the slider cell to slide it left to right"
            >
              <CellSlider
                icon="arrow-forward"
                disclosure="checkmark"
                minimumValue={1}
                maximumValue={10}
                step={1}
              />
              <CellSwitch
                icon="settings"
                value={this.state.switch}
                title="Toggle Switch"
                onValueChange={this.handleSwitchOnValueChange}
              />
            </CellGroup>

            <CellListProvider>
              <CellGroup>
                <CellListItem
                  listData={this._usersData}
                  listItemTitle="name"
                  listItemIcon="person"
                  listItemValidator="id"
                  listSection="country"
                  listSelected={this.state.user}
                  listItemOnPress={this.handleUserSelectOnPress}

                  icon="person"
                  title="Assign"
                  value={this.state.user ? this.state.user.name : 'None'}
                />
              </CellGroup>
            </CellListProvider>
          </ScrollView>
          <SelectList
            visible={this.state.selectingUsers || this.state.selectedUsers.length === 0}
            animated={false}
            data={this.state.users}
            selected={this.state.selectedUsers}
            icon="person"
            itemTitle="name"
            itemSubtitle="email"
            onItemPress={this.handleUserItemOnPress}
            itemValidator="id"
            section="country"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3'
  },
  header: {
    height: 40,
    backgroundColor: '#1abc9c'
  },
  tagsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tagSelected: {
    color: theme.color.white,
  },
  tag: {
    color: theme.color.info,
    fontSize: theme.font.medium
  }
});

export default App;