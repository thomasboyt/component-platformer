const assets = {
  images: {
    playerSheet: require<string>('../assets/player_sheet.png'),
    blorpSheet: require<string>('../assets/blorp_sheet.png'),
  },
  audio: {
    shoot: require<string>('../assets/shoot.wav'),
    jump: require<string>('../assets/jump.wav'),
  },
};

export default assets;