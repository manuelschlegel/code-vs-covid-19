import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';

// You can import from local files
import { ScoringCircle } from '../components/CircleScore';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

let appJson = {
  userId: 'uausdfasdufausdufasudf',
  userScore: 1122,
  userRank: 1152,
  userTitle: 'Corona-Rookie',
  userDailyConnections: 36,
  globalRanking: [
    { userRank: 1, userName: 'DistanceKeeper', userScore: 18251 },
    { userRank: 2, userName: 'Moeper', userScore: 15851 },
    { userRank: 3, userName: 'NeverLeaveHouse', userScore: 13800 },
    { userRank: 4, userName: 'SociallyIsolatedProgrammer', userScore: 13550 },
    { userRank: 5, userName: 'RemoteDoctor', userScore: 11200 },
  ],
};

class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      dataSource: null,
    };
  }

  componentDidMount() {
    return fetch('https://reactnative.dev/movies.json')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          dataSource: appJson,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  onRefresh(){
    this.setState({
      refreshing: true
    })
    fetch('https://reactnative.dev/movies.json')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          refreshing: false,
          dataSource: appJson,
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }
    let ranking = this.state.dataSource.globalRanking.map((val, key) => {
      return (
        <Card key={key} style={styles.margin}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={styles.paragraph}>
                #{val.userRank} {val.userName}
              </Text>
            </View>
            <View>
              <Text style={styles.paragraph}>{val.userScore} pts</Text>
            </View>
          </View>
        </Card>
      );
    });
    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }>
          <ScoringCircle>{this.state.dataSource.userScore}</ScoringCircle>
          <View style={styles.mainMessage}>
            <Text style={styles.introText}>
              Congratulations, you are a{' '}
              <Text style={styles.introTextBold}>
                {this.state.dataSource.userTitle}! 
              </Text> Today you had a total of{' '}<Text style={styles.introTextBold}>{this.state.dataSource.userDailyConnections} interactions.</Text>
            </Text>
          </View>
          <View style={styles.rankingContainer}>
            <Text style={styles.rankingText}>Global Ranking:</Text>
            {ranking}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: '#6D428E',
    padding: 10,
    paddingTop: 0,
  },
  rankingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 3,
  },
  mainMessage: {
    marginTop: 20,
    marginBottom: 25,
  },
  paragraph: {
    margin: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  margin: {
    height: 45,
    justifyContent: 'center',
    marginBottom: 8,
  },
  introText: {
    color: '#fff',
    fontWeight: 'normal',
    fontSize: 25,
  },
  introTextBold: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25,
  },
});

export default MainScreen;
