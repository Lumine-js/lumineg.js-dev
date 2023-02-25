module.exports.ResolveColor = (args) => {
  if (!args) return;
  if ((!typeof args === "string")) console.log("Color Must Be A String")
  if (args.startsWith("#")) {
    var bbggrr = args.substr(4, 2) + args.substr(2, 2) + args.substr(0, 2);
    return parseInt(bbggrr, 16);
  }
  args = args.toLowerCase()
  if (!args.startsWith('#')) {
    args = args.toLowerCase()
    switch (args) {
      case "green":
        return 3066993
        break;
      case "blue":
        return 3447003
        break;
      case "purple":
        return 10181046
        break;
      case "orange":
        return 15105570
        break;
      case "red":
        return 15158332
        break;
      case "yellow":
        return 16776960
        break;
      case "random":
        var datawarna = [3066993, 10181046, 3447003, 15105570, 15158332, 16776960]
        return datawarna[Math.floor(Math.random() * datawarna.length)];
        break;
    }

  }
}

module.exports.ENDPOINTS = {
  MESSAGE: (channelId) => `/channels/${channelId}/messages`
}