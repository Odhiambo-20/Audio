import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';

// Import PNG images
import playIcon from './assets/play.png';
import pauseIcon from './assets/pause.png';
import stopIcon from './assets/stop.png';
import restartIcon from './assets/restart.png';
import recordIcon from './assets/record.png';

export default function App() {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Press Record to Start!");

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setStatusMessage("Recording Started!");
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setAudioUri(uri);
      setStatusMessage("Recording Stopped!");
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const playRecording = async () => {
    try {
      if (sound) {
        await sound.playAsync();
      } else if (audioUri) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri }
        );
        setSound(newSound);
        await newSound.playAsync();
      }
    } catch (err) {
      console.error('Failed to play recording', err);
    }
  };

  const pausePlayback = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
      }
    } catch (err) {
      console.error('Failed to pause playback', err);
    }
  };

  const stopPlayback = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
    } catch (err) {
      console.error('Failed to stop playback', err);
    }
  };

  const restartPlayback = async () => {
    try {
      if (sound) {
        await sound.replayAsync();
      } else {
        await playRecording();
      }
    } catch (err) {
      console.error('Failed to restart playback', err);
    }
  };

  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>FOL_USERNAME</Text>
        <Text style={styles.title}>Lab 6 - Audio App</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusMessage}>{statusMessage}</Text>
      </View>

      {!audioUri ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={startRecording}
            disabled={recording !== null}
          >
            <Image source={recordIcon} style={styles.icon} />
            <Text style={[styles.buttonText, { color: '#D32F2F' }]}>Record</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.button}
            onPress={stopRecording}
            disabled={!recording}
          >
            <Image source={stopIcon} style={styles.icon} />
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.playbackContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={playRecording}>
              <Image source={playIcon} style={styles.icon} />
              <Text style={styles.buttonText}>Play</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={pausePlayback}>
              <Image source={pauseIcon} style={styles.icon} />
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={stopPlayback}>
              <Image source={stopIcon} style={styles.icon} />
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={restartPlayback}>
              <Image source={restartIcon} style={styles.icon} />
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  username: {
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
  },
  statusContainer: {
    backgroundColor: '#FFE5E5',
    padding: 15,
    width: 'auto',
    borderRadius: 8,
    marginTop: 150,
    marginBottom: 30,
  },
  statusMessage: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  button: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: 80,
  },
  buttonText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666666',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  playbackContainer: {
    alignItems: 'center',
  },
});
